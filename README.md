# Natale semplice · Astro 5 + Firebase 🎄

Design pulito ma più natalizio: neve che cade, piccole icone (albero, Babbo Natale, renne) e tre pagine:

- **Home**: introduzione con immagini natalizie e link
- **/calendario**: Calendario dell'Avvento con caselle luminose
- **/lettera**: lettera in stile cartolina di Natale, con login Google e salvataggio su Firebase

Stack:
- Astro `^5.16.4`
- Firebase (Firestore + Authentication Google)

## 1. Collezioni Firestore

Questo progetto utilizza due collezioni:

- `letters` → contiene le lettere a Babbo Natale degli utenti autenticati
- `adventStates` → contiene lo stato del calendario dell'Avvento per ogni utente (giorni aperti)

Regole minime di esempio (adatta alle tue esigenze):

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /letters/{document} {
      allow create: if request.auth != null;
    }
    match /adventStates/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 2. Configurazione `.env`

Copia `.env.example` in `.env` e inserisci le chiavi reali del tuo progetto Firebase:

```bash
PUBLIC_FIREBASE_API_KEY="..."
PUBLIC_FIREBASE_AUTH_DOMAIN="..."
PUBLIC_FIREBASE_PROJECT_ID="..."
PUBLIC_FIREBASE_STORAGE_BUCKET="..."
PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
PUBLIC_FIREBASE_APP_ID="..."
```

## 3. Installazione & avvio

```bash
npm install
npm run dev
```

La home sarà su `http://localhost:4321/`.

## 4. File principali

- `src/components/Layout.astro` → layout condiviso con neve animata
- `src/pages/index.astro` → home
- `src/pages/calendario.astro` → calendario con sincronizzazione locale + Firestore
- `src/pages/lettera.astro` → lettera con autenticazione e salvataggio
- `src/firebaseClient.ts` → inizializzazione Firebase e helper (lettere + calendario)
