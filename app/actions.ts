'use server';

import { generateGeminiJson } from '../lib/gemini';
import { createClient } from '../lib/supabase/server';

type FoodAnalysis = {
    food_name: string;
    calories: number | string;
    protein: number | string;
    carbs: number | string;
    fats: number | string;
    portion_estimate: string;
};

type UserProfileInput = {
    goal?: string;
    diet?: string;
    allergies?: string;
    location?: string;
    age?: string;
    gender?: string;
    height?: string;
    weight?: string;
    activityLevel?: string;
};

type MealSuggestion = {
    name: string;
    description: string;
    calories: number;
    tags: string[];
    diet_type: 'Veg' | 'Non-Veg' | 'Egg';
};

type MealSuggestions = { suggestions: MealSuggestion[] };

type MealDetails = {
    name: string;
    description: string;
    macros: {
        calories: number;
        protein: string;
        carbs: string;
        fats: string;
    };
    tags: Array<{ label: string; icon: string }>;
    why_it_fits: string;
    ingredients: Array<{ name: string; quantity: string }>;
    steps: Array<{ title: string; description: string }>;
};

type DailyTargets = {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    explanation: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const isFoodAnalysis = (value: unknown): value is FoodAnalysis => {
    if (!isRecord(value)) return false;
    const result = value as Record<string, unknown>;
    return typeof result.food_name === 'string'
        && (typeof result.calories === 'number' || typeof result.calories === 'string')
        && (typeof result.protein === 'number' || typeof result.protein === 'string')
        && (typeof result.carbs === 'number' || typeof result.carbs === 'string')
        && (typeof result.fats === 'number' || typeof result.fats === 'string')
        && typeof result.portion_estimate === 'string';
};

const isMealSuggestions = (value: unknown): value is MealSuggestions =>
    isRecord(value)
    && Array.isArray(value.suggestions)
    && value.suggestions.every((suggestion: unknown) =>
        isRecord(suggestion)
        && typeof suggestion.name === 'string'
        && typeof suggestion.description === 'string'
        && typeof suggestion.calories === 'number'
        && Number.isFinite(suggestion.calories)
        && Array.isArray(suggestion.tags)
        && suggestion.tags.every((tag: unknown) => typeof tag === 'string')
        && ['Veg', 'Non-Veg', 'Egg'].includes(String(suggestion.diet_type)),
    );

const isMealDetails = (value: unknown): value is MealDetails =>
    isRecord(value)
    && typeof value.name === 'string'
    && typeof value.description === 'string'
    && isRecord(value.macros)
    && typeof value.macros.calories === 'number'
    && Number.isFinite(value.macros.calories)
    && typeof value.macros.protein === 'string'
    && typeof value.macros.carbs === 'string'
    && typeof value.macros.fats === 'string'
    && Array.isArray(value.tags)
    && value.tags.every((tag: unknown) =>
        isRecord(tag) && typeof tag.label === 'string' && typeof tag.icon === 'string',
    )
    && typeof value.why_it_fits === 'string'
    && Array.isArray(value.ingredients)
    && value.ingredients.every((ingredient: unknown) =>
        isRecord(ingredient)
        && typeof ingredient.name === 'string'
        && typeof ingredient.quantity === 'string',
    )
    && Array.isArray(value.steps)
    && value.steps.every((step: unknown) =>
        isRecord(step)
        && typeof step.title === 'string'
        && typeof step.description === 'string',
    );

const isDailyTargets = (value: unknown): value is DailyTargets =>
    isRecord(value)
    && typeof value.calories === 'number'
    && Number.isFinite(value.calories)
    && typeof value.protein === 'number'
    && Number.isFinite(value.protein)
    && typeof value.carbs === 'number'
    && Number.isFinite(value.carbs)
    && typeof value.fats === 'number'
    && Number.isFinite(value.fats)
    && typeof value.explanation === 'string';

async function requireAuthenticatedUser() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        throw new Error('You must be signed in to use this feature.');
    }
}

export async function analyzeFoodImage(formData: FormData) {
    await requireAuthenticatedUser();
    const file = formData.get('image') as File;
    if (!file || file.size === 0) {
        return { success: false as const, error: 'No image provided.' };
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString('base64');

        const prompt = `
      Analyze this food image. Identify the food items and estimate the macronutrients.
      Return the result as a strictly valid JSON object with the following structure:
      {
        "food_name": "Name of the food",
        "calories": 0,
        "protein": "0g",
        "carbs": "0g",
        "fats": "0g",
        "portion_estimate": "Description of portion"
      }
      Do not include markdown formatting like \`\`\`json. Just the raw JSON.
    `;

        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: file.type,
                                data: base64Image
                            }
                        }
                    ]
                }
            ]
        };

        return await generateGeminiJson(requestBody, isFoodAnalysis, 'analyzeFoodImage');
    } catch (error) {
        console.error('analyzeFoodImage failed while reading the image.', error);
        return { success: false as const, error: 'Could not process the image. Please try again.' };
    }
}

