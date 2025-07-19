<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\DashboardController;



Route::get('/builder-page', function () {
    return Inertia::render('builder-page');
});

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// 🔧 Test route
Route::get('/test', function () {
    return Inertia::render('Test');
})->name('test');

Route::middleware(['auth', 'verified'])->group(function () {

    // ✅ Updated dashboard to use controller with categories and items
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // 🗂️ Category routes
    Route::resource('categories', CategoryController::class);

    // 📦 Item routes (POST-only for offline-safe usage)
    Route::post('/items', [ItemController::class, 'store'])->name('items.store');                    // create
    Route::post('/items/{item}/update', [ItemController::class, 'update'])->name('items.update');    // update
    Route::post('/items/{item}/delete', [ItemController::class, 'destroy'])->name('items.destroy');  // delete
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
