<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Election;
use App\Models\Candidate;
use App\Models\Vote;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

class VotingController extends Controller
{
    public function show($electionId)
    {
        // Fetch election details
        $election = Election::with('course')->findOrFail($electionId);

        // Fetch candidates for the election
        $candidates = Candidate::where('election_id', $electionId)->get();

        return Inertia::render('Student/Vote', [
            'election' => $election,
            'candidates' => $candidates,
        ]);
    }

    public function vote(Request $request, $electionId)
    {
        // Ensure user is logged in
        $student = Auth::user();
        if (!$student) {
            return redirect()->route('student.login')->with('error', 'Please log in to vote.');
        }

        // Validate the vote request
        $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'position_id' => 'required|exists:positions,id', // Ensure position_id is provided
        ]);

        // Check which column exists for the voter ID
        $studentColumn = Schema::hasColumn('votes', 'student_id') ? 'student_id' : 'voter_id';

        // Check if the student has already voted for this position in the election
        if (Vote::where('election_id', $electionId)
                ->where('position_id', $request->position_id)
                ->where($studentColumn, $student->id)
                ->exists()) {
            return redirect()->back()->with('error', 'You have already voted for this position.');
        }

        // Store the vote
        Vote::create([
            'election_id' => $electionId,
            'candidate_id' => $request->candidate_id,
            'position_id' => $request->position_id,
            $studentColumn => $student->id,
        ]);

        return redirect()->route('student.dashboard')->with('success', 'Your vote has been cast successfully.');
    }
}
