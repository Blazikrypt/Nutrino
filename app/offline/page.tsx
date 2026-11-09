export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-text-dark">
      <span className="material-symbols-outlined text-5xl text-primary" aria-hidden="true">
        cloud_off
      </span>
      <h1 className="mt-5 text-2xl font-bold">You&apos;re offline</h1>
      <p className="mt-2 max-w-sm text-text-light">
        Reconnect to the internet to sign in and sync your meals. Your account data is not stored for offline use.
      </p>
      <form action="/" method="get" className="mt-6">
        <button type="submit" className="rounded-full bg-primary px-6 py-3 font-bold text-white">
          Try again
        </button>
      </form>
    </main>
  );
}
