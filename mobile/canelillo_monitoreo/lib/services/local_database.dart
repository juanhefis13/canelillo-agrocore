import 'dart:convert';

import 'package:path/path.dart' as path;
import 'package:sqflite/sqflite.dart';

enum PendingOperationState { pending, syncing, failed }

class PendingOperationInput {
  const PendingOperationInput({
    required this.id,
    required this.type,
    required this.payload,
    this.dependsOn,
    this.priority = 100,
  });

  final String id;
  final String type;
  final Map<String, dynamic> payload;
  final String? dependsOn;
  final int priority;
}

class PendingOperation {
  const PendingOperation({
    required this.id,
    required this.type,
    required this.payload,
    required this.attempts,
    required this.state,
    required this.priority,
    required this.createdAt,
    this.dependsOn,
    this.nextAttemptAt,
    this.lastError,
  });

  final String id;
  final String type;
  final Map<String, dynamic> payload;
  final int attempts;
  final PendingOperationState state;
  final int priority;
  final DateTime createdAt;
  final String? dependsOn;
  final DateTime? nextAttemptAt;
  final String? lastError;
}

class LocalDatabase {
  LocalDatabase._();
  static final instance = LocalDatabase._();

  static const _databaseVersion = 2;
  Database? _database;

  Future<void> initialize() async {
    if (_database != null) return;
    final root = await getDatabasesPath();
    _database = await openDatabase(
      path.join(root, 'canelillo_monitoreo.db'),
      version: _databaseVersion,
      onConfigure: (database) async {
        await database.execute('pragma foreign_keys = on');
      },
      onCreate: (database, _) => _createSchema(database),
      onUpgrade: _upgradeSchema,
    );
    await resetStuckOperations();
  }

  Future<void> _createSchema(Database database) async {
    await database.execute('''
      create table cache_entries (
        cache_key text primary key,
        payload text not null,
        updated_at text not null
      )
    ''');
    await database.execute('''
      create table pending_operations (
        id text primary key,
        operation_type text not null,
        payload text not null,
        attempts integer not null default 0,
        last_error text,
        created_at text not null,
        operation_state text not null default 'pending',
        depends_on text,
        priority integer not null default 100,
        next_attempt_at text,
        updated_at text not null
      )
    ''');
    await database.execute('''
      create index pending_operations_ready_idx
      on pending_operations (operation_state, next_attempt_at, priority, created_at)
    ''');
    await database.execute('''
      create index pending_operations_dependency_idx
      on pending_operations (depends_on)
    ''');
    await database.execute('''
      create table visit_drafts (
        id text primary key,
        field_id text not null,
        status text not null,
        payload text not null,
        created_at text not null,
        updated_at text not null
      )
    ''');
    await database.execute('''
      create index visit_drafts_updated_idx
      on visit_drafts (updated_at desc)
    ''');
  }

  Future<void> _upgradeSchema(
    Database database,
    int oldVersion,
    int newVersion,
  ) async {
    if (oldVersion < 2) {
      await _addColumnIfMissing(
        database,
        'pending_operations',
        'operation_state',
        "text not null default 'pending'",
      );
      await _addColumnIfMissing(
        database,
        'pending_operations',
        'depends_on',
        'text',
      );
      await _addColumnIfMissing(
        database,
        'pending_operations',
        'priority',
        'integer not null default 100',
      );
      await _addColumnIfMissing(
        database,
        'pending_operations',
        'next_attempt_at',
        'text',
      );
      await _addColumnIfMissing(
        database,
        'pending_operations',
        'updated_at',
        'text',
      );
      final now = DateTime.now().toIso8601String();
      await database.rawUpdate(
        'update pending_operations set updated_at = ? where updated_at is null',
        [now],
      );
      await database.execute('''
        create index if not exists pending_operations_ready_idx
        on pending_operations (operation_state, next_attempt_at, priority, created_at)
      ''');
      await database.execute('''
        create index if not exists pending_operations_dependency_idx
        on pending_operations (depends_on)
      ''');
      await database.execute('''
        create table if not exists visit_drafts (
          id text primary key,
          field_id text not null,
          status text not null,
          payload text not null,
          created_at text not null,
          updated_at text not null
        )
      ''');
      await database.execute('''
        create index if not exists visit_drafts_updated_idx
        on visit_drafts (updated_at desc)
      ''');
    }
  }

  Future<void> _addColumnIfMissing(
    Database database,
    String table,
    String column,
    String definition,
  ) async {
    final columns = await database.rawQuery('pragma table_info($table)');
    if (columns.any((item) => item['name'] == column)) return;
    await database.execute('alter table $table add column $column $definition');
  }

