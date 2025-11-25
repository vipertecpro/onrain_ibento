<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Super Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'), // change in .env later
                'email_verified_at' => now(),
            ]
        );

        $admin->assignRole('admin');

        $dev = User::updateOrCreate(
            ['email' => 'dev@example.com'],
            [
                'name' => 'Developer',
                'email' => 'dev@example.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $dev->assignRole('developer');
    }
}
