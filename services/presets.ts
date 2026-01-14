import { AiModel, RalphConfig, AppLanguage, ContextFile } from '../types';

export interface Preset {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  config: Partial<RalphConfig>;
}

// --- MOCK DATA GENERATORS (LOCALIZED) ---

const getLegacyCode = (lang: AppLanguage): string => {
    const isIt = lang === AppLanguage.IT;
    return `// ${isIt ? 'CODICE VECCHIO SPAGHETTI - NON TOCCARE' : 'OLD SPAGHETTI CODE - DO NOT TOUCH'}
var user_list = [];
function get_users(cb) {
  var x = new XMLHttpRequest();
  x.open("GET", "/api/users", true);
  x.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       var d = JSON.parse(this.responseText);
       for(var i=0; i<d.length; i++) {
         user_list.push(d[i]);
       }
       if(cb) cb(user_list);
    }
  };
  x.send();
}

function print_u() {
  get_users(function(u) {
    document.getElementById('root').innerHTML = '<ul>' + u.map(function(x){ return '<li>'+x.name+'</li>'; }).join('') + '</ul>';
  });
}`;
};

const getInefficientPython = (lang: AppLanguage): string => {
    const isIt = lang === AppLanguage.IT;
    return `
def process_numbers(nums):
    # ${isIt ? 'O(n^2) trova duplicati intenzionalmente lento' : 'O(n^2) finding duplicates intentionally slow'}
    duplicates = []
    for i in range(len(nums)):
        for j in range(len(nums)):
            if i != j and nums[i] == nums[j]:
                if nums[i] not in duplicates:
                    duplicates.append(nums[i])
    return duplicates

def heavy_calculation():
    # ${isIt ? 'Simulazione blocco thread principale' : 'Blocking main thread simulation'}
    import time
    print("${isIt ? 'Avvio...' : 'Starting...'}")
    time.sleep(2) 
    return [x**2 for x in range(10000)]
`;
};

const getVulnerableExpress = (lang: AppLanguage): string => {
    const isIt = lang === AppLanguage.IT;
    return `
const express = require('express');
const app = express();
const db = require('./db');

// ${isIt ? 'ENDPOINT VULNERABILE' : 'VULNERABLE ENDPOINT'}
app.get('/users', (req, res) => {
  const name = req.query.name;
  // ${isIt ? 'Vulnerabilità SQL Injection' : 'SQL Injection vulnerability'}
  const query = "SELECT * FROM users WHERE name = '" + name + "'";
  db.exec(query, (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});
`;
};

const getMockReadme = (lang: AppLanguage): string => {
    if (lang === AppLanguage.IT) {
        return `# Progetto Apollo

## Panoramica
Il Progetto Apollo è un sistema di archiviazione sicuro.

## Requisiti
1. Gli utenti devono autenticarsi via JWT.
2. I file devono essere crittografati a riposo usando AES-256.
3. Tutte le risposte API devono essere JSON.
4. L'UI deve usare un tema scuro di default.
`;
    }
    return `# Project Apollo

## Overview
Project Apollo is a secure file storage system.

## Requirements
1. Users must authenticate via JWT.
2. Files must be encrypted at rest using AES-256.
3. All API responses must be JSON.
4. The UI must use a dark theme by default.
`;
};

const getMockDesignDoc = (lang: AppLanguage): string => {
    if (lang === AppLanguage.IT) {
        return `# Specifica Tecnica: Apollo

| Componente | Tech Stack | Vincoli |
|------------|------------|---------|
| Backend    | Node.js    | Niente ORM, usare query builder raw (Knex) |
| Frontend   | React      | Deve usare Redux per lo stato |
| Auth       | Auth0      | Scadenza Token: 1 ora |

## Architettura
- L'architettura a Microservizi è severamente vietata per l'MVP. Richiesto Monolite.
`;
    }
    return `# Technical Specification: Apollo

| Component | Tech Stack | Constraints |
|-----------|------------|-------------|
| Backend   | Node.js    | No ORMs allowed, use raw SQL builder (Knex) |
| Frontend  | React      | Must use Redux for state |
| Auth      | Auth0      | Token expiration: 1 hour |

## Architecture
- Microservices architecture is strictly forbidden for MVP. Monolith required.
`;
};

