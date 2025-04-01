<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class AdminLoginController extends Controller
{
    /**
     * Show the admin login form.
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
            'password' => 'required', // Removed min:8 as per your seeded data
        ]);

        // Log login attempt
        Log::info('Admin Login Attempt', [
            'email' => $credentials['email'],
            'ip' => $request->ip(),
        ]);

        // Attempt login
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            // Explicitly check for admin role
            if (Auth::user()->role === 'admin') {
                Log::info('Successful Admin Login', [
                    'email' => $credentials['email'],
                    'user_id' => Auth::id(),
                ]);

                return redirect()->intended('/admin/dashboard');
            }

            // If not an admin, force logout
            Auth::logout();

            Log::warning('Non-admin login attempt', [
                'email' => $credentials['email'],
            ]);

            return back()->withErrors([
                'email' => 'You do not have admin privileges.',
            ]);
        }

        // Log failed login attempt
        Log::warning('Failed Admin Login Attempt', [
            'email' => $credentials['email'],
            'ip' => $request->ip(),
        ]);

        // Return error if login failed
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->withInput($request->only('email'));
    }

    /**
     * Handle admin logout.
     */
    public function logout(Request $request)
    {
        $user = Auth::user();
        
        Auth::logout();
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Log::info('Admin Logout', [
            'email' => $user ? $user->email : 'Unknown',
        ]);

        return redirect('/admin/login');
    }
}