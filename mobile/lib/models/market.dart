class Market {
  final String id;
  final String name;
  final String region;

  Market({required this.id, required this.name, required this.region});

  factory Market.fromJson(Map<String, dynamic> json) {
    return Market(
      id: json['_id'] as String,
      name: json['name'] as String,
      region: json['region'] as String,
    );
  }
}
