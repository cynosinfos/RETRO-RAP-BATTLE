# PRZEBIEG PRAC (26.01.2026)

## 1. Estetyka Arcade i UI
- **Efekt TILT (TrzÄ™sienie ekranu)**: WdroÅ¼ono efekt wstrzÄ…sÃ³w przy udeÅ¼eniach. Zmniejszono intensywnoÅ›Ä‡ o 50% (z 5px na 2px) dla lepszej czytelnoÅ›ci.
- **Logo Gry**: Podmieniono `logo.png` na `logo2.png`. Zmniejszono je do 80px i umieszczono centralnie nad licznikiem czasu.
- **Paski Å»ycia**: Poprawiono wyglÄ…d ramek â€“ teraz sÄ… peÅ‚nymi, domkniÄ™tymi prostokÄ…tami `border: 4px solid white`.
- **UsuniÄ™cie CRT**: Na Å¼yczenie usuniÄ™to efekt skanlinii (paskÃ³w) z ekranu dla czystszego obrazu.

## 2. Mechanika "Super Ciosu" (Ultimate)
- **Logika Energii**:
    - Dodano system Energii (Staminy).
    - Start: 20/100 pkt.
    - Regeneracja: +5 pkt na sekundÄ™.
    - Max: 100 pkt (wtedy pasek zmienia kolor z pomaraÅ„czowego na czerwony).
- **UI PaskÃ³w Energii**: DodaÅ‚em nowe paski pod paskami zdrowia.
- **Aktywacja**: PodwÃ³jne, szybkie naciÅ›niÄ™cie klawisza ataku (2x Spacja / 2x Enter) w odstÄ™pie <300ms.
- **Efekt**:
    - Zadaje 50 obraÅ¼eÅ„ (zamiast standardowych 10/15).
    - Powoduje bÅ‚ysk ekranu (`screen-flash`).
    - Odtwarza nowy dÅºwiÄ™k `power.mp3`.

## 3. Audio
- Zarejestrowano nowy dÅºwiÄ™k `power.mp3`.
- PodpiÄ™to go pod Super Attack.
- Poprawiono `AudioManager.js` oraz `Fighter.js` do obsÅ‚ugi nowego audio.

## 4. Poprawki Techniczne
- Naprawiono krytyczny bÅ‚Ä…d skÅ‚adniowy w `main.js` ("Cannot redeclare block-scoped variable") poprzez dodanie blokÃ³w `{}` w instrukcjach `case`.
- Zaktualizowano wersjÄ™ plikÃ³w (`v=30`), aby wymusiÄ‡ odÅ›wieÅ¼enie w przeglÄ…darce.

---
Gotowe do kontynuacji jutro!

## 5. Nowe Postacie i Zespó³ GOSCIE (26.01.2026 - Runda 2)
- **Dodano 13 nowych postaci** do dru¿yny GOSCIE:
    - NOON, FU, LIROY, KORAS, JURAS, JEDKER, INTRUZ, ERKING, SOULPETE, FROSTI, KAZIK, GIBBS, KALI.
- **Grafiki**: Utworzono placeholdery ('_500.png') kopiuj¹c szablon.
- **Konfiguracja**: Dodano wpisy do 'roster.js' oraz zaktualizowano listê w 'main.js'.
- **Poprawki Skalowania**:
    - **WLODI**: Zmniejszono skalê do 0.5 (by³ zbut du¿y).
    - **PYSKATY i ABRADAB**: Naprawiono b³¹d z 'lewitowaniem' u góry ekranu (poprawa konfiguracji 'rows' i 'frameHeight').
    - **Animacje**: Podmieniono pliki graficzne Pyskatego i Abradaba na poprawny szablon 4-rzêdowy, aby naprawiæ animacje ruchu.

## 6. Funkcje Arcade (26.01.2026 - Runda 3)
- **Combo Counter**:
    - Dodano licznik uderzeñ (np. '3 HITS!') w stylu pixel-art.
    - Kolory: ¯ó³ty (P1) i Cyjan (P2).
    - Resetuje siê po 1.5 sekundy braku aktywnoœci.
- **Zoom Kamery na Zwyciêzcê**:
    - Kamera p³ynnie przybli¿a siê (zoom 2.0x) i centruje na zwyciêzcy po zakoñczeniu walki.
    - **Audio**: Podpiêto dŸwiêk 'close.mp3' odtwarzany w momencie startu zooma.
- **Polonizacja i UI**:
    - Zmieniono 'GAME OVER' na **'KONIEC GRY'**.
    - Zmieniono 'PLAYER X WINS' na **'WYGRA£ GRACZ X'** (du¿a, ¿ó³to-czerwona czcionka).
- **Wersjonowanie**: Podbito wersjê plików (v=32) dla wymuszenia odœwie¿enia cache.


## 7. Nowe Efekty Wizualne - WERSJA 36 (29.01.2026)

### Particle Effects (Efekt #1)
- **Rozszerzono system cz¹steczek**:
  - Dodano nowe typy: energy (dla super ataków) i impact (dla zwyk³ych uderzeñ)
  - **Zwyk³e uderzenia**: 6x blood + 8x impact particles
  - **Super ataki**: 10x blood + 12x energy particles (z³ote dla P1, cyjan dla P2)
  - Ka¿dy typ ma w³asn¹ fizykê (grawitacja, friction, fade rate)

