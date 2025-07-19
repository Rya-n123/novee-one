<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function store(Request $request)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
        ]);

        $item = Item::create($validated);

        return back()->with([
            'success' => 'Item added successfully!',
            'newItem' => $item,
        ]);
    }

    public function update(Request $request, Item $item)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
        ]);

        $item->update($validated);

        return back()->with('success', 'Item updated!');
    }

    public function destroy(Item $item)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized.');
        }

        $item->delete();

        return back()->with('success', 'Item deleted!');
    }

    public function addStock(Request $request, Item $item)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized.');
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $item->increment('stock', $validated['quantity']);

        return back()->with('success', 'Stock increased successfully.');
    }

    public function decreaseStock(Request $request, Item $item)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized.');
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        if ($item->stock < $validated['quantity']) {
            return back()->withErrors(['quantity' => 'Not enough stock to decrease.']);
        }

        $item->decrement('stock', $validated['quantity']);

        return back()->with('success', 'Stock decreased successfully.');
    }
}
