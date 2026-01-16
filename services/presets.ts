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
  const lbl = {
    [AppLanguage.IT]: 'CODICE VECCHIO SPAGHETTI - NON TOCCARE',
    [AppLanguage.EN]: 'OLD SPAGHETTI CODE - DO NOT TOUCH',
    [AppLanguage.ES]: 'CÓDIGO ESPAGUETI VIEJO - NO TOCAR',
    [AppLanguage.FR]: 'VIEUX CODE SPAGHETTI - NE PAS TOUCHER',
    [AppLanguage.DE]: 'ALTER SPAGHETTI-CODE - NICHT BERÜHREN',
    [AppLanguage.PT]: 'CÓDIGO ESPAGUETE ANTIGO - NÃO TOCAR',
    [AppLanguage.ZH]: '旧的面条代码 - 请勿触摸',
    [AppLanguage.JA]: '古いスパゲッティコード - 触らないでください'
  }[lang] || 'OLD SPAGHETTI CODE';

  return `// ${lbl}
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
  const lbl1 = {
    [AppLanguage.IT]: 'O(n^2) trova duplicati intenzionalmente lento',
    [AppLanguage.EN]: 'O(n^2) finding duplicates intentionally slow',
    [AppLanguage.ES]: 'O(n^2) búsqueda de duplicados intencionalmente lenta',
    [AppLanguage.FR]: 'O(n^2) recherche de doublons intentionnellement lente',
    [AppLanguage.DE]: 'O(n^2) Duplikatsuche absichtlich langsam',
    [AppLanguage.PT]: 'O(n^2) busca de duplicatas intencionalmente lenta',
    [AppLanguage.ZH]: 'O(n^2) 故意减慢重复项查找',
    [AppLanguage.JA]: 'O(n^2) 意図的に遅い重複検索'
  }[lang] || 'Slow O(n^2) function';

  const lbl2 = {
    [AppLanguage.IT]: 'Simulazione blocco thread principale',
    [AppLanguage.EN]: 'Blocking main thread simulation',
    [AppLanguage.ES]: 'Simulación de bloqueo del hilo principal',
    [AppLanguage.FR]: 'Simulation de blocage du thread principal',
    [AppLanguage.DE]: 'Blockierung des Haupt-Threads Simulation',
    [AppLanguage.PT]: 'Simulação de bloqueio da thread principal',
    [AppLanguage.ZH]: '阻断主线程模拟',
    [AppLanguage.JA]: 'メインスレッドのブロックシミュレーション'
  }[lang] || 'Blocking main thread';

  const lbl3 = {
    [AppLanguage.IT]: 'Avvio...',
    [AppLanguage.EN]: 'Starting...',
    [AppLanguage.ES]: 'Iniciando...',
    [AppLanguage.FR]: 'Démarrage...',
    [AppLanguage.DE]: 'Starte...',
    [AppLanguage.PT]: 'Iniciando...',
    [AppLanguage.ZH]: '正在启动...',
    [AppLanguage.JA]: '開始中...'
  }[lang] || 'Starting...';

  return `
def process_numbers(nums):
    # ${lbl1}
    duplicates = []
    for i in range(len(nums)):
        for j in range(len(nums)):
            if i != j and nums[i] == nums[j]:
                if nums[i] not in duplicates:
                    duplicates.append(nums[i])
    return duplicates

def heavy_calculation():
    # ${lbl2}
    import time
    print("${lbl3}")
    time.sleep(2) 
    return [x**2 for x in range(10000)]
`;
};

const getVulnerableExpress = (lang: AppLanguage): string => {
  const lbl1 = {
    [AppLanguage.IT]: 'ENDPOINT VULNERABILE',
    [AppLanguage.EN]: 'VULNERABLE ENDPOINT',
    [AppLanguage.ES]: 'ENDPOINT VULNERABLE',
    [AppLanguage.FR]: 'POINT D\'ENTRÉE VULNÉRABLE',
    [AppLanguage.DE]: 'VULNERABLER ENDPUNKT',
    [AppLanguage.PT]: 'ENDPOINT VULNERÁVEL',
    [AppLanguage.ZH]: '易受攻击的端点',
    [AppLanguage.JA]: '脆弱なエンドポイント'
  }[lang] || 'VULNERABLE ENDPOINT';

  const lbl2 = {
    [AppLanguage.IT]: 'Vulnerabilità SQL Injection',
    [AppLanguage.EN]: 'SQL Injection vulnerability',
    [AppLanguage.ES]: 'Vulnerabilidad de inyección SQL',
    [AppLanguage.FR]: 'Vulnérabilité d\'injection SQL',
    [AppLanguage.DE]: 'SQL-Injection-Schwachstelle',
    [AppLanguage.PT]: 'Vulnerabilidade de injeção SQL',
    [AppLanguage.ZH]: 'SQL 注入漏洞',
    [AppLanguage.JA]: 'SQLインジェクションの脆弱性'
  }[lang] || 'SQL Injection vulnerability';

  return `
const express = require('express');
const app = express();
const db = require('./db');

// ${lbl1}
app.get('/users', (req, res) => {
  const name = req.query.name;
  // ${lbl2}
  const query = "SELECT * FROM users WHERE name = '" + name + "'";
  db.exec(query, (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});
`;
};

const getMockReadme = (lang: AppLanguage): string => {
  const content = {
    [AppLanguage.IT]: `# Progetto Apollo\n\n## Panoramica\nIl Progetto Apollo è un sistema di archiviazione sicuro.\n\n## Requisiti\n1. Gli utenti devono autenticarsi via JWT.\n2. I file devono essere crittografati a riposo usando AES-256.\n3. Tutte le risposte API devono essere JSON.\n4. L'UI deve usare un tema scuro di default.`,
    [AppLanguage.EN]: `# Project Apollo\n\n## Overview\nProject Apollo is a secure file storage system.\n\n## Requirements\n1. Users must authenticate via JWT.\n2. Files must be encrypted at rest using AES-256.\n3. All API responses must be JSON.\n4. The UI must use a dark theme by default.`,
    [AppLanguage.ES]: `# Proyecto Apolo\n\n## Descripción General\nEl Proyecto Apolo es un sistema de almacenamiento de archivos seguro.\n\n## Requisitos\n1. Los usuarios deben autenticarse mediante JWT.\n2. Los archivos deben estar cifrados en reposo usando AES-256.\n3. Todas las respuestas de la API deben ser JSON.\n4. La interfaz debe usar un tema oscuro por defecto.`,
    [AppLanguage.FR]: `# Projet Apollo\n\n## Aperçu\nLe projet Apollo est un système de stockage de fichiers sécurisé.\n\n## Exigences\n1. Les utilisateurs doivent s'authentifier via JWT.\n2. Les fichiers doivent être cryptés au repos avec AES-256.\n3. Toutes les réponses de l'API doivent être au format JSON.\n4. L'interface doit utiliser un thème sombre par défaut.`,
    [AppLanguage.DE]: `# Projekt Apollo\n\n## Übersicht\nProjekt Apollo ist ein sicheres Dateispeichersystem.\n\n## Anforderungen\n1. Benutzer müssen sich über JWT authentifizieren.\n2. Dateien müssen im Ruhezustand mit AES-256 verschlüsselt sein.\n3. Alle API-Antworten müssen JSON sein.\n4. Die Benutzeroberfläche muss standardmäßig ein dunkles Thema verwenden.`,
    [AppLanguage.PT]: `# Projeto Apolo\n\n## Visão Geral\nO Projeto Apolo é um sistema de armazenamento de arquivos seguro.\n\n## Requisitos\n1. Usuários devem se autenticar via JWT.\n2. Arquivos devem ser criptografados em repouso usando AES-256.\n3. Todas as respostas da API devem ser JSON.\n4. A interface deve usar um tema escuro por padrão.`,
    [AppLanguage.ZH]: `# 阿波罗项目\n\n## 项目概览\n阿波罗项目是一个安全的文件存储系统。\n\n## 需求\n1. 用户必须通过 JWT 进行身份验证。\n2. 文件在存储时必须使用 AES-256 进行加密。\n3. 所有 API 响应必须是 JSON 格式。\n4. UI 默认必须使用暗色主题。`,
    [AppLanguage.JA]: `# プロジェクト・アポロ\n\n## 概要\nプロジェクト・アポロは安全なファイルストレージシステムです。\n\n## 要件\n1. ユーザーはJWTを介して認証する必要があります。\n2. ファイルはAES-256を使用して保存時に暗号化される必要があります。\n3. すべてのAPIレスポンスはJSONである必要があります。\n4. UIはデフォルトでダークテーマを使用する必要があります。`
  }[lang] || `# Project Apollo\n\n## Overview\nProject Apollo is a secure file storage system.`;
  return content;
};

