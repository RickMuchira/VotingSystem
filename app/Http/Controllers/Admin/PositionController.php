<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Position;
use App\Models\Election;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PositionController extends Controller
{
    /**
     * Display a listing of positions.
     */
    public function index()
    {
        // Retrieve all positions with their associated election.
        $positions = Position::with('election')->get();

        // Render the index page at resources/js/Admin/positions/page.jsx.
        return Inertia::render('Admin/positions/page', [
            'positions' => $positions,
        ]);
    }

    /**
     * Show the form for creating a new position.
     */
    public function create()
    {
        // Retrieve elections for the dropdown.
        $elections = Election::all();

        // Render the create page at resources/js/Admin/positions/create/page.jsx.
        return Inertia::render('Admin/positions/create/page', [
            'elections' => $elections,
        ]);
    }

    /**
     * Store a newly created position in storage.
     */
    public function store(Request $request)
    {
        // Validate the incoming request.
        $validated = $request->validate([
            'positionName' => 'required|string|max:255',
            'electionId'   => 'required|exists:elections,id',
            'description'  => 'nullable|string',
        ]);

        // Create a new position record.
        Position::create([
            'name'        => $validated['positionName'],
            'election_id' => $validated['electionId'],
            'description' => $validated['description'] ?? null,
        ]);

        // Redirect to the positions index page.
        return redirect()->route('admin.positions.index');
    }

    /**
     * Display the specified position.
     */
    public function show($id)
    {
        // Retrieve the position with its associated election.
        $position = Position::with('election')->findOrFail($id);

        // Render the show page at resources/js/Admin/positions/[id]/page.jsx.
        return Inertia::render('Admin/positions/[id]/page', [
            'position' => $position,
        ]);
    }

    /**
     * Show the form for editing the specified position.
     */
    public function edit($id)
    {
        // Retrieve the position record.
        $position = Position::findOrFail($id);
        // Retrieve elections to populate the selection list.
        $elections = Election::all();

        // Render the edit page at resources/js/Admin/positions/[id]/edit/page.jsx.
        return Inertia::render('Admin/positions/[id]/edit/page', [
            'position'  => $position,
            'elections' => $elections,
        ]);
    }

    /**
     * Update the specified position in storage.
     */
    public function update(Request $request, $id)
    {
        // Validate the request data.
        $validated = $request->validate([
            'positionName' => 'required|string|max:255',
            'electionId'   => 'required|exists:elections,id',
            'description'  => 'nullable|string',
        ]);

        // Retrieve and update the position.
        $position = Position::findOrFail($id);
        $position->update([
            'name'        => $validated['positionName'],
            'election_id' => $validated['electionId'],
            'description' => $validated['description'] ?? null,
        ]);

        // Redirect back to the positions index.
        return redirect()->route('admin.positions.index');
    }

    /**
     * Remove the specified position from storage.
     */
    public function destroy($id)
    {
        // Retrieve and delete the position.
        $position = Position::findOrFail($id);
        $position->delete();

        // Redirect back to the positions index.
        return redirect()->route('admin.positions.index');
    }
}
