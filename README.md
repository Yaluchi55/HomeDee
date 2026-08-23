# ZedCribs

A React Native (Expo) real estate app for Zambia — browse listings, view them
on a map, message landlords, and (as a landlord) publish your own listings.

## What came from your real APK

Your uploaded `.apk` couldn't be decompiled back into readable source (it's
compiled Hermes bytecode, and JS engines don't ship reversible bytecode),
but every string literal inside it — API paths, screen labels, amenity
names — is still there in plain text. That let this rebuild use your
**real** endpoints and copy instead of guesses:

- `POST /api/login`, `POST /api/signup`, `GET /auth-status`
- `GET /profile`, `PUT /updateProfile`
- `GET /houses/similar/:id` — powers the "Similar Houses" strip on the
  house details screen
- `POST /images/upload`
- `POST /api/listings/submitListing`
- `GET/PUT /api/my-guests/...` — landlord-side booking confirmation
  (exact sub-paths not recoverable from strings alone; verify against
  your backend)
- Real amenity set: Wheelchair Accessible, Washing Machine, Air
  Conditioning, Fully Furnished, Generator, Solar, Parking, Security, Gym
- Auth is **phone number + password**, with a Booker/Renter role toggle
  on both Login and Sign Up — not email, as I'd originally guessed

Your screenshots also showed the checkout flow generates a **QR code**
for the booker, which the landlord scans to confirm the stay — that's now
implemented end-to-end (`CheckoutScreen` generates it, `BarcodeScannerScreen`
+ `ScannedDataScreen` on the Renter side confirm it).

## Reconstruction notes

This project was rebuilt from source you had pasted into old chat sessions
(App.js, app.json, and detailed screen descriptions), since the original
GitHub repo and dev machine were unavailable. Everything here is fresh code
written to match your described architecture — it is **not** a byte-for-byte
recovery of your original files, so expect some differences (styling
choices, exact field names your backend expects, etc.) that you'll want to
verify against your actual API at https://dwello-sigma.vercel.app.

### What was fixed from the original App.js
- Your pasted `App.js` had `app.json`'s contents accidentally spliced into
  the middle of it — that alone may have been your "main has not been
  registered" crash. It's been separated back into its own file.
- `CheckoutScreen` and `ScannedDataScreen` were imported but never
  registered in a navigator — now wired in.
- `NextScreen` was being reused for two unrelated jobs (checkout details vs.
  renter address/location). Split into `NextScreen` (checkout) and
  `SetLocationScreen` (renter listing address + map pin), per your own
  suggestion in the old chat.
- Swapped the deprecated `expo-barcode-scanner` for `expo-camera`'s built-in
  `CameraView` barcode scanning (current Expo SDKs no longer support the old
  package well).

## Getting started

You don't need your old hardware — any computer (or even Expo Go on your
phone via a cloud IDE like Snack/Gitpod/Replit) works:

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) to run it on your phone, or
press `w` for a web preview.

## Important: this app needs a custom dev build, not Expo Go

`react-native-vision-camera` (used for QR scanning) includes native code that
Expo Go does not support. To run the app on a physical device or simulator
you'll need:
```bash
npx expo prebuild
npx expo run:android   # or: npx expo run:ios
```
or build a custom dev client via EAS (`eas build --profile development`).
Every other screen still works fine in Expo Go — it's only
`BarcodeScannerScreen` that requires the native build.

## Backend

All screens call your existing backend at:
```
https://dwello-sigma.vercel.app
```
via the shared `api.js` axios client (auto-attaches the saved JWT).
Endpoints assumed (adjust to match your real API):
`/login`, `/signup`, `/auth-status`, `/me`, `/houses`, `/my-listings`,
`/listings`, `/bookings`, `/conversations`.

## Next steps
1. `git init && git add . && git commit -m "Recovered ZedCribs source"`
   then push to a **new** GitHub repo immediately so this never happens again.
2. Double check the API endpoint names/payloads above against your actual
   backend — I inferred REST-ish routes from context, not from real code.
3. Add your real `assets/icon.png`, `splash-icon.png`, and `favicon.png`
   (placeholders are not included).
