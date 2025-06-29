<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Bike',
            'Fabric',
            'Sports',
            'Tyre',
            'Tricycle Parts',
            'Foam',
            'Upholstery',
            'Tools',
            'Accessories',
        ];

        foreach ($categories as $name) {
            Category::create(['name' => $name]);
        }
    }
}
