import { useEffect, useState } from 'react';
import API from '../services/api.js';

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));
}

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700'
};

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    API.get('/bookings/owner')
      .then((response) => {
        if (!ignore) {
          setBookings(response.data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.message || 'Unable to load your bookings.');
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Your bookings</h1>
        <p className="text-sm text-slate-500">
          Track the status of each stay, keep an eye on dates, and check in with your sitter when needed.
        </p>
      </header>

      {loading && <p className="text-slate-500">Fetching your past and upcoming adventures...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          You have not requested a stay yet. Browse the home page to find the perfect host.
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3">Listing</th>
                <th className="px-6 py-3">Stay dates</th>
                <th className="px-6 py-3">Host</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{booking.Listing?.title}</p>
                    <p className="text-xs text-slate-500">{booking.Listing?.location}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p>{formatDate(booking.startDate)}</p>
                    <p className="text-xs text-slate-500">to {formatDate(booking.endDate)}</p>
                  </td>
                  <td className="px-6 py-4">
                    {booking.Listing?.User ? (
                      <>
                        <p className="font-medium text-slate-900">{booking.Listing.User.name}</p>
                        <p className="text-xs text-slate-500">{booking.Listing.User.email}</p>
                      </>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[booking.status] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
