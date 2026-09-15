import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../api/api_client.dart';

class AuthUser {
  final String id;
  final String name;
  final String email;
  final String role;

  AuthUser({required this.id, required this.name, required this.email, required this.role});

  factory AuthUser.fromJson(Map<String, dynamic> json) {
    return AuthUser(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      role: json['role'] as String,
    );
  }
}

class AuthState extends ChangeNotifier {
  final ApiClient client;
  AuthUser? user;

  AuthState(this.client);

  bool get isTrader => user?.role == 'trader';

  Future<void> restore() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final name = prefs.getString('name');
    final email = prefs.getString('email');
    final id = prefs.getString('id');
    final role = prefs.getString('role');
    if (token != null && name != null && email != null && id != null && role != null) {
      client.setToken(token);
      user = AuthUser(id: id, name: name, email: email, role: role);
      notifyListeners();
    }
  }

  Future<void> _persist(String token, AuthUser u) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
    await prefs.setString('id', u.id);
    await prefs.setString('name', u.name);
    await prefs.setString('email', u.email);
    await prefs.setString('role', u.role);
  }

  Future<void> login(String email, String password) async {
    final data = await client.post('/auth/login', {'email': email, 'password': password});
    final token = data['token'] as String;
    final u = AuthUser.fromJson(data['user'] as Map<String, dynamic>);
    client.setToken(token);
    await _persist(token, u);
    user = u;
    notifyListeners();
  }

  Future<void> signup(String name, String email, String password) async {
    final data = await client.post('/auth/signup', {'name': name, 'email': email, 'password': password});
    final token = data['token'] as String;
    final u = AuthUser.fromJson(data['user'] as Map<String, dynamic>);
    client.setToken(token);
    await _persist(token, u);
    user = u;
    notifyListeners();
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    client.setToken(null);
    user = null;
    notifyListeners();
  }
}
