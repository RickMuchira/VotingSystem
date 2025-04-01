<?php

namespace App\Http\Controllers\Student\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Voter;
use Inertia\Inertia;

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
            // Store the student's ID and email in the session
            session(['student_id' => $student->id]);
            session(['student_email' => $student->email]);
            
            // Regenerate the session ID for security
            $request->session()->regenerate();
            
            // Redirect to the student dashboard
            return redirect()->route('student.dashboard');
        }

        // If authentication fails, send back validation errors.
        return back()->withErrors([
            'email' => 'Invalid credentials provided.',
        ])->withInput();
    }

    public function logout(Request $request)
    {
        // Remove student data from session
        session()->forget(['student_id', 'student_email']);
        
        // Invalidate and regenerate the session
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect()->route('student.login');
    }
}