export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-asphalt" role="status" aria-live="polite">
      <div className="w-48">
        <div className="lane animate-pulse text-silver" />
        <p className="eyebrow mt-4 text-center text-steel">Loading</p>
      </div>
    </div>
  );
}
