<?php

namespace Database\Seeders;

use App\Models\Item;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ItemSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // ✅ Get categories with names indexed by ID
        $categories = Category::all()->keyBy('id');

        // ✅ Fixed items with known category IDs (make sure categories exist)
        $fixedItems = [
            ['name' => 'Mountain Bike', 'price' => 8500, 'category_name' => 'Bike'],
            ['name' => 'Cotton Fabric Roll', 'price' => 750, 'category_name' => 'Fabric'],
            ['name' => 'Basketball', 'price' => 450, 'category_name' => 'Sports'],
            ['name' => 'Motorcycle Tire 17"', 'price' => 1200, 'category_name' => 'Tires'],
            ['name' => 'Tricycle Shock Absorber', 'price' => 1800, 'category_name' => 'Parts'],
            ['name' => 'Uratex Foam 2x75x36"', 'price' => 2300, 'category_name' => 'Foam'],
            ['name' => 'Leather Upholstery Sheet', 'price' => 950, 'category_name' => 'Leather'],
            ['name' => 'Hammer', 'price' => 120, 'category_name' => 'Tools'],
            ['name' => 'Bike Bell', 'price' => 60, 'category_name' => 'Accessories'],
        ];

        foreach ($fixedItems as $item) {
            $category = Category::firstWhere('name', $item['category_name']);
            if ($category) {
                Item::firstOrCreate(
                    ['name' => $item['name']],
                    ['price' => $item['price'], 'category_id' => $category->id]
                );
            }
        }

        // ✅ Seed 91 random items with valid categories
        $categories = Category::all();

        foreach (range(1, 91) as $i) {
            Item::create([
                'name' => ucfirst($faker->words(rand(2, 4), true)),
                'price' => $faker->randomFloat(2, 50, 10000),
                'category_id' => $categories->random()->id,
            ]);
        }
    }
}
