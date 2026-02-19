# MongoDB Atlas - Instrukcja Konfiguracji (Polski)

## 📋 Co będziemy robić?
1. Założymy **darmowe** konto MongoDB Atlas
2. Stworzymy bazę danych w chmurze (512MB za darmo)
3. Uzyskamy **connection string** (adres do bazy)
4. Skonfigurujemy aplikację

**Czas: ~10-15 minut**

---

## Krok 1: Załóż konto MongoDB Atlas

### 1.1 Wejdź na stronę
Otwórz przeglądarkę i wejdź na: **https://www.mongodb.com/cloud/atlas/register**

### 1.2 Zarejestruj się
Możesz wybrać:
- **Sign up with Google** (najszybsze)
- **Sign up with GitHub**
- Lub wprowadź email i hasło ręcznie

**Kliknij przycisk rejestracji.**

### 1.3 Wypełnij ankietę (opcjonalnie)
MongoDB może zapytać o:
- "What brings you to MongoDB Atlas?" → Wybierz **"Build a new app"**
- "What is your preferred language?" → Wybierz **"JavaScript"**
- "What type of data will you store?" → Wybierz **"Relational data"**

**Możesz pominąć** klikając "Skip" w prawym górnym rogu.

---

## Krok 2: Stwórz Klaster Bazy Danych

### 2.1 Witaj w MongoDB Atlas!
Po zalogowaniu zobaczysz ekran powitalny.

**Kliknij zielony przycisk:** `+ Create`

(Lub "Build a Database" jeśli widzisz taki przycisk)

### 2.2 Wybierz Plan - **WAŻNE!**
Zobaczysz 3 opcje:

```
┌─────────────────┬─────────────────┬─────────────────┐
│   Serverless    │       M0        │      M10+       │
│   Pay as you go │   FREE FOREVER  │   Paid plans    │
└─────────────────┴─────────────────┴─────────────────┘
```

**✅ WYBIERZ ŚRODKOWĄ OPCJĘ: "M0" (FREE)**

Powinna być napisane:
- **Shared** (Współdzielony)
- **FREE** (Darmowy)
- **512 MB Storage** (Pamięć)

**Kliknij "Create" pod opcją M0**

### 2.3 Wybierz Dostawcę Chmury
Zobaczysz 3 loga:

```
[AWS]  [Google Cloud]  [Azure]
```

**Wybierz AWS** (Amazon Web Services) - zazwyczaj najszybszy

### 2.4 Wybierz Region (Lokalizację)
Lista regionów się rozwinie. Wybierz **najbliższy Tobie**:

Dla Polski najlepsze opcje:
- ✅ **Frankfurt (eu-central-1)** - NAJLEPSZE dla Europy
- ✅ **Ireland (eu-west-1)** - Dobre dla Europy
- ❌ Unikaj regionów USA/Azja - wolniejsze

**Kliknij na region, aby go zaznaczyć.**

### 2.5 Nazwa Klastra (opcjonalnie)
Na dole strony jest pole:
```
Cluster Name: [Cluster0]
```

Możesz zmienić na:
```
Cluster Name: [FightingGameDB]
```

(Lub zostaw "Cluster0" - nie ma znaczenia)

### 2.6 Stwórz Klaster
**Kliknij zielony przycisk na dole:** `Create Cluster`

Zobaczysz komunikat:
```
⏳ Deploying your cluster...
This may take several minutes.
```

**Poczekaj 2-5 minut.** Możesz zostawić kartę otwartą.

---

## Krok 3: Stwórz Użytkownika Bazy Danych

Podczas gdy klaster się tworzy, pojawi się **pop-up z formularzem**.

### 3.1 Sekcja "Security Quickstart"

Zobaczysz:
```
┌────────────────────────────────────────┐
│  How would you like to authenticate?  │
│  ○ Username and Password               │
│  ○ Certificate                         │
└────────────────────────────────────────┘
```

**Wybierz: ● Username and Password** (powinno być domyślnie)

### 3.2 Stwórz Użytkownika

Zobaczysz pola:
```
Username: [          ]
Password: [          ] [Autogenerate Secure Password]
```

#### Opcja A: Auto-generowanie (POLECANE)
1. **Kliknij:** `Autogenerate Secure Password`
2. Pojawi się losowe hasło, np: `xK9mP2qL7nR4vB8w`
3. **⚠️ WAŻNE: SKOPIUJ TO HASŁO!** Zapisz w Notatniku!
4. Kliknij ikonę 📋 aby skopiować

#### Opcja B: Własne hasło
1. Username: `game_admin`
2. Password: `Twoje-Silne-Haslo123!`
3. **⚠️ ZAPAMIĘTAJ TO!** Będzie potrzebne później

