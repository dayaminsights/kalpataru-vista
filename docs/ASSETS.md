# Asset inventory

Everything under `assets/` is raw/source material (gitignored except where noted) — the
site itself is served from `..._files/`. This table records, for each file still in
`assets/`, why it's kept: either it's the documented source of a live asset (needed if
that asset ever gets re-processed) or it's a pipeline intermediate referenced elsewhere
in project docs. Anything without a live counterpart or a documented reason was deleted
2026-08-30 — see `docs/CLEANUP-2026-08-30.md`.

| File | Role | Live counterpart |
|---|---|---|
| `logo.pdf` | Vector master, source of `logo.svg` | `..._files/kalpataru-vista-logo.svg` |
| `logo.svg` | Intermediate export (`pdftocairo -svg logo.pdf logo.svg`) | same |
| `logo-cropped.png` | Cropped raster variant from logo pipeline | — (kept with the logo set) |
| `hero image.jpeg` | Original hero photo, pre-cutout | — |
| `hero-cutout.png` | Full-res transparent cutout (6.4MB, 2752×1536) — the "original transparent PNG" noted in `CLAUDE.md`'s rough edges | — |
| `hero-cutout-optimized.png` | Resized cutout (3.2MB, 1920×1072) — this is the actual source of the live hero image; still needs real compression tooling per `CLAUDE.md` | `..._files/house.png` / `house.webp` |
| `map direction.png` | Source of the live map graphic | `..._files/map-direction.webp` |
| `apartment video.mp4` | Raw video (40MB), compressed for the site | `..._files/apartment-video.mp4` (15.5MB) |
| `sector 125, noida.mp4` | Raw video (80MB), compressed for the site | `..._files/location-video.mp4` (1MB) |
| `complimentary golf course.jpg` | Byte-identical to the live asset | `..._files/complimentary golf course.jpg` |
| `island kitchen.webp` | Byte-identical to the live asset | `..._files/island kitchen.webp` |
| `landscape open.webp` | Byte-identical to the live asset | `..._files/landscape open.webp` |
| `enjoy.webp` / `meet.webp` / `relax.webp` | Byte-identical to the live assets | same names in `..._files/` |
| `Kalpataru Vista Plan Booklet.pdf` | Byte-identical to the live asset | same |

## Removed 2026-08-30 (see `docs/CLEANUP-2026-08-30.md` for full rationale)

- `KALPATARU SHOW APARTMENT/` — 428 unused stills, abandoned direction
- `hero-src/` (incl. `apartment-sequence/`, `hero-building.webp`) — abandoned from-scratch
  scroll-sequence build (specs/plans for it are in git history, not `docs/`)
- `golf course slide show/` — undocumented, unreferenced raw renders, wrong resolution to
  be the source of any live golf image
- `Residential_skyscrapers_stand_in…jpeg` — unreferenced, hash doesn't match `og-image.jpg`
