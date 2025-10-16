<?php

namespace App\Http\Controllers;

use App\Models\Dealership;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserManagementController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        $query = User::with(['dealership', 'company'])->orderBy('name');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('email', 'like', '%'.$request->search.'%')
                    ->orWhere('phone', 'like', '%'.$request->search.'%');
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('dealership_id')) {
            $query->where('dealership_id', $request->dealership_id);
        }

        $users = $query->paginate(15);
        $dealerships = Dealership::where('is_active', true)->get();

        return view('users.index', compact('users', 'dealerships'));
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $dealerships = Dealership::where('is_active', true)->get();

        return view('users.create', compact('dealerships'));
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'login' => 'nullable|string|max:255|unique:users',
            'full_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'role' => 'required|in:employee,manager,observer,owner',
            'dealership_id' => 'nullable|exists:dealerships,id',
        ]);

        $user = $request->user();

        User::create([
            ...$validated,
            'password' => Hash::make($validated['password']),
            'company_id' => $user->company_id,
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        $user->load(['dealership', 'shifts', 'createdTasks', 'assignedTasks']);

        return view('users.show', compact('user'));
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        $dealerships = Dealership::where('is_active', true)->get();

        return view('users.edit', compact('user', 'dealerships'));
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'login' => 'nullable|string|max:255|unique:users,login,'.$user->id,
            'full_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'role' => 'required|in:employee,manager,observer,owner',
            'dealership_id' => 'nullable|exists:dealerships,id',
        ]);

        $user->update($validated);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
