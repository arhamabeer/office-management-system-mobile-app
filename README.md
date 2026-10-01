# EMS Mobile App

Bare **React Native** (RN CLI) + TypeScript — the employee-focused mobile client (PLAN.md §11).
Themed with the shared BrainCrop theme from `@ems/config` (`rnLightTheme` / `rnDarkTheme`); talks to
the API via `@ems/api-client`.

## What's in this scaffold (M0b)

The **JavaScript/TypeScript layer** is in place and typechecks:

```
src/
├── App.tsx                 # NavigationContainer + themed bottom tabs
├── navigation/AppTabs.tsx  # Dashboard · Attendance · Leaves · Payslips
├── screens/                # DashboardScreen (themed cards) + PlaceholderScreen
├── theme/theme.ts          # useTheme() -> rnLightTheme/rnDarkTheme
└── lib/api.ts              # configured @ems/api-client
index.js · app.json · babel.config.js · metro.config.js (pnpm-monorepo tuned)
```

## Generating the native projects (required to run)

The native `android/` and `ios/` folders are **not committed** and must be generated on a machine
with the React Native toolchain (Android Studio / Xcode). From `mobile-app/`:

```bash
# scaffold the native host projects for this exact RN version into a temp app,
# then copy android/ and ios/ next to this package (keeping our src/, package.json, app.json):
npx @react-native-community/cli@latest init BrainCropEMS --version 0.76.5 --directory ./_native_tmp --skip-install
# copy _native_tmp/android and _native_tmp/ios here, then remove _native_tmp
```

(Alternatively, run the CLI init in a scratch dir and copy `android/`+`ios/` over.) The app name is
`BrainCropEMS` (see `app.json`) so the generated native modules match.

## Run

```bash
pnpm install                       # from the repo root
pnpm --filter mobile-app start     # Metro bundler
pnpm --filter mobile-app android   # or: ios
pnpm --filter mobile-app typecheck # tsc --noEmit (works without the native toolchain)
```

For the Android emulator, point the API at `http://10.0.2.2:4000` (see `.env.example`); secure token
storage uses `react-native-keychain` (wired in M1).
