<?php

// app/Models/Vote.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    protected $fillable = ['voter_id', 'election_id', 'position_id', 'candidate_id'];
    
    public function voter()
    {
        return $this->belongsTo(Voter::class);
    }
    
    public function election()
    {
        return $this->belongsTo(Election::class);
    }
    
    public function position()
    {
        return $this->belongsTo(Position::class);
    }
    
    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
}
