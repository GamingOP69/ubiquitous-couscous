# PROJECT HALCYON

A self-contained, eight-chamber cryptic puzzle hunt / ARG in the dress of a
1998 GeoCities-era preservation site. Raw HTML tables, vanilla CSS, vanilla
JS. No frameworks, no build step, no server, no dependencies.

## The mechanic (no spoilers)

Answers are **locations**. Each chamber's dial normalizes your answer
(lowercase, `a-z0-9` only) and navigates to `<answer>.html`. A correct answer
loads the next chamber; a wrong answer lands on the themed `404.html`
("DEAD AIR"). Consequently **no chamber contains its own answer, hash, or
validation logic** — there is nothing to backdoor in the page source.

## Challenge matrix

| Chamber | Vector |
|---|---|
| 1 | DOM forensics: source comments, hidden elements, console logs, custom console API |
| 2 | Steganography: LSB extraction from a real BMP + trailing-data/metadata analysis |
| 3 | Cryptanalysis + OSINT: repeating-key Vigenère, key recovered via external research |
| 4 | Audio forensics: hand-keyed Morse in a synthesized WAV, forged sample-rate header, layered numeric encoding |
| 5 | Mathematics: Hill cipher — modular matrix inversion over Z/26 |
| 6 | Cryptanalysis: reused one-time pad (two-time pad crib dragging), obfuscated period JS |
| 7 | Programming + research: exact Bernoulli computation (Note G), famous irregular prime |
| 8 | Cross-chamber correlation: seven hidden key shards + columnar transposition |

## Deploy (GitHub Pages)

1. Create a GitHub repository and push the contents of this folder.
2. The creator kit in `docs/` is excluded by `.gitignore`; do not force-add it.
3. Open **Settings → Pages** and select **Deploy from a branch**, your default branch, and `/ (root)`.
4. Save. GitHub Pages will serve `index.html` and use `404.html` for unknown paths.

> Keep `docs/` in your local working copy. It contains the spoiler key and verifier.

## Local testing

Run from this folder:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/`. A simple local server may show its own 404 page
rather than the themed `404.html`; GitHub Pages supplies the custom error page.
The BMP and WAV artifacts are materialized client-side and need no binary files.

## Creator kit (local only, gitignored)

- `docs/SOLUTIONS.md` — full walkthrough, keys, and answers.
- `docs/verify.py` — re-derives every puzzle and checks critical shipped files.

Run the verifier from the project root before publishing:

```bash
python docs/verify.py
```

## House rules for players

No hints exist. No reset helps. Inspect everything. Do not browse the
repository — the archive is the site, not its scaffolding.
