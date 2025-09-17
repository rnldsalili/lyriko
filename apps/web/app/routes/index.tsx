export default function Index() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">Lyriko</h1>
        <p className="text-muted-foreground mb-8">
          Your music discovery platform
        </p>
        <div className="space-x-4">
          <a
            className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            href="/login"
          >
            Login
          </a>
          <a
            className="inline-block bg-secondary text-secondary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            href="/signup"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
