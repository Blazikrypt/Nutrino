'use client';

import type { OnboardingData } from '../../lib/database.types';

interface Step3EnvironmentProps {
    data: Pick<OnboardingData, 'location' | 'allergies'>;
    onUpdate: (data: Partial<OnboardingData>) => void;
    onComplete: () => void;
    isCompleting: boolean;
    completionError: string;
    onBack: () => void;
}

export default function Step3Environment({
    data,
    onUpdate,
    onComplete,
    isCompleting,
    completionError,
    onBack,
}: Step3EnvironmentProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.target.id === 'location') {
            onUpdate({ location: e.target.value });
        } else {
            onUpdate({ allergies: e.target.value });
        }
    };

    return (
        <div className="flex flex-col h-full bg-background min-h-screen">
            <header className="flex w-full flex-col items-center justify-center gap-3 pt-8 pb-4 relative">
                <button onClick={onBack} className="absolute left-6 top-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors">
                    <span className="material-symbols-outlined text-text-dark" style={{ fontSize: '20px' }}>arrow_back_ios_new</span>
                </button>
                <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary/30"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-primary/30"></div>
                    <div className="h-2.5 w-8 rounded-full bg-primary shadow-sm shadow-primary/30"></div>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-text-light">Step 3 of 3</span>
            </header>

            <main className="flex flex-1 flex-col px-6 pt-2 pb-6">
                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-text-dark mb-3 font-display">
                        Tell us about your<br />
                        <span className="text-primary">food world</span>
                    </h1>
                    <p className="text-lg font-medium text-text-light leading-relaxed font-body">
                        So we can suggest meals that fit your culture and availability.
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2 group">
                        <label className="text-base font-semibold pl-1 text-text-dark font-body" htmlFor="location">
                            Where are you based?
                        </label>
                        <div className="relative flex items-center transition-transform duration-200 focus-within:scale-[1.01]">
                            <span className="material-symbols-outlined absolute left-4 text-primary/80" style={{ fontSize: '24px' }}>location_on</span>
                            <input
                                id="location"
                                value={data.location}
                                onChange={handleChange}
                                className="w-full rounded-xl border-none bg-white py-4 pl-12 pr-4 text-base font-medium text-text-dark placeholder-gray-400 shadow-sm ring-1 ring-transparent focus:ring-2 focus:ring-primary/50 focus:outline-none h-16"
                                placeholder="City, Country"
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 group">
                        <div className="flex items-baseline justify-between pl-1">
                            <label className="text-base font-semibold text-text-dark font-body" htmlFor="allergies">
                                Any allergies or foods to avoid?
                            </label>
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Optional</span>
                        </div>
                        <div className="relative flex transition-transform duration-200 focus-within:scale-[1.01]">
                            <span className="material-symbols-outlined absolute left-4 top-4 text-primary/80" style={{ fontSize: '24px' }}>spa</span>
                            <textarea
                                id="allergies"
                                value={data.allergies}
                                onChange={handleChange}
                                className="w-full resize-none rounded-xl border-none bg-white py-4 pl-12 pr-4 text-base font-medium text-text-dark placeholder-gray-400 shadow-sm ring-1 ring-transparent focus:ring-2 focus:ring-primary/50 focus:outline-none min-h-[140px]"
                                placeholder="Peanuts, Shellfish, Gluten..."
                            ></textarea>
                        </div>
                        <p className="pl-1 text-sm text-gray-500 font-body">
                            We&apos;ll hide recipes containing these ingredients.
                        </p>
                    </div>
                </div>

                <div className="flex-1"></div>

                <div className="mt-8 flex flex-col items-center gap-4">
                    <span className="text-sm font-semibold text-gray-400">You’re all set.</span>
                    {completionError && (
                        <p className="w-full text-center text-sm font-medium text-red-700" role="alert">
                            {completionError}
                        </p>
                    )}
                    <button
                        onClick={onComplete}
                        disabled={isCompleting}
                        className="relative w-full overflow-hidden rounded-full bg-primary p-5 text-center font-bold text-text-dark shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
                    >
                        <span className="relative z-10 text-lg">
                            {isCompleting ? 'Creating your plan…' : completionError ? 'Retry' : 'Create My Plan'}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                    </button>
                </div>
            </main>

            {/* Background Blobs (Fixed) */}
            <div className="fixed top-[-10%] right-[-10%] h-96 w-96 rounded-full bg-primary/5 blur-3xl pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] left-[-10%] h-96 w-96 rounded-full bg-[#d2e7d0]/20 blur-3xl pointer-events-none z-0"></div>
        </div>
    );
}
