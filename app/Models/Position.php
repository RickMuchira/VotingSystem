<?php

// app/Models/Position.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    protected $fillable = ['name', 'election_id'];
    
    public function election()
    {
        return $this->belongsTo(Election::class);
    }
    
    public function candidates()
    {
        return $this->hasMany(Candidate::class);
    }
    
    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
}
