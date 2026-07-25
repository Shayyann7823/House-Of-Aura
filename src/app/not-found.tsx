import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-display text-7xl font-semibold">404</h1>
        <h2 className="mt-4 text-xl">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" className="mt-6 inline-block bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-[0.2em]">
          Back home
        </Link>
      </div>
    </div>
  );
}
