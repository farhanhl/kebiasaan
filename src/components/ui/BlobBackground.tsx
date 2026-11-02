export function BlobBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
    </div>
  );
}

