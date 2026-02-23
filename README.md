# Kalendář – Gregoriánský na Juliánský

Webová aplikace pro převod dat z gregoriánského na juliánský kalendář.

## Výpočetní logika

### Vstup
- **Rok** (≥ 1582), **Měsíc** (1–12), **Den** (1–28/29/30/31)

### Klíčový vzorec
```
offset = C − ⌊C / 4⌋ − 2
```
kde `C = ⌊rok / 100⌋` (století)

Korekce století se aplikuje od 1. března daného stoletního roku.

### Výstup
- Juliánské datum (den, měsíc, rok)
- Rozdíl ve dnech (offset)
- Den v týdnu

### Příklady
| Gregoriánské | Juliánské  | Offset |
|-------------|------------|--------|
| 23. 2. 2026 | 10. 2. 2026 | 13 dní |
| 1. 1. 2026  | 19. 12. 2025| 13 dní |
| 15. 10. 1582| 5. 10. 1582 | 10 dní |

## Technologie
- **Next.js 14** (React 18)
- **Vercel** deploy

## Vývoj

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Struktura

```
├── app/
│   ├── layout.js        # Root layout s meta tagy
│   ├── page.js          # Hlavní stránka s UI a logikou
│   └── globals.css      # Globální styly (dark mode)
├── lib/
│   ├── calendar.js      # Výpočetní modul (export)
│   └── calendar.test.js # Unit testy
├── next.config.js
└── package.json
```

## Testování

```bash
node lib/calendar.test.js
```