// Base64 Mockup (Language agnostic)
const MOCKUP_IMAGE_BASE64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IxMDAlIiBmaWxsPSIjZjhmOGY4Ii8+CiA8cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzNkODVmNiIgcng9IjgiLz4KIDxyZWN0IHg9IjEwMCIgeT0iMzAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAiIGZpbGw9IiNjY2MiIHJ4PSI0Ii8+CiA8cmVjdCB4PSIxMDAiIHk9IjYwIiB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1IiBmaWxsPSIjZWVlIiByeD0iNCIvPgogPHJlY3QgeD0iMjAiIHk9IjExMCIgd2lkdGg9IjM2MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiM5OTkiIHN0cm9rZS1kYXNoYXJyYXk9IjQsNCIvPgogPHRleHQgeD0iMjAwIiB5PSIxOTAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5Ij5IZXJvIFNlY3Rpb24gUGxhY2Vob2xkZXI8L3RleHQ+Cjwvc3ZnPg==";

// --- TRANSLATION DATA STRUCTURE ---

interface PresetStrings {
    title: string;
    description: string;
    goal: string;
}

// Dictionary containing translations for English and Italian.
// Other languages fall back to English structure in execution but are prepared for expansion.
const PRESET_TRANSLATIONS: Record<string, Record<string, PresetStrings>> = {
    [AppLanguage.EN]: {
        p1: {
            title: 'Personal Portfolio Website',
            description: 'A simple static HTML/CSS/JS site to showcase a resume.',
            goal: 'Create a responsive, single-page personal portfolio website. It should have a "About Me" section, a "Skills" grid, and a "Contact" form that logs to console. Use Semantic HTML5 and modern CSS (Flexbox/Grid).'
        },
        p2: {
            title: 'Python Data Cleaner',
            description: 'Script to process and clean CSV files.',
            goal: 'Write a Python script using Pandas that reads a CSV file named "data.csv". It should: 1) Drop rows with missing values, 2) Convert date columns to ISO format, 3) Export the result to "clean_data.json". Add error handling.'
        },
        p11: {
            title: 'Streamlit Stock Dashboard',
            description: 'Python data visualization app.',
            goal: 'Create a Streamlit application (`app.py`). It should: 1) Accept a stock symbol input (e.g., AAPL). 2) Use `yfinance` to fetch last 3 months of data. 3) Display a line chart of Closing prices using `plotly`. 4) Show key metrics (High, Low, Volume) in columns.'
        },
        p12: {
            title: 'Flutter Habit Tracker',
            description: 'Mobile app UI with Dart & Flutter.',
            goal: 'Create a Flutter application main screen. 1) Use `ListView.builder` to show a list of habits. 2) Each habit has a name and a checkbox. 3) Use a simple in-memory List to store state (no database yet). 4) Add a FloatingActionButton to show a dialog for adding a new habit. Use Material 3 design.'
        },
        p3: {
            title: 'React Todo App',
            description: 'Classic Todo list with LocalStorage persistence.',
            goal: 'Build a React functional component "TodoApp". Features: Add task, Toggle completion status, Delete task, Filter by (All/Active/Completed). Persist all state to browser LocalStorage so data survives refresh. Use Tailwind CSS for styling.'
        },
        p4: {
            title: 'Express.js REST API',
            description: 'Backend server with CRUD endpoints.',
            goal: 'Create a Node.js Express API for managing a "Bookstore". Implement endpoints: GET /books, GET /books/:id, POST /books, PUT /books/:id, DELETE /books/:id. Use an in-memory array for storage. Add input validation.'
        },
        p5: {
            title: 'Chrome Extension',
            description: 'Focus mode extension to block websites.',
            goal: 'Build a Chrome Extension Manifest V3. It should have a popup.html where the user can toggle "Focus Mode". When active, it should block access to "facebook.com" and "twitter.com" using the declarativeNetRequest API.'
        },
        p6: {
            title: 'Discord/Telegram Bot',
            description: 'Simple bot to reply to commands.',
            goal: 'Create a Python script for a Discord Bot. It should listen for the command "!ping" and reply "pong". It should also have a "!weather <city>" command that mocks a weather API response. Include instructions on how to set the token.'
        },
        p13: {
            title: 'Go Microservice (Gin)',
            description: 'High-performance API in Go.',
            goal: 'Create a Golang REST API using the Gin framework. 1) Define a struct for `Order`. 2) Implement `POST /orders` and `GET /orders`. 3) Use a mutex to handle concurrent writes to an in-memory map safely. 4) Add structured logging using `slog` or `zap`.'
        },
        p14: {
            title: 'Flutter E-Commerce (Provider)',
            description: 'Complex state management in Dart.',
            goal: 'Scaffold a Flutter Shop App. 1) Setup `Provider` for state management. 2) Create a `Product` model and a `Cart` provider. 3) Build a Product Grid Screen that navigates to a Product Detail Screen. 4) Implement an "Add to Cart" function that updates the badge counter on the App Bar.'
        },
        p15: {
            title: 'Rust Tauri App',
            description: 'Desktop app with Rust backend and HTML frontend.',
            goal: 'Create a Tauri app setup. 1) The Rust backend (`main.rs`) should have a command `get_system_stats` that returns mock CPU usage. 2) The Frontend (HTML/JS) should invoke this command every 1 second and update a progress bar. Ensure type safety in the IPC bridge.'
        },
        p7: {
            title: 'Next.js SaaS Boilerplate',
            description: 'Auth, Database, and Landing Page setup.',
            goal: 'Scaffold a Next.js 15 (App Router) application. Structure it for a SaaS: 1) Landing page with Hero section, 2) Dashboard layout (protected), 3) Mock authentication middleware. Use Shadcn/UI components.'
        },
        p8: {
            title: 'RAG CLI Tool',
            description: 'Chat with your documents using Embeddings.',
            goal: 'Build a Python CLI tool that performs RAG (Retrieval Augmented Generation). 1) Ingest a folder of .txt files, 2) Chunk them and store in a local vector store (like ChromaDB or FAISS), 3) Allow the user to ask questions and answer based ONLY on the context.'
        },
        p16: {
            title: 'Performance Optimizer',
            description: 'Analyze code complexity and suggest improvements.',
            goal: 'Act as a Senior Performance Engineer. 1) Analyze the attached `slow_script.py`. 2) Identify the Time Complexity (Big O) of existing functions. 3) Rewrite the `process_numbers` function to use a Set for O(n) lookup instead of O(n^2). 4) Explain why the changes improve speed.'
        },
        p17: {
            title: 'UI/UX Polish & Fix',
            description: 'Improve interface based on code and mockups.',
            goal: 'Act as a UI/UX Engineer. Look at the attached `component_wireframe.svg`. The goal is to implement this exactly using HTML/Tailwind. Ensure: 1) The padding matches the visual weight of the wireframe. 2) Contrast ratios are accessible (WCAG AA). 3) The card is responsive on mobile.'
        },
        p18: {
            title: 'Bug Hunter (Debug)',
            description: 'Find and fix logic errors in provided code.',
            goal: 'Act as a QA Engineer. Analyze the attached `legacy_script.js`. There are logic errors in how the callback handles the HTTP state. 1) Identify why the user list might remain empty or error out. 2) Fix the `XMLHttpRequest` implementation. 3) Add console logs to trace execution flow.'
        },
        p19: {
            title: 'Security Auditor',
            description: 'Identify vulnerabilities (OWASP) and patch them.',
            goal: 'Act as a Cyber Security Expert. Review `vulnerable_server.js`. 1) Identify the SQL Injection vulnerability in the `/users` endpoint. 2) Rewrite the code to use Parameterized Queries (Prepared Statements). 3) Explain how the attack vector works and how your fix prevents it.'
        },
        p20: {
            title: 'Spec Compliance Check',
            description: 'Verify code against README and Design Docs.',
            goal: 'Act as a Lead Architect/QA. You have the `README.md` (Business Req) and `DESIGN_DOC.md` (Tech Constraints). 1) Cross-reference them against a hypothetical implementation. 2) Generate a checklist of 5 critical checks that a CI/CD pipeline should run to ensure the code matches these documents. 3) Specifically check if "Monolith" constraint in Design Doc conflicts with any common microservice patterns.'
        },
        p9: {
            title: 'Refactor Legacy Code',
            description: 'Modernize an old, messy JavaScript file.',
            goal: 'Analyze the attached "legacy_script.js". 1) Rewrite it in modern TypeScript using Async/Await instead of callbacks. 2) Replace XMLHttpRequest with Fetch API. 3) Add proper type interfaces for the User object. 4) Write a unit test for it.'
        },
        p10: {
            title: 'Figma to React',
            description: 'Implement a UI component from an attached image wireframe.',
            goal: 'Look at the attached "wireframe.svg". Create a React Component using Tailwind CSS that replicates this layout exactly. It is a Card component with a rounded avatar, a title, a gray description bar, and a dashed border container at the bottom.'
        }
    },
    [AppLanguage.IT]: {
        p1: {
            title: 'Sito Portfolio Personale',
            description: 'Un semplice sito statico HTML/CSS/JS per mostrare il CV.',
            goal: 'Crea un sito web portfolio personale reattivo a pagina singola. Deve avere una sezione "Chi Sono", una griglia "Skills" e un modulo "Contatti" che stampa in console. Usa HTML5 Semantico e CSS moderno (Flexbox/Grid).'
        },
        p2: {
            title: 'Pulitore Dati Python',
            description: 'Script per processare e pulire file CSV.',
            goal: 'Scrivi uno script Python usando Pandas che legge un file CSV chiamato "data.csv". Deve: 1) Rimuovere le righe con valori mancanti, 2) Convertire le colonne data in formato ISO, 3) Esportare il risultato in "clean_data.json". Aggiungi gestione errori.'
        },
        p11: {
            title: 'Dashboard Azionaria Streamlit',
            description: 'App di visualizzazione dati in Python.',
            goal: 'Crea un\'applicazione Streamlit (`app.py`). Deve: 1) Accettare un simbolo azionario in input (es. AAPL). 2) Usare `yfinance` per recuperare gli ultimi 3 mesi di dati. 3) Mostrare un grafico a linee dei prezzi di Chiusura usando `plotly`. 4) Mostrare metriche chiave (High, Low, Volume) in colonne.'
        },
        p12: {
            title: 'Habit Tracker Flutter',
            description: 'UI app mobile con Dart & Flutter.',
            goal: 'Crea una schermata principale per app Flutter. 1) Usa `ListView.builder` per mostrare una lista di abitudini. 2) Ogni abitudine ha nome e checkbox. 3) Usa una semplice lista in memoria per lo stato. 4) Aggiungi un FloatingActionButton per mostrare un dialog per aggiungere nuove abitudini. Usa design Material 3.'
        },
        p3: {
            title: 'React Todo App',
            description: 'Classica lista Todo con persistenza LocalStorage.',
            goal: 'Costruisci un componente funzionale React "TodoApp". Funzionalità: Aggiungi task, Toggle stato completamento, Elimina task, Filtra per (Tutti/Attivi/Completati). Persisti tutto lo stato nel LocalStorage del browser. Usa Tailwind CSS per lo stile.'
        },
        p4: {
            title: 'API REST Express.js',
            description: 'Server Backend con endpoint CRUD.',
            goal: 'Crea una API Node.js Express per gestire una "Libreria". Implementa endpoint: GET /books, GET /books/:id, POST /books, PUT /books/:id, DELETE /books/:id. Usa un array in memoria per lo storage. Aggiungi validazione input.'
        },
        p5: {
            title: 'Estensione Chrome',
            description: 'Estensione Focus mode per bloccare siti.',
            goal: 'Costruisci un\'Estensione Chrome Manifest V3. Deve avere un popup.html dove l\'utente può attivare la "Focus Mode". Quando attiva, deve bloccare l\'accesso a "facebook.com" e "twitter.com" usando l\'API declarativeNetRequest.'
        },
        p6: {
            title: 'Bot Discord/Telegram',
            description: 'Bot semplice per rispondere ai comandi.',
            goal: 'Crea uno script Python per un Bot Discord. Deve ascoltare il comando "!ping" e rispondere "pong". Deve anche avere un comando "!weather <città>" che simula una risposta API meteo. Includi istruzioni su come impostare il token.'
        },
        p13: {
            title: 'Microservizio Go (Gin)',
            description: 'API ad alte prestazioni in Go.',
            goal: 'Crea una API REST Golang usando il framework Gin. 1) Definisci una struct per `Order`. 2) Implementa `POST /orders` e `GET /orders`. 3) Usa un mutex per gestire scritture concorrenti su una mappa in memoria in sicurezza. 4) Aggiungi logging strutturato usando `slog` o `zap`.'
        },
        p14: {
            title: 'Flutter E-Commerce (Provider)',
            description: 'Gestione stato complessa in Dart.',
            goal: 'Imposta una Shop App Flutter. 1) Configura `Provider` per la gestione stato. 2) Crea un modello `Product` e un provider `Cart`. 3) Costruisci una Griglia Prodotti che naviga verso un Dettaglio Prodotto. 4) Implementa una funzione "Aggiungi al Carrello" che aggiorna il contatore badge nella App Bar.'
        },
        p15: {
            title: 'App Tauri Rust',
            description: 'App desktop con backend Rust e frontend HTML.',
            goal: 'Crea un setup app Tauri. 1) Il backend Rust (`main.rs`) deve avere un comando `get_system_stats` che ritorna un utilizzo CPU simulato. 2) Il Frontend (HTML/JS) deve invocare questo comando ogni secondo e aggiornare una progress bar. Assicura tipizzazione sicura nel bridge IPC.'
        },
        p7: {
            title: 'Boilerplate SaaS Next.js',
            description: 'Setup Auth, Database e Landing Page.',
            goal: 'Imposta un\'applicazione Next.js 15 (App Router). Strutturala per un SaaS: 1) Landing page con sezione Hero, 2) Layout Dashboard (protetto), 3) Middleware autenticazione simulato. Usa componenti Shadcn/UI.'
        },
        p8: {
            title: 'Tool CLI RAG',
            description: 'Chatta con i tuoi documenti usando Embeddings.',
            goal: 'Costruisci un tool CLI Python che esegue RAG (Retrieval Augmented Generation). 1) Ingerisci una cartella di file .txt, 2) Dividili in chunk e salvali in un vector store locale (come ChromaDB o FAISS), 3) Permetti all\'utente di fare domande e rispondi basandoti SOLO sul contesto.'
        },
        p16: {
            title: 'Ottimizzatore Performance',
            description: 'Analizza complessità codice e suggerisci miglioramenti.',
            goal: 'Agisci come Senior Performance Engineer. 1) Analizza il file `slow_script.py` allegato. 2) Identifica la Complessità Temporale (Big O) delle funzioni esistenti. 3) Riscrivi la funzione `process_numbers` per usare un Set per lookup O(n) invece di O(n^2). 4) Spiega perché i cambiamenti migliorano la velocità.'
        },
        p17: {
            title: 'UI/UX Polish & Fix',
            description: 'Migliora interfaccia basandoti su codice e mockup.',
            goal: 'Agisci come UI/UX Engineer. Guarda il `component_wireframe.svg` allegato. L\'obiettivo è implementarlo esattamente usando HTML/Tailwind. Assicura: 1) Il padding corrisponda al peso visivo del wireframe. 2) I contrasti siano accessibili (WCAG AA). 3) La card sia responsive su mobile.'
        },
        p18: {
            title: 'Cacciatore di Bug (Debug)',
            description: 'Trova e correggi errori logici nel codice.',
            goal: 'Agisci come QA Engineer. Analizza il `legacy_script.js` allegato. Ci sono errori logici in come il callback gestisce lo stato HTTP. 1) Identifica perché la lista utenti potrebbe rimanere vuota o andare in errore. 2) Correggi l\'implementazione `XMLHttpRequest`. 3) Aggiungi console logs per tracciare il flusso.'
        },
        p19: {
            title: 'Auditor di Sicurezza',
            description: 'Identifica vulnerabilità (OWASP) e correggile.',
            goal: 'Agisci come Esperto Cyber Security. Revisiona `vulnerable_server.js`. 1) Identifica la vulnerabilità SQL Injection nell\'endpoint `/users`. 2) Riscrivi il codice usando Query Parametrizzate (Prepared Statements). 3) Spiega come funziona il vettore di attacco e come la tua fix lo previene.'
        },
        p20: {
            title: 'Controllo Compliance Spec',
            description: 'Verifica codice contro README e Design Doc.',
            goal: 'Agisci come Lead Architect/QA. Hai il `README.md` (Requisiti Business) e `DESIGN_DOC.md` (Vincoli Tecnici). 1) Incrociali contro una implementazione ipotetica. 2) Genera una checklist di 5 controlli critici che una pipeline CI/CD dovrebbe eseguire per assicurare che il codice rispetti questi documenti. 3) Controlla specificamente se il vincolo "Monolite" nel Design Doc entra in conflitto con pattern microservizi comuni.'
        },
        p9: {
            title: 'Refactor Codice Legacy',
            description: 'Modernizza un vecchio file JavaScript disordinato.',
            goal: 'Analizza il file "legacy_script.js" allegato. 1) Riscrivilo in TypeScript moderno usando Async/Await invece di callback. 2) Sostituisci XMLHttpRequest con Fetch API. 3) Aggiungi interfacce di tipo corrette per l\'oggetto User. 4) Scrivi uno unit test per esso.'
        },
        p10: {
            title: 'Da Figma a React',
            description: 'Implementa un componente UI da un wireframe immagine.',
            goal: 'Guarda il "wireframe.svg" allegato. Crea un Componente React usando Tailwind CSS che replica questo layout esattamente. È una Card con un avatar arrotondato, un titolo, una barra descrizione grigia e un container bordato tratteggiato in basso.'
        }
    }
    // Note: Other languages are structurally supported. 
    // The getPresets function will fallback to EN for undefined languages to ensure stability.
};

