<?php

namespace App\Services;

use EchoLabs\Prism\Facades\Prism;
use EchoLabs\Prism\Support\Enums\Provider;
use Exception;

class PrismService
{
    public function ask(string $prompt): string
    {
        try {
            $response = Prism::text()
                ->using(Provider::Groq, 'llama3-70b-8192')
                ->withPrompt($prompt)
                ->asText();

            return $response->text;
        } catch (Exception $e) {
            return "⚠️ AI Error: " . $e->getMessage();
        }
    }
}
