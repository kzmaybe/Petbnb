const STORAGE_KEY = 'petbnb:data';

const fallbackStorage = (() => {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, value);
    },
    removeItem(key) {
      store.delete(key);
    }
  };
})();

const storage = typeof window !== 'undefined' && window.localStorage ? window.localStorage : fallbackStorage;

const seedData = {
  users: [
    { id: 1, name: 'Jamie Rivera', email: 'jamie@petbnb.com', password: 'demo1234', role: 'sitter' },
    { id: 2, name: 'Morgan Patel', email: 'morgan@petbnb.com', password: 'demo1234', role: 'owner' },
    { id: 3, name: 'Avery West', email: 'avery@petbnb.com', password: 'demo1234', role: 'sitter' }
  ],
  listings: [
    {
      id: 1,
      hostId: 1,
      title: 'Sunny backyard bungalow',
      description: 'Fenced yard, daily walks, and constant companionship for energetic pups.',
      price: 62,
      location: 'Austin, TX'
    },
    {
      id: 2,
      hostId: 1,
      title: 'Downtown loft with skyline views',
      description: 'Loft apartment with a cozy sunroom—perfect for cats who love to lounge.',
      price: 54,
      location: 'Seattle, WA'
    },
    {
      id: 3,
      hostId: 3,
      title: 'Quiet suburban retreat',
      description: 'Spacious home with a shaded patio and separate play area for smaller pets.',
      price: 48,
      location: 'Columbus, OH'
    }
  ],
  bookings: [
    {
      id: 1,
      listingId: 1,
      ownerId: 2,
      startDate: '2024-11-18',
      endDate: '2024-11-22',
      status: 'approved'
    },
    {
      id: 2,
      listingId: 2,
      ownerId: 2,
      startDate: '2024-12-05',
      endDate: '2024-12-08',
      status: 'pending'
    },
    {
      id: 3,
      listingId: 3,
      ownerId: 2,
      startDate: '2025-01-11',
      endDate: '2025-01-14',
      status: 'pending'
    }
  ]
};

function ensureSeeded() {
  if (!storage.getItem(STORAGE_KEY)) {
    storage.setItem(STORAGE_KEY, JSON.stringify(seedData));
  }
}

function loadData() {
  ensureSeeded();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(seedData));
  } catch (error) {
    return JSON.parse(JSON.stringify(seedData));
  }
}

function saveData(data) {
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function createError(message, status = 400) {
  return {
    response: {
      status,
      data: { message }
    }
  };
}

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}

function createToken(user) {
  return `petbnb-user-${user.id}`;
}

function getCurrentUser(data) {
  const token = storage.getItem('token');
  if (!token) return null;
  const match = token.match(/^petbnb-user-(\d+)$/);
  if (!match) return null;
  const id = Number(match[1]);
  return data.users.find((user) => user.id === id) || null;
}

function requireAuth(data) {
  const user = getCurrentUser(data);
  if (!user) {
    storage.removeItem('token');
    storage.removeItem('user');
    throw createError('You need to be logged in to perform this action.', 401);
  }
  return user;
}

