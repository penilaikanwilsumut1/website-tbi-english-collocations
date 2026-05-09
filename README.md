# TBI - English Collocations

Website pembelajaran Persiapantubel untuk memahami English collocations, terutama dependent prepositions dan prepositional collocations.

## Scope

- 100 curated English collocation entries.
- 10 paket mixed practice.
- 100 soal A-D dengan pembahasan bahasa Indonesia.
- Dashboard, Pencarian, Materi, Flipcard, Tes, progress chart, dan ringkasan SuperAdmin.
- Progress demo tersimpan di browser `localStorage`.
- Content QA guard untuk unique phrase, source evidence, package shape, A-D options, dan answer balance.
- Smoke test dan accessibility test untuk core views.

## Scripts

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
npm run test
npm run test:e2e
npm run test:a11y
```

## Production Notes

Rilis MVP ini memakai seed data statis agar bisa langsung deploy tanpa secret database. SuperAdmin production, no-repeat attempts untuk siswa nyata, student identity, progress history, content import/export, dan audit log tetap harus dipindahkan ke auth + database server-side sebelum operasional kelas riil.
