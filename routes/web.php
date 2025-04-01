<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\Auth\AdminLoginController;
use App\Http\Controllers\Admin\ElectionController;
use App\Http\Controllers\Admin\PositionController;
use App\Http\Controllers\Admin\CandidateController;
use App\Http\Controllers\Admin\VoterController;
use App\Http\Controllers\Student\Auth\StudentLoginController;
use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\Student\VotingController;

// Public Admin Login Routes
Route::get('/admin/login', function () {
    return Inertia::render('Admin/Auth/AdminLogin');
})->name('login');

Route::post('/admin/login', [AdminLoginController::class, 'login']);
Route::post('/admin/logout', [AdminLoginController::class, 'logout']);

// Protected Admin Routes
Route::prefix('admin')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/page');
    })->name('admin.dashboard');

    // Elections routes
    Route::get('/elections', [ElectionController::class, 'index'])->name('admin.elections.index');
    Route::get('/elections/create', [ElectionController::class, 'create'])->name('admin.elections.create');
    Route::post('/elections', [ElectionController::class, 'store'])->name('admin.elections.store');
    Route::get('/elections/{id}', [ElectionController::class, 'show'])->name('admin.elections.show');
    Route::get('/elections/{id}/edit', [ElectionController::class, 'edit'])->name('admin.elections.edit');
    Route::put('/elections/{id}', [ElectionController::class, 'update'])->name('admin.elections.update');
    Route::delete('/elections/{id}', [ElectionController::class, 'destroy'])->name('admin.elections.destroy');

    // Rest of admin routes...
    // Position management routes
    Route::get('/positions', [PositionController::class, 'index'])->name('admin.positions.index');
    Route::get('/positions/create', [PositionController::class, 'create'])->name('admin.positions.create');
    Route::post('/positions', [PositionController::class, 'store'])->name('admin.positions.store');
    Route::get('/positions/{id}', [PositionController::class, 'show'])->name('admin.positions.show');
    Route::get('/positions/{id}/edit', [PositionController::class, 'edit'])->name('admin.positions.edit');
    Route::put('/positions/{id}', [PositionController::class, 'update'])->name('admin.positions.update');
    Route::delete('/positions/{id}', [PositionController::class, 'destroy'])->name('admin.positions.destroy');

    // Candidate management routes
    Route::get('/candidates', [CandidateController::class, 'index'])->name('admin.candidates.index');
    Route::get('/candidates/create', [CandidateController::class, 'create'])->name('admin.candidates.create');
    Route::post('/candidates', [CandidateController::class, 'store'])->name('admin.candidates.store');
    Route::get('/candidates/{id}/edit', [CandidateController::class, 'edit'])->name('admin.candidates.edit');
    Route::put('/candidates/{id}', [CandidateController::class, 'update'])->name('admin.candidates.update');
    Route::delete('/candidates/{id}', [CandidateController::class, 'destroy'])->name('admin.candidates.destroy');

    // Voters Management Routes
    Route::get('/voters', [VoterController::class, 'index'])->name('admin.voters.index');
    Route::get('/voters/import/page', [VoterController::class, 'import'])->name('admin.voters.import.page');
    Route::post('/voters/import', [VoterController::class, 'storeImport'])->name('admin.voters.import');
    Route::get('/voters/{id}/edit/page', [VoterController::class, 'edit'])->name('admin.voters.edit.page');
    Route::put('/voters/{id}', [VoterController::class, 'update'])->name('admin.voters.update');
});

// Student Login Page
Route::get('/student/login', function () {
    return Inertia::render('Student/Login');
})->name('student.login');

// Student Login Endpoint
Route::post('/student/login', [StudentLoginController::class, 'login'])->name('student.login.post');

// Student Logout Endpoint
Route::post('/student/logout', [StudentLoginController::class, 'logout'])->name('student.logout');

// Student Dashboard
Route::get('/student/dashboard', [StudentDashboardController::class, 'index'])->name('student.dashboard');

// FIXED: Use consistent routes - we'll stick with the plural "elections" format
// Make sure you're using the correct methods in StudentDashboardController
Route::get('/student/elections/{id}', [StudentDashboardController::class, 'showElection'])->name('student.elections.show');
Route::post('/student/elections/{id}/vote', [StudentDashboardController::class, 'submitVote'])->name('student.elections.vote');

// Comment out the redundant routes to avoid conflicts
// Route::get('/student/election/{id}', [StudentDashboardController::class, 'showElection'])->name('student.election.show');
// Route::post('/student/election/{id}/vote', [StudentDashboardController::class, 'submitVote'])->name('student.election.vote');

// Comment out any other duplicate routes
// Route::get('/student/elections/{electionId}', [VotingController::class, 'show'])->name('student.vote.show');
// Route::post('/student/elections/{electionId}/vote', [VotingController::class, 'vote'])->name('student.vote.cast');

// Fallback route for debugging - provides more detailed information
Route::fallback(function () {
    $currentUrl = url()->current();
    $requestMethod = request()->method();
    
    return response()->json([
        'message' => 'Route not found. Check URL and method.',
        'url' => $currentUrl,
        'method' => $requestMethod,
        'available_routes' => 'Please check web.php for available routes.'
    ], 404);
});