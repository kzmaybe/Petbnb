# PetBnB (frontend edition) 🐾

PetBnB is a React app that runs entirely in the browser. The app showcases what a modern pet-sitting
marketplace could look like—owners can explore curated listings, request stays, and track approvals while sitters manage
their profile and respond to incoming bookings. All data is stored in `localStorage`, so you can explore every workflow
without setting up an API or database.

## Highlights

- 🎯 **Frontend only** – zero backend services required; the UI hydrates itself with rich seeded data.
- 👤 **Role-aware journeys** – switch between the owner and sitter dashboards to see both sides of the marketplace.
- 📅 **Interactive booking flow** – request stays, approve or reject them, and monitor status updates in real time.
- 🎨 **Polished UI** – Tailwind CSS powers a responsive layout with accessible components and thoughtful empty states.
- 💾 **Persistent browser storage** – any changes you make are saved to `localStorage` so they stick between refreshes.

## Tech stack

- [React 18](https://react.dev/) with [Vite](https://vitejs.dev/) for an instant dev server.
- [React Router](https://reactrouter.com/) for authenticated routes and dashboards.
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.

## Demo accounts

| Role   | Email                  | Password  |
| ------ | ---------------------- | --------- |
| Sitter | `jamie@petbnb.com`     | `demo1234`|
| Owner  | `morgan@petbnb.com`    | `demo1234`|

Use the owner account to browse listings and request bookings. Switch to the sitter account to publish new stays or
approve requests. Clear the `localStorage` key `petbnb:data` if you ever want to reset the seeded content.

## Run the site on your computer

1. Install dependencies (first time only):
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open the printed URL (usually [http://localhost:5173](http://localhost:5173)) in your browser.
4. Log in with one of the demo accounts above—or sign up for a brand-new profile.

The app will hot-reload as you edit files, and changes you make through the UI persist inside your browser storage.

## Build for production

Generate an optimized bundle and preview it locally:

```bash
npm run build
npm run preview
```

The compiled assets are written to `dist/`. The preview server serves the production build so you can validate everything
before deploying.


Happy hosting! 🐶
