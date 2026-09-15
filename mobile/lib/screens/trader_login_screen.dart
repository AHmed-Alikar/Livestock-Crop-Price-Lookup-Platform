import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../api/api_exception.dart';
import '../state/auth_state.dart';
import 'trader_signup_screen.dart';
import 'trader_submit_screen.dart';

class TraderLoginScreen extends StatefulWidget {
  const TraderLoginScreen({super.key});

  @override
  State<TraderLoginScreen> createState() => _TraderLoginScreenState();
}

class _TraderLoginScreenState extends State<TraderLoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  String? _error;
  bool _submitting = false;

  Future<void> _submit() async {
    setState(() {
      _error = null;
      _submitting = true;
    });
    try {
      final auth = context.read<AuthState>();
      await auth.login(_emailController.text.trim(), _passwordController.text);
      if (auth.user?.role != 'trader') {
        setState(() => _error = 'This account is not a trader account.');
        await auth.logout();
        return;
      }
      if (!mounted) return;
      Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => const TraderSubmitScreen()));
    } catch (e) {
      setState(() => _error = e is ApiException ? e.message : 'Login failed');
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Trader Log In')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: 'Email'),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            const SizedBox(height: 16),
            if (_error != null) Text(_error!, style: const TextStyle(color: Colors.red)),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: _submitting ? null : _submit,
              child: Text(_submitting ? 'Logging in...' : 'Log In'),
            ),
            TextButton(
              onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const TraderSignupScreen())),
              child: const Text('Need an account? Sign up'),
            ),
          ],
        ),
      ),
    );
  }
}
