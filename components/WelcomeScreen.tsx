'use client';

import Image from 'next/image';

interface WelcomeScreenProps {
    onStart: () => void;
    onSignIn: () => void;
}

export default function WelcomeScreen({ onStart, onSignIn }: WelcomeScreenProps) {
    return (
        <div className="relative flex h-full min-h-screen w-full flex-col justify-between overflow-hidden bg-background transition-colors duration-300 antialiased font-display">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

            {/* Main Content */}
            <div className="z-10 flex flex-col items-center justify-center flex-grow w-full px-6 pt-20 pb-8 max-w-md mx-auto">
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="relative flex items-center justify-center w-32 h-32 mb-6 bg-transparent rounded-[2rem] overflow-hidden p-2">
                        <div className="w-full h-full relative">
                            <Image
                                src="/logo_transparent.png"
                                alt="Nutrino Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center text-center max-w-[320px]">
                    <h1 className="text-text-dark text-[40px] font-extrabold tracking-tight leading-[1.1] mb-4 font-display">
                        Nutrino
                    </h1>
                    <p className="text-text-light text-lg font-medium leading-relaxed font-body">
                        Eat better, without<br />thinking harder.
                    </p>
                </div>
            </div>

            {/* Footer / CTA */}
            <div className="z-10 w-full px-6 pb-12 pt-4 bg-gradient-to-t from-background via-background to-transparent flex flex-col items-center max-w-md mx-auto">
                <button
                    onClick={onStart}
                    className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 bg-primary hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20"
                >
                    <span className="relative z-10 text-white text-[17px] font-bold tracking-wide font-body">Get Started</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
                <button
                    type="button"
                    onClick={onSignIn}
                    className="mt-4 text-sm font-bold text-text-dark underline"
                >
                    Already have an account? Sign in
                </button>
            </div>
        </div>
    );
}
