<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
{
    $search = $request->input('search', '');
    $categoryFilter = $request->input('category', 'all');

    $categoriesQuery = Category::query();

    if ($categoryFilter !== 'all') {
        $categoriesQuery->where('id', (int) $categoryFilter);
    }

    $categories = $categoriesQuery->get();

    // Manually attach items based on search — this guarantees it works right!
    $categories->each(function ($category) use ($search) {
        $category->setRelation('items', $category->items()->when(
            $search !== '',
            fn ($query) => $query->where('name', 'like', '%' . $search . '%')
        )->get());
    });


    \Log::info('Sending Categories:', $categories->toArray());

    return Inertia::render('dashboard', [
        'categories' => $categories->filter(fn ($cat) => $cat->items->isNotEmpty())->values(),
        'filters' => [
            'search' => $search,
            'category' => $categoryFilter,
        ],
        'allCategories' => Category::orderBy('name')->get(['id', 'name']),
    ]);
}


}
