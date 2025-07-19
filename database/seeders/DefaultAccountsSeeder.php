<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DefaultAccountsSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ Create Admin Account
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('password'), // 🔒 Default password (change in production)
                'role' => 'admin',
            ]
        );

        // ✅ Create Employee Account
        User::firstOrCreate(
            ['email' => 'employee@example.com'],
            [
                'name' => 'Default Employee',
                'password' => Hash::make('password'),
                'role' => 'employee',
            ]
        );
    }
}
