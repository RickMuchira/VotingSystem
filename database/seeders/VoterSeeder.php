<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Voter;
use App\Models\Course;
use Faker\Factory as Faker;

class VoterSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Define a list of courses.
        $courseNames = [
            'Computer Science',
            'Business Administration',
            'Engineering',
            'Information Technology',
            'Mathematics'
        ];
        
        // Create or update courses.
        $courses = collect();
        foreach ($courseNames as $name) {
            $course = Course::firstOrCreate(['name' => $name]);
            $courses->push($course);
        }
        
        // Create 200 sample voters.
        for ($i = 1; $i <= 200; $i++) {
            // Randomly select a course.
            $course = $courses->random();
            
            Voter::create([
                'admission_number' => 'ADM' . str_pad($i, 5, '0', STR_PAD_LEFT),
                'name' => $faker->name(), // Add a name for each voter
                'email'            => 'student' . $i . '@kca.ac.ke',
                'password'         => 'secret', // Plain-text password
                'course_id'        => $course->id,
                'year_of_study'    => rand(1, 4),
                'section'          => rand(0, 1) ? 'A' : 'B',
            ]);
        }
    }
}