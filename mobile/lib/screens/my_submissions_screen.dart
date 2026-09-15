import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../api/api_client.dart';
import '../api/api_exception.dart';
import '../models/price_entry.dart';

class MySubmissionsScreen extends StatefulWidget {
  const MySubmissionsScreen({super.key});

  @override
  State<MySubmissionsScreen> createState() => _MySubmissionsScreenState();
}

class _MySubmissionsScreenState extends State<MySubmissionsScreen> {
  late Future<List<MySubmission>> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<List<MySubmission>> _load() async {
    final client = context.read<ApiClient>();
    final data = await client.get('/price-entries/mine');
    return (data as List).map((e) => MySubmission.fromJson(e as Map<String, dynamic>)).toList();
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'approved':
        return Colors.green;
      case 'rejected':
        return Colors.red;
      default:
        return Colors.orange;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Submissions')),
      body: FutureBuilder<List<MySubmission>>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            final message = snapshot.error is ApiException ? (snapshot.error as ApiException).message : 'Failed to load';
            return Center(child: Text(message));
          }
          final entries = snapshot.data!;
          if (entries.isEmpty) {
            return const Center(child: Text("You haven't submitted any prices yet."));
          }
          return ListView.separated(
            itemCount: entries.length,
            separatorBuilder: (_, _) => const Divider(height: 1),
            itemBuilder: (context, i) {
              final e = entries[i];
              return ListTile(
                title: Text('${e.itemName} — ${e.marketName}'),
                subtitle: Text('${e.price} · ${DateFormat.yMd().format(e.dateSubmitted)}'),
                trailing: Chip(
                  label: Text(e.status, style: const TextStyle(color: Colors.white)),
                  backgroundColor: _statusColor(e.status),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
