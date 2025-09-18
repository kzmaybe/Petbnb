# PetBnB (frontend edition) 🐾

PetBnB is now a standalone React experience that runs entirely in the browser. The app showcases what a modern pet-sitting
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

## Deploy to GitHub Pages

A deployment script is included to publish the static build to a `gh-pages` branch.

1. Make sure your project has a GitHub remote set up and your working tree is clean.
2. Run the deploy script:
   ```bash
   npm run deploy
   ```
   This runs `npm run build` and uses [gh-pages](https://github.com/tschaub/gh-pages) to push the contents of `dist/` to
a `gh-pages` branch. Because the app now uses hash-based routing, refreshes work on GitHub Pages without additional
server rules.
3. In your repository’s **Settings → Pages**, choose the `gh-pages` branch and save.
4. Within a minute or two GitHub will serve the site at `https://<your-username>.github.io/<repository-name>/`.

If you ever need to redeploy, rerun `npm run deploy`. To reset your local demo data, clear the `petbnb:data` key from
the browser’s storage inspector.

Happy hosting! 🐶
