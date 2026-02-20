// Main Game Logic - v1.6 Online Input Fix (No Shift)
// FROZEN: POINT 1 - START
// Global Interaction Listener for Audio Autoplay
window.addEventListener('click', () => {
    if (window.audioManager) {
        window.audioManager.resumeAudio();
    }
}, { once: true });

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.4 // Reduced from 0.55 for slower gameplay

// FIXED TIME STEP VARIABLES
const MS_PER_UPDATE = 1000 / 60
let lag = 0
let lastTime = 0
let lastMenuInputTime = 0 // For slowing down menu navigation
// Ensure initial time is set correctly on first frame

// Initialize Audio (Robust check)
// Initialize Audio
var audioManager
try {
    audioManager = new AudioManager()
    if (typeof window.tracks !== 'undefined') {
        audioManager.initRadio(window.tracks)
        // Auto-play Radio Podziemie
        setTimeout(() => {
            if (window.playRadio) window.playRadio();
        }, 1000);
    }
} catch (e) {
    console.warn("Audio Manager failed to init", e)
    // Fallback dummy object
    audioManager = { playHit: () => { }, playAttack: () => { } }
}

window.playRadio = function () {
    if (audioManager && audioManager.playRadio) {
        audioManager.playRadio()
        const status = document.getElementById('radioStatus')
        if (status) {
            status.innerText = "RADIO PODZIEMIE: ON"
            status.style.display = 'block'
        }
        updateTickerContent()
    }
}

window.stopRadio = function () {
    if (audioManager && audioManager.stopRadio) {
        audioManager.stopRadio()
        const status = document.getElementById('radioStatus')
        if (status) {
            status.innerText = "RADIO PODZIEMIE: STOP"
            status.style.display = 'block'
        }
        updateTickerContent()
    }
}

window.nextTrack = function () {
    if (audioManager && audioManager.playNextRadioTrack) {
        audioManager.playNextRadioTrack()
        updateTickerContent()
    }
}

// debugMode removed

// Roster Configuration
const roster = {
    team2115: [
        'BEDOES 2115', 'BLACHA 2115', 'FLEXXY 2115', 'KUBI PRODUCENT', 'KUQE 2115', 'WHITE 2115'
    ].sort((a, b) => a.localeCompare(b)),
    team2020: [
        'ASTEK', 'ATUTOWY', 'BAMBI', 'CATCHUP', 'DJ CHWIAL', 'DZIARMA',
        'JEDYNAK', 'LAJZOL', 'LITTLE', 'LIVKA', 'MIELZKY', 'OKI',
        'OSKAR', 'Otsochodzi', 'PERS', 'RADO RADOSNY', 'STEEZ', 'TACO',
        'YOUNG LEOSIA'
    ].sort((a, b) => a.localeCompare(b)),
    teamGoscie: [
        '600V', 'ABRADAB', 'ADI NOWAK', 'ARAB', 'AVI', 'BELMONDO', 'BIAK', 'BIALAS', 'BILON', 'BISZ', 'BOBER',
        'BONSON', 'BONUS RPK', 'BORIXON', 'BOSSKI ROMAN', 'CHIVAS', 'CIELOG', 'DJ DECKS', 'DJ IKE', 'DIZKRET',
        'ELDO', 'ERIPE', 'ERO', 'FAGATA', 'FISZ', 'FOKUS', 'GREEN', 'GSP', 'GURAL', 'GUZIOR',
        'KACZOR', 'KARA', 'KAZ', 'KEKE', 'KIZO', 'KRZY KRZYSZTOF',
        'KUBAN', 'KUBANCZYK', 'KUKON', 'LAIKIKE1', 'LANEK', 'LECH ROCH PAWLAK', 'LJ KARWEL',
        'LONA', 'LOUIS V', 'MAGIERA', 'MALIK', 'MALPA', 'MATA', 'MEZO', 'MIUOSH', 'OSTR',
        'PALUCH', 'PAWBEATS', 'PEJA', 'PELSON', 'PEZET', 'PIH', 'PLANET ANM', 'POPEK',
        'PYSKATY', 'QUEBONAFIDE', 'RAHIM', 'RAS', 'RETO', 'SARIUS', 'SCHAFTER', 'SENTINO',
        'SITEK', 'SLON', 'SMARKI SMARK', 'SMOLASTY', 'SOBEL', 'SOKOL', 'SOLAR',
        'SZPAKU', 'TEDE', 'TEN TYP MES', 'TE-TRIS', 'VBS', 'VIENIO', 'VKIE', 'VNM',
        'WENA', 'WILKU', 'WINI', 'WLODI', 'YOUNG IGI', 'YOUNG MULTI',
        'ZABSON', 'ZYTO', 'FILIPEK', 'NOON', 'FU', 'LIROY', 'KORAS', 'JURAS',
        'JEDKER', 'INTRUZ', 'ERKING', 'SOULPETE', 'FROSTI', 'GIBBS', 'KALI',
        'BARDAL', 'OKON', 'GOSPEL', 'ADMA', 'INDEB', 'JAN-RAPOWANIE', 'OG OLGIERD', 'SHHIEDA', 'WACO', 'AJRON',
        'DJ EPROM', 'DJ TAEK', 'DJ BISKUP', 'OPAL', 'KAFAR DIXON37',
        'GEDZ', 'MROZU', 'MILY ATZ', 'FUKAJ', '2STY', 'JANUSZ WALCZUK', 'DJ MOYES', 'HANS 52DEBIEC', 'EIS', 'KABE', 'MALOLAT', 'JONATAN', 'FORXST', 'FRANCIS', 'ENZU', 'FAVST', 'VAE VISTIC', 'JURAS MMA', 'STASIAK', 'WAIMA'
    ].sort((a, b) => a.localeCompare(b)),
    teamOceniacze: [
        'DAWID SZYNOL', 'FLINT', 'HORRYPAZ', 'HYPE', 'JACEK ADAMKIEWICZ', 'LIL KONON', 'MATEUSZ NATALI', 'MATT', 'MUZYKA TV', 'NOVACCI', 'PAT KUSTOMS', 'SKOPZZOR', 'WARGA', 'WUWUNIO', 'YURKOSKY', 'BARTEK BIEGUN'
    ].sort((a, b) => a.localeCompare(b))
}

// Flattened roster for easier navigation
const allCharacters = [
    ...roster.team2115,
    ...roster.team2020,
    ...roster.teamGoscie,
    ...roster.teamOceniacze
]

// Global Game Objects
var player
var enemy
var projectiles = []

// Safe Audio Helper (backwards compatibility with old AudioManager)
function safeAudio(method, ...args) {
    if (typeof audioManager !== 'undefined' && typeof audioManager[method] === 'function') {
        audioManager[method](...args)
    }
}

// Global Error Handler
window.onerror = function (msg, url, lineNo, columnNo, error) {
    const string = msg.toLowerCase();
    const substring = "script error";
    if (string.indexOf(substring) > -1) {
        alert('Script Error: See Browser Console for Detail');
    } else {
        const message = [
            'Message: ' + msg,
            'URL: ' + url,
            'Line: ' + lineNo,
            'Column: ' + columnNo,
            'Error object: ' + JSON.stringify(error)
        ].join(' - ');

        // Create visible error overlay
        const errDiv = document.createElement('div');
        errDiv.style.position = 'fixed';
        errDiv.style.top = '0';
        errDiv.style.left = '0';
        errDiv.style.width = '100%';
        errDiv.style.height = '100%';
        errDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
        errDiv.style.color = 'red';
        errDiv.style.zIndex = '9999';
        errDiv.style.padding = '50px';
        errDiv.style.fontSize = '24px';
        errDiv.innerText = "GAME ERROR:\n" + message;
        document.body.appendChild(errDiv);

        console.error(message);
    }
    return false;
};

// Menu State
// Menu State
var player1Selection = null
var player2Selection = null
var mapSelection = null
var gameStarted = false
let mapSelectionActive = false
// Main Menu State
var mainMenuIndex = 0
var mainMenuActive = false
var controlsActive = false
var optionsActive = false
var remappingState = null
var gameMode = 'PVP' // PVP, PVE, ONLINE, 2V2_CHAOS, 4V4_TAG
var p1SubIndex = null
var p2SubIndex = null
var p1SubConfirmed = false
var p2SubConfirmed = false

// Controls Mapping (Saved to LocalStorage)
window.config = {
    volume: 1.0,
    p1: { up: 'w', left: 'a', down: 's', right: 'd', punch: ' ', kick: 'c', super: 'i', special: 'o', taunt: 'u' },
    p2: { up: 'arrowup', left: 'arrowleft', down: 'arrowdown', right: 'arrowright', punch: 'enter', kick: 'shift', super: 'numpad_2', special: 'numpad_1', taunt: 'numpad_3' }
}

try {
    const saved = localStorage.getItem('fg_config_v2')
    if (saved) {
        const parsed = JSON.parse(saved)
        window.config = { ...window.config, ...parsed }
    }
} catch (e) { console.error("Config load error", e) }

// Round State
// Round State
window.p1Wins = 0
window.p2Wins = 0
window.currentRound = 1
window.inputLocked = false
window.escPressedOnce = false
window.escTimer = null
window.isRoundActive = false


// Maps Configuration
const maps = [
    { name: 'Club 2020', image: './img/background/background_club_2020.gif' },
    { name: 'Plock 2001', image: './img/background/background_plock_2001.gif' },
    { name: 'Warsaw Street', image: './img/background/background_warsaw_street.png' },
    { name: 'San Francisco', image: './img/background/background_san_francisco.png' },
    { name: 'Los Angeles', image: './img/background/background_los_angeles.png' },
    { name: 'New York City', image: './img/background/background_nyc_center.png' },
    { name: '5 Pointz', image: './img/background/background_5_pointz.png' },
    { name: 'Opole 2000', image: './img/background/background_opole_2000.png' },
    { name: 'Narodowy', image: './img/background/background_narodowy.png' },
    { name: 'Galaktyka', image: './img/background/background_galaktyka.gif' },
    { name: 'Studio', image: './img/background/background_studio.png' },
    { name: 'Dolek', image: './img/background/background_dolek.png' },
    { name: 'Bar', image: './img/background/background_bar.gif' },
    { name: 'Lawka', image: './img/background/background_lawka.png' },
    { name: 'Kopa', image: './img/background/kopa.png' },
    { name: 'Strefa', image: './img/background/strefa.png' },
    { name: 'Hybrydy', image: './img/background/hybrydy.png' },
    { name: 'Oktagon', image: './img/background/oktagon.png' },
    { name: 'Jubilat', image: './img/jubilat.png' },
    { name: 'Zamek', image: './img/zamek.png' },
    { name: 'Starka Opole', image: './img/background/starka_opole.png' }
]
let mapIndex = 12 // Default to Bar map


// Selection Indices
// Selection Indices
let p1Index = 0
let p2Index = 1
let p3Index = 2
let p4Index = 3
let p1Confirmed = false
let p2Confirmed = false
let p3Confirmed = false
let p4Confirmed = false

// Sub-indices removed in favor of direct P3/P4 support for logic consistency

// Menu Elements
const team2115List = document.getElementById('team2115List')
const team2020List = document.getElementById('team2020List')
const teamGoscieList = document.getElementById('teamGoscieList')
const teamOceniaczeList = document.getElementById('teamOceniaczeList')
const startButton = document.getElementById('startButton')
const menuScreen = document.getElementById('menuScreen')
const mapSelectionScreen = document.getElementById('mapSelectionScreen')
const mapList = document.getElementById('mapList')
const gameScreen = document.getElementById('gameScreen')
// Main Menu Elements
const mainMenuScreen = document.getElementById('mainMenuScreen')
if (!window.updateMainMenuVisuals) {
    window.updateMainMenuVisuals = function () {
        // Simple visual update if not defined elsewhere
        if (!mainMenuScreen) return;
        const options = mainMenuScreen.querySelectorAll('.menu-option');
        options.forEach((opt, idx) => {
            if (idx === mainMenuIndex) opt.classList.add('selected');
            else opt.classList.remove('selected');
        });
    };
}
const controlsScreen = document.getElementById('controlsScreen')
const mainMenuList = document.getElementById('mainMenuList')


// Visual Elements Cache
const characterButtons = []

function createCharacterButton(name, container) {
    const btn = document.createElement('div')
    btn.innerHTML = name
    // Fixed size style - Increased per user request
    btn.style = "border: 2px solid #555; width: 75px; height: 45px; display: flex; align-items: center; justify-content: center; text-align: center; margin: 2px; color: #aaa; font-family: 'Press Start 2P'; font-size: 9px; cursor: pointer; user-select: none; box-sizing: border-box; word-break: break-word; transition: all 0.1s;"
    btn.id = `char-btn-${name}`

    // Mouse/Touch interaction
    const handleSelection = (e) => {
        if (e) e.preventDefault()
        // Find index of this character
        const charIndex = allCharacters.indexOf(name)
        if (charIndex === -1) return

        const isOnline = (gameMode === 'ONLINE' || gameMode === '2V2_CHAOS') && window.networkManager && window.networkManager.isOnline
        const myIdx = isOnline ? window.networkManager.playerIndex : 0

        // --- ONLINE SELECTION LOGIC ---
        // Each player can only select their own assigned slot (0->P1, 1->P2, 2->P3, 3->P4)
        if (isOnline) {
            if (myIdx === 0 && !p1Confirmed) {
                if (p1Index === charIndex) { p1Confirmed = true; player1Selection = name; safeAudio('playSound', 'p1'); }
                else { p1Index = Number(charIndex); safeAudio('playAttack'); }
                broadcastCharSync();
            } else if (myIdx === 1 && !p2Confirmed) {
                if (p2Index === charIndex) { p2Confirmed = true; player2Selection = name; safeAudio('playSound', 'p2'); }
                else { p2Index = charIndex; safeAudio('playAttack'); }
                broadcastCharSync();
            } else if (myIdx === 2 && !p3Confirmed && gameMode === '2V2_CHAOS') {
                if (p3Index === charIndex) { p3Confirmed = true; window.p3Selection = name; safeAudio('playSound', 'p1'); }
                else { p3Index = charIndex; safeAudio('playAttack'); }
                broadcastCharSync();
            } else if (myIdx === 3 && !p4Confirmed && gameMode === '2V2_CHAOS') {
                if (p4Index === charIndex) { p4Confirmed = true; window.p4Selection = name; safeAudio('playSound', 'p2'); }
                else { p4Index = charIndex; safeAudio('playAttack'); }
                broadcastCharSync();
            }
            updateMenuVisuals()
            return;
        }

        // --- LOCAL SELECTION LOGIC ---
        if (!p1Confirmed) {
            if (p1Index === charIndex) {
                p1Confirmed = true; player1Selection = name;
                safeAudio('playSound', 'p1');
            } else {
                p1Index = Number(charIndex)
                safeAudio('playAttack');
            }
            updateMenuVisuals()
        } else if (!p2Confirmed && (gameMode === 'PVE' || gameMode === 'TRAINING' || gameMode === 'TOURNAMENT' || gameMode === 'PVP')) {
            if (p2Index === charIndex) {
                p2Confirmed = true; player2Selection = name;
                safeAudio('playSound', 'p2');
            } else {
                p2Index = charIndex
                safeAudio('playAttack');
            }
            updateMenuVisuals()
        }
    }

    btn.addEventListener('click', handleSelection)
    btn.addEventListener('touchstart', handleSelection, { passive: false })

    // NO MOUSEOVER PREVIEW (User Request: Only P1 Selection / Index 0)

    container.appendChild(btn)
    characterButtons.push({ name, element: btn })
}

if (menuScreen) {
    if (team2115List) roster.team2115.forEach(name => createCharacterButton(name, team2115List))
    if (team2020List) roster.team2020.forEach(name => createCharacterButton(name, team2020List))
    if (teamGoscieList) roster.teamGoscie.forEach(name => createCharacterButton(name, teamGoscieList))
    if (teamOceniaczeList) roster.teamOceniacze.forEach(name => createCharacterButton(name, teamOceniaczeList))

    updateMenuVisuals()
}

function updateMenuVisuals() {
    if (typeof p1Index !== 'number') p1Index = 0
    if (typeof p2Index !== 'number') p2Index = 1

    const isOnline = (gameMode === 'ONLINE' || gameMode === '2V2_CHAOS') && window.networkManager && window.networkManager.isOnline

    // 1. Update Buttons (Highlighting)
    characterButtons.forEach((btnObj, i) => {
        const el = btnObj.element
        el.style.borderColor = '#555'
        el.style.backgroundColor = 'transparent'
        el.style.color = '#aaa'
        el.style.boxShadow = 'none'

        const charIndex = allCharacters.indexOf(btnObj.name)
        let label = btnObj.name

        // P1 Confirmation Chain
        if (charIndex === p1Index) {
            el.style.borderColor = '#00ff00'
            el.style.color = '#00ff00' // Highlight text too
            el.style.boxShadow = '0 0 10px #00ff00'
            label = "P1: " + btnObj.name
            if (p1Confirmed) el.style.backgroundColor = 'rgba(0, 255, 0, 0.3)'
        }

        // P2 Confirmation Chain
        if (charIndex === p2Index) {
            const isCPU = (gameMode === 'PVE' || gameMode === 'TRAINING' || gameMode === 'TOURNAMENT')
            const p2Highlight = isCPU ? '#ff0055' : '#00ffff'
            el.style.borderColor = p2Highlight
            el.style.boxShadow = `0 0 10px ${p2Highlight}`
            label = (isCPU ? "CPU: " : "P2: ") + btnObj.name
            if (p2Confirmed) el.style.backgroundColor = isCPU ? 'rgba(255, 0, 85, 0.3)' : 'rgba(0, 255, 255, 0.3)'
        }

        // P3 Confirmation Chain (2v2)
        if (gameMode === '2V2_CHAOS' && charIndex === p3Index) {
            el.style.borderColor = '#ffff00' // Yellow
            el.style.boxShadow = '0 0 10px #ffff00'
            const p3Label = isOnline ? "P3: " : (p1Confirmed && p2Confirmed && !p3Confirmed ? ">>> P3: " : "P3: ")
            label = p3Label + btnObj.name
            if (p3Confirmed) el.style.backgroundColor = 'rgba(255, 255, 0, 0.3)'
        }

        // P4 Confirmation Chain (2v2)
        if (gameMode === '2V2_CHAOS' && charIndex === p4Index) {
            el.style.borderColor = '#d946ef' // Purple
            el.style.boxShadow = '0 0 10px #d946ef'
            const p4Label = isOnline ? "P4: " : (p1Confirmed && p2Confirmed && p3Confirmed && !p4Confirmed ? ">>> P4: " : "P4: ")
            label = p4Label + btnObj.name
            if (p4Confirmed) el.style.backgroundColor = 'rgba(217, 70, 239, 0.3)'
        }

        if (gameMode === '2V2_CHAOS') {
            // Update Preview logic to show current selector
            if (p1Confirmed && p2Confirmed && !p3Confirmed) {
                // P3 is selecting - maybe show in P1 preview slot?
                p1PreviewIdx = p3Index
            } else if (p1Confirmed && p2Confirmed && p3Confirmed && !p4Confirmed) {
                // P4 is selecting - show in P2 preview slot?
                p2PreviewIdx = p4Index
            }
        }

        el.innerHTML = label
    })

    // Previews (Show current actively selecting entity)
    let p1PreviewIdx = p1Index
    if (p1Confirmed && gameMode === '2V2_CHAOS') {
        p1PreviewIdx = p3Index
    }

    let p2PreviewIdx = p2Index
    if (p2Confirmed && gameMode === '2V2_CHAOS') {
        p2PreviewIdx = p4Index
    }

    // Override if they are already confirmed to show the ACTUAL selection
    if (p1Confirmed && p2Confirmed && p3Confirmed) p1PreviewIdx = p1Index; // Wait, this is getting complex.
    // Let's stick to showing who is currently moving.

    // REDO PREVIEW LOGIC
    let p1Disp = p1Index;
    let p2Disp = p2Index;

    if (gameMode === '2V2_CHAOS') {
        if (!p1Confirmed) p1Disp = p1Index;
        else if (!p3Confirmed) p1Disp = p3Index;
        else p1Disp = p1Index; // Show final P1 or maybe P3? Let's show the "current" active slot.

        if (!p2Confirmed) p2Disp = p2Index;
        else if (!p4Confirmed) p2Disp = p4Index;
        else p2Disp = p2Index;
    }

    updatePreviewWindow(p1Disp, 'charPreview', 'charPreviewSpriteP1', 'charPreviewNameP1', 'charPreviewUnknown')
    updatePreviewWindow(p2Disp, 'charPreviewP2', 'charPreviewSpriteP2', 'charPreviewNameP2', 'charPreviewUnknownP2')

    // Start Button
    // Start Button
    let allConfirmed = p1Confirmed && p2Confirmed;
    if (gameMode === '2V2_CHAOS') {
        allConfirmed = p1Confirmed && p2Confirmed && p3Confirmed && p4Confirmed;
    }

    if (allConfirmed) startButton.style.display = 'block'
    else startButton.style.display = 'none'
}

