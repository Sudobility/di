# di — AI Development Guide

> **Git policy — never auto-commit or auto-push.** Leave work in the working tree.
> Run `git commit`, `git push`, `gh pr create`, or `scripts/push_all.sh` **only when
> the user explicitly asks in that turn**. Approval for an earlier change does not carry
> forward, and finishing a task is not permission to commit it. Stay on the current
> branch; do not create feature branches for code changes.

## What this is

`@sudobility/di` — a TypeScript library of platform-agnostic dependency-injection
interfaces for React (web) and React Native, **plus** concrete web and RN
implementations, a unified Firebase layer, mocks for testing, and small async
utilities. Consumers import from one entry and the bundler picks the platform build.

- Package: `@sudobility/di` · version in `package.json` (currently 1.5.85) · license **BUSL-1.1**
- Package manager: **Bun**. Module system: **ESM only** (`"type": "module"`, no CJS output)
- TS target ES2020, `moduleResolution: bundler`, full strict mode plus
  `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noImplicitOverride`,
  `noUnusedLocals`/`Parameters`
- Published to **GitHub Packages** for the `@sudobility` scope (see `.npmrc`);
  installing needs a read token for that registry

## Commands

```bash
bun install
bun run build          # tsc, then scripts/fix-esm-imports.mjs rewrites import extensions
bun run build:watch
bun run typecheck      # tsc --noEmit
bun run test:unit      # vitest run — the "run all tests" command (NO bare `test` script)
bun run test:watch
bun run test:coverage  # 95% threshold on branches/functions/lines/statements
bun run lint           # eslint src --ext .ts,.tsx
bun run lint:fix
bun run format         # prettier
bun run clean          # rm -rf dist
bunx vitest run tests/firebase   # single dir/file (do NOT use `bun test` — that's Bun's own runner, not Vitest)
```

`prepublishOnly` runs clean → test:unit → build. CI: `.github/workflows/ci-cd.yml`.

## Layout

```
src/
  index.ts        barrel: interfaces + types + enums + mocks + utils ONLY (no platform code)
  types.ts        EnvironmentVariables, EnvProvider, FirebaseConfig, AppConfig, …
  env.ts          EnvFactory, EnvUtils
  <domain>/       interface + (where relevant) *-singleton.ts:
                  analytics, firebase, navigation, network, notification, storage,
                  theme, info, alert, user, logging, hooks, utils
  web/            web implementations (browser APIs, Firebase JS SDK) + re-exported interfaces
  rn/             RN implementations (native modules) + re-exported interfaces + types.d.ts stubs
  mocks/          Mock* implementations for every service
tests/            Vitest specs (analytics, env, firebase, integration, logging, network, types)
```

Not every `src/` subdir has its own `package.json` subpath export. `user` is reachable
only via the main/root entry; `alert`, `info`, `logging`, `hooks`, `utils`, `env`,
`analytics`, `navigation`, `network`, `notification`, `storage`, `types`, `firebase`,
`web`, `rn`, `mocks`, `interfaces` have dedicated subpaths (see `package.json` `exports`).

## Entry points

- `@sudobility/di` → resolves to `web` (default) or `rn` (`react-native` condition) build;
  this is where `get*/initialize*` service singletons and `networkClient`/`storage` live.
- `@sudobility/di/interfaces` → `src/index.ts`: interfaces, types, mocks, utils only.
- `@sudobility/di/web`, `/rn` → explicit platform builds. `/mocks` → test doubles.
- Domain subpaths (`/storage`, `/network`, `/firebase`, …) for narrow imports.

## Conventions & architecture

- **Interface-first.** `src/index.ts` exports only interfaces/types/enums/mocks/utils —
  never platform code. Concrete code lives in `src/web/` and `src/rn/`.
- **Singletons.** Platform services expose `initialize*()`, `get*()`, `reset*()`
  (reset is for tests), e.g. `initializeNetworkService` / `getNetworkService`.
- **Unified names.** `web/index.ts` and `rn/index.ts` re-export under identical names
  (`networkClient`, `storage`, `getStorageService`, …) plus platform-specific aliases
  (`getWebNetworkService`, RN-only `getThemeService`/`getNavigationService`/`getNotificationService`).
- **Internal naming.** Some interfaces are declared with an `_` prefix (`_AnalyticsClient`)
  and re-exported under the clean name.
- **Native-module type stubs.** `src/rn/types.d.ts` and `src/web/types.d.ts` carry
  `declare module` stubs (AsyncStorage, NetInfo, Notifee, Firebase RN/JS, React Navigation)
  so the lib compiles without those packages installed.
- **Optional peer deps.** All platform packages (react-native, AsyncStorage, NetInfo,
  Notifee, Firebase) are optional peers; only the target platform's packages are needed.
  There are **zero required runtime dependencies**.
- **95% coverage** threshold is enforced globally; keep it green when adding code.

## Firebase China proxy (key gotcha)

`di` can route Firebase JS traffic through a reverse proxy. **It holds no default and
reads no env var** — the app calls `setFirebaseProxy(origin)` once at startup, before
`initializeApp()`. Region detection lives in `di`, not consumers:
`getFirebaseProxyOrigin()` returns the origin only while routing (else `null`),
`isFirebaseProxyActive()` is the boolean form, `firebaseProxyReady()` resolves once
detection settles. **JS-only:** it wraps `globalThis.fetch`/`navigator.sendBeacon`, so it
covers the Firebase **JS** SDK on both platforms but NOT `@react-native-firebase` native
modules — never claim full RN coverage. Do not re-implement "am I in China?" in callers.

## Adding a service

1. New `src/<name>/` with the interface (`import type { Optional } from '@sudobility/types'`).
2. Export from `src/index.ts` (`export * from './<name>/index.js'` — note `.js` ESM extension).
3. Add `src/mocks/<name>.mock.ts` + export from `src/mocks/index.ts`.
4. Platform impl (if any) in `src/web/`/`src/rn/` with `initialize/get/reset` singleton,
   re-exported from each platform `index.ts` under unified + platform names.
5. Add tests under `tests/<name>/`; add the subpath to `package.json` `exports` if public.

## Watch out

- License is **BUSL-1.1**, not MIT. Source-file header comments and `.ai-context` still
  say `@johnqh/di` and MIT and "no implementations" — these are **stale**; the published
  name is `@sudobility/di` and the library does ship implementations. Trust `package.json`.
- ESM re-exports use explicit `.js` extensions in source even for `.ts` files.
- `bun test` ≠ `bun run test:unit`: the former is Bun's native runner and ignores the
  Vitest config. Always go through the `test:*` scripts or `bunx vitest`.
