import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../api/api_client.dart';
import '../api/api_exception.dart';
import '../models/item.dart';
import 'item_prices_screen.dart';

class ItemListScreen extends StatefulWidget {
  final String category;
  const ItemListScreen({super.key, required this.category});

  @override
  State<ItemListScreen> createState() => _ItemListScreenState();
}

class _ItemListScreenState extends State<ItemListScreen> {
  late Future<List<Item>> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<List<Item>> _load() async {
    final client = context.read<ApiClient>();
    final data = await client.get('/items', {'category': widget.category});
    return (data as List).map((e) => Item.fromJson(e as Map<String, dynamic>)).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('${widget.category} Items')),
      body: FutureBuilder<List<Item>>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            final message = snapshot.error is ApiException
                ? (snapshot.error as ApiException).message
                : 'Failed to load items';
            return Center(child: Text(message));
          }
          final items = snapshot.data!;
          if (items.isEmpty) {
            return const Center(child: Text('No items in this category yet.'));
          }
          return ListView.separated(
            itemCount: items.length,
            separatorBuilder: (_, _) => const Divider(height: 1),
            itemBuilder: (context, i) {
              final item = items[i];
              return ListTile(
                title: Text(item.name),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => ItemPricesScreen(itemId: item.id, itemName: item.name)),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
