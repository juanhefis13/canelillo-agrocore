import 'dart:async';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../core/app_config.dart';
import '../core/app_theme.dart';

class PasswordRecoveryScreen extends StatefulWidget {
  const PasswordRecoveryScreen({required this.onComplete, super.key});

  final VoidCallback onComplete;

  @override
  State<PasswordRecoveryScreen> createState() => _PasswordRecoveryScreenState();
}

class _PasswordRecoveryScreenState extends State<PasswordRecoveryScreen> {
  final _formKey = GlobalKey<FormState>();
  final _password = TextEditingController();
  final _confirmation = TextEditingController();
  bool _loading = false;
  bool _obscure = true;
  String? _error;

  @override
  void dispose() {
    _password.dispose();
    _confirmation.dispose();
    super.dispose();
  }

  Future<void> _updatePassword() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final preferences = await SharedPreferences.getInstance();
      await preferences.setBool('remember_session', true);
      await Supabase.instance.client.auth
          .updateUser(UserAttributes(password: _password.text))
          .timeout(AppConfig.networkTimeout);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Contraseña actualizada correctamente.')),
      );
      widget.onComplete();
    } on TimeoutException {
      setState(
        () => _error = 'La conexión está demorando. Intenta nuevamente.',
      );
    } on AuthException catch (error) {
      setState(() => _error = error.message);
    } catch (_) {
      setState(() => _error = 'No fue posible actualizar la contraseña.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: const Color(0xFFEAF3EF),
    body: SafeArea(
      child: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 440),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 26, 24, 22),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        children: [
                          Image.asset(
                            'assets/branding/canelillo_icon.png',
                            width: 52,
                            height: 52,
                          ),
                          const SizedBox(width: 13),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Nueva contraseña',
                                  style: TextStyle(
                                    fontSize: 21,
                                    fontWeight: FontWeight.w900,
                                    color: AppColors.navy,
                                  ),
                                ),
                                Text('Canelillo Monitoreo'),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      TextFormField(
                        controller: _password,
                        enabled: !_loading,
                        obscureText: _obscure,
                        autofillHints: const [AutofillHints.newPassword],
                        decoration: InputDecoration(
                          labelText: 'Nueva contraseña',
                          prefixIcon: const Icon(Icons.lock_outline),
                          suffixIcon: IconButton(
                            onPressed: () =>
                                setState(() => _obscure = !_obscure),
                            icon: Icon(
                              _obscure
                                  ? Icons.visibility_outlined
                                  : Icons.visibility_off_outlined,
                            ),
                          ),
                        ),
                        validator: (value) => value == null || value.length < 8
                            ? 'Usa al menos 8 caracteres'
                            : null,
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _confirmation,
                        enabled: !_loading,
                        obscureText: _obscure,
                        autofillHints: const [AutofillHints.newPassword],
                        onFieldSubmitted: (_) => _updatePassword(),
                        decoration: const InputDecoration(
                          labelText: 'Confirmar contraseña',
                          prefixIcon: Icon(Icons.verified_user_outlined),
                        ),
                        validator: (value) => value != _password.text
                            ? 'Las contraseñas no coinciden'
                            : null,
                      ),
                      if (_error != null) ...[
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFECE8),
                            borderRadius: BorderRadius.circular(7),
                          ),
                          child: Text(
                            _error!,
                            style: const TextStyle(
                              color: AppColors.danger,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                      const SizedBox(height: 18),
                      FilledButton.icon(
                        onPressed: _loading ? null : _updatePassword,
                        icon: _loading
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2,
                                ),
                              )
                            : const Icon(Icons.password),
                        label: Text(
                          _loading ? 'Actualizando...' : 'Guardar contraseña',
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
