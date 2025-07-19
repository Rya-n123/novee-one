<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $categoryFilter = $request->input('category');

        if (empty($search) && empty($categoryFilter)) {
            $categories = Category::with('items')->get();
        } else {
            $categoriesQuery = Category::with(['items' => function ($query) use ($search) {
                if ($search) {
                    $query->where('name', 'like', '%' . $search . '%');
                }
            }]);

            if ($categoryFilter) {
                $categoriesQuery->where('id', $categoryFilter);
            }

            $categories = $categoriesQuery->get();
        }

        return Inertia::render('dashboard', [
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $categoryFilter,
            ],
            'allCategories' => Category::select('id', 'name')->get(),
        ]);
    }
}
