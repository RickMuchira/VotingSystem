<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Election;
use App\Models\Voter;
use App\Models\Vote;
use App\Models\Position;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class VotingController extends Controller
{
    public function show(Request $request, $electionId)
    {
        // Get the student ID from session
        $studentId = session('student_id');
        
        if (!$studentId) {
            return redirect()->route('student.login')
                ->with('error', 'Please login to continue.');
        }
        
        // Find the voter record
        $student = Voter::with('course')->find($studentId);
        
        if (!$student) {
            session()->forget(['student_id', 'student_email']);
            return redirect()->route('student.login')
                ->with('error', 'Student record not found. Please contact administrator.');
        }
        
        // Load the election with positions, candidates, and course
        $election = Election::with([
            'course',
            'positions' => function($query) {
                $query->orderBy('name');
            },
            'positions.candidates' => function($query) {
                $query->orderBy('name');
            }
        ])->findOrFail($electionId);
        
        // Enhance candidate data with additional information
        foreach ($election->positions as $position) {
            foreach ($position->candidates as $candidate) {
                // Add placeholder image if needed
                if (!$candidate->image_url) {
                    $candidate->image_url = '/images/placeholder-candidate.jpg';
                }
                
                // If candidate has a voter_id, load voter information
                if ($candidate->voter_id) {
                    $voter = Voter::with('course')->find($candidate->voter_id);
                    if ($voter) {
                        $candidate->student_id = $voter->admission_number;
                        $candidate->course = $voter->course ? $voter->course->name : null;
                        $candidate->year = $voter->year_of_study;
                        $candidate->section = $voter->section;
                    }
                }
            }
        }
        
        // Check if the student is eligible to vote
        $isEligible = $this->isStudentEligible($student, $election);
        
        if (!$isEligible) {
            return redirect()->route('student.dashboard')
                ->with('error', 'You are not eligible to vote in this election.');
        }
        
        // Check if election is currently active
        $now = Carbon::now();
        $startDate = Carbon::parse($election->start_date);
        $endDate = Carbon::parse($election->end_date);
        
        if ($now->lt($startDate)) {
            return redirect()->route('student.dashboard')
                ->with('error', 'This election has not started yet.');
        }
        
        if ($now->gt($endDate)) {
            return redirect()->route('student.dashboard')
                ->with('error', 'This election has already ended.');
        }
        
        // Check if the student has already voted in this election
        $hasVoted = Vote::where('voter_id', $student->id)
                     ->where('election_id', $election->id)
                     ->exists();
        
        if ($hasVoted) {
            return redirect()->route('student.dashboard')
                ->with('info', 'You have already cast your vote in this election.');
        }
        
        return Inertia::render('Student/Election/Show', [
            'election' => $election,
            'student'  => $student,
        ]);
    }
    
    public function vote(Request $request, $electionId)
    {
        // Get the student ID from session
        $studentId = session('student_id');
        
        if (!$studentId) {
            return response()->json([
                'message' => 'Please login to continue.'
            ], 401);
        }
        
        // Find the voter record
        $student = Voter::find($studentId);
        
        if (!$student) {
            return response()->json([
                'message' => 'Student record not found.'
            ], 403);
        }
        
        $election = Election::findOrFail($electionId);
        
        // Check if student is eligible
        if (!$this->isStudentEligible($student, $election)) {
            return response()->json([
                'message' => 'You are not eligible to vote in this election.'
            ], 403);
        }
        
        // Check if election is currently active
        $now = Carbon::now();
        if ($now->lt(Carbon::parse($election->start_date)) || $now->gt(Carbon::parse($election->end_date))) {
            return response()->json([
                'message' => 'This election is not currently active for voting.'
            ], 403);
        }
        
        // Check if student has already voted
        $hasVoted = Vote::where('voter_id', $student->id)
                     ->where('election_id', $election->id)
                     ->exists();
        
        if ($hasVoted) {
            return response()->json([
                'message' => 'You have already cast your vote in this election.'
            ], 403);
        }
        
        // Validate the request data
        $validated = $request->validate([
            'votes' => 'required|array',
            'votes.*.position_id' => 'required|exists:positions,id',
            'votes.*.candidate_id' => 'required|exists:candidates,id',
        ]);
        
        // Verify each position belongs to this election
        $positions = Position::whereIn('id', collect($validated['votes'])->pluck('position_id'))
                     ->where('election_id', '!=', $election->id)
                     ->get();
        
        if ($positions->isNotEmpty()) {
            return response()->json([
                'message' => 'Invalid position selected.'
            ], 400);
        }
        
        // Verify each candidate belongs to their respective position
        foreach ($validated['votes'] as $vote) {
            $candidate = Candidate::find($vote['candidate_id']);
            if ($candidate->position_id != $vote['position_id']) {
                return response()->json([
                    'message' => 'Candidate does not belong to the selected position.'
                ], 400);
            }
        }
        
        // Use a transaction to ensure all votes are recorded
        DB::beginTransaction();
        
        try {
            foreach ($validated['votes'] as $vote) {
                Vote::create([
                    'election_id' => $election->id,
                    'position_id' => $vote['position_id'],
                    'candidate_id' => $vote['candidate_id'],
                    'voter_id' => $student->id,
                ]);
            }
            
            DB::commit();
            
            return response()->json([
                'message' => 'Your vote has been recorded successfully.'
            ], 200);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'An error occurred while recording your vote. Please try again.'
            ], 500);
        }
    }
    
    /**
     * Check if a student is eligible to vote in an election
     */
    private function isStudentEligible($student, $election)
    {
        // Check if election is active
        if (!$election->is_active) {
            return false;
        }
        
        // Check course eligibility
        if ($election->course_id !== null && $election->course_id != $student->course_id) {
            return false;
        }
        
        // Check section eligibility - handle different section formats
        if ($election->section !== 'All Sections' && 
            $election->section !== 'Section ' . $student->section &&
            $election->section !== $student->section) {
            return false;
        }
        
        return true;
    }
}