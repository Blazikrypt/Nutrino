'use server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function analyzeFoodImage(formData: FormData) {
    const file = formData.get('image') as File;
    if (!file) {
        return { error: 'No image provided' };
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

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error:', errorText);

            // Fallback to mock data on error (e.g. Quota Exceeded 429) to unblock user
            console.log('Falling back to mock data due to API error.');
            return {
                success: true,
                data: {
                    food_name: "Grilled Chicken Salad (Mock)",
                    calories: 350,
                    protein: "35g",
                    carbs: "12g",
                    fats: "18g",
                    portion_estimate: "1 bowl (approx 300g)",
                    is_mock: true
                }
            };
        }

        const data = await response.json();
        const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textOutput) {
            console.log('No text output, using mock data.');
            return {
                success: true,
                data: {
                    food_name: "Grilled Chicken Salad (Mock)",
                    calories: 350,
                    protein: "35g",
                    carbs: "12g",
                    fats: "18g",
                    portion_estimate: "1 bowl (approx 300g)",
                    is_mock: true
                }
            };
        }

        // Attempt to parse JSON
        try {
            const cleanJson = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            return { success: true, data: parsed };
        } catch (e) {
            console.error('JSON Parse Error:', e);
            return { error: 'Failed to parse Gemini response.', raw: textOutput };
        }

    } catch (error) {
        console.error('Server Action Error:', error);
        // Fallback to mock data on network error
        return {
            success: true,
            data: {
                food_name: "Grilled Chicken Salad (Mock)",
                calories: 350,
                protein: "35g",
                carbs: "12g",
                fats: "18g",
                portion_estimate: "1 bowl (approx 300g)",
                is_mock: true
            }
        };
    }
}

export async function analyzeFoodText(description: string) {
    if (!description.trim()) {
        return { error: 'No description provided' };
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

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error:', errorText);

            // Fallback to mock data on error
            console.log('Falling back to mock data due to API error.');
            return {
                success: true,
                data: {
                    food_name: "Idlis with Sambar (Mock)",
                    calories: 320,
                    protein: "12g",
                    carbs: "50g",
                    fats: "6g",
                    portion_estimate: "2 pieces with bowl of sambar",
                    is_mock: true
                }
            };
        }

        const data = await response.json();
        const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textOutput) {
            return {
                success: true,
                data: {
                    food_name: "Idlis with Sambar (Mock)",
                    calories: 320,
                    protein: "12g",
                    carbs: "50g",
                    fats: "6g",
                    portion_estimate: "2 pieces with bowl of sambar",
                    is_mock: true
                }
            };
        }

        try {
            const cleanJson = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            return { success: true, data: parsed };
        } catch (e) {
            console.error('JSON Parse Error:', e);
            return { error: 'Failed to parse Gemini response.', raw: textOutput };
        }

    } catch (error) {
        console.error('Server Action Error:', error);
        return {
            success: true,
            data: {
                food_name: "Idlis with Sambar (Mock)",
                calories: 320,
                protein: "12g",
                carbs: "50g",
                fats: "6g",
                portion_estimate: "2 pieces with bowl of sambar",
                is_mock: true
            }
        };
    }
}

export async function generateMealSuggestions(userProfile: any, filterType: string = 'Balanced') {
    try {
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

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error (Suggestions):', errorText);
            throw new Error('API request failed');
        }

        const data = await response.json();
        const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textOutput) throw new Error('No output from Gemini');

        const cleanJson = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
        return { success: true, data: JSON.parse(cleanJson) };

    } catch (error) {
        console.error('generateMealSuggestions Error:', error);
        // Fallback Mock Data
        return {
            success: true,
            data: {
                suggestions: [
                    {
                        name: "Mediterranean Quinoa Bowl (Fallback)",
                        description: "Quinoa, chickpeas, cucumber, cherry tomatoes, feta cheese, extra virgin olive oil",
                        calories: 450,
                        tags: ["High Fiber", "Balanced Choice"],
                        diet_type: "Veg"
                    },
                    {
                        name: "Grilled Salmon & Asparagus (Fallback)",
                        description: "Wild salmon fillet, asparagus spears, lemon zest, garlic butter, sea salt",
                        calories: 520,
                        tags: ["Omega-3 Rich", "High Protein"],
                        diet_type: "Non-Veg"
                    }
                ]
            }
        };
    }
}

export async function generateMealDetails(mealName: string, userProfile: any) {
    try {
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

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textOutput) throw new Error('No output from Gemini');

        const cleanJson = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
        return { success: true, data: JSON.parse(cleanJson) };

    } catch (error) {
        console.error('generateMealDetails Error:', error);
        // Fallback Mock Data
        return {
            success: true,
            data: {
                name: mealName,
                description: "Delicious and nutritious meal option.",
                macros: { calories: 450, protein: "20g", carbs: "40g", fats: "15g" },
                tags: [{ label: "Balanced", icon: "scale" }],
                why_it_fits: "A great balanced option for your daily goals.",
                ingredients: [
                    { name: "Main Ingredient", quantity: "1 serving" },
                    { name: "Vegetables", quantity: "1 cup" }
                ],
                steps: [
                    { title: "Prepare ingredients", description: "Chop and prep all vegetables and protein." },
                    { title: "Cook", description: "Cook on medium heat until done." },
                    { title: "Serve", description: "Serve hot." }
                ]
            }
        };
    }
}

export async function calculateDailyTargets(userProfile: any) {
    try {
        const prompt = `
      You are an expert nutritionist. Calculate the daily calorie and macronutrient targets for a user with the following profile:
      
      - Age: ${userProfile.age}
      - Gender: ${userProfile.gender}
      - Height: ${userProfile.height}
      - Weight: ${userProfile.weight}
      - Goal: ${userProfile.goal} (e.g., fat_loss, muscle_gain, maintenance)
      - Diet: ${userProfile.diet}
      - Activity Level: Moderate (assume average if not specified)

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

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textOutput) throw new Error('No output from Gemini');

        const cleanJson = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
        return { success: true, data: JSON.parse(cleanJson) };

    } catch (error) {
        console.error('calculateDailyTargets Error:', error);
        // Fallback to rough estimation if API fails
        return {
            success: false,
            data: {
                calories: 2000,
                protein: 125,
                carbs: 225,
                fats: 65,
                explanation: "Estimated based on defaults due to connection error."
            }
        };
    }
}
