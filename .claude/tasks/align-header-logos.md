# Align header logos on index.html

## Goal
Replace the 5-logo strip under the MALNAD ENCLAVE header on `index.html` with the
8 requested logos, in the exact order below, correctly and evenly aligned.

Requested order:
1. ktech.jpg
2. moe.png
3. AICTE.png
4. IIC-logo-removebg-preview.png
5. government.png
6. NAINlogo.png   (replaces the old yellow NAIN box `images (11).png`)
7. UBA.png
8. startupkarnatakalogo.png

All 8 files confirmed present in `assets/`.

## Why the current strip looks misaligned
Current markup (index.html:654-672) is a 5-col grid where every logo is forced into
an identical ~square box (`w-24 md:w-32 md:h-32 object-contain`). The logos have very
different aspect ratios:
- ktech 4.00:1, startupkarnataka 4.57:1, moe 2.82:1  (wide banners)
- AICTE, IIC, NAIN, UBA 1:1 and government 1.16:1    (near-square)
Forcing wide banners into square boxes shrinks them and makes the row look uneven.

## Approach (MVP)
Normalize by **height**, not by box: one centered flex row, each logo gets a uniform
height, `w-auto`, `object-contain`, and the row is `items-center justify-center` so
every logo sits on the same vertical center line. `flex-wrap` so it wraps cleanly on
mobile instead of overflowing.

Replace the block at index.html:654-672 with:

```html
<div class="max-w-6xl mx-auto px-4 py-2">
    <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:gap-x-8">
        <img src="assets/ktech.jpg" alt="K-Tech" class="h-9 md:h-12 lg:h-14 w-auto object-contain">
        <img src="assets/moe.png" alt="MoE's Innovation Cell" class="h-9 md:h-12 lg:h-14 w-auto object-contain">
        <img src="assets/AICTE.png" alt="AICTE" class="h-9 md:h-12 lg:h-14 w-auto object-contain">
        <img src="assets/IIC-logo-removebg-preview.png" alt="Institution's Innovation Council" class="h-9 md:h-12 lg:h-14 w-auto object-contain">
        <img src="assets/government.png" alt="Government of India" class="h-9 md:h-12 lg:h-14 w-auto object-contain">
        <img src="assets/NAINlogo.png" alt="New Age Incubation Network" class="h-9 md:h-12 lg:h-14 w-auto object-contain">
        <img src="assets/UBA.png" alt="Unnat Bharat Abhiyan" class="h-9 md:h-12 lg:h-14 w-auto object-contain">
        <img src="assets/startupkarnatakalogo.png" alt="Startup Karnataka" class="h-9 md:h-12 lg:h-14 w-auto object-contain">
    </div>
</div>
```

## Scope
- Only `index.html` (the logo strip exists only here; other pages carry the text
  header but no logo row).
- One edit, no new files, no asset changes.

## Notes / risks
- `government.png` is only 79x68 px native; at h-14 (56px) it is near-native, so no
  visible blur. Keeping heights modest avoids upscaling artifacts.
- Tailwind utility classes are already active on this page (current grid renders),
  so no CSS/CDN change needed.

## Status
- [x] Awaiting approval — approved
- [x] Implemented (index.html:654-665, block replaced with height-normalized flex row of 8 logos)
- [ ] Verified in browser (pending user refresh on Live Server :5501)
