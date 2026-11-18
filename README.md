# Studyflow

Studyflow är en enkel studieplanerare byggd med Next.js och TypeScript.
Projektet är gjort som en individuell skoluppgift med fokus på både utveckling
och drift.

## Funktioner

- Dashboard med veckoplan och nästa deadline.
- Sida för att se, söka och filtrera uppgifter.
- Formulär för att lägga till en uppgift.
- Möjlighet att markera en uppgift som klar.
- Uppgifter sparas lokalt i webbläsaren med `localStorage`.
- Hälsokontroll på `/health`.

## Teknik

- Next.js
- React och TypeScript
- Tailwind CSS
- Docker
- GitHub Actions
- Render

## Starta projektet lokalt

Installera paket:

```bash
npm install
```

Starta utvecklingsservern:

```bash
npm run dev
```

Öppna sedan [http://localhost:3000](http://localhost:3000).

## Kontrollera projektet

```bash
npm run lint
npm run build
```

## Miljövariabler

Använd till exempel denna variabel när du kör hälsokontrollen lokalt:

```env
APP_ENV=development
```

Hemliga värden ska aldrig läggas i Git. I GitHub används repository secret
`RENDER_DEPLOY_HOOK_URL` för att starta en deployment på Render.

## Docker

Bygg image:

```bash
docker build -t studyflow .
```

Starta containern:

```bash
docker run --rm --name studyflow-container -p 3000:3000 -e APP_ENV=production studyflow
```

Kontrollera hälsan:

```bash
curl http://localhost:3000/health
```

## Enkel arkitektur

```text
Webbläsare
    |
    v
Next.js: dashboard + uppgifter
    |
    v
localStorage i webbläsaren

GitHub Actions -> Docker build -> Render
```

## Loggning

Applikationen skriver start- och felmeddelanden till standard output. Det gör
att loggarna kan läsas lokalt och i Render. Endpointen `/health` används för
att kontrollera att servern är igång och att `APP_ENV` finns.
