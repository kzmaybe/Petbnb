import { useCallback, useEffect, useState } from 'react';
import API from '../services/api.js';

const emptyForm = {
  title: '',
  description: '',
  price: '',
  location: ''
};

const statusBadge = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700'
};

export default function HostDashboard() {
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listingsResponse, bookingsResponse] = await Promise.all([
        API.get('/listings/me'),
        API.get('/bookings/sitter')
      ]);
      setListings(listingsResponse.data);
      setBookings(bookingsResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (listing) => {
    setForm({
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location
    });
    setEditingId(listing.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await API.put(`/listings/${editingId}`, {
          ...form,
          price: Number(form.price)
        });
        setSuccess('Listing updated successfully.');
      } else {
        await API.post('/listings', {
          ...form,
          price: Number(form.price)
        });
        setSuccess('Listing created! Pet parents can now discover it on the marketplace.');
      }
      resetForm();
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong while saving the listing.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing? Bookings associated with it will also be removed.')) {
      return;
    }
    try {
      await API.delete(`/listings/${id}`);
      setSuccess('Listing deleted successfully.');
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete the listing.');
    }
  };

  return (
    <section className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Host dashboard</h1>
        <p className="text-sm text-slate-500">
          Manage your listings and respond to booking requests from pet parents in one place.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[2fr,3fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-slate-900">
              {editingId ? 'Update your listing' : 'Create a new listing'}
            </h2>
            <p className="text-sm text-slate-500">
              Fill in the details and showcase what makes your pet sitting experience special.
            </p>

            {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
            {success && <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-600">{success}</p>}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-600" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Cozy apartment with a private yard"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Share what pets can expect during their stay, amenities, routine, etc."
                  className="input"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-600" htmlFor="price">
                    Price per night (USD)
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600" htmlFor="location">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    placeholder="Austin, TX"
                    className="input"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                {editingId && (
                  <button
                    type="button"
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700"
                    onClick={resetForm}
                  >
                    Cancel edit
                  </button>
                )}
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update listing' : 'Publish listing'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Your listings</h2>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                {listings.length} active
              </span>
            </div>
            {loading ? (
              <p className="mt-4 text-sm text-slate-500">Loading your beautiful spaces...</p>
            ) : listings.length === 0 ? (
              <p className="mt-4 rounded-lg bg-slate-100 p-4 text-sm text-slate-500">
                You have not published any listings yet. Create one to welcome your first furry guest.
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {listings.map((listing) => (
                  <li key={listing.id} className="rounded-2xl border border-slate-100 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{listing.title}</h3>
                        <p className="text-sm text-slate-500">{listing.location}</p>
                        <p className="mt-2 text-sm text-slate-600">{listing.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-brand">${Number(listing.price).toFixed(2)}</p>
                        <p className="text-xs text-slate-500">per night</p>
                        <div className="mt-3 flex gap-2">
                          <button className="btn-primary" type="button" onClick={() => handleEdit(listing)}>
                            Edit
                          </button>
                          <button
                            className="btn-primary bg-rose-500 hover:bg-rose-600"
                            type="button"
                            onClick={() => handleDelete(listing.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-slate-900">Booking requests</h2>
            {loading ? (
              <p className="mt-4 text-sm text-slate-500">Checking for new requests...</p>
            ) : bookings.length === 0 ? (
              <p className="mt-4 rounded-lg bg-slate-100 p-4 text-sm text-slate-500">
                No booking requests yet. Share your listing to get the word out!
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {bookings.map((booking) => (
                  <li key={booking.id} className="rounded-2xl border border-slate-100 p-4 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{booking.User?.name}</p>
                        <p className="text-xs text-slate-500">{booking.User?.email}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          Requested {booking.Listing?.title} from {new Date(booking.startDate).toLocaleDateString()} to{' '}
                          {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusBadge[booking.status] || 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {booking.status}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="btn-primary bg-emerald-500 hover:bg-emerald-600"
                            onClick={async () => {
                              await API.put(`/bookings/${booking.id}`, { status: 'approved' });
                              await fetchData();
                            }}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="btn-primary bg-rose-500 hover:bg-rose-600"
                            onClick={async () => {
                              await API.put(`/bookings/${booking.id}`, { status: 'rejected' });
                              await fetchData();
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