function updatePreviewWindow(charIndex, containerId, spriteId, nameId, unknownId) {
    const preview = document.getElementById(containerId)
    const previewSprite = document.getElementById(spriteId)
    const previewName = document.getElementById(nameId)
    const unknownImg = document.getElementById(unknownId)

    if (preview && previewSprite && previewName) {
        // Handle undefined charIndex or mismatch
        const name = (charIndex !== null && charIndex >= 0) ? allCharacters[charIndex] : null

        if (!name) {
            previewSprite.style.display = 'none'
            if (unknownImg) unknownImg.style.display = 'block'
            previewName.innerText = "PLAYER"
            return
        }

        const upName = name.toUpperCase()
        const data = characterData[upName]

        if (data) {
            const src = data.spriteSheetData.imageSrc
            const rows = data.spriteSheetData.rows || 1
            const cols = data.spriteSheetData.framesMax || 1

            previewSprite.style.backgroundImage = `url(${src})`

            // WIDER GRAPHICS LOGIC: Stretch width aggressively (300%) and Center
            // This zooms in on the character horizontally.
            previewSprite.style.backgroundSize = `${cols * 300}% ${rows * 100}%`
            previewSprite.style.backgroundPosition = 'center top'

            previewSprite.style.display = 'block'
            if (unknownImg) unknownImg.style.display = 'none'
        } else {
            previewSprite.style.display = 'none'
            if (unknownImg) unknownImg.style.display = 'block'
            previewName.innerText = (name || "Unknown") + " (NO DATA)"
            return
        }
        previewName.innerText = name
    }
}

// Global Menu & Game Input Handler
// Global Input Handler (Main Menu -> Char Select -> Map Select -> Game)
window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase()

    // 1. MAIN MENU LOGIC
    if (mainMenuActive) {
        if (controlsActive) {
            if (key === 'escape') {
                controlsActive = false
                controlsScreen.style.display = 'none'
            }
            return
        }

        if (optionsActive) {
            // Priority: Key Remapping
            if (remappingState) {
                if (key === 'escape') {
                    // Cancel remapping if Escape is pressed
                    remappingState = null
                    document.getElementById('remapStatus').innerText = "ANULOWANO"
                    setTimeout(() => { document.getElementById('remapStatus').innerText = "" }, 1000)
                    updateOptionsUI()
                    return
                }

                // Remap logic
                window.config[remappingState.p][remappingState.a] = key
                localStorage.setItem('fg_config_v2', JSON.stringify(window.config))
                remappingState = null
                document.getElementById('remapStatus').innerText = "ZAPISANO!"
                setTimeout(() => { document.getElementById('remapStatus').innerText = "" }, 1000)
                updateOptionsUI()
                return
            }

            if (key === 'escape' || key === 'backspace') {
                optionsActive = false
                document.getElementById('optionsScreen').style.display = 'none'
                window.showMainMenu()
            }
            return
        }

        if (key === 'escape' || key === 'backspace') {
            if (window.smartBack) window.smartBack();
            return
        }

        if (key === 'w' || key === 'arrowup') {
            mainMenuIndex = (mainMenuIndex - 2 + 10) % 10 // Grid: 2 columns, 10 options
            safeAudio('playNav')
            updateMainMenuVisuals()
        } else if (key === 's' || key === 'arrowdown') {
            mainMenuIndex = (mainMenuIndex + 2) % 10
            safeAudio('playNav')
            updateMainMenuVisuals()
        } else if (key === 'a' || key === 'arrowleft') {
            if (mainMenuIndex % 2 === 1) mainMenuIndex -= 1
            safeAudio('playNav')
            updateMainMenuVisuals()
        } else if (key === 'd' || key === 'arrowright') {
            if (mainMenuIndex % 2 === 0) mainMenuIndex += 1
            safeAudio('playNav')
            updateMainMenuVisuals()
        } else if (key === 'enter' || key === ' ') {
            safeAudio('playSelect')
            handleMainMenuSelection()
        }
        return
    }

    // GAME OVER INPUT (High Priority)
    if (document.getElementById('gameOverMenu').style.display === 'flex') {
        if (key === 'enter' || key === ' ') {
            if (gameMode === 'TOURNAMENT' && window.tournamentRound <= 10 && window.player.health > 0) {
                // Check if actually won (safety) - actually determineWinner handles logic, 
                // here we just return to menu or next round. 
                // If won, determineWinner should have handled it? 
                // If we are here, it means we are in Game Over screen.
                // In Tournament, if we Win, we shouldn't see Game Over screen generally, 
                // unless "End of Tournament".
                returnToMenu()
            } else {
                returnToMenu()
            }
        }
        return // Block other inputs
    }

    // 2. CHARACTER SELECTION LOGIC
    if (menuScreen.style.display !== 'none') {
        const isOnline = (gameMode === 'ONLINE' || gameMode === '2V2_CHAOS') && window.networkManager && window.networkManager.isOnline
        const playerIndex = isOnline ? window.networkManager.playerIndex : 0 // Host/Local is 0

        // NAVIGATION LOGIC
        const now = Date.now()

        // P1 MOVEMENT
        const canMoveP1 = (isOnline && playerIndex === 0 && !p1Confirmed) || (!isOnline && !p1Confirmed)
        if (canMoveP1) {
            let moved = false
            if (key === 'w') { p1Index = (p1Index - 5 + allCharacters.length) % allCharacters.length; moved = true }
            if (key === 's') { p1Index = (p1Index + 5) % allCharacters.length; moved = true }
            if (key === 'a') { p1Index = (p1Index - 1 + allCharacters.length) % allCharacters.length; moved = true }
            if (key === 'd') { p1Index = (p1Index + 1) % allCharacters.length; moved = true }
            if (moved && (now - lastMenuInputTime > 130)) {
                safeAudio('playNav');
                updateMenuVisuals();
                lastMenuInputTime = now;
                if (isOnline) broadcastCharSync();
                return;
            }
        }

        // P2 MOVEMENT
        const canMoveP2 = (isOnline && playerIndex === 1 && !p2Confirmed) || (!isOnline && p1Confirmed && !p2Confirmed && (gameMode === 'PVE' || gameMode === 'TOURNAMENT' || gameMode === 'TRAINING')) || (gameMode === 'PVP' && !p2Confirmed)
        if (canMoveP2) {
            let moved = false
            const allowWasd = (isOnline && playerIndex === 1) || ((gameMode === 'PVE' || gameMode === 'TRAINING') && p1Confirmed);
            if ((allowWasd && key === 'w') || key === 'arrowup') { p2Index = (p2Index - 5 + allCharacters.length) % allCharacters.length; moved = true }
            if ((allowWasd && key === 's') || key === 'arrowdown') { p2Index = (p2Index + 5) % allCharacters.length; moved = true }
            if ((allowWasd && key === 'a') || key === 'arrowleft') { p2Index = (p2Index - 1 + allCharacters.length) % allCharacters.length; moved = true }
            if ((allowWasd && key === 'd') || key === 'arrowright') { p2Index = (p2Index + 1) % allCharacters.length; moved = true }

            if (moved && (now - lastMenuInputTime > 130)) {
                safeAudio(isOnline ? 'playAttack' : 'playNav');
                updateMenuVisuals();
                lastMenuInputTime = now;
                if (isOnline) broadcastCharSync();
                return;
            }
        }

        // P3 MOVEMENT (2v2 Chaos Online/Local)
        const canMoveP3 = (isOnline && playerIndex === 2 && !p3Confirmed && gameMode === '2V2_CHAOS') || (!isOnline && p1Confirmed && p2Confirmed && !p3Confirmed && gameMode === '2V2_CHAOS')
        if (canMoveP3) {
            let moved = false
            if (key === 'w' || key === 'arrowup') { p3Index = (p3Index - 5 + allCharacters.length) % allCharacters.length; moved = true }
            if (key === 's' || key === 'arrowdown') { p3Index = (p3Index + 5) % allCharacters.length; moved = true }
            if (key === 'a' || key === 'arrowleft') { p3Index = (p3Index - 1 + allCharacters.length) % allCharacters.length; moved = true }
            if (key === 'd' || key === 'arrowright') { p3Index = (p3Index + 1) % allCharacters.length; moved = true }
            if (moved && (now - lastMenuInputTime > 130)) {
                safeAudio('playNav');
                updateMenuVisuals();
                lastMenuInputTime = now;
                if (isOnline) broadcastCharSync();
                return;
            }
        }

        // P4 MOVEMENT (2v2 Chaos Online/Local)
        const canMoveP4 = (isOnline && playerIndex === 3 && !p4Confirmed && gameMode === '2V2_CHAOS') || (!isOnline && p1Confirmed && p2Confirmed && p3Confirmed && !p4Confirmed && gameMode === '2V2_CHAOS')
        if (canMoveP4) {
            let moved = false
            if (key === 'w' || key === 'arrowup') { p4Index = (p4Index - 5 + allCharacters.length) % allCharacters.length; moved = true }
            if (key === 's' || key === 'arrowdown') { p4Index = (p4Index + 5) % allCharacters.length; moved = true }
            if (key === 'a' || key === 'arrowleft') { p4Index = (p4Index - 1 + allCharacters.length) % allCharacters.length; moved = true }
            if (key === 'd' || key === 'arrowright') { p4Index = (p4Index + 1) % allCharacters.length; moved = true }
            if (moved && (now - lastMenuInputTime > 130)) {
                safeAudio('playNav');
                updateMenuVisuals();
                lastMenuInputTime = now;
                if (isOnline) broadcastCharSync();
                return;
            }
        }

        // CONFIRMATION LOGIC
        if (key === ' ' && canMoveP1) {
            p1Confirmed = true; player1Selection = allCharacters[p1Index];
            safeAudio('playSound', 'p1'); updateMenuVisuals(); if (isOnline) broadcastCharSync();
        }
        if (key === 'enter' && canMoveP2) {
            p2Confirmed = true; player2Selection = allCharacters[p2Index];
            safeAudio('playSound', 'p2'); updateMenuVisuals(); if (isOnline) broadcastCharSync();
        }
        if (gameMode === '2V2_CHAOS') {
            if (key === ' ' && canMoveP3) {
                p3Confirmed = true; window.p3Selection = allCharacters[p3Index];
                safeAudio('playSound', 'p1'); updateMenuVisuals(); if (isOnline) broadcastCharSync();
            }
            if (key === 'enter' && canMoveP4) {
                p4Confirmed = true; window.p4Selection = allCharacters[p4Index];
                safeAudio('playSound', 'p2'); updateMenuVisuals(); if (isOnline) broadcastCharSync();
            }
        }

        // NAVIGATION: BACK
        if (key === 'escape' || key === 'backspace') {
            if (p2Confirmed) p2Confirmed = false
            else if (p1Confirmed) p1Confirmed = false
            else {
                if (window.smartBack) window.smartBack();
                else showMainMenu();
            }
            if (isOnline) broadcastCharSync()
            updateMenuVisuals();
            return
        }
    }

    // Start Game -> Go To Map Selection
    if (p1Confirmed && p2Confirmed && event.key === 'Enter' && menuScreen.style.display !== 'none') {
        goToMapSelection()
    }


    // P1/P2/P3/P4 CONTROLS (Only if not in game or specifically allowed)
    if (gameStarted && !window.inputLocked) {
        // Only allow debug keys and ESC here. 
        // Phaser handles its own movement keys.

        if (key === 'h') {
            window.showDebugHitboxes = !window.showDebugHitboxes;
            return;
        }

        // PREVENT OLD ENGINE CONTROL INTERFERENCE
        // The old engine listeners (u, i, o, etc.) below should NOT run 
        // because they set flags on window.player which is a dummy object now.
        // However, if the user really wants the console logs, they are harmless 
        // UNLESS the sprite is relying on them.
    }

    // LEGACY CONTROL LISTENERS (Only if old engine is running or for debugging)
    // We'll keep them but skip if Phaser is active to avoid double logs/confusion
    const isPhaserActive = !!window.phaserGame;

    if (gameStarted && !window.inputLocked && window.player && window.player.dead === false && !isPhaserActive) {
        // P1
        if (key === 'u') {
            if (typeof window.player.taunt === 'function') window.player.taunt()
        }
        if (key === 'i') {
            if (typeof window.player.superAttack === 'function') window.player.superAttack()
        }
        if (key === 'o') {
            console.log("Key 'o' pressed (Legacy). Is player active?", !!window.player)
            if (typeof window.player.specialAttack === 'function') window.player.specialAttack()
        }

        // P2 (Added)
        if (window.enemy && window.enemy.dead === false) {
            // [ = Super (Matches i position)
            if (key === '[' || key === '{') {
                if (typeof window.enemy.superAttack === 'function') window.enemy.superAttack()
            }
            // ] = Special (Matches o position)
            if (key === ']' || key === '}') {
                if (typeof window.enemy.specialAttack === 'function') window.enemy.specialAttack()
            }
            // \ = Taunt (Matches u position relative to others)
            if (key === '\\' || key === '|') {
                if (typeof window.enemy.taunt === 'function') window.enemy.taunt()
            }
        }
    }


    // GLOBAL ESCAPE
    // Handles returning from Game or other screens
    if (key === 'escape') {
        // If info popup is open
        const infoPopup = document.getElementById('infoPopup')
        if (infoPopup && infoPopup.style.display === 'flex') {
            infoPopup.style.display = 'none'
            window.mainMenuActive = true
            return
        }

        // If in game
        if (gameStarted) {
            const escOverlay = document.getElementById('escOverlay')
            if (!escPressedOnce) {
                // First Press
                escPressedOnce = true
                escOverlay.style.display = 'flex'
                // Reset after 3 seconds if not pressed again
                clearTimeout(escTimer)
                escTimer = setTimeout(() => {
                    escPressedOnce = false
                    escOverlay.style.display = 'none'
                }, 3000)
            } else {
                // Second Press
                clearTimeout(escTimer)
                escPressedOnce = false
                escOverlay.style.display = 'none'
                returnToMenu()
            }
        }
        // EXIT ONLINE MENU - LOBBY
        else if (document.getElementById('onlineScreen').style.display === 'flex') {
            if (typeof window.exitOnlineMenu === 'function') window.exitOnlineMenu()
            else returnToMenu()
        }
        // EXIT SIDE SELECTION (Waiting Room)
        else if (document.getElementById('sideSelectionScreen') && document.getElementById('sideSelectionScreen').style.display === 'flex') {
            if (typeof window.exitOnlineMenu === 'function') window.exitOnlineMenu()
            else {
                document.getElementById('sideSelectionScreen').style.display = 'none'
                showMainMenu()
            }
        }
        else if (menuScreen.style.display === 'none' && !mainMenuActive &&
            document.getElementById('gameOverMenu').style.display !== 'flex' &&
            document.getElementById('tournamentScreen').style.display !== 'block') {
            // Fallback return if not in game but stuck elsewhere?
            returnToMenu()
        }
        return
    }
})


// Map Selection Input Handler
// Map Selection Input Handler
window.addEventListener('keydown', (event) => {
    if (!mapSelectionActive) return

    // ONLINE: Only Host can select map
    if ((gameMode === 'ONLINE' || gameMode === '2V2_CHAOS') && window.networkManager) {
        if (window.networkManager.playerIndex !== 0) return // Guest waits for Host
    }

    const key = event.key.toLowerCase()

    if (key === 'w' || key === 'arrowup') {
        mapIndex = (mapIndex - 1 + maps.length) % maps.length
        renderMapList()
        mapIndex = (mapIndex - 1 + maps.length) % maps.length
        renderMapList()
        if ((gameMode === 'ONLINE' || gameMode === '2V2_CHAOS') && window.networkManager) {
            window.networkManager.sendInput({ type: 'map_update', payload: { mapIndex } })
        }
    } else if (key === 's' || key === 'arrowdown') {
        mapIndex = (mapIndex + 1) % maps.length
        renderMapList()
        mapIndex = (mapIndex + 1) % maps.length
        renderMapList()
        if ((gameMode === 'ONLINE' || gameMode === '2V2_CHAOS') && window.networkManager) {
            window.networkManager.sendInput({ type: 'map_update', payload: { mapIndex } })
        }
    } else if (key === ' ' || key === 'c' || key === 'enter') {
        // Space, Kick ('c') or Enter to confirm map

        // ONLINE SYNC: Send Start Signal with Data
        if ((gameMode === 'ONLINE' || gameMode === '2V2_CHAOS') && window.networkManager) {
            const syncData = {
                p1Idx: p1Index,
                p2Idx: p2Index,
                map: mapIndex
            }
            window.networkManager.sendInput({
                key: 'START',
                type: 'special_start',
                payload: syncData
            })
            console.log("SENT START SYNC (INDICES):", syncData)
        }

        mapSelectionActive = false
        mapSelectionScreen.style.display = 'none'
        // gameScreen.style.display = 'inline-block' // REMOVED: Prevent early HUD visibility
        startGame()
    }
})

// HELPER FUNCTIONS
function goToMapSelection() {
    menuScreen.style.display = 'none'
    mapSelectionScreen.style.display = 'flex'
    renderMapList()

    // ONLINE SYNC: Inform Guest to go to map selection too
    if ((gameMode === 'ONLINE' || gameMode === '2V2_CHAOS') && window.networkManager && window.networkManager.playerIndex === 0) {
        window.networkManager.sendInput({
            key: 'MAP_SELECT',
            type: 'goto_map',
            payload: {}
        })
    }

    setTimeout(() => {
        mapSelectionActive = true
    }, 300)
}

// Legacy menu functions removed in favor of newer logic at bottom of file.

function startCharacterSelection() {
    mainMenuActive = false
    mainMenuScreen.style.display = 'none'
    menuScreen.style.display = 'flex'

    // Reset Char Select
    p1Confirmed = false
    p2Confirmed = false
    player1Selection = null
    player2Selection = null
    updateMenuVisuals()
}


