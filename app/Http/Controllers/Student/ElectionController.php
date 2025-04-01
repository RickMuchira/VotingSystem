<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Election;
use App\Models\Position;
use App\Models\Candidate;
use App\Models\Vote;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ElectionController extends Controller
{
    /**
     * Display the voting page for a specific election
     */
    public function show(Election $election)
    {
        $student = Auth::guard('student')->user();
        
        // Load the election with positions and candidates
        $election->load(['positions.candidates']);
        
        // Check if student has already voted
        $hasVoted = Vote::where('voter_id', $student->id)
                        ->where('election_id', $election->id)
                        ->exists();
        
        if ($hasVoted) {
            return Inertia::render('Student/Election/AlreadyVoted', [
                'election' => $election
            ]);
        }
        
        return Inertia::render('Student/Election/Show', [
            'election' => $election,
            'student' => $student
        ]);
    }
    
    /**
     * Submit votes for an election
     */
    public function submitVote(Request $request, Election $election)
    {
        $student = Auth::guard('student')->user();
        
        // Validate the request
        $request->validate([
            'votes' => 'required|array',
            'votes.*.position_id' => 'required|exists:positions,id',
            'votes.*.candidate_id' => 'required|exists:candidates,id',
        ]);
        
        // Check if student has already voted
        $hasVoted = Vote::where('voter_id', $student->id)
                        ->where('election_id', $election->id)
                        ->exists();
        
        if ($hasVoted) {
            return response()->json(['message' => 'You have already voted in this election'], 403);
        }
        
        // Begin transaction
        \DB::beginTransaction();
        
        try {
            // Create votes
            foreach ($request->votes as $vote) {
                Vote::create([
                    'election_id' => $election->id,
                    'position_id' => $vote['position_id'],
                    'candidate_id' => $vote['candidate_id'],
                    'voter_id' => $student->id,
                ]);
            }
            
            \DB::commit();
            
            return response()->json(['message' => 'Vote submitted successfully'], 200);
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json(['message' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }
}