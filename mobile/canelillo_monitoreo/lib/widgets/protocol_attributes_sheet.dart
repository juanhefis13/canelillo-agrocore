import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';

import '../core/app_theme.dart';
import '../models/models.dart';

Future<List<AttributeObservation>?> showProtocolAttributesSheet({
  required BuildContext context,
  required String title,
  required List<ProtocolAttributeRule> rules,
  required List<MonitoringAttributeDefinition> definitions,
  required List<AttributeObservation> initial,
  String? structureSampleId,
}) => showModalBottomSheet<List<AttributeObservation>>(
  context: context,
  useSafeArea: true,
  isScrollControlled: true,
  showDragHandle: true,
  builder: (_) => _ProtocolAttributesSheet(
    title: title,
    rules: rules,
    definitions: definitions,
    initial: initial,
    structureSampleId: structureSampleId,
  ),
);

class _ProtocolAttributesSheet extends StatefulWidget {
  const _ProtocolAttributesSheet({
    required this.title,
    required this.rules,
    required this.definitions,
    required this.initial,
    required this.structureSampleId,
  });

  final String title;
  final List<ProtocolAttributeRule> rules;
  final List<MonitoringAttributeDefinition> definitions;
  final List<AttributeObservation> initial;
  final String? structureSampleId;

  @override
  State<_ProtocolAttributesSheet> createState() =>
      _ProtocolAttributesSheetState();
}

class _ProtocolAttributesSheetState extends State<_ProtocolAttributesSheet> {
  final _uuid = const Uuid();
  final _values = <String, dynamic>{};
  final _controllers = <String, TextEditingController>{};

  Map<String, MonitoringAttributeDefinition> get _definitions => {
    for (final item in widget.definitions) item.id: item,
  };

  @override
  void initState() {
    super.initState();
    for (final item in widget.initial) {
      _values[item.attributeId] = item.value;
    }
    for (final rule in widget.rules) {
      final definition = _definitions[rule.attributeId];
      if (definition == null) continue;
      if (definition.responseType == 'booleano') {
        _values.putIfAbsent(definition.id, () => false);
      }
      if (definition.responseType == 'numero' ||
          definition.responseType == 'texto') {
        _controllers[definition.id] = TextEditingController(
          text: _values[definition.id]?.toString() ?? '',
        );
      }
    }
  }

  @override
  void dispose() {
    for (final controller in _controllers.values) {
      controller.dispose();
    }
    super.dispose();
  }

  void _save() {
    for (final rule in widget.rules.where((item) => item.required)) {
      final value = _values[rule.attributeId];
      if (value == null || value is String && value.trim().isEmpty) {
        final name = _definitions[rule.attributeId]?.name ?? 'el dato';
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Completa $name.')));
        return;
      }
    }
    final existing = {
      for (final item in widget.initial) item.attributeId: item,
    };
    Navigator.pop(context, [
      for (final rule in widget.rules)
        if (_values.containsKey(rule.attributeId))
          AttributeObservation(
            id: existing[rule.attributeId]?.id ?? _uuid.v4(),
            attributeId: rule.attributeId,
            value: _values[rule.attributeId],
            structureSampleId: widget.structureSampleId,
          ),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    final rules = [...widget.rules]..sort((a, b) => a.order.compareTo(b.order));
    return Padding(
      padding: EdgeInsets.fromLTRB(
        16,
        0,
        16,
        16 + MediaQuery.viewInsetsOf(context).bottom,
      ),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              widget.title,
              style: const TextStyle(
                fontSize: 21,
                fontWeight: FontWeight.w900,
                color: AppColors.navy,
              ),
            ),
            const SizedBox(height: 12),
            for (final rule in rules)
              if (_definitions[rule.attributeId] case final definition?)
                Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: _AttributeInput(
                    definition: definition,
                    required: rule.required,
                    value: _values[definition.id],
                    controller: _controllers[definition.id],
                    onChanged: (value) => setState(() {
                      if (value == null || value is String && value.isEmpty) {
                        _values.remove(definition.id);
                      } else {
                        _values[definition.id] = value;
                      }
                    }),
                  ),
                ),
            const SizedBox(height: 6),
            FilledButton.icon(
              onPressed: _save,
              icon: const Icon(Icons.check),
              label: const Text('Guardar datos'),
            ),
          ],
        ),
      ),
    );
  }
}

class _AttributeInput extends StatelessWidget {
  const _AttributeInput({
    required this.definition,
    required this.required,
    required this.value,
    required this.controller,
    required this.onChanged,
  });

  final MonitoringAttributeDefinition definition;
  final bool required;
  final dynamic value;
  final TextEditingController? controller;
  final ValueChanged<dynamic> onChanged;

  @override
  Widget build(BuildContext context) {
    final label = required ? '${definition.name} *' : definition.name;
    if (definition.responseType == 'booleano') {
      return SwitchListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(7),
          side: const BorderSide(color: AppColors.line),
        ),
        title: Text(label, style: const TextStyle(fontWeight: FontWeight.w800)),
        value: value == true,
        onChanged: onChanged,
      );
    }
    if (definition.responseType == 'opcion') {
      return DropdownButtonFormField<String>(
        initialValue: definition.options.contains(value)
            ? value?.toString()
            : null,
        isExpanded: true,
        decoration: InputDecoration(labelText: label),
        items: [
          for (final option in definition.options)
            DropdownMenuItem(value: option, child: Text(_label(option))),
        ],
        onChanged: onChanged,
      );
    }
    return TextField(
      controller: controller,
      keyboardType: definition.responseType == 'numero'
          ? const TextInputType.numberWithOptions(decimal: true)
          : TextInputType.text,
      decoration: InputDecoration(labelText: label),
      onChanged: (text) => onChanged(
        definition.responseType == 'numero'
            ? double.tryParse(text.replaceAll(',', '.'))
            : text.trim(),
      ),
    );
  }

  String _label(String value) => value
      .split('_')
      .map(
        (word) => word.isEmpty
            ? word
            : '${word[0].toUpperCase()}${word.substring(1)}',
      )
      .join(' ');
}
