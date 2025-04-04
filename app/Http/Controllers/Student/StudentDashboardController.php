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

class StudentDashboardController extends Controller
{
    public function index(Request $request)
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
            // Clear the invalid session and redirect
            session()->forget(['student_id', 'student_email']);
            return redirect()->route('student.login')
                ->with('error', 'Student record not found. Please contact administrator.');
        }

        // Get all elections first (for debugging)
        $allElections = Election::with('course')->get();
        
        // Now get the filtered elections - REMOVE THE is_active FILTER FOR TESTING
        $elections = Election::with('course');
            
        // Comment out the is_active filter for testing (uncomment in production)
        // ->where('is_active', true);
        
        // Get all elections - we'll handle filtering on the front end for easier debugging
        $elections = $elections->get()
            ->map(function ($election) {
                // Format dates for display
                if ($election->start_date) {
                    $election->start_date_formatted = Carbon::parse($election->start_date)->format('Y-m-d H:i:s');
                }
                if ($election->end_date) {
                    $election->end_date_formatted = Carbon::parse($election->end_date)->format('Y-m-d H:i:s');
                }
                
                // Calculate status
                $now = Carbon::now();
                $startDate = Carbon::parse($election->start_date);
                $endDate = Carbon::parse($election->end_date);
                
                if ($now < $startDate) {
                    $election->status = 'Upcoming';
                } elseif ($now >= $startDate && $now <= $endDate) {
                    $election->status = 'Active';
                } else {
                    $election->status = 'Passed';
                }
                
                return $election;
            });

        return Inertia::render('Student/Dashboard', [
            'elections' => $elections,
            'student' => $student,
            'allElections' => $allElections, // For debugging
        ]);
    }
    
    public function showElection($id)
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
        ])->findOrFail($id);
        
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
        
        // Check if the student has already voted in this election
        $hasVoted = Vote::where('voter_id', $student->id)
                     ->where('election_id', $election->id)
                     ->exists();
        
        // Debug check for hasVoted
        \Log::info('Student ID ' . $student->id . ' has voted in election ' . $id . ': ' . ($hasVoted ? 'Yes' : 'No'));
        
        // Instead of redirecting when they've already voted, pass the hasVoted flag
        // to the component and let it handle the display
        return Inertia::render('Student/Election/Show', [
            'election' => $election,
            'student'  => $student,
            'hasVoted' => $hasVoted, // Send this to the component
        ]);
    }
    
    /**
     * Submit votes for an election
     */
    public function submitVote(Request $request, $id)
    {
        // Get the student ID from session with debugging
        $studentId = session('student_id');
        \Log::info('SubmitVote called for election ID: ' . $id);
        \Log::info('Session student_id: ' . $studentId);
        
        if (!$studentId) {
            return response()->json([
                'message' => 'Please login to continue.'
            ], 401);
        }
        
        // Find the voter record
        $student = Voter::find($studentId);
        \Log::info('Student found: ' . ($student ? 'Yes, ID: ' . $student->id : 'No'));
        
        if (!$student) {
            return response()->json([
                'message' => 'Student record not found.'
            ], 403);
        }
        
        $election = Election::findOrFail($id);
        \Log::info('Election found: ' . $election->title);
        
        // Check if student has already voted - THIS IS CRITICAL
        $hasVoted = Vote::where('voter_id', $student->id)
                 ->where('election_id', $election->id)
                 ->exists();
    
        \Log::info('Has student already voted? ' . ($hasVoted ? 'Yes' : 'No'));
        
        if ($hasVoted) {
            return response()->json([
                'message' => 'You have already cast your vote in this election.'
            ], 403);
        }
        
        // Debug the incoming votes data
        \Log::info('Votes data received: ' . json_encode($request->all()));
        
        // Validate the request data
        $validated = $request->validate([
            'votes' => 'required|array',
            'votes.*.position_id' => 'required|exists:positions,id',
            'votes.*.candidate_id' => 'required|exists:candidates,id',
        ]);
        
        \Log::info('Validation passed. Processing votes.');
        
        // Verify each position belongs to this election
        $positions = Position::whereIn('id', collect($validated['votes'])->pluck('position_id'))
                 ->where('election_id', '!=', $election->id)
                 ->get();
    
        if ($positions->isNotEmpty()) {
            \Log::warning('Invalid position selected.');
            return response()->json([
                'message' => 'Invalid position selected.'
            ], 400);
        }
        
        // Verify each candidate belongs to their respective position
        foreach ($validated['votes'] as $vote) {
            $candidate = Candidate::find($vote['candidate_id']);
            if ($candidate->position_id != $vote['position_id']) {
                \Log::warning('Candidate does not belong to the selected position.');
                return response()->json([
                    'message' => 'Candidate does not belong to the selected position.'
                ], 400);
            }
        }
        
        // Use a transaction to ensure all votes are recorded
        DB::beginTransaction();
        
        try {
            \Log::info('Beginning transaction to save votes.');
            
            foreach ($validated['votes'] as $vote) {
                $voteRecord = Vote::create([
                    'election_id' => $election->id,
                    'position_id' => $vote['position_id'],
                    'candidate_id' => $vote['candidate_id'],
                    'voter_id' => $student->id,
                ]);
                
                \Log::info('Vote created: ' . json_encode($voteRecord));
            }
            
            DB::commit();
            \Log::info('Transaction committed successfully. Votes saved.');
            
            return response()->json([
                'message' => 'Your vote has been recorded successfully.'
            ], 200);
            
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Exception during vote saving: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            return response()->json([
                'message' => 'An error occurred while recording your vote: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Test if a vote exists for debugging purposes
     */
    public function testVote($electionId, $studentId)
    {
        $votes = Vote::where('voter_id', $studentId)
                ->where('election_id', $electionId)
                ->get();
    
        return response()->json([
            'votes_exist' => $votes->count() > 0,
            'vote_count' => $votes->count(),
            'votes' => $votes
        ]);
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
        
        // Check course eligibility - better handling of null/empty values
        if ($election->course_id !== null && 
            $election->course_id !== '' && 
            $election->course_id !== 0 && 
            $election->course_id != $student->course_id) {
            return false;
        }
        
        // Check section eligibility - better handling of null/empty values
        if ($election->section !== null && 
            $election->section !== '' && 
            $election->section !== 'All Sections' &&
            $election->section !== 'All' &&
            $election->section !== 'Section ' . $student->section &&
            $election->section !== $student->section) {
            return false;
        }
        
        return true;
    }
}