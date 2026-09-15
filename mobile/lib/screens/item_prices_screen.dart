import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import '../api/api_client.dart';
import '../api/api_exception.dart';
import '../models/price_entry.dart';

class ItemPricesScreen extends StatefulWidget {
  final String itemId;
  final String itemName;
  const ItemPricesScreen({super.key, required this.itemId, required this.itemName});

  @override
  State<ItemPricesScreen> createState() => _ItemPricesScreenState();
}

class _ItemPricesScreenState extends State<ItemPricesScreen> {
  late Future<List<CurrentPrice>> _pricesFuture;
  String? _selectedMarketName;
  Future<List<HistoryPoint>>? _historyFuture;

  @override
  void initState() {
    super.initState();
    _pricesFuture = _loadPrices();
  }

  Future<List<CurrentPrice>> _loadPrices() async {
    final client = context.read<ApiClient>();
    final data = await client.get('/prices', {'item': widget.itemId});
    return (data as List).map((e) => CurrentPrice.fromJson(e as Map<String, dynamic>)).toList();
  }

  void _selectMarket(String marketId, String marketName) {
    final client = context.read<ApiClient>();
    setState(() {
      _selectedMarketName = marketName;
      _historyFuture = client
          .get('/prices/history', {'item': widget.itemId, 'market': marketId})
          .then((data) => (data as List).map((e) => HistoryPoint.fromJson(e as Map<String, dynamic>)).toList());
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('${widget.itemName} Prices')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Current Approved Prices', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            FutureBuilder<List<CurrentPrice>>(
              future: _pricesFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState != ConnectionState.done) {
                  return const Padding(
                    padding: EdgeInsets.symmetric(vertical: 24),
                    child: Center(child: CircularProgressIndicator()),
                  );
                }
                if (snapshot.hasError) {
                  final message = snapshot.error is ApiException
                      ? (snapshot.error as ApiException).message
                      : 'Failed to load prices';
                  return Text(message);
                }
                final prices = snapshot.data!;
                if (prices.isEmpty) {
                  return const Text('No approved prices yet for this item.');
                }
                return Column(
                  children: prices
                      .map((p) => Card(
                            child: ListTile(
                              title: Text(p.market.name),
                              subtitle: Text('${p.market.region} — ${DateFormat.yMd().format(p.dateSubmitted)}'),
                              trailing: Text(p.price.toStringAsFixed(2), style: const TextStyle(fontWeight: FontWeight.bold)),
                              onTap: () => _selectMarket(p.market.id, p.market.name),
                            ),
                          ))
                      .toList(),
                );
              },
            ),
            if (_historyFuture != null) ...[
              const SizedBox(height: 24),
              Text('Price History — $_selectedMarketName', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              FutureBuilder<List<HistoryPoint>>(
                future: _historyFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState != ConnectionState.done) {
                    return const Padding(
                      padding: EdgeInsets.symmetric(vertical: 24),
                      child: Center(child: CircularProgressIndicator()),
                    );
                  }
                  if (snapshot.hasError) {
                    return const Text('Failed to load history');
                  }
                  final history = snapshot.data!;
                  if (history.isEmpty) {
                    return const Text('No history yet for this market.');
                  }
                  final spots = <FlSpot>[
                    for (var i = 0; i < history.length; i++) FlSpot(i.toDouble(), history[i].price),
                  ];
                  return SizedBox(
                    height: 240,
                    child: LineChart(
                      LineChartData(
                        lineBarsData: [
                          LineChartBarData(spots: spots, isCurved: true, color: Colors.green, dotData: const FlDotData(show: true)),
                        ],
                        titlesData: const FlTitlesData(
                          rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ],
          ],
        ),
      ),
    );
  }
}
