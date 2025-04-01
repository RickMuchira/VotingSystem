<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Voter;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VoterController extends Controller
{
    /**
     * Display a listing of voters.
     */
    public function index()
    {
        // Retrieve all voters with their associated course.
        $voters = Voter::with('course')->get();

        return Inertia::render('Admin/voters/page', [
            'voters' => $voters,
        ]);
    }

    /**
     * Show the CSV import page.
     */
    public function import()
    {
        return Inertia::render('Admin/voters/import/page');
    }

    /**
     * Process the CSV import.
     */
    public function storeImport(Request $request)
    {
        $request->validate([
            'csv' => 'required|file|mimes:csv,txt'
        ]);

        $file = $request->file('csv');
        $handle = fopen($file->getRealPath(), 'r');
        $header = fgetcsv($handle, 1000, ',');

        // Expected CSV headers: admission_number, email, password, course_id, year_of_study, section
        while (($row = fgetcsv($handle, 1000, ',')) !== false) {
            $data = array_combine($header, $row);

            // Ensure all required fields exist
            if (isset($data['admission_number'], $data['email'], $data['password'], $data['course_id'], $data['year_of_study'], $data['section'])) {
                Voter::updateOrCreate(
                    ['admission_number' => $data['admission_number']],
                    [
                        'email'         => $data['email'],
                        'password'      => $data['password'], // stored as plain text per requirements
                        'course_id'     => $data['course_id'],
                        'year_of_study' => $data['year_of_study'],
                        'section'       => $data['section']
                    ]
                );
            }
        }
        fclose($handle);

        return redirect()->route('admin.voters.index')
            ->with('success', 'Voters imported successfully.');
    }

    /**
     * Show the form for editing the specified voter.
     */
    public function edit($id)
    {
        $voter = Voter::findOrFail($id);
        // Provide a list of courses in case the admin wants to update the course.
        $courses = Course::all();

        return Inertia::render('Admin/voters/[id]/edit/page', [
            'voter'   => $voter,
            'courses' => $courses,
        ]);
    }

    /**
     * Update the specified voter in storage.
     */
    public function update(Request $request, $id)
    {
        $voter = Voter::findOrFail($id);

        $validated = $request->validate([
            'admission_number' => 'required|string|unique:voters,admission_number,'.$voter->id,
            'email'            => 'required|email|unique:voters,email,'.$voter->id,
            'password'         => 'nullable|string',
            'course_id'        => 'required|exists:courses,id',
            'year_of_study'    => 'required|integer',
            'section'          => 'required|in:A,B',
        ]);

        // If password is empty, do not update it.
        if (empty($validated['password'])) {
            unset($validated['password']);
        }

        $voter->update($validated);

        return redirect()->route('admin.voters.index')
            ->with('success', 'Voter updated successfully.');
    }
}
