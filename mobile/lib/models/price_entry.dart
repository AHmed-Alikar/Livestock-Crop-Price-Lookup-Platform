import 'market.dart';

class CurrentPrice {
  final String id;
  final Market market;
  final double price;
  final DateTime dateSubmitted;

  CurrentPrice({
    required this.id,
    required this.market,
    required this.price,
    required this.dateSubmitted,
  });

  factory CurrentPrice.fromJson(Map<String, dynamic> json) {
    return CurrentPrice(
      id: json['_id'] as String,
      market: Market.fromJson(json['market'] as Map<String, dynamic>),
      price: (json['price'] as num).toDouble(),
      dateSubmitted: DateTime.parse(json['dateSubmitted'] as String),
    );
  }
}

class HistoryPoint {
  final double price;
  final DateTime dateSubmitted;

  HistoryPoint({required this.price, required this.dateSubmitted});

  factory HistoryPoint.fromJson(Map<String, dynamic> json) {
    return HistoryPoint(
      price: (json['price'] as num).toDouble(),
      dateSubmitted: DateTime.parse(json['dateSubmitted'] as String),
    );
  }
}

class MySubmission {
  final String id;
  final String itemName;
  final String marketName;
  final double price;
  final String status;
  final DateTime dateSubmitted;

  MySubmission({
    required this.id,
    required this.itemName,
    required this.marketName,
    required this.price,
    required this.status,
    required this.dateSubmitted,
  });

  factory MySubmission.fromJson(Map<String, dynamic> json) {
    return MySubmission(
      id: json['_id'] as String,
      itemName: (json['item'] as Map<String, dynamic>)['name'] as String,
      marketName: (json['market'] as Map<String, dynamic>)['name'] as String,
      price: (json['price'] as num).toDouble(),
      status: json['status'] as String,
      dateSubmitted: DateTime.parse(json['dateSubmitted'] as String),
    );
  }
}
