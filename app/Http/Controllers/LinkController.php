<?php

namespace App\Http\Controllers;

use App\Models\Dealership;
use App\Models\Link;
use Illuminate\Http\Request;

class LinkController extends Controller
{
    /**
     * Display a listing of links.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Link::with(['creator', 'dealership'])
            ->orderBy('order')
            ->orderBy('created_at', 'desc');

        if ($user->role === 'manager' && $user->dealership_id) {
            $query->where('dealership_id', $user->dealership_id);
        }

        if ($request->filled('dealership_id')) {
            $query->where('dealership_id', $request->dealership_id);
        }

        $links = $query->get();
        $dealerships = Dealership::where('is_active', true)->get();

        return view('links.index', compact('links', 'dealerships'));
    }

    /**
     * Store a newly created link in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|url|max:255',
            'description' => 'nullable|string',
            'dealership_id' => 'nullable|exists:dealerships,id',
            'order' => 'nullable|integer',
        ]);

        Link::create([
            ...$validated,
            'creator_id' => $request->user()->id,
            'is_active' => true,
        ]);

        return redirect()->route('links.index')->with('success', 'Link created successfully.');
    }

    /**
     * Update the specified link in storage.
     */
    public function update(Request $request, Link $link)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|url|max:255',
            'description' => 'nullable|string',
            'dealership_id' => 'nullable|exists:dealerships,id',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $link->update($validated);

        return redirect()->route('links.index')->with('success', 'Link updated successfully.');
    }

    /**
     * Remove the specified link from storage.
     */
    public function destroy(Link $link)
    {
        $link->delete();

        return redirect()->route('links.index')->with('success', 'Link deleted successfully.');
    }
}
