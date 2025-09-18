export default function ListingCard({ listing, onBook, canBook }) {
  const sitter = listing.User;

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-slate-900">{listing.title}</h3>
        <p className="text-sm text-slate-600">{listing.description}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
            <span aria-hidden className="text-base">📍</span>
            {listing.location}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
            <span aria-hidden className="text-base">🧑‍🦰</span>
            Hosted by {sitter?.name || 'Pet sitter'}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-sm text-slate-500">Starting at</p>
          <p className="text-xl font-bold text-brand">
            ${Number(listing.price).toFixed(2)} <span className="text-sm font-medium text-slate-500">/ night</span>
          </p>
        </div>
        {canBook && (
          <button type="button" className="btn-primary" onClick={() => onBook(listing)}>
            <span aria-hidden className="mr-2 text-lg">📅</span> Book
          </button>
        )}
      </div>
    </article>
  );
}
