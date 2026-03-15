# Playence

Playence è un'applicazione web innovativa sviluppata in Angular, progettata per connettere sportivi, allenatori ed eventi. L'applicativo offre un'esperienza completa che spazia dalla prenotazione di eventi sportivi all'analisi dettagliata delle performance fisiche, arricchita da suggerimenti basati sull'intelligenza artificiale.

## 🚀 Funzionalità Principali

- **Autenticazione e Gestione Profilo**: Workflow di registrazione, login e gestione del profilo utente, comprensivo delle proprie preferenze sportive.
- **Ricerca e Filtro Eventi Avanzato**: Esplorazione di eventi sportivi multi-disciplina (Calcio, Tennis, CrossFit, ecc.) con funzionalità di ricerca complesse per sport, range di prezzo, livello di esperienza (Principiante, Agonistico), località, disponibilità di Coach VIP e date.
- **Ticketing In-App**: Sistema integrato per l'acquisto e la prenotazione di biglietti per eventi e sessioni con istruttori, con generazione di codici di conferma.
- **Coach e Professionisti**: Profili dettagliati degli allenatori sportivi con valutazioni, biografia e specializzazione.
- **Performance e Analisi AI**:
  - Tracciamento delle metriche di allenamento (battito cardiaco medio e picco, calorie spese, distanza e durata).
  - Feedback personalizzato e commenti da parte del coach al termine della sessione.
  - **Motore di Analisi AI**: Valutazione intelligente delle performance, con stesura dinamica di piani di allenamento settimanali basati sui risultati ottenuti e suggerimenti per il recupero.
  - Gestione Storico (Gamification/Premium): Simulazione di sblocco delle metriche basato sulla storicità degli eventi (es. dati dettagliati visibili per allenamenti recenti, storico profondo riservato a logiche di account premium/gratuito).
- **Organizzazione Eventi e Partnership**: Permette ai proprietari di strutture sportive convenzionate di scegliere e pubblicare giornate dedicate, organizzando eventi sportivi che possono includere la presenza di ospiti e atleti VIP, per massimizzare il coinvolgimento.

## 🛠 Stack Tecnologico

- **Backend & Admin Dashboard**: Pannello applicativo dedicato agli amministratori della piattaforma, utilizzato per l'inserimento, la configurazione e la gestione strutturata dei dati anagrafici (es. nuovi sport, creazione di eventi, gestione anagrafiche).
- **WebAPI**: Il backend espone inoltre delle Web API per tutte le chiamate alle rotte del frontend.
- **Framework**: Angular v21.2.x (Standalone Components, Signals, esbuild/Vite builder).
- **UI & Styling**: Tailwind CSS v4, Angular Material per componenti accessibili e design system robusto.
- **State Management & Reattività**: RxJS v7.8. e utilizzo di Signal.
- **Mocking & Backend Simulation**: Mirage.js, `@faker-js/faker`.
- **Data Visualization**: Chart.js interfacciato tramite `ng2-charts` per dashboard e resoconti grafici delle performance.

---

## 🗄️ Database e Backend

Il backend è una web application sviluppata in ASP.NET Core che espone Web API, permette le operazioni CRUD (Create, Read, Update, Delete) e si occupa di criptare i dati sensibili.

Si appoggia ad un database relazionale solido e scalabile per la gestione delle informazioni degli utenti, transazioni e dello storico metrico:
- **Database Relazionale**: Microsoft SQL Server. Scelto per le sue elevate performance ed affidabilità nell'ospitare quantità significative di dati, assicurando robustezza anche in scenari di alto carico e concorrenza.
- **Struttura Dati**: Le tabelle del database relazionale risultano fedelmente mappate sulle interfacce TypeScript dell'applicativo (visibili all'interno della directory `app/core/models`), mantenendo assoluta congruenza tra i modelli di business esposti a frontend e il layer di persistenza a backend.
- **Integrazione e Analisi Dati (AI & Wearables)**: Al termine d'esperienza sportiva, il backend si occupa di recuperare i parametri vitali dei partecipanti tramite le **Google Fitness API** insieme alle valutazioni inserite dal coach. Questi dati vengono poi inoltrati a un flusso **n8n** che li elabora e restituisce un JSON strutturato contenente un recap dettagliato e l'analisi dell'Intelligenza Artificiale.

---

## 🧪 Scelte Architetturali e Utilizzo di Mirage.js

Per garantire uno sviluppo e test della user interface rapido, isolato e completamente indipendente dai rilasci backend, l'architettura si appoggia a **Mirage.js**, utilizzato come un mock server completo che intercetta a livello di rete le chiamate REST dell'app.

Le principali motivazioni e implementazioni tecniche riguardanti Mirage.js includono:

1. **Simulazione Realistica delle API e Database Relazionale**:
   - È stato implementato un database in-memory strutturato sui modelli relazionali di base (`user`, `event`, `coach`, `ticket`, `performance`).
   - Le relazioni `belongsTo` e `hasMany` (es. i ticket appartengono agli eventi e agli utenti) garantiscono che l'applicazione frontend operi in un contesto di dati coerente e normalizzato.
2. **Generazione Dati Dinamici ad Alta Varianza (Faker)**:
   - Grazie alle `Factory` di Mirage e a `@faker-js/faker`, ogni esecuzione del server genera dataset complessi e credibili. Parametri come coordinate di geolocalizzazione, metriche biometriche (battito cardiaco simulato realisticamente tra 110 e 200, km percorsi, kcal bruciate), valutazioni floating-point ed interi piani testuali sono creati al volo.
3. **Scenari Multipli di Testing pre-impostati (Seeding)**:
   - Il `seed` nativo di Mirage inietta all'avvio dell'app scenari operativi complessi (ad es. un utente standard "Mario Rossi" pre-popolato con ticket acquisiti, in modo da avere da subito lo storico su cui visualizzare i grafici o testare la dashboard delle performance AI).
4. **Mocking Avanzato (Latenze e Risposte AI)**:
   - È stata inserita una latenza di rete fissa (`this.timing = 400`) per simulare realisticamente il caricamento (utile per testare loading spinner e skeleton iterativi).
   - Alcuni endpoint "intelligenti" non effettuano solo CRUD, bensì *logiche di business simulate*:
     - La rotta `GET /events` gestisce combinazioni multiple di query-params.
     - La rotta `/performances/:id/ai-analysis` aggrega in tempo reale i dati della performance e restituisce un JSON contenente testo discorsivo generato e piani formativi in array.
     - La rotta di check-out calcola dinamicamente le conferme biglietti.
5. **Integrazione Trasparente**:
   - L'attivazione del server Mirage dipende esclusivamente dall'ambiente (`environment.useMirage` nei file di dev e mock), il che permette al team di preparare build stabili (`build:mock`) per lo showcase del frontend, senza trascinarsi librerie di testing nella build finale vera e propria.

---

## 💻 Script di Sviluppo

Il file `package.json` include comandi ottimizzati per gestire server reali o mockati.

```bash
# Avvia il dev server collegato all'eventuale vero backend (se configurato in environment.development)
npm run start

# Avvia l'app attivando Mirage.js (IDEALE PER LO SVILUPPO STANDALONE)
npm run start:mock

# Avvia l'app in mock, esponendola in rete locale per fare testing sui dispositivi mobili della rete
npm run start:mock-local

# Esegue la suite di test scritta in Vitest
npm test

# Crea la build per il deploy produttivo
npm run build

# Crea una build autonoma con Mirage abilitato per demoboard (es. Vercel o GitHub Pages come showcase)
npm run build:mock
```
