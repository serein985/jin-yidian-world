# Personalized Animal World Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Replace the fixed three-animal prototype with a polished, customizable animal world featuring local identities, eight presets, uploaded artwork with animated touchpoints, independent welfare and coupon progress, a calendar, 3D detail stages, and camera QR routing.

**Architecture:** A versioned world domain owns dynamic animal profiles, progress, journal entries, calendar appointments, identity, and collection ordering. A local asset repository stores compressed artwork in IndexedDB. React screens provide login, home collection, animal detail, creator studio, calendar, coupons, profile, and scanner flows. Preset animals use a shared procedural Three.js model rig; custom artwork uses a 2D hotspot animation stage.

**Tech Stack:** React 19, TypeScript, Vite, Three.js, React Three Fiber, Drei, jsQR, Vitest, React Testing Library, Playwright, Lucide React.

**Spec:** `docs/superpowers/specs/2026-10-31-personalized-animal-world-design.md`

## Global Constraints

- The world state version is `3`.
- Main storage key is `jin-yidian:v3:world`.
- Artwork database is `jin-yidian-assets`; object store is `animal-artwork`.
- Eight preset IDs are `panda`, `red-panda`, `tiger`, `sheep`, `capybara`, `rabbit`, `fox`, `penguin`.
- A preset animal can be added only once.
- Default collection contains `red-panda`, `tiger`, and `sheep`.
- Users may delete or reorder any animals and may keep zero animals.
- Custom artwork limit is 12MB before compression and 1600px on the longest side after compression.
- Each custom animal may have 0 to 12 touchpoints.
- The five touchpoint effects are `bounce`, `shake`, `sparkle`, `hearts`, and `short-clip`.
- First rewarded pet per animal per local day is `+1`.
- First accepted feed per animal per local day is `+4`.
- Each animal owns an independent coupon.
- Coupon redemption is one-way and cannot be repeated.
- Three local login styles are `ticket`, `keeper`, and `minimal`.
- Calendar reminders are page-local only and never use system notifications.
- Park QR links use `?animal=<id>`.
- Camera scanning uses `BarcodeDetector` when available and `jsQR` otherwise.
- All touch targets are at least 48 x 48 CSS pixels.
- No backend, real authentication, payment, or production coupon validation is added.
- Test viewports are 320x700, 360x800, 390x844, and 430x932.

---

### Task 1: Build the dynamic world domain

**Files:**
- Create: `src/domain/preset-animals.ts`
- Create: `src/domain/coupons.ts`
- Create: `src/domain/world.ts`
- Create: `src/domain/world.test.ts`
- Retire later: `src/domain/animals.ts`, `src/domain/habitat.ts`, `src/domain/habitat.test.ts`

**Interfaces:**

```ts
type PresetAnimalId =
  | "panda" | "red-panda" | "tiger" | "sheep"
  | "capybara" | "rabbit" | "fox" | "penguin";

type LoginStyle = "ticket" | "keeper" | "minimal";
type TouchEffect = "bounce" | "shake" | "sparkle" | "hearts" | "short-clip";

interface Touchpoint {
  id: string;
  x: number;
  y: number;
  effect: TouchEffect;
  label: string;
}

interface AnimalProfile {
  id: string;
  kind: "preset" | "custom";
  presetId: PresetAnimalId | null;
  name: string;
  species: string;
  theme: string;
  couponOfferId: string;
  threshold: number;
  touchpoints: Touchpoint[];
  createdAt: string;
  artworkAssetId: string | null;
}

interface AnimalProgress {
  animalId: string;
  feedingValue: number;
  totalTouches: number;
  totalFeeds: number;
  lastPetRewardDate: string | null;
  lastFeedDate: string | null;
  lastFeedId: string | null;
  coupon: CouponRecord | null;
}

interface LocalIdentity {
  nickname: string;
  avatar: string;
}

interface JournalEvent {
  id: string;
  animalId: string | null;
  type: "touch" | "feed" | "coupon-unlock" | "coupon-redeem" | "park-scan";
  date: string;
  time: string;
  title: string;
  detail: string;
}

interface Appointment {
  id: string;
  animalId: string;
  type: "appointment" | "reminder";
  title: string;
  date: string;
  time: string | null;
  note: string;
  completedAt: string | null;
}

interface WorldState {
  version: 3;
  identity: LocalIdentity | null;
  loginStyle: LoginStyle;
  animals: AnimalProfile[];
  progress: Record<string, AnimalProgress>;
  journal: JournalEvent[];
  appointments: Appointment[];
  activeAnimalId: string | null;
}
```

