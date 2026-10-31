type GeminiPart = {
    text?: string;
    inline_data?: {
        mime_type: string;
        data: string;
    };
};

type GeminiRequest = {
    contents: Array<{ parts: GeminiPart[] }>;
};

type GeminiResponse = {
    candidates?: Array<{
        content?: {
            parts?: Array<{ text?: string }>;
        };
    }>;
};

type GeminiResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };

const GEMINI_MODELS = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.5-pro',
];

export async function generateGeminiJson<T>(
    requestBody: GeminiRequest,
    isValid: (value: unknown) => value is T,
    operation: string,
): Promise<GeminiResult<T>> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error(`${operation} failed: GEMINI_API_KEY is not configured.`);
        return { success: false, error: 'AI service is not configured. Please try again later.' };
    }

    const failures: string[] = [];

    for (const model of GEMINI_MODELS) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15_000);
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
                    signal: controller.signal,
                },
            );

            if (!response.ok) {
                failures.push(`${model}: HTTP ${response.status}`);
                continue;
            }

            const result = await response.json() as GeminiResponse;
            const output = result.candidates?.[0]?.content?.parts
                ?.map((part) => part.text ?? '')
                .join('')
                .trim();

            if (!output) {
                failures.push(`${model}: response contained no text`);
                continue;
            }

            const cleanJson = output
                .replace(/^```(?:json)?\s*/i, '')
                .replace(/\s*```$/, '')
                .trim();

            let parsed: unknown;
            try {
                parsed = JSON.parse(cleanJson);
            } catch {
                failures.push(`${model}: response was not valid JSON`);
                continue;
            }

            if (!isValid(parsed)) {
                failures.push(`${model}: response did not match the expected format`);
                continue;
            }

            return { success: true, data: parsed };
        } catch (error) {
            failures.push(`${model}: ${error instanceof Error ? error.message : 'request failed'}`);
        } finally {
            clearTimeout(timeout);
        }
    }

    console.error(`${operation} failed for all configured Gemini models.`, failures);
    return {
        success: false,
        error: 'AI is unavailable right now. Please try again.',
    };
}
