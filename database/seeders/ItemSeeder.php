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

        // Seed fixed sample items
        $fixedItems = [
            ['name' => 'Mountain Bike', 'price' => 8500, 'category_id' => 1],
            ['name' => 'Cotton Fabric Roll', 'price' => 750, 'category_id' => 2],
            ['name' => 'Basketball', 'price' => 450, 'category_id' => 3],
            ['name' => 'Motorcycle Tire 17"', 'price' => 1200, 'category_id' => 4],
            ['name' => 'Tricycle Shock Absorber', 'price' => 1800, 'category_id' => 5],
            ['name' => 'Uratex Foam 2x75x36"', 'price' => 2300, 'category_id' => 6],
            ['name' => 'Leather Upholstery Sheet', 'price' => 950, 'category_id' => 7],
            ['name' => 'Hammer', 'price' => 120, 'category_id' => 8],
            ['name' => 'Bike Bell', 'price' => 60, 'category_id' => 9],
        ];

        foreach ($fixedItems as $item) {
            Item::create($item);
        }

        // Add 91 random items with realistic names
        $categories = Category::all();

        for ($i = 0; $i < 91; $i++) {
            Item::create([
                'name' => ucfirst($faker->words(rand(2, 4), true)), // e.g. "Portable air pump"
                'price' => $faker->randomFloat(2, 50, 10000), // ₱50.00 - ₱10,000.00
                'category_id' => $categories->random()->id,
            ]);
        }
    }
}