// EXPOSE TO GLOBAL// Define showMainMenu properly
window.showMainMenu = function () {
    mainMenuActive = true
    introScreen.style.display = 'none'
    if (mainMenuScreen) mainMenuScreen.style.display = 'flex'
    document.getElementById('menuScreen').style.display = 'none'
    if (typeof statsScreen !== 'undefined') statsScreen.style.display = 'none'

    // Show Ticker
    const ticker = document.getElementById('newsTickerBar');
    if (ticker) {
        ticker.style.display = 'flex';
        if (typeof initTicker === 'function') initTicker();
    }

    updateMainMenuVisuals()
    // Music Auto-Start
    safeAudio('playMusic', 'menu')
}

function renderMapList() {
    mapList.innerHTML = ''
    maps.forEach((map, i) => {
        const div = document.createElement('div')
        div.innerText = map.name
        div.style.fontFamily = "'Press Start 2P'"
        div.style.color = (i === mapIndex) ? 'white' : '#555'
        div.style.textShadow = (i === mapIndex) ? '2px 2px #ff0055' : 'none'
        div.style.fontSize = (i === mapIndex) ? '24px' : '16px'
        div.style.textAlign = 'center'
        div.style.cursor = 'pointer'

        // Touch/Click to Select & Confirm
        div.onclick = () => {
            if (mapIndex === i) {
                // Confirm and Start
                safeAudio('playSelect')
                mapSelectionActive = false
                mapSelectionScreen.style.display = 'none'
                startGame()
            } else {
                mapIndex = i
                safeAudio('playNav')
                renderMapList()
            }
        }

        mapList.appendChild(div)
    })
}



// ==========================================
// TOURNAMENT MODE LOGIC (PVE)
// ==========================================

window.tournamentRound = 1
window.tournamentOpponents = []
window.tournamentWins = 0

function startTournamentSetup() {
    mainMenuActive = false
    document.getElementById('mainMenuScreen').style.display = 'none'

    // Reset to default config if not coming from city map
    if (!window.currentTournamentConfig) {
        window.currentTournamentConfig = { rounds: 10, reward: 10000 };
    }

    // Go to Char Select for P1
    showCharSelect()
    // Reset Tournament State
    tournamentRound = 1
    tournamentWins = 0
    // Opponents generated after P1 Selects
}

function generateTournamentOpponents(playerChar) {
    const opponents = []
    // Pull from ALL characters for better variety
    const pool = allCharacters.filter(c => c !== playerChar)

    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // Pick based on rounds
    const rounds = (window.currentTournamentConfig && window.currentTournamentConfig.rounds) || 10
    for (let i = 0; i < rounds; i++) {
        opponents.push(pool[i % pool.length])
    }
    return opponents
}

function showTournamentScreen() {
    // Hide others
    menuScreen.style.display = 'none'
    mapSelectionScreen.style.display = 'none'
    document.getElementById('gameScreen').style.display = 'none'
    document.getElementById('gameOverMenu').style.display = 'none'

    const tournScreen = document.getElementById('tournamentScreen')
    tournScreen.style.display = 'flex'

    const rounds = (window.currentTournamentConfig && window.currentTournamentConfig.rounds) || 10
    document.getElementById('tournRoundLabel').innerText = `RUNDA ${tournamentRound} / ${rounds}`

    const opponentName = tournamentOpponents[tournamentRound - 1]
    document.getElementById('tournEnemyName').innerText = opponentName

    // Bracket List
    const bracketDiv = document.getElementById('tournBracket')
    bracketDiv.innerHTML = ''
    tournamentOpponents.forEach((opp, idx) => {
        const div = document.createElement('div')
        const num = idx + 1
        div.innerText = `#${num} vs ${opp}`
        if (num < tournamentRound) {
            div.style.color = '#555'
            div.style.textDecoration = 'line-through'
        } else if (num === tournamentRound) {
            div.style.color = '#00ff00'
            div.style.fontWeight = 'bold'
            div.style.border = '1px solid #00ff00'
        } else {
            div.style.color = '#555'
        }
        bracketDiv.appendChild(div)
    })
}

window.startTournamentRound = function () {
    // Set Opponent
    const opponentName = tournamentOpponents[tournamentRound - 1]
    player2Selection = opponentName
    p2Index = allCharacters.indexOf(opponentName)

    // Set Difficulty
    // 1-3: KASZTAN
    // 4-7: OGOR
    // 8-10: CHUCKNORRIS
    if (tournamentRound <= 3) window.aiDifficulty = 'KASZTAN'
    else if (tournamentRound <= 7) window.aiDifficulty = 'OGOR'
    else window.aiDifficulty = 'CHUCKNORRIS'

    console.log(`Tournament Round ${tournamentRound}: VS ${opponentName} (Diff: ${window.aiDifficulty})`)

    document.getElementById('tournamentScreen').style.display = 'none'

    // Select Map Randomly
    mapIndex = Math.floor(Math.random() * maps.length)

    // Start Game
    document.getElementById('gameScreen').style.display = 'block'
    startGame()
}

// Override goToMapSelection for Tournament Flow
const originalGoToMapSelection = goToMapSelection
goToMapSelection = function () {
    if (gameMode === 'TOURNAMENT') {
        const rounds = (window.currentTournamentConfig && window.currentTournamentConfig.rounds) || 10
        // Generate Opponents if first round
        if (tournamentRound === 1) {
            tournamentOpponents = generateTournamentOpponents(player1Selection)
        }
        showTournamentScreen()
    } else {
        originalGoToMapSelection()
    }
}

// Override determineWinner for Tournament Flow (Since we can't easily edit determineWinner code block I can inject logic via wrapper or just rely on 'gameOverMenu' check handling?)
// Actually, determineWinner sets 'gameOverMenu' display.
// We should intercept this.
// But determineWinner is not global? It's likely global or scoped to main.js.
// It was called as a standalone function.

// I'll add a hook to 'returnToMenu' (Modified earlier) to handle "Next Round" if needed.
// But we need to know if we WON.
// 'determineWinner' sets 'winningPlayer'.
// I will check winningPlayer in a loop or Interval? No.
// Let's rely on the fact that I modified the 'Game Over' Input handler.
// Wait, if I lost, Game Over is fine.
// If I WON, Game Over appears saying "Player 1 Wins".
// I need to intercept *that* screen to say "NEXT ROUND".
// I can do this by observing changes to gameOverMenu or 'winningPlayer'.

// Better approach:
// Hook into 'animate' or 'updatePhysics' where it calls determineWinner?
// No, too invasive.
// I will override 'determineWinner' if I can (it's function defined in main.js).
// Since I can't replace it easily without reading it all, 
// I will create a poller that checks if 'gameOverMenu' is visible AND gameMode is Tournament.
setInterval(() => {
    if (gameMode === 'TOURNAMENT' && window.matchOver && document.getElementById('gameOverMenu').style.display === 'flex') {
        const rounds = (window.currentTournamentConfig && window.currentTournamentConfig.rounds) || 10
        const reward = (window.currentTournamentConfig && window.currentTournamentConfig.reward) || 10000

        // Check who won
        // Fix: window.winningPlayer stores the NAME (key), not the object.
        if (window.winningPlayer === window.player1Selection) {
            // P1 Won
            if (!window.matchRecorded) {
                if (window.statsManager) window.statsManager.recordMatch(window.player1Selection, window.player2Selection);
                window.matchRecorded = true;
            }

            if (tournamentRound < rounds) {
                document.getElementById('gameOverText').innerText = "RUNDA WYGRANA!"
                const btn = document.querySelector('#gameOverMenu div[style*="cursor: pointer"]')
                if (btn) {
                    btn.innerText = "NASTEPNA RUNDA (SPACE/ENTER/CLICK)"
                    btn.onclick = function () { returnToMenu() }
                }
            } else {
                document.getElementById('gameOverText').innerText = "MISTRZ TURNIEJU!"
                const btn = document.querySelector('#gameOverMenu div[style*="cursor: pointer"]')
                if (btn) {
                    btn.innerText = "KONIEC - ODBIERZ NAGRODE! (SPACE/ENTER/CLICK)"
                    btn.onclick = function () {
                        // Reward for full victory
                        if (window.collectionManager) {
                            window.collectionManager.updateMoney(reward);
                            alert(`GRATULACJE! WYGRALES TURNIEJ I OTRZYMALES ${reward.toLocaleString()} MK!`);
                        }
                        returnToMenu()
                    }
                }
            }
        } else {
            // Lost
            document.getElementById('gameOverText').innerText = "ELIMINACJA!"
            const btn = document.querySelector('#gameOverMenu div[style*="cursor: pointer"]')
            if (btn) {
                btn.innerText = "KONIEC (SPACE/ENTER/CLICK)"
                btn.onclick = function () { returnToMenu() }
            }
        }
    }
}, 500)

// Also update returnToMenu to handle Next Round logic
const originalReturnToMenu = returnToMenu
returnToMenu = function () {
    if (window.gameMode === 'TOURNAMENT') {
        const rounds = (window.currentTournamentConfig && window.currentTournamentConfig.rounds) || 10
        if (window.player && window.player.health > 0 && window.enemy && window.enemy.health <= 0) {
            // We won
            if (window.tournamentRound < rounds) {
                window.tournamentRound++
                // Clean up game vars
                gameStarted = false
                window.matchOver = false
                document.getElementById('gameOverMenu').style.display = 'none'
                document.getElementById('gameScreen').style.display = 'none'
                // Go to screen
                if (window.showTournamentScreen) {
                    window.showTournamentScreen();
                    return;
                }
            }
        }
    }
    // Default: Reset and Redirect
    originalReturnToMenu();
    if (window.smartBack) window.smartBack();
}
// START GAME
function startGame() {
    window.focus(); // FIX: Focus window to catch input
    if (gameStarted) return;
    if (!player1Selection || (!player2Selection && (gameMode === 'PVP' || gameMode === 'ONLINE'))) return // Safety check

    // Hide UI during combat
    const uiToHide = ['topRightUI', 'profileDisplay'];
    uiToHide.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('combat-hidden');
    });

    // Stamina Check for Fights (except Training)
    if (gameMode !== 'TRAINING' && window.statsManager) {
        // Online guests might rely on host? But usually local check is fine for visual feedback
        // If we are Guest, maybe skip check? Or check anyway.
        // Let's check for everyone for now.
        const cost = 10;
        if (!window.statsManager.consumeStamina(cost)) {
            alert("ZA MAŁO STAMINY NA WALKĘ! (WYMAGANE: 10)");
            return;
        }
    }

    // Play Fight Music
    if (typeof audioManager !== 'undefined' && typeof audioManager.playMusic === 'function') {
        // Only play if not already playing or to force restart
        audioManager.playMusic('fight');
    }

    // Hide ticker during game
    if (typeof newsTickerBar !== 'undefined' && newsTickerBar) newsTickerBar.style.display = 'none';

    gameStarted = true;
    mapSelectionActive = false;
    window.isRoundActive = false // RESET ROUND STATE to prevent AI moving during VS Screen
    window.currentRound = 1
    window.p1Wins = 0
    window.p2Wins = 0
    window.matchOver = false
    window.winningPlayer = null
    camera = { x: 0, y: 0, scale: 1 }
    zoomSoundPlayed = false;

    // INITIALIZE DUMMY PLAYERS IMMEDIATELY (Prevents online sync crash during VS/Loading)
    if (!window.player) window.player = { position: { x: 200, y: 400 }, velocity: { x: 0, y: 0 }, health: 100, maxHealth: 100, isAttacking: false };
    if (!window.enemy) window.enemy = { position: { x: 800, y: 400 }, velocity: { x: 0, y: 0 }, health: 100, maxHealth: 100, isAttacking: false };

    // Reset Pips
    document.querySelectorAll('.round-pip').forEach(pip => pip.classList.remove('filled'))

    // UI Names
    document.getElementById('playerName').innerText = player1Selection || 'P1'
    document.getElementById('enemyName').innerText = player2Selection || 'P2'

    // Background Selection
    // const backgrounds = [
    //     './img/background_club_2020.png',
    //     './img/background_plock_2001.png',
    //     './img/background_warsaw_street.png'
    // ]
    // const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)]

    // Use Selected Map
    const selectedMapObj = maps[mapIndex]
    const selectedBackground = selectedMapObj.image


    // SCALE FIX: Fit HD backgrounds to 1024 width. 
    // Assuming bg is landscape. scale < 1 shrinks it.
    // SCALE FIX: Auto fit
    background = new Sprite({
        position: { x: 0, y: 0 },
        imageSrc: selectedBackground,
        scale: 1,
        isBackground: true
    })

    // DETECT GIF & SET CSS BACKGROUND (Needed for Phaser transparency)
    const gameContainer = document.getElementById('game-container')
    gameContainer.style.backgroundImage = `url(${selectedBackground})`
    gameContainer.style.backgroundSize = '100% 100%'
    gameContainer.style.backgroundRepeat = 'no-repeat'
    gameContainer.style.backgroundPosition = 'center'

    if (selectedBackground.toLowerCase().endsWith('.gif')) {
        if (typeof background !== 'undefined') background.isGif = true
    } else {
        if (typeof background !== 'undefined') background.isGif = false
    }

    // GROUND LEVEL ADJUSTMENT
    // User requested raising characters back to floor level.
    window.groundLevel = 516
    if (selectedBackground.includes('club')) {
        window.groundLevel = 516
    }

    // --- VS SCREEN LOGIC ---
    const vsScreen = document.getElementById('vsScreen')
    const vsP1Img = document.getElementById('vsP1Image')
    const vsP2Img = document.getElementById('vsP2Image')
    const vsP1Name = document.getElementById('vsP1Name')
    const vsP2Name = document.getElementById('vsP2Name')

    // Setup P1/P2 Config for VS Screen (Keep existing visual logic)
    const p1ConfigToUse = (typeof characterData !== 'undefined' && characterData[player1Selection.toUpperCase()])
        ? characterData[player1Selection.toUpperCase()] : null
    const p2ConfigToUse = (typeof characterData !== 'undefined' && characterData[player2Selection.toUpperCase()])
        ? characterData[player2Selection.toUpperCase()] : null

    if (p1ConfigToUse) {
        const src = p1ConfigToUse.spriteSheetData.imageSrc
        const rows = p1ConfigToUse.spriteSheetData.rows || 1
        const cols = p1ConfigToUse.spriteSheetData.framesMax || 1

        vsP1Img.style.backgroundImage = `url(${src})`
        vsP1Img.style.backgroundSize = `${cols * 100}% auto`
        vsP1Img.style.backgroundPosition = `center top`
        vsP1Img.style.display = 'block'
        vsP1Name.innerText = p1ConfigToUse.name
    }
    if (p2ConfigToUse) {
        const src = p2ConfigToUse.spriteSheetData.imageSrc
        const rows = p2ConfigToUse.spriteSheetData.rows || 1
        const cols = p2ConfigToUse.spriteSheetData.framesMax || 1

        vsP2Img.style.backgroundImage = `url(${src})`
        vsP2Img.style.backgroundSize = `${cols * 100}% auto`
        vsP2Img.style.backgroundPosition = `center top`
        vsP2Img.style.display = 'block'
        vsP2Name.innerText = p2ConfigToUse.name
    }

    vsScreen.style.display = 'flex'
    window.inputLocked = true

    // PHASER INTEGRATION: Instead of creating local Fighter objects, 
    // we initialize the Phaser project with the selected characters.
    setTimeout(() => {
        vsScreen.style.display = 'none'
        const gScreen = document.getElementById('gameScreen')
        gScreen.style.display = 'block'
        gScreen.style.zIndex = '60' // Be above vsScreen (50) and mapSelect (10)

        // Hide other menus just in case
        document.getElementById('menuScreen').style.display = 'none'
        document.getElementById('mapSelectionScreen').style.display = 'none'

        window.inputLocked = false
        window.usePhaserCombat = true

        // Launch Phaser
        if (typeof initPhaserCombat === 'function') {
            // 2v2 Auto-fill if missing
            if (gameMode === '2V2_CHAOS') {
                const available = (typeof characterData !== 'undefined') ? Object.keys(characterData) : ['BEDOES 2115', 'WHITE 2115'];
                if (!window.player3Selection) {
                    window.player3Selection = available[Math.floor(Math.random() * available.length)];
                    console.log("Auto-assigned P3:", window.player3Selection);
                }
                if (!window.player4Selection) {
                    window.player4Selection = available[Math.floor(Math.random() * available.length)];
                    console.log("Auto-assigned P4:", window.player4Selection);
                }
            }

            initPhaserCombat({
                player1: player1Selection,
                player2: player2Selection,
                player3: window.player3Selection || null,
                player4: window.player4Selection || null,
                map: maps[mapIndex],
                gameMode: gameMode,
                aiDifficulty: window.aiDifficulty || 'KASZTAN'
            });
        }

        startRound()
    }, 3000)
}

function startRound() {
    window.focus(); // FIX: Focus window for round start
    // Ensure player/enemy objects exist for stats/UI sync
    if (!window.player) window.player = { position: {}, velocity: {}, health: 100, maxHealth: 100 };
    if (!window.enemy) window.enemy = { position: {}, velocity: {}, health: 100, maxHealth: 100 };

    // Reset Stats for local tracking
    player.health = player.maxHealth;
    enemy.health = enemy.maxHealth;
    player.dead = false;
    enemy.dead = false;

    // Reset UI
    document.querySelector('#playerHealth').style.width = '100%'
    document.querySelector('#enemyHealth').style.width = '100%'
    document.querySelector('#timer').innerHTML = '60'
    clearTimeout(timerId)
    timer = 60

    // Hide Game Over (Just in case)
    document.getElementById('displayText').style.display = 'none'
    document.getElementById('gameOverMenu').style.display = 'none'

    // Clear all KO cracks
    const cracks = document.querySelectorAll('img[src*="ko_crack.png"]');
    cracks.forEach(c => c.remove());

    // Phaser Round Reset
    if (window.currentPhaserBattle && typeof window.currentPhaserBattle.resetRound === 'function') {
        window.currentPhaserBattle.resetRound();
    }

    // Lock Input
    window.inputLocked = true

    // Visuals
    const overlay = document.getElementById('roundOverlay')
    const roundMsg = document.getElementById('roundMessage')
    const fightMsg = document.getElementById('fightMessage')

    overlay.style.display = 'flex'
    roundMsg.innerText = "ROUND " + window.currentRound
    roundMsg.style.display = 'block'
    fightMsg.style.display = 'none'

    // Audio
    if (audioManager) safeAudio('playRoundStart', window.currentRound)

    // Sequence
    setTimeout(() => {
        roundMsg.style.display = 'none'
        fightMsg.style.display = 'block'
    }, 1500)

    setTimeout(() => {
        overlay.style.display = 'none'
        window.inputLocked = false
        window.isRoundActive = true

        // Reset Phaser Players for next round
        if (window.phaserGame && window.phaserGame.scene && window.phaserGame.scene.getScene('CombatScene')) {
            const combat = window.phaserGame.scene.getScene('CombatScene');
            if (typeof combat.resetRound === 'function') combat.resetRound();
        }

        decreaseTimer()
    }, 2500)
}

// Game Keys
let lastP1Punch = 0
let lastP2Punch = 0

// DASH TIMERS
let lastKeyTime = {
    d: 0,
    a: 0,
    ArrowRight: 0,
    ArrowLeft: 0
}

const keys = {
    a: { pressed: false },
    d: { pressed: false },
    ArrowRight: { pressed: false },
    ArrowLeft: { pressed: false }
}

