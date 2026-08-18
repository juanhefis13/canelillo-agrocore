import 'dart:async';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'core/app_theme.dart';
import 'screens/home_screen.dart';
import 'screens/login_screen.dart';

class CanelilloMonitoreoApp extends StatelessWidget {
  const CanelilloMonitoreoApp({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp(
    debugShowCheckedModeBanner: false,
    title: 'Canelillo Monitoreo',
    theme: buildAppTheme(),
    home: const AppGate(),
  );
}

class AppGate extends StatefulWidget {
  const AppGate({super.key});

  @override
  State<AppGate> createState() => _AppGateState();
}

class _AppGateState extends State<AppGate> {
  late Future<bool> _restore;
  StreamSubscription<AuthState>? _authSubscription;

  @override
  void initState() {
    super.initState();
    _restore = _restoreSession();
    _authSubscription = Supabase.instance.client.auth.onAuthStateChange.listen((
      _,
    ) {
      if (mounted) setState(() => _restore = _restoreSession());
    });
  }

  Future<bool> _restoreSession() async {
    final started = DateTime.now();
    final preferences = await SharedPreferences.getInstance();
    final remember = preferences.getBool('remember_session') ?? true;
    final session = Supabase.instance.client.auth.currentSession;
    if (!remember && session != null) {
      await Supabase.instance.client.auth.signOut();
    }
    final elapsed = DateTime.now().difference(started);
    if (elapsed < const Duration(milliseconds: 1100)) {
      await Future<void>.delayed(const Duration(milliseconds: 1100) - elapsed);
    }
    return remember && Supabase.instance.client.auth.currentSession != null;
  }

  @override
  void dispose() {
    _authSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => FutureBuilder<bool>(
    future: _restore,
    builder: (context, snapshot) {
      if (snapshot.connectionState != ConnectionState.done) {
        return const SplashScreen();
      }
      return snapshot.data == true ? const HomeScreen() : const LoginScreen();
    },
  );
}

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: AppColors.forestDark,
    body: SafeArea(
      child: Center(
        child: TweenAnimationBuilder<double>(
          tween: Tween(begin: .78, end: 1),
          duration: const Duration(milliseconds: 750),
          curve: Curves.easeOutBack,
          builder: (context, value, child) =>
              Transform.scale(scale: value, child: child),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 112,
                height: 112,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Image.asset('assets/branding/canelillo_icon.png'),
              ),
              const SizedBox(height: 22),
              const Text(
                'Canelillo Monitoreo',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Monitoreo georreferenciado de plagas',
                style: TextStyle(
                  color: Color(0xFFC8E8DD),
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 28),
              const SizedBox(
                width: 28,
                height: 28,
                child: CircularProgressIndicator(
                  color: AppColors.amber,
                  strokeWidth: 3,
                ),
              ),
            ],
          ),
        ),
      ),
    ),
  );
}
