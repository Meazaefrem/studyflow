# Studyflow

Studyflow är en enkel och lekfull studieplanerare för att hålla koll på
skoluppgifter, deadlines och status.

Projektet är utvecklat som en individuell skoluppgift med fokus på:

- webbutveckling med Next.js och React
- lokal lagring av uppgifter i webbläsaren
- containerisering med Docker
- CI/CD med GitHub Actions
- driftsättning på Render
- loggning och hälsokontroll

## Demo

Den publicerade applikationen finns på:

[https://studyflow-cgzc.onrender.com](https://studyflow-cgzc.onrender.com)

## Funktioner

- Dashboard med en snabb överblick över uppgifter och progress.
- Veckokalender med kommande studieaktiviteter.
- Lista över alla uppgifter.
- Popup för att skapa en ny uppgift utan att lämna sidan.
- Fält för titel, kurs, deadline, status och beskrivning.
- Sökning bland uppgifter.
- Filtrering på alla, pågående, kommande och klara uppgifter.
- Möjlighet att markera en uppgift som klar.
- Uppgifter sparas i webbläsarens `localStorage`.
- Hälsokontroll på `/health`.

## Teknik

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Node.js 22
- Docker
- GitHub Actions
- Render

## Kom igång lokalt

### Förutsättningar

Installera följande innan projektet startas:

- Node.js
- npm
- Git
- Docker Desktop om Docker ska testas lokalt

### Installera beroenden

Klona projektet och gå in i projektmappen:

```bash
git clone https://github.com/Meazaefrem/studyflow.git
cd studyflow
```

Installera sedan projektets paket:

```bash
npm install
```

### Miljövariabler

Skapa en lokal `.env.local`-fil i projektets rotmapp:

```env
APP_ENV=development
```

Miljöfilen ska inte pushas till GitHub. Exemplet finns i
[.env.example](.env.example).

### Starta utvecklingsservern

```bash
npm run dev
```

Öppna sedan [http://localhost:3000](http://localhost:3000).

## Kontrollera koden

Kör ESLint:

```bash
npm run lint
```

Bygg projektet för produktion:

```bash
npm run build
```

Starta den byggda produktionsversionen:

```bash
npm run start
```

## Användning

1. Öppna dashboarden.
2. Klicka på `+ Ny uppgift` i sidomenyn.
3. Fyll i uppgiftens titel, kurs, deadline, status och beskrivning.
4. Klicka på `Spara uppgift`.
5. Öppna `Uppgifter` via sidomenyn.
6. Använd sökning eller filter för att hitta uppgifter.
7. Klicka på kryssrutan för att markera en uppgift som klar.

Det finns ingen databas i projektet. Uppgifterna sparas lokalt i den webbläsare
som används. Om webbläsarens lokala data raderas försvinner uppgifterna också.

## Projektstruktur

```text
app/
├── components/
│   ├── Sidebar.tsx       # Gemensam sidomeny och knapp för ny uppgift
│   └── TaskModal.tsx     # Popup-formulär för att skapa uppgift
├── health/
│   └── route.ts          # Hälsokontroll för server och Render
├── lib/
│   ├── tasks.ts          # Typer, kursalternativ och seed-uppgift
│   └── use-tasks.ts      # Läsning och sparning i localStorage
├── uppgifter/
│   └── page.tsx          # Lista, sökning och filtrering
├── layout.tsx            # Gemensam layout och metadata
└── page.tsx              # Dashboard
Dockerfile                # Multistage-bygge för produktion
server.js                 # Startar Next.js och skriver serverloggar
```

## Docker

Dockerfilen använder tre steg:

1. Installerar beroenden.
2. Bygger Next.js-applikationen.
3. Startar endast den färdiga produktionsappen med en mindre runtime-image.

Bygg Docker-imagen:

```bash
docker build -t studyflow .
```

Starta containern:

```bash
docker run --rm --name studyflow-container \
  -p 3000:3000 \
  -e APP_ENV=production \
  studyflow
```

Öppna [http://localhost:3000](http://localhost:3000) och testa appen i
containern.

Kontrollera hälsan:

```bash
curl -i http://localhost:3000/health
```

Om containern redan finns kan den stoppas med:

```bash
docker stop studyflow-container
```

## Hälsokontroll och loggning

Endpointen `/health` kontrollerar att applikationen körs och att miljövariabeln
`APP_ENV` finns.

Vid lyckad kontroll returneras JSON med bland annat:

```json
{
  "status": "ok",
  "service": "studyflow",
  "environment": "development"
}
```

Om `APP_ENV` saknas returneras statuskod `503` och statusen `degraded`.

Servern och hälsokontrollen skriver information och fel till standard output.
Det gör att loggarna kan läsas både lokalt och i Render.

## CI/CD med GitHub Actions

Workflow-filen finns i
[.github/workflows/deploy.yml](.github/workflows/deploy.yml).

När kod pushas till `main` kör workflowen följande steg:

1. Hämtar koden från GitHub.
2. Installerar Node.js 22.
3. Installerar paket med `npm ci`.
4. Kör `npm run lint`.
5. Kör `npm run build`.
6. Bygger Docker-imagen.
7. Kontrollerar att Render-secret finns.
8. Startar en deployment på Render via deploy hook.

### GitHub Secret

Följande repository secret måste finnas i GitHub:

```text
RENDER_DEPLOY_HOOK_URL
```

Secret-värdet ska aldrig skrivas direkt i workflow-filen eller committas till
GitHub.

## Render

Render kör produktionsversionen av Studyflow som en Docker-baserad tjänst.

Tjänsten använder:

```text
APP_ENV=production
```

Deploy startas automatiskt när GitHub Actions skickar en POST-förfrågan till
Render deploy hook efter att kontrollerna har lyckats.

## Enkel arkitektur

```text
Webbläsare
    |
    v
Next.js dashboard och uppgiftssida
    |
    v
localStorage i användarens webbläsare

GitHub push
    |
    v
GitHub Actions: lint -> build -> Docker build
    |
    v
Render deploy hook -> Render
```

## Kostnadsmedveten drift

Projektet använder en enkel arkitektur utan databas eller separat backend för
uppgifter. Det minskar både komplexitet och driftkostnad för ett studentprojekt.

Docker bygger applikationen i separata steg och den färdiga containern kör
endast produktionsberoenden. GitHub Actions kör automatiska kontroller innan en
deployment startas, vilket minskar risken att felaktig kod publiceras.

## Manuell testchecklista

- [ ] Dashboarden öppnas.
- [ ] Popupen `Ny uppgift` öppnas utan sidbyte.
- [ ] En ny uppgift kan sparas.
- [ ] Den nya uppgiften visas på uppgiftssidan.
- [ ] Uppgiften finns kvar efter omladdning.
- [ ] Sökning fungerar.
- [ ] Filter fungerar.
- [ ] En uppgift kan markeras som klar.
- [ ] Dashboardens statistik uppdateras.
- [ ] `/health` returnerar status `ok`.
- [ ] Docker-containern startar.
- [ ] GitHub Actions kan bygga projektet.