### 3.3 Uprawnienia
Pod hasłem zobaczysz:
```
Database User Privileges:
[Built-in Role ▼]
```

**Zostaw domyślne:** `Atlas admin` lub `Read and write to any database`

### 3.4 Potwierdź
**Kliknij:** `Create User` (zielony przycisk)

---

## Krok 4: Dodaj Adres IP (Whitelist)

### 4.1 Następny Krok w Pop-up
Po stworzeniu usera zobaczysz:
```
Where would you like to connect from?
```

### 4.2 Dla Rozwoju (Development)
**Kliknij:** `Add My Current IP Address`

Zobaczysz swój IP, np:
```
IP Address: 89.64.23.156
Description: My Local IP
```

**Kliknij zielony przycisk:** `Add Entry`

### 4.3 **WAŻNE: Dla Produkcji (Render.com)**
Musisz też dodać "pozwól wszystkim":

1. **Kliknij:** `Add a Different IP Address`
2. W polu IP Address wpisz: `0.0.0.0/0`
3. Description: `Render Production`
4. **Kliknij:** `Add Entry`

**Dlaczego 0.0.0.0/0?**
- Render.com używa **dynamicznych IP** (zmiennych)
- Nie możemy dodać konkretnego IP
- Baza jest i tak chroniona hasłem (bezpieczne!)

### 4.4 Zamknij Pop-up
**Kliknij:** `Finish and Close` na dole

Pojawi się:
```
✅ Congratulations on setting up access rules!
```

**Kliknij:** `Go to Databases`

---

## Krok 5: Uzyskaj Connection String

### 5.1 Wróć do Dashboard
Powinieneś zobaczyć swój klaster:

```
┌─────────────────────────────────────┐
│ 🟢 Cluster0                         │
│ M0 Sandbox • Frankfurt              │
│                                     │
│ [Connect] [Metrics] [Collections]  │
└─────────────────────────────────────┘
```

### 5.2 Kliknij "Connect"
**Kliknij biały przycisk:** `Connect`

### 5.3 Wybierz Metodę Połączenia
Zobaczysz 3 opcje:

```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Compass          │ │ Drivers          │ │ VS Code          │
│ (GUI tool)       │ │ (Your app)       │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

**Kliknij:** `Drivers` (środkowy)

### 5.4 Wybierz Driver
Zobaczysz dropdown:
```
Driver:  [Node.js ▼]
Version: [5.5 or later ▼]
```

**Zostaw domyślne wartości** (Node.js, wersja najnowsza)

### 5.5 Skopiuj Connection String
Zobaczysz duże pole tekstowe:

```
mongodb+srv://game_admin:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

**⚠️ TO JEST NAJWAŻNIEJSZE!**

**Kliknij ikonę 📋** aby skopiować.

### 5.6 **ZASTĄP `<password>`**
Ten string ma `<password>` w środku. Musisz:

1. Wklej go do Notatnika
2. Znajdź fragment: `:<password>@`
3. Zamień `<password>` na **TWOJE HASŁO z Kroku 3.2**

**Przed:**
```
mongodb+srv://game_admin:<password>@cluster0.abc123.mongodb.net/
```

**Po (przykład):**
```
mongodb+srv://game_admin:xK9mP2qL7nR4vB8w@cluster0.abc123.mongodb.net/
```

### 5.7 Dodaj Nazwę Bazy Danych
Na końcu stringa, po `.net/` dodaj nazwę bazy:

**Przed:**
```
.mongodb.net/?retryWrites=true
```

**Po:**
```
.mongodb.net/fighting_game?retryWrites=true
```

### 5.8 Finalny Connection String
Twój gotowy string powinien wyglądać tak:

```
mongodb+srv://game_admin:xK9mP2qL7nR4vB8w@cluster0.abc123.mongodb.net/fighting_game?retryWrites=true&w=majority
```

**✅ SKOPIUJ GO DO SCHOWKA!**

---

## Krok 6: Wklej do Pliku `.env`

### 6.1 Otwórz Plik
W VS Code otwórz plik:
```
fighting_game/server/.env
```

### 6.2 Znajdź Linię MONGODB_URI
Zobaczysz:
```
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/database_name
```

### 6.3 Zastąp Całą Wartość
**Usuń** wszystko po `MONGODB_URI=`

**Wklej** swój connection string z Kroku 5.8

**Powinno być:**
```
MONGODB_URI=mongodb+srv://game_admin:xK9mP2qL7nR4vB8w@cluster0.abc123.mongodb.net/fighting_game?retryWrites=true&w=majority
```

