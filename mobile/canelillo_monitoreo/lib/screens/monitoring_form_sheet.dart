import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:uuid/uuid.dart';

import '../core/app_theme.dart';
import '../models/models.dart';
import '../services/pest_icon_service.dart';

const _stageLabels = {
  'huevos': 'Huevos',
  'ninfas_1': 'Ninfa 1',
  'ninfas_2': 'Ninfa 2',
  'ninfas_3': 'Ninfa 3',
  'adultos': 'Adultos',
  'larvas': 'Larvas',
  'pupas': 'Pupas',
};

class MonitoringFormSheet extends StatefulWidget {
  const MonitoringFormSheet({
    required this.tree,
    required this.pests,
    this.initialPest,
    super.key,
  });

  final TreeRecord tree;
  final List<PestCatalog> pests;
  final String? initialPest;

  @override
  State<MonitoringFormSheet> createState() => _MonitoringFormSheetState();
}

class _MonitoringFormSheetState extends State<MonitoringFormSheet> {
  final _foundAt = TextEditingController();
  final Map<String, double> _values = {
    for (final key in _stageLabels.keys) key: 0,
  };
  late PestCatalog _pest;
  bool _found = true;

  bool get _isChanchito => _pest.name
      .toLowerCase()
      .replaceAll(RegExp(r'[^a-záéíóúñ]'), '')
      .contains('chanchito');

  @override
  void initState() {
    super.initState();
    _pest = widget.pests.firstWhere(
      (item) => item.name == widget.initialPest,
      orElse: () => widget.pests.first,
    );
  }

  @override
  void dispose() {
    _foundAt.dispose();
    super.dispose();
  }

  void _change(String stage, double delta) {
    setState(() {
      _values[stage] = ((_values[stage] ?? 0) + delta)
          .clamp(0, _pest.maximum)
          .toDouble();
    });
  }