const getMockDesignDoc = (lang: AppLanguage): string => {
  const content = {
    [AppLanguage.IT]: `# Specifica Tecnica: Apollo\n\n| Componente | Tech Stack | Vincoli |\n|------------|------------|---------|\n| Backend    | Node.js    | Niente ORM, usare query builder raw (Knex) |\n| Frontend   | React      | Deve usare Redux per lo stato |\n| Auth       | Auth0      | Scadenza Token: 1 ora |\n\n## Architettura\n- L'architettura a Microservizi è severamente vietata per l'MVP. Richiesto Monolite.`,
    [AppLanguage.EN]: `# Technical Specification: Apollo\n\n| Component | Tech Stack | Constraints |\n|-----------|------------|-------------|\n| Backend   | Node.js    | No ORMs allowed, use raw SQL builder (Knex) |\n| Frontend  | React      | Must use Redux for state |\n| Auth      | Auth0      | Token expiration: 1 hour |\n\n## Architecture\n- Microservices architecture is strictly forbidden for MVP. Monolith required.`,
    [AppLanguage.ES]: `# Especificación Técnica: Apolo\n\n| Componente | Pila Tecnológica | Restricciones |\n|------------|-----------------|---------------|\n| Backend    | Node.js         | No se permiten ORM, use Knex |\n| Frontend   | React           | Debe usar Redux para el estado |\n| Autenticación | Auth0       | Expiración del token: 1 hora |\n\n## Arquitectura\n- La arquitectura de microservicios está estrictamente prohibida para el MVP. Se requiere monolito.`,
    [AppLanguage.FR]: `# Spécifications Techniques : Apollo\n\n| Composant | Stack Technique | Contraintes |\n|-----------|-----------------|-------------|\n| Backend   | Node.js         | Pas d'ORM, utiliser Knex |\n| Frontend  | React           | Doit utiliser Redux pour l'état |\n| Auth      | Auth0           | Expiration du jeton : 1 heure |\n\n## Architecture\n- L'architecture en microservices est strictement interdite pour le MVP. Monolithe requis.`,
    [AppLanguage.DE]: `# Technische Spezifikation: Apollo\n\n| Komponente | Tech-Stack | Einschränkungen |\n|------------|------------|-----------------|\n| Backend    | Node.js    | Keine ORMs erlaubt, Knex verwenden |\n| Frontend   | React      | Muss Redux für den Status verwenden |\n| Auth       | Auth0      | Token-Ablauf: 1 Stunde |\n\n## Architektur\n- Mikroservice-Architektur ist für das MVP streng verboten. Monolith erforderlich.`,
    [AppLanguage.PT]: `# Especificação Técnica: Apolo\n\n| Componente | Stack Tecnológica | Restrições |\n|------------|------------------|------------|\n| Backend    | Node.js          | Sem ORMs, usar Knex |\n| Frontend   | React            | Deve usar Redux para o estado |\n| Auth       | Auth0            | Expiração do Token: 1 hora |\n\n## Arquitetura\n- Arquitetura de microserviços é estritamente proibida para o MVP. Monolito necessário.`,
    [AppLanguage.ZH]: `# 阿波罗技术规范\n\n| 组件 | 技术栈 | 约束 |\n|------|--------|------|\n| 后端 | Node.js | 不允许使用 ORM，使用 Knex |\n| 前端 | React | 必须使用 Redux 管理状态 |\n| 认证 | Auth0 | Token 过期时间：1 小时 |\n\n## 架构\n- MVP 严禁使用微服务架构。要求单体架构。`,
    [AppLanguage.JA]: `# 技術仕様書: アポロ\n\n| コンポーネント | 技術スタック | 制約 |\n|---------------|-------------|------|\n| バックエンド   | Node.js     | ORM禁止、Knexを使用すること |\n| フロントエンド | React       | 状態管理にReduxを使用すること |\n| 認証         | Auth0       | トークンの有効期限: 1時間 |\n\n## アーキテクチャ\n- MVPにおいてマイクロサービスアーキテクチャは厳禁です。モノリス構成が必須です。`
  }[lang] || `# Technical Specification: Apollo\n\n## Architecture\n- Monolith required.`;
  return content;
};

