'use client';
import React from 'react';

interface MacroStats {
    current: number;
    target: number;
}

interface DailyMacros {
    calories: MacroStats;
    protein: MacroStats;
    carbs: MacroStats;
    fats: MacroStats;
}

interface DashboardMeal {
    id: string;
    name: string;
    portion: string;
    calories: number;
    timestamp: number;
}

import type { UserProfileForm } from '../lib/database.types';

interface DashboardProps {
    onAddFood: () => void;
    onSuggestMeal: () => void;
    currentDate: Date;
    macros: DailyMacros;
    meals: DashboardMeal[];
    onPrevDay: () => void;
    onNextDay: () => void;
    onNotifications: () => void;
    onProfile: () => void;
    onMenu: () => void;
    isMenuOpen?: boolean;
    userProfile: Partial<UserProfileForm>;
}

export default function Dashboard({
    onAddFood,
    onSuggestMeal,
    currentDate,
    macros,
    meals,
    onPrevDay,
    onNextDay,
    onNotifications,
    onProfile,
    onMenu,
    isMenuOpen = false,
    userProfile
}: DashboardProps) {
    // Determine date display
    const isToday = new Date().toDateString() === currentDate.toDateString();
    const dateText = isToday ? "Today's Nutrition" : currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: isToday ? undefined : '2-digit' });
    const mealsTitle = isToday
        ? "Today's meals"
        : `Meals for ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    // Calculate percentages for bars
    const getPercent = (current: number, target: number) => Math.min(100, Math.max(0, (current / target) * 100));

    return (
        <div className="w-full max-w-md bg-background min-h-screen flex flex-col relative shadow-2xl mx-auto pb-48">
            {/* Header Section */}
            <header className="pt-8 pb-4 px-6 flex flex-col gap-1 shrink-0">
                <div className="flex justify-between items-center mb-2">
                    <button
                        onClick={onMenu}
                        aria-label={isMenuOpen ? "Close Menu" : "Menu"}
                        className="relative z-[60] p-3 -ml-2 rounded-full text-text-dark hover:bg-primary/10 active:bg-primary/20 transition-all duration-300 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[28px] font-medium" style={{ fontVariationSettings: "'wght' 600" }}>
                            {isMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onNotifications}
                            aria-label="Notifications"
                            className="p-3 rounded-full text-text-dark hover:bg-primary/10 active:bg-primary/20 transition-all duration-300 relative"
                        >
                            <span className="material-symbols-outlined text-[28px] font-medium" style={{ fontVariationSettings: "'wght' 500" }}>notifications</span>
                        </button>
                        <button
                            onClick={onProfile}
                            aria-label="Profile"
                            className="w-12 h-12 rounded-full overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border-2 border-white dark:border-white/10"
                        >
                            <div className="w-full h-full bg-[#D1F2D9] dark:bg-primary/30 flex items-center justify-center text-text-dark dark:text-white font-bold text-base font-display tracking-wide">
                                {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Date Navigation Header */}
                <div className="flex items-center justify-between mt-2">
                    <button
                        onClick={onPrevDay}
                        className="p-2 -ml-2 rounded-full text-text-light hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl font-extrabold text-text-dark tracking-tight leading-tight font-display">{dateText}</h1>
                        <p className="text-text-light text-base font-medium font-body">Based on your goals</p>
                    </div>
                    <button
                        onClick={onNextDay}
                        disabled={isToday} // Optional: disable future if desired, but user might want to plan ahead
                        className={`p-2 -mr-2 rounded-full transition-colors ${isToday ? 'text-gray-300 cursor-not-allowed' : 'text-text-light hover:bg-black/5 dark:hover:bg-white/10'}`}
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-6 flex flex-col gap-8">
                {/* Calorie Summary Card */}
                <div className="mt-4 bg-white rounded-[2rem] p-8 shadow-soft relative overflow-hidden group">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>

                    <div className="relative z-10 flex flex-col items-center text-center gap-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-5xl font-black text-text-dark tracking-tighter font-display">
                                {Math.max(0, macros.calories.target - macros.calories.current)}
                            </span>
                            <span className="text-lg font-bold text-primary uppercase tracking-wide font-body">kcal Remaining</span>
                        </div>
                        <div className="w-full h-px bg-black/5"></div>
                        <div className="flex justify-between w-full px-2">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-text-light text-sm font-medium">Consumed</span>
                                <span className="text-xl font-bold text-text-dark">{macros.calories.current}</span>
                            </div>
                            <div className="w-px h-10 bg-black/5 mx-4"></div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-text-light text-sm font-medium">Target</span>
                                <span className="text-xl font-bold text-text-dark">{macros.calories.target}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Macro Progress Section */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-lg font-bold text-text-dark px-1 font-display">Macro Progress</h2>

                    {/* Protein */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-end px-1">
                            <span className="text-base font-bold text-text-dark">Protein</span>
                            <span className="text-sm font-medium text-text-light">{macros.protein.current}/{macros.protein.target}g</span>
                        </div>
                        <div className="h-4 w-full bg-black/5 rounded-full overflow-hidden shadow-inner-soft">
                            <div
                                className="h-full bg-protein rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${getPercent(macros.protein.current, macros.protein.target)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Carbs */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-end px-1">
                            <span className="text-base font-bold text-text-dark">Carbs</span>
                            <span className="text-sm font-medium text-text-light">{macros.carbs.current}/{macros.carbs.target}g</span>
                        </div>
                        <div className="h-4 w-full bg-black/5 rounded-full overflow-hidden shadow-inner-soft">
                            <div
                                className="h-full bg-carbs rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${getPercent(macros.carbs.current, macros.carbs.target)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Fats */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-end px-1">
                            <span className="text-base font-bold text-text-dark">Fats</span>
                            <span className="text-sm font-medium text-text-light">{macros.fats.current}/{macros.fats.target}g</span>
                        </div>
                        <div className="h-4 w-full bg-black/5 rounded-full overflow-hidden shadow-inner-soft">
                            <div
                                className="h-full bg-fats rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${getPercent(macros.fats.current, macros.fats.target)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <section aria-labelledby="daily-meals-heading" className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 id="daily-meals-heading" className="text-lg font-bold text-text-dark font-display">{mealsTitle}</h2>
                        <span className="text-sm font-semibold text-text-light">
                            {meals.length} {meals.length === 1 ? 'meal' : 'meals'}
                        </span>
                    </div>

                    {meals.length > 0 ? (
                        <ul className="flex flex-col gap-3">
                            {meals.map((meal) => (
                                <li key={meal.id} className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-3.5 shadow-soft">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <span className="material-symbols-outlined" aria-hidden="true">restaurant</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold text-text-dark">{meal.name}</p>
                                        <p className="mt-0.5 truncate text-xs text-text-light">
                                            {[meal.portion, new Date(meal.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })]
                                                .filter(Boolean)
                                                .join(' · ')}
                                        </p>
                                    </div>
                                    <span className="shrink-0 text-xs font-bold text-text-dark">{Math.round(meal.calories)} kcal</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-emerald-900/20 bg-white/70 px-5 py-6 text-center">
                            <p className="text-sm font-semibold text-text-dark">No meals logged yet</p>
                            <p className="mt-1 text-xs text-text-light">Add a meal to see your daily food log here.</p>
                            <button
                                type="button"
                                onClick={onAddFood}
                                className="mt-4 rounded-full bg-[#005f46] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#004b38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005f46]"
                            >
                                Add a meal
                            </button>
                        </div>
                    )}
                </section>
            </main>

            {/* Fixed Action Area */}
            {/* Fixed Action Area - Floating Glass Dock */}
            <div className="fixed z-20 bottom-6 left-0 right-0 mx-auto w-[calc(100%-3rem)] max-w-[400px] flex flex-col gap-2 p-2 rounded-[2.5rem] bg-[#f9f8f4]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/50">
                <button onClick={onAddFood} className="w-full h-14 bg-[#40e830] hover:bg-[#32d625] text-white font-bold text-lg rounded-[2rem] shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                    <span className="material-symbols-outlined">add</span>
                    Add Food
                </button>
                <button
                    onClick={onSuggestMeal}
                    className="w-full h-14 bg-transparent border-2 border-[#40e830] hover:bg-black/5 text-[#0f1b0e] font-bold text-lg rounded-[2rem] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                    <span className="material-symbols-outlined">restaurant_menu</span>
                    Get Meal Suggestions
                </button>
            </div>
        </div>
    );
}
