# Brew & Co. Frontend refresh

The home screen and menu screen have been restyled with a consistent warm coffee palette, editorial typography, rounded cards, clearer hierarchy, and responsive centered content. Existing API integration on the home screen is preserved. The menu screen includes category filters, search, and a local selection counter.

## Run

1. Install Node.js LTS.
2. From this folder run `npm install`.
3. Set the API base URL in `src/api/api.ts` to your backend address.
4. Run `npm run web` for browser preview, or `npm start` for Expo.

The menu items are currently sample data in `src/app/menu.tsx`; connect them to the backend menu endpoint when that endpoint is ready.