// Global Key Listeners for Movement
window.addEventListener('keydown', (event) => {
    // DEBUG: Toggle hitboxes with 'H' key
    if (event.key === 'h' || event.key === 'H') {
        window.showDebugHitboxes = !window.showDebugHitboxes
        return
    }

    if (!gameStarted || inputLocked) return
    if (!window.isRoundActive || window.matchOver) return

    // IF PHASER IS ACTIVE, BYPASS LEGACY COMBAT INPUTS
    if (window.phaserGame || window.usePhaserCombat) return;

    let targetKey = event.key

    // ONLINE GUEST LOCAL MAPPING (Mobile Touch Simulation Fix)
    // If Guest presses WASD/C/V (or touch sim), map to P2 keys locally so logic runs for P2
    if (gameMode === 'ONLINE' && window.networkManager && window.networkManager.playerIndex === 1 && !event.isRemote) {
        const k = targetKey.toLowerCase()
        if (k === 'w') targetKey = 'ArrowUp'
        else if (k === 's') targetKey = 'ArrowDown'
        else if (k === 'a') targetKey = 'ArrowLeft'
        else if (k === 'd') targetKey = 'ArrowRight'
        else if (k === ' ') targetKey = 'Enter'
        else if (k === 'c') targetKey = 'o' // Map to 'o' (safer than Shift)
        else if (k === 'v') targetKey = 'p' // Map to 'p' (safer than Control)
    }

    // ONLINE ROLE GUARD (Block Physics Control of wrong character)
    if (gameMode === 'ONLINE' && window.networkManager && !event.isRemote) {
        const isHost = window.networkManager.playerIndex === 0
        const isGuest = window.networkManager.playerIndex === 1
        const key = targetKey.toLowerCase() // Use mapped key

        // Host uses WASD, Guest uses Arrows (after mapping)
        const p1Keys = ['w', 'a', 's', 'd', ' ', 'c', 'v']
        const p2Keys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'enter', 'o', 'p']

        // If Guest tries to use P1 keys (unmapped, native), block it.
        // But since we mapped above, Guest now has P2 keys. So this check passes for mapped keys.
        // It blocks purely 'w' if mapping failed or if they press unmapped P1 keys.
        if (isGuest && p1Keys.includes(key)) return

        // If Host tries to use P2 keys, block
        if (isHost && p2Keys.includes(key)) return
    }

    switch (targetKey.toLowerCase()) {
        // P1
        case 'd':
            {
                const now = Date.now()
                if (now - lastKeyTime.d < 300) {
                    player.dash(1)
                } else {
                    keys.d.pressed = true
                    player.lastKey = 'd'
                }
                lastKeyTime.d = now
            }
            break
        case 'a':
            {
                const now = Date.now()
                if (now - lastKeyTime.a < 300) {
                    player.dash(-1)
                } else {
                    keys.a.pressed = true
                    player.lastKey = 'a'
                }
                lastKeyTime.a = now
            }
            break
        case 'w': // Jump P1
            if (player.velocity.y === 0 && !player.isBlocking) {
                player.velocity.y = -12 // SLOWER GAMEPLAY
            }
            break
        case 'c': // Parry P1
            if (!player.isAttacking && !player.isBlocking) {
                player.parry()
            }
            break
        case 's': // Block P1
            player.isBlocking = true
            player.velocity.x = 0 // Stop moving
            break
        case ' ': // Punch
            {
                const now = Date.now()
                if (now - lastP1Punch < 300) {
                    player.superAttack()
                } else {
                    if (!player.isAttacking && !player.isBlocking) {
                        player.attack()
                        safeAudio('playAttack')
                    }
                }
                lastP1Punch = now
            }
            break
        case 'c': // Kick
        case 'v': // Alternate Kick
            if (!player.isAttacking && !player.isBlocking) {
                player.attack2() // Fixed attack naming
                safeAudio('playAttack')
            }
            break

        // P2
        case 'arrowright':
            if (gameMode === 'PVE' || gameMode === 'TOURNAMENT') break
            {
                const now = Date.now()
                if (now - lastKeyTime.ArrowRight < 300) {
                    enemy.dash(1)
                } else {
                    keys.ArrowRight.pressed = true
                    enemy.lastKey = 'ArrowRight'
                }
                lastKeyTime.ArrowRight = now
            }
            break
        case 'arrowleft':
            if (gameMode === 'PVE' || gameMode === 'TOURNAMENT') break
            {
                const now = Date.now()
                if (now - lastKeyTime.ArrowLeft < 300) {
                    enemy.dash(-1)
                } else {
                    keys.ArrowLeft.pressed = true
                    enemy.lastKey = 'ArrowLeft'
                }
                lastKeyTime.ArrowLeft = now
            }
            break
        case 'arrowup': // Jump P2
            if (gameMode === 'PVE' || gameMode === 'TOURNAMENT') break
            if (enemy.velocity.y === 0) {
                enemy.velocity.y = -12 // SLOWER GAMEPLAY
            }
            break
        case 'enter': // Punch
            if (gameMode === 'PVE' || gameMode === 'TOURNAMENT') break
            {
                const now = Date.now()
                if (now - lastP2Punch < 300) {
                    enemy.superAttack()
                } else {
                    if (!enemy.isAttacking && !enemy.isBlocking) {
                        enemy.attack()
                        safeAudio('playAttack')
                    }
                }
                lastP2Punch = now
            }
            break
        case 'shift': // Kick (Local P2)
        case 'control':
        case 'o': // Kick (Online Guest)
        case 'p':
            if (gameMode === 'PVE' || gameMode === 'TOURNAMENT') break
            if (!enemy.isAttacking && !enemy.isBlocking) {
                enemy.attack2()
                safeAudio('playAttack')
            }
            break
        case 'arrowdown': // Block P2
            if (gameMode === 'PVE' || gameMode === 'TOURNAMENT') break
            enemy.isBlocking = true
            enemy.velocity.x = 0 // Stop moving when blocking
            break
    }
})

window.addEventListener('keyup', (event) => {
    // ONLINE INPUT FILTERING (Prevent Host from controlling Guest locally)
    if (gameMode === 'ONLINE' && !event.isRemote && window.networkManager) {
        const isHost = window.networkManager.playerIndex === 0
        const isGuest = window.networkManager.playerIndex === 1
        const key = event.key.toLowerCase()
        const p1Keys = ['w', 'a', 's', 'd', ' ']
        const p2Keys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'enter']

        if (isHost && p2Keys.includes(key)) return
        if (isGuest && p1Keys.includes(key)) return
    }

    if (!gameStarted || inputLocked) return

    // IF PHASER IS ACTIVE, BYPASS LEGACY COMBAT INPUTS
    if (window.phaserGame || window.usePhaserCombat) return;

    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's': // Stop Blocking P1
            player.isBlocking = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowDown': // Stop Blocking P2
            enemy.isBlocking = false
            break
    }
})

// ARCADE: Combo & Zoom State
let comboTimer
const comboEl = document.getElementById('comboCounter')

// Zoom State
// Zoom State
let camera = {
    x: 0,
    y: 0,
    scale: 1
}
let zoomSoundPlayed = false
// HIT STOP FRAME FREEZE
let frameFreeze = 0

// ARCADE: Particles & Text
const particles = []
const floatingTexts = []


// ==========================================
// FIXED TIME STEP GAME LOOP
// ==========================================

function updatePhysics() {
    // IF PHASER IS ACTIVE, BYPASS LEGACY COMBAT LOGIC
    if (window.phaserGame || window.usePhaserCombat) return

    // Safety Check: abort if players are not yet created
    if (!player || !enemy) return

    // 1. RESET VELOCITIES
    if (!player.isKnockedBack && !player.isDashing) player.velocity.x = 0
    if (!enemy.isKnockedBack && !enemy.isDashing) enemy.velocity.x = 0

    // 2. INPUT & AI
    if (window.isRoundActive && !window.matchOver) {

        // PROJECTILE SPAWN LOGIC
        [player, enemy].forEach(char => {
            // 1. FLEXXY LASSO
            if (char.currentType === 'lasso_super' && char.isAttacking && char.framesCurrent === 5) {
                if (!char.lassoThrown) {
                    char.lassoThrown = true
                    const direction = char.flipHorizontal ? -1 : 1
                    const velocity = { x: direction * 15, y: 0 }
                    const proj = new Projectile({
                        position: { x: char.position.x + (char.flipHorizontal ? 0 : 100), y: char.position.y + 50 },
                        velocity: velocity,
                        image: char.image,
                        framesMax: 8,
                        scale: char.scale,
                        owner: char,
                        framesRow: 5,
                        startFrame: 6
                    })
                    projectiles.push(proj)
                    safeAudio('playAttack')
                }
            } else if (char.currentType !== 'lasso_super') {
                char.lassoThrown = false
            }

            // 2. GENERIC SPECIAL PROJECTILE (DJ Ike, Moyes, Forxst)
            if (char.currentType === 'special_projectile' && char.isAttacking && char.framesCurrent === 3) {
                if (!char.projectileThrown) {
                    char.projectileThrown = true
                    const direction = char.flipHorizontal ? -1 : 1
                    const velocity = { x: direction * 12, y: 0 }

                    // Use character's own sprite, row 5 (special), frame 4 (flying vinyl?) or similar
                    // If no specific projectile image is found, we use the character sprite
                    // assuming the animation contains the object.

                    const proj = new Projectile({
                        position: { x: char.position.x + (char.flipHorizontal ? 0 : 100), y: char.position.y + 30 },
                        velocity: velocity,
                        image: char.image,
                        framesMax: 8,
                        scale: char.scale,
                        owner: char,
                        framesRow: 5,
                        startFrame: 4 // Assuming frame 4 is the projectile looping frame
                    })
                    projectiles.push(proj)
                    safeAudio('playAttack')
                }
            } else if (char.currentType !== 'special_projectile') {
                char.projectileThrown = false
            }
        })

        // PVE & TOURNAMENT AI LOGIC
        if ((gameMode === 'PVE' || gameMode === 'TOURNAMENT') && enemy && player && !enemy.dead && !enemy.isKnockedBack) {
            try { updateAI(enemy, player) } catch (err) { }
        }

        // P1 Movement
        if (!player.isKnockedBack && !player.isDashing) {
            // ONLINE PROTECTION: Guest (P2) should NOT move P1 locally via keys
            // Only move if Network says so (Network generates keys too, but we trust local keys only for owner)
            let allowP1 = true
            if (gameMode === 'ONLINE' && window.networkManager && window.networkManager.playerIndex === 1) {
                // I am Guest. My local 'A'/'D' pressed should NOT move P1.
                // P1 moves only if 'A'/'D' came from Remote (Network).
                // keys.a.pressed is simple boolean. 
                // We need to trust the Input Stream.
                // Since handleOnlineInput dispatches events that set keys.*.pressed...
                // It's hard to distinguish source here without complex logic.
                // BUT: Guest typically uses Arrows. Hitting WASD locally does nothing if we mapped inputs correctly?
                // Let's just allow it for now, assuming Guest uses Arrows.
            }

            if (keys.a.pressed && player.lastKey === 'a' && !player.isBlocking) {
                player.velocity.x = -6
            } else if (keys.d.pressed && player.lastKey === 'd' && !player.isBlocking) {
                player.velocity.x = 6
            }
        }
    }

    // P2 Movement (Keyboard - PVP or ONLINE)
    if ((gameMode === 'PVP' || gameMode === 'ONLINE') && window.isRoundActive && !window.matchOver && !enemy.isKnockedBack && !enemy.isDashing) {
        if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
            enemy.velocity.x = -6
        } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
            enemy.velocity.x = 6
        }
    }

    // 3. UPDATE PHYSICS (DISABLE DRAWING)
    player.shouldDraw = false
    enemy.shouldDraw = false
    player.update()
    enemy.update()

    // PROJECTILES
    projectiles.forEach((proj, index) => {
        proj.update(proj.owner === player ? enemy : player)
        // Remove inactive
        if (!proj.active) {
            projectiles.splice(index, 1)
        }
    })

        // KO WALL BOUNCE LOGIC
        ;[player, enemy].forEach(char => {
            if (char.isDeadBounce) {
                // Check Wall Collision
                if (char.position.x <= 0 || char.position.x + char.width >= canvas.width) {
                    // WALL HIT!
                    if (!char.hasHitWall) {
                        char.hasHitWall = true
                        safeAudio('playKO') // Audio "KO" or Crack sound

                        // Visual Crack
                        const crack = document.createElement('img')
                        crack.src = './img/ko_crack.png'
                        crack.style.position = 'absolute'
                        crack.style.left = (char.position.x <= 0 ? '0px' : (canvas.width - 200) + 'px')
                        crack.style.top = (char.position.y - 50) + 'px'
                        crack.style.width = '200px'
                        crack.style.zIndex = '5'
                        crack.classList.add('shake-effect')
                        document.getElementById('gameScreen').appendChild(crack)

                        // Bounce
                        char.velocity.x = -char.velocity.x * 0.5
                        char.velocity.y = -5
                        char.switchSprite('death')
                    }
                }

                // Friction/Gravity handling is done by update()
                if (char.hasHitWall && char.velocity.y === 0) {
                    char.velocity.x = 0
                    char.isDeadBounce = false // Stop bouncing state
                }
            }
        })

    player.shouldDraw = true
    enemy.shouldDraw = true

    // 4. FACE EACH OTHER (FLIPPING)
    if (player.position.x < enemy.position.x) {
        player.flipHorizontal = false
        enemy.flipHorizontal = true
    } else {
        player.flipHorizontal = true
        enemy.flipHorizontal = false
    }

    // 5. COLLISIONS & HITS
    // Player hits Enemy
    // ONLINE AUTHORITY: Only Host (P1 Owner) checks P1 hits
    let checkP1Hit = true
    if (gameMode === 'ONLINE' && window.networkManager && window.networkManager.playerIndex !== 0) checkP1Hit = false

    if (
        checkP1Hit &&
        rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
        player.isAttacking &&
        !player.hasHit
    ) {
        player.hasHit = true
        const knockbackDir = enemy.position.x > player.position.x ? 1 : -1

        if (enemy.isBlocking) {
            enemy.health = Math.max(0, enemy.health - 2)
            enemy.position.x += knockbackDir * 20
            document.querySelector('#enemyHealth').style.width = (enemy.health / enemy.maxHealth * 100) + '%'
            safeAudio('playAttack')
        } else {
            const hitX = enemy.position.x + enemy.width / 2
            const hitY = enemy.position.y + enemy.height / 2
            createParticles(hitX, hitY, 'blood', 6)
            enemy.takeHit(player.currentDamage, player)
            player.energy = Math.min(100, player.energy + 10) // Gain Energy

            // ARCADE: Combo Logic P1
            player.comboCount++
            clearTimeout(comboTimer)
            comboEl.style.display = 'block'
            comboEl.innerText = player.comboCount + " HITS!"
            comboEl.style.color = '#ffeb3b' // Yellow for P1
            comboTimer = setTimeout(() => {
                player.comboCount = 0
                comboEl.style.display = 'none'
            }, 1000)

            // Hit Stop
            frameFreeze = 20 // Freeze for ~4 visual frames (since update runs 60Hz, maybe 5-6 frames?)

            document.querySelector('#enemyHealth').style.width = (enemy.health / enemy.maxHealth * 100) + '%'

            // Floating Text
            floatingTexts.push(new FloatingText({
                position: { x: enemy.position.x, y: enemy.position.y },
                text: "-" + player.currentDamage,
                color: '#ff0000'
            }))

            safeAudio('playHit')

            // Knockback
            enemy.isKnockedBack = true
            enemy.velocity.x = knockbackDir * 10
            enemy.velocity.y = -5

            // KO TRIGGER
            if (enemy.health <= 0) {
                enemy.isDeadBounce = true
                enemy.velocity.x = knockbackDir * 20 // Harder hit
                enemy.velocity.y = -8
                safeAudio('playKO')
            } else {
                setTimeout(() => { enemy.isKnockedBack = false }, 300)
            }
        }

        // SYNC HIT TO NETWORK
        if (gameMode === 'ONLINE' && window.networkManager) {
            window.networkManager.sendInput({
                type: 'hit_event',
                payload: {
                    target: 'P2',
                    damage: player.currentDamage,
                    isBlocking: enemy.isBlocking,
                    knockbackDir: knockbackDir
                }
            })
        }
    }

    // Enemy hits Player
    // ONLINE AUTHORITY: Only Guest (P2 Owner) checks P2 hits
    let checkP2Hit = true
    if (gameMode === 'ONLINE' && window.networkManager && window.networkManager.playerIndex !== 1) checkP2Hit = false

    if (
        checkP2Hit &&
        rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
        enemy.isAttacking &&
        !enemy.hasHit
    ) {
        enemy.hasHit = true
        const knockbackDir = player.position.x > enemy.position.x ? 1 : -1

        if (player.isBlocking) {
            player.health = Math.max(0, player.health - 2)
            player.position.x += knockbackDir * 20
            document.querySelector('#playerHealth').style.width = (player.health / player.maxHealth * 100) + '%'
            safeAudio('playAttack')
        } else if (player.isParrying) {
            // Parry Success
            player.takeHit(enemy.currentDamage, enemy)
            // No knockback, no damage, no blood.
        } else {
            // Normal Hit
            const hitX = player.position.x + player.width / 2
            const hitY = player.position.y + player.height / 2
            createParticles(hitX, hitY, 'blood', 6)

            player.takeHit(enemy.currentDamage, enemy)
            enemy.energy = Math.min(100, enemy.energy + 10)

            // ARCADE: Combo Logic P2
            enemy.comboCount++
            clearTimeout(comboTimer)
            comboEl.style.display = 'block'
            comboEl.innerText = enemy.comboCount + " HITS!"
            comboEl.style.color = '#00ffff' // Cyan for P2
            comboTimer = setTimeout(() => {
                enemy.comboCount = 0
                comboEl.style.display = 'none'
            }, 1000)

            frameFreeze = 20

            document.querySelector('#playerHealth').style.width = (player.health / player.maxHealth * 100) + '%'

            floatingTexts.push(new FloatingText({
                position: { x: player.position.x, y: player.position.y },
                text: "-" + enemy.currentDamage,
                color: '#ff0000'
            }))

            safeAudio('playHit')

            // Camera Shake
            const intensity = 5
            camera.x += (Math.random() - 0.5) * intensity
            camera.y += (Math.random() - 0.5) * intensity

            // Knockback
            player.isKnockedBack = true
            player.velocity.x = knockbackDir * 10
            player.velocity.y = -5

            // KO TRIGGER
            if (player.health <= 0) {
                player.isDeadBounce = true
                player.velocity.x = knockbackDir * 20 // Harder hit
                player.velocity.y = -8
                safeAudio('playKO')
            } else {
                setTimeout(() => { player.isKnockedBack = false }, 300)
            }
        }

        // SYNC HIT TO NETWORK
        if (gameMode === 'ONLINE' && window.networkManager) {
            window.networkManager.sendInput({
                type: 'hit_event',
                payload: {
                    target: 'P1',
                    damage: enemy.currentDamage,
                    isBlocking: player.isBlocking,
                    knockbackDir: knockbackDir
                }
            })
        }
    }

    // 6. UI & GAME STATE UPDATE
    const p1Energy = document.querySelector('#playerEnergy')
    const p2Energy = document.querySelector('#enemyEnergy')

    if (p1Energy) {
        p1Energy.style.width = Math.min(100, (player.energy / player.maxEnergy * 100)) + '%'
        p1Energy.style.backgroundColor = player.energy >= 100 ? 'red' : 'orange'
    }
    if (p2Energy) {
        p2Energy.style.width = Math.min(100, (enemy.energy / enemy.maxEnergy * 100)) + '%'
        p2Energy.style.backgroundColor = enemy.energy >= 100 ? 'red' : 'orange'
    }

    // End Game Check
    if ((enemy.health <= 0 || player.health <= 0) && window.isRoundActive) {
        window.isRoundActive = false
        // PROJECTILES UPDATE
        if (typeof projectiles !== 'undefined') {
            projectiles.forEach((projectile, index) => {
                if (projectile.active) {
                    projectile.update(projectile.owner === player ? enemy : player)
                } else {
                    projectiles.splice(index, 1)
                }
            })
        }
    }
}

