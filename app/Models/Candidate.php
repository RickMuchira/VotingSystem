<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'position_id',
        'election_id',
        'voter_id',
        'bio',
        'motto',
        'photo',
        'image_url',
        'manifesto',
    ];

    /**
     * The position this candidate is running for.
     */
    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    /**
     * The election this candidate is participating in.
     */
    public function election()
    {
        return $this->belongsTo(Election::class);
    }

    /**
     * The voter record associated with this candidate, if applicable.
     */
    public function voter()
    {
        return $this->belongsTo(Voter::class);
    }

    /**
     * The votes received by this candidate.
     */
    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    /**
     * Get the vote count for this candidate.
     */
    public function getVoteCountAttribute()
    {
        return $this->votes()->count();
    }
}