<?php

// app/Models/Course.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['name'];
    
    public function elections()
    {
        return $this->hasMany(Election::class);
    }
    
    public function voters()
    {
        return $this->hasMany(Voter::class);
    }
}