Ecco un tutorial dettagliato per implementare il sistema "Ralph", un framework agentico per lo sviluppo autonomo utilizzando l'intelligenza artificiale (Claude).

---

# Guida all'Implementazione del Sistema "Ralph" per lo Sviluppo di MVP con AI

Questo documento descrive un approccio metodologico per far sì che un'intelligenza artificiale scriva un'intera applicazione in autonomia, scomponendo problemi complessi in piccoli task sequenziali eseguiti in un ambiente sicuro.

## 1. Fase di Pre-Planning e Architettura (Manuale)
L'AI eccelle nell'esecuzione, ma la direzione architettonica deve rimanere umana per evitare "codice spazzatura" o decisioni strutturali errate.
*   **Definizione del Big Plan:** Redigere un documento macroscopico che descriva tutte le funzionalità, le pagine e i flussi utente (es. gestione scuole, app per famiglie, integrazioni AI).
*   **Setup Ambiente Base:** Preparare un repository (es. NextJS) con le configurazioni critiche già impostate, come l'autenticazione (es. Clerk).
*   **Schema del Database:** Progettare e definire lo schema dei dati manualmente. È sconsigliato far decidere all'AI la struttura del database per mantenere il controllo totale sulla logica di business.

## 2. Scomposizione in Task (Prompt Engineering)
Il segreto per non saturare la finestra di contesto (context window) dell'AI è trasformare il "Big Plan" in una lista di task atomici.
*   **Generazione dei PRD (Product Requirement Documents):** Utilizzare prompt specifici per istruire l'AI a dividere il piano in micro-implementazioni che non siano troppo grandi.
*   **Strutturazione JSON:** Trasformare i task in un file `prd.json` (che contiene un oggetto con un array `items`). Ogni oggetto nell'array deve contenere:
    *   Descrizione del task.
    *   Criteri di accettazione (cosa ci si aspetta che venga generato).
    *   Stato (es. `completed: false`).
    *   Priorità e riferimenti alle tabelle del database.

## 3. Lo Script di Esecuzione (Il "Ciclo Ralph")
Il sistema "Ralph" è uno script che automatizza il processo di sviluppo iterativo.
*   **Logica del Loop:** Lo script deve:
    1.  Leggere il file `prd.json`.
    2.  Selezionare il primo task non completato.
    3.  Lanciare un nuovo agente AI (es. Claude Code) dedicato esclusivamente a quel task.
    4.  Fornire all'agente il contesto necessario (file esistenti, storico dei task fatti, task attuale).
*   **Persistence e State:** Una volta completato il task, l'agente deve:
    *   Scrivere il codice.
    *   Effettuare un **commit Git** automatico (per permettere all'agente successivo di vedere lo storico delle modifiche).
    *   Aggiornare lo stato del task nel JSON (`passes: true`).
    
    ### 3.1 Il System Prompt (Regole Core)
    L'agente deve seguire rigorosamente queste 4 regole, da iniettare nel System Prompt:
    1.  **Tabula Rasa (Contesto Fresco):** Leggi TUTTI i file prima di ogni task.
    2.  **Cambiamenti Atomici:** Fai commit piccoli e verificabili.
    3.  **Verifica Composta:** Testa approfonditamente ogni modifica.
    4.  **Verifica Manuale:** Attendi approvazione umana prima di procedere.

## 4. Sicurezza: Docker Sandbox
Far girare un agente AI che scrive ed esegue codice sul proprio computer è rischioso. È fondamentale isolare l'ambiente.
*   **Implementazione:** Utilizzare la funzionalità **Docker Sandbox** per agenti AI.
*   **Isolamento File System:** Montare solo la cartella del progetto all'interno del container Docker. In questo modo, l'agente ha accesso solo ai file del progetto e non può danneggiare il resto del sistema operativo (es. cancellare file nel desktop).
*   **Comando Esempio:** Eseguire l'agente tramite `docker sandbox run [nome-agente]`, garantendo che l'AI "veda" solo ciò che è pertinente al codice.

## 5. Revisione e Refactoring (Umano + AI)
L'output dell'AI non sarà perfetto e richiederà un intervento finale.
*   **Fix degli Errori:** Al termine del ciclo (es. dopo 41 task completati), è normale riscontrare errori (es. errori 500 o bug grafici).
*   **Intervento "Brutale":** Risolvere gli errori critici manualmente o fornendo i log d'errore all'AI in una sessione di debug rapida.
*   **Validazione Funzionale:** Testare le funzionalità chiave (es. messaggistica, inserimento dati, login) per assicurarsi che il prototipo sia coerente.

## Considerazioni su Costi e Risorse
*   **Consumo Token:** Un esperimento completo per un MVP complesso può consumare circa l'80% dei token mensili di un piano Claude Code da 100€.
*   **Qualità del Codice:** Sebbene il codice sia funzionale, potrebbe contenere "spazzatura" o non seguire perfettamente le best practice personali dello sviluppatore. È ideale per prototipazione rapida, meno per applicazioni enterprise definitive senza una profonda code review.

---
*Nota: Queste informazioni sono tratte dai test e dalle osservazioni documentate nelle fonti fornite.*