Functions:

```ts
createWorldState(now: Date): WorldState;
addPresetAnimal(state, presetId, now): WorldState;
addCustomAnimal(state, profile, now): WorldState;
removeAnimal(state, animalId): WorldState;
moveAnimal(state, animalId, direction: "up" | "down"): WorldState;
setActiveAnimal(state, animalId): WorldState;
setIdentity(state, identity, loginStyle): WorldState;
petAnimal(state, animalId, now): { state; rewarded: boolean; unlockedCoupon: CouponRecord | null };
feedAnimal(state, animalId, foodId, now): { state; accepted: boolean; unlockedCoupon: CouponRecord | null };
redeemCoupon(state, animalId, now): { state; accepted: boolean };
addAppointment(state, input, now): WorldState;
toggleAppointmentComplete(state, appointmentId, now): WorldState;
removeAppointment(state, appointmentId): WorldState;
recordParkScan(state, animalId, now): WorldState;
sanitizeWorldState(value, now): WorldState;
```

- [x] **Step 1: Write failing preset tests**

Verify exact preset order, eight entries, unique IDs, thresholds, coupon offers, and at least three touch behaviors per preset.

- [x] **Step 2: Implement preset configurations**

Use these names and thresholds:

| ID | Name | Species | Threshold | Offer |
| --- | --- | --- | ---: | --- |
| panda | 糯糯 | 大熊猫 | 35 | 周边 9 折 |
| red-panda | 栗栗 | 小熊猫 | 30 | 周边 9 折 |
| tiger | 阿呜 | 小老虎 | 50 | 餐饮满 50 减 10 |
| sheep | 棉棉 | 小羊 | 40 | 互动体验减 10 |
| capybara | 泡芙 | 水豚 | 25 | 餐饮满 50 减 10 |
| rabbit | 米粒 | 兔子 | 20 | 纪念照片减 8 |
| fox | 小焰 | 狐狸 | 45 | 饮品买一赠一 |
| penguin | 豆丁 | 企鹅 | 30 | 互动体验减 10 |

Each config includes body scale, ear type, tail type, palette, three automatic touch regions, feeding foods, and ambient copy for the 3D stage.

- [x] **Step 3: Write failing dynamic collection tests**

Verify:

- Initial world has identity `null` and the three default animals.
- Adding each unused preset succeeds.
- Adding a duplicate preset is a no-op.
- Custom animals append with unique IDs and progress records.
- Moving an animal up/down changes order.
- Deleting an animal removes profile, progress, journal entries, and appointments.
- Last animal may be deleted, yielding an empty collection.

- [x] **Step 4: Implement collection operations**

- Keep `animals` as the ordered source of truth.
- Keep progress keyed by animal ID.
- Every added animal gets `feedingValue: 0`.
- Preset IDs are `preset-<presetId>`.
- Custom IDs use `custom-<timestamp>-<random>`.
- Deleting removes all dependent data.

- [x] **Step 5: Write failing daily-reward and coupon tests**

Verify independent pet and feed rewards for preset and custom animals, local date rollover, custom thresholds, auto-unlock, and irreversibility of redemption.

- [x] **Step 6: Implement animal interactions**

- Append a journal event only when a pet reward is granted.
- Append a feed event for every accepted feed.
- Append coupon unlock and redemption events.
- Create coupon records with title snapshot and readable code.
- Cap journal at 500 newest events.

- [x] **Step 7: Write failing calendar tests**

Verify appointment creation, time ordering, completion, deletion, due detection, and month aggregation.

- [x] **Step 8: Implement appointment functions**

- Accept title length 1 to 30 and note length 0 to 120.
- Store local date and optional `HH:mm`.
- Sort same-day events by time with all-day events first.
- `isAppointmentDue` returns true when date/time is before now and `completedAt` is null.

