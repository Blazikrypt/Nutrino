'use client';

import { useState } from 'react';
import { createClient } from '../lib/supabase/client';

interface AuthScreenProps {
    onBack: () => void;
}

export default function AuthScreen({ onBack }: AuthScreenProps) {
    const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-up');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setError('');
        setMessage('');

        try {
            const supabase = createClient();
            if (mode === 'sign-up') {
                const { data, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (authError) throw authError;
                if (!data.session) {
                    setMessage('Check your email to confirm your account, then sign in.');
                }
            } else {
                const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
                if (authError) throw authError;
            }
        } catch (authError) {
            console.error('Supabase authentication failed.', authError);
            setError(authError instanceof Error ? authError.message : 'Authentication failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
            <section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-soft">
                <button type="button" onClick={onBack} className="mb-6 text-sm font-semibold text-text-light">
                    ← Back
                </button>
                <h1 className="text-3xl font-extrabold text-text-dark">
                    {mode === 'sign-up' ? 'Create your account' : 'Welcome back'}
                </h1>
                <p className="mt-2 text-sm text-text-light">
                    {mode === 'sign-up'
                        ? 'Create an account to start your personal nutrition plan.'
                        : 'Sign in to continue to your nutrition plan.'}
                </p>

                <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
                    <label className="flex flex-col gap-2 text-sm font-semibold text-text-dark">
                        Email
                        <input
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="h-12 rounded-xl border border-gray-200 px-4 outline-none focus:border-primary"
                        />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-semibold text-text-dark">
                        Password
                        <input
                            type="password"
                            autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
                            minLength={8}
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="h-12 rounded-xl border border-gray-200 px-4 outline-none focus:border-primary"
                        />
                        {mode === 'sign-up' && <span className="text-xs font-normal text-text-light">At least 8 characters.</span>}
                    </label>

                    {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
                    {message && <p className="text-sm text-green-700" role="status">{message}</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-2 h-14 rounded-full bg-primary font-bold text-white disabled:cursor-wait disabled:opacity-60"
                    >
                        {submitting ? 'Please wait…' : mode === 'sign-up' ? 'Create account' : 'Sign in'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-text-light">
                    {mode === 'sign-up' ? 'Already have an account?' : 'New to Nutrino?'}{' '}
                    <button
                        type="button"
                        onClick={() => {
                            setMode(mode === 'sign-up' ? 'sign-in' : 'sign-up');
                            setError('');
                            setMessage('');
                        }}
                        className="font-bold text-text-dark underline"
                    >
                        {mode === 'sign-up' ? 'Sign in' : 'Create account'}
                    </button>
                </p>
            </section>
        </main>
    );
}
