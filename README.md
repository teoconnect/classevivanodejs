# Classeviva to iCal Server

Questo progetto è un semplice server Node.js che espone un feed iCalendar (`.ics`) sincronizzato con l'agenda del registro elettronico Classeviva/Spaggiari. Questo permette di aggiungere facilmente l'orario scolastico e l'agenda dei compiti/eventi direttamente su Google Calendar o Apple Calendar.

## Requisiti

- Node.js (versione >= 16 raccomandata)
- npm

## Installazione

1. Clona o scarica questo repository.
2. Installa le dipendenze eseguendo:

   ```bash
   npm install
   ```

3. Crea un file `.env` basato sull'esempio:

   ```bash
   cp .env.example .env
   ```

4. Modifica il file `.env` inserendo le tue credenziali di Classeviva:

   ```
   CV_USERNAME=il_tuo_username
   CV_PASSWORD=la_tua_password
   PORT=3000
   ```

   _Nota: il file `.env` è ignorato da Git per evitare di pubblicare le tue password._

## Avvio del Server

Per avviare il server, esegui:

```bash
npm start
```

Il server sarà accessibile su `http://localhost:3000` (o sulla porta che hai specificato). L'endpoint del calendario è `http://localhost:3000/agenda.ics`.

## Sincronizzazione con Google Calendar

1. Se hai intenzione di sincronizzarlo con Google Calendar, dovrai prima esporre questo server su internet (ad esempio, hostandolo su un servizio come Render, Heroku, VPS o usando ngrok se vuoi solo provarlo temporaneamente).
2. Apri Google Calendar dal browser.
3. Sulla barra laterale sinistra, accanto ad "Altri calendari", clicca sul tasto `+` e seleziona **Da URL**.
4. Inserisci l'indirizzo pubblico del tuo server seguito da `/agenda.ics` (es. `https://tuo-dominio.com/agenda.ics`).
5. Clicca su **Aggiungi calendario**.

Google Calendar aggiornerà automaticamente gli eventi prelevandoli dall'agenda di Classeviva!
