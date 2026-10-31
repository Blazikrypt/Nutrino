'use client';

import { useState } from 'react';
import type { OnboardingData } from '../../lib/database.types';

interface Step1BasicsProps {
    data: Pick<OnboardingData, 'name' | 'age' | 'gender' | 'height' | 'weight'>;
    onUpdate: (data: Partial<OnboardingData>) => void;
    onNext: () => void;
}

export default function Step1Basics({ data, onUpdate, onNext }: Step1BasicsProps) {
    const [error, setError] = useState('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onUpdate({ [name]: value } as Partial<OnboardingData>);
    };

    const handleGenderSelect = (gender: OnboardingData['gender']) => {
        onUpdate({ gender });
    };

    const handleNext = () => {
        const age = Number(data.age);
        const height = Number(data.height);
        const weight = Number(data.weight);

        if (!data.name.trim()) {
            setError('Enter your name to continue.');
        } else if (!Number.isInteger(age) || age < 18 || age > 100) {
            setError('Enter an age between 18 and 100.');
        } else if (!Number.isFinite(height) || height < 100 || height > 250) {
            setError('Enter a height between 100 and 250 cm.');
        } else if (!Number.isFinite(weight) || weight < 30 || weight > 350) {
            setError('Enter a weight between 30 and 350 kg.');
        } else if (!data.gender) {
            setError('Choose an option for gender.');
        } else {
            setError('');
            onNext();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-6 pb-32">
                <div className="mt-4 mb-8 text-center sm:text-left">
                    <h1 className="text-text-dark tracking-tight text-3xl sm:text-4xl font-extrabold leading-tight mb-3 font-display">
                        Let’s start with the basics
                    </h1>
                    <p className="text-text-light text-lg font-medium leading-normal font-body">
                        This helps us personalize your nutrition.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Name */}
                    <div className="flex flex-col gap-3">
                        <label className="text-text-dark text-base font-bold ml-1 font-body" htmlFor="name">Name</label>
                        <div className="relative group">
                            <input
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                className="w-full h-16 rounded-2xl border-none bg-white text-text-dark px-6 text-lg font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-primary/50 shadow-soft transition-all"
                                id="name"
                                placeholder="Enter your name"
                                type="text"
                                autoComplete="name"
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                                <span className="material-symbols-outlined">person</span>
                            </div>
                        </div>
                    </div>
                    {/* Age */}
                    <div className="flex flex-col gap-3">
                        <label className="text-text-dark text-base font-bold ml-1 font-body" htmlFor="age">Age</label>
                        <div className="relative group">
                            <input
                                name="age"
                                value={data.age}
                                onChange={handleChange}
                                className="w-full h-16 rounded-2xl border-none bg-white text-text-dark px-6 text-lg font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-primary/50 shadow-soft transition-all"
                                id="age"
                                inputMode="numeric"
                                placeholder="e.g. 28"
                                type="number"
                                min="18"
                                max="100"
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                                <span className="material-symbols-outlined">cake</span>
                            </div>
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col gap-3">
                        <label className="text-text-dark text-base font-bold ml-1 font-body">Gender</label>
                        <div className="flex flex-wrap gap-3">
                            {([
                                ['female', 'Female'],
                                ['male', 'Male'],
                                ['non_binary', 'Non-binary'],
                            ] as const).map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => handleGenderSelect(value)}
                                    className={`flex h-12 flex-1 min-w-[100px] cursor-pointer items-center justify-center gap-x-2 rounded-full px-6 transition-all active:scale-95 border-2 ${data.gender === value
                                        ? 'bg-primary/20 border-primary text-text-dark font-bold'
                                        : 'bg-white border-transparent text-text-light font-medium shadow-soft hover:bg-gray-50'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Height & Weight */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-3">
                            <label className="text-text-dark text-base font-bold ml-1 font-body" htmlFor="height">Height</label>
                            <div className="relative">
                                <input
                                    name="height"
                                    value={data.height}
                                    onChange={handleChange}
                                    className="w-full h-16 rounded-2xl border-none bg-white text-text-dark px-6 text-lg font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-primary/50 shadow-soft transition-all"
                                    id="height"
                                    inputMode="numeric"
                                    placeholder="0"
                                    type="number"
                                    min="100"
                                    max="250"
                                    step="0.1"
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-medium pointer-events-none">cm</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="text-text-dark text-base font-bold ml-1 font-body" htmlFor="weight">Weight</label>
                            <div className="relative">
                                <input
                                    name="weight"
                                    value={data.weight}
                                    onChange={handleChange}
                                    className="w-full h-16 rounded-2xl border-none bg-white text-text-dark px-6 text-lg font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-primary/50 shadow-soft transition-all"
                                    id="weight"
                                    inputMode="numeric"
                                    placeholder="0"
                                    type="number"
                                    min="30"
                                    max="350"
                                    step="0.1"
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-medium pointer-events-none">kg</span>
                            </div>
                            {error && <p className="mt-5 text-center text-sm font-medium text-red-700" role="alert">{error}</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background via-background/95 to-transparent pt-12 pb-8 px-6">
                <button
                    onClick={handleNext}
                    className="group w-full h-14 rounded-full bg-primary hover:bg-[#4bd83b] text-text-dark text-lg font-bold shadow-glow flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                    Next
                    <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </button>
            </div>
        </div>
    );
}
