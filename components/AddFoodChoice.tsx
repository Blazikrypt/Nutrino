'use client';

import { useRef, useState } from 'react';
import { analyzeFoodImage } from '../app/actions';
import { resizeImage } from '../lib/imageUtils';

interface AddFoodChoiceProps {
    onBack: () => void;
    onAnalysisComplete: (result: any, imageSrc: string) => void;
    onManualEntry: () => void;
}

export default function AddFoodChoice({ onBack, onAnalysisComplete, onManualEntry }: AddFoodChoiceProps) {
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showSourceChoice, setShowSourceChoice] = useState(false);
    const [imageToAnalyze, setImageToAnalyze] = useState<{ blob: Blob; imageSrc: string } | null>(null);
    const [analysisError, setAnalysisError] = useState('');

    const runAnalysis = async (blob: Blob, imageSrc: string) => {
        setIsAnalyzing(true);
        setAnalysisError('');

        try {
            const formData = new FormData();
            formData.append('image', blob, 'image.jpg');
            const result = await analyzeFoodImage(formData);

            if (result.success) {
                onAnalysisComplete(result.data, imageSrc);
            } else {
                setAnalysisError(result.error);
            }
        } catch (error) {
            console.error('Image analysis request failed:', error);
            setAnalysisError('Could not analyze the image. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Initial Click - Show Choice
    const handleScanClick = () => {
        setShowSourceChoice(true);
    };

    const handleCameraSelect = () => {
        setShowSourceChoice(false);
        cameraInputRef.current?.click();
    };

    const handleGallerySelect = () => {
        setShowSourceChoice(false);
        galleryInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create a preview URL immediately
        const imageSrc = URL.createObjectURL(file);

        setShowSourceChoice(false); // Ensure modal is closed
        setImageToAnalyze(null);
        setAnalysisError('');

        try {
            // Resize image to avoid payload limits (max 1024px)
            const resizedBlob = await resizeImage(file, 1024, 0.8);
            const pendingImage = { blob: resizedBlob, imageSrc };
            setImageToAnalyze(pendingImage);
            await runAnalysis(pendingImage.blob, pendingImage.imageSrc);
        } catch (error) {
            console.error('Error processing image:', error);
            URL.revokeObjectURL(imageSrc);
            setAnalysisError('Could not prepare the image. Please choose it again.');
        } finally {
            // Reset inputs so same file can be selected again if needed
            if (cameraInputRef.current) cameraInputRef.current.value = '';
            if (galleryInputRef.current) galleryInputRef.current.value = '';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-display">
            {/* Hidden File Inputs */}
            <input
                type="file"
                ref={cameraInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                capture="environment"
            />
            <input
                type="file"
                ref={galleryInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />

            <div className="relative flex w-full max-w-md flex-col overflow-hidden bg-[#f6f8f6] rounded-[2rem] shadow-xl h-auto min-h-[500px] text-[#0f1b0e] transition-colors duration-200">

                {/* Header: TopAppBar */}
                <div className="flex items-center p-4 justify-end shrink-0 z-10">
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center rounded-full h-10 w-10 bg-transparent text-[#0f1b0e] hover:bg-black/5 transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>close</span>
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col justify-center px-6 pb-12 gap-8 relative">
                    {/* Source Choice Overlay */}
                    {showSourceChoice && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in zoom-in duration-200 rounded-[2rem] p-6 text-center">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Choose Source</h2>
                            <div className="flex gap-4 w-full justify-center">
                                <button
                                    onClick={handleCameraSelect}
                                    className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-primary hover:bg-primary/5 w-32 transition-all active:scale-95"
                                >
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined !text-[28px]">photo_camera</span>
                                    </div>
                                    <span className="font-bold text-slate-700">Camera</span>
                                </button>
                                <button
                                    onClick={handleGallerySelect}
                                    className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 w-32 transition-all active:scale-95"
                                >
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <span className="material-symbols-outlined !text-[28px]">photo_library</span>
                                    </div>
                                    <span className="font-bold text-slate-700">Gallery</span>
                                </button>
                            </div>
                            <button
                                onClick={() => setShowSourceChoice(false)}
                                className="mt-8 text-slate-500 font-medium hover:text-slate-800"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {/* Headline */}
                    <div className="flex flex-col gap-2 text-center mb-4">
                        <h1 className="text-[#0f1b0e] tracking-tight text-[32px] font-extrabold leading-[1.2]">
                            How would you like to add food?
                        </h1>
                    </div>

                    {/* Cards Container */}
                    <div className="flex flex-col gap-5">
                        {/* Primary Card: Scan Food */}
                        <button
                            onClick={handleScanClick}
                            className="group relative flex items-center justify-between gap-4 rounded-xl p-6 w-full text-left transition-all duration-200 border-2 border-[#40e830]/30 hover:border-[#40e830] shadow-[0_4px_12px_rgba(64,232,48,0.15)] bg-white"
                        >
                            <div className="flex flex-col gap-1.5 flex-1">
                                <span className="text-[#0f1b0e] text-xl font-bold leading-tight">Scan Food</span>
                                <span className="text-[#54974e] text-sm font-medium leading-normal">Use your camera or a photo</span>
                            </div>
                            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#40e830]/20 text-[#40e830] group-hover:bg-[#40e830] group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>center_focus_strong</span>
                            </div>
                            {/* Loading Overlay */}
                            {isAnalyzing && (
                                <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-xl backdrop-blur-[1px]">
                                    <div className="w-6 h-6 border-2 border-[#40e830] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </button>

                        {/* Secondary Card: Manual Entry */}
                        <button
                            onClick={onManualEntry}
                            className="group relative flex items-center justify-between gap-4 rounded-xl p-6 w-full text-left transition-all duration-200 border border-transparent bg-white shadow-sm hover:shadow-md hover:border-gray-200"
                        >
                            <div className="flex flex-col gap-1.5 flex-1">
                                <span className="text-[#0f1b0e] text-xl font-bold leading-tight">Manual Entry</span>
                                <span className="text-gray-500 text-sm font-medium leading-normal">Type it in yourself</span>
                            </div>
                            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors">
                                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>keyboard</span>
                            </div>
                        </button>
                    </div>
                </div>

                {analysisError && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-center" role="alert">
                        <p className="text-sm font-medium text-red-700">{analysisError}</p>
                        {imageToAnalyze && (
                            <button
                                type="button"
                                onClick={() => runAnalysis(imageToAnalyze.blob, imageToAnalyze.imageSrc)}
                                disabled={isAnalyzing}
                                className="mt-3 rounded-full bg-white px-5 py-2 text-sm font-bold text-red-700 shadow-sm disabled:opacity-50"
                            >
                                {isAnalyzing ? 'Retrying…' : 'Retry'}
                            </button>
                        )}
                    </div>
                )}

                {/* Footer Spacer */}
                <div className="h-6 shrink-0"></div>
            </div>
        </div>
    );
}
