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
       return [
            'item_name' => fake()->words(3, true),
            'price' => fake()->randomFloat(2, 10, 1000), // Price between 10 and 1000
            'quantity' => fake()->numberBetween(1, 100), // Quantity between 1 and 100
        ];
    }
}
