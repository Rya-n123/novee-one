<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\DashboardController;
use App\Http\Middleware\RoleMiddleware;

// ✅ Public Routes
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/test', function () {
    return Inertia::render('Test');
})->name('test');

// ✅ Routes for All Authenticated Users (Admin & Employee — view only)
Route::middleware(['auth', 'verified', [RoleMiddleware::class . ':admin,employee']])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// ✅ Admin-Only Routes (Full Access)
Route::middleware(['auth', 'verified', [RoleMiddleware::class . ':admin']])->group(function () {
    // 🗂️ Category CRUD
    Route::resource('categories', CategoryController::class);

    // 📦 Items POST-only actions
    Route::post('/items', [ItemController::class, 'store'])->name('items.store');                     // create
    Route::post('/items/{item}/update', [ItemController::class, 'update'])->name('items.update');     // update
    Route::post('/items/{item}/delete', [ItemController::class, 'destroy'])->name('items.destroy');   // delete
    Route::post('/items/{item}/add-stock', [ItemController::class, 'addStock'])->name('items.add-stock');
    Route::post('/items/{item}/decrease-stock', [ItemController::class, 'decreaseStock'])->name('items.decrease-stock');
});

// ✅ System Config / Auth Routes
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
