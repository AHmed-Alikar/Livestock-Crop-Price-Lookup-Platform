import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_config.dart';
import 'api_exception.dart';

class ApiClient {
  String? _token;

  void setToken(String? token) {
    _token = token;
  }

  Map<String, String> _headers({bool json = true}) {
    final headers = <String, String>{};
    if (json) headers['Content-Type'] = 'application/json';
    if (_token != null) headers['Authorization'] = 'Bearer $_token';
    return headers;
  }

  Uri _uri(String path, [Map<String, String>? query]) {
    return Uri.parse('$apiBaseUrl$path').replace(queryParameters: query);
  }

  dynamic _decode(http.Response res) {
    final body = res.body.isNotEmpty ? jsonDecode(res.body) : null;
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return body;
    }
    final message = (body is Map && body['error'] != null)
        ? body['error'] as String
        : 'Request failed (${res.statusCode})';
    throw ApiException(message);
  }

  Future<dynamic> get(String path, [Map<String, String>? query]) async {
    final res = await http.get(_uri(path, query), headers: _headers());
    return _decode(res);
  }

  Future<dynamic> post(String path, Map<String, dynamic> data) async {
    final res = await http.post(_uri(path), headers: _headers(), body: jsonEncode(data));
    return _decode(res);
  }

  Future<dynamic> patch(String path, Map<String, dynamic> data) async {
    final res = await http.patch(_uri(path), headers: _headers(), body: jsonEncode(data));
    return _decode(res);
  }
}
