<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use App\Models\Task;
use App\Models\TaskResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with live board.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Get current open shifts
        $query = Shift::with(['user', 'dealership', 'replacement.replacingUser', 'replacement.replacedUser'])
            ->where('status', 'open')
            ->orderBy('shift_start', 'desc');

        // Filter by dealership for managers
        if ($user->role === 'manager' && $user->dealership_id) {
            $query->where('dealership_id', $user->dealership_id);
        }

        $currentShifts = $query->get();

        // Get today's tasks statistics
        $tasksQuery = Task::where('is_active', true)
            ->whereDate('appear_date', '<=', now())
            ->orWhereNull('appear_date');

        if ($user->role === 'manager' && $user->dealership_id) {
            $tasksQuery->where('dealership_id', $user->dealership_id);
        }

        $totalTasks = $tasksQuery->count();

        // Get task statistics
        $completedTasks = TaskResponse::whereHas('task', function ($query) use ($user) {
            if ($user->role === 'manager' && $user->dealership_id) {
                $query->where('dealership_id', $user->dealership_id);
            }
        })
            ->where('status', 'completed')
            ->whereDate('responded_at', today())
            ->count();

        $overdueTasks = Task::where('is_active', true)
            ->where('deadline', '<', now())
            ->whereDoesntHave('responses', function ($query) {
                $query->where('status', 'completed');
            })
            ->when($user->role === 'manager' && $user->dealership_id, function ($query) use ($user) {
                $query->where('dealership_id', $user->dealership_id);
            })
            ->count();

        $postponedTasks = Task::where('is_active', true)
            ->where('postpone_count', '>', 0)
            ->when($user->role === 'manager' && $user->dealership_id, function ($query) use ($user) {
                $query->where('dealership_id', $user->dealership_id);
            })
            ->count();

        return view('dashboard', compact(
            'currentShifts',
            'totalTasks',
            'completedTasks',
            'overdueTasks',
            'postponedTasks'
        ));
    }
}
