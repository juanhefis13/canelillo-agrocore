import 'dart:convert';

import 'package:path/path.dart' as path;
import 'package:sqflite/sqflite.dart';

class PendingOperation {
  const PendingOperation({
    required this.id,
    required this.type,
    required this.payload,
    required this.attempts,
  });

  final String id;
  final String type;
  final Map<String, dynamic> payload;
  final int attempts;
}

class LocalDatabase {
  LocalDatabase._();
  static final instance = LocalDatabase._();
  Database? _database;

  Future<void> initialize() async {
    if (_database != null) return;
    final root = await getDatabasesPath();
    _database = await openDatabase(
      path.join(root, 'canelillo_monitoreo.db'),
      version: 1,
      onCreate: (database, _) async {
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
            created_at text not null
          )
        ''');
      },
    );
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
  }) async {
    await _db.insert('pending_operations', {
      'id': id,
      'operation_type': type,
      'payload': jsonEncode(payload),
      'created_at': DateTime.now().toIso8601String(),
    }, conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<List<PendingOperation>> pending() async {
    final rows = await _db.query(
      'pending_operations',
      orderBy: 'created_at asc',
    );
    return rows
        .map(
          (row) => PendingOperation(
            id: row['id']! as String,
            type: row['operation_type']! as String,
            payload: Map<String, dynamic>.from(
              jsonDecode(row['payload']! as String) as Map,
            ),
            attempts: row['attempts']! as int,
          ),
        )
        .toList();
  }

  Future<int> pendingCount() async =>
      Sqflite.firstIntValue(
        await _db.rawQuery('select count(*) from pending_operations'),
      ) ??
      0;

  Future<void> markSynced(String id) async {
    await _db.delete('pending_operations', where: 'id = ?', whereArgs: [id]);
  }

  Future<void> markFailed(String id, Object error) async {
    await _db.rawUpdate(
      'update pending_operations set attempts = attempts + 1, last_error = ? where id = ?',
      ['$error', id],
    );
  }
}
