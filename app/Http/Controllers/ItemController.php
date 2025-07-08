<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'price' => ['required', 'numeric', 'min:0'],
        'category_id' => ['required', 'exists:categories,id'],
    ]);

    $item = Item::create($validated);

    return redirect()->back()->with([
        'success' => 'Item added successfully!',
        'newItem' => $item,
    ]);
}

public function update(Request $request, Item $item)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
    ]);

    $item->update($validated);

    return back()->with('success', 'Item updated!');
}

public function destroy(Item $item)
{
    $item->delete();

    return back()->with('success', 'Item deleted!');
}


}
