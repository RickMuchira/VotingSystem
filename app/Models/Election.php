<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Election extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'course_id',
        'section',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
    ];

    protected $appends = ['status'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function positions()
    {
        return $this->hasMany(Position::class);
    }

    public function candidates()
    {
        return $this->hasMany(Candidate::class);
    }

    /**
     * Get the status of the election based on dates and is_active flag
     */
    public function getStatusAttribute()
    {
        $now = Carbon::now();
        
        if (!$this->is_active) {
            return 'Inactive';
        }
        
        if ($now->lt($this->start_date)) {
            return 'Upcoming';
        }
        
        if ($now->gt($this->end_date)) {
            return 'Passed';
        }
        
        return 'Active';
    }
}