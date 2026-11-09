'use client';

import Image from 'next/image';

interface WelcomeScreenProps {
    onStart: () => void;
    onSignIn: () => void;
}

export default function WelcomeScreen({ onStart, onSignIn }: WelcomeScreenProps) {
    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-background font-display antialiased">
            <section className="relative flex min-h-screen flex-col justify-between transition-colors duration-300 lg:hidden">
                <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[40%] w-[50%] rounded-full bg-primary/20 blur-[80px]" />
                <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[40%] w-[50%] rounded-full bg-primary/20 blur-[80px]" />

                <div className="z-10 mx-auto flex w-full max-w-md flex-grow flex-col items-center justify-center px-6 pb-8 pt-20">
                    <div className="mb-8 flex flex-col items-center justify-center">
                        <div className="relative mb-6 flex h-32 w-32 items-center justify-center overflow-hidden rounded-[2rem] bg-transparent p-2">
                            <div className="relative h-full w-full">
                                <Image
                                    src="/logo_transparent.png"
                                    alt="Nutrino Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex max-w-[320px] flex-col items-center text-center">
                        <h1 className="mb-4 text-[40px] font-extrabold leading-[1.1] tracking-tight text-text-dark">
                            Nutrino
                        </h1>
                        <p className="font-body text-lg font-medium leading-relaxed text-text-light">
                            Eat better, without<br />thinking harder.
                        </p>
                    </div>
                </div>

                <div className="z-10 mx-auto flex w-full max-w-md flex-col items-center bg-gradient-to-t from-background via-background px-6 pb-12 pt-4">
                    <button
                        onClick={onStart}
                        className="group relative flex h-14 w-full cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary shadow-lg shadow-primary/20 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                    >
                        <span className="relative z-10 font-body text-[17px] font-bold tracking-wide text-white">Get Started</span>
                        <span className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0" />
                    </button>
                    <button
                        type="button"
                        onClick={onSignIn}
                        className="mt-4 text-sm font-bold text-text-dark underline"
                    >
                        Already have an account? Sign in
                    </button>
                </div>
            </section>

            <section className="relative mx-auto hidden min-h-screen w-full max-w-[1440px] grid-cols-[0.9fr_1.1fr] items-center gap-8 px-12 py-10 lg:grid xl:px-20">
                <div className="pointer-events-none absolute -left-48 top-[-20rem] h-[42rem] w-[42rem] rounded-full bg-primary/10 blur-[100px]" />
                <div className="pointer-events-none absolute bottom-[-20rem] right-[-12rem] h-[40rem] w-[40rem] rounded-full bg-secondary/10 blur-[110px]" />

                <div className="relative z-10 flex flex-col items-start">
                    <div className="mb-16 flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-2xl">
                            <Image src="/logo_transparent.png" alt="" fill sizes="48px" className="object-cover" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-text-dark">Nutrino</span>
                    </div>

                    <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
                        A little more mindful. A lot less effort.
                    </p>
                    <h1 className="max-w-xl text-6xl font-extrabold leading-[1.04] tracking-[-0.055em] text-text-dark xl:text-7xl">
                        Eat better,
                        <br />
                        <span className="text-emerald-600">without thinking</span>
                        <br />
                        harder.
                    </h1>
                    <p className="mt-7 max-w-lg text-lg leading-8 text-text-light">
                        Snap a meal, get the nutrition, and find your rhythm. Your everyday food tracker, made refreshingly simple.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center gap-5">
                        <button
                            onClick={onStart}
                            className="rounded-full bg-[#005f46] px-8 py-4 text-base font-bold text-white shadow-xl shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-[#004b38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
                        >
                            Get started
                        </button>
                        <button
                            type="button"
                            onClick={onSignIn}
                            className="px-2 py-3 text-sm font-bold text-text-dark underline decoration-text-dark/30 underline-offset-4 transition hover:decoration-text-dark"
                        >
                            I already have an account
                        </button>
                    </div>

                    <div className="mt-12 flex items-center gap-3 text-sm text-text-light">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-emerald-800" aria-hidden="true">✓</span>
                        <span>Personal goals, simple daily progress</span>
                    </div>
                </div>

                <div className="relative z-10 mx-auto w-full max-w-[660px]">
                    <div className="absolute -right-7 top-12 h-36 w-36 rounded-full bg-primary/25 blur-3xl" />
                    <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />

                    <div className="relative rotate-[1deg] rounded-[2rem] border border-white/80 bg-white/70 p-3 shadow-[0_35px_100px_-35px_rgba(27,65,41,0.28)] backdrop-blur-sm">
                        <div className="overflow-hidden rounded-[1.5rem] border border-emerald-950/[0.06] bg-[#fbfcf8]">
                            <div className="flex items-center justify-between border-b border-emerald-950/[0.06] bg-white px-7 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-9 w-9 overflow-hidden rounded-xl">
                                        <Image src="/logo_transparent.png" alt="" fill sizes="36px" className="object-cover" />
                                    </div>
                                    <span className="text-sm font-extrabold text-text-dark">Nutrino</span>
                                </div>
                                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                    TODAY
                                </div>
                            </div>

                            <div className="p-7">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-text-light">Monday, October 27</p>
                                        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-text-dark">You&apos;re doing great!</h2>
                                    </div>
                                    <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-xl" aria-hidden="true">☀</div>
                                </div>

                                <div className="mt-6 grid grid-cols-[1.1fr_0.9fr] gap-4">
                                    <div className="rounded-2xl bg-[#163d2b] p-5 text-white">
                                        <p className="text-xs font-semibold text-white/65">Calories remaining</p>
                                        <div className="mt-3 flex items-baseline gap-2">
                                            <span className="text-4xl font-extrabold tracking-tight">1,240</span>
                                            <span className="text-xs text-white/65">kcal</span>
                                        </div>
                                        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
                                            <div className="h-full w-[58%] rounded-full bg-[#61e59a]" />
                                        </div>
                                        <div className="mt-2 flex justify-between text-[11px] text-white/65">
                                            <span>860 eaten</span>
                                            <span>2,100 goal</span>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-emerald-950/[0.06] bg-white p-5">
                                        <p className="text-xs font-bold text-text-light">Daily macros</p>
                                        <div className="mt-4 space-y-3">
                                            {[
                                                { name: 'Protein', amount: '42 / 120g', width: '35%', color: 'bg-[#e88a69]' },
                                                { name: 'Carbs', amount: '86 / 210g', width: '41%', color: 'bg-[#eac75c]' },
                                                { name: 'Fats', amount: '28 / 70g', width: '40%', color: 'bg-[#7890a0]' },
                                            ].map((macro) => (
                                                <div key={macro.name}>
                                                    <div className="mb-1 flex justify-between text-[10px] font-semibold text-text-light">
                                                        <span>{macro.name}</span><span>{macro.amount}</span>
                                                    </div>
                                                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                                                        <div className={`h-full rounded-full ${macro.color}`} style={{ width: macro.width }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                    <h3 className="text-sm font-extrabold text-text-dark">Today&apos;s meals</h3>
                                    <span className="text-xs font-semibold text-emerald-700">2 logged</span>
                                </div>
                                <div className="mt-3 space-y-2.5">
                                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-950/[0.06] bg-white p-3.5">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f7ead8] text-xl" aria-hidden="true">🥑</div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-bold text-text-dark">Avocado toast &amp; eggs</p>
                                            <p className="mt-0.5 text-xs text-text-light">Breakfast · 8:30 AM</p>
                                        </div>
                                        <span className="text-xs font-bold text-text-dark">420 kcal</span>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-950/[0.06] bg-white p-3.5">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fce9df] text-xl" aria-hidden="true">🥗</div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-bold text-text-dark">Colorful nourish bowl</p>
                                            <p className="mt-0.5 text-xs text-text-light">Lunch · 12:45 PM</p>
                                        </div>
                                        <span className="text-xs font-bold text-text-dark">440 kcal</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -bottom-5 -left-10 flex items-center gap-3 rounded-2xl border border-white/80 bg-white px-4 py-3 shadow-xl shadow-emerald-950/10">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-xl" aria-hidden="true">✨</span>
                        <div>
                            <p className="text-xs font-extrabold text-text-dark">Smart food insights</p>
                            <p className="mt-0.5 text-[11px] text-text-light">Just snap and know</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
