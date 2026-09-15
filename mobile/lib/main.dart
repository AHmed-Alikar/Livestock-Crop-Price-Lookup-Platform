import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'api/api_client.dart';
import 'state/auth_state.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const PriceLookupApp());
}

class PriceLookupApp extends StatelessWidget {
  const PriceLookupApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider<ApiClient>(create: (_) => ApiClient()),
        ChangeNotifierProxyProvider<ApiClient, AuthState>(
          create: (context) => AuthState(context.read<ApiClient>())..restore(),
          update: (context, client, previous) => previous ?? AuthState(client),
        ),
      ],
      child: MaterialApp(
        title: 'Livestock & Crop Price Lookup',
        theme: ThemeData(colorSchemeSeed: Colors.green, useMaterial3: true),
        home: const HomeScreen(),
      ),
    );
  }
}