- [x] **Step 9: Write failing sanitation tests**

Verify invalid identity, duplicate preset profiles, missing progress, invalid touchpoints, impossible coupons, over-limit images, and malformed appointments are sanitized without losing unrelated valid entries.

- [x] **Step 10: Implement `sanitizeWorldState`**

Clamp all numbers, validate colors and IDs, cap touchpoints at 12, preserve at most 500 journal events and 200 appointments, and repair missing progress.

- [x] **Step 11: Run domain tests and commit**

```powershell
npm test -- src/domain/world.test.ts
git add src/domain/preset-animals.ts src/domain/coupons.ts src/domain/world.ts src/domain/world.test.ts
git commit -m "feat: add dynamic personalized animal world domain"
```

---

### Task 2: Add world persistence, artwork storage, routing and source scanning

**Files:**
- Create: `src/lib/world-storage.ts`
- Create: `src/lib/world-storage.test.ts`
- Create: `src/lib/artwork-store.ts`
- Create: `src/lib/artwork-store.test.ts`
- Create: `src/lib/image-processing.ts`
- Create: `src/lib/qr-route.ts`
- Create: `src/lib/qr-route.test.ts`
- Create: `src/hooks/useWorld.ts`
- Create: `src/hooks/useWorld.test.tsx`
- Create: `src/hooks/useArtworkUrls.ts`

**Interfaces:**

```ts
const WORLD_STORAGE_KEY = "jin-yidian:v3:world";

interface ArtworkStore {
  save(animalId: string, blob: Blob): Promise<void>;
  load(animalId: string): Promise<Blob | null>;
  delete(animalId: string): Promise<void>;
}

function createArtworkStore(): ArtworkStore;
function createMemoryArtworkStore(initial?: Map<string, Blob>): ArtworkStore;
function compressArtwork(file: File): Promise<{ blob: Blob; width: number; height: number }>;
function parseAnimalFromUrl(search: string, knownAnimalIds: string[]): { animalId: string | null; source: "park" | "internal" | "invalid" };
function buildAnimalUrl(animalId: string): string;
```

- [x] **Step 1: Write failing storage tests**

Verify round-trip, malformed JSON fallback, write failure handling, and sanitation call.

- [x] **Step 2: Implement world storage**

Wrap `getItem`, `JSON.parse`, sanitization, and `setItem` in safe functions.

- [x] **Step 3: Write failing artwork store tests**

Use the memory implementation and verify save/load/delete isolation by animal ID.

- [x] **Step 4: Implement IndexedDB and memory artwork stores**

- Default store opens `jin-yidian-assets` version 1.
- Store name is `animal-artwork`.
- Save accepts Blob values.
- Load returns null when missing.
- Delete resolves when key is absent.

- [x] **Step 5: Implement image compression**

- Reject unsupported MIME types.
- Reject files over 12MB.
- Decode with `createImageBitmap`.
- Scale longest edge to at most 1600px.
- Prefer WebP quality 0.84.
- Return original corrected MIME metadata.

- [x] **Step 6: Write failing QR route tests**

Cover:

- `?animal=tiger` resolves tiger.
- Absolute GitHub Pages URL resolves tiger with `source=park`.
- Unknown ID resolves `invalid`.
- Raw known ID resolves internally.
- Empty parameter returns null.
- `buildAnimalUrl` preserves the current base path.

- [x] **Step 7: Implement QR routing**

Use URL parsing where possible and support `animal=<id>` query syntax.

- [x] **Step 8: Write failing hook tests**

Verify loading, pet, feed, redeem, add/remove/reorder, identity entry, appointments, and storage failure with a harness component.

- [x] **Step 9: Implement `useWorld` and `useArtworkUrls`**

- Keep state and ref synchronized for immediate repeated actions.
- Persist main state after every mutation.
- Load artwork object URLs for custom animals.
- Revoke object URLs on replacement and unmount.
- Expose methods matching domain operations.

- [x] **Step 10: Run tests and commit**