window.determineWinner = function ({ player, enemy, p3, p4, timerId }) {
    if (timerId) clearTimeout(timerId)
    const timerEl = document.querySelector('#timer')
    if (timerEl) timerEl.innerHTML = '00'

    let resultText = ""
    let winner = null

    // TEAM BASED LOGIC (2V2_CHAOS)
    let p1TeamHealth = player.health + (p3 ? p3.health : 0)
    let p2TeamHealth = enemy.health + (p4 ? p4.health : 0)

    if (p1TeamHealth === p2TeamHealth) {
        resultText = 'REMIS'
    } else if (p1TeamHealth > p2TeamHealth) {
        resultText = (gameMode === '2V2_CHAOS') ? 'TEAM 1 WINS ROUND' : 'PLAYER 1 WINS ROUND'
        winner = player
        window.p1Wins++
        safeAudio('playSound', 'win')
    } else {
        resultText = (gameMode === 'PVE') ? 'CPU WINS ROUND' : (gameMode === '2V2_CHAOS' ? 'TEAM 2 WINS ROUND' : 'PLAYER 2 WINS ROUND')
        winner = enemy
        window.p2Wins++
        if (gameMode === 'PVE') safeAudio('playSound', 'lose')
    }

    // UPDATE PIPS UI
    const p1Pips = document.querySelectorAll('#p1Pips .round-pip')
    const p2Pips = document.querySelectorAll('#p2Pips .round-pip')

    for (let i = 0; i < window.p1Wins && i < p1Pips.length; i++) {
        p1Pips[i].classList.add('filled')
        p1Pips[i].style.background = '#ffeb3b' // Yellow
    }
    for (let i = 0; i < window.p2Wins && i < p2Pips.length; i++) {
        p2Pips[i].classList.add('filled')
        p2Pips[i].style.background = '#00ffff' // Cyan
    }

    // CHECK WIN CONDITION (Best of 3 -> First to 2)
    if (window.p1Wins >= 2 || window.p2Wins >= 2) {
        // MATCH OVER
        window.matchOver = true
        window.winningPlayer = winner

        if (window.p1Wins >= 2) resultText = (gameMode === 'PVE') ? 'YOU WIN!' : 'PLAYER 1 WINS MATCH!'
        if (window.p2Wins >= 2) resultText = (gameMode === 'PVE') ? 'GAME OVER' : 'PLAYER 2 WINS MATCH!'

        const goText = document.querySelector('#gameOverText')
        if (goText) goText.innerText = resultText
        const goMenu = document.querySelector('#gameOverMenu')
        if (goMenu) goMenu.style.display = 'flex'

        handleMatchEndAchievements(winner, player, enemy)
    } else {
        const overlay = document.getElementById('roundOverlay');
        const roundMsg = document.getElementById('roundMessage');

        if (overlay) overlay.style.display = 'flex';
        if (roundMsg) {
            roundMsg.innerText = resultText;
            roundMsg.style.display = 'block';
            roundMsg.style.fontSize = '40px';
        }

        setTimeout(() => {
            window.currentRound++;
            console.log(`[Combat] Transitioning to Round ${window.currentRound}`);

            if (overlay) overlay.style.display = 'none';

            if (typeof startRound === 'function') {
                startRound();
            } else {
                console.error("[Combat] startRound function missing!");
            }
        }, 3000);
    }
}

function handleMatchEndAchievements(winner, player, enemy) {
    if (window.achievementManager) {
        let isWin = (winner === player);
        let isLoss = (winner === enemy);

        // Skip tracking if Draw (winner is null)
        if (winner) {
            if (isWin) {
                window.achievementManager.trackEvent('fight_won', {
                    opponent: (gameMode === 'PVE') ? 'CPU' : 'PLAYER',
                    healthRemaining: player.health,
                    perfect: (player.health >= player.maxHealth),
                    moneyEarned: 100 // Track earned money for stats
                });

                // Money Reward
                if (window.collectionManager) {
                    // Reward Calculation
                    let reward = 100; // Base
                    if (gameMode === 'ONLINE') reward = 200; // Quick Match / Online
                    if (gameMode === 'TOURNAMENT') reward = 300; // Bonus for Tournament
                    if (gameMode === 'RPG_QUICK_MATCH') reward = 200; // RPG Quick Match Win

                    if (player.health >= player.maxHealth) reward += 50; // Perfect Bonus

                    window.collectionManager.updateMoney(reward);

                    floatingTexts.push(new FloatingText({
                        position: { x: player.position.x, y: player.position.y - 50 },
                        text: `+${reward} MK`,
                        color: 'gold',
                        size: 20
                    }));
                }

                // Respect Reward (RPG)
                if (window.statsManager) {
                    let respect = 25; // Base (Was 10)
                    if (gameMode === 'ONLINE') respect = 100; // User Request: 100 Respect for Quick Match
                    if (gameMode === 'TOURNAMENT') respect = 75;
                    if (player.health >= player.maxHealth) respect += 10;

                    window.statsManager.addRespect(respect);

                    setTimeout(() => {
                        floatingTexts.push(new FloatingText({
                            position: { x: player.position.x, y: player.position.y - 80 },
                            text: `+${respect} RESPECT`,
                            color: '#00ffff',
                            size: 16
                        }));
                    }, 500);
                }
            } else if (isLoss) {
                window.achievementManager.trackEvent('fight_lost', {
                    opponent: (gameMode === 'PVE') ? 'CPU' : 'PLAYER'
                });

                if (gameMode === 'RPG_QUICK_MATCH' && window.collectionManager) {
                    window.collectionManager.updateMoney(-50);
                    if (window.updateStats) window.updateStats();
                }

                // Respect Penalty
                if (window.statsManager) {
                    window.statsManager.addRespect(-10);
                    setTimeout(() => {
                        floatingTexts.push(new FloatingText({
                            position: { x: player.position.x, y: player.position.y - 80 },
                            text: `-10 RESPECT`,
                            color: '#ff0000',
                            size: 16
                        }));
                    }, 500);
                }

                // User Request: -50 MK on Loss in Quick Match
                if (window.collectionManager && gameMode === 'ONLINE') {
                    window.collectionManager.updateMoney(-50);

                    floatingTexts.push(new FloatingText({
                        position: { x: player.position.x, y: player.position.y - 50 },
                        text: `-50 MK`,
                        color: 'red',
                        size: 20
                    }));
                }
            }
        }
    }
}

// WEATHER SYSTEM (For "Zamek" Map)
const weatherSystem = {
    drops: [],
    isThundering: false,
    thunderTimer: 0
}

window.triggerKoEffect = function (x, y) {
    // 1. Play Sound
    safeAudio('playKo')

    // 2. Show Crack Visual
    const crackEl = document.getElementById('koCrack')
    if (crackEl) {
        // Center text on impact point
        // Note: x, y are canvas coordinates. DOM coordinates might need adjustment if canvas is scaled, 
        // but 'gameScreen' container usually matches canvas size approximately or is the parent.
        // Assuming x,y are relative to the game container (1024x576)

        // Random rotation for variety
        const rot = (Math.random() - 0.5) * 60;

        crackEl.style.left = (x - 150) + 'px' // Center 300px width
        crackEl.style.top = (y - 150) + 'px' // Center 300px height (or ground level)
        crackEl.style.transform = `rotate(${rot}deg) scale(0.5)` // Start small? Or just pop in.
        crackEl.style.display = 'block'

        // Animation pop
        requestAnimationFrame(() => {
            crackEl.style.transition = 'transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            crackEl.style.transform = `rotate(${rot}deg) scale(1.5)`
        })

        // Fade out after a few seconds? Or keep until next round?
        // Let's keep it until startRound resets UI.
    }

    // 3. Screen Shake Intense
    if (camera) {
        // Shake for 500ms
        let shakeDur = 20
        const shakeInt = setInterval(() => {
            shakeDur--
            camera.x = (Math.random() - 0.5) * 20
            camera.y = (Math.random() - 0.5) * 20
            if (shakeDur <= 0) {
                clearInterval(shakeInt)
                camera.x = 0
                camera.y = 0
            }
        }, 16)
    }
}

function updateAndDrawWeather() {
    // Only active on 'Zamek' (Map Index 19)
    if (!maps[mapIndex] || maps[mapIndex].name !== 'Zamek') {
        if (weatherSystem.windActive) {
            safeAudio('stopAmbient')
            weatherSystem.windActive = false
        }
        return
    }

    // Start Wind Loop if not active
    if (!weatherSystem.windActive) {
        safeAudio('startAmbient', 'wind')
        weatherSystem.windActive = true
    }

    // 1. RAIN
    // Add new drops
    if (weatherSystem.drops.length < 100) {
        weatherSystem.drops.push({
            x: Math.random() * canvas.width, // Screen space
            y: -20,
            len: Math.random() * 20 + 10,
            speed: Math.random() * 10 + 15
        })
    }

    c.save()
    c.strokeStyle = 'rgba(200, 200, 255, 0.4)'
    c.lineWidth = 2
    c.beginPath()
    for (let i = 0; i < weatherSystem.drops.length; i++) {
        let d = weatherSystem.drops[i]
        c.moveTo(d.x, d.y)
        c.lineTo(d.x - 5, d.y + d.len) // Slanted rain
        d.y += d.speed
        d.x -= 2 // Wind to left
        if (d.y > canvas.height) {
            weatherSystem.drops.splice(i, 1)
            i--
        }
    }
    c.stroke()
    c.restore()

    // 2. THUNDER FLASH
    // Random chance (approx every 5-10 seconds)
    if (Math.random() < 0.003) {
        weatherSystem.isThundering = true
        safeAudio('playThunder')
        setTimeout(() => weatherSystem.isThundering = false, 150)
    }

    if (weatherSystem.isThundering) {
        c.fillStyle = 'rgba(255, 255, 255, 0.5)' // Flash overlay
        c.fillRect(0, 0, canvas.width, canvas.height)
    }
}

function drawScene() {
    c.fillStyle = 'black'
    if (background && background.isGif) {
        c.clearRect(0, 0, canvas.width, canvas.height)
    } else {
        c.fillRect(0, 0, canvas.width, canvas.height)
    }

    // ARCADE: Apply Zoom
    c.save()
    let targetScale = 1
    let targetX = 0
    let targetY = 0

    if (window.matchOver && window.winningPlayer) {
        targetScale = 2.0
        if (!zoomSoundPlayed) {
            safeAudio('playSound', 'close')
            zoomSoundPlayed = true
        }
        const focusX = window.winningPlayer.position.x + 75
        const focusY = window.winningPlayer.position.y + 75
        targetX = (canvas.width / 2) - (focusX * targetScale)
        targetY = (canvas.height / 2) - (focusY * targetScale)
    }

    camera.scale += (targetScale - camera.scale) * 0.05
    camera.x += (targetX - camera.x) * 0.05
    camera.y += (targetY - camera.y) * 0.05

    if (camera.scale > 1.01) {
        c.translate(camera.x, camera.y)
        c.scale(camera.scale, camera.scale)
    }

    if (!background.isGif) {
        background.update() // Backgrounds are visual, acceptable to run in draw loop (or could move to physics)
    }
    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0, canvas.height - 96, canvas.width, 96)

    // DRAW PLAYERS (Manual Draw Call because update() was silent)
    player.draw()
    enemy.draw()

    // PARTICLES (Visuals - keep in Draw loop or move to Physics? Keep here for 60fps smoothing if monitor is 144)
    // Actually, particles have velocity. Ideally update in Physics. 
    // But for now, let's update them here to avoid complexity
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) particles.splice(index, 1)
        else particle.update()
    })
    floatingTexts.forEach((text, index) => {
        if (text.alpha <= 0 || text.lifeTime <= 0) floatingTexts.splice(index, 1)
        else text.update()
    })

    // PROJECTILES (Draw them here)
    if (typeof projectiles !== 'undefined') {
        projectiles.forEach(proj => {
            if (proj.active) proj.draw()
        })
    }

    c.restore()

    // Draw Weather (Screen Space)
    updateAndDrawWeather()
}

function animate() {
    if (!gameStarted) return

    // If Phaser is handling the combat, we don't need the legacy loop
    // unless we want to keep some overlays from it. 
    // For now, let's stop it to save performance and avoid errors.
    if (window.phaserGame && window.phaserGame.isRunning) return;

    window.requestAnimationFrame(animate)

    // HIT STOP (Visual Freeze)
    if (frameFreeze > 0) {
        frameFreeze--
        return
    }

    // SIMPLE LOOP: Always run Logic + Draw once per frame
    // Fixes "unplayable lag" caused by loop issues.
    updatePhysics()
    drawScene()
}
// (Orphans cleaned 2)

// (Final cleanup)

// AI DIFFICULTY LEVELS
window.aiDifficulty = 'KASZTAN' // Default
// Levels: 'KASZTAN' (Easy), 'OGOR' (Normal), 'CHUCKNORRIS' (Hard)

function updateAI(ai, opponent) {
    if (!window.isRoundActive) return // Don't move if round hasn't started
    if (ai.dead || opponent.dead) return
    if (gameMode === 'TRAINING') return // TRAINING: AI does not move

    // AI Variables
    const dx = opponent.position.x - ai.position.x
    const dist = Math.abs(dx)

    // DIFFICULTY PARAMETERS
    let speed = 3
    let attackChance = 0.02
    let jumpChance = 0.002
    let reactionChance = 0.02
    let blockChance = 0.0 // New
    let superChance = 0.0 // New

    if (window.aiDifficulty === 'OGOR') {
        speed = 4
        attackChance = 0.05
        jumpChance = 0.01
        reactionChance = 0.1
        blockChance = 0.2
    } else if (window.aiDifficulty === 'CHUCKNORRIS') {
        speed = 5.5
        attackChance = 0.15 // Slightly less spammy but smarter
        jumpChance = 0.05
        reactionChance = 1.0 // Instant reaction (Cheating)
        blockChance = 0.9
        superChance = 0.8
    }

    // Input Reading Cheat for Chuck Norris
    // If player attacks and is close, instantly block
    if (window.aiDifficulty === 'CHUCKNORRIS' && opponent.isAttacking && dist < 200) {
        if (Math.random() < blockChance) ai.isBlocking = true
    }

    // 0. RESET STATE (Release Block if safe)
    if (ai.isBlocking) {
        // If opponent stopped attacking OR is far away, release block
        if (!opponent.isAttacking || dist > 250) {
            if (Math.random() < 0.1) ai.isBlocking = false
        }
        return // Don't do other things while blocking (hold it)
    }

    // 1. SUPER ATTACK (Chuck Logic)
    if (window.aiDifficulty === 'CHUCKNORRIS' && ai.energy >= 100 && dist < 200) {
        if (Math.random() < superChance) {
            ai.superAttack()
            return
        }
    }

    // 2. DEFENSE (Blocking)
    if (opponent.isAttacking && dist < 250) {
        // React to attack
        if (Math.random() < blockChance) {
            ai.isBlocking = true
            ai.velocity.x = 0
            ai.switchSprite('block') // Ensure visual update if needed
            return
        }
        // Dodge Logic (Backup)
        if (window.aiDifficulty === 'CHUCKNORRIS' && Math.random() < 0.3) {
            ai.velocity.x = (dx > 0) ? -8 : 8
            return
        }
    }

    // 3. APPROACH OPPONENT
    if (dist > 100) {
        // Move towards
        if (dx > 0) {
            ai.velocity.x = speed
            ai.switchSprite('run')
            ai.lastKey = 'ArrowRight'
        } else {
            ai.velocity.x = -speed
            ai.switchSprite('run')
            ai.lastKey = 'ArrowLeft'
        }
    } else {
        // Close distance
        ai.velocity.x = 0
        ai.switchSprite('idle')

        // Attack Aggressively
        if (Math.random() < attackChance) {
            if (window.aiDifficulty === 'CHUCKNORRIS') {
                // Combo Logic
                const r = Math.random()
                if (r < 0.33) ai.attack()
                else if (r < 0.66) ai.attack2()
                else ai.attack()
            } else {
                if (Math.random() < 0.5) ai.attack()
                else ai.attack2()
            }
        }
    }

    // 4. JUMPING
    if (ai.velocity.y === 0) {
        // Jump randomly or reactively
        if (Math.random() < jumpChance || (opponent.velocity.y < 0 && Math.random() < reactionChance)) {
            ai.velocity.y = -16
        }
    }
}

// SOFT RESET TO MAIN MENU
function returnToMenu() {
    gameStarted = false
    clearTimeout(window.timerId) // Stop Game Timer
    window.inputLocked = false // Reset Input Lock

    // Hide Game UI
    const gameUI = ['gameOverMenu', 'gameScreen', 'roundOverlay', 'displayText', 'comboCounter', 'escOverlay', 'tournamentScreen'];
    gameUI.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // Clear Visual Effects
    if (typeof floatingTexts !== 'undefined') floatingTexts.length = 0
    if (typeof particles !== 'undefined') particles.length = 0
    frameFreeze = 0

    // Reset Fighters
    window.matchOver = false
    window.winningPlayer = null
    zoomSoundPlayed = false
    camera = { x: 0, y: 0, scale: 1 }

    if (player) {
        player.dead = false
        player.health = player.maxHealth
        const hp1 = document.querySelector('#playerHealth');
        if (hp1) hp1.style.width = '100%';
    }
    if (enemy) {
        enemy.dead = false
        enemy.health = enemy.maxHealth
        const hp2 = document.querySelector('#enemyHealth');
        if (hp2) hp2.style.width = '100%';
    }

    // Reset Selection State
    p1Confirmed = false
    p2Confirmed = false
    mapSelectionActive = false

    // PHASER CLEANUP
    window.usePhaserCombat = false
    if (window.phaserGame) {
        window.phaserGame.destroy(true);
        window.phaserGame = null;
    }

    // Standard Return
    showMainMenu()
}

// ==========================================
// MOBILE CONTROLS IMPLEMENTATION
// ==========================================

// Prevent context menu on long press (Important for mobile controls)
window.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};

// Helper to trigger key events (Local & Mobile)
function triggerKey(key, type) {
    const keyData = {
        'w': { keyCode: 87, code: 'KeyW' },
        'a': { keyCode: 65, code: 'KeyA' },
        's': { keyCode: 83, code: 'KeyS' },
        'd': { keyCode: 68, code: 'KeyD' },
        ' ': { keyCode: 32, code: 'Space' },
        'c': { keyCode: 67, code: 'KeyC' },
        'v': { keyCode: 86, code: 'KeyV' },
        'arrowup': { keyCode: 38, code: 'ArrowUp' },
        'arrowdown': { keyCode: 40, code: 'ArrowDown' },
        'arrowleft': { keyCode: 37, code: 'ArrowLeft' },
        'arrowright': { keyCode: 39, code: 'ArrowRight' },
        'enter': { keyCode: 13, code: 'Enter' },
        'escape': { keyCode: 27, code: 'Escape' },
        'i': { keyCode: 73, code: 'KeyI' },
        'o': { keyCode: 79, code: 'KeyO' },
        'u': { keyCode: 85, code: 'KeyU' }
    };

    const data = keyData[key.toLowerCase()] || {};
    const event = new KeyboardEvent(type, {
        key: key,
        keyCode: data.keyCode || 0,
        which: data.keyCode || 0,
        code: data.code || '',
        bubbles: true,
        cancelable: true
    });

    window.dispatchEvent(event);
    _triggerPhaserKey(event, type);
}

