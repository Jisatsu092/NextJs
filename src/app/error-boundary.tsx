'use client'

export default function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="p-4 bg-red-100 text-red-700 rounded-lg">
      <h2>Terjadi Kesalahan!</h2>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>
        Coba Lagi
      </button>
    </div>
  );
}