function nextId(collection) {
  return collection.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

function withListingDetails(listing, data) {
  const host = data.users.find((user) => user.id === listing.hostId);
  return {
    ...listing,
    User: host ? sanitizeUser(host) : null
  };
}

function withBookingDetails(booking, data) {
  const owner = data.users.find((user) => user.id === booking.ownerId);
  const listing = data.listings.find((item) => item.id === booking.listingId);
  return {
    ...booking,
    User: owner ? sanitizeUser(owner) : null,
    Listing: listing ? withListingDetails(listing, data) : null
  };
}

async function handleGet(path) {
  const data = loadData();
  const segments = path.replace(/^\//, '').split('/').filter(Boolean);

  if (segments[0] === 'auth' && segments[1] === 'me') {
    const user = requireAuth(data);
    return sanitizeUser(user);
  }

  if (segments[0] === 'listings') {
    if (!segments[1]) {
      return data.listings.map((listing) => withListingDetails(listing, data));
    }

    if (segments[1] === 'me') {
      const user = requireAuth(data);
      if (user.role !== 'sitter') {
        throw createError('Only sitters can view their listings.', 403);
      }
      return data.listings
        .filter((listing) => listing.hostId === user.id)
        .map((listing) => withListingDetails(listing, data));
    }
  }

  if (segments[0] === 'bookings') {
    const user = requireAuth(data);
    if (segments[1] === 'owner') {
      if (user.role !== 'owner') {
        throw createError('Only owners can view booking history.', 403);
      }
      return data.bookings
        .filter((booking) => booking.ownerId === user.id)
        .map((booking) => withBookingDetails(booking, data));
    }

    if (segments[1] === 'sitter') {
      if (user.role !== 'sitter') {
        throw createError('Only sitters can view booking requests.', 403);
      }
      const sitterBookings = data.bookings.filter((booking) => {
        const listing = data.listings.find((item) => item.id === booking.listingId);
        return listing?.hostId === user.id;
      });
      return sitterBookings.map((booking) => withBookingDetails(booking, data));
    }
  }

  throw createError('Endpoint not found.', 404);
}

async function handlePost(path, payload) {
  const data = loadData();
  const segments = path.replace(/^\//, '').split('/').filter(Boolean);

  if (segments[0] === 'auth' && segments[1] === 'login') {
    const email = payload?.email?.toLowerCase();
    const password = payload?.password;
    if (!email || !password) {
      throw createError('Email and password are required.');
    }
    const user = data.users.find((item) => item.email.toLowerCase() === email);
    if (!user || user.password !== password) {
      throw createError('Invalid email or password.', 401);
    }
    const token = createToken(user);
    return { user: sanitizeUser(user), token };
  }

  if (segments[0] === 'auth' && segments[1] === 'signup') {
    const name = payload?.name?.trim();
    const email = payload?.email?.toLowerCase();
    const password = payload?.password;
    const role = payload?.role;

    if (!name || !email || !password) {
      throw createError('Name, email, and password are required.');
    }

    if (!['owner', 'sitter'].includes(role)) {
      throw createError('Please choose to sign up as an owner or sitter.');
    }

    if (data.users.some((item) => item.email.toLowerCase() === email)) {
      throw createError('An account with this email already exists.', 409);
    }

    const newUser = {
      id: nextId(data.users),
      name,
      email,
      password,
      role
    };
    data.users.push(newUser);
    saveData(data);

    const token = createToken(newUser);
    return { user: sanitizeUser(newUser), token };
  }

  if (segments[0] === 'listings') {
    const user = requireAuth(data);
    if (user.role !== 'sitter') {
      throw createError('Only sitters can create listings.', 403);
    }

    const title = payload?.title?.trim();
    const description = payload?.description?.trim();
    const location = payload?.location?.trim();
    const price = Number(payload?.price);

    if (!title || !description || !location || Number.isNaN(price)) {
      throw createError('Title, description, location, and price are required.');
    }

    const newListing = {
      id: nextId(data.listings),
      hostId: user.id,
      title,
      description,
      location,
      price
    };

    data.listings.push(newListing);
    saveData(data);

    return withListingDetails(newListing, data);
  }

  if (segments[0] === 'bookings') {
    const user = requireAuth(data);
    if (user.role !== 'owner') {
      throw createError('Only pet owners can request bookings.', 403);
    }

    const listingId = Number(payload?.listingId);
    const startDate = payload?.startDate;
    const endDate = payload?.endDate;

    if (!listingId || !startDate || !endDate) {
      throw createError('Listing, start date, and end date are required.');
    }

    if (new Date(startDate) > new Date(endDate)) {
      throw createError('The end date must be after the start date.');
    }

    const listing = data.listings.find((item) => item.id === listingId);
    if (!listing) {
      throw createError('We could not find that listing.', 404);
    }

    const newBooking = {
      id: nextId(data.bookings),
      listingId,
      ownerId: user.id,
      startDate,
      endDate,
      status: 'pending'
    };

    data.bookings.push(newBooking);
    saveData(data);

    return withBookingDetails(newBooking, data);
  }

  throw createError('Endpoint not found.', 404);
}

async function handlePut(path, payload) {
  const data = loadData();
  const segments = path.replace(/^\//, '').split('/').filter(Boolean);

  if (segments[0] === 'listings') {
    const user = requireAuth(data);
    if (user.role !== 'sitter') {
      throw createError('Only sitters can update listings.', 403);
    }

    const id = Number(segments[1]);
    const listing = data.listings.find((item) => item.id === id);
    if (!listing || listing.hostId !== user.id) {
      throw createError('Listing not found.', 404);
    }

    const updated = {
      ...listing,
      title: payload?.title?.trim() || listing.title,
      description: payload?.description?.trim() || listing.description,
      location: payload?.location?.trim() || listing.location,
      price: payload?.price !== undefined ? Number(payload.price) : listing.price
    };

    if (Number.isNaN(updated.price)) {
      throw createError('Price must be a valid number.');
    }

    Object.assign(listing, updated);
    saveData(data);

    return withListingDetails(listing, data);
  }

  if (segments[0] === 'bookings') {
    const user = requireAuth(data);
    const id = Number(segments[1]);
    const booking = data.bookings.find((item) => item.id === id);
    if (!booking) {
      throw createError('Booking not found.', 404);
    }

    const listing = data.listings.find((item) => item.id === booking.listingId);
    if (!listing || listing.hostId !== user.id) {
      throw createError('Only the listing host can update this booking.', 403);
    }

    const status = payload?.status;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      throw createError('Unknown booking status.');
    }

    booking.status = status;
    saveData(data);

    return withBookingDetails(booking, data);
  }

  throw createError('Endpoint not found.', 404);
}

async function handleDelete(path) {
  const data = loadData();
  const segments = path.replace(/^\//, '').split('/').filter(Boolean);

  if (segments[0] === 'listings') {
    const user = requireAuth(data);
    if (user.role !== 'sitter') {
      throw createError('Only sitters can remove listings.', 403);
    }

    const id = Number(segments[1]);
    const index = data.listings.findIndex((item) => item.id === id && item.hostId === user.id);
    if (index === -1) {
      throw createError('Listing not found.', 404);
    }

    data.listings.splice(index, 1);
    data.bookings = data.bookings.filter((booking) => booking.listingId !== id);
    saveData(data);

    return { success: true };
  }

  throw createError('Endpoint not found.', 404);
}

const API = {
  async get(path) {
    try {
      const data = await handleGet(path);
      return { data };
    } catch (error) {
      throw error;
    }
  },
  async post(path, payload) {
    try {
      const data = await handlePost(path, payload);
      return { data };
    } catch (error) {
      throw error;
    }
  },
  async put(path, payload) {
    try {
      const data = await handlePut(path, payload);
      return { data };
    } catch (error) {
      throw error;
    }
  },
  async delete(path) {
    try {
      const data = await handleDelete(path);
      return { data };
    } catch (error) {
      throw error;
    }
  }
};

export default API;
