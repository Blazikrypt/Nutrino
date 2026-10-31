'use client';

interface NotificationsProps {
    onBack: () => void;
}

export default function Notifications({ onBack }: NotificationsProps) {
    return (
        <div className="min-h-screen bg-background font-display text-text-dark">
            <header className="mx-auto flex w-full max-w-md items-center justify-between px-6 py-6">
                <button type="button" onClick={onBack} aria-label="Back" className="rounded-full p-2 hover:bg-black/5">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-xl font-bold">Notifications</h1>
                <div className="w-10" />
            </header>
            <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
                <span className="material-symbols-outlined text-5xl text-gray-300">notifications_none</span>
                <p className="mt-4 text-lg font-bold">No notifications yet</p>
                <p className="mt-2 text-sm text-text-light">Updates will appear here when available.</p>
            </main>
        </div>
    );
}