  Database get _db {
    final database = _database;
    if (database == null) throw StateError('Base local no inicializada');
    return database;
  }

  Future<void> writeCache(String key, List<Map<String, dynamic>> rows) async {
    await _db.insert('cache_entries', {
      'cache_key': key,
      'payload': jsonEncode(rows),
      'updated_at': DateTime.now().toIso8601String(),
    }, conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<List<Map<String, dynamic>>> readCache(String key) async {
    final rows = await _db.query(
      'cache_entries',
      where: 'cache_key = ?',
      whereArgs: [key],
      limit: 1,
    );
    if (rows.isEmpty) return [];
    try {
      final decoded = jsonDecode(rows.first['payload']! as String) as List;
      return decoded
          .map((item) => Map<String, dynamic>.from(item as Map))
          .toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> enqueue({
    required String id,
    required String type,
    required Map<String, dynamic> payload,
    String? dependsOn,
    int priority = 100,
  }) => enqueueAll([
    PendingOperationInput(
      id: id,
      type: type,
      payload: payload,
      dependsOn: dependsOn,
      priority: priority,
    ),
  ]);

  Future<void> enqueueAll(List<PendingOperationInput> operations) async {
    if (operations.isEmpty) return;
    await _db.transaction((transaction) async {
      await _insertOperations(transaction, operations);
    });
  }

  Future<void> _insertOperations(
    DatabaseExecutor executor,
    List<PendingOperationInput> operations,
  ) async {
    final now = DateTime.now().toIso8601String();
    for (final operation in operations) {
      await executor.insert('pending_operations', {
        'id': operation.id,
        'operation_type': operation.type,
        'payload': jsonEncode(operation.payload),
        'attempts': 0,
        'last_error': null,
        'created_at': now,
        'operation_state': PendingOperationState.pending.name,
        'depends_on': operation.dependsOn,
        'priority': operation.priority,
        'next_attempt_at': null,
        'updated_at': now,
      }, conflictAlgorithm: ConflictAlgorithm.replace);
    }
  }

  Future<List<PendingOperation>> pending({
    Set<String>? types,
    bool dueOnly = true,
  }) async {
    final clauses = <String>[
      "operation_state in ('pending', 'failed')",
      '''
        (depends_on is null or not exists (
          select 1 from pending_operations parent where parent.id = pending_operations.depends_on
        ))
      ''',
    ];
    final args = <Object?>[];
    if (dueOnly) {
      clauses.add('(next_attempt_at is null or next_attempt_at <= ?)');
      args.add(DateTime.now().toIso8601String());
    }
    if (types != null && types.isNotEmpty) {
      clauses.add(
        'operation_type in (${List.filled(types.length, '?').join(',')})',
      );
      args.addAll(types);
    }
    final rows = await _db.query(
      'pending_operations',
      where: clauses.join(' and '),
      whereArgs: args,
      orderBy: 'priority asc, created_at asc',
    );
    return rows.map(_pendingOperationFromRow).toList();
  }

  PendingOperation _pendingOperationFromRow(Map<String, Object?> row) {
    final stateName = row['operation_state']?.toString() ?? 'pending';
    return PendingOperation(
      id: row['id']! as String,
      type: row['operation_type']! as String,
      payload: Map<String, dynamic>.from(
        jsonDecode(row['payload']! as String) as Map,
      ),
      attempts: row['attempts']! as int,
      state: PendingOperationState.values.firstWhere(
        (item) => item.name == stateName,
        orElse: () => PendingOperationState.pending,
      ),
      priority: row['priority'] as int? ?? 100,
      createdAt:
          DateTime.tryParse(row['created_at']! as String) ?? DateTime.now(),
      dependsOn: row['depends_on'] as String?,
      nextAttemptAt: DateTime.tryParse(
        row['next_attempt_at']?.toString() ?? '',
      ),
      lastError: row['last_error'] as String?,
    );
  }

  Future<int> pendingCount({Set<String>? types}) async {
    if (types == null || types.isEmpty) {
      return Sqflite.firstIntValue(
            await _db.rawQuery('select count(*) from pending_operations'),
          ) ??
          0;
    }
    final placeholders = List.filled(types.length, '?').join(',');
    return Sqflite.firstIntValue(
          await _db.rawQuery(
            'select count(*) from pending_operations where operation_type in ($placeholders)',
            types.toList(),
          ),
        ) ??
        0;
  }

  Future<void> markSyncing(String id) async {
    await _db.update(
      'pending_operations',
      {
        'operation_state': PendingOperationState.syncing.name,
        'updated_at': DateTime.now().toIso8601String(),
      },
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<void> markSynced(String id) async {
    await _db.delete('pending_operations', where: 'id = ?', whereArgs: [id]);
  }

  Future<void> markFailed(String id, Object error) async {
    final rows = await _db.query(
      'pending_operations',
      columns: ['attempts'],
      where: 'id = ?',
      whereArgs: [id],
      limit: 1,
    );
    if (rows.isEmpty) return;
    final attempts = (rows.first['attempts'] as int? ?? 0) + 1;
    final exponent = attempts.clamp(1, 9);
    final delaySeconds = (1 << exponent).clamp(2, 900);
    final now = DateTime.now();
    await _db.update(
      'pending_operations',
      {
        'attempts': attempts,
        'last_error': '$error',
        'operation_state': PendingOperationState.failed.name,
        'next_attempt_at': now
            .add(Duration(seconds: delaySeconds))
            .toIso8601String(),
        'updated_at': now.toIso8601String(),
      },
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<void> resetStuckOperations() async {
    if (_database == null) return;
    final threshold = DateTime.now()
        .subtract(const Duration(minutes: 5))
        .toIso8601String();
    await _db.rawUpdate(
      '''
        update pending_operations
        set operation_state = 'pending', updated_at = ?
        where operation_state = 'syncing'
          and (updated_at is null or updated_at < ?)
      ''',
      [DateTime.now().toIso8601String(), threshold],
    );
  }

  Future<void> saveVisitDraft({
    required String id,
    required String fieldId,
    required String status,
    required Map<String, dynamic> payload,
  }) async {
    final now = DateTime.now().toIso8601String();
    await _db.rawInsert(
      '''
        insert into visit_drafts (id, field_id, status, payload, created_at, updated_at)
        values (?, ?, ?, ?, ?, ?)
        on conflict(id) do update set
          field_id = excluded.field_id,
          status = excluded.status,
          payload = excluded.payload,
          updated_at = excluded.updated_at
      ''',
      [id, fieldId, status, jsonEncode(payload), now, now],
    );
  }

  Future<void> saveDraftAndEnqueue({
    required String id,
    required String fieldId,
    required String status,
    required Map<String, dynamic> payload,
    required List<PendingOperationInput> operations,
    String? operationIdPrefix,
  }) async {
    final now = DateTime.now().toIso8601String();
    await _db.transaction((transaction) async {
      if (operationIdPrefix != null && operationIdPrefix.isNotEmpty) {
        await transaction.delete(
          'pending_operations',
          where: 'id like ?',
          whereArgs: ['$operationIdPrefix%'],
        );
      }
      await transaction.rawInsert(
        '''
          insert into visit_drafts (id, field_id, status, payload, created_at, updated_at)
          values (?, ?, ?, ?, ?, ?)
          on conflict(id) do update set
            field_id = excluded.field_id,
            status = excluded.status,
            payload = excluded.payload,
            updated_at = excluded.updated_at
        ''',
        [id, fieldId, status, jsonEncode(payload), now, now],
      );
      await _insertOperations(transaction, operations);
    });
  }

  Future<Map<String, dynamic>?> readVisitDraft(String id) async {
    final rows = await _db.query(
      'visit_drafts',
      columns: ['payload'],
      where: 'id = ?',
      whereArgs: [id],
      limit: 1,
    );
    if (rows.isEmpty) return null;
    try {
      return Map<String, dynamic>.from(
        jsonDecode(rows.first['payload']! as String) as Map,
      );
    } catch (_) {
      return null;
    }
  }

  Future<List<Map<String, dynamic>>> listVisitDrafts() async {
    final rows = await _db.query(
      'visit_drafts',
      columns: ['payload'],
      orderBy: 'updated_at desc',
    );
    return rows.map((row) {
      return Map<String, dynamic>.from(
        jsonDecode(row['payload']! as String) as Map,
      );
    }).toList();
  }

  Future<void> deleteVisitDraft(String id) async {
    await _db.delete('visit_drafts', where: 'id = ?', whereArgs: [id]);
  }

  Future<void> deletePendingByPrefix(String prefix) async {
    if (prefix.isEmpty) return;
    await _db.delete(
      'pending_operations',
      where: 'id like ?',
      whereArgs: ['$prefix%'],
    );
  }
}
