<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Election;
use App\Models\Position;
use App\Models\Course;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ElectionController extends Controller
{
    // List all elections
    public function index()
    {
        $elections = Election::with(['course', 'positions'])->get()->map(function ($election) {
            // Format dates for display
            $election->start_date = $election->start_date ? Carbon::parse($election->start_date)->format('M d, Y') : null;
            $election->end_date = $election->end_date ? Carbon::parse($election->end_date)->format('M d, Y') : null;
            
            // Add position count
            $election->position_count = $election->positions->count();
            
            return $election;
        });
    
        return Inertia::render('Admin/elections/page', [
            'elections' => $elections,
        ]);
    }

    // Show form to create a new election
    public function create()
    {
        // Retrieve courses from the DB.
        $courses = Course::all();
        // For sections, either fetch from a table if available or use a static list.
        $sections = ['All Sections', 'Section A', 'Section B'];

        return Inertia::render('Admin/elections/create/page', [
            'courses'  => $courses,
            'sections' => $sections,
        ]);
    }

    // Store a new election
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'      => 'required|string|max:255',
            'course_id'  => 'nullable|exists:courses,id',  // Optional field
            'section'    => 'required|string',             // Make section required
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
            'is_active'  => 'boolean',
            'positions'  => 'required|array|min:1',        // Ensure at least one position
            'positions.*.name' => 'required|string|max:255',
        ]);
        
        // Start a database transaction to ensure both election and positions are created
        DB::beginTransaction();
        
        try {
            // Create the election
            $election = Election::create([
                'title'      => $validated['title'],
                'course_id'  => $validated['course_id'],
                'section'    => $validated['section'],
                'start_date' => $validated['start_date'],
                'end_date'   => $validated['end_date'],
                'is_active'  => $validated['is_active'] ?? false,
            ]);
            
            // Create positions for this election
            foreach ($validated['positions'] as $position) {
                Position::create([
                    'name'        => $position['name'],
                    'election_id' => $election->id,
                ]);
            }
            
            // Commit the transaction
            DB::commit();
            
            return redirect()->route('admin.elections.index')
                            ->with('success', 'Election created successfully with ' . count($validated['positions']) . ' positions');
        } catch (\Exception $e) {
            // If anything goes wrong, roll back the transaction
            DB::rollBack();
            
            return redirect()->back()
                            ->withInput()
                            ->with('error', 'Failed to create election: ' . $e->getMessage());
        }
    }
    
    // Show details of a single election
    public function show($id)
    {
        $election = Election::with(['course', 'positions'])->findOrFail($id);
        
        // Get positions
        $positions = $election->positions;
        
        // Get candidates with position information
        $candidates = Candidate::where('election_id', $id)
                                ->with('position')
                                ->get();
        
        // Format dates for display
        $election->start_date = $election->start_date ? Carbon::parse($election->start_date)->format('M d, Y') : null;
        $election->end_date = $election->end_date ? Carbon::parse($election->end_date)->format('M d, Y') : null;
    
        return Inertia::render('Admin/elections/[id]/page', [
            'election'   => $election,
            'positions'  => $positions,
            'candidates' => $candidates,
        ]);
    }

    // Show form to edit an existing election
    public function edit($id)
    {
        $election = Election::with('positions')->findOrFail($id);
        $courses = Course::all();
        $sections = ['All Sections', 'Section A', 'Section B'];
    
        return Inertia::render('Admin/elections/[id]/edit/page', [
            'election' => $election,
            'courses'  => $courses,
            'sections' => $sections,
        ]);
    }

    // Update an election
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            'course_id'     => 'nullable|exists:courses,id',
            'section'       => 'required|string',
            'start_date'    => 'required|date',
            'end_date'      => 'required|date|after_or_equal:start_date',
            'is_active'     => 'boolean',
            'new_positions' => 'nullable|array',
            'new_positions.*.name' => 'required|string|max:255',
        ]);

        $election = Election::findOrFail($id);
        
        // Start a transaction
        DB::beginTransaction();
        
        try {
            // Update the election
            $election->update([
                'title'      => $validated['title'],
                'course_id'  => $validated['course_id'],
                'section'    => $validated['section'],
                'start_date' => $validated['start_date'],
                'end_date'   => $validated['end_date'],
                'is_active'  => $validated['is_active'] ?? false,
            ]);
            
            // Create new positions if any
            if (!empty($validated['new_positions'])) {
                foreach ($validated['new_positions'] as $position) {
                    Position::create([
                        'name'        => $position['name'],
                        'election_id' => $election->id,
                    ]);
                }
            }
            
            DB::commit();
            
            return redirect()->route('admin.elections.index')
                             ->with('success', 'Election updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            
            return redirect()->back()
                            ->withInput()
                            ->with('error', 'Failed to update election: ' . $e->getMessage());
        }
    }

    // Delete an election
    public function destroy($id)
    {
        $election = Election::findOrFail($id);
        
        // Check if there are any votes cast in this election
        if ($election->votes()->count() > 0) {
            return redirect()->back()->with('error', 'Cannot delete an election that has votes.');
        }
        
        // Start a transaction to delete related data
        DB::beginTransaction();
        
        try {
            // Delete all positions and their candidates for this election
            foreach ($election->positions as $position) {
                // Delete candidates associated with this position
                $position->candidates()->delete();
                // Delete the position
                $position->delete();
            }
            
            // Delete the election itself
            $election->delete();
            
            DB::commit();
            
            return redirect()->route('admin.elections.index')
                            ->with('success', 'Election deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            
            return redirect()->back()
                            ->with('error', 'Failed to delete election: ' . $e->getMessage());
        }
    }
}