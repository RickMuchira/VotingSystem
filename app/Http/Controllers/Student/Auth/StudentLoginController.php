<?php

namespace App\Http\Controllers\Student\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Voter; // Assuming student records are stored as Voter

class StudentLoginController extends Controller
{
    public function login(Request $request)
    {
        // Validate the incoming request data.
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        // Find the student record with matching credentials.
        // Note: This example uses plain-text password matching per your requirement.
        $student = Voter::where('email', $data['email'])
                        ->where('password', $data['password'])
                        ->first();

        if ($student) {
            // Here you can store session data or login the student as required.
            // For now, we simply redirect to the student dashboard.
            return redirect()->route('student.dashboard');
        }

        // If authentication fails, send back validation errors.
        return back()->withErrors([
            'email' => 'Invalid credentials provided.',
        ])->withInput();
    }
}
