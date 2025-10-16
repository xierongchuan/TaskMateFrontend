<?php

namespace App\Http\Controllers;

use App\Models\Dealership;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of tasks.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Task::with(['creator', 'dealership', 'assignments.user', 'responses'])
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->filled('dealership_id')) {
            $query->where('dealership_id', $request->dealership_id);
        }

        if ($request->filled('status')) {
            switch ($request->status) {
                case 'completed':
                    $query->whereHas('responses', function ($q) {
                        $q->where('status', 'completed');
                    });
                    break;
                case 'overdue':
                    $query->where('deadline', '<', now())
                        ->whereDoesntHave('responses', function ($q) {
                            $q->where('status', 'completed');
                        });
                    break;
                case 'postponed':
                    $query->where('postpone_count', '>', 0);
                    break;
                case 'active':
                    $query->where('is_active', true);
                    break;
            }
        }

        if ($request->filled('task_type')) {
            $query->where('task_type', $request->task_type);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%'.$request->search.'%')
                    ->orWhere('description', 'like', '%'.$request->search.'%');
            });
        }

        // Filter by role
        if ($user->role === 'manager' && $user->dealership_id) {
            $query->where('dealership_id', $user->dealership_id);
        }

        $tasks = $query->paginate(15);

        $dealerships = Dealership::where('is_active', true)->get();

        return view('tasks.index', compact('tasks', 'dealerships'));
    }

    /**
     * Show the form for creating a new task.
     */
    public function create()
    {
        $dealerships = Dealership::where('is_active', true)->get();
        $users = User::where('role', 'employee')->get();

        return view('tasks.create', compact('dealerships', 'users'));
    }

    /**
     * Store a newly created task in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'comment' => 'nullable|string',
            'dealership_id' => 'nullable|exists:dealerships,id',
            'appear_date' => 'nullable|date',
            'deadline' => 'nullable|date',
            'recurrence' => 'nullable|in:daily,weekly,monthly',
            'task_type' => 'required|in:individual,group',
            'response_type' => 'required|in:acknowledge,complete',
            'tags' => 'nullable|array',
            'assigned_users' => 'required|array',
            'assigned_users.*' => 'exists:users,id',
        ]);

        $task = Task::create([
            ...$validated,
            'creator_id' => $request->user()->id,
            'is_active' => true,
            'postpone_count' => 0,
        ]);

        // Assign users
        $task->assignedUsers()->attach($validated['assigned_users']);

        return redirect()->route('tasks.index')->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified task.
     */
    public function show(Task $task)
    {
        $task->load(['creator', 'dealership', 'assignments.user', 'responses.user']);

        return view('tasks.show', compact('task'));
    }

    /**
     * Show the form for editing the specified task.
     */
    public function edit(Task $task)
    {
        $dealerships = Dealership::where('is_active', true)->get();
        $users = User::where('role', 'employee')->get();
        $task->load('assignedUsers');

        return view('tasks.edit', compact('task', 'dealerships', 'users'));
    }

    /**
     * Update the specified task in storage.
     */
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'comment' => 'nullable|string',
            'dealership_id' => 'nullable|exists:dealerships,id',
            'appear_date' => 'nullable|date',
            'deadline' => 'nullable|date',
            'recurrence' => 'nullable|in:daily,weekly,monthly',
            'task_type' => 'required|in:individual,group',
            'response_type' => 'required|in:acknowledge,complete',
            'tags' => 'nullable|array',
            'is_active' => 'boolean',
            'assigned_users' => 'required|array',
            'assigned_users.*' => 'exists:users,id',
        ]);

        $task->update($validated);

        // Update assigned users
        $task->assignedUsers()->sync($validated['assigned_users']);

        return redirect()->route('tasks.index')->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified task from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully.');
    }
}