### Dynamic Lighting (Efekt #4)
- **Glow przy pe³nej energii**:
  - Dodano klasê CSS .fighter-glow z pulsuj¹c¹ aur¹
  - Z³ota poœwiata wokó³ postaci przy 100% energii
  - Animacja glowPulse z drop-shadow i brightness

### Screen Shake Variations (Efekt #7)
- **Trzy poziomy intensywnoœci**:
  - shake-light (2px, 300ms) - lekkie uderzenia
  - shake-medium (3px, 400ms) - zwyk³e ataki
  - shake-heavy (5px, 500ms) - super ataki
- Zast¹piono stary system shake-effect nowym z ró¿nymi poziomami

### K.O. Red Overlay (Bonus)
- **Czerwone przyciemnienie przy nokaucie**:
  - Radial gradient (czerwony › ciemnoczerwony)
  - Animacja koFade (1.5s)
  - Pojawia siê tylko przy K.O., nie przy Time Up
  - z-index: 15000

### Screen Crack Effect (Bonus - Super Attack)
- **Efekt pêkaj¹cego ekranu**:
  - 5 nak³adaj¹cych siê linear-gradients (ró¿ne k¹ty)
  - Animacja crackAppear ze scale transform
  - Pojawia siê przy ka¿dym super ciosie
  - Czas trwania: 300ms
  - z-index: 19000

### Integracja
- Wszystkie efekty dodane do window.arcadeEffects
- Podpiête w main.js przy collision detection
- Automatyczne wywo³anie przy odpowiednich akcjach
- **Wersja plików**: Podbito do v=36

---
**Status**: ? Gotowe do testowania!

## 8. Poprawki Efektów (29.01.2026 - Runda 2)
### Fix: Particles Rendering
- **Problem**: Cz¹steczki energii (typu 'energy') nie renderowa³y koloru, tylko domyœlny obrazek spark.png.
- **Rozwi¹zanie**: Zmodyfikowano Particle.js > draw(). Teraz dla typu 'energy' rysowany jest wype³niony prostok¹t (illRect) z w³aœciwym kolorem i shadowBlur dla efektu neonu.

### Fix: Fighter Glow
- **Problem**: Klasa CSS .fighter-glow nie dzia³a³a na obiekty w Canvas.
- **Rozwi¹zanie**: Dodano logikê do Fighter.js > draw(). Gdy energy >= 100, w³¹czany jest ctx.shadowBlur = 20 i ctx.shadowColor = 'gold' przed rysowaniem postaci.

### Fix: Screen Crack Visibility
- **Poprawa**: Zwiêkszono kontrast i gruboœæ linii (szersze przerwy w gradiencie) w style.css dla .screen-crack, aby efekt by³ lepiej widoczny na ciemnym tle.

**Wersja plików**: Podbito do v=37 (wymuszenie cache refresh).

## 8b. Poprawki Efektów VOL 2 (29.01.2026 - Runda 3)
- **Cz¹steczki (Particles)**:
  - Upewniono siê, ¿e cz¹steczki typu 'energy' s¹ rysowane jako illRect (kolorowe kwadraty) a nie obrazki, co naprawia ich niewidocznoœæ.
  - Sprawdzono logikê spawnowania w main.js.
- **Rage Mode Glow**:
  - Zmieniono warunek poœwiaty: teraz aktywuje siê przy **HP < 31**, a nie przy pe³nej energii.
  - Zmieniono kolor na **czerwony**, zgodnie z ¿yczeniem.
- **Screen Crack (Pêkniêcie Ekranu)**:
  - Zmieniono position: fixed na position: absolute w CSS.
  - Zmieniono kontener docelowy z ody na #game-container. To zapewnia poprawne skalowanie efektu wraz z oknem gry.
- **Wersja plików**: v38.

## 8c. Mobile UX Update (29.01.2026 - Runda 4)
- **Auto-Map Selection (PVP)**: 
  - Dodano automatyczne wywo³anie goToMapSelection() po potwierdzeniu wyboru postaci przez Gracza 2 w trybie PVP.
  - Wczeœniej: Po wyborze P2 gra czeka³a na dodatkowe wciœniêcie klawisza 'Enter' lub przycisku 'Start' (co by³o niejasne na mobile).
  - Teraz: Gra przechodzi do wyboru mapy po 300ms od wybrania P2, tak samo jak w trybie PVE.

## 11. Implementacja Trybu Online (29.01.2026 - Runda 7)
- **Cel**: Podstawowy Multiplayer przez WebSocket.
- **Backend (Node.js)**:
  - Utworzono katalog server z package.json i index.js.
  - Serwer obs³uguje tworzenie pokoi (createRoom), do³¹czanie (joinRoom) i przesy³anie klawiszy (playerInput).
- **Frontend**:
  - Dodano socket.io-client do index.html.
  - Utworzono NetworkManager.js do zarz¹dzania stanem sieci.
  - Zaktualizowano main.js:
    - Dodano obs³ugê nowego ekranu Lobby Online w Menu.
    - Dodano logikê startOnlineGame.
    - Zaimplementowano przechwytywanie i wysy³anie zdarzeñ klawiatury w trybie ONLINE.
- **Status**: Gotowe do testów lokalnych (wymaga uruchomienia 
ode server/index.js).
