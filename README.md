# Slimme Assistent - AI voor MKB

Een webapplicatie waarmee Nederlandse MKB-bedrijven eenvoudig AI-assistenten kunnen implementeren zonder technische kennis.

## Inhoudsopgave

- [Overzicht](#overzicht)
- [Features](#features)
- [Technologiestack](#technologiestack)
- [Projectstructuur](#projectstructuur)
  - [Complete Filestructuur](#complete-filestructuur)
  - [Belangrijke Bestanden](#belangrijke-bestanden)
- [Onderdelen](#onderdelen)
  - [Landingspagina](#landingspagina)
  - [Dashboard](#dashboard)
    - [Agent Templates](#agent-templates)
    - [Data Storage](#data-storage)
    - [Gekozen Templates](#gekozen-templates)
    - [Actieve Agents](#actieve-agents)
- [Gebruikersflow](#gebruikersflow)
- [Installatie](#installatie)
- [Ontwikkeling](#ontwikkeling)
  - [Technische details](#technische-details)
  - [Project uitbreiden](#project-uitbreiden)
  - [Ontwikkelingsrichtlijnen](#ontwikkelingsrichtlijnen)
- [Toekomstige ontwikkelingen](#toekomstige-ontwikkelingen)

## Overzicht

Slimme Assistent is een platform dat is ontworpen om MKB-bedrijven in Nederland te helpen bij het implementeren van AI-oplossingen. De applicatie biedt vooraf geconfigureerde templates voor verschillende afdelingen zoals HR, Logistiek, Financiën en Sales. Gebruikers kunnen deze templates selecteren, aanpassen met bedrijfsspecifieke gegevens en implementeren als AI-assistenten zonder enige technische kennis.

## Features

- **Afdelingsgerichte AI-templates**: Vooraf gebouwde templates voor verschillende afdelingen
- **Data-integratie**: Upload en beheer bedrijfsgegevens in verschillende formaten (PDF, Excel, afbeeldingen)
- **Intuïtieve interface**: Gebruiksvriendelijk dashboard voor het configureren en beheren van AI-assistenten
- **Statistieken en monitoring**: Bekijk prestaties van actieve AI-assistenten

## Technologiestack

- **Frontend**: Next.js 14 met TypeScript
- **Styling**: Tailwind CSS
- **UI Componenten**: Mix van eigen componenten en Radix UI
- **Backend**: Supabase (optioneel voor data-opslag)

## Projectstructuur

### Complete Filestructuur

```
/
├── .vscode/                # VS Code configuratie
├── src/
│   ├── app/                # Pagina's volgens de App Router structuur
│   │   ├── (auth)/         # Authenticatie pagina's (optioneel)
│   │   │   ├── forgot-password/
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   └── smtp-message.tsx
│   │   ├── auth/
│   │   │   └── callback/   # OAuth callback routes
│   │   ├── dashboard/      # Dashboard pagina's
│   │   │   ├── reset-password/
│   │   │   └── page.tsx    # Hoofddashboard pagina
│   │   ├── actions.ts      # Server actions voor form handling
│   │   ├── favicon.ico     # Site favicon
│   │   ├── globals.css     # Globale CSS styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   ├── components/         # Herbruikbare componenten
│   │   ├── dashboard/      # Dashboard specifieke componenten
│   │   │   ├── active-agents.tsx
│   │   │   ├── agent-templates.tsx
│   │   │   ├── chosen-templates.tsx
│   │   │   └── data-storage.tsx
│   │   ├── ui/             # Basis UI componenten
│   │   │   ├── accordion.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ...
│   │   ├── dashboard-navbar.tsx
│   │   ├── footer.tsx
│   │   ├── form-message.tsx
│   │   ├── hero.tsx
│   │   ├── navbar.tsx
│   │   ├── submit-button.tsx
│   │   ├── tempo-init.tsx
│   │   ├── theme-provider.tsx
│   │   ├── theme-switcher.tsx
│   │   ├── url-provider.tsx
│   │   └── user-profile.tsx
│   ├── lib/                # Utility libraries en helpers
│   ├── types/              # TypeScript type definities
│   │   └── index.ts
│   ├── utils/              # Utility functies
│   │   └── utils.ts
│   └── middleware.ts       # Middleware voor routing
├── supabase/               # Supabase configuratie
│   ├── migrations/         # Database migraties
│   ├── .gitignore
│   ├── client.ts           # Client-side Supabase client
│   ├── config.toml         # Supabase configuratie
│   ├── middleware.ts       # Supabase middleware
│   └── server.ts           # Server-side Supabase client
├── public/                 # Statische assets
├── .env.example            # Voorbeeld voor environment variabelen
├── .gitignore              # Git ignore configuratie
├── components.json         # Componenten configuratie
├── middleware.ts           # Root middleware
├── next.config.js          # Next.js configuratie
├── package-lock.json       # Vergrendelde npm dependencies
├── package.json            # Project dependencies en scripts
├── postcss.config.js       # PostCSS configuratie
├── README.md               # Project documentatie
├── tailwind.config.ts      # Tailwind CSS configuratie
├── tempo.config.json       # Tempo configuratie
└── tsconfig.json           # TypeScript configuratie
```

### Belangrijke Bestanden

- **`src/app/dashboard/page.tsx`**: Het centrale dashboard waar gebruikers templates beheren
- **`src/components/dashboard/*.tsx`**: De vier hoofdcomponenten van het dashboard
- **`src/app/page.tsx`**: De landingspagina
- **`src/middleware.ts`**: Centraal punt voor routeringslogica
- **`src/app/actions.ts`**: Server actions voor formulierverwerking
- **`tailwind.config.ts`**: Tailwind CSS thema configuratie
- **`package.json`**: Project afhankelijkheden en scripts

## Onderdelen

### Landingspagina

De landingspagina (`src/app/page.tsx`) bevat de volgende secties:

1. **Hero sectie**: Introductie van de Slimme Assistent met CTA naar dashboard
2. **Features sectie**: Voordelen van de dienst
3. **Template categorieën**: Overzicht van templates per afdeling
4. **Data upload sectie**: Informatie over dataverwerking
5. **CTA sectie**: Call to action om te beginnen

### Dashboard

Het dashboard (`src/app/dashboard/page.tsx`) is de kern van de applicatie en bestaat uit vier hoofdtabbladen:

#### Agent Templates

Managed door `src/components/dashboard/agent-templates.tsx`:

- Filterbare weergave van AI-templates per afdeling (HR, Logistiek, Financiën, Sales)
- Elke template heeft een titel, beschrijving en use cases
- "Template Toevoegen" knop om een template te selecteren

Templates beschikbaar per afdeling:
- **HR**: Personeelsgids Q&A, Onboarding Assistent
- **Logistiek**: Voorraad Assistent, CMR Generator
- **Financiën**: Bon-naar-Factuur, Uitgavenanalyse
- **Sales**: Offerte Maker, CRM Generator

#### Data Storage

Managed door `src/components/dashboard/data-storage.tsx`:

- Bestandsbeheer georganiseerd per afdeling
- Uploadfunctionaliteit voor verschillende bestandsformaten
- Vooraf aangemaakte mappen voor elk type bedrijfsgegevens
- "Nieuwe Map Aanmaken" functionaliteit

Voorbeeld van mappen:
- **HR**: Personeelsdocumenten, Bedrijfsbeleid
- **Logistiek**: Voorraadgegevens, Transportdocumenten
- **Financiën**: Facturen, Uitgaven
- **Sales**: Klantgegevens, Productcatalogus

#### Gekozen Templates

Managed door `src/components/dashboard/chosen-templates.tsx`:

- Overzicht van templates die de gebruiker heeft geselecteerd
- Status management: concept, geconfigureerd, actief
- Koppeling met databronnen
- Acties voor configureren, activeren, bewerken of verwijderen

Elke gekozen template toont:
- Template titel en afdeling
- Huidige status
- Gekoppelde databron
- Datum van toevoeging

#### Actieve Agents

Managed door `src/components/dashboard/active-agents.tsx`:

- Lijst van geactiveerde AI-assistenten
- Prestatie-indicatoren: aantal interacties, successpercentage
- Status monitoring: online of gepauzeerd
- Acties: chat, instellingen aanpassen, pauzeren/hervatten

Elke actieve agent toont:
- Naam en afdeling
- Status indicator (online/gepauzeerd)
- Aantal interacties
- Successpercentage
- Laatst actief timestamp

## Gebruikersflow

De typische gebruikersflow in de applicatie:

1. Gebruiker bezoekt de landingspagina
2. Gebruiker gaat naar het dashboard
3. Gebruiker selecteert geschikte templates voor hun bedrijf
4. Gebruiker uploadt relevante bedrijfsgegevens
5. Gebruiker configureert de templates met hun data
6. Gebruiker activeert de templates als AI-assistenten
7. Gebruiker beheert en monitort de actieve assistenten

## Installatie

Om het project lokaal te draaien:

```bash
# Clone het repository
git clone [repository-url]

# Navigeer naar de projectdirectory
cd slimme-assistent

# Installeer dependencies
npm install

# Start de ontwikkelserver
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser om de applicatie te bekijken.

## Ontwikkeling

### Technische details

- **React componenten**: Combinatie van client- en servercomponenten
- **State management**: React Hooks voor lokale state
- **Styling**: Tailwind CSS met custom thema configuratie
- **Layouts**: Responsive design voor alle schermformaten

### Project uitbreiden

Om het project uit te breiden:

1. **Nieuwe templates toevoegen**: Voeg nieuwe templates toe aan het templates array in `src/components/dashboard/agent-templates.tsx`
2. **Nieuwe afdelingen toevoegen**: Breid het Department type uit in relevante componenten
3. **Extra databronnen**: Voeg nieuwe mappen toe aan het dataFolders array in `src/components/dashboard/data-storage.tsx`

### Ontwikkelingsrichtlijnen

Om de codebase consistent en goed onderhouden te houden, volg deze richtlijnen:

#### 1. Documentatie

- **README bijwerken**: Werk dit README.md bestand bij wanneer je nieuwe functionaliteiten toevoegt.
- **Commentaar**: Voeg duidelijke commentaren toe aan complexe code.
- **TypeScript types**: Definieer duidelijke types voor alle interfaces en componenten.

#### 2. Codestandaarden

- **Componentstructuur**: Volg een consistente structuur:
  ```tsx
  // 1. Imports
  // 2. Types/Interfaces
  // 3. Constanten/Data
  // 4. Component functie
  // 5. Helper functies
  ```

- **Naamgeving**:
  - PascalCase voor componenten (bijv. `AgentTemplates`)
  - camelCase voor functies en variabelen
  - kebab-case voor bestanden (bijv. `agent-templates.tsx`)

- **State Management**:
  - Gebruik React Hooks (useState, useEffect) voor lokale state
  - Groupeer gerelateerde state met useReducer waar nodig

#### 3. Git Workflow

- **Commit berichten**: Gebruik duidelijke, beschrijvende commit berichten:
  ```
  feat: voeg nieuw template toe voor HR afdeling
  fix: los styling probleem op in Agent Templates
  docs: werk README bij met nieuwe installatie-instructies
  ```

- **Branches**:
  - `main`: Productieversie
  - `develop`: Ontwikkelingsversie
  - Feature branches: `feature/template-toevoegen`, `fix/dashboard-layout`

#### 4. UI/UX Consistentie

- **Componenten**: Gebruik bestaande UI componenten uit `src/components/ui/`
- **Kleuren**: Gebruik alleen kleuren gedefinieerd in de Tailwind configuratie
- **Responsiveness**: Alle nieuwe componenten moeten responsive zijn
- **Toegankelijkheid**: Volg WCAG-richtlijnen voor toegankelijkheid

#### 5. Performance

- **Afbeeldingen**: Optimaliseer afbeeldingen vóór toevoeging
- **Bundlegrootte**: Voeg alleen noodzakelijke dependencies toe
- **Code-splitting**: Gebruik dynamische imports voor grote componenten

#### 6. Cross-project updates

Bij elke substantiële wijziging:
1. Voeg een entry toe aan de CHANGELOG.md
2. Update de versie in package.json
3. Update dit README.md document indien nodig

## Toekomstige ontwikkelingen

Mogelijke verbeteringen voor toekomstige versies:

- Volledige implementatie van authenticatie functionaliteit
- Integratie met AI-modellen voor daadwerkelijke verwerking van templates
- Realtime data-analyse en feedback
- Meer geavanceerde templates voor branchespecifieke use cases

---

Ontwikkeld voor Nederlandse MKB-bedrijven om AI-technologie toegankelijk te maken zonder technische kennis.
