<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;

class Voter extends Authenticatable
{
    protected $fillable = [
        'admission_number', 
        'name', 
        'email', 
        'password', 
        'course_id', 
        'year_of_study', 
        'section'
    ];
    
    // Remove password hashing
    protected $hidden = [];
    
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    
    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
    
    public function hasVotedFor(Position $position, Election $election)
    {
        return $this->votes()
            ->where('position_id', $position->id)
            ->where('election_id', $election->id)
            ->exists();
    }

    // Ensure compatibility with authentication
    public function getAuthPassword()
    {
        return $this->password;
    }
}