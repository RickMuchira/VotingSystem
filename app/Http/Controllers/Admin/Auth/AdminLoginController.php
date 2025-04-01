<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminLoginController extends Controller
{
    /**
     * (Optional) Show the admin login form.
     * If using a closure in your route, you might not need this.
     */
    public function showLoginForm()
    {
        return Inertia::render('Admin/Auth/AdminLogin');
    }

    /**
     * Handle admin login.
     */
    public function login(Request $request)
    {
        // Validate credentials
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|min:8',
        ]);

        // Attempt login
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            // Check if the authenticated user is an admin
            if (Auth::user()->role === 'admin') {
                return redirect()->intended('/admin/dashboard');
            }

            // If not an admin, force logout and redirect with an error message
            Auth::logout();
            return back()->withErrors([
                'email' => 'You do not have admin privileges.',
            ]);
        }

        // Return error if login failed
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    /**
     * Handle admin logout.
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/admin/login');
    }
}
