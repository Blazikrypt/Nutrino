'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { generateMealDetails } from '@/app/actions';
import type { UserProfileForm } from '../lib/database.types';

interface MealDetailsProps {
    mealName: string;
    userProfile: Partial<UserProfileForm>;
    onBack: () => void;
    onAddLog: (meal: any) => void;
}

interface MealDetailData {
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
}

export default function MealDetails({ mealName, userProfile, onBack, onAddLog }: MealDetailsProps) {
    const [details, setDetails] = useState<MealDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDetails = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const result = await generateMealDetails(mealName, userProfile);
            if (result.success) {
                setDetails(result.data);
            } else {
                setDetails(null);
                setError(result.error);
            }
        } catch (error) {
            console.error('Failed to load meal details', error);
            setDetails(null);
            setError('Could not load recipe details. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [mealName, userProfile]);

    useEffect(() => {
        if (mealName) void fetchDetails();
    }, [fetchDetails, mealName]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-text-sub font-medium">Chef is preparing details...</p>
                </div>
            </div>
        );
    }

    if (!details) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
                <p className="font-medium text-red-700" role="alert">{error || 'Recipe details are unavailable.'}</p>
                <button
                    type="button"
                    onClick={() => void fetchDetails()}
                    disabled={loading}
                    className="rounded-full bg-primary px-6 py-3 font-bold text-white disabled:opacity-50"
                >
                    {loading ? 'Retrying…' : 'Retry'}
                </button>
                <button type="button" onClick={onBack} className="font-semibold text-slate-600">
                    Back to suggestions
                </button>
            </div>
        );
    }

    // Tailwind config from user snippet maps to these arbitrary values or existing globals.
    // primary: #45e236
    // background-light: #f6f8f6
    // background-dark: #132111

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden pb-32 bg-[#f6f8f6] font-display text-slate-800 antialiased selection:bg-[#45e236]/30 transition-colors duration-200">

            {/* Top App Bar */}
            <div className="sticky top-0 z-50 flex items-center justify-between bg-[#f6f8f6]/90 px-4 py-3 backdrop-blur-md">
                <button
                    onClick={onBack}
                    className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm transition-transform active:scale-95"
                >
                    <span className="material-symbols-outlined text-slate-800" style={{ fontSize: '20px' }}>arrow_back_ios_new</span>
                </button>
                <div className="flex items-center gap-3">
                    <button className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm transition-transform active:scale-95">
                        <span className="material-symbols-outlined text-slate-800" style={{ fontSize: '20px' }}>ios_share</span>
                    </button>
                </div>
            </div>

            <main className="flex flex-col gap-8 px-6 pt-4">
                {/* Title & Tags */}
                <div className="flex flex-col gap-4 text-center items-center">
                    <h1 className="text-3xl font-extrabold leading-tight text-slate-900 tracking-tight">
                        {details.name}
                    </h1>
                    <div className="flex flex-wrap justify-center gap-2">
                        {details.tags.map((tag, idx) => (
                            <div
                                key={idx}
                                className={`flex h-7 items-center justify-center rounded-full px-3 ${tag.label === 'High Protein'
                                    ? 'bg-[#45e236]/20 border border-[#45e236]/20'
                                    : 'bg-slate-200/50'
                                    }`}
                            >
                                <span
                                    className={`material-symbols-outlined mr-1 ${tag.label === 'High Protein'
                                        ? 'text-green-800'
                                        : 'text-slate-600'
                                        }`}
                                    style={{ fontSize: '16px' }}
                                >
                                    {tag.icon}
                                </span>
                                <p
                                    className={`text-xs font-bold uppercase tracking-wide ${tag.label === 'High Protein'
                                        ? 'text-green-900'
                                        : 'text-slate-700'
                                        }`}
                                >
                                    {tag.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nutrition Card */}
                <div className="w-full rounded-2xl bg-white p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100">
                    <div className="flex items-center justify-between text-center divide-x divide-slate-100">
                        <div className="flex flex-1 flex-col gap-1 px-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Calories</span>
                            <span className="text-2xl font-extrabold text-slate-900">{details.macros.calories}</span>
                        </div>
                        <div className="flex flex-1 flex-col gap-1 px-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Protein</span>
                            <span className="text-2xl font-extrabold text-[#45e236]">{details.macros.protein}</span>
                        </div>
                        <div className="flex flex-1 flex-col gap-1 px-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Carbs</span>
                            <span className="text-2xl font-extrabold text-slate-900">{details.macros.carbs}</span>
                        </div>
                        <div className="flex flex-1 flex-col gap-1 px-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fats</span>
                            <span className="text-2xl font-extrabold text-slate-900">{details.macros.fats}</span>
                        </div>
                    </div>
                </div>

                {/* Why this fits you */}
                <div className="flex flex-col gap-3">
                    <div className="flex overflow-hidden rounded-2xl bg-gradient-to-br from-[#45e236]/15 to-[#45e236]/5 p-5 border border-[#45e236]/10">
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#45e236] shadow-sm">
                                <span className="material-symbols-outlined">auto_awesome</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="font-bold text-slate-900">Why this fits you</h3>
                                <p className="text-sm leading-relaxed text-slate-600">
                                    {details.why_it_fits}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* What's in it */}
                <div className="flex flex-col gap-4 py-2">
                    <h3 className="text-lg font-bold text-slate-900">What's in it</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {details.ingredients.map((ing, i) => (
                            <div key={i} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-slate-100">
                                <p className="font-medium text-slate-700">{ing.name}</p>
                                <span className="text-sm text-slate-400">{ing.quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Steps Section */}
                <div className="flex flex-col gap-4 py-2 pb-8">
                    <h3 className="text-lg font-bold text-slate-900">How it's usually made</h3>
                    <div className="relative flex flex-col gap-8 pl-4">
                        <div className="absolute left-[27px] top-4 bottom-4 w-0.5 rounded-full bg-slate-200"></div>
                        {details.steps.map((step, i) => (
                            <div key={i} className="relative z-10 flex gap-4">
                                <div className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-4 ring-[#f6f8f6] ${i === 0
                                    ? 'bg-[#45e236] text-black shadow-[0_0_20px_rgba(69,226,54,0.3)]'
                                    : 'bg-slate-200 text-slate-600'
                                    }`}>
                                    {i + 1}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-bold text-slate-900">{step.title}</h4>
                                    <p className="text-sm leading-relaxed text-slate-600">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col gap-3 bg-white/90 px-6 py-4 pb-8 backdrop-blur-xl border-t border-slate-100">
                <button
                    onClick={() => {
                        if (details) onAddLog(details);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#45e236] py-4 text-base font-bold text-black shadow-lg shadow-[#45e236]/20 transition-all hover:brightness-105 active:scale-[0.98]"
                >
                    <span className="material-symbols-outlined">add_circle</span>
                    Add to Food Log
                </button>
                <button
                    onClick={onBack}
                    className="w-full text-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                    Back to suggestions
                </button>
            </div>
        </div>
    );
}
