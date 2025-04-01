<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call other seeders here
        $this->call([
            AdminSeeder::class,
            VoterSeeder::class,
            // You can also call CandidateSeeder::class if you want to seed candidates.
        ]);

        // Example user creation
        User::factory()->create([
            'name'  => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
