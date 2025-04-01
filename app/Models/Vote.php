<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'election_id',
        'position_id',
        'candidate_id',
        'voter_id',
    ];

    /**
     * The election this vote belongs to.
     */
    public function election()
    {
        return $this->belongsTo(Election::class);
    }

    /**
     * The position this vote is for.
     */
    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    /**
     * The candidate this vote is for.
     */
    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    /**
     * The voter who cast this vote.
     */
    public function voter()
    {
        return $this->belongsTo(Voter::class);
    }
}