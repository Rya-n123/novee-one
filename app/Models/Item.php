<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = ['category_id', 'name', 'price','stock'];

    // ✅ Ensure 'price' is always returned as a float
    protected $casts = [
        'price' => 'float',];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
