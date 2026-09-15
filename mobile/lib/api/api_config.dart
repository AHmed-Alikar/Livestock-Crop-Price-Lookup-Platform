import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

/// Base URL for the backend REST API. The Android emulator cannot reach the
/// host machine via `localhost`, so it uses the special `10.0.2.2` alias
/// instead; every other target (web, iOS simulator, desktop) reaches the
/// locally running backend directly via localhost.
String get apiBaseUrl {
  if (!kIsWeb && Platform.isAndroid) {
    return 'http://10.0.2.2:4000/api';
  }
  return 'http://localhost:4000/api';
}
