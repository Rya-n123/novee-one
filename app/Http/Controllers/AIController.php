<?php

namespace App\Http\Controllers;

// app/Http/Controllers/AIController.php
use App\Http\Controllers\Controller;
use EchoLabs\Prism\Facades\Prism;
use EchoLabs\Prism\Support\Enums\Provider;
use Illuminate\Http\Request;

class AIController extends Controller
{
    public function predict(Request $request)
    {
        $validated = $request->validate(['content' => 'required|string|max:500']);
        try {
            $response = Prism::text()
                ->using(Provider::Groq, 'llama3-70b-8192')
                ->withPrompt($validated['content'])
                ->asText();

            return response()->json(['response' => $response->text]);
        } catch (\Exception $e) {
            return response()->json(['response' => 'Error: ' . $e->getMessage()], 500);
        }
    }
}