// --- PRESET DEFINITIONS (Logic + Config, Content filled via function) ---
// This is the "Skeleton". The "Flesh" (text) comes from PRESET_TRANSLATIONS.

export const getPresets = (lang: AppLanguage): Preset[] => {
    // 1. Resolve Translations (Fallback to EN if language not explicitly fully defined in dictionary)
    const t = PRESET_TRANSLATIONS[lang] || PRESET_TRANSLATIONS[AppLanguage.EN];
    
    // 2. Resolve Mock Content Generators
    const legacyCode = getLegacyCode(lang);
    const inefficientPy = getInefficientPython(lang);
    const vulnerableJs = getVulnerableExpress(lang);
    const mockReadme = getMockReadme(lang);
    const mockDesign = getMockDesignDoc(lang);
    
    // 3. Construct Presets
    return [
      {
        id: 'p1',
        title: t.p1.title,
        description: t.p1.description,
        difficulty: 'Beginner',
        config: {
          projectName: 'portfolio-v1',
          goal: t.p1.goal,
          model: AiModel.GOOGLE_GEMINI_3_FLASH,
          contextFiles: []
        }
      },
      {
        id: 'p2',
        title: t.p2.title,
        description: t.p2.description,
        difficulty: 'Beginner',
        config: {
          projectName: 'csv-cleaner-bot',
          goal: t.p2.goal,
          model: AiModel.GOOGLE_GEMINI_3_FLASH,
          contextFiles: []
        }
      },
      {
        id: 'p11',
        title: t.p11.title,
        description: t.p11.description,
        difficulty: 'Intermediate',
        config: {
          projectName: 'stock-viz-py',
          goal: t.p11.goal,
          model: AiModel.GOOGLE_GEMINI_3_FLASH,
          contextFiles: []
        }
      },
      {
        id: 'p12',
        title: t.p12.title,
        description: t.p12.description,
        difficulty: 'Intermediate',
        config: {
          projectName: 'habit_tracker_flutter',
          goal: t.p12.goal,
          model: AiModel.CLAUDE_3_5_SONNET,
          contextFiles: []
        }
      },
      {
        id: 'p3',
        title: t.p3.title,
        description: t.p3.description,
        difficulty: 'Intermediate',
        config: {
          projectName: 'react-todo-local',
          goal: t.p3.goal,
          model: AiModel.CLAUDE_3_5_SONNET,
          contextFiles: []
        }
      },
      {
        id: 'p4',
        title: t.p4.title,
        description: t.p4.description,
        difficulty: 'Intermediate',
        config: {
          projectName: 'express-api-starter',
          goal: t.p4.goal,
          model: AiModel.CLAUDE_3_5_SONNET,
          contextFiles: []
        }
      },
      {
        id: 'p5',
        title: t.p5.title,
        description: t.p5.description,
        difficulty: 'Intermediate',
        config: {
          projectName: 'focus-fox-extension',
          goal: t.p5.goal,
          model: AiModel.GOOGLE_GEMINI_3_PRO,
          contextFiles: []
        }
      },
      {
        id: 'p6',
        title: t.p6.title,
        description: t.p6.description,
        difficulty: 'Intermediate',
        config: {
          projectName: 'echo-bot-py',
          goal: t.p6.goal,
          model: AiModel.OPENAI_GPT_4O,
          contextFiles: []
        }
      },
      {
        id: 'p13',
        title: t.p13.title,
        description: t.p13.description,
        difficulty: 'Advanced',
        config: {
          projectName: 'go-order-service',
          goal: t.p13.goal,
          model: AiModel.CLAUDE_3_7_SONNET,
          contextFiles: []
        }
      },
      {
        id: 'p14',
        title: t.p14.title,
        description: t.p14.description,
        difficulty: 'Advanced',
        config: {
          projectName: 'shop_app_flutter',
          goal: t.p14.goal,
          model: AiModel.CLAUDE_3_7_SONNET,
          contextFiles: []
        }
      },
      {
        id: 'p15',
        title: t.p15.title,
        description: t.p15.description,
        difficulty: 'Advanced',
        config: {
          projectName: 'tauri-sys-monitor',
          goal: t.p15.goal,
          model: AiModel.OPENAI_O3,
          contextFiles: []
        }
      },
      {
        id: 'p7',
        title: t.p7.title,
        description: t.p7.description,
        difficulty: 'Advanced',
        config: {
          projectName: 'saas-starter-kit',
          goal: t.p7.goal,
          model: AiModel.CLAUDE_3_7_SONNET,
          contextFiles: []
        }
      },
      {
        id: 'p8',
        title: t.p8.title,
        description: t.p8.description,
        difficulty: 'Advanced',
        config: {
          projectName: 'doc-chat-cli',
          goal: t.p8.goal,
          model: AiModel.OPENAI_O3,
          contextFiles: []
        }
      },
      {
        id: 'p16',
        title: t.p16.title,
        description: t.p16.description,
        difficulty: 'Expert',
        config: {
          projectName: 'perf-audit',
          goal: t.p16.goal,
          model: AiModel.OPENAI_O3,
          contextFiles: [
            {
              name: 'slow_script.py',
              type: 'text/x-python',
              isImage: false,
              content: inefficientPy
            }
          ]
        }
      },
      {
        id: 'p17',
        title: t.p17.title,
        description: t.p17.description,
        difficulty: 'Intermediate',
        config: {
          projectName: 'ui-polish-task',
          goal: t.p17.goal,
          model: AiModel.GOOGLE_GEMINI_3_PRO,
          contextFiles: [
             {
              name: 'component_wireframe.svg',
              type: 'image/svg+xml',
              isImage: true,
              content: MOCKUP_IMAGE_BASE64
            }
          ]
        }
      },
      {
        id: 'p18',
        title: t.p18.title,
        description: t.p18.description,
        difficulty: 'Advanced',
        config: {
          projectName: 'debug-session',
          goal: t.p18.goal,
          model: AiModel.CLAUDE_3_7_SONNET,
          contextFiles: [
            {
              name: 'legacy_script.js',
              type: 'text/javascript',
              isImage: false,
              content: legacyCode
            }
          ]
        }
      },
      {
        id: 'p19',
        title: t.p19.title,
        description: t.p19.description,
        difficulty: 'Expert',
        config: {
          projectName: 'sec-audit-express',
          goal: t.p19.goal,
          model: AiModel.OPENAI_GPT_4O,
          contextFiles: [
             {
              name: 'vulnerable_server.js',
              type: 'text/javascript',
              isImage: false,
              content: vulnerableJs
            }
          ]
        }
      },
      {
        id: 'p20',
        title: t.p20.title,
        description: t.p20.description,
        difficulty: 'Expert',
        config: {
          projectName: 'compliance-check',
          goal: t.p20.goal,
          model: AiModel.OPENAI_O1,
          contextFiles: [
            {
              name: 'README.md',
              type: 'text/markdown',
              isImage: false,
              content: mockReadme
            },
            {
              name: 'DESIGN_DOC.md',
              type: 'text/markdown',
              isImage: false,
              content: mockDesign
            }
          ]
        }
      },
      {
        id: 'p9',
        title: t.p9.title,
        description: t.p9.description,
        difficulty: 'Advanced',
        config: {
          projectName: 'legacy-refactor',
          goal: t.p9.goal,
          model: AiModel.CLAUDE_3_7_SONNET,
          contextFiles: [
            {
              name: 'legacy_script.js',
              type: 'text/javascript',
              isImage: false,
              content: legacyCode
            }
          ]
        }
      },
      {
        id: 'p10',
        title: t.p10.title,
        description: t.p10.description,
        difficulty: 'Advanced',
        config: {
          projectName: 'pixel-perfect-ui',
          goal: t.p10.goal,
          model: AiModel.GOOGLE_GEMINI_3_PRO,
          contextFiles: [
            {
              name: 'wireframe.svg',
              type: 'image/svg+xml',
              isImage: true,
              content: MOCKUP_IMAGE_BASE64
            }
          ]
        }
      }
    ];
};
