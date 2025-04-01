<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\Election;
use App\Models\Position;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CandidateController extends Controller
{
    /**
     * Display a listing of candidates.
     */
    public function index()
    {
        // Retrieve all candidates with their associated election and position.
        $candidates = Candidate::with(['election', 'position'])->get();
        
        return Inertia::render('Admin/candidates/page', [
            'candidates' => $candidates,
        ]);
    }
    
    /**
     * Show the form for creating a new candidate.
     */
    public function create()
    {
        // Retrieve elections for dropdown
        $elections = Election::all();
        
        // Retrieve all positions with their election_id for filtering in the frontend
        $positions = Position::select('id', 'name', 'election_id')->get();
        
        return Inertia::render('Admin/candidates/create/page', [
            'elections' => $elections,
            'positions' => $positions,
        ]);
    }
    
    /**
     * Store a newly created candidate in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'bio'         => 'nullable|string',
            'motto'       => 'nullable|string',
            'election_id' => 'required|exists:elections,id',
            'position_id' => 'required|exists:positions,id',
            'photo'       => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,webp',
                'max:5120', // 5MB file size limit
            ],
        ]);
        
        // Verify that the position belongs to the selected election
        $position = Position::findOrFail($validated['position_id']);
        if ($position->election_id != $validated['election_id']) {
            return back()->withErrors([
                'position_id' => 'The selected position does not belong to the selected election.'
            ])->withInput();
        }
        
        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Generate a unique filename
            $file = $request->file('photo');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('candidates', $filename, 'public');
            $validated['photo'] = 'storage/candidates/' . $filename;
        }
        
        Candidate::create($validated);
        
        return redirect()->route('admin.candidates.index')->with('success', 'Candidate created successfully.');
    }
    
    /**
     * Show the form for editing the specified candidate.
     */
    public function edit($id)
    {
        $candidate = Candidate::findOrFail($id);
        $elections = Election::all();
        
        // Get all positions with their election_id for filtering in the frontend
        $positions = Position::select('id', 'name', 'election_id')->get();
        
        // Updated path to match your file structure
        return Inertia::render('Admin/candidates/[id]/edit/page', [
            'candidate' => $candidate,
            'elections' => $elections,
            'positions' => $positions,
        ]);
    }
    
    /**
     * Update the specified candidate in storage.
     */
    public function update(Request $request, $id)
    {
        $candidate = Candidate::findOrFail($id);
        
        // Validate input fields
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'bio'         => 'nullable|string',
            'motto'       => 'nullable|string',
            'election_id' => 'required|exists:elections,id',
            'position_id' => 'required|exists:positions,id',
            'photo'       => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,webp',
                'max:5120', // 5MB file size limit
            ],
        ]);
        
        // Verify that the position belongs to the selected election
        $position = Position::findOrFail($validated['position_id']);
        if ($position->election_id != $validated['election_id']) {
            return back()->withErrors([
                'position_id' => 'The selected position does not belong to the selected election.'
            ])->withInput();
        }
        
        // Handle file uploads separately
        if ($request->hasFile('photo')) {
            // Delete old photo if exists and it's not a placeholder
            if ($candidate->photo && Storage::disk('public')->exists(str_replace('storage/candidates/', '', $candidate->photo))) {
                Storage::disk('public')->delete(str_replace('storage/candidates/', '', $candidate->photo));
            }
            
            // Generate a unique filename
            $file = $request->file('photo');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('candidates', $filename, 'public');
            $validated['photo'] = 'storage/candidates/' . $filename;
        } else {
            // Retain the existing photo if no new one is uploaded
            $validated['photo'] = $candidate->photo;
        }
        
        // Update the candidate
        $candidate->update($validated);
        
        return redirect()->route('admin.candidates.index')->with('success', 'Candidate updated successfully.');
    }
    
    /**
     * Remove the specified candidate from storage.
     */
    public function destroy($id)
    {
        $candidate = Candidate::findOrFail($id);
        
        // Delete the photo if exists
        if ($candidate->photo && Storage::disk('public')->exists(str_replace('storage/candidates/', '', $candidate->photo))) {
            Storage::disk('public')->delete(str_replace('storage/candidates/', '', $candidate->photo));
        }
        
        $candidate->delete();
        
        return redirect()->route('admin.candidates.index')->with('success', 'Candidate deleted successfully.');
    }
}