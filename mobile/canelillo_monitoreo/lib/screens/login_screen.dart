import 'dart:async';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../core/app_config.dart';
import '../core/app_theme.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _remember = true;
  bool _loading = false;
  bool _obscure = true;
  String? _error;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      await Supabase.instance.client.auth
          .signInWithPassword(
            email: _email.text.trim(),
            password: _password.text,
          )
          .timeout(AppConfig.networkTimeout);
      final preferences = await SharedPreferences.getInstance();
      await preferences.setBool('remember_session', _remember);
    } on TimeoutException {
      setState(
        () => _error =
            'La conexión está demorando. Revisa la señal e intenta nuevamente.',
      );
    } on AuthException catch (error) {
      setState(() => _error = error.message);
    } catch (_) {
      setState(
        () => _error =
            'No se pudo iniciar sesión. Verifica internet o datos móviles.',
      );
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _recover() async {
    final email = _email.text.trim();
    if (!email.contains('@')) {
      setState(
        () => _error = 'Ingresa tu correo para recuperar la contraseña.',
      );
      return;
    }
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      await Supabase.instance.client.auth.resetPasswordForEmail(email);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Enviamos las instrucciones de recuperación al correo.',
          ),
        ),
      );
    } catch (_) {
      setState(() => _error = 'No fue posible enviar la recuperación.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Stack(
      children: [
        const Positioned.fill(child: _LoginBackground()),
        SafeArea(
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
                                      'Canelillo Monitoreo',
                                      style: TextStyle(
                                        fontSize: 21,
                                        fontWeight: FontWeight.w900,
                                        color: AppColors.navy,
                                      ),
                                    ),
                                    Text(
                                      'Ingreso de monitoreo en terreno',
                                      style: TextStyle(
                                        color: Color(0xFF60736C),
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),
                          TextFormField(
                            controller: _email,
                            enabled: !_loading,
                            keyboardType: TextInputType.emailAddress,
                            autofillHints: const [AutofillHints.email],
                            decoration: const InputDecoration(
                              labelText: 'Correo electrónico',
                              prefixIcon: Icon(Icons.mail_outline),
                            ),
                            validator: (value) =>
                                value == null || !value.contains('@')
                                ? 'Ingresa un correo válido'
                                : null,
                          ),
                          const SizedBox(height: 12),
                          TextFormField(
                            controller: _password,
                            enabled: !_loading,
                            obscureText: _obscure,
                            autofillHints: const [AutofillHints.password],
                            onFieldSubmitted: (_) => _login(),
                            decoration: InputDecoration(
                              labelText: 'Contraseña',
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
                            validator: (value) =>
                                value == null || value.length < 6
                                ? 'Ingresa tu contraseña'
                                : null,
                          ),
                          CheckboxListTile(
                            value: _remember,
                            dense: true,
                            contentPadding: EdgeInsets.zero,
                            controlAffinity: ListTileControlAffinity.leading,
                            title: const Text(
                              'Guardar sesión',
                              style: TextStyle(fontWeight: FontWeight.w700),
                            ),
                            onChanged: _loading
                                ? null
                                : (value) =>
                                      setState(() => _remember = value ?? true),
                          ),
                          if (_error != null)
                            Container(
                              margin: const EdgeInsets.only(bottom: 12),
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
                          FilledButton.icon(
                            onPressed: _loading ? null : _login,
                            icon: _loading
                                ? const SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      color: Colors.white,
                                    ),
                                  )
                                : const Icon(Icons.login),
                            label: Text(
                              _loading ? 'Ingresando...' : 'Iniciar sesión',
                            ),
                          ),
                          TextButton(
                            onPressed: _loading ? null : _recover,
                            child: const Text('Recuperar contraseña'),
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
      ],
    ),
  );
}

class _LoginBackground extends StatelessWidget {
  const _LoginBackground();

  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: const BoxDecoration(
      gradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [AppColors.forestDark, AppColors.forest, Color(0xFFDDEDE6)],
        stops: [0, .56, 1],
      ),
    ),
  );
}