// Internal helper for Phaser Input Engine (Forces Phaser to see emulated events)
function _triggerPhaserKey(event, type) {
    if (window.phaserGame && window.phaserGame.input && window.phaserGame.input.keyboard) {
        const manager = window.phaserGame.input.keyboard;
        try {
            if (type === 'keydown' && typeof manager.onKeyDown === 'function') {
                manager.onKeyDown(event);
            } else if (type === 'keyup' && typeof manager.onKeyUp === 'function') {
                manager.onKeyUp(event);
            }
        } catch (err) {
            console.warn("[Phaser Input Fix] Failed to inject key:", err);
        }
    }
}

// Touch Handlers for D-Pad and Actions
function setupTouchControls(buttons) {
    if (!buttons) return;
    buttons.forEach(btn => {
        const key = btn.getAttribute('data-key')

        const startHandler = (e) => {
            e.preventDefault() // Prevent scrolling/zooming
            triggerKey(key, 'keydown')
            btn.style.filter = 'brightness(1.5)' // Visual feedback
            btn.style.transform = 'translateY(2px)'
        }

        const endHandler = (e) => {
            e.preventDefault()
            triggerKey(key, 'keyup')
            btn.style.filter = '' // Reset visual
            btn.style.transform = ''
        }

        btn.addEventListener('touchstart', startHandler, { passive: false })
        btn.addEventListener('touchend', endHandler, { passive: false })
        btn.addEventListener('mousedown', startHandler) // For mouse testing
        btn.addEventListener('mouseup', endHandler)
    })
}

window.addEventListener('DOMContentLoaded', () => {
    const mobileControls = document.getElementById('mobile-controls')
    const mobileToggle = document.getElementById('mobile-toggle')
    const dpadButtons = document.querySelectorAll('.dpad-btn')
    const actionButtons = document.querySelectorAll('.action-btn')
    const startBtn = document.getElementById('startButton')

    if (mobileToggle && mobileControls) {
        mobileToggle.addEventListener('click', () => {
            if (mobileControls.style.display === 'none') {
                mobileControls.style.display = 'flex'
            } else {
                mobileControls.style.display = 'none'
            }
        })
    }

    if (startBtn) {
        startBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            goToMapSelection();
        }, { passive: false });
    }

    if (dpadButtons.length > 0) setupTouchControls(dpadButtons)
    if (actionButtons.length > 0) setupTouchControls(actionButtons)
})


// ==========================================
// MOUSE / TOUCH SUPPORT FOR MENUS
// ==========================================

// 1. MAIN MENU INTERACTION
const menuOptions = document.querySelectorAll('.menu-option')
menuOptions.forEach(option => {
    option.addEventListener('click', () => {
        const index = parseInt(option.getAttribute('data-index'))
        mainMenuIndex = index
        updateMainMenuVisuals()
        handleMainMenuSelection()
    })

    // Add hover visual update
    option.addEventListener('mouseenter', () => {
        const index = parseInt(option.getAttribute('data-index'))
        if (mainMenuIndex !== index) {
            mainMenuIndex = index
            updateMainMenuVisuals()
        }
    })
})

// 2. CHARACTER SELECTION INTERACTION
// (Implemented inside createCharacterButton function logic below)
// We need to overwrite the createCharacterButton function or modify it. 
// Since we can't overwrite easily in this append, we will fix it in the next step by replacing the function definition.



// ESC BUTTON HANDLER
const escBtn = document.getElementById('globalEscBtn')
if (escBtn) {
    escBtn.style.display = 'block'
    escBtn.addEventListener('click', () => {
        returnToMenu()
    })
}

// CONTROLS BACK BUTTON
const controlsBackBtn = document.getElementById('controlsBackBtn')
if (controlsBackBtn) {
    controlsBackBtn.addEventListener('click', () => {
        controlsActive = false
        document.getElementById('controlsScreen').style.display = 'none'
    })
}

// ==========================================
// RAP NEWS TICKER LOGIC
// ==========================================
const newsTickerBar = document.getElementById('newsTickerBar')
const newsClock = document.getElementById('newsClock')
const newsContent = document.getElementById('newsContent')

const newsItems = [
    "NOWE POSTACIE: WUWUNIO, MATEUSZ NATALI, WARGA WKRACZAJĄ DO GRY!",
    "GOŚCIE SPECJALNI: WACO, BOBER, ADI NOWAK, JAN-RAPOWANIE I INNI!",
    "RETRO RAP BATTLES - NAJLEPSZA GRA O POLSKIM RAPIE!",
    "WKRÓTCE TRYB ETAPÓW (KARIERA)!",
    "DODANO MULTIPLAYER ONLINE - GRAJ Z KUMPLAMI!",
    "SPRAWDŹ STATYSTYKI W MENU GŁÓWNYM!"
]

function updateTickerContent() {
    if (!newsContent) return
    let index = 0
    newsContent.innerText = newsItems[0]

    setInterval(() => {
        index = (index + 1) % newsItems.length
        newsContent.style.opacity = 0
        setTimeout(() => {
            newsContent.innerText = newsItems[index]
            newsContent.style.opacity = 1
        }, 500)
    }, 5000)
}

function initTicker() {
    if (!newsTickerBar) return

    // Show ticker only in menus? Or always? User said "Main Menu".
    // We will control visibility in showMainMenu() and others.

    updateTickerContent()
    setInterval(updateTickerClock, 1000)
    updateTickerClock()
}

function updateTickerClock() {
    if (!newsClock) return
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    newsClock.innerText = `${hours}:${minutes} | ${day}.${month}`
}


// STATS LOGIC
const statsScreen = document.getElementById('statsScreen')
const icebergList = document.getElementById('icebergList')

function showStatsScreen() {
    menuScreen.style.display = 'none'
    mainMenuScreen.style.display = 'none'
    if (typeof settingsScreen !== 'undefined') settingsScreen.style.display = 'none'
    if (typeof creditsScreen !== 'undefined') creditsScreen.style.display = 'none'
    if (newsTickerBar) newsTickerBar.style.display = 'none' // Hide ticker to focus
    statsScreen.style.display = 'flex'

    renderIceberg()

    window.addEventListener('keydown', handleStatsKeys)
}

function handleStatsKeys(e) {
    if (e.key.toLowerCase() === 'escape' || e.key === 'Backspace') {
        e.stopPropagation()
        window.removeEventListener('keydown', handleStatsKeys)
        statsScreen.style.display = 'none'
        showMainMenu()
    }
}

function renderIceberg() {
    const sm = window.statsManager
    if (!sm) return
    icebergList.innerHTML = ''
    icebergList.style.display = 'flex'
    icebergList.style.flexDirection = 'column'
    icebergList.style.alignItems = 'center'
    icebergList.style.gap = '20px'
    icebergList.style.width = '100%'

    // 1. HEADER
    const header = document.createElement('h2')
    header.innerText = "STATYSTYKI (OD 04.02.2026)"
    header.style.color = '#00ff00'
    header.style.marginBottom = '20px'
    icebergList.appendChild(header)

    // 2. DATA SUMMARY
    const data = sm.getIcebergData()
    const container = document.createElement('div')
    container.style.border = '2px solid #555'
    container.style.padding = '20px'
    container.style.backgroundColor = 'rgba(0,0,0,0.8)'
    container.style.textAlign = 'center'
    container.style.lineHeight = '2'
    container.style.minWidth = '400px'

    const total = sm.stats.totalMatches || 0
    const mostPicked = data.length > 0 ? `${data[0].name} (${data[0].picks})` : '-'
    const leastPicked = data.length > 0 ? `${data[data.length - 1].name} (${data[data.length - 1].picks})` : '-'

    container.innerHTML = `
        <div style="color:white; font-size:16px;">MECZE ROZEGRANE: <span style="color:#00ffff">${total}</span></div>
        <div style="color:white; font-size:14px; margin-top:10px;">NAJCZESCIEJ WYBIERANA:</div>
        <div style="color:#ff0055; font-size:18px;">${mostPicked}</div>
        <div style="color:white; font-size:14px; margin-top:10px;">NAJRZADZIEJ WYBIERANA:</div>
        <div style="color:#aaaaaa; font-size:16px;">${leastPicked}</div>
    `
    icebergList.appendChild(container)

    // 3. ACTION BUTTONS
    const btnContainer = document.createElement('div')
    btnContainer.style.display = 'flex'
    btnContainer.style.gap = '20px'
    btnContainer.style.marginTop = '20px'

    // BACK BUTTON (Target of user request)
    const btnBack = document.createElement('div')
    btnBack.innerText = "WRÓĆ DO MENU"
    btnBack.className = 'menu-option'
    btnBack.style.padding = '10px 20px'
    btnBack.style.cursor = 'pointer'
    btnBack.style.color = 'white'
    btnBack.onclick = () => {
        document.getElementById('statsScreen').style.display = 'none'
        showMainMenu()
        safeAudio('playNav')
    }
    btnContainer.appendChild(btnBack)

    icebergList.appendChild(btnContainer)
}


function updateTickerContent() {
    if (!newsContent) return

    // Default messages
    const mainMenuList = [
        'START',
        'ONLINE (BETA)',
        'STATYSTYKI',
        'USTAWIENIA',
        'AUTORZY'
    ]
    const infoMessages = [
        "WITAMY W RETRO RAP BATTLE!",
        "GRA STWORZONA W CELACH HUMORYSTYCZNYCH",
        "DODANO NOWE POSTACIE I MAPY",
    ]

    let message = ""

    // RADIO PODZIEMIE OVERRIDE
    let radioSnippet = ""
    if (audioManager && typeof audioManager.getCurrentTrackInfo === 'function') {
        const trackInfo = audioManager.getCurrentTrackInfo()
        if (trackInfo) {
            const spotifyLink = trackInfo.spotifyUrl ? `<a href="${trackInfo.spotifyUrl}" target="_blank" style="color:#1DB954; text-decoration:none; margin-left:10px; border:1px solid #1DB954; padding:2px 5px; font-size:10px; border-radius:3px;">SPOTIFY 🎧</a>` : ""
            radioSnippet = `📻 TERAZ GRA: ${trackInfo.title.toUpperCase()} ${spotifyLink} >>> `
        } else {
            radioSnippet = `📻 RADIO STOP (KLIKNIJ PLAY) >>> `
        }
    }

    // Check if gameQuotes loaded
    if (typeof gameQuotes !== 'undefined' && gameQuotes.length > 0) {
        // Pick random verse
        const randomVerse = gameQuotes[Math.floor(Math.random() * gameQuotes.length)]
        // Pick random info
        const randomInfo = infoMessages[Math.floor(Math.random() * infoMessages.length)]

        // BORN TODAY LOGIC
        const getBirthdayPerson = () => {
            const today = new Date()
            const d = today.getDate()
            const m = today.getMonth() + 1
            const key = `${d}.${m}`

            // Data source (Limited set + placeholders)
            // Note: This is a static list for demo purposes.
            const birthdays = {
                '25.1': 'Volodymyr Zelenskyy', // 25 Jan
                '26.1': 'José Mourinho',
                '27.1': 'Wolfgang Amadeus Mozart',
                '28.1': 'Elijah Wood',
                '29.1': 'Oprah Winfrey',
                '30.1': 'Christian Bale',
                '31.1': 'Justin Timberlake',
                '1.2': 'Harry Styles',
                '2.2': 'Shakira',
                '3.2': 'Daddy Yankee',
                '4.2': 'Alice Cooper',
                '5.2': 'Cristiano Ronaldo',
                '6.2': 'Bob Marley',
                '7.2': 'Ashton Kutcher',
                '8.2': 'John Williams',
                '9.2': 'Joe Pesci',
                '10.2': 'Chloë Grace Moretz',
            }

            return birthdays[key] || "Nieznany Bohater"
        }

        const birthdayPerson = getBirthdayPerson()
        const birthdayMsg = birthdayPerson !== "Nieznany Bohater" ? ` >>> DZIS URODZIL SIE: ${birthdayPerson.toUpperCase()}` : ""

        message = `>>> ${radioSnippet}${randomInfo} >>> CYTAT NA DZIS: "${randomVerse}"${birthdayMsg} >>> MILEGO GRANIA!`
    } else {
        message = `>>> ${radioSnippet}+++ 2020 FIGHTERS +++ LOADING... +++`
    }

    // For clickable links in ticker, we need to use innerHTML
    newsContent.innerHTML = message + " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; " + message
}

// Init
// Init
initTicker()

// Define showMainMenu properly
window.showMainMenu = function () {
    gameStarted = false
    window.matchOver = false
    window.isRoundActive = false
    mainMenuActive = true
    optionsActive = false
    controlsActive = false
    remappingState = null

    // Ensure all screens are hidden
    const screens = [
        'statsScreen', 'menuScreen', 'mapSelectionScreen',
        'gameScreen', 'controlsScreen', 'onlineScreen',
        'gameOverMenu', 'introScreen', 'roundOverlay', 'escOverlay',
        'tournamentScreen', 'optionsScreen', 'sideSelectionScreen', 'playerMenuScreen'
    ]
    screens.forEach(id => {
        const el = document.getElementById(id)
        if (el) el.style.display = 'none'
    })

    // Show Main Menu
    if (typeof mainMenuScreen !== 'undefined') mainMenuScreen.style.display = 'flex'

    // Restore UI visible after combat
    const uiToRestore = ['topRightUI', 'profileDisplay'];
    uiToRestore.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('combat-hidden');
    });

    // Ticker Logic
    if (typeof newsTickerBar !== 'undefined' && newsTickerBar) newsTickerBar.style.display = 'flex'

    // Music - Stop regular menu music but allow Radio to continue if playing
    if (typeof audioManager !== 'undefined') {
        if (audioManager.currentMusicType !== 'radio') {
            safeAudio('stopMusic')
        }
    }
}

window.aiDifficulty = 'KASZTAN'; // Default
function setDifficulty(level) {
    window.aiDifficulty = level;
    console.log("DIFFICULTY SET TO:", level);

    // Update buttons Visuals
    const btnKasztan = document.getElementById('btnKasztan');
    const btnOgor = document.getElementById('btnOgor');
    const btnChuck = document.getElementById('btnChuck');

    if (btnKasztan) {
        btnKasztan.style.background = (level === 'KASZTAN') ? '#00ff00' : '#555';
        btnKasztan.style.color = (level === 'KASZTAN') ? 'black' : '#aaa';
    }
    if (btnOgor) {
        btnOgor.style.background = (level === 'OGOR') ? '#00ff00' : '#555';
        btnOgor.style.color = (level === 'OGOR') ? 'black' : '#aaa';
    }
    if (btnChuck) {
        btnChuck.style.background = (level === 'CHUCKNORRIS') ? '#ff0000' : '#555';
        btnChuck.style.color = (level === 'CHUCKNORRIS') ? 'white' : '#aaa';
    }
    safeAudio('playNav');
}



// Global Ticker Visibility Watcher (Backup)
setInterval(() => {
    if (typeof gameScreen !== 'undefined' && gameScreen.style.display !== 'none') {
        if (typeof newsTickerBar !== 'undefined' && newsTickerBar) newsTickerBar.style.display = 'none'
    } else if ((typeof mainMenuScreen !== 'undefined' && mainMenuScreen.style.display !== 'none') ||
        (typeof menuScreen !== 'undefined' && menuScreen.style.display !== 'none')) {
        if (typeof newsTickerBar !== 'undefined' && newsTickerBar) newsTickerBar.style.display = 'flex'
    }
}, 1000)


// ==========================================
// MAIN MENU LOGIC HELPER FUNCTIONS
// ==========================================

function updateMainMenuVisuals() {
    const options = document.querySelectorAll('.menu-option')
    options.forEach((opt) => {
        const index = parseInt(opt.getAttribute('data-index'))
        if (index === mainMenuIndex) {
            opt.classList.add('selected')
        } else {
            opt.classList.remove('selected')
        }
    })
}

function handleMainMenuSelection() {
    // MAIN MENU INDICES (Updated):
    // 0: P1 vs P2
    // 1: P1 vs CPU
    // 2: PVE Tournament
    // 3: Online Lobby
    // 4: Quick Match (Random)
    // 5: 2v2 Chaos
    // 6: OPCJE (Settings)
    // 7: Fullscreen

    if (mainMenuIndex === 0) {
        gameMode = 'PVP'; showCharSelect()
    } else if (mainMenuIndex === 1) {
        gameMode = 'PVE'; showCharSelect()
    } else if (mainMenuIndex === 2) {
        gameMode = 'TOURNAMENT'; startTournamentSetup()
    } else if (mainMenuIndex >= 3 && mainMenuIndex <= 5) {
        // ONLINE MODES
        mainMenuActive = false
        document.getElementById('mainMenuScreen').style.display = 'none'
        document.getElementById('onlineScreen').style.display = 'flex'

        if (mainMenuIndex === 3) {
            // Lobby
            document.getElementById('onlineLobbySection').style.display = 'flex'
            document.getElementById('onlineQuickMatchSection').style.display = 'none'
        } else if (mainMenuIndex === 4) {
            // Quick Match
            gameMode = 'ONLINE'
            document.getElementById('onlineLobbySection').style.display = 'none'
            document.getElementById('onlineQuickMatchSection').style.display = 'block'
            if (document.getElementById('findMatchBtn')) document.getElementById('findMatchBtn').style.display = 'none'
            if (document.getElementById('matchStatus')) {
                document.getElementById('matchStatus').style.display = 'block'
                document.getElementById('matchStatus').innerText = "SZUKAM PRZECIWNIKA..."
            }
            if (window.networkManager) setTimeout(() => { window.networkManager.findMatch() }, 500)
        } else if (mainMenuIndex === 5) {
            // 2v2 Chaos Lobby
            gameMode = '2V2_CHAOS';
            document.getElementById('onlineLobbySection').style.display = 'flex'
            document.getElementById('onlineQuickMatchSection').style.display = 'none'
        }
        if (window.networkManager) window.networkManager.connect()
    } else if (mainMenuIndex === 6) {
        // OPCJE
        showOptionsScreen()
    } else if (mainMenuIndex === 7) {
        // FULLSCREEN
        if (!document.fullscreenElement) {
            const fs = document.documentElement.requestFullscreen();
            if (fs && fs.catch) {
                fs.catch(err => {
                    console.log(`Fullscreen error: ${err.message}`);
                });
            }
        } else {
            document.exitFullscreen();
        }
    } else if (mainMenuIndex === 8) {
        // TRAINING (TRENING)
        gameMode = 'TRAINING';
        showCharSelect();
    } else if (mainMenuIndex === 9) {
        // INFO
        mainMenuActive = false;
        const info = document.getElementById('infoScreen');
        if (info) info.style.display = 'flex';
    }
}

function closeInfoScreen() {
    const info = document.getElementById('infoScreen');
    if (info) info.style.display = 'none';
    mainMenuActive = true;
}

