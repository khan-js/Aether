# Aether (formerly Bunny)

Discord iOS 354.0 compatibility notes

Audited against: com.hammerandchisel.discord 354.0 (build 123054), decrypted IPA, Hermes bytecode v98.

## Changed
- `src/metro/common/index.ts`: `url` lookup no longer requires `openDeeplink` (removed in 354). Uses `openURL`.
- `src/core/ui/settings/pages/General/index.tsx`: "Discord Server" link now calls `url.openURL`.
- `src/lib/addons/themes/colors/patches/background.tsx`: chat Messages file moved to
  `modules/messages/native/Messages.tsx`. Path updated. Marker `HACK_fixModalInteraction` confirmed in the bundle.
- `scripts/serve.mjs`: prints `bunny.js` URLs, logs build errors. `package.json`: `typecheck` script.

## Verified present in 354 bundle
Metro globals `__d`/`__r`, native modules (NativeClientInfoModule, NativeFileModule, NativeCacheModule,
NativeDeviceModule, NativeThemeModule, BundleUpdaterManager), SemanticColor, and all other property and
name lookups in `src/` except those listed below.

## Second pass
- `src/lib/ui/components/InputAlert.tsx`: rewritten on `AlertModal` + `TextInput` + `AlertActionButton`
  (the pattern `AddonPage` already uses). `LegacyAlert` / `LegacyFormInput` were removed in 354. Public props unchanged.
  Builds, lints, typechecks. Not yet tested on a device.

## Known unresolved
- Bunny settings row: `UserSettingsOverviewWrapper` no longer exists, so the legacy patch in `lib/ui/settings/patches/panel.tsx`
  is a no-op (its failure is caught). The modern patch in `lib/ui/settings/patches/tabs.tsx` targets
  `SettingsOverviewScreen` (present, Function #75512 in the bytecode), but I could not confirm it finds a `sections` prop
  containing `ACCOUNT`, because the section list is built in a different module. The row may not appear on 354.
- `ThemeColorMap`: no longer present. Only used as a fallback in `lib/ui/color.ts`.
- `LegacyAlert` is still exported in `metro/common/components.ts` and is used by the Vendetta plugin API shim
  (`core/vendetta/api.tsx`), so older plugins that use `Alert` may still fail.