```powershell
npm test -- src/lib/world-storage.test.ts src/lib/artwork-store.test.ts src/lib/qr-route.test.ts src/hooks/useWorld.test.tsx
git add src/lib/world-storage.ts src/lib/world-storage.test.ts src/lib/artwork-store.ts src/lib/artwork-store.test.ts src/lib/image-processing.ts src/lib/qr-route.ts src/lib/qr-route.test.ts src/hooks/useWorld.ts src/hooks/useWorld.test.tsx src/hooks/useArtworkUrls.ts
git commit -m "feat: persist personalized animal world and artwork"
```

---

### Task 3: Implement the high-quality preset 3D stage

**Files:**
- Modify: `package.json`
- Create: `src/components/animal3d/PlushAnimal.tsx`
- Create: `src/components/animal3d/Animal3DStage.tsx`
- Create: `src/components/animal3d/model-configs.ts`
- Create: `src/components/animal3d/Animal3DStage.test.tsx`
- Create: `src/components/AnimalArtworkStage.tsx`
- Modify: `src/styles.css`

Dependencies:

```powershell
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

**Interfaces:**

```ts
interface Animal3DStageProps {
  preset: PresetAnimalDefinition;
  interactive?: boolean;
  reducedQuality?: boolean;
  onTouchRegion?: (region: string) => void;
}

interface AnimalArtworkStageProps {
  artworkUrl: string | null;
  touchpoints: Touchpoint[];
  editing: boolean;
  selectedTouchpointId: string | null;
  onAddTouchpoint?: (x: number, y: number) => void;
  onSelectTouchpoint?: (id: string) => void;
  onMoveTouchpoint?: (id: string, x: number, y: number) => void;
}
```

- [x] **Step 1: Write failing stage structure tests**

Verify stage fallback renders when WebGL is unavailable, custom artwork renders an image plus all touchpoints, and edit markers carry accessible names.

- [x] **Step 2: Build the procedural plush model**

- Shared body rig with breathing and head look.
- Physical material with roughness around `0.82`, sheen, clearcoat, and soft color palettes.
- Eye geometry with white sclera, brown iris, pupil and two highlights.
- Rounded ears, muzzle, limbs, tail, species markings and blush.
- Eight configs for panda, red panda, tiger, sheep, capybara, rabbit, fox and penguin.
- Species-specific animations: ear twitch, head tilt, paw lift and tail sway.

- [x] **Step 3: Build cinematic 3D environment**

- Shadowed ground disc.
- Directional key light, warm rim light, cool fill light and contact shadows.
- Fog and gradient backdrop.
- OrbitControls constrained to sensible pitch and zoom.
- Adaptive DPR and reduced-quality mode.
- Canvas pauses when document is hidden.

- [x] **Step 4: Add 3D touch regions**

- Head, left ear, right ear, body and paw raycast regions.
- Trigger short spring animation and bubble text.
- Expose `onTouchRegion` without coupling to world state.

- [x] **Step 5: Build the custom artwork stage**

- Render an image using `object-fit: contain`.
- Percentage-positioned touchpoints.
- Bounce, shake, sparkle, hearts and short-clip effects.
- Editing mode supports click-to-add, drag-to-move and visible selection ring.
- Throttle animation triggers at 240ms.
- Missing artwork displays a refined placeholder and file-missing text.

- [x] **Step 6: Capture visual QA**

Use Playwright screenshots at 390x844 and 1440x900 to inspect:

- Plush surfaces are smooth, not visibly faceted.
- Character is fully framed.
- UI does not cover model.
- Custom image is not distorted.
- Touchpoint effects render.

Expected: screenshots visually pass; adjust camera, material and layout before commit.

- [x] **Step 7: Run tests, build and commit**

```powershell
npm test -- src/components/animal3d/Animal3DStage.test.tsx
npm run build
git add package.json package-lock.json src/components/animal3d src/components/AnimalArtworkStage.tsx src/styles.css
git commit -m "feat: add polished 3d and custom artwork stages"
```

---

### Task 4: Build local login, home collection and animal details

**Files:**
- Create: `src/screens/LoginScreen.tsx`
- Create: `src/screens/HomeScreen.tsx`
- Create: `src/screens/AnimalDetailScreen.tsx`
- Create: `src/screens/ProfileScreen.tsx`
- Create: `src/components/AnimalRail.tsx`
- Create: `src/components/PresetLibrary.tsx`
- Create: `src/components/AppHeader.tsx`
- Create: `src/components/AnimalRecordPanel.tsx`
- Modify: `src/App.tsx`
- Rewrite: `src/App.test.tsx`
- Modify: `src/styles.css`

- [x] **Step 1: Write failing login tests**

Verify:

- No identity shows login.
- Three style buttons are available.
- Entering one-character nickname enables entry.
- Empty or overlong nickname is rejected.
- After entry, home greets the nickname.
- Profile can switch styles without losing animals.

- [x] **Step 2: Implement `LoginScreen`**

- Three visually distinct style variants.
- Avatar palette picker.
- Enter button label `进入我的动物世界`.
- No external authentication.

- [x] **Step 3: Write failing home tests**

Verify default three animals, add preset, duplicate preset disabled, custom animal addition, reordering, deletion confirmation, empty state, and active animal switch.

- [x] **Step 4: Implement home collection**

- Cinematic hero 3D stage.
- Perspective animal rail.
- Add animal action with two paths.
- Long-press or menu for delete.
- Up/down reorder controls for accessibility.
- Page actions for calendar, scan, coupon wallet and profile.

- [x] **Step 5: Write failing animal-detail tests**

Verify single-animal routing, independent progress, feed drawer, daily lock, coupon, 3D stage for presets and artwork stage for custom animals.

- [x] **Step 6: Implement animal detail**

- Header with back and animal identity.
- 3D or artwork stage.
- Protein/plant-free digital feed copy.
- Daily status, progress, record list and coupon shortcut.
- Journal event display for selected animal.

- [x] **Step 7: Implement profile screen**

- Change nickname, avatar and login style.
- Show three animals in unified “ticket”, “keeper” and “minimal” previews.
- Display local-only storage explanation.
- Delete-all local data requires confirmation.

- [x] **Step 8: Verify visual hierarchy**

- Home hero is the first-view signal.
- Custom animal count does not turn the rail into an overflowing grid.
- Text does not overlap model or controls.
- 320px width remains usable.

- [x] **Step 9: Run tests, build and commit**

```powershell
npm test -- src/App.test.tsx
npm run build
git add src/screens/LoginScreen.tsx src/screens/HomeScreen.tsx src/screens/AnimalDetailScreen.tsx src/screens/ProfileScreen.tsx src/components/AnimalRail.tsx src/components/PresetLibrary.tsx src/components/AppHeader.tsx src/components/AnimalRecordPanel.tsx src/App.tsx src/App.test.tsx src/styles.css
git commit -m "feat: add personalized login and animal screens"
```

---

### Task 5: Build the custom animal creator and animated touchpoints

**Files:**
- Create: `src/screens/CreatorScreen.tsx`
- Create: `src/components/TouchpointEditor.tsx`
- Create: `src/components/TouchEffectPicker.tsx`
- Create: `src/components/AnimalPreview.tsx`
- Create: `src/screens/CreatorScreen.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [x] **Step 1: Write failing creator tests**

