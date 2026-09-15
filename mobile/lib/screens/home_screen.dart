import 'package:flutter/material.dart';
import 'item_list_screen.dart';
import 'trader_login_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Price Lookup'),
        actions: [
          TextButton(
            style: TextButton.styleFrom(foregroundColor: Colors.white),
            onPressed: () => Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const TraderLoginScreen()),
            ),
            child: const Text('Trader'),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Compare current market prices before you sell.',
              style: TextStyle(fontSize: 16, color: Colors.black54),
            ),
            const SizedBox(height: 24),
            _CategoryCard(
              title: 'Livestock',
              subtitle: 'Goats, camels, cattle, sheep',
              onTap: () => Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const ItemListScreen(category: 'Livestock')),
              ),
            ),
            const SizedBox(height: 16),
            _CategoryCard(
              title: 'Crop',
              subtitle: 'Maize, sorghum, and more',
              onTap: () => Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const ItemListScreen(category: 'Crop')),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CategoryCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _CategoryCard({required this.title, required this.subtitle, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        title: Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}
