<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('voters', function (Blueprint $table) {
            $table->id();
            $table->string('admission_number')->unique();
            $table->string('email')->unique();
            $table->string('password'); // Stored as plain text per requirements
            $table->foreignId('course_id')->constrained();
            $table->integer('year_of_study');
            $table->enum('section', ['A', 'B']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('voters');
    }
};