Verify:

- File input accepts `image/png,image/jpeg,image/webp`.
- Name and species are required.
- Five coupon offers are selectable.
- Threshold slider covers 20-100 in steps of 5.
- Clicking artwork adds a touchpoint.
- Adding a 13th touchpoint is blocked.
- Touchpoint can be dragged and switched among all five effects.
- Delete touchpoint works.
- Save is blocked with no touchpoint.
- Saved animal appears in the collection and opens its detail page.

- [x] **Step 2: Implement upload and preview steps**

- Select artwork.
- Compress in the background with progress indicator.
- Show original aspect ratio.
- Collect name, species, theme and offer.

- [x] **Step 3: Implement the touchpoint editor**

- Add at click.
- Drag selected marker.
- Delete selected.
- Effect picker with five icon controls.
- Optional short label.
- Test animation button.
- Visual count `n / 12`.

- [x] **Step 4: Persist custom animal**

- Save compressed artwork to artwork store.
- Add custom profile with touchpoints.
- Navigate to its detail screen.
- If asset save fails, show user-readable error and do not create a broken animal.

- [x] **Step 5: Verify custom artwork quality**

- Use a test PNG with fine lines and alpha.
- Verify no stretch, clipping or blur beyond intended compression.
- Check touchpoint alignment after resize.