// Base64 Mockup (Language agnostic)
const MOCKUP_IMAGE_BASE64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOGY4Ii8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiMzZDg1ZjYiIHJ4PSI4Ii8+PHJlY3QgeD0iMTAwIiB5PSIzMCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2NjYyIgcng9IjQiLz48cmVjdCB4PSIxMDAiIHk9IjYwIiB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1IiBmaWxsPSIjZWVlIiByeD0iNCIvPjxyZWN0IHg9IjIwIiB5PSIxMTAiIHdpZHRoPSIzNjAiIGhlaWdodD0iMTUwIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjOTk5IiBzdHJva2UtZGFzaGFycmF5PSI0LDQiLz48dGV4dCB4PSIyMDAiIHk9IjE5MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiPkhlcm8gU2VjdGlvbiBQbGFjZWhvbGRlcjwvdGV4dD48L3N2Zz4=";

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
    p1: { title: 'Personal Portfolio Website', description: 'A simple static HTML/CSS/JS site to showcase a resume.', goal: 'Create a responsive, single-page personal portfolio website. It should have a "About Me" section, a "Skills" grid, and a "Contact" form that logs to console. Use Semantic HTML5 and modern CSS (Flexbox/Grid).' },
    p2: { title: 'Python Data Cleaner', description: 'Script to process and clean CSV files.', goal: 'Write a Python script using Pandas that reads a CSV file named "data.csv". It should: 1) Drop rows with missing values, 2) Convert date columns to ISO format, 3) Export the result to "clean_data.json". Add error handling.' },
    p11: { title: 'Streamlit Stock Dashboard', description: 'Python data visualization app.', goal: 'Create a Streamlit application (`app.py`). It should: 1) Accept a stock symbol input (e.g., AAPL). 2) Use `yfinance` to fetch last 3 months of data. 3) Display a line chart of Closing prices using `plotly`. 4) Show key metrics (High, Low, Volume) in columns.' },
    p12: { title: 'Habit Tracker Flutter', description: 'Mobile app UI with Dart & Flutter.', goal: 'Create a Flutter application main screen. 1) Use `ListView.builder` to show a list of habits. 2) Each habit has a name and a checkbox. 3) Use a simple in-memory List to store state (no database yet). 4) Add a FloatingActionButton to show a dialog for adding a new habit. Use Material 3 design.' },
    p3: { title: 'React Todo App', description: 'Classic Todo list with LocalStorage persistence.', goal: 'Build a React functional component "TodoApp". Features: Add task, Toggle completion status, Delete task, Filter by (All/Active/Completed). Persist all state to browser LocalStorage so data survives refresh. Use Tailwind CSS for styling.' },
    p4: { title: 'Express.js REST API', description: 'Backend server with CRUD endpoints.', goal: 'Create a Node.js Express API for managing a "Bookstore". Implement endpoints: GET /books, GET /books/:id, POST /books, PUT /books/:id, DELETE /books/:id. Use an in-memory array for storage. Add input validation.' },
    p5: { title: 'Chrome Extension', description: 'Focus mode extension to block websites.', goal: 'Build a Chrome Extension Manifest V3. It should have a popup.html where the user can toggle "Focus Mode". When active, it should block access to "facebook.com" and "twitter.com" using the declarativeNetRequest API.' },
    p6: { title: 'Discord/Telegram Bot', description: 'Simple bot to reply to commands.', goal: 'Create a Python script for a Discord Bot. It should listen for the command "!ping" and reply "pong". It should also have a "!weather <city>" command that mocks a weather API response. Include instructions on how to set the token.' },
    p13: { title: 'Go Microservice (Gin)', description: 'High-performance API in Go.', goal: 'Create a Golang REST API using the Gin framework. 1) Define a struct for `Order`. 2) Implement `POST /orders` and `GET /orders`. 3) Use a mutex to handle concurrent writes to an in-memory map safely. 4) Add structured logging using `slog` or `zap`.' },
    p14: { title: 'Flutter E-Commerce (Provider)', description: 'Complex state management in Dart.', goal: 'Scaffold a Flutter Shop App. 1) Setup `Provider` for state management. 2) Create a `Product` model and a `Cart` provider. 3) Build a Product Grid Screen that navigates to a Product Detail Screen. 4) Implement an "Add to Cart" function that updates the badge counter on the App Bar.' },
    p15: { title: 'Rust Tauri App', description: 'Desktop app with Rust backend and HTML frontend.', goal: 'Create a Tauri app setup. 1) The Rust backend (`main.rs`) should have a command `get_system_stats` that returns mock CPU usage. 2) The Frontend (HTML/JS) should invoke this command every 1 second and update a progress bar. Ensure type safety in the IPC bridge.' },
    p7: { title: 'Next.js SaaS Boilerplate', description: 'Auth, Database, and Landing Page setup.', goal: 'Scaffold a Next.js 15 (App Router) application. Structure it for a SaaS: 1) Landing page with Hero section, 2) Dashboard layout (protected), 3) Mock authentication middleware. Use Shadcn/UI components.' },
    p8: { title: 'RAG CLI Tool', description: 'Chat with your documents using Embeddings.', goal: 'Build a Python CLI tool that performs RAG (Retrieval Augmented Generation). 1) Ingest a folder of .txt files, 2) Chunk them and store in a local vector store (like ChromaDB or FAISS), 3) Allow the user to ask questions and answer based ONLY on the context.' },
    p16: { title: 'Performance Optimizer', description: 'Analyze code complexity and suggest improvements.', goal: 'Act as a Senior Performance Engineer. 1) Analyze the attached `slow_script.py`. 2) Identify the Time Complexity (Big O) of existing functions. 3) Rewrite the `process_numbers` function to use a Set for O(n) lookup instead of O(n^2). 4) Explain why the changes improve speed.' },
    p17: { title: 'UI/UX Polish & Fix', description: 'Improve interface based on code and mockups.', goal: 'Act as a UI/UX Engineer. Look at the attached `component_wireframe.svg`. The goal is to implement this exactly using HTML/Tailwind. Ensure: 1) The padding matches the visual weight of the wireframe. 2) Contrast ratios are accessible (WCAG AA). 3) The card is responsive on mobile.' },
    p18: { title: 'Bug Hunter (Debug)', description: 'Find and fix logic errors in provided code.', goal: 'Act as a QA Engineer. Analyze the attached `legacy_script.js`. There are logic errors in how the callback handles the HTTP state. 1) Identify why the user list might remain empty or error out. 2) Fix the `XMLHttpRequest` implementation. 3) Add console logs to trace execution flow.' },
    p19: { title: 'Security Auditor', description: 'Identify vulnerabilities (OWASP) and patch them.', goal: 'Act as a Cyber Security Expert. Review `vulnerable_server.js`. 1) Identify the SQL Injection vulnerability in the `/users` endpoint. 2) Rewrite the code to use Parameterized Queries (Prepared Statements). 3) Explain how the attack vector works and how your fix prevents it.' },
    p20: { title: 'Spec Compliance Check', description: 'Verify code against README and Design Docs.', goal: 'Act as a Lead Architect/QA. You have the `README.md` (Business Req) and `DESIGN_DOC.md` (Tech Constraints). 1) Cross-reference them against a hypothetical implementation. 2) Generate a checklist of 5 critical checks that a CI/CD pipeline should run to ensure the code matches these documents. 3) Specifically check if "Monolith" constraint in Design Doc conflicts with any common microservice patterns.' },
    p9: { title: 'Refactor Legacy Code', description: 'Modernize an old, messy JavaScript file.', goal: 'Analyze the attached "legacy_script.js". 1) Rewrite it in modern TypeScript using Async/Await instead of callbacks. 2) Replace XMLHttpRequest with Fetch API. 3) Add proper type interfaces for the User object. 4) Write a unit test for it.' },
    p10: { title: 'Figma to React', description: 'Implement a UI component from an attached image wireframe.', goal: 'Look at the attached "wireframe.svg". Create a React Component using Tailwind CSS that replicates this layout exactly. It is a Card component with a rounded avatar, a title, a gray description bar, and a dashed border container at the bottom.' }
  },
  [AppLanguage.IT]: {
    p1: { title: 'Sito Portfolio Personale', description: 'Un semplice sito statico HTML/CSS/JS per mostrare il CV.', goal: 'Crea un sito web portfolio personale reattivo a pagina singola. Deve avere una sezione "Chi Sono", una griglia "Skills" e un modulo "Contatti" che stampa in console. Usa HTML5 Semantico e CSS moderno (Flexbox/Grid).' },
    p2: { title: 'Pulitore Dati Python', description: 'Script per processare e pulire file CSV.', goal: 'Scrivi uno script Python usando Pandas che legge un file CSV chiamato "data.csv". Deve: 1) Rimuovere le righe con valori mancanti, 2) Convertire le colonne data in formato ISO, 3) Esportare il risultato in "clean_data.json". Aggiungi gestione errori.' },
    p11: { title: 'Dashboard Azionaria Streamlit', description: 'App di visualizzazione dati in Python.', goal: 'Crea un\'applicazione Streamlit (`app.py`). Deve: 1) Accettare un simbolo azionario in input (es. AAPL). 2) Usare `yfinance` per recuperare gli ultimi 3 mesi di dati. 3) Mostrare un grafico a linee dei prezzi di Chiusura usando `plotly`. 4) Mostrare metriche chiave (High, Low, Volume) in colonne.' },
    p12: { title: 'Habit Tracker Flutter', description: 'UI app mobile con Dart & Flutter.', goal: 'Crea una schermata principale per app Flutter. 1) Usa `ListView.builder` per mostrare una lista di abitudini. 2) Ogni abitudine ha nome e checkbox. 3) Usa una semplice lista in memoria per lo stato. 4) Aggiungi un FloatingActionButton per mostrare un dialog per aggiungere nuove abitudini. Usa design Material 3.' },
    p3: { title: 'React Todo App', description: 'Classica lista Todo con persistenza LocalStorage.', goal: 'Costruisci un componente funzionale React "TodoApp". Funzionalità: Aggiungi task, Toggle stato completamento, Elimina task, Filtra per (Tutti/Attivi/Completati). Persisti tutto lo stato nel LocalStorage del browser. Usa Tailwind CSS per lo stile.' },
    p4: { title: 'API REST Express.js', description: 'Server Backend con endpoint CRUD.', goal: 'Crea una API Node.js Express per gestire una "Libreria". Implementa endpoint: GET /books, GET /books/:id, POST /books, PUT /books/:id, DELETE /books/:id. Usa un array in memoria per lo storage. Aggiungi validazione input.' },
    p5: { title: 'Estensione Chrome', description: 'Estensione Focus mode per bloccare siti.', goal: 'Costruisci un\'Estensione Chrome Manifest V3. Deve avere un popup.html dove l\'utente può attivare la "Focus Mode". Quando attiva, deve bloccare l\'accesso a "facebook.com" e "twitter.com" usando l\'API declarativeNetRequest.' },
    p6: { title: 'Bot Discord/Telegram', description: 'Bot semplice per rispondere ai comandi.', goal: 'Crea uno script Python per un Bot Discord. Deve ascoltare il comando "!ping" e rispondere "pong". Deve anche avere un comando "!weather <città>" che simula una risposta API meteo. Includi istruzioni su come impostare il token.' },
    p13: { title: 'Microservizio Go (Gin)', description: 'API ad alte prestazioni in Go.', goal: 'Crea una API REST Golang usando il framework Gin. 1) Definisci una struct per `Order`. 2) Implementa `POST /orders` and `GET /orders`. 3) Usa un mutex per gestire scritture concorrenti su una mappa in memoria in sicurezza. 4) Aggiungi logging strutturato usando `slog` o `zap`.' },
    p14: { title: 'Flutter E-Commerce (Provider)', description: 'Gestione stato complessa in Dart.', goal: 'Imposta una Shop App Flutter. 1) Configura `Provider` per la gestione stato. 2) Crea un modello `Product` e un provider `Cart`. 3) Costruisci una Griglia Prodotti che naviga verso un Dettaglio Prodotto. 4) Implementa una funzione "Aggiungi al Carrello" che aggiorna il contatore badge nella App Bar.' },
    p15: { title: 'App Tauri Rust', description: 'App desktop con backend Rust e frontend HTML.', goal: 'Crea un setup app Tauri. 1) Il backend Rust (`main.rs`) deve avere un comando `get_system_stats` che ritorna un utilizzo CPU simulato. 2) Il Frontend (HTML/JS) deve invocare questo comando ogni secondo e aggiornare una progress bar. Assicura tipizzazione sicura nel bridge IPC.' },
    p7: { title: 'Boilerplate SaaS Next.js', description: 'Setup Auth, Database e Landing Page.', goal: 'Imposta un\'applicazione Next.js 15 (App Router). Strutturala per un SaaS: 1) Landing page con sezione Hero, 2) Layout Dashboard (protetto), 3) Middleware autenticazione simulato. Usa componenti Shadcn/UI.' },
    p8: { title: 'Tool CLI RAG', description: 'Chatta con i tuoi documenti usando Embeddings.', goal: 'Costruisci un tool CLI Python che esegue RAG (Retrieval Augmented Generation). 1) Ingerisci una cartella di file .txt, 2) Dividili in chunk e salvali in un vector store locale (come ChromaDB o FAISS), 3) Permetti all\'utente di fare domande e rispondi basandoti SOLO sul contesto.' },
    p16: { title: 'Ottimizzatore Performance', description: 'Analizza complessità codice e suggerisci miglioramenti.', goal: 'Agisci come Senior Performance Engineer. 1) Analizza il file `slow_script.py` allegato. 2) Identifica la Complessità Temporale (Big O) delle funzioni esistenti. 3) Riscrivi la funzione `process_numbers` per usare un Set per lookup O(n) invece di O(n^2). 4) Spiega perché i cambiamenti migliorano la velocità.' },
    p17: { title: 'UI/UX Polish & Fix', description: 'Migliora interfaccia basandoti su codice e mockup.', goal: 'Agisci come UI/UX Engineer. Guarda il `component_wireframe.svg` allegato. L\'obiettivo è implementarlo esattamente usando HTML/Tailwind. Assicura: 1) Il padding corrisponda al peso visivo del wireframe. 2) I contrasti siano accessibili (WCAG AA). 3) La card sia responsive su mobile.' },
    p18: { title: 'Cacciatore di Bug (Debug)', description: 'Trova e correggi errori logici nel codice.', goal: 'Agisci come QA Engineer. Analizza il `legacy_script.js` allegato. Ci sono errori logici in come il callback gestisce lo stato HTTP. 1) Identifica perché la lista utenti potrebbe rimanere vuota o andare in errore. 2) Correggi l\'implementazione `XMLHttpRequest`. 3) Aggiungi console logs per tracciare il flusso.' },
    p19: { title: 'Auditor di Sicurezza', description: 'Identifica vulnerabilità (OWASP) e correggile.', goal: 'Agisci come Esperto Cyber Security. Revisiona `vulnerable_server.js`. 1) Identifica la vulnerabilità SQL Injection nell\'endpoint `/users`. 2) Riscrivi il codice usando Query Parametrizzate (Prepared Statements). 3) Spiega come funziona il vettore di attacco e come la tua fix lo previene.' },
    p20: { title: 'Controllo Compliance Spec', description: 'Verifica codice contro README e Design Doc.', goal: 'Agisci come Lead Architect/QA. Hai il `README.md` (Requisiti Business) e `DESIGN_DOC.md` (Vincoli Tecnici). 1) Incrociali contro una implementazione ipotetica. 2) Genera una checklist di 5 controlli critici che una pipeline CI/CD dovrebbe eseguire per assicurare che il codice rispetti questi documenti. 3) Controlla specificamente se il vincolo "Monolite" nel Design Doc entra in conflitto con pattern microservizi comuni.' },
    p9: { title: 'Refactor Codice Legacy', description: 'Modernizza un vecchio file JavaScript disordinato.', goal: 'Analizza il file "legacy_script.js" allegato. 1) Riscrivilo in TypeScript moderno usando Async/Await invece di callback. 2) Sostituisci XMLHttpRequest con Fetch API. 3) Aggiungi interfacce di tipo corrette per l\'oggetto User. 4) Scrivi uno unit test per esso.' },
    p10: { title: 'Da Figma a React', description: 'Implementa un componente UI da un wireframe immagine.', goal: 'Guarda il "wireframe.svg" allegato. Crea un Componente React usando Tailwind CSS che replica questo layout esattamente. È una Card con un avatar arrotondato, un titolo, una barra descrizione grigia e un container bordato tratteggiato in basso.' }
  },
  [AppLanguage.ES]: {
    p1: { title: 'Sitio Web de Portafolio Personal', description: 'Un sitio estático simple HTML/CSS/JS para mostrar un currículum.', goal: 'Cree un sitio web de portafolio personal de una sola página y responsivo. Debe tener una sección "Sobre mí", una cuadrícula de "Habilidades" y un formulario de "Contacto" que registre en la consola. Use HTML5 semántico y CSS moderno.' },
    p2: { title: 'Limpiador de Datos Python', description: 'Script para procesar y limpiar archivos CSV.', goal: 'Escriba un script en Python usando Pandas que lea un archivo CSV llamado "data.csv". Debe: 1) Eliminar filas con valores faltantes, 2) Convertir columnas de fecha al formato ISO, 3) Exportar el resultado a "clean_data.json".' },
    p11: { title: 'Dashboard de Acciones Streamlit', description: 'App de visualización de datos en Python.', goal: 'Crea una aplicación Streamlit (`app.py`). Debe: 1) Aceptar un símbolo de acción (ej. AAPL). 2) Usar `yfinance` para obtener datos de los últimos 3 meses. 3) Mostrar un gráfico de precios de cierre. 4) Mostrar métricas clave.' },
    p12: { title: 'Habit Tracker Flutter', description: 'IU de app móvil con Dart y Flutter.', goal: 'Cree una pantalla principal de Flutter. 1) Use `ListView.builder` para mostrar hábitos. 2) Cada hábito tiene nombre y checkbox. 3) Use una lista en memoria. 4) Añada un botón para nuevos hábitos.' },
    p3: { title: 'React Todo App', description: 'Lista de tareas clásica con persistencia LocalStorage.', goal: 'Construya un componente React "TodoApp". Características: Añadir tarea, marcar completada, eliminar, filtrar. Persista el estado en LocalStorage. Use Tailwind CSS.' },
    p4: { title: 'Express.js REST API', description: 'Servidor backend con endpoints CRUD.', goal: 'Cree una API Express para una "Librería". Implemente: GET /books, POST, PUT, DELETE. Use un array en memoria. Añada validación.' },
    p5: { title: 'Extensión de Chrome', description: 'Extensión de modo enfoque para bloquear sitios.', goal: 'Construya una Extensión Chrome V3. Debe tener un popup para activar el "Modo Enfoque" que bloquee sitios como facebook.com.' },
    p6: { title: 'Bot de Discord/Telegram', description: 'Bot simple para responder comandos.', goal: 'Cree un script en Python para un Bot. Debe responder a "!ping" con "pong" y tener un comando de clima simulado.' },
    p13: { title: 'Microservicio Go (Gin)', description: 'API de alto rendimiento en Go.', goal: 'Cree una API REST en Go usando Gin. Use una estructura `Order`, implemente endpoints y gestione la concurrencia con mutex.' },
    p14: { title: 'Flutter E-Commerce (Provider)', description: 'Gestión de estado compleja en Dart.', goal: 'Escafolde una App de Tienda Flutter. Use `Provider` para el estado, cree un modelo de producto y un carrito con contador.' },
    p15: { title: 'Rust Tauri App', description: 'App de escritorio con Rust y HTML.', goal: 'Cree un setup de Tauri. El backend en Rust debe devolver estadísticas del sistema simuladas y el frontend debe mostrarlas cada segundo.' },
    p7: { title: 'Boilerplate SaaS Next.js', description: 'Configuración de Auth, Base de Datos y Landing Page.', goal: 'Escafolde una app Next.js 15. Incluya Landing Page, Dashboard protegido y middleware de autenticación simulado.' },
    p8: { title: 'Herramienta CLI RAG', description: 'Chatee con sus documentos usando Embeddings.', goal: 'Construya una herramienta CLI que realice RAG. Procese archivos .txt, guárdelos en un vector store local y responda preguntas.' },
    p16: { title: 'Optimizador de Rendimiento', description: 'Analiza la complejidad del código y sugiere mejoras.', goal: 'Actúe como Ingeniero de Rendimiento Senior. 1) Analice el archivo `slow_script.py` adjunto. 2) Identifique la Complejidad Temporal (Big O) de las funciones existentes. 3) Reescriba la función `process_numbers` para usar un Set para la búsqueda O(n) en lugar de O(n^2).' },
    p17: { title: 'Pulido de IU/UX', description: 'Mejora la interfaz basada en código y maquetas.', goal: 'Actúe como Ingeniero IU/UX. Implemente el wireframe adjunto usando HTML/Tailwind. Asegure accesibilidad y responsividad.' },
    p18: { title: 'Cazador de Errores (Debug)', description: 'Encuentre y corrija errores de lógica.', goal: 'Actúe como Ingeniero de QA. Analice `legacy_script.js`. Identifique por qué falla la carga de usuarios y corrija la implementación de XMLHttpRequest.' },
    p19: { title: 'Auditor de Seguridad', description: 'Identifique vulnerabilidades (OWASP) y corríjalas.', goal: 'Actúe como experto en ciberseguridad. Revise `vulnerable_server.js`. 1) Identifique la vulnerabilidad de inyección SQL en el endpoint `/users`. 2) Reescriba el código utilizando consultas parametrizadas.' },
    p20: { title: 'Cumplimiento de Especificaciones', description: 'Verifica el código contra README y Design Docs.', goal: 'Actúe como Arquitecto Principal. Use README y DESIGN_DOC para generar una checklist de 5 puntos críticos para CI/CD.' },
    p9: { title: 'Refactorización de Código Legacy', description: 'Modernice un archivo JavaScript antiguo.', goal: 'Analice `legacy_script.js`. Reescríbalo en TypeScript usando Async/Await y Fetch API.' },
    p10: { title: 'De Figma a React', description: 'Implemente un componente React desde un wireframe.', goal: 'Cree un componente de tarjeta en React/Tailwind que replique exactamente el wireframe.svg adjunto.' }
  },
  [AppLanguage.FR]: {
    p1: { title: 'Site Web Portfolio Personnel', description: 'Un site statique simple HTML/CSS/JS pour présenter un CV.', goal: 'Créez un site web portfolio personnel réactif d\'une seule page. Il doit comporter une section "À propos", une grille "Compétences" et un formulaire de "Contact". Utilisez HTML5 sémantique et CSS moderne.' },
    p2: { title: 'Nettoyeur de Données Python', description: 'Script pour traiter et nettoyer des fichiers CSV.', goal: 'Écrivez un script Python utilisant Pandas qui lit un fichier CSV nommé "data.csv". Il doit : 1) Supprimer les lignes avec des valeurs manquantes, 2) Convertir les colonnes de date au format ISO, 3) Exporter le résultat vers "clean_data.json".' },
    p11: { title: 'Tableau de Bord Boursier Streamlit', description: 'App de visualisation de données en Python.', goal: 'Créez une application Streamlit (`app.py`). Elle doit : 1) Accepter un symbole boursier. 2) Utiliser `yfinance` pour les données. 3) Afficher un graphique.' },
    p12: { title: 'Habit Tracker Flutter', description: 'Interface mobile avec Dart et Flutter.', goal: 'Créez un écran Flutter. 1) Utilisez `ListView.builder`. 2) Case à cocher pour chaque habitude. 3) Liste en mémoire.' },
    p3: { title: 'React Todo App', description: 'Liste de tâches classique avec persistance LocalStorage.', goal: 'Construisez une application Todo avec React. Gérez l\'ajout, la suppression et le filtrage. Persistez dans LocalStorage.' },
    p4: { title: 'Express.js REST API', description: 'Serveur backend avec endpoints CRUD.', goal: 'Créez une API pour une librairie. Implémentez GET, POST, PUT, DELETE. Utilisez un tableau en mémoire.' },
    p5: { title: 'Extension Chrome', description: 'Extension mode focus pour bloquer des sites.', goal: 'Créez une extension V3 avec un popup pour bloquer facebook.com quand le mode focus est actif.' },
    p6: { title: 'Bot Discord/Telegram', description: 'Bot simple pour répondre aux commandes.', goal: 'Créez un bot Python qui répond "!ping". Ajoutez une commande météo simulée.' },
    p13: { title: 'Microservice Go (Gin)', description: 'API haute performance en Go.', goal: 'Créez une API REST avec Gin. Gérez les commandes avec une map en mémoire et des mutex.' },
    p14: { title: 'Flutter E-Commerce (Provider)', description: 'Gestion d\'état complexe avec Dart.', goal: 'Créez une app boutique. Utilisez `Provider`, un modèle de produit et un panier.' },
    p15: { title: 'Rust Tauri App', description: 'App desktop avec Rust et HTML.', goal: 'Configurez Tauri. Le backend Rust doit envoyer des stats système simulées au frontend.' },
    p7: { title: 'Boilerplate SaaS Next.js', description: 'Auth, Base de données et Landing Page.', goal: 'Créez une app Next.js 15 avec landing page, dashboard et auth simulée.' },
    p8: { title: 'Outil CLI RAG', description: 'Chattez avec vos documents via Embeddings.', goal: 'Créez un outil CLI pour le RAG. Ingestez des .txt, stockez dans un vector store et répondez aux questions.' },
    p16: { title: 'Optimiseur de Performance', description: 'Analyse la complexité du code et suggère des améliorations.', goal: 'Agissez en tant qu\'ingénieur performance senior. 1) Analysez le fichier `slow_script.py` joint. 2) Identifiez la complexité temporelle (Big O) des fonctions existantes. 3) Réécrivez la fonction `process_numbers` pour utiliser un Set pour une recherche en O(n).' },
    p17: { title: 'Polissage UI/UX', description: 'Améliorez l\'interface selon le code et les maquettes.', goal: 'Agissez comme ingénieur UI/UX. Implémentez le wireframe avec Tailwind. Assurez l\'accessibilité.' },
    p18: { title: 'Chasseur de Bugs', description: 'Trouvez et corrigez les erreurs logiques.', goal: 'Agissez en tant qu\'ingénieur QA. Déboguez `legacy_script.js` et corrigez l\'usage de XMLHttpRequest.' },
    p19: { title: 'Auditeur de Sécurité', description: 'Identifiez les vulnérabilités (OWASP) et corrigez-les.', goal: 'Agissez en tant qu\'expert en cybersécurité. Examinez `vulnerable_server.js`. 1) Identifiez la vulnérabilité d\'injection SQL dans le point de terminaison `/users`. 2) Réécrivez le code en utilisant des requêtes paramétrées.' },
    p20: { title: 'Conformité aux Spécifications', description: 'Vérifiez le code par rapport aux docs.', goal: 'Agissez comme architecte. Créez une checklist CI/CD de 5 points basée sur README et DESIGN_DOC.' },
    p9: { title: 'Refactorisation Code Legacy', description: 'Modernisez un vieux fichier JavaScript.', goal: 'Modernisez `legacy_script.js` en utilisant TypeScript, Async/Await et Fetch.' },
    p10: { title: 'De Figma à React', description: 'Implémentez un composant React depuis un wireframe.', goal: 'Créez un composant de carte React/Tailwind répliquant exactement le wireframe SVG.' }
  },
  [AppLanguage.DE]: {
    p1: { title: 'Persönliche Portfolio-Website', description: 'Eine einfache statische HTML/CSS/JS-Seite zur Präsentation eines Lebenslaufs.', goal: 'Erstellen Sie eine responsive, einseitige persönliche Portfolio-Website. Sie sollte einen "Über mich"-Bereich, ein "Fähigkeiten"-Raster und ein "Kontakt"-Formular enthalten. Verwenden Sie semantisches HTML5 und modernes CSS.' },
    p2: { title: 'Python Datentrainer', description: 'Skript zum Verarbeiten und Reinigen von CSV-Dateien.', goal: 'Schreiben Sie ein Python-Skript mit Pandas, das eine CSV-Datei namens "data.csv" liest. Es sollte: 1) Zeilen mit fehlenden Werten löschen, 2) Datumsspalten in das ISO-Format konvertieren, 3) Das Ergebnis nach "clean_data.json" exportieren.' },
    p11: { title: 'Streamlit Aktiendashboard', description: 'Python-Datenvisualisierungs-App.', goal: 'Erstellen Sie eine Streamlit-App (`app.py`). 1) Aktiensymbol-Eingabe. 2) `yfinance` Daten abrufen. 3) Chart anzeigen.' },
    p12: { title: 'Flutter Habit Tracker', description: 'Mobile UI mit Dart & Flutter.', goal: 'Erstellen Sie einen Flutter-Screen mit `ListView.builder` für Gewohnheiten und Checkboxen.' },
    p3: { title: 'React Todo App', description: 'Klassische Todo-Liste mit LocalStorage.', goal: 'Bauen Sie eine React Todo-App. CRUD-Funktionen und Filter. Speichern in LocalStorage.' },
    p4: { title: 'Express.js REST API', description: 'Backend-Server mit CRUD.', goal: 'Erstellen Sie eine Bücher-API mit Express. GET, POST, PUT, DELETE Endpunkte implementieren.' },
    p5: { title: 'Chrome Erweiterung', description: 'Fokus-Modus zur Blockierung von Seiten.', goal: 'Bauen Sie eine Extension V3, die facebook.com blockiert, wenn der Fokus-Modus aktiv ist.' },
    p6: { title: 'Discord/Telegram Bot', description: 'Einfacher Bot für Befehle.', goal: 'Python-Bot erstellen, der auf "!ping" antwortet. Simulierte Wetter-API integrieren.' },
    p13: { title: 'Go Microservice (Gin)', description: 'Hochleistungs-API in Go.', goal: 'REST-API mit Gin in Go erstellen. Thread-sichere Map für Bestellungen nutzen.' },
    p14: { title: 'Flutter E-Commerce (Provider)', description: 'Zustandsmanagement in Dart.', goal: 'Flutter Shop-App mit `Provider`. Warenkorb-Funktionalität implementieren.' },
    p15: { title: 'Rust Tauri App', description: 'Desktop-App mit Rust und HTML.', goal: 'Tauri-Setup erstellen. Rust-Backend liefert Systemstatistiken an das Frontend.' },
    p7: { title: 'Next.js SaaS Boilerplate', description: 'Auth, Datenbank und Landing Page.', goal: 'Next.js 15 App mit Dashboard, Auth-Middleware und Landing Page erstellen.' },
    p8: { title: 'RAG CLI Tool', description: 'Chat mit Dokumenten via Embeddings.', goal: 'CLI-Tool für RAG bauen. Dokumente indizieren und Fragen kontextbasiert beantworten.' },
    p16: { title: 'Leistungsoptimierer', description: 'Analysiert die Codekomplexität und schlägt Verbesserungen vor.', goal: 'Agieren Sie als Senior Performance Engineer. 1) Analysieren Sie das beigefügte `slow_script.py`. 2) Identifizieren Sie die Zeitkomplexität (Big O) vorhandener Funktionen. 3) Schreiben Sie die Funktion `process_numbers` neu, um ein Set für O(n)-Lookup zu verwenden.' },
    p17: { title: 'UI/UX Design-Fix', description: 'Interface-Optimierung nach Vorlage.', goal: 'UI/UX Engineer: Wireframe exakt mit Tailwind umsetzen. Barrierefreiheit beachten.' },
    p18: { title: 'Fehlersuche (Debug)', description: 'Logikfehler finden und beheben.', goal: 'QA Engineer: `legacy_script.js` analysieren, XMLHttpRequest-Fehler beheben.' },
    p19: { title: 'Sicherheitsprüfer', description: 'Identifizieren Sie Schwachstellen (OWASP) und beheben Sie diese.', goal: 'Agieren Sie als Cybersicherheitsexperte. Überprüfen Sie `vulnerable_server.js`. 1) Identifizieren Sie die SQL-Injection-Schwachstelle im Endpunkt `/users`. 2) Schreiben Sie den Code neu, um parametrisierte Abfragen zu verwenden.' },
    p20: { title: 'Spezifikations-Check', description: 'Code gegen README und Design Docs prüfen.', goal: 'Lead Architekt: CI/CD Checklist mit 5 Punkten aus Dokumenten erstellen.' },
    p9: { title: 'Legacy Code Refactoring', description: 'JS-Refactoring nach modernen Standards.', goal: 'Modernisierung von `legacy_script.js` mit TypeScript und Fetch.' },
    p10: { title: 'Figma zu React', description: 'React-Komponente aus Wireframe erstellen.', goal: 'Layout aus wireframe.svg exakt als React-Komponente mit Tailwind bauen.' }
  },
  [AppLanguage.PT]: {
    p1: { title: 'Site de Portfólio Pessoal', description: 'Um site estático simples em HTML/CSS/JS para mostrar um currículo.', goal: 'Crie um site de portfólio pessoal responsivo de página única. Deve ter uma seção "Sobre Mim", uma grade de "Habilidades" e um formulário de "Contato". Use HTML5 semântico e CSS moderno.' },
    p2: { title: 'Limpador de Dados Python', description: 'Script para processar e limpar arquivos CSV.', goal: 'Escreva um script Python usando Pandas que leia um arquivo CSV chamado "data.csv". Deve: 1) Remover linhas com valores ausentes, 2) Converter colunas de data para o formato ISO, 3) Exportar o resultado para "clean_data.json".' },
    p11: { title: 'Painel de Ações Streamlit', description: 'App de visualização de dados em Python.', goal: 'Crie um aplicativo Streamlit. 1) Input de símbolo. 2) Dados do yfinance. 3) Gráfico de preços.' },
    p12: { title: 'Habit Tracker Flutter', description: 'UI mobile com Dart & Flutter.', goal: 'Crie uma tela Flutter com lista de hábitos e checkboxes.' },
    p3: { title: 'React Todo App', description: 'Lista de tarefas con LocalStorage.', goal: 'Construa um buscador Todo em React com persistência no LocalStorage.' },
    p4: { title: 'Express.js REST API', description: 'Servidor backend CRUD.', goal: 'Crie uma API para livraria com Express. Endpoints GET, POST, PUT, DELETE.' },
    p5: { title: 'Extensão Chrome', description: 'Modo foco para bloquear sites.', goal: 'Crie uma extensão V3 que bloqueia facebook.com no modo foco.' },
    p6: { title: 'Bot Discord/Telegram', description: 'Bot simples para comandos.', goal: 'Bot Python que responde a "!ping". Simule API de clima.' },
    p13: { title: 'Go Microservice (Gin)', description: 'API de alta performance em Go.', goal: 'Crie uma API REST com Gin e use mutex para segurança de memória.' },
    p14: { title: 'Flutter E-Commerce (Provider)', description: 'Gerenciamento de estado em Dart.', goal: 'App de loja Flutter usando Provider para estado global e carrinho.' },
    p15: { title: 'Rust Tauri App', description: 'App desktop com Rust e HTML.', goal: 'Setup Tauri com backend Rust enviando métricas para o frontend.' },
    p7: { title: 'Boilerplate SaaS Next.js', description: 'Auth, DB e Landing Page.', goal: 'Prepare uma app Next.js 15 para SaaS com dashboard e auth.' },
    p8: { title: 'Ferramenta CLI RAG', description: 'Chat com documentos via Embeddings.', goal: 'Construa ferramenta RAG com Python e vector store local.' },
    p16: { title: 'Otimizador de Desempenho', description: 'Analisa a complexidade do código e suggere melhorias.', goal: 'Atue como Engenheiro de Desempenho Sênior. 1) Analise o arquivo `slow_script.py` anexo. 2) Identifique a Complexidade de Tempo (Big O) das funções existentes. 3) Reescreva a função `process_numbers` para usar um Set para busca O(n).' },
    p17: { title: 'Ajuste de UI/UX', description: 'Melhore interface via código e mockups.', goal: 'Engenheiro UI/UX: Implemente wireframe SVG com Tailwind CSS.' },
    p18: { title: 'Caçador de Bugs', description: 'Debug de erros lógicos.', goal: 'QA Engineer: Analise `legacy_script.js` e corrija XMLHttpRequest.' },
    p19: { title: 'Auditor de Segurança', description: 'Identifique vulnerabilidades (OWASP) e corrija-as.', goal: 'Atue como um especialista em segurança cibernética. Revise `vulnerable_server.js`. 1) Identifique a vulnerabilidade de injeção SQL no endpoint `/users`. 2) Reescreva o código usando consultas parametrizadas.' },
    p20: { title: 'Check de Conformidade', description: 'Verifica código contra especificações.', goal: 'Lead Architect: Crie checklist CI/CD de 5 pontos via docs.' },
    p9: { title: 'Refatoração de Código', description: 'Modernização de JS legado.', goal: 'Refatore `legacy_script.js` para TypeScript e Fetch API.' },
    p10: { title: 'De Figma para React', description: 'Componente React via wireframe.', goal: 'Crie componente de Card exato ao wireframe.svg usando Tailwind.' }
  },
  [AppLanguage.ZH]: {
    p1: { title: '个人作品集网站', description: '一个简单的静态 HTML/CSS/JS 网站，用于展示简历。', goal: '创建一个响应式的单页个人作品集网站。它应该包含“关于我”部分、“技能”网格和记录到控制台的“联系”表单。使用语义化 HTML5 和现代 CSS。' },
    p2: { title: 'Python 数据清洗器', description: '用于处理和清洗 CSV 文件的脚本。', goal: '使用 Pandas 编写一个读取名为“data.csv”的 CSV 文件的 Python 脚本。它应该：1) 删除缺失值的行，2) 将日期列转换为 ISO 格式，3) 将结果导出到“clean_data.json”。' },
    p11: { title: 'Streamlit 股票仪表板', description: 'Python 数据可视化应用。', goal: '创建一个 Streamlit 应用程序。输入股票代码，获取 yfinance 数据，并显示价格图表。' },
    p12: { title: 'Flutter 习惯追踪器', description: 'Dart & Flutter 移动端 UI。', goal: '使用 ListView.builder 和复选框创建 Flutter 习惯列表界面。' },
    p3: { title: 'React 待办事项应用', description: '带 LocalStorage 存储的经典待办列表。', goal: '构建 React Todo 应用，实现 CRUD 和本地存储持久化。' },
    p4: { title: 'Express.js REST API', description: '带 CRUD 端点的后端服务器。', goal: '使用 Express 创建书店 API，实现 GET, POST, PUT, DELETE。' },
    p5: { title: 'Chrome 浏览器扩展', description: '屏蔽网站的专注模式扩展。', goal: '构建 Manifest V3 扩展，在专注模式下屏蔽特定社交媒体。' },
    p6: { title: 'Discord/Telegram 机器人', description: '响应命令的简单机器人。', goal: '创建 Python 机器人响应 "!ping"。集成模拟天气 API。' },
    p13: { title: 'Go 微服务 (Gin)', description: 'Go 语言高性能 API。', goal: '使用 Gin 框架创建 REST API，并使用互斥锁确保内存安全。' },
    p14: { title: 'Flutter 电商应用 (Provider)', description: 'Dart 语言复杂的状体管理。', goal: '使用 Provider 管理状态，构建带购物车功能的 Flutter 商店应用。' },
    p15: { title: 'Rust Tauri 应用', description: '带 Rust 后端和 HTML 前端的桌面应用。', goal: '设置 Tauri，让 Rust 后端每秒向前端发送模拟系统数据。' },
    p7: { title: 'Next.js SaaS 模板', description: '认证、数据库和落地页设置。', goal: '构建 Next.js 15 SaaS 基础应用，包含仪表板和模拟认证。' },
    p8: { title: 'RAG 命令行工具', description: '通过嵌入技术与文档对话。', goal: '使用 Python 构建 RAG 工具，实现文档索引和上下文问答。' },
    p16: { title: '性能优化器', description: '分析代码复杂度并提出改进建议。', goal: '担任高级性能工程师。1) 分析随附的 `slow_script.py`。2) 确定现有函数的时间复杂度 (Big O)。3) 将 `process_numbers` 函数重写为使用 Set 进行 O(n) 查找，而不是 O(n^2)。' },
    p17: { title: 'UI/UX 打磨与修复', description: '根据代码和原型改进界面。', goal: 'UI/UX 工程师：使用 Tailwind 完美还原 SVG 原型，确保响应式。' },
    p18: { title: 'Bug 猎人 (调试)', description: '查找并修复逻辑错误。', goal: 'QA 工程师：分析 `legacy_script.js` 并修复 XMLHttpRequest 逻辑。' },
    p19: { title: '安全审计员', description: '识别漏洞 (OWASP) 并进行修复。', goal: '担任网络安全专家。查看 `vulnerable_server.js`。1) 识别 `/users` 端点位中的 SQL 注入漏洞。2) 使用参数化查询重写代码。' },
    p20: { title: '规格合规检查', description: '对照文档验证代码。', goal: '首席架构师：根据 README 和设计文档生成 5 项 CI/CD 检查清单。' },
    p9: { title: '重构老旧代码', description: '现代化杂乱的 JS 文件。', goal: '将 `legacy_script.js` 重构为使用 TypeScript 和 Fetch 的现代代码。' },
    p10: { title: '从 Figma 到 React', description: '根据原型实现 React 组件。', goal: '使用 Tailwind 完全还原 wireframe.svg 中的卡片组件。' }
  },
  [AppLanguage.JA]: {
    p1: { title: '個人ポートフォリオサイト', description: '履歴書を表示するためのシンプルな静的HTML/CSS/JSサイト。', goal: 'レスポンシブな単一ページの個人ポートフォリオサイトを作成します。「自己紹介」セクション、「スキル」グリッド、コンソールにログを記録する「お問い合わせ」フォームを含める必要があります。セマンティックHTML5とモダンCSSを使用してください。' },
    p2: { title: 'Python データクリーナー', description: 'CSVファイルを処理およびクリーニングするためのスクリプト。', goal: 'Pandasを使用して"data.csv"という名前のCSVファイルを読み取るPythonスクリプトを作成します。1) 欠損値のある行を削除し、2) 日付列をISO形式に変換し、3) 結果を"clean_data.json"にエクスポートする必要があります。' },
    p11: { title: 'Streamlit 株価ダッシュボード', description: 'Pythonデータ視覚化アプリ。', goal: 'Streamlitアプリを作成します。シンボル入力、yfinanceデータ取得、チャート表示機能を含めます。' },
    p12: { title: 'Flutter 習慣トラッカー', description: 'Dart & FlutterによるモバイルUI。', goal: 'ListView.builderとチェックボックスを使用して、習慣リスト画面を作成します。' },
    p3: { title: 'React Todo アプリ', description: 'LocalStorageを使用した定番のTodoリスト。', goal: 'ReactでTodoアプリを構築し、CRUD機能とブラウザへの永続化を実装します。' },
    p4: { title: 'Express.js REST API', description: 'CRUDエンドポイントを持つバックエンド。', goal: 'Expressで書店APIを作成。GET, POST, PUT, DELETEを実装します。' },
    p5: { title: 'Chrome 拡張機能', description: 'サイトをブロックする集中モード拡張。', goal: '集中モード時に特定のSNSへのアクセスをブロックするV3拡張機能を作成します。' },
    p6: { title: 'Discord/Telegram ボット', description: 'コマンドに反応するシンプルなボット。', goal: 'Pythonで "!ping" に反応するボットを作成。模擬天気APIを統合します。' },
    p13: { title: 'Go マイクロサービス (Gin)', description: 'Go言語による高性能API。', goal: 'Ginフレームワークを使用してREST APIを作成し、ミューテックスで安全に管理します。' },
    p14: { title: 'Flutter E-Commerce (Provider)', description: 'Dartによる高度な状態管理。', goal: 'Providerを使用して、カート機能付きのショップアプリを構築します。' },
    p15: { title: 'Rust Tauri アプリ', description: 'RustバックエンドとHTMLフロントエンドのデスクトップアプリ。', goal: 'Tauriをセットアップし、Rust側からシステム統計をフロントエンドに送信します。' },
    p7: { title: 'Next.js SaaS ボイラープレート', description: '認証、DB、ランディングページ設定。', goal: 'Next.js 15でSaaSの基礎を構築。ダッシュボードと模擬認証を含めます。' },
    p18: { title: 'バグハンター (デバッグ)', description: '論理エラーを見つけて修正します。', goal: 'QAエンジニアとして `legacy_script.js` を分析し、XMLHttpRequestのバグを修正します。' },
    p8: { title: 'RAG CLI ツール', description: 'Embeddingsを使用してドキュメントとチャット。', goal: 'PythonでRAGツールを構築。ドキュメントをインデックス化し回答を出力します。' },
    p16: { title: 'パフォーマンスオプティマイザー', description: 'コードの複雑さを分析し、改善を提案します。', goal: 'シニアパフォーマンスエンジニアとして行動してください。1) 添付の `slow_script.py` を分析します。2) 既存の機能の時間計算量 (Big O) を特定します。3) `process_numbers` 関数を書き換えて、O(n^2) の代わりに O(n) ルックアップに Set を使用するようにします。' },
    p17: { title: 'UI/UX ブラッシュアップ', description: 'コードとモックアップに基づくUI改善。', goal: 'UI/UXエンジニアとして、SVGワイヤーフレームをTailwindで完璧に再現します。' },
    p19: { title: 'セキュリティ監査人', description: '脆弱性 (OWASP) を特定して修正します。', goal: 'サイバーセキュリティの専門家として行動してください。`vulnerable_server.js` を確認します。1) `/users` エンドポイントのSQLインジェクションの脆弱性を特定します。2) パラメータ化されたクエリを使用してコードを書き換えます。' },
    p20: { title: 'スペック準拠チェック', description: 'ドキュメントに対してコードを検証します。', goal: 'リードアーキテクトとして、READMEと設計書からCI/CD用の5つのチェックリストを生成します。' },
    p9: { title: 'レガシーコードのリファクタリング', description: '古いJSファイルをモダン化。', goal: '`legacy_script.js` をTypeScript、Async/Await、Fetch APIで刷新します。' },
    p10: { title: 'Figma から React', description: 'ワイヤーフレームからReactコンポーネントを実装。', goal: 'wireframe.svg のレイアウトを Tailwind CSS を使用して React で忠実に再現します。' }
  },
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
        model: AiModel.CLAUDE_4_5_SONNET,
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
        model: AiModel.CLAUDE_4_5_SONNET,
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
        model: AiModel.CLAUDE_4_5_SONNET,
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
        model: AiModel.OPENAI_GPT_5_2_PRO,
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
        model: AiModel.CLAUDE_4_5_SONNET,
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
        model: AiModel.CLAUDE_4_5_SONNET,
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
        model: AiModel.DEEPSEEK_R1,
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
        model: AiModel.CLAUDE_4_5_SONNET,
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
        model: AiModel.DEEPSEEK_R1,
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
        model: AiModel.DEEPSEEK_R1,
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
        model: AiModel.CLAUDE_4_5_SONNET,
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
        model: AiModel.OPENAI_GPT_5_2_PRO,
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
        model: AiModel.DEEPSEEK_R1,
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
        model: AiModel.CLAUDE_4_5_SONNET,
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