  void _save() {
    final visible = {
      for (final stage in _pest.stages)
        stage: _found ? (_values[stage] ?? 0) : 0.0,
    };
    final total = visible.values.fold<double>(0, (sum, value) => sum + value);
    if (_found && total <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Registra una presencia o marca No encontrada.'),
        ),
      );
      return;
    }
    if (_found && _isChanchito && _foundAt.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Indica dónde se encontró el chanchito blanco.'),
        ),
      );
      return;
    }
    Navigator.pop(
      context,
      MonitoringRecord(
        id: '',
        clientOperationId: const Uuid().v4(),
        correlative: 0,
        treeId: widget.tree.id,
        fieldId: widget.tree.fieldId,
        treeNumber: widget.tree.number,
        pest: _pest.name,
        date: DateTime.now(),
        position: widget.tree.position,
        found: _found,
        stages: {for (final key in _stageLabels.keys) key: visible[key] ?? 0},
        foundAt: _found ? _foundAt.text.trim() : 'Sin presencia',
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final pestAsset = PestIconService.assetFor(_pest.name);
    return SafeArea(
      child: Padding(
        padding: EdgeInsets.fromLTRB(
          18,
          8,
          18,
          16 + MediaQuery.viewInsetsOf(context).bottom,
        ),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.line,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    padding: const EdgeInsets.all(7),
                    decoration: BoxDecoration(
                      color: AppColors.mint,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: pestAsset == null
                        ? const Icon(Icons.bug_report_outlined)
                        : SvgPicture.asset(pestAsset),
                  ),
                  const SizedBox(width: 11),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Árbol ${widget.tree.number}',
                          style: const TextStyle(
                            fontSize: 19,
                            fontWeight: FontWeight.w900,
                            color: AppColors.navy,
                          ),
                        ),
                        const Text(
                          'Nuevo monitoreo',
                          style: TextStyle(
                            color: Color(0xFF60736C),
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<PestCatalog>(
                initialValue: _pest,
                decoration: const InputDecoration(
                  labelText: 'Tipo de plaga',
                  prefixIcon: Icon(Icons.bug_report_outlined),
                ),
                items: widget.pests
                    .map(
                      (pest) =>
                          DropdownMenuItem(value: pest, child: Text(pest.name)),
                    )
                    .toList(),
                onChanged: (value) => setState(() {
                  _pest = value ?? _pest;
                  _foundAt.clear();
                }),
              ),
              const SizedBox(height: 10),
              SwitchListTile(
                value: !_found,
                contentPadding: const EdgeInsets.symmetric(horizontal: 10),
                tileColor: !_found ? AppColors.mint : const Color(0xFFF7FAF8),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                  side: const BorderSide(color: AppColors.line),
                ),
                title: const Text(
                  'No encontrada',
                  style: TextStyle(fontWeight: FontWeight.w800),
                ),
                subtitle: const Text(
                  'Guarda el monitoreo con todos los conteos en cero.',
                ),
                onChanged: (value) => setState(() => _found = !value),
              ),
              if (_found) ...[
                const SizedBox(height: 14),
                const Text(
                  'Conteo por etapa',
                  style: TextStyle(
                    fontWeight: FontWeight.w900,
                    color: AppColors.navy,
                  ),
                ),
                const SizedBox(height: 7),
                ..._pest.stages.map(
                  (stage) => _StageCounter(
                    label: _stageLabels[stage] ?? stage,
                    value: _values[stage] ?? 0,
                    maximum: _pest.maximum,
                    onDecrease: () => _change(stage, -1),
                    onIncrease: () => _change(stage, 1),
                  ),
                ),
                const SizedBox(height: 10),
                if (_isChanchito)
                  DropdownButtonFormField<String>(
                    decoration: const InputDecoration(
                      labelText: 'Dónde se encontró',
                      prefixIcon: Icon(Icons.place_outlined),
                    ),
                    items:
                        const [
                              'Fruto',
                              'Hoja',
                              'Rama',
                              'Tronco',
                              'Cuello',
                              'Raíz',
                            ]
                            .map(
                              (value) => DropdownMenuItem(
                                value: value,
                                child: Text(value),
                              ),
                            )
                            .toList(),
                    onChanged: (value) => _foundAt.text = value ?? '',
                  )
                else
                  TextField(
                    controller: _foundAt,
                    decoration: const InputDecoration(
                      labelText: 'Encontrado en (opcional)',
                      hintText: 'Hoja, fruto, rama o tronco',
                    ),
                  ),
              ],
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: _save,
                icon: const Icon(Icons.cloud_upload_outlined),
                label: const Text('Guardar monitoreo'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _StageCounter extends StatelessWidget {
  const _StageCounter({
    required this.label,
    required this.value,
    required this.maximum,
    required this.onDecrease,
    required this.onIncrease,
  });

  final String label;
  final double value;
  final double maximum;
  final VoidCallback onDecrease;
  final VoidCallback onIncrease;

  @override
  Widget build(BuildContext context) => Container(
    margin: const EdgeInsets.only(bottom: 7),
    padding: const EdgeInsets.fromLTRB(12, 7, 7, 7),
    decoration: BoxDecoration(
      color: const Color(0xFFF7FAF8),
      borderRadius: BorderRadius.circular(8),
      border: Border.all(color: AppColors.line),
    ),
    child: Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(fontWeight: FontWeight.w800)),
              Text(
                'Máximo ${maximum.toStringAsFixed(0)}',
                style: const TextStyle(fontSize: 11, color: Color(0xFF718079)),
              ),
            ],
          ),
        ),
        IconButton.filledTonal(
          onPressed: value > 0 ? onDecrease : null,
          icon: const Icon(Icons.remove),
          visualDensity: VisualDensity.compact,
        ),
        SizedBox(
          width: 48,
          child: Text(
            value.toStringAsFixed(0),
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w900,
              color: AppColors.navy,
            ),
          ),
        ),
        IconButton.filled(
          onPressed: value < maximum ? onIncrease : null,
          icon: const Icon(Icons.add),
          visualDensity: VisualDensity.compact,
        ),
      ],
    ),
  );
}
