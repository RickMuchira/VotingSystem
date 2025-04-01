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
        
        // Default placeholder image
        $validated['image_url'] = '/images/placeholder-candidate.jpg';
        
        // Ensure the public/images directory exists (for placeholder images)
        if (!file_exists(public_path('images'))) {
            mkdir(public_path('images'), 0755, true);
        }
        
        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Generate a unique filename
            $file = $request->file('photo');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('candidates', $filename, 'public');
            $validated['image_url'] = '/storage/candidates/' . $filename;
        }
        
        // Copy data from 'photo' field to 'image_url' for backward compatibility if necessary
        $validated['photo'] = $validated['image_url'];
        
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
            $oldPath = str_replace('/storage/', '', $candidate->image_url ?: $candidate->photo);
            if ($oldPath && $oldPath !== 'images/placeholder-candidate.jpg' && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
            
            // Generate a unique filename
            $file = $request->file('photo');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('candidates', $filename, 'public');
            $validated['image_url'] = '/storage/candidates/' . $filename;
            $validated['photo'] = $validated['image_url']; // For backward compatibility
        } else {
            // Retain the existing photo if no new one is uploaded
            $validated['image_url'] = $candidate->image_url ?: $candidate->photo;
            $validated['photo'] = $validated['image_url']; // For backward compatibility
            
            // If no image exists, set a default placeholder
            if (empty($validated['image_url'])) {
                $validated['image_url'] = '/images/placeholder-candidate.jpg';
                $validated['photo'] = $validated['image_url'];
            }
            
            // Fix path formatting (ensure leading slash)
            if (strpos($validated['image_url'], '/') !== 0) {
                $validated['image_url'] = '/' . $validated['image_url'];
                $validated['photo'] = $validated['image_url'];
            }
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
        
        // Delete the photo if exists and it's not a placeholder
        $photoPath = str_replace('/storage/', '', $candidate->image_url ?: $candidate->photo);
        if ($photoPath && $photoPath !== 'images/placeholder-candidate.jpg' && Storage::disk('public')->exists($photoPath)) {
            Storage::disk('public')->delete($photoPath);
        }
        
        $candidate->delete();
        
        return redirect()->route('admin.candidates.index')->with('success', 'Candidate deleted successfully.');
    }
}