export async function analyzeFoodText(description: string) {
    await requireAuthenticatedUser();
    if (!description.trim()) {
        return { success: false as const, error: 'Please describe the food first.' };
    }

    try {
        const prompt = `
      Analyze this food description: "${description}". 
      Identify the food items and estimate the macronutrients.
      Return the result as a strictly valid JSON object with the following structure:
      {
        "food_name": "Name of the food",
        "calories": 0,
        "protein": "0g",
        "carbs": "0g",
        "fats": "0g",
        "portion_estimate": "Description of portion"
      }
      Do not include markdown formatting like \`\`\`json. Just the raw JSON.
    `;

        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: prompt }
                    ]
                }
            ]
        };

        return await generateGeminiJson(requestBody, isFoodAnalysis, 'analyzeFoodText');
    } catch (error) {
        console.error('analyzeFoodText failed while preparing the request.', error);
        return { success: false as const, error: 'Could not process the food description. Please try again.' };
    }
}

export async function generateMealSuggestions(userProfile: UserProfileInput, filterType: string = 'Balanced') {
        await requireAuthenticatedUser();
        const prompt = `
      You are a nutritionist. Suggest 2 meal options based on the following user profile and filter.
      
      User Profile:
      - Goal: ${userProfile.goal || 'General Health'}
      - Diet: ${userProfile.diet || 'Any'}
      - Allergies: ${userProfile.allergies || 'None'}
      - Location: ${userProfile.location || 'Unknown'}
      
      Filter: ${filterType}
      
      IMPORTANT: The suggestions must strictly align with the "${filterType}" filter.
      - If Filter is "Balanced", tags must be related to overall health (e.g., "Balanced Choice", "Nutrient Dense"). Do NOT use specific macro tags like "High Protein" unless it is exceptionally high.
      - If Filter is "High Protein", tags must highlight protein (e.g., "High Protein", "Muscle Building").
      - If Filter is "High Carbs", tags must highlight energy/carbs (e.g., "High Carb", "Energy Boost").
      - If Filter is "High Vitamins", tags must highlight micronutrients (e.g., "Vitamin Rich", "Immunity Boost").
      
      Return the result as a strictly valid JSON object with the following structure:
      {
        "suggestions": [
          {
            "name": "Meal Name",
            "description": "Brief description of ingredients",
            "calories": "Total Calories (number only, e.g., 450)",
            "tags": ["Tag1", "Tag2"],
            "diet_type": "Veg" | "Non-Veg" | "Egg"
          }
        ]
      }
      
      Ensure the calories are numeric (integer). diet_type must be one of "Veg", "Non-Veg", or "Egg".
      Do not include markdown formatting like \`\`\`json. Just the raw JSON.
    `;

        const requestBody = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        return await generateGeminiJson(requestBody, isMealSuggestions, 'generateMealSuggestions');
}

export async function generateMealDetails(mealName: string, userProfile: UserProfileInput) {
        await requireAuthenticatedUser();
        const prompt = `
      You are a nutritionist. Provide detailed nutritional analysis and preparation steps for the meal: "${mealName}".
      
      User Profile Context:
      - Goal: ${userProfile.goal || 'General Health'}
      - Diet: ${userProfile.diet || 'Any'}
      
      Return the result as a strictly valid JSON object with the following structure:
      {
        "name": "${mealName}",
        "description": "Appealing one-line description",
        "macros": {
          "calories": 450,
          "protein": "22g",
          "carbs": "30g",
          "fats": "15g"
        },
        "tags": [
           { "label": "Balanced", "icon": "scale" }, 
           { "label": "High Protein", "icon": "bolt" }
        ],
        "why_it_fits": "Brief explanation why this fits the user's goal (e.g., 'Hits 30% of your daily protein...')",
        "ingredients": [
          { "name": "Ingredient 1", "quantity": "100g" },
          { "name": "Ingredient 2", "quantity": "1 cup" }
        ],
        "steps": [
          { "title": "Step 1 Title", "description": "Step 1 details..." },
          { "title": "Step 2 Title", "description": "Step 2 details..." }
        ]
      }
      
      Ensure calories are integer. Limit tags to 2 items. Limit ingredients to main 4-6 items. Limit steps to 3-4 concise steps.
      Do not include markdown formatting like \`\`\`json. Just the raw JSON.
    `;

        const requestBody = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        return await generateGeminiJson(requestBody, isMealDetails, 'generateMealDetails');
}

export async function calculateDailyTargets(userProfile: UserProfileInput) {
        await requireAuthenticatedUser();
        const prompt = `
      You are an expert nutritionist. Calculate the daily calorie and macronutrient targets for a user with the following profile:
      
      - Age: ${userProfile.age}
      - Gender: ${userProfile.gender}
      - Height: ${userProfile.height}
      - Weight: ${userProfile.weight}
      - Goal: ${userProfile.goal} (e.g., fat_loss, muscle_gain, maintenance)
      - Diet: ${userProfile.diet}
      - Activity Level: ${userProfile.activityLevel || 'moderate'}

      Task:
      1. Calculate BMR (Basal Metabolic Rate) using the Mifflin-St Jeor equation.
      2. Calculate TDEE (Total Daily Energy Expenditure).
      3. Adjust TDEE based on the goal (e.g., -500 for fat loss, +300 for muscle gain).
      4. Distribute macros (Protein, Carbs, Fats) appropriately for the goal.

      Return the result as a strictly valid JSON object with the following structure:
      {
        "calories": 2000,
        "protein": 150,
        "carbs": 200,
        "fats": 65,
        "explanation": "Brief 1-sentence explanation of the calculation."
      }
      
      Ensure all numeric values are integers.
      Do not include markdown formatting like \`\`\`json. Just the raw JSON.
    `;

        const requestBody = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        return await generateGeminiJson(requestBody, isDailyTargets, 'calculateDailyTargets');
}
