import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../api/api_exception.dart';
import '../state/auth_state.dart';
import 'trader_submit_screen.dart';

class TraderSignupScreen extends StatefulWidget {
  const TraderSignupScreen({super.key});

  @override
  State<TraderSignupScreen> createState() => _TraderSignupScreenState();
}

class _TraderSignupScreenState extends State<TraderSignupScreen> {
  final _nameController = TextEditingController();
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
      await auth.signup(_nameController.text.trim(), _emailController.text.trim(), _passwordController.text);
      if (!mounted) return;
      Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => const TraderSubmitScreen()));
    } catch (e) {
      setState(() => _error = e is ApiException ? e.message : 'Sign up failed');
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Trader Sign Up')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(controller: _nameController, decoration: const InputDecoration(labelText: 'Name')),
            const SizedBox(height: 12),
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: 'Email'),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(labelText: 'Password (min 6 chars)'),
              obscureText: true,
            ),
            const SizedBox(height: 16),
            if (_error != null) Text(_error!, style: const TextStyle(color: Colors.red)),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: _submitting ? null : _submit,
              child: Text(_submitting ? 'Signing up...' : 'Sign Up'),
            ),
          ],
        ),
      ),
    );
  }
}
