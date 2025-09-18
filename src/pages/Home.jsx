import { useContext, useEffect, useMemo, useState } from 'react';
import ListingCard from '../components/ListingCard.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import API from '../services/api.js';

const defaultBookingForm = { startDate: '', endDate: '' };

export default function Home() {
  const { user } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [bookingForm, setBookingForm] = useState(defaultBookingForm);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    API.get('/listings')
      .then((response) => {
        if (!ignore) {
          setListings(response.data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.message || 'Unable to load listings right now.');
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

  const filteredListings = useMemo(() => {
    if (!search) return listings;
    return listings.filter((listing) => {
      const query = search.toLowerCase();
      return (
        listing.title.toLowerCase().includes(query) ||
        listing.location.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query)
      );
    });
  }, [listings, search]);

  const canBook = user?.role === 'owner';

  const handleBookClick = (listing) => {
    setSelectedListing(listing);
    setBookingForm(defaultBookingForm);
    setBookingError('');
    setBookingMessage('');
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();
    if (!selectedListing) return;

    setSubmitting(true);
    setBookingMessage('');
    setBookingError('');
    try {
      await API.post('/bookings', {
        listingId: selectedListing.id,
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate
      });
      setBookingMessage('Booking requested successfully! Sit tight while the host reviews your request.');
      setBookingForm(defaultBookingForm);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Unable to create the booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-12">
      <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="grid gap-10 p-8 md:grid-cols-2 md:p-12">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-4 py-1 text-sm font-semibold text-brand">
              Trusted pet stays, anywhere
            </span>
            <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
              Find the perfect home for your furry friend while you are away.
            </h1>
            <p className="text-lg text-slate-600">
              Browse verified sitters, compare amenities, and book secure stays in minutes. PetBnB connects caring hosts
              with pet parents for stress-free travel.
            </p>
            <div className="relative">
              <label className="sr-only" htmlFor="search">
                Search listings
              </label>
              <input
                id="search"
                className="input"
                placeholder="Search by city, host, or vibe"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 translate-x-10 translate-y-6 rounded-3xl bg-brand/10 blur-2xl" />
            <div className="relative rounded-3xl border border-brand/20 bg-white/80 p-6 shadow-2xl backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">Why Pet Parents love us</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>• Vetted and reviewed sitters in every major city</li>
                <li>• Real-time messaging and booking status updates</li>
                <li>• Insurance coverage for both sitters and pets</li>
                <li>• Transparent pricing with no surprise fees</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {loading && <p className="text-center text-slate-500">Loading curated stays...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="space-y-6">
          <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
            <h2 className="text-2xl font-semibold text-slate-900">Featured stays</h2>
            <p className="text-sm text-slate-500">{filteredListings.length} places ready for cuddles.</p>
          </div>
          {filteredListings.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
              No listings match your search yet. Try a different city or clear the search term.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} onBook={handleBookClick} canBook={canBook} />
              ))}
            </div>
          )}
        </div>
      )}

      {selectedListing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Book {selectedListing.title}</h3>
                <p className="text-sm text-slate-500">Hosted in {selectedListing.location}</p>
              </div>
              <button
                type="button"
                className="text-slate-500 transition hover:text-slate-800"
                onClick={() => setSelectedListing(null)}
              >
                Close
              </button>
            </div>

            {bookingMessage && <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">{bookingMessage}</p>}
            {bookingError && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{bookingError}</p>}

            {!bookingMessage && (
              <form className="mt-6 space-y-4" onSubmit={handleBookingSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-600" htmlFor="startDate">
                    Start date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    required
                    className="input"
                    value={bookingForm.startDate}
                    onChange={(event) =>
                      setBookingForm((prev) => ({ ...prev, startDate: event.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600" htmlFor="endDate">
                    End date
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    required
                    className="input"
                    min={bookingForm.startDate || undefined}
                    value={bookingForm.endDate}
                    onChange={(event) => setBookingForm((prev) => ({ ...prev, endDate: event.target.value }))}
                  />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700"
                    onClick={() => setSelectedListing(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Sending request...' : 'Request booking'}
                  </button>
                </div>
              </form>
            )}

            {!canBook && (
              <p className="mt-6 rounded-lg bg-slate-100 p-3 text-sm text-slate-500">
                Want to book a stay? Create an owner account to send booking requests.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
