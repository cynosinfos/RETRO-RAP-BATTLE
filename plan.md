# PLAN GRY - RETRO RAP BATTLE
Data utworzenia: 2026-02-09

## STRUKTURA PUNKTÓW GRY

### PUNKT 0 - INTRO (Punkt Startowy)
- Menu główne
- Ekran powitalny
- **MUZYKA: BRAK** - zawsze cisza w menu głównym

### PUNKT 1 - PO KLIKNIĘCIU "WRZUĆ MONETĘ"
- System otwierania paczek (pack opening)
- **MUZYKA: TAK** - muzyka walki podczas rozgrywki

### PUNKT 2 - PO REJESTRACJI I LOGINIE (RPG)
- System profili graczy
- Zarządzanie kartami
- Menu boczne z wybraną kartą

---

## ZADANIA DO WYKONANIA

### 1. SYSTEM REJESTRACJI I LOGOWANIA

#### Problemy do naprawienia:
- **PRIORYTET WYSOKI**: Obecnie z każdej przeglądarki można się zalogować na to samo konto
  - Prawdopodobnie problem z localStorage (działa tylko lokalnie)
  - Trzeba wdrożyć backend lub odpowiednią synchronizację

#### Walidacja loginu:
- Login NIE MOŻE być taki sam jak nazwy postaci z gry
- Login NIE MOŻE zawierać wyzwisk:
  - Język polski (lista słów do zablokowania)
  - Język angielski (lista słów do zablokowania)
- Login musi być unikalny w systemie

#### Bezpieczeństwo:
- Hasło: minimalne wymagania (długość, znaki specjalne?)
- Szyfrowanie hasła przed zapisem
- Sesje użytkownika

---

### 2. TRYBY GRY (PUNKT 1)

#### Do usunięcia:
- ❌ Tryb 4vs4

#### Do zrobienia:
- ✅ Pełna logika dla trybu 2vs2
  - Side selection
  - 4 graczy (2 na każdej stronie)
  - Synchronizacja online dla 4 graczy
  - Odpowiednia kolejność ataków

---

### 3. ANIMACJE POSTACI

#### Zmiana formatu:
- **Obecnie**: różne konfiguracje (4 rzędy, różna liczba klatek)
- **Docelowo**: **8x8 klatek** (8 rzędów, 8 klatek na rząd)
  - Było już robione przy innym projekcie
  - Ujednolicić wszystkie sprity do tego formatu
  - Zaktualizować CardGenerator.js i Sprite.js

---

### 4. SYSTEM RPG (PUNKT 2) - NAJWAŻNIEJSZY

#### Profil gracza:
- **Profil permanentny**: zapisany na zawsze
- Logowanie przez login + hasło z rejestracji
- Każdy gracz ma swój unikalny profil

#### Interface po zalogowaniu:

```
┌─────────────────────────────────────┐
│  [AKTUALNA KARTA Z TALII]           │
│  [AVATAR POSTACI]                    │
├─────────────────────────────────────┤
│                                      │
│  MENU Z LEWEJ STRONY:                │
│  - Moja Talia                        │
│  - Kolekcja Kart                     │
│  - Sklep/Paczki                      │
│  - Statystyki                        │
│  - Ustawienia                        │
│                                      │
└─────────────────────────────────────┘
```

#### Funkcjonalność:
- Wyświetlanie aktualnie wybranej karty do walki
- Wyświetlanie awatara postaci
- Menu nawigacyjne z lewej strony
- Zarządzanie talią kart
- System kolekcjonowania kart

---

## UWAGI TECHNICZNE

### Bieżące problemy:
1. ❌ Muzyka nie grała w punkcie 1 (NAPRAWIONE)
2. ❌ Muzyka grała w punkcie 0 (NAPRAWIONE)
3. ⚠️ Rejestracja działa tylko lokalnie (localStorage)
4. ⚠️ Brak walidacji loginu
5. ⚠️ Brak systemu profili permanentnych

### Zmiany do wdrożenia:
1. Backend dla rejestracji (Node.js + baza danych?)
2. System sesji użytkownika
3. Walidacja i filtrowanie loginów
4. Ujednolicenie animacji do 8x8
5. Usunięcie trybu 4vs4
6. Dokończenie logiki 2vs2
7. Stworzenie interfejsu RPG po zalogowaniu

---

## HARMONOGRAM

### Jutro (następna sesja):
- Kontynuacja implementacji systemu RPG
- Szczegóły interfejsu po zalogowaniu
- Dalsze funkcjonalności profilu gracza

---

## NOTATKI
- Użytkownik płaci za subskrypcję - priorytet: jakość i dokładność
- Nie powtarzać błędów z poprzednich iteracji
- Każda zmiana musi być dokładnie przemyślana i przetestowana
