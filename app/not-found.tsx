import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-display font-black text-gradient leading-none mb-4">404</p>
        <h1 className="text-2xl font-display font-bold text-white mb-3">Page not found</h1>
        <p className="text-text-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary inline-flex">
          Back to home
        </Link>
      </div>
    </div>
  );
}