### 6.4 Zapisz Plik
**Ctrl + S** (Windows) lub **Cmd + S** (Mac)

---

## Krok 7: Wygeneruj JWT Secret

### 7.1 Otwórz Terminal w VS Code
- **Menu:** Terminal → New Terminal
- Lub skrót: **Ctrl + `** (backtick)

### 7.2 Uruchom Komendę
Wklej i naciśnij Enter:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 7.3 Skopiuj Wynik
Zobaczysz coś takiego:
```
a7f3c9e1b2d4f6a8c1e3b5d7f9a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8
```

**Skopiuj ten ciąg znaków!**

### 7.4 Wklej do `.env`
Otwórz `server/.env` i znajdź:
```
JWT_SECRET=your_super_secret_jwt_key_here_change_this
```

Zastąp na:
```
JWT_SECRET=a7f3c9e1b2d4f6a8c1e3b5d7f9a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8
```

**Zapisz plik!**

---

## Krok 8: Skonfiguruj Gmail (dla Resetowania Hasła)

### 8.1 Włącz 2-Factor Authentication
1. Wejdź na: **https://myaccount.google.com/security**
2. Znajdź "2-Step Verification"
3. Kliknij i włącz (jeśli jeszcze nie masz)

### 8.2 Stwórz App Password
1. Wejdź na: **https://myaccount.google.com/apppasswords**
2. Może zapytać o hasło - wpisz
3. W dropdown "Select app" wybierz: **Mail**
4. W dropdown "Select device" wybierz: **Other**
5. Wpisz nazwę: `Fighting Game`
6. **Kliknij:** `Generate`

### 8.3 Skopiuj Hasło
Zobaczysz **16-znakowe hasło** (np: `abcd efgh ijkl mnop`)

**SKOPIUJ JE!** (usuń spacje, zostaw tylko litery)

### 8.4 Wklej do `.env`
W pliku `server/.env` znajdź:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-game-email@gmail.com
EMAIL_PASS=your_app_password_here
```

Zastąp na:
```
EMAIL_SERVICE=gmail
EMAIL_USER=twoj-email@gmail.com
EMAIL_PASS=abcdefghijklmnop
```

(Bez spacji w haśle!)

**Zapisz plik!**

---

## Krok 9: Testowanie Połączenia

### 9.1 Uruchom Serwer
W Terminalu wpisz:
```bash
node server.js
```

### 9.2 Sprawdź Logi
Powinieneś zobaczyć:
```
✅ Connected to MongoDB
🚀 Server running on port 3000
📊 API: http://localhost:3000/api/health
```

**✅ Jeśli widzisz "Connected to MongoDB" - DZIAŁA!**

### 9.3 Test w Przeglądarce
Otwórz: **http://localhost:3000/api/health**

Powinieneś zobaczyć:
```json
{
  "status": "ok",
  "mongodb": "connected",
  "timestamp": "2026-02-10T00:00:00.000Z"
}
```

---

## 🔧 Częste Problemy

### ❌ "MongoServerError: bad auth"
**Problem:** Złe hasło w connection string

**Rozwiązanie:**
1. Sprawdź czy zastąpiłeś `<password>` w connection string
2. Upewnij się że hasło jest dokładnie takie jak w MongoDB Atlas
3. Jeśli hasło ma znaki specjalne (!, @, #), może trzeba je zakodować:
   - `!` → `%21`
   - `@` → `%40`
   - `#` → `%23`

### ❌ "MongoNetworkError: connection timeout"
**Problem:** IP nie jest whitelistowane

**Rozwiązanie:**
1. Wejdź na MongoDB Atlas
2. Lewa strona → **Network Access**
3. Sprawdź czy jest `0.0.0.0/0` lub Twoje IP
4. Jeśli nie ma - dodaj (Krok 4.3)

### ❌ "Cannot find module 'mongoose'"
**Problem:** Nie zainstalowane dependencies

**Rozwiązanie:**
```bash
npm install mongoose bcrypt jsonwebtoken nodemailer dotenv cors express-rate-limit
```

### ❌ MongoDB się nie łączy, ale wszystko wygląda dobrze
**Rozwiązanie:**
1. Sprawdź czy klaster jest **włączony** (🟢 zielona kropka)
2. Poczekaj 2-3 minuty - czasem potrzeba czasu
3. Zrestartuj serwer (`Ctrl+C`, potem `node server.js`)

---

## ✅ Gotowe!

Jeśli widzisz:
```
✅ Connected to MongoDB
```

MongoDB jest skonfigurowane i gotowe do użycia! 🎉

**Następne kroki:**
1. Przetestuj rejestrację użytkownika
2. Sprawdź czy dane się zapisują
3. Deploy na Render.com

