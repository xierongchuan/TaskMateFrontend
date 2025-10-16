<?php

namespace App\Http\Controllers;

use App\Models\Dealership;
use Illuminate\Http\Request;

class DealershipController extends Controller
{
    /**
     * Display a listing of dealerships.
     */
    public function index(Request $request)
    {
        $query = Dealership::with('company')->orderBy('name');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%')
                ->orWhere('address', 'like', '%'.$request->search.'%');
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $dealerships = $query->paginate(15);

        return view('dealerships.index', compact('dealerships'));
    }

    /**
     * Show the form for creating a new dealership.
     */
    public function create()
    {
        return view('dealerships.create');
    }

    /**
     * Store a newly created dealership in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        // Get or create company for the current user
        $user = $request->user();
        $companyId = $user->company_id ?? $user->company()->firstOrCreate(
            ['name' => 'Default Company'],
            ['is_active' => true]
        )->id;

        Dealership::create([
            ...$validated,
            'company_id' => $companyId,
        ]);

        return redirect()->route('dealerships.index')->with('success', 'Dealership created successfully.');
    }

    /**
     * Display the specified dealership.
     */
    public function show(Dealership $dealership)
    {
        $dealership->load(['users', 'tasks', 'shifts.user']);

        return view('dealerships.show', compact('dealership'));
    }

    /**
     * Show the form for editing the specified dealership.
     */
    public function edit(Dealership $dealership)
    {
        return view('dealerships.edit', compact('dealership'));
    }

    /**
     * Update the specified dealership in storage.
     */
    public function update(Request $request, Dealership $dealership)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $dealership->update($validated);

        return redirect()->route('dealerships.index')->with('success', 'Dealership updated successfully.');
    }

    /**
     * Remove the specified dealership from storage.
     */
    public function destroy(Dealership $dealership)
    {
        $dealership->delete();

        return redirect()->route('dealerships.index')->with('success', 'Dealership deleted successfully.');
    }
}
