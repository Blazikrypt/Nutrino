'use client';

import React from 'react';

interface MealSuggestionsProps {
    userProfile: any;
    onBack: () => void;
    onAdd: (mealName: string, calories: number) => void;
    onSelectMeal: (mealName: string) => void;
    suggestions: MealSuggestion[];
    loading: boolean;
    error: string;
    filter: string;
    onFetch: (filter: string) => void;
}

interface MealSuggestion {
    name: string;
    description: string;
    calories: number;
    tags: string[];
    diet_type: 'Veg' | 'Non-Veg' | 'Egg';
}

const getDietStyle = (type: string) => {
    switch (type) {
        case 'Veg':
            return {
                cardBg: 'bg-tint-green',
                iconBg: 'text-primary',
                textColor: 'text-primary',
                icon: 'eco'
            };
        case 'Egg':
            return {
                cardBg: 'bg-tint-yellow',
                iconBg: 'text-yellow-600',
                textColor: 'text-yellow-600',
                icon: 'egg_alt'
            };
        case 'Non-Veg':
        default:
            return {
                cardBg: 'bg-tint-orange',
                iconBg: 'text-orange-500',
                textColor: 'text-orange-500',
                icon: 'set_meal'
            };
    }
};

export default function MealSuggestions({
    userProfile,
    onBack,
    onAdd,
    onSelectMeal,
    suggestions,
    loading,
    error,
    filter,
    onFetch
}: MealSuggestionsProps) {
    // Removed internal state

    // Initial fetch handled by parent or empty check?
    // Parent handles initial fetch on view switch. 
    // But if we want to ensure it fetches if for some reason it's empty even if view didn't switch (unlikely), 
    // we can leave it to the user to click a filter. 
    // Actually, parent does `if (mealSuggestions.length === 0)` so we are good.

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-background pb-24 font-display text-slate-900 transition-colors duration-300">
            {/* Header */}
            <header className="flex items-center px-6 pt-6 pb-2 justify-between sticky top-0 z-20 bg-background/90 backdrop-blur-md transition-colors">
                <button
                    onClick={onBack}
                    className="text-slate-900 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back</span>
                </button>
                <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] text-center">Nutrino</h2>
                <button className="flex size-10 items-center justify-center rounded-full overflow-hidden bg-surface-light border border-black/5 shadow-sm">
                    <span className="text-slate-900 font-bold text-sm font-display">
                        {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                </button>
            </header>

            <main className="flex-1 flex flex-col px-6">
                <div className="flex flex-col pt-6 pb-4">
                    <h1 className="text-slate-900 tracking-tight text-[32px] font-extrabold leading-[1.1] text-left mb-2">
                        What would you like to eat for?
                    </h1>
                    <p className="text-slate-500 text-base font-medium leading-relaxed">
                        Fueling your body with the right nutrients based on your daily goals.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex gap-3 py-4 overflow-x-auto no-scrollbar -mx-6 px-6 snap-x">
                    {['Balanced', 'High Protein', 'High Carbs', 'High Vitamins'].map((f) => (
                        <button
                            key={f}
                            onClick={() => onFetch(f)}
                            className={`snap-start flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-all active:scale-95 ${filter === f
                                ? 'bg-primary text-white shadow-sm shadow-primary/20 ring-2 ring-primary ring-offset-2 ring-offset-background'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            <span className={`text-sm ${filter === f ? 'font-bold' : 'font-semibold'} leading-normal`}>{f}</span>
                        </button>
                    ))}
                </div>

                {/* Suggestions List */}
                <div className="flex flex-col gap-5 mt-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-500 font-medium">Asking Gemini...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-6 text-center shadow-sm" role="alert">
                            <p className="text-sm font-medium text-red-700">{error}</p>
                            <button
                                type="button"
                                onClick={() => onFetch(filter)}
                                className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
                            >
                                Retry
                            </button>
                        </div>
                    ) : suggestions.map((meal, index) => {
                        const style = getDietStyle(meal.diet_type);
                        const cardBg = style.cardBg.split(' ')[0]; // Take only the first part, removing dark variants if any were in helper

                        return (
                            <div
                                key={index}
                                onClick={() => onSelectMeal(meal.name)}
                                className={`group relative flex flex-col rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] border border-slate-100 p-6 cursor-pointer ${cardBg}`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-white/80 ${style.iconBg}`}>
                                        <span className="material-symbols-outlined !text-[28px]">{style.icon}</span>
                                    </div>
                                    {meal.tags[0] && (
                                        <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-700 backdrop-blur-sm">
                                            {meal.tags[0]}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-2 font-display">{meal.name}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">{meal.description}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/60">
                                            <span className={`material-symbols-outlined !text-[18px] text-orange-500`}>local_fire_department</span>
                                            <p className="text-slate-900 text-sm font-bold">{meal.calories} kcal</p>
                                        </div>
                                        {meal.tags[1] && (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/60">
                                                <span className={`material-symbols-outlined !text-[18px] ${style.textColor}`}>
                                                    verified
                                                </span>
                                                <p className={`text-sm font-bold ${style.textColor}`}>{meal.tags[1]}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAdd(meal.name, meal.calories);
                                            }}
                                            className="flex-1 mr-3 flex cursor-pointer items-center justify-center rounded-full h-12 bg-primary hover:bg-primary/90 text-white text-sm font-bold leading-normal transition-colors shadow-lg shadow-primary/20"
                                        >
                                            <span className="material-symbols-outlined mr-2 !text-[20px]">add_circle</span>
                                            Add to Log
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onFetch(filter); // Regenerate
                                            }}
                                            aria-label="Regenerate suggestion"
                                            className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 transition-colors"
                                        >
                                            <span className="material-symbols-outlined !text-[20px] transition-transform active:rotate-180">refresh</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div className="h-8"></div>
                </div>
            </main>
        </div>
    );
}
