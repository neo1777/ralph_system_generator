---
description: Come eseguire e testare l'applicazione Ralph System Generator
---

1. **Assicurati di avere Node.js installato** (versione 18 o superiore). Puoi verificare con `node -v`.
2. **Installa le dipendenze** del progetto (se presenti) eseguendo:
   ```bash
   npm install
   ```
   Se il progetto non utilizza npm, salta questo passo.
3. **Avvia un server locale** per servire i file statici. Puoi usare Python o serve:
   - Con Python (già incluso nella maggior parte dei sistemi Linux):
     ```bash
     python3 -m http.server 8000
     ```
   - Con `serve` (se preferisci, installa prima con `npm i -g serve`):
     ```bash
     serve -s .
     ```
4. **Apri il browser** all'indirizzo `http://localhost:8000` (o la porta indicata dal comando precedente).
5. **Verifica il funzionamento** dell'applicazione interagendo con l'interfaccia.
6. (Opzionale) **Esegui i test** se il progetto include test automatizzati, ad esempio:
   ```bash
   npm test
   ```
   oppure con altri framework di testing.

> **Nota:** Se il progetto utilizza un framework come Vite, Next.js o simili, sostituisci i comandi `npm install` e `npm run dev` con quelli specifici del framework.
