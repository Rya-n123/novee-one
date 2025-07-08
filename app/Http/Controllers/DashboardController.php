<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $categories = Category::with('items')->get();

        return Inertia::render('dashboard', [
            'categories' => $categories,
        ]);
    }
}
