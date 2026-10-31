'use client';

import { useState } from 'react';
import Step1Basics from './Step1Basics';
import Step2Goals from './Step2Goals';
import Step3Environment from './Step3Environment';
import type { OnboardingData } from '../../lib/database.types';

interface OnboardingFlowProps {
    onComplete: (data: OnboardingData) => Promise<void>;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
    const [step, setStep] = useState(1);
    const [isCompleting, setIsCompleting] = useState(false);
    const [completionError, setCompletionError] = useState('');
    const [formData, setFormData] = useState<OnboardingData>({
        name: '',
        age: '',
        gender: '',
        height: '',
        weight: '',
        goal: '',
        diet: '',
        activityLevel: '',
        location: '',
        allergies: ''
    });

    const updateData = (newData: Partial<OnboardingData>) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    const handleComplete = async () => {
        setIsCompleting(true);
        setCompletionError('');
        try {
            await onComplete(formData);
        } catch (error) {
            console.error('Failed to finish onboarding:', error);
            setCompletionError(error instanceof Error ? error.message : 'Could not create your plan. Please try again.');
        } finally {
            setIsCompleting(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto h-full min-h-screen bg-background relative overflow-hidden shadow-2xl">
            {step === 1 && (
                <Step1Basics
                    data={formData}
                    onUpdate={updateData}
                    onNext={() => setStep(2)}
                />
            )}
            {step === 2 && (
                <Step2Goals
                    data={formData}
                    onUpdate={updateData}
                    onNext={() => setStep(3)}
                    onBack={() => setStep(1)}
                />
            )}
            {step === 3 && (
                <Step3Environment
                    data={formData}
                    onUpdate={updateData}
                    onComplete={handleComplete}
                    isCompleting={isCompleting}
                    completionError={completionError}
                    onBack={() => setStep(2)}
                />
            )}
        </div>
    );
}
