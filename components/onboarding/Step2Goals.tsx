'use client';

import { useState } from 'react';
import type { ActivityLevel, Diet, Goal, OnboardingData } from '../../lib/database.types';

interface Step2GoalsProps {
    data: Pick<OnboardingData, 'goal' | 'diet' | 'activityLevel'>;
    onUpdate: (data: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function Step2Goals({ data, onUpdate, onNext, onBack }: Step2GoalsProps) {
    const [error, setError] = useState('');
    const goals = [
        { id: 'fat_loss', label: 'Fat loss', desc: 'Burn fat & get lean', icon: 'local_fire_department' },
        { id: 'muscle_gain', label: 'Muscle gain', desc: 'Build mass & strength', icon: 'fitness_center' },
        { id: 'maintain', label: 'Maintain balance', desc: 'Stay healthy & active', icon: 'spa' },
    ] satisfies Array<{ id: Goal; label: string; desc: string; icon: string }>;

    const diets = [
        { id: 'omnivore', label: 'No restriction' },
        { id: 'vegetarian', label: 'Vegetarian' },
        { id: 'vegan', label: 'Vegan' },
        { id: 'halal', label: 'Halal' },
        { id: 'pescatarian', label: 'Pescatarian' },
    ] satisfies Array<{ id: Diet; label: string }>;

    const activityLevels = [
        { id: 'sedentary', label: 'Mostly sitting', description: 'Little or no planned exercise' },
        { id: 'light', label: 'Lightly active', description: 'Light exercise 1–3 days per week' },
        { id: 'moderate', label: 'Moderately active', description: 'Exercise 3–5 days per week' },
        { id: 'active', label: 'Very active', description: 'Hard exercise 6–7 days per week' },
        { id: 'very_active', label: 'Extremely active', description: 'Intense training or physical work' },
    ] satisfies Array<{ id: ActivityLevel; label: string; description: string }>;

    const handleNext = () => {
        if (!data.goal || !data.diet || !data.activityLevel) {
            setError('Choose a goal, eating preference, and activity level to continue.');
            return;
        }
        setError('');
        onNext();
    };

    return (
        <div className="flex flex-col h-full bg-background min-h-screen">
            <header className="flex items-center justify-between px-6 pt-6 pb-2">
                <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors">
                    <span className="material-symbols-outlined text-text-dark" style={{ fontSize: '20px' }}>arrow_back_ios_new</span>
                </button>
                <div className="flex flex-col items-center">
                    <div className="flex gap-2 mb-1">
                        <div className="h-1.5 w-8 rounded-full bg-gray-200"></div>
                        <div className="h-1.5 w-8 rounded-full bg-primary shadow-[0_0_8px_rgba(90,158,111,0.6)]"></div>
                        <div className="h-1.5 w-8 rounded-full bg-gray-200"></div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Step 2 of 3</span>
                </div>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 overflow-y-auto pb-24 px-6 pt-4">
                <section className="mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-dark leading-[1.15] mb-3 font-display">
                        What are you<br />aiming for?
                    </h1>
                    <p className="text-text-light font-medium text-base font-body">
                        We’ll adapt nutrition to your goal.
                    </p>
                </section>

                <section className="flex flex-col gap-4 mb-10">
                    {goals.map((g) => (
                        <label key={g.id} className="group relative cursor-pointer tap-highlight-transparent">
                            <input
                                type="radio"
                                name="goal"
                                className="peer sr-only"
                                checked={data.goal === g.id}
                                onChange={() => onUpdate({ goal: g.id })}
                            />
                            <div className="flex items-center gap-4 rounded-2xl border-2 border-transparent bg-white p-5 shadow-soft transition-all duration-300 peer-checked:bg-[rgba(90,158,111,0.1)] peer-checked:border-primary">
                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${data.goal === g.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 group-hover:text-primary'}`}>
                                    <span className="material-symbols-outlined">{g.icon}</span>
                                </div>
                                <div className="flex grow flex-col">
                                    <span className="text-lg font-bold text-text-dark">{g.label}</span>
                                    <span className="text-sm font-medium text-text-light">{g.desc}</span>
                                </div>
                                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${data.goal === g.id ? 'border-primary bg-primary opacity-100' : 'border-gray-200 opacity-0'}`}>
                                    <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>
                                </div>
                            </div>
                        </label>
                    ))}
                </section>

                <section>
                    <h3 className="text-lg font-bold text-text-dark mb-4 font-display">How do you usually eat?</h3>
                    <div className="flex flex-wrap gap-3">
                        {diets.map((diet) => (
                            <label key={diet.id} className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="diet"
                                    className="peer sr-only"
                                    checked={data.diet === diet.id}
                                    onChange={() => onUpdate({ diet: diet.id })}
                                />
                                <div className="px-6 py-3 rounded-full bg-white border border-gray-200 text-text-light font-semibold text-sm transition-all duration-200 hover:border-primary/50 peer-checked:bg-[rgba(90,158,111,0.1)] peer-checked:text-text-dark peer-checked:border-primary">
                                    {diet.label}
                                </div>
                            </label>
                        ))}
                    </div>
                </section>
                <section className="mt-8">
                    <h3 className="text-lg font-bold text-text-dark mb-4 font-display">How active are you?</h3>
                    <div className="flex flex-col gap-3">
                        {activityLevels.map((activity) => (
                            <label key={activity.id} className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="activityLevel"
                                    className="peer sr-only"
                                    checked={data.activityLevel === activity.id}
                                    onChange={() => onUpdate({ activityLevel: activity.id })}
                                />
                                <div className="rounded-2xl border-2 border-transparent bg-white p-4 shadow-soft transition-all peer-checked:border-primary peer-checked:bg-[rgba(90,158,111,0.1)]">
                                    <span className="font-bold text-text-dark">{activity.label}</span>
                                    <span className="mt-1 block text-sm text-text-light">{activity.description}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </section>
                {error && <p className="mt-5 text-sm font-medium text-red-700" role="alert">{error}</p>}
                <div className="h-8"></div>
            </main>

            <footer className="sticky bottom-0 w-full p-6 bg-gradient-to-t from-background via-background to-transparent pt-10">
                <button onClick={handleNext} className="w-full h-14 rounded-full bg-primary text-white font-bold text-lg shadow-glow hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                    Next
                    <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                </button>
            </footer>
        </div>
    );
}
