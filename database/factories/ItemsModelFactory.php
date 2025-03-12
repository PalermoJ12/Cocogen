<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ItemsModel;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ItemsModel>
 */
class ItemsModelFactory extends Factory
{
    protected $model = ItemsModel::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $productNames = [
            "Apple iPhone 15 Pro", "Samsung Galaxy S23 Ultra", "Sony WH-1000XM5 Headphones", "Dell XPS 13 Laptop",
            "Logitech MX Master 3 Mouse", "Razer BlackWidow V4 Keyboard", "Samsung 55-inch 4K Smart TV", "Bose SoundLink Revolve Speaker",
            "Google Pixel Buds Pro", "Asus ROG Strix Gaming Laptop", "HP OfficeJet Pro Printer", "Apple iPad Air (5th Gen)",
            "Amazon Kindle Paperwhite", "Garmin Fenix 7 Smartwatch", "Xiaomi Mi Electric Scooter", "Dyson V15 Detect Vacuum",
            "Nespresso Vertuo Coffee Machine", "KitchenAid Stand Mixer", "Instant Pot Duo 7-in-1 Cooker", "Philips Air Fryer",
            "Sony PlayStation 5", "Xbox Series X", "Nintendo Switch OLED", "Lego Technic Lamborghini Sián", 
            "Nike Air Force 1 Sneakers", "Adidas Ultraboost Running Shoes", "North Face Winter Jacket", "Levi's 501 Jeans",
            "Ray-Ban Aviator Sunglasses", "Casio G-Shock Watch", "Tide Laundry Detergent", "Colgate Total Toothpaste",
            "Dove Body Wash", "Gillette Fusion Razor", "Panasonic AA Batteries (20-Pack)", "Anker Power Bank 20,000mAh",
            "Seagate 2TB External Hard Drive", "Samsung 980 Pro NVMe SSD", "Corsair 16GB RAM DDR5", "Logitech C920 HD Webcam",
            "BenQ 27-inch 144Hz Gaming Monitor", "Canon EOS R6 Camera", "SanDisk 128GB MicroSD Card", "Epson EcoTank ET-3850 Printer",
            "Office Chair Ergonomic Mesh", "IKEA Malm Bed Frame", "Philips Hue Smart Light Bulbs", "Nest Learning Thermostat",
            "Arlo Pro 4 Security Camera", "Google Nest Hub Max"
        ];

        return [
            'item_name' => fake()->randomElement($productNames),
            'price' => fake()->randomFloat(2, 100, 5000), 
            'quantity' => fake()->numberBetween(5, 500), 
        ];
    }
}