// Global hotkey for Info Screen (ESC/Backspace)
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'escape' || key === 'backspace') {
        const info = document.getElementById('infoScreen');
        if (info && info.style.display === 'flex') {
            closeInfoScreen();
            e.stopPropagation();
        }
    }
});

function showOptionsScreen() {
    mainMenuActive = false
    optionsActive = true
    document.getElementById('mainMenuScreen').style.display = 'none'
    const optionsScreen = document.getElementById('optionsScreen')
    if (optionsScreen) {
        optionsScreen.style.display = 'flex'
        initOptionsUI()
    } else alert("Opcje będą dostępne wkrótce!")
}

function initOptionsUI() {
    const volSlider = document.getElementById('volumeSlider')
    if (volSlider) {
        volSlider.value = window.config.volume
        volSlider.oninput = (e) => {
            window.config.volume = parseFloat(e.target.value)
            applyVolume()
            localStorage.setItem('fg_config_v2', JSON.stringify(window.config))
        }
    }
    updateOptionsUI()
}

function applyVolume() {
    if (typeof audioManager !== 'undefined') {
        audioManager.volume = window.config.volume
    }
}

function updateOptionsUI() {
    const p1Cont = document.getElementById('p1KeysContainer')
    const p2Cont = document.getElementById('p2KeysContainer')
    if (!p1Cont || !p2Cont) return

    const actions = ['up', 'left', 'down', 'right', 'punch', 'kick', 'super', 'special', 'taunt']
    const labels = {
        up: 'GORA', left: 'LEWO', down: 'DOL', right: 'PRAWO',
        punch: 'CIOS', kick: 'KOP',
        super: 'SUPER', special: 'RZUT', taunt: 'TAUNT'
    }

    p1Cont.innerHTML = ''
    p2Cont.innerHTML = ''

    actions.forEach(act => {
        // P1
        let p1Key = window.config.p1[act].toUpperCase()
        if (p1Key === ' ') p1Key = 'SPACE'
        const p1Row = `<div>${labels[act]}</div><div class="key-bind ${remappingState && remappingState.p === 'p1' && remappingState.a === act ? 'waiting' : ''}" onclick="startRemap('p1', '${act}')">${p1Key}</div>`
        p1Cont.innerHTML += p1Row

        // P2
        let p2Key = window.config.p2[act].toUpperCase()
        if (p2Key === ' ') p2Key = 'SPACE'
        const p2Row = `<div>${labels[act]}</div><div class="key-bind ${remappingState && remappingState.p === 'p2' && remappingState.a === act ? 'waiting' : ''}" onclick="startRemap('p2', '${act}')">${p2Key}</div>`
        p2Cont.innerHTML += p2Row
    })
}

window.startRemap = function (player, action) {
    if (remappingState) return // Already remapping
    remappingState = { p: player, a: action }
    document.getElementById('remapStatus').innerText = `NACISNIJ NOWY KLAWISZ DLA ${player.toUpperCase()} ${action.toUpperCase()}... (ESC ANULUJE)`
    updateOptionsUI()

    // Add temporary listener
    const remapHandler = (e) => {
        e.preventDefault()
        e.stopPropagation()

        const key = e.key.toUpperCase()

        // Cancel
        if (key === 'ESCAPE') {
            remappingState = null
            document.getElementById('remapStatus').innerText = "KLIKNIJ PRZYCISK ABY ZMIENIC KLAWISZ"
            updateOptionsUI()
            window.removeEventListener('keydown', remapHandler, true)
            return
        }

        // Accept valid key (avoid some system keys if needed, but let's be open)
        // Store
        window.config[remappingState.p][remappingState.a] = (key === ' ') ? 'SPACE' : key

        // Save
        localStorage.setItem('fg_config_v2', JSON.stringify(window.config))

        // Reset
        remappingState = null
        document.getElementById('remapStatus').innerText = "KLAWISZ ZAPISANY!"
        updateOptionsUI()

        window.removeEventListener('keydown', remapHandler, true)
    }

    window.addEventListener('keydown', remapHandler, true)
}

function showCharSelect() {
    mainMenuActive = false
    document.getElementById('mainMenuScreen').style.display = 'none'
    document.getElementById('menuScreen').style.display = 'flex'

    // SAFETY: Hide Online Screens
    document.getElementById('onlineScreen').style.display = 'none'
    if (document.getElementById('onlineLobbySection')) document.getElementById('onlineLobbySection').style.display = 'none'
    if (document.getElementById('onlineQuickMatchSection')) document.getElementById('onlineQuickMatchSection').style.display = 'none'

    if (typeof statsScreen !== 'undefined') statsScreen.style.display = 'none'

    // CRITICAL: Hide RPG/City Screens to prevent z-index overlap with character selection
    if (document.getElementById('playerMenuScreen')) document.getElementById('playerMenuScreen').style.display = 'none';
    if (document.getElementById('cityScreen')) document.getElementById('cityScreen').style.display = 'none';
    if (document.getElementById('introScreen')) document.getElementById('introScreen').style.display = 'none';

    // Reset Selection
    p1Index = 0
    p2Index = 1
    p1SubIndex = null
    p2SubIndex = null
    p1Confirmed = false
    p2Confirmed = false
    p1SubConfirmed = false
    p2SubConfirmed = false

    // Hide everything else
    const screens = [
        'statsScreen', 'mapSelectionScreen', 'gameScreen',
        'controlsScreen', 'onlineScreen', 'tournamentScreen',
        'gameOverMenu', 'introScreen', 'roundOverlay'
    ]
    screens.forEach(id => {
        const el = document.getElementById(id)
        if (el) el.style.display = 'none'
    })

    updateMenuVisuals()

    // DIFFICULTY UI TOGGLE
    const diffDiv = document.getElementById('difficultySelect')
    if (diffDiv) {
        if (gameMode === 'PVE') {
            diffDiv.style.display = 'flex'
            // Ensure visual state matches current difficulty
            if (typeof window.setDifficulty === 'function') window.setDifficulty(window.aiDifficulty || 'KASZTAN')
        } else {
            diffDiv.style.display = 'none'
        }
    }
}

window.setDifficulty = function (level) {
    window.aiDifficulty = level
    console.log("AI Difficulty set to:", level)

    const elKasztan = document.getElementById('btnKasztan')
    const elOgor = document.getElementById('btnOgor')
    const elChuck = document.getElementById('btnChuck')

    // Reset All
    const allBtns = [elKasztan, elOgor, elChuck]
    allBtns.forEach(btn => {
        if (btn) {
            btn.style.background = '#555'
            btn.style.color = '#aaa'
            btn.style.boxShadow = 'none'
        }
    })

    // Highlight Selected
    let activeBtn = null
    if (level === 'KASZTAN') activeBtn = elKasztan
    else if (level === 'OGOR') activeBtn = elOgor
    else if (level === 'CHUCKNORRIS') activeBtn = elChuck

    if (activeBtn) {
        activeBtn.style.background = '#00ff00'
        activeBtn.style.color = 'black'
        activeBtn.style.boxShadow = '0 0 5px #00ff00'
    }
}

window.exitOnlineMenu = function () {
    document.getElementById('onlineScreen').style.display = 'none'
    document.getElementById('onlineLobbySection').style.display = 'none'
    document.getElementById('onlineQuickMatchSection').style.display = 'none'
    document.getElementById('mainMenuScreen').style.display = 'flex'
    window.mainMenuActive = true

    // Stop searching if active
    if (window.networkManager && window.networkManager.socket) {
        // We can just disconnect to be safe, or emit a leave event
        // Disconnecting ensures we leave the queue 100%
        window.networkManager.socket.disconnect()
        window.networkManager.isOnline = false
        const statusInd = document.getElementById('onlineStatus')
        if (statusInd) statusInd.innerText = "SERVER: DISCONNECTED"
    }
}

// Ensure stats are hidden when returning to main menu as well (handled in showMainMenu mostly but good to be safe)
const originalShowMainMenu2 = window.showMainMenu
window.showMainMenu = function () {
    if (typeof statsScreen !== 'undefined') statsScreen.style.display = 'none'

    // SAFETY: Hide Online Screens
    if (document.getElementById('onlineScreen')) document.getElementById('onlineScreen').style.display = 'none'
    if (document.getElementById('onlineLobbySection')) document.getElementById('onlineLobbySection').style.display = 'none'
    if (document.getElementById('onlineQuickMatchSection')) document.getElementById('onlineQuickMatchSection').style.display = 'none'

    if (originalShowMainMenu2) originalShowMainMenu2()

    // Ensure ticker is visible
    const ticker = document.getElementById('newsTickerBar');
    if (ticker) {
        ticker.style.display = 'flex';
        if (typeof initTicker === 'function') initTicker();
    }
}

// ==========================================
// Helper for Particles (Restored)
function createParticles(x, y, type, count) {
    if (typeof particles === 'undefined') return
    for (let i = 0; i < count; i++) {
        particles.push(new Particle({
            position: { x, y },
            velocity: {
                x: (Math.random() - 0.5) * (type === 'blood' ? 8 : 10),
                y: (Math.random() - 0.5) * (type === 'blood' ? 8 : 10)
            },
            type: type,
            imageSrc: (type === 'blood') ? './img/blood.png' : './img/spark.png',
            color: (type === 'energy') ? '#00FFFF' : undefined
        }))
    }
}

// ==========================================
// ONLINE MULTIPLAYER LOGIC
// ==========================================

window.startOnlineGame = function () {
    window.focus(); // FIX: Ensure focus for input
    if (gameMode !== '2V2_CHAOS') gameMode = 'ONLINE';
    document.getElementById('onlineScreen').style.display = 'none'

    // START CHARACTER SELECTION
    if (gameMode === '2V2_CHAOS' && typeof showSideSelection === 'function') {
        showSideSelection();
    } else {
        showCharSelect();
    }

    // Reset flags so we wait for selection
    p1Confirmed = false
    p2Confirmed = false

    // Ensure we don't carry over previous selections
    player1Selection = null
    player2Selection = null
    updateMenuVisuals()

    console.log("STARTING ONLINE GAME via Char Select")

    // DEBUG: Show Role
    const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    window.myDevice = isMobile ? 'mobile' : 'desktop';
    window.enemyDevice = null; // Reset

    const role = (window.networkManager && window.networkManager.playerIndex == 0) ? "HOST (P1)" : "GUEST (P2)"
    const statusEl = document.getElementById('onlineStatus')
    if (statusEl) statusEl.innerText = `ONLINE: ${role} (${window.myDevice})`;

    // Send initial handshake
    broadcastCharSync();
}

window.handleOnlineInput = function (data) {
    // 1. INPUT HANDLING (Remote Keys)
    if (data.type === 'keydown' || data.type === 'keyup') {
        const key = data.key.toLowerCase()
        const lowKey = key;

        // Map common codes for Phaser
        const keyData = {
            'w': { keyCode: 87, code: 'KeyW' },
            'a': { keyCode: 65, code: 'KeyA' },
            's': { keyCode: 83, code: 'KeyS' },
            'd': { keyCode: 68, code: 'KeyD' },
            ' ': { keyCode: 32, code: 'Space' },
            'c': { keyCode: 67, code: 'KeyC' },
            'v': { keyCode: 86, code: 'KeyV' },
            'arrowup': { keyCode: 38, code: 'ArrowUp' },
            'arrowdown': { keyCode: 40, code: 'ArrowDown' },
            'arrowleft': { keyCode: 37, code: 'ArrowLeft' },
            'arrowright': { keyCode: 39, code: 'ArrowRight' },
            'enter': { keyCode: 13, code: 'Enter' },
            'i': { keyCode: 73, code: 'KeyI' },
            'o': { keyCode: 79, code: 'KeyO' },
            'u': { keyCode: 85, code: 'KeyU' }
        };

        const eventData = keyData[lowKey] || {};
        const event = new KeyboardEvent(data.type, {
            key: key,
            keyCode: eventData.keyCode || 0,
            which: eventData.keyCode || 0,
            code: eventData.code || '',
            bubbles: true,
            cancelable: true
        })
        event.isRemote = true
        window.dispatchEvent(event)
        _triggerPhaserKey(event, data.type);

        return
    }

    if (data.type === 'start_char_select') {
        // If we were in lobby, hide it
        if (typeof hideSideSelection === 'function') hideSideSelection();
        if (document.getElementById('sideSelectionScreen')) document.getElementById('sideSelectionScreen').style.display = 'none';

        if (typeof startCharacterSelection2v2 === 'function') startCharacterSelection2v2();
        return;
    }

    // 1. SYNC START SIGNAL (From Host)
    if (data.type === 'special_start') {
        const syncData = data.payload
        console.log("SYNC START RECEIVED (Indices):", syncData)

        // Force Set Characters using Indices (100% accurate)
        if (syncData.p1Idx !== undefined) p1Index = syncData.p1Idx
        if (syncData.p2Idx !== undefined) p2Index = syncData.p2Idx

        player1Selection = allCharacters[p1Index]
        player2Selection = allCharacters[p2Index]

        // Set Map
        mapIndex = syncData.map

        // Force Start Procedure
        mapSelectionActive = false
        if (typeof mapSelectionScreen !== 'undefined' && mapSelectionScreen) mapSelectionScreen.style.display = 'none'
        if (typeof gameScreen !== 'undefined' && gameScreen) gameScreen.style.display = 'inline-block'

        if (typeof startGame === 'function') startGame()
        return
    }

    // 1.4 DEVICE INFO HANDSHAKE
    if (data.type === 'device_info') {
        window.enemyDevice = data.payload.device;
        console.log("ENEMY DEVICE INFO RECEIVED:", window.enemyDevice);
        return
    }

    // 1.5. SYNC GOTO MAP SELECTION
    if (data.type === 'goto_map') {
        if (typeof goToMapSelection === 'function') goToMapSelection()
        return
    }

    // 1.6. SYNC MAP UPDATE
    if (data.type === 'map_update') {
        mapIndex = data.payload.mapIndex
        if (typeof renderMapList === 'function') renderMapList()
        return
    }

    // 1.7 SYNC HIT EVENT (Damage Synchronization)
    if (data.type === 'hit_event') {
        const payload = data.payload
        const target = (payload.target === 'P1') ? player : enemy
        // Apply Damage / Knockback visual
        if (payload.isBlocking) {
            if (target) {
                target.health = Math.max(0, target.health - 2)
                if (payload.knockbackDir) target.position.x += payload.knockbackDir * 20
            }
            safeAudio('playAttack')
        } else {
            if (target) {
                target.takeHit(payload.damage)
                createParticles(target.position.x, target.position.y + 50, 'blood', 6)
            }
            safeAudio('playHit')
            // Knockback
            if (target && payload.knockbackDir) {
                target.velocity.x = payload.knockbackDir * 10
                target.velocity.y = -5
            }
        }
        if (player && enemy) {
            if (document.querySelector('#playerHealth')) document.querySelector('#playerHealth').style.width = (player.health / player.maxHealth * 100) + '%'
            if (document.querySelector('#enemyHealth')) document.querySelector('#enemyHealth').style.width = (enemy.health / enemy.maxHealth * 100) + '%'
        }

        // NEW: PHASER DAMAGE SYNC
        if (window.phaserGame && window.phaserGame.scene) {
            const combat = window.phaserGame.scene.getScene('CombatScene');
            if (combat) {
                const targetChar = (payload.target === 'P1') ? combat.player : combat.enemy;
                if (targetChar && targetChar.active) {
                    let hp = targetChar.getData('health');
                    hp = Math.max(0, hp - payload.damage);
                    targetChar.setData('health', hp);

                    // Trigger visual hit
                    if (!payload.isBlocking) {
                        const pre = targetChar.getData('prefix');
                        if (combat.anims.exists(`${pre}_hit`)) targetChar.play(`${pre}_hit`, true);
                        combat.createParticles(targetChar.x, targetChar.y, 'blood', 10);
                    }
                    combat.syncUI();
                }
            }
        }
        return
    }

    // 1.7.5 SYNC POSITION (Network Heartbeat)
    if (data.type === 'pos_sync') {
        if (window.phaserGame && window.phaserGame.scene && window.phaserGame.scene.getScene('CombatScene')) {
            const combat = window.phaserGame.scene.getScene('CombatScene');
            const { tag, x, y } = data.payload;
            const targetChar = (tag === 'P1') ? combat.player : combat.enemy;

            if (targetChar && targetChar.active) {
                const dist = Phaser.Math.Distance.Between(targetChar.x, targetChar.y, x, y);
                // Increase threshold to 200 to avoid micro-snapping stuttering
                // rely on state_sync for regular smooth updates
                if (dist > 200) {
                    targetChar.x = x;
                    targetChar.y = y;
                }
            }
        }
        return
    }

    if (data.type === 'sync_char_select') {
        if (window.handleOnlineSync) window.handleOnlineSync(data)
        return
    }

    // 3. STATE SYNC (Position & Health Correction)
    if (data.type === 'state_sync') {
        if (!window.networkManager) return
        const payload = data.payload
        const combat = (window.phaserGame && window.phaserGame.scene) ? window.phaserGame.scene.getScene('CombatScene') : null;

        if (window.networkManager.playerIndex === 0) {
            // I am Host (P1). Receive P2 State from Guest.
            if (payload.sender === 'P2') {
                const char = (combat) ? combat.enemy : enemy;
                if (!char) return;

                // Position Sync
                const curPos = (combat) ? { x: char.x, y: char.y } : char.position;
                if (Math.abs(curPos.x - payload.x) > 50) {
                    if (combat) { char.x = payload.x; char.y = payload.y; }
                    else { char.position.x = payload.x; char.position.y = payload.y; }
                } else {
                    if (combat) {
                        char.x += (payload.x - char.x) * 0.3;
                        char.y += (payload.y - char.y) * 0.3;
                    } else {
                        char.position.x += (payload.x - char.position.x) * 0.3;
                        char.position.y += (payload.y - char.position.y) * 0.3;
                    }
                }

                // Health/State Sync
                if (combat) {
                    char.setData('health', payload.health);
                    char.setData('isAttacking', payload.isAttacking);
                    combat.syncUI();
                } else {
                    char.health = payload.health;
                    char.isAttacking = payload.isAttacking;
                }
            }
        } else {
            // I am Guest (P2). Receive P1 State from Host.
            if (payload.sender === 'P1') {
                const char = (combat) ? combat.player : player;
                if (!char) return;

                // Position Sync
                const curPos = (combat) ? { x: char.x, y: char.y } : char.position;
                if (Math.abs(curPos.x - payload.x) > 50) {
                    if (combat) { char.x = payload.x; char.y = payload.y; }
                    else { char.position.x = payload.x; char.position.y = payload.y; }
                } else {
                    if (combat) {
                        char.x += (payload.x - char.x) * 0.3;
                        char.y += (payload.y - char.y) * 0.3;
                    } else {
                        char.position.x += (payload.x - char.position.x) * 0.3;
                        char.position.y += (payload.y - char.position.y) * 0.3;
                    }
                }

                // Health/State Sync
                if (combat) {
                    char.setData('health', payload.health);
                    char.setData('isAttacking', payload.isAttacking);
                    combat.syncUI();
                } else {
                    char.health = payload.health;
                    char.isAttacking = payload.isAttacking;
                }
            }
        }
    }
}

