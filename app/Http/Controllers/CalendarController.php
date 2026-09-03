<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Calendar/Index', [
            'tasks' => $request->user()->tasks()->latest()->get(),
        ]);
    }
}

