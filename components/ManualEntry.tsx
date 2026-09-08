'use client';

import { useState } from 'react';
import { analyzeFoodText } from '../app/actions';

interface ManualEntryProps {
    onBack: () => void;
    onAdd: (data: any) => void;
}

export default function ManualEntry({ onBack, onAdd }: ManualEntryProps) {
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleAnalyze = async () => {
        if (!description.trim()) return;

        setIsAnalyzing(true);
        const apiResult = await analyzeFoodText(description + (quantity ? ` (${quantity})` : ''));
        setIsAnalyzing(false);

        if (apiResult.success) {
            setResult(apiResult.data);
        } else {
            alert('Analysis failed: ' + (apiResult.error || 'Unknown error'));
        }
    };

    // Helper to safely parse localized strings like "12g" to numbers
    const parseVal = (val: string | number) => {
        if (typeof val === 'number') return val;
        return parseFloat(val.toString().replace(/[^0-9.]/g, '')) || 0;
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background transition-colors duration-300">
            {/* Top App Bar */}
            <div className="flex items-center p-6 pb-2 justify-between z-10">
                <button
                    onClick={onBack}
                    className="flex size-12 shrink-0 items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-all text-text-main"
                >
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
                <div className="flex gap-4"></div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 flex flex-col px-6 pb-32">
                {/* Headline */}
                <div className="mt-4 mb-8">
                    <h1 className="text-text-main tracking-tight text-[32px] font-bold leading-tight text-left font-display">
                        Add food manually
                    </h1>
                    <p className="text-text-sub text-base font-medium leading-normal pt-2 font-body">
                        Type what you ate — we’ll estimate the rest.
                    </p>
                </div>

                {/* Input Fields */}
                <div className="flex flex-col gap-6">
                    {/* Food Input */}
                    <div className="flex flex-col gap-3">
                        <label className="text-text-main text-sm font-bold ml-1 uppercase tracking-wider font-body" htmlFor="food-input">What did you eat?</label>
                        <div className="relative group">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full resize-none rounded-2xl border-none bg-white text-lg text-text-main placeholder:text-gray-400 p-5 min-h-[120px] focus:ring-2 focus:ring-primary/50 shadow-soft transition-all font-body outline-none"
                                id="food-input"
                                placeholder="e.g., 2 idlis with sambar and a cup of filter coffee"
                            ></textarea>
                            <div className="absolute bottom-4 right-4 text-primary">
                                <span className="material-symbols-outlined">edit</span>
                            </div>
                        </div>
                    </div>
                    {/* Quantity Input */}
                    <div className="flex flex-col gap-3">
                        <label className="text-text-main text-sm font-bold ml-1 uppercase tracking-wider font-body" htmlFor="quantity-input">Quantity (Optional)</label>
                        <input
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full rounded-2xl border-none bg-white text-lg text-text-main placeholder:text-gray-400 p-5 h-16 focus:ring-2 focus:ring-primary/50 shadow-soft transition-all font-body outline-none"
                            id="quantity-input"
                            placeholder="e.g., 1 plate"
                            type="text"
                        />
                    </div>

                    {/* Analyze Button (Visible only if no result yet) */}
                    {!result && (
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !description.trim()}
                            className="w-full mt-4 bg-primary disabled:opacity-50 hover:bg-[#4bd83b] text-white font-bold text-lg h-16 rounded-2xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-display"
                        >
                            {isAnalyzing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">auto_awesome</span>
                                    <span>Analyze Food</span>
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* AI Estimation Card - Dynamic */}
                {result && (
                    <div className="mt-10 animate-fade-in-up">
                        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100 relative overflow-hidden group">
                            {/* Decorative subtle background gradient */}
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-text-sub">AI Estimation Preview</h3>
                                </div>
                                <div className="flex flex-col gap-6">
                                    {/* Header */}
                                    <div>
                                        <h4 className="text-xl font-bold text-text-main capitalize">{result.food_name}</h4>
                                        <p className="text-sm text-text-sub">{result.portion_estimate}</p>
                                    </div>

                                    {/* Main Calorie Display */}
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-extrabold text-text-main tracking-tighter font-display">{parseVal(result.calories)}</span>
                                        <span className="text-xl font-medium text-text-sub font-body">kcal</span>
                                    </div>
                                    {/* Macro Breakdown Pills */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {/* Protein */}
                                        <div className="flex flex-col gap-2 p-3 bg-green-50 rounded-2xl items-center text-center">
                                            <span className="block w-full h-1.5 bg-green-200 rounded-full overflow-hidden">
                                                <span className="block h-full bg-protein rounded-full" style={{ width: '40%' }}></span>
                                            </span>
                                            <div>
                                                <p className="text-lg font-bold text-text-main leading-none font-display">{result.protein}</p>
                                                <p className="text-xs text-text-sub mt-1 font-body">Protein</p>
                                            </div>
                                        </div>
                                        {/* Carbs */}
                                        <div className="flex flex-col gap-2 p-3 bg-orange-50 rounded-2xl items-center text-center">
                                            <span className="block w-full h-1.5 bg-orange-200 rounded-full overflow-hidden">
                                                <span className="block h-full bg-carbs rounded-full" style={{ width: '60%' }}></span>
                                            </span>
                                            <div>
                                                <p className="text-lg font-bold text-text-main leading-none font-display">{result.carbs}</p>
                                                <p className="text-xs text-text-sub mt-1 font-body">Carbs</p>
                                            </div>
                                        </div>
                                        {/* Fat */}
                                        <div className="flex flex-col gap-2 p-3 bg-yellow-50 rounded-2xl items-center text-center">
                                            <span className="block w-full h-1.5 bg-yellow-200 rounded-full overflow-hidden">
                                                <span className="block h-full bg-fats rounded-full" style={{ width: '25%' }}></span>
                                            </span>
                                            <div>
                                                <p className="text-lg font-bold text-text-main leading-none font-display">{result.fats}</p>
                                                <p className="text-xs text-text-sub mt-1 font-body">Fat</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Bottom Action - Visible only if result exists */}
            {result && (
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent max-w-md mx-auto z-20 animate-fade-in-up">
                    <div className="flex flex-col gap-4 items-center">
                        <p className="text-xs text-text-sub text-center font-medium font-body">
                            Estimates only. You can adjust if needed.
                        </p>
                        <button
                            onClick={() => onAdd(result)}
                            className="w-full bg-primary hover:bg-[#4bd83b] text-white font-bold text-lg h-16 rounded-2xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-display"
                        >
                            <span className="material-symbols-outlined">add_circle</span>
                            Add to Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
