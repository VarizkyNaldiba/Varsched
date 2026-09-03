<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PomodoroController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Pomodoro/Index');
    }
}