- [x] **Step 6: Run tests and commit**

```powershell
npm test -- src/screens/CreatorScreen.test.tsx
npm run build
git add src/screens/CreatorScreen.tsx src/components/TouchpointEditor.tsx src/components/TouchEffectPicker.tsx src/components/AnimalPreview.tsx src/screens/CreatorScreen.test.tsx src/App.tsx src/styles.css
git commit -m "feat: add drawing creator and animated touchpoints"
```

---

### Task 6: Add calendar, appointments and coupon works

**Files:**
- Create: `src/screens/CalendarScreen.tsx`
- Create: `src/components/MonthCalendar.tsx`
- Create: `src/components/AppointmentEditor.tsx`
- Create: `src/components/ReminderCard.tsx`
- Create: `src/screens/CouponScreen.tsx`
- Create: `src/screens/CalendarScreen.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [x] **Step 1: Write failing calendar tests**

Verify current month, previous/next navigation, today highlight, event markers, date selection, empty-day copy, adding appointment, validation, due highlight, complete and delete.

- [x] **Step 2: Implement calendar helpers and month grid**

- Monday-first month grid.
- Previous/next month fill cells.
- Date keys use local timezone.
- Marker types include touch, feed, coupon, appointment and reminder.

- [x] **Step 3: Implement appointments**

- Add appointment or reminder.
- Animal selector includes all current animals.
- Optional time.
- Page-internal reminder card.
- Due state recalculated every minute while page is open.

- [x] **Step 4: Write failing coupon-works tests**

Verify every animal appears, filters work, available and redeemed states persist, and a one-way redemption cannot repeat.

- [x] **Step 5: Implement multi-animal coupon screen**

- Filter across all, available and redeemed.
- Use refined ticket visuals and QR.
- Redeem confirmation.
- Display animal and offer.

- [x] **Step 6: Run tests, build and commit**

```powershell
npm test -- src/screens/CalendarScreen.test.tsx
npm run build
git add src/screens/CalendarScreen.tsx src/components/MonthCalendar.tsx src/components/AppointmentEditor.tsx src/components/ReminderCard.tsx src/screens/CouponScreen.tsx src/screens/CalendarScreen.test.tsx src/App.tsx src/styles.css
git commit -m "feat: add calendar reminders and multi-animal coupons"
```

---

### Task 7: Add camera QR scanner and deep links

**Files:**
- Modify: `package.json`
- Create: `src/screens/ScannerScreen.tsx`
- Create: `src/components/QrCameraReader.tsx`
- Create: `src/lib/scanner.ts`
- Create: `src/lib/scanner.test.ts`
- Create: `src/screens/ScannerScreen.test.tsx`
- Modify: `src/App.tsx`

Dependency:

```powershell
npm install jsqr
```

- [x] **Step 1: Write failing scanner parsing tests**

Verify known IDs, absolute park URLs, raw IDs, unknown IDs and malformed text.

- [x] **Step 2: Implement scanner parsing**

Use a pure `interpretScanResult` function that returns `{ kind: "animal"; animalId }`, `{ kind: "invalid"; reason }` or `{ kind: "unknown" }`.

- [x] **Step 3: Write failing manual-scanner UI tests**

Verify camera denied state, manual input, valid manual code navigation, unknown ID error and close cleanup.

- [x] **Step 4: Implement camera reader**

- Request rear-facing camera after explicit button tap.
- Prefer `BarcodeDetector`.
- Fallback to `jsQR` every 320ms.
- Stop media streams in all exit paths.
- Do not continuously allocate canvases.

- [x] **Step 5: Add QR deep-link handling**

- App reads `animal` and `source=park`.
- If identity is missing, remember pending animal and open after login.
- If identity exists, direct to detail.
- Log `park-scan` journal event.
- Unknown animal shows a recoverable error screen.

- [x] **Step 6: Run tests and commit**

```powershell
npm test -- src/lib/scanner.test.ts src/screens/ScannerScreen.test.tsx
npm run build
git add package.json package-lock.json src/screens/ScannerScreen.tsx src/components/QrCameraReader.tsx src/lib/scanner.ts src/lib/scanner.test.ts src/screens/ScannerScreen.test.tsx src/App.tsx
git commit -m "feat: add qr scanner and animal deep links"
```

---

### Task 8: Retire the old model, refresh visual QA, and finalize public delivery

**Files:**
- Delete: obsolete `src/domain/animals.ts`, `src/domain/habitat.ts`, `src/hooks/useHabitat.ts`, old components and tests
- Modify: `README.md`
- Modify: `scripts/generate-qr.mjs`
- Add: new public QR PNG under `outputs/`
- Modify: `.github/workflows/deploy-pages.yml` only if deployment path changes
- Create: `tests/e2e/personalized-world.spec.ts`

- [x] **Step 1: Remove all obsolete fixed-animal code**

Search for imports of the old habitat hooks and components. Remove only unreferenced files. Keep shared utilities such as audio.

- [x] **Step 2: Run the complete unit suite**

```powershell
npm test
```

Expected: all tests pass.

- [x] **Step 3: Build the production site**

```powershell
npm run build
```

Expected: TypeScript, Vite and Three.js bundle complete successfully.

- [x] **Step 4: Write the full browser flow**

Cover:

1. Create local identity using each login style.
2. See default three animals.
3. Add every preset animal.
4. Delete and reorder.
5. Upload a test drawing.
6. Add and edit multiple touchpoints.
7. Save custom animal.
8. Open custom detail and trigger effects.
9. Open preset detail and verify non-empty 3D canvas.
10. Add appointment.
11. Verify due highlight using injected test date.
12. Unlock and redeem a coupon.
13. Use scanner fallback to enter a parked animal.
14. Test all four mobile widths.

- [x] **Step 5: Inspect screenshots**

- Desktop 1440x900.
- Mobile 320x700, 360x800, 390x844, 430x932.
- Login styles.
- Home collection.
- 3D animal detail.
- Custom artwork editor.
- Calendar.
- Coupon wallet.

Fix clipping, low-contrast text, faceted models, distorted art or overlapping UI before delivery.

- [x] **Step 6: Update public QR and README**

- Use new repository URL.
- New default link opens a fresh personalized world.
- New QR points to the new URL.
- README describes local identity, custom artwork limits, calendar and persistence.

- [x] **Step 7: Create clean competition repository**

Create a new public repository under `serein985` with a new name.

- Use an orphan main branch with one clean initial commit for the new product.
- Do not inherit the old repository commit history.
- Configure GitHub Pages through Actions.
- Verify the new URL returns 200 and all assets load.

- [x] **Step 8: Delete the previous public repository**

Only after the new site is verified:

```powershell
gh repo delete serein985/jin-yidian-habitat --yes
```

Update local remote to the new repository.

- [x] **Step 9: Final verification**

```powershell
npm test
npm run build
npm run test:e2e
git status --short
gh run list --limit 1
```

Expected:

- Unit, build and browser tests all pass.
- New GitHub Pages deployment succeeds.
- New public URL and assets return 200.
- Old GitHub repository is deleted.
- Working tree is clean.

## Plan Self-Review

### Spec coverage

- Three login styles: Task 4.
- Dynamic animal collection: Tasks 1 and 4.
- Eight presets: Tasks 1 and 3.
- Custom artwork upload and touchpoint editor: Tasks 2, 3 and 5.
- Five effects: Tasks 3 and 5.
- 3D preset stage and refined visual quality: Task 3.
- Independent reward and coupon logic: Task 1.
- Calendar and reminders: Task 1 and Task 6.
- Camera scan and deep links: Tasks 2 and 7.
- Local storage and artwork storage: Task 2.
- Error handling and responsive quality: Tasks 2 through 8.
- Old GitHub project replacement: Task 8.

### Placeholder scan

All tasks identify exact files, interfaces, thresholds, effects, routes and verification commands. No unresolved placeholders remain.

### Type consistency

The plan consistently uses `AnimalProfile`, `AnimalProgress`, `Touchpoint`, `TouchEffect`, `JournalEvent`, `Appointment`, `WorldState`, `ArtworkStore`, and `useWorld` from their first definition through UI, scanner and deployment tasks.
