class Item {
  final String id;
  final String name;
  final String category;

  Item({required this.id, required this.name, required this.category});

  factory Item.fromJson(Map<String, dynamic> json) {
    return Item(
      id: json['_id'] as String,
      name: json['name'] as String,
      category: json['category'] as String,
    );
  }
}