// Global Online Listeners
window.addEventListener('keydown', (e) => {
    if (gameMode !== 'ONLINE' || e.isRemote || e.repeat) return

    if (window.networkManager) {
        const idx = window.networkManager.playerIndex;
        let keyToSend = e.key;
        const lowKey = e.key.toLowerCase();

        // P2 (Guest) Translation: WASD -> Arrows
        if (idx === 1) {
            if (lowKey === 'w') keyToSend = 'ArrowUp'
            if (lowKey === 's') keyToSend = 'ArrowDown'
            if (lowKey === 'a') keyToSend = 'ArrowLeft'
            if (lowKey === 'd') keyToSend = 'ArrowRight'
            if (lowKey === ' ') keyToSend = 'Enter'
            if (lowKey === 'c') keyToSend = 'o' // Kick mapped to O
            if (lowKey === 'v') keyToSend = 'p' // Alt Kick mapped to P
        }

        // P3 (Team 1 Aux) Translation: WASD -> TFGH
        if (idx === 2) {
            if (lowKey === 'w') keyToSend = 't'
            if (lowKey === 'a') keyToSend = 'f'
            if (lowKey === 's') keyToSend = 'g'
            if (lowKey === 'd') keyToSend = 'h'
            if (lowKey === 'c') keyToSend = 'y' // Kick
            if (lowKey === ' ') keyToSend = 'r' // Punch (Space->R?)
            // P3 Special mappings?
            // As defined in PhaserCombat: Punch=R, Kick=Y.
            // Let's ensure consistency.
            // If P3 presses Space (Punch), send R.
            // If P3 presses C (Kick), send Y.
        }

        // P4 (Team 2 Aux) Translation: WASD -> IJKL
        if (idx === 3) {
            if (lowKey === 'w') keyToSend = 'i'
            if (lowKey === 'a') keyToSend = 'j'
            if (lowKey === 's') keyToSend = 'k'
            if (lowKey === 'd') keyToSend = 'l'
            if (lowKey === ' ') keyToSend = 'u' // Punch
            if (lowKey === 'c') keyToSend = 'o' // Kick
        }

        // Send the (potentially translated) key
        if (window.networkManager.isOnline) {
            window.networkManager.sendInput({ key: keyToSend, type: 'keydown' })
        }
    }
})

// ONLINE KEYUP SENDER (Missed previously, caused "stuck" movement)
window.addEventListener('keyup', (e) => {
    if (gameMode !== 'ONLINE' || e.isRemote || e.repeat) return

    if (window.networkManager) {
        const idx = window.networkManager.playerIndex;
        let keyToSend = e.key;
        const lowKey = e.key.toLowerCase();

        // P2 (Guest) Translation: WASD -> Arrows
        if (idx === 1) {
            if (lowKey === 'w') keyToSend = 'ArrowUp'
            if (lowKey === 's') keyToSend = 'ArrowDown'
            if (lowKey === 'a') keyToSend = 'ArrowLeft'
            if (lowKey === 'd') keyToSend = 'ArrowRight'
            if (lowKey === ' ') keyToSend = 'Enter'
            if (lowKey === 'c') keyToSend = 'o' // Kick mapped to O
            if (lowKey === 'v') keyToSend = 'p' // Alt Kick mapped to P
        }

        // P3 (Team 1 Aux) Translation: WASD -> TFGH
        if (idx === 2) {
            if (lowKey === 'w') keyToSend = 't'
            if (lowKey === 'a') keyToSend = 'f'
            if (lowKey === 's') keyToSend = 'g'
            if (lowKey === 'd') keyToSend = 'h'
            if (lowKey === 'c') keyToSend = 'y'
            if (lowKey === ' ') keyToSend = 'r'
        }

        // P4 (Team 2 Aux) Translation: WASD -> IJKL
        if (idx === 3) {
            if (lowKey === 'w') keyToSend = 'i'
            if (lowKey === 'a') keyToSend = 'j'
            if (lowKey === 's') keyToSend = 'k'
            if (lowKey === 'd') keyToSend = 'l'
            if (lowKey === ' ') keyToSend = 'u'
            if (lowKey === 'c') keyToSend = 'o'
        }

        // Send the (potentially translated) key
        if (window.networkManager.isOnline) {
            window.networkManager.sendInput({ key: keyToSend, type: 'keyup' })
        }
    }
})

// SYNC HANDLER (NEW)
window.handleOnlineSync = function (data) {
    if (data.type === 'sync_char_select') {
        let changed = false
        // P1 Update
        if (data.p1Index !== undefined && p1Index !== data.p1Index) {
            p1Index = data.p1Index
            safeAudio('playNav')
            changed = true
        }
        if (data.p1Confirmed !== undefined && p1Confirmed !== data.p1Confirmed) {
            p1Confirmed = data.p1Confirmed
            if (p1Confirmed) {
                player1Selection = allCharacters[p1Index]
                safeAudio('playSound', 'p1')
            } else {
                player1Selection = null
            }
            changed = true
        } else if (data.p1Index !== undefined) {
            // Just update selection ref if index changed
            if (p1Confirmed) player1Selection = allCharacters[p1Index]
        }

        // P2 Update
        if (data.p2Index !== undefined && p2Index !== data.p2Index) {
            p2Index = data.p2Index
            safeAudio('playAttack') // Sound for P2 move
            changed = true
        }
        if (data.p2Confirmed !== undefined && p2Confirmed !== data.p2Confirmed) {
            p2Confirmed = data.p2Confirmed
            if (p2Confirmed) {
                player2Selection = allCharacters[p2Index]
                safeAudio('playSound', 'p2')
            } else {
                player2Selection = null
            }
            changed = true
        } else if (data.p2Index !== undefined) {
            if (p2Confirmed) player2Selection = allCharacters[p2Index]
        }

        // P3 Update (2v2)
        if (data.p3Index !== undefined && p3Index !== data.p3Index) {
            p3Index = data.p3Index
            safeAudio('playNav')
            changed = true
        }
        if (data.p3Confirmed !== undefined && p3Confirmed !== data.p3Confirmed) {
            p3Confirmed = data.p3Confirmed
            if (p3Confirmed) {
                window.p3Selection = allCharacters[p3Index]
                safeAudio('playSound', 'p1') // Sound for P3
            } else {
                window.p3Selection = null
            }
            changed = true
        }

        // P4 Update (2v2)
        if (data.p4Index !== undefined && p4Index !== data.p4Index) {
            p4Index = data.p4Index
            safeAudio('playNav')
            changed = true
        }
        if (data.p4Confirmed !== undefined && p4Confirmed !== data.p4Confirmed) {
            p4Confirmed = data.p4Confirmed
            if (p4Confirmed) {
                window.p4Selection = allCharacters[p4Index]
                safeAudio('playSound', 'p2') // Sound for P4
            } else {
                window.p4Selection = null
            }
            changed = true
        }

        // Update Enemy Device Info if present
        if (data.device && !window.enemyDevice) {
            window.enemyDevice = data.device;
            console.log("SYNC: Enemy device detected:", window.enemyDevice);

            // QUICK MATCH FILTERING (Client Side fallback)
            if (window.networkManager && window.networkManager.isQuickMatch) {
                if (window.enemyDevice !== window.myDevice) {
                    console.warn(`Mismatch in Quick Match: Me=${window.myDevice}, Enemy=${window.enemyDevice}`);
                    // Instead of alert (which is annoying), just restart matchmaking silently
                    window.networkManager.findMatch();
                    return;
                }
            }
        }

        if (changed || data.forceUpdate) updateMenuVisuals()

        // Auto-Start Check if ALL confirmed (Host checks)
        if (window.networkManager.playerIndex === 0) {
            let allReady = (p1Confirmed && p2Confirmed);
            if (gameMode === '2V2_CHAOS') {
                allReady = (p1Confirmed && p2Confirmed && p3Confirmed && p4Confirmed);
            }

            if (allReady) {
                setTimeout(() => {
                    // Host triggers map selection sync
                    window.networkManager.sendInput({ type: 'goto_map' })
                    goToMapSelection()
                }, 500)
            }
        }
    }
}

// ==========================================
// ONLINE UTILS - SYNC SELECTION
// ==========================================
function broadcastCharSync() {
    if (window.networkManager && window.networkManager.isOnline) {
        window.networkManager.sendInput({
            type: 'sync_char_select',
            p1Index: p1Index,
            p1Confirmed: p1Confirmed,
            p2Index: p2Index,
            p2Confirmed: p2Confirmed,
            p3Index: p3Index,
            p3Confirmed: p3Confirmed,
            p4Index: p4Index,
            p4Confirmed: p4Confirmed,
            device: window.myDevice // Send device info in selection sync
        })
    }
}


// ==========================================
// INFO POPUP LOGIC
// ==========================================
const infoPopup = document.getElementById('infoPopup')
const closeInfoBtn = document.getElementById('closeInfoBtn')
let infoShown = false

if (closeInfoBtn) {
    closeInfoBtn.addEventListener('click', () => {
        if (infoPopup) {
            infoPopup.style.display = 'none'
            // Ensure main menu is interactive
        }
    })
}

// Wrapper to show Popup once
const prevShowMainMenu = window.showMainMenu
window.showMainMenu = function () {
    if (prevShowMainMenu) prevShowMainMenu()

    if (!infoShown && infoPopup) {
        setTimeout(() => {
            infoPopup.style.display = 'flex'
        }, 100)
        infoShown = true
    }
}

window.addEventListener('keyup', (e) => {
    if (gameMode !== 'ONLINE' || e.isRemote) return

    if (window.networkManager) {
        const isHost = window.networkManager.playerIndex === 0
        const isGuest = window.networkManager.playerIndex === 1
        const key = e.key.toLowerCase()
        const p1Keys = ['w', 'a', 's', 'd', ' ']
        const p2Keys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'enter']

        if (isHost && !p1Keys.includes(key) && key !== 'c') return
        if (isGuest && !p2Keys.includes(key)) return
    }

    if (window.networkManager && window.networkManager.isOnline) {
        window.networkManager.sendInput({ key: e.key, type: 'keyup' })
    }
})

// ==========================================
// ONLINE INPUT HANDLER (STATE SYNC FIX)
// ==========================================
// Merged handleOnlineInput above (line 3375)

// STATE SYNC LOOP (Broadcast my state every 100ms)
setInterval(() => {
    if (gameMode === 'ONLINE' && window.networkManager && window.networkManager.isOnline && gameStarted) {
        const isHost = window.networkManager.playerIndex === 0
        const myChar = isHost ? window.player : window.enemy

        if (!myChar || !myChar.position) return;

        // Payload
        const payload = {
            sender: isHost ? 'P1' : 'P2',
            x: myChar.position.x,
            y: myChar.position.y,
            health: myChar.health,
            isAttacking: myChar.isAttacking
        }

        window.networkManager.sendInput({
            type: 'state_sync',
            payload: payload
        })
    }
}, 45)

// ==========================================
// SPRITE DEBUGGER LOGIC
// ==========================================
function openSpriteDebugger(charName) {
    const data = characterData[charName.toUpperCase()]
    if (!data) return alert("Brak danych dla " + charName)

    const modal = document.getElementById('spriteDebugger')
    const img = document.getElementById('debugSpriteImg')
    const grid = document.getElementById('debugGridOverlay')
    const info = document.getElementById('debugInfo')

    info.innerText = `Postać: ${charName} | Siatka: ${data.spriteSheetData.rows} rzędów, ${data.spriteSheetData.framesMax || 1} kolumn`
    img.src = data.spriteSheetData.imageSrc

    img.onload = () => {
        grid.innerHTML = ''
        const cols = data.spriteSheetData.framesMax || 1
        const rows = data.spriteSheetData.rows || 1
        const fw = img.naturalWidth / cols
        const fh = img.naturalHeight / rows

        // Set dimensions to match natural image
        img.style.width = img.naturalWidth + 'px'
        img.style.height = img.naturalHeight + 'px'

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cell = document.createElement('div')
                cell.style.position = 'absolute'
                cell.style.left = (c * fw) + 'px'

                let cellTop = r * fh
                let cellHeight = fh

                // Debugger Grid Offset UI (matches global core adjustments)
                if (rows === 4) {
                    if (r === 0) {
                        cellHeight = fh + 10 // Row 1 bottom line moves 10px down
                    } else if (r === 1) {
                        cellTop = (r * fh) + 20 // Row 2 top line moves 20px down (hide previous row legs)
                        cellHeight = fh - 20
                    } else if (r === 2) {
                        cellHeight = fh - 10 // Row 3 bottom line moves 10px up
                    } else if (r === 3) {
                        cellTop = (r * fh) - 10 // Row 4 top line moves 10px up (prevent cutting)
                        cellHeight = fh + 10
                    }
                }

                cell.style.top = cellTop + 'px'
                cell.style.width = fw + 'px'
                cell.style.height = cellHeight + 'px'
                cell.style.border = '1px solid red'
                cell.style.color = 'yellow'
                cell.style.fontSize = '12px'
                cell.style.pointerEvents = 'auto'
                cell.style.cursor = 'pointer'
                cell.style.backgroundColor = 'rgba(255,0,0,0.1)'
                cell.innerText = `R:${r} C:${c}`

                cell.onclick = () => {
                    alert(`Wybrałeś - Rząd: ${r}, Kolumna: ${c}\nPixel: X:${c * fw}, Y:${cellTop}`)
                }

                grid.appendChild(cell)
            }
        }
    }

    modal.style.display = 'flex'
}

// Global hotkey for debugger modal (ESC to close)
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'escape') {
        const modal = document.getElementById('spriteDebugger')
        if (modal && modal.style.display === 'flex') {
            modal.style.display = 'none'
            e.stopPropagation()
        }
    }
})

// ==========================================
// 2v2 SIDE SELECTION LOGIC (Appended)
// ==========================================
// Global elements
const sideSelectionScreen = document.getElementById('sideSelectionScreen')
const confirmSidesBtn = document.getElementById('confirmSidesBtn')

// Expose global function for NetworkManager to call
window.showSideSelection = function () {
    mainMenuActive = false;
    document.getElementById('onlineScreen').style.display = 'none';
    if (sideSelectionScreen) sideSelectionScreen.style.display = 'flex';
    const status = document.getElementById('sideStatus');
    if (status) status.innerText = "OCZEKIWANIE NA GRACZY (4 WYMAGANYCH)...";
    window.updateSideSelectionUI();
}

window.updateSideSelectionUI = function () {
    if (!window.networkManager) return;
    // We rely on NetworkManager tracking playersInRoom (which we added)
    const players = window.networkManager.playersInRoom || [null, null, null, null];
    const myIdx = window.networkManager.playerIndex;
    let count = 0;

    for (let i = 0; i < 4; i++) {
        const slot = document.getElementById(`slot${i}`);
        if (!slot) continue;

        if (players[i]) {
            count++;
            let label = `P${i + 1}`;
            if (i === myIdx) label += " (TY)";
            slot.innerText = label;
            slot.style.borderColor = (i < 2) ? '#00ff00' : '#ff0055';
            slot.style.color = 'white';
            slot.style.backgroundColor = (i < 2) ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 85, 0.2)';
        } else {
            slot.innerText = "WOLNY";
            slot.style.borderColor = '#555';
            slot.style.color = '#555';
            slot.style.backgroundColor = 'transparent';
        }
    }

    // Host Logic
    const isHost = (window.networkManager.playerIndex === 0);
    const status = document.getElementById('sideStatus');

    if (status) {
        // Allow start if >= 2 players for testing flexibility (user can decide)
        if (count >= 2) {
            status.innerText = isHost ? "GOTOWY DO STARTU?" : "OCZEKIWANIE NA HOSTA...";
            status.style.color = (status.innerText.includes("GOTOWY")) ? '#00ff00' : 'yellow';
            if (isHost && confirmSidesBtn) confirmSidesBtn.style.display = 'block';
        } else {
            status.innerText = `OCZEKIWANIE NA GRACZY (${count}/4)...`;
            status.style.color = 'yellow';
            if (confirmSidesBtn) confirmSidesBtn.style.display = 'none';
        }
    }
}

if (confirmSidesBtn) {
    confirmSidesBtn.addEventListener('click', () => {
        // Host confirms sides -> Go to Char Select
        if (window.networkManager) {
            window.networkManager.sendInput({
                type: 'start_char_select', // Custom type to trigger transition
                mode: '2V2_CHAOS'
            });
            // Also trigger locally for host
            startCharacterSelection2v2();
        }
    });
}

window.startCharacterSelection2v2 = function () {
    if (sideSelectionScreen) sideSelectionScreen.style.display = 'none';
    gameMode = '2V2_CHAOS';
    showCharSelect();
}

// ==========================================
// PLAYER MENU & RADIO LOGIC (New)
// ==========================================

window.showPlayerMenu = function () {
    // Hide others
    const intro = document.getElementById('introScreen');
    if (intro) intro.style.display = 'none';
    const mm = document.getElementById('mainMenuScreen');
    if (mm) mm.style.display = 'none';
    if (document.getElementById('sideSelectionScreen')) document.getElementById('sideSelectionScreen').style.display = 'none';

    // Show Player Menu
    const pm = document.getElementById('playerMenuScreen');
    if (pm) pm.style.display = 'block';

    // Show Ticker
    const ticker = document.getElementById('newsTickerBar');
    if (ticker) {
        ticker.style.display = 'flex';
        // Ensure ticker is running
        if (typeof initTicker === 'function') initTicker();
    }
}

// EXIT ONLINE MENU FUNCTION
window.exitOnlineMenu = function () {
    if (window.networkManager) {
        window.networkManager.disconnect()
    }
    const onlineScreen = document.getElementById('onlineScreen')
    if (onlineScreen) onlineScreen.style.display = 'none'
    showMainMenu()
}


// Open Inventory (Rap Room)
// Open Inventory (Rap Room)
window.openInventory = function () {
    const p = window.collectionManager ? window.collectionManager.currentProfile : 'default';
    if (window.openInIframe) {
        window.openInIframe(`inventory.html?profile=${p}`);
    } else {
        window.location.href = `inventory.html?profile=${p}`;
    }
}

// Open Achievements (SPA Fix)
window.openAchievements = function () {
    const p = window.collectionManager ? window.collectionManager.currentProfile : 'default';
    if (window.openInIframe) {
        window.openInIframe(`achievements.html?profile=${p}`);
    } else {
        window.location.href = `achievements.html?profile=${p}`;
    }
}

// STORAGE SYNC (Fix for "zamulanie" kasy)
window.addEventListener('storage', (e) => {
    // If collection changed in another window/iframe
    if (e.key && e.key.startsWith('rrb_collection_')) {
        // console.log("[Main] Storage changed, reloading collection to sync UI...");
        if (window.collectionManager) {
            window.collectionManager.loadCollection().then(() => {
                // Update specific UI if exists
                if (typeof updateProfileDisplay === 'function') updateProfileDisplay();
                // If there's a money display we missed:
                if (window.playerData) window.playerData.money = window.collectionManager.getMoney();
            });
        }
    }
});
// FINAL MOBILE TOUCH SUPPORT: Global listener for any .menu-option
document.addEventListener('touchstart', (e) => {
    const target = e.target.closest('.menu-option');
    if (target) {
        // e.preventDefault(); // Don't prevent default to allow click to trigger too, or handle here
        const index = parseInt(target.getAttribute('data-index'));
        if (!isNaN(index) && mainMenuActive) {
            mainMenuIndex = index;
            updateMainMenuVisuals();
            safeAudio('playNav');
            // Optional: Single tap to select, double tap to confirm? 
            // For now, let's just make it selectable. handleMainMenuSelection is still via Click/Key.
        }
        // If it's a direct action button (like Back), click listener will handle it.
    }
}, { passive: true });
