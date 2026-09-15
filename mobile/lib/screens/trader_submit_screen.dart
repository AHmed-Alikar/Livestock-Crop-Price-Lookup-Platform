import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../api/api_client.dart';
import '../api/api_exception.dart';
import '../models/item.dart';
import '../models/market.dart';
import '../state/auth_state.dart';
import 'my_submissions_screen.dart';
import 'home_screen.dart';

class TraderSubmitScreen extends StatefulWidget {
  const TraderSubmitScreen({super.key});

  @override
  State<TraderSubmitScreen> createState() => _TraderSubmitScreenState();
}

class _TraderSubmitScreenState extends State<TraderSubmitScreen> {
  late Future<(List<Item>, List<Market>)> _optionsFuture;
  final _priceController = TextEditingController();
  String? _itemId;
  String? _marketId;
  String? _error;
  String? _success;
  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    _optionsFuture = _loadOptions();
  }

  Future<(List<Item>, List<Market>)> _loadOptions() async {
    final client = context.read<ApiClient>();
    final itemsData = await client.get('/items');
    final marketsData = await client.get('/markets');
    final items = (itemsData as List).map((e) => Item.fromJson(e as Map<String, dynamic>)).toList();
    final markets = (marketsData as List).map((e) => Market.fromJson(e as Map<String, dynamic>)).toList();
    return (items, markets);
  }

  Future<void> _submit() async {
    if (_itemId == null || _marketId == null || _priceController.text.isEmpty) {
      setState(() => _error = 'Please fill in all fields.');
      return;
    }
    final price = double.tryParse(_priceController.text);
    if (price == null || price < 0) {
      setState(() => _error = 'Price must be a non-negative number.');
      return;
    }
    setState(() {
      _error = null;
      _success = null;
      _submitting = true;
    });
    try {
      final client = context.read<ApiClient>();
      await client.post('/price-entries', {'item': _itemId, 'market': _marketId, 'price': price});
      setState(() {
        _success = 'Submitted! Your entry is pending admin approval.';
        _priceController.clear();
        _itemId = null;
        _marketId = null;
      });
    } catch (e) {
      setState(() => _error = e is ApiException ? e.message : 'Submission failed');
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthState>();
    return Scaffold(
      appBar: AppBar(
        title: const Text('Submit New Price'),
        actions: [
          IconButton(
            icon: const Icon(Icons.list_alt),
            tooltip: 'My Submissions',
            onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const MySubmissionsScreen())),
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Log out',
            onPressed: () async {
              await auth.logout();
              if (!context.mounted) return;
              Navigator.of(context).pushAndRemoveUntil(MaterialPageRoute(builder: (_) => const HomeScreen()), (route) => false);
            },
          ),
        ],
      ),
      body: FutureBuilder<(List<Item>, List<Market>)>(
        future: _optionsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return const Center(child: Text('Failed to load items/markets'));
          }
          final (items, markets) = snapshot.data!;
          return Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('Logged in as ${auth.user?.name}', style: const TextStyle(color: Colors.black54)),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  initialValue: _itemId,
                  decoration: const InputDecoration(labelText: 'Item'),
                  items: items.map((i) => DropdownMenuItem(value: i.id, child: Text('${i.name} (${i.category})'))).toList(),
                  onChanged: (v) => setState(() => _itemId = v),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  initialValue: _marketId,
                  decoration: const InputDecoration(labelText: 'Market'),
                  items: markets.map((m) => DropdownMenuItem(value: m.id, child: Text('${m.name} (${m.region})'))).toList(),
                  onChanged: (v) => setState(() => _marketId = v),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _priceController,
                  decoration: const InputDecoration(labelText: 'Price'),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                ),
                const SizedBox(height: 16),
                if (_error != null) Text(_error!, style: const TextStyle(color: Colors.red)),
                if (_success != null) Text(_success!, style: const TextStyle(color: Colors.green)),
                const SizedBox(height: 8),
                ElevatedButton(
                  onPressed: _submitting ? null : _submit,
                  child: Text(_submitting ? 'Submitting...' : 'Submit'),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
