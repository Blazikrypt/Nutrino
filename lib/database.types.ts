export type Goal = 'fat_loss' | 'muscle_gain' | 'maintain';
export type Gender = 'female' | 'male' | 'non_binary';
export type Diet = 'omnivore' | 'vegetarian' | 'vegan' | 'halal' | 'pescatarian';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface OnboardingData {
    name: string;
    age: string;
    gender: Gender | '';
    height: string;
    weight: string;
    goal: Goal | '';
    diet: Diet | '';
    activityLevel: ActivityLevel | '';
    location: string;
    allergies: string;
}

export interface UserProfileForm extends Omit<OnboardingData, 'gender' | 'goal' | 'diet' | 'activityLevel'> {
    gender: Gender;
    goal: Goal;
    diet: Diet;
    activityLevel: ActivityLevel;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    targetExplanation: string;
}

export interface UserProfile {
    id: string;
    name: string;
    age: number;
    gender: Gender;
    height_cm: number;
    weight_kg: number;
    goal: Goal;
    diet: Diet;
    activity_level: ActivityLevel;
    location: string;
    allergies: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    target_explanation: string;
    onboarding_complete: boolean;
}

export interface MealLog {
    id: string;
    user_id: string;
    meal_date: string;
    name: string;
    portion: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    created_at: string;
}

export type ProfileUpsert = Omit<UserProfile, 'id'> & { id: string };
export type MealLogInsert = Omit<MealLog, 'id' | 'created_at'>;
