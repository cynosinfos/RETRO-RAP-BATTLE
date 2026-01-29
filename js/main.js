const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.55 // Reduced from 0.7 for slower fall

// Initialize Audio (Robust check)
// Initialize Audio
var audioManager
try {
    audioManager = new AudioManager()
} catch (e) {
    console.warn("Audio Manager failed to init", e)
    // Fallback dummy object
    audioManager = { playHit: () => { }, playAttack: () => { } }
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
        '600V', 'ABRADAB', 'ARAB', 'AVI', 'BELMONDO', 'BIAK', 'BIALAS', 'BILON', 'BISZ',
        'BONSON', 'BONUS RPK', 'BORIXON', 'CHIVAS', 'DJ DECKS', 'DJ IKE',
        'ELDO', 'ERIPE', 'ERO', 'FAGATA', 'FISZ', 'FOKUS', 'GREEN', 'GURAL', 'GUZIOR',
        'KACZOR', 'KARA', 'KAZEK', 'KEKE', 'KIZO', 'KRZY KRZYSZTOF',
        'KUBAN', 'KUBANCZYK', 'KUKON', 'LAIKIKE1', 'LANEK', 'LECH ROCH PAWLAK', 'LJ KARWEL',
        'LONA', 'LOUIS V', 'MAGIERA', 'MALIK', 'MALPA', 'MATA', 'MEZO', 'MIUOSH', 'OSTR',
        'PALUCH', 'PAWBEATS', 'PEJA', 'PELSON', 'PEZET', 'PIH', 'PLANET ANM', 'POPEK',
        'PYSKATY', 'QUEBONAFIDE', 'RAHIM', 'RAS', 'RETO', 'SARIUS', 'SCHAFTER', 'SENTINO',
        'SITEK', 'SLON', 'SMARKI SMARK', 'SMOLASTY', 'SOBEL', 'SOKOL', 'SOLAR',
        'SZPAKU', 'TEDE', 'TEN TYP MES', 'TETRIS', 'VBS', 'VIENIO', 'VKIE', 'VNM',
        'WENA', 'WILKU', 'WINI', 'WLODI', 'YOUNG IGI', 'YOUNG MULTI',
        'ZABSON', 'ZYTO', 'FILIPEK', 'NOON', 'FU', 'LIROY', 'KORAS', 'JURAS',
        'JEDKER', 'INTRUZ', 'ERKING', 'SOULPETE', 'FROSTI', 'KAZIK', 'GIBBS', 'KALI',
        'BARDAL', 'OKON', 'GOSPEL', 'ADMA'
    ].sort((a, b) => a.localeCompare(b)),
    teamOceniacze: [
        'FLINT', 'HIREK W', 'HORRYPAZ', 'HYPE', 'LIL KONON', 'MATT', 'MUZYKA TV', 'NOVACCI', 'PAT KUSTOMS', 'SKOPZZOR', 'YURKOSKY', 'JACEK ADAMKIEWICZ'
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
let mainMenuIndex = 0
let mainMenuActive = false
let controlsActive = false
let gameMode = 'PVP' // PVP, PVE, ONLINE
let soundEnabled = true

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
    { name: 'Oktagon', image: './img/background/oktagon.png' }
]
let mapIndex = 12 // Default to Bar map


// Selection Indices
let p1Index = 0
let p2Index = 1
let p1Confirmed = false
let p2Confirmed = false

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
const controlsScreen = document.getElementById('controlsScreen')
const mainMenuList = document.getElementById('mainMenuList')


// Visual Elements Cache
const characterButtons = []

function createCharacterButton(name, container) {
    const btn = document.createElement('div')
    btn.innerHTML = name
    // Fixed size style
    btn.style = "border: 2px solid #555; width: 90px; height: 40px; display: flex; align-items: center; justify-content: center; text-align: center; margin: 2px; color: #aaa; font-family: 'Press Start 2P'; font-size: 8px; cursor: pointer; user-select: none; box-sizing: border-box; word-break: break-word;"
    btn.id = `char-btn-${name}`

    // Mouse/Touch interaction
    btn.addEventListener('click', () => {
        // Find index of this character
        const charIndex = allCharacters.indexOf(name)
        if (charIndex === -1) return

        // Update P1 Selection (Priority)
        if (!p1Confirmed) {
            p1Index = charIndex
            safeAudio('playAttack') // Sound effect
            updateMenuVisuals()
            // Optional: Auto-confirm on double click? 
            // For now, allow click to select, and users press 'PUNCH' (Space) button to confirm.

        } else if (gameMode === 'PVE' && !p2Confirmed) {
            // P1 selecting for CPU
            p2Index = charIndex
            safeAudio('playAttack')
            updateMenuVisuals()
        }
    })

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

    // 1. Update Buttons (Highlighting)
    characterButtons.forEach((btnObj, i) => {
        const el = btnObj.element
        el.style.borderColor = '#555'
        el.style.backgroundColor = 'transparent'
        el.style.color = '#aaa'
        el.style.boxShadow = 'none'

        // Check if P1 Selected
        const charIndex = allCharacters.indexOf(btnObj.name)

        let label = btnObj.name

        if (charIndex === p1Index) {
            el.style.borderColor = '#00ff00' // Green for P1
            el.style.color = '#fff'
            el.style.boxShadow = '0 0 10px #00ff00'
            label = "P1: " + btnObj.name

            if (p1Confirmed) {
                el.style.backgroundColor = 'rgba(0, 255, 0, 0.3)'
                label = "P1 (OK): " + btnObj.name
            }
        }

        if (charIndex === p2Index) {
            // Determine label prefix based on game mode
            const p2Label = (gameMode === 'PVE') ? 'CPU' : 'P2'

            // If same character
            if (charIndex === p1Index) {
                el.style.borderColor = '#fff' // White overlap
                el.style.boxShadow = '0 0 10px #fff'
                label = `P1 & ${p2Label}: ` + btnObj.name
                if (p1Confirmed) label = `P1(OK) & ${p2Label}: ` + btnObj.name
                if (p2Confirmed) {
                    if (p1Confirmed) label = `P1(OK) & ${p2Label}(OK): ` + btnObj.name
                    else label = `P1 & ${p2Label}(OK): ` + btnObj.name
                    el.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
                }
            } else {
                // Color based on mode: PVE = red, PVP = cyan
                const highlightColor = (gameMode === 'PVE') ? '#ff0055' : '#00ffff'
                el.style.borderColor = highlightColor
                el.style.color = '#fff'
                el.style.boxShadow = `0 0 10px ${highlightColor}`
                label = `${p2Label}: ` + btnObj.name
                if (p2Confirmed) {
                    const bgColor = (gameMode === 'PVE') ? 'rgba(255, 0, 85, 0.3)' : 'rgba(0, 255, 255, 0.3)'
                    el.style.backgroundColor = bgColor
                    label = `${p2Label} (OK): ` + btnObj.name
                }
            }
        }

        el.innerHTML = label
    })

    // 2. Update PREVIEWS
    updatePreviewWindow(p1Index, 'charPreview', 'charPreviewSprite', 'charPreviewName', 'charPreviewUnknown')
    updatePreviewWindow(p2Index, 'charPreviewP2', 'charPreviewSpriteP2', 'charPreviewNameP2', 'charPreviewUnknownP2')

    // 3. Update P2 label based on game mode
    const p2NameLabel = document.getElementById('charPreviewNameP2')
    if (p2NameLabel) {
        if (gameMode === 'PVE') {
            // PVE Mode: Show CPU-related labels
            if (p1Confirmed && !p2Confirmed) {
                // P1 confirmed, now selecting CPU opponent
                p2NameLabel.style.color = '#ff0055'
                if (!player2Selection) {
                    // Before selecting CPU character
                    const currentName = allCharacters[p2Index]
                    p2NameLabel.innerText = currentName || 'SELECT CPU'
                }
            } else if (!p1Confirmed) {
                // P1 hasn't confirmed yet
                p2NameLabel.innerText = 'CPU'
                p2NameLabel.style.color = '#ff0055'
            }
        } else if (gameMode === 'PVP') {
            // PVP Mode: Show PLAYER 2 label
            p2NameLabel.style.color = '#00ffff'
            if (!player2Selection && !p2Confirmed) {
                const currentName = allCharacters[p2Index]
                if (!currentName) {
                    p2NameLabel.innerText = 'PLAYER 2'
                }
            }
        }
    }

    // Start Button Display
    if (p1Confirmed && p2Confirmed) {
        startButton.style.display = 'block'
    } else {
        startButton.style.display = 'none'
    }
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

        if (key === 'escape') {
            // Already in main menu, maybe do nothing or show credits?
            return
        }

        if (key === 'w' || key === 'arrowup') {
            mainMenuIndex = (mainMenuIndex - 1 + 7) % 7 // 7 options
            safeAudio('playNav')
            updateMainMenuVisuals()
        } else if (key === 's' || key === 'arrowdown') {
            mainMenuIndex = (mainMenuIndex + 1) % 7
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
            returnToMenu()
        }
        return // Block other inputs
    }

    // 2. CHARACTER SELECTION LOGIC
    if (menuScreen.style.display !== 'none') {
        const key = event.key.toLowerCase() // Re-declare for scope clarity or reuse outer 'key'

        // P1
        if (!p1Confirmed) {
            if (key === 'd') {
                p1Index = (p1Index + 1) % allCharacters.length
                safeAudio('playNav')
                updateMenuVisuals()
            } else if (key === 'a') {
                p1Index = (p1Index - 1 + allCharacters.length) % allCharacters.length
                safeAudio('playNav')
                updateMenuVisuals()
            } else if (key === 'w') {
                p1Index = (p1Index - 5 + allCharacters.length) % allCharacters.length
                safeAudio('playNav')
                updateMenuVisuals()
            } else if (key === 's') {
                p1Index = (p1Index + 5) % allCharacters.length
                safeAudio('playNav')
                updateMenuVisuals()
            } else if (key === ' ') {
                p1Confirmed = true
                player1Selection = allCharacters[p1Index]
                if (typeof statsManager !== 'undefined') statsManager.initChar(player1Selection.toUpperCase())
                safeAudio('playSound', 'p1')
                updateMenuVisuals()

                if (gameMode === 'PVE') {
                    // PVE Logic placeholder
                }
                return // STOP checking logic for this frame to prevent P2 auto-select
            } else if (key === 'escape') {
                // Return to Main Menu from P1 Selection
                menuScreen.style.display = 'none'
                showMainMenu()
                return
            }
        } else if (p1Confirmed && !p2Confirmed && gameMode === 'PVE') {
            // PVE MODE: PLAYER 1 SELECTS CPU OPPONENT (Accepts Arrows OR WASD for mobile)
            if (event.key === 'ArrowRight' || key === 'd') {
                p2Index = (p2Index + 1) % allCharacters.length
                safeAudio('playAttack')
                updateMenuVisuals()
            } else if (event.key === 'ArrowLeft' || key === 'a') {
                p2Index = (p2Index - 1 + allCharacters.length) % allCharacters.length
                safeAudio('playAttack')
                updateMenuVisuals()
            } else if (event.key === 'ArrowUp' || key === 'w') {
                p2Index = (p2Index - 5 + allCharacters.length) % allCharacters.length
                safeAudio('playAttack')
                updateMenuVisuals()
            } else if (event.key === 'ArrowDown' || key === 's') {
                p2Index = (p2Index + 5) % allCharacters.length
                safeAudio('playAttack')
                updateMenuVisuals()
            } else if (event.key === 'Enter' || key === ' ') {
                p2Confirmed = true
                player2Selection = allCharacters[p2Index]
                safeAudio('playHit')
                updateMenuVisuals()

                // Trigger Map Selection
                setTimeout(() => {
                    goToMapSelection()
                }, 300)
            } else if (key === 'escape') {
                p1Confirmed = false
                player1Selection = null
                updateMenuVisuals()
            }
        } else if (key === 'escape') {
            // Return to Main Menu
            menuScreen.style.display = 'none'
            showMainMenu()
            return
        }
    }

    // P2 (Only in PVP) - NOW SEQUENTIAL (Wait for P1) & Accepts WASD
    if (p1Confirmed && !p2Confirmed && gameMode === 'PVP' && menuScreen.style.display !== 'none') {
        const key = event.key.toLowerCase()
        if (event.key === 'ArrowRight' || key === 'd') {
            p2Index = (p2Index + 1) % allCharacters.length
            safeAudio('playAttack')
            updateMenuVisuals()
        } else if (event.key === 'ArrowLeft' || key === 'a') {
            p2Index = (p2Index - 1 + allCharacters.length) % allCharacters.length
            safeAudio('playAttack')
            updateMenuVisuals()
        } else if (event.key === 'ArrowUp' || key === 'w') {
            p2Index = (p2Index - 5 + allCharacters.length) % allCharacters.length
            safeAudio('playAttack')
            updateMenuVisuals()
        } else if (event.key === 'ArrowDown' || key === 's') {
            p2Index = (p2Index + 5) % allCharacters.length
            safeAudio('playAttack')
            updateMenuVisuals()
        } else if (event.key === 'Enter' || key === ' ') {
            p2Confirmed = true
            player2Selection = allCharacters[p2Index]
            safeAudio('playSound', 'p2')
            updateMenuVisuals()

            // Auto Trigger Map Selection for PVP (Mobile Friendly)
            setTimeout(() => {
                goToMapSelection()
            }, 300)
        }
    }

    // Start Game -> Go To Map Selection
    if (p1Confirmed && p2Confirmed && event.key === 'Enter' && menuScreen.style.display !== 'none') {
        goToMapSelection()
    }


    // GLOBAL ESCAPE
    // Handles returning from Game or other screens
    if (key === 'escape') {
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
        } else if (menuScreen.style.display === 'none' && !mainMenuActive && document.getElementById('gameOverMenu').style.display !== 'flex') {
            // Fallback return if not in game but stuck elsewhere?
            returnToMenu()
        }
        return
    }
})


// Map Selection Input Handler
window.addEventListener('keydown', (event) => {
    if (!mapSelectionActive) return

    const key = event.key.toLowerCase()

    if (key === 'w') {
        mapIndex = (mapIndex - 1 + maps.length) % maps.length
        renderMapList()
        // audioManager.playAttack()
    } else if (key === 's') {
        mapIndex = (mapIndex + 1) % maps.length
        renderMapList()
        // audioManager.playAttack()
    } else if (key === ' ' || key === 'c' || key === 'enter') {
        // Space, Kick ('c') or Enter to confirm map
        mapSelectionActive = false
        mapSelectionScreen.style.display = 'none'
        gameScreen.style.display = 'inline-block'
        startGame()
    }
    // Removed Enter to prevent confusion with P2 controls and double-skip risks
})

// HELPER FUNCTIONS
function goToMapSelection() {
    menuScreen.style.display = 'none'
    mapSelectionScreen.style.display = 'flex'
    renderMapList()
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


// EXPOSE TO GLOBAL FOR HTML INTRO
window.showMainMenu = function () {
    document.getElementById('introScreen').style.display = 'none'
    document.getElementById('menuScreen').style.display = 'none' // Hide default
    mainMenuActive = true
    mainMenuScreen.style.display = 'flex'
    updateMainMenuVisuals()
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
        mapList.appendChild(div)
    })
}



// Game Objects
// Game Objects
var background
var player
var enemy
// START GAME
function startGame() {
    if (!player1Selection || (!player2Selection && gameMode === 'PVP')) return // Safety check

    gameStarted = true
    window.isRoundActive = false // RESET ROUND STATE to prevent AI moving during VS Screen
    window.currentRound = 1
    window.p1Wins = 0
    window.p2Wins = 0
    window.matchOver = false
    window.winningPlayer = null
    camera = { x: 0, y: 0, scale: 1 }
    zoomSoundPlayed = false

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

    // DETECT GIF
    const gameContainer = document.getElementById('game-container')
    if (selectedBackground.toLowerCase().endsWith('.gif')) {
        background.isGif = true
        gameContainer.style.backgroundImage = `url(${selectedBackground})`
        gameContainer.style.backgroundSize = '100% 100%' // Force fit
        gameContainer.style.backgroundRepeat = 'no-repeat'
        gameContainer.style.backgroundPosition = 'center'
    } else {
        background.isGif = false
        gameContainer.style.backgroundImage = 'none'
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

    // Setup P1
    const p1ConfigToUse = (typeof characterData !== 'undefined' && characterData[player1Selection.toUpperCase()])
        ? characterData[player1Selection.toUpperCase()]
        : null
    // Setup P2
    const p2ConfigToUse = (typeof characterData !== 'undefined' && characterData[player2Selection.toUpperCase()])
        ? characterData[player2Selection.toUpperCase()]
        : null

    if (p1ConfigToUse) {
        const src = p1ConfigToUse.spriteSheetData.imageSrc
        const rows = p1ConfigToUse.spriteSheetData.rows || 1
        const cols = p1ConfigToUse.spriteSheetData.framesMax || 1

        // SOLUTION: Limit container height to show only row 0
        // If we have 4 rows, we want container to show only top 25% (1/4) of the sprite
        const scaleReduction = 0.35 // Reduced to 35% (was 70%, now 50% smaller)

        // Set container height to only show 1 row worth of content
        // Parent is 100% height, we want 1/rows of that to be visible through this window
        // RESTORED: Working height (+300px) to keep correct scale
        const containerHeightPercent = (100 / rows) * scaleReduction
        vsP1Img.style.height = `calc(${containerHeightPercent}% + 300px)`
        // NEW: Cut bottom 78px using MASK (doesn't affect background scale)
        vsP1Img.style.webkitMaskImage = 'linear-gradient(to bottom, black calc(100% - 78px), transparent calc(100% - 78px))'
        vsP1Img.style.maskImage = 'linear-gradient(to bottom, black calc(100% - 78px), transparent calc(100% - 78px))'
        vsP1Img.style.position = 'relative'
        vsP1Img.style.top = `calc(${50 - containerHeightPercent / 2}% - 280px)` // Shift up 280px (was 250px + 30px)

        // Now set background to show full sprite at proper size
        const bgWidth = cols * 600 * scaleReduction // Increased to 600 for wider character
        const bgHeight = rows * 52.5 * scaleReduction // Reduced to 52.5 (25% less than 70)

        vsP1Img.style.backgroundImage = `url(${src})`
        vsP1Img.style.backgroundSize = `${bgWidth}% ${bgHeight * rows}%` // Scale so each row fills container
        vsP1Img.style.backgroundPosition = `50% 0%` // Top (Row 0)
        vsP1Name.innerText = p1ConfigToUse.name
    }
    if (p2ConfigToUse) {
        const src = p2ConfigToUse.spriteSheetData.imageSrc
        const rows = p2ConfigToUse.spriteSheetData.rows || 1
        const cols = p2ConfigToUse.spriteSheetData.framesMax || 1

        // Show ONLY row 0 - same logic as P1
        const scaleReduction = 0.35 // Reduced to 35%

        // RESTORED: Working height
        const containerHeightPercent = (100 / rows) * scaleReduction
        vsP2Img.style.height = `calc(${containerHeightPercent}% + 300px)`
        // NEW: Cut bottom 78px using MASK
        vsP2Img.style.webkitMaskImage = 'linear-gradient(to bottom, black calc(100% - 78px), transparent calc(100% - 78px))'
        vsP2Img.style.maskImage = 'linear-gradient(to bottom, black calc(100% - 78px), transparent calc(100% - 78px))'
        vsP2Img.style.position = 'relative'
        vsP2Img.style.top = `calc(${50 - containerHeightPercent / 2}% - 280px)` // Shift up 280px

        const bgWidth = cols * 600 * scaleReduction // Increased to 600 for wider character
        const bgHeight = rows * 52.5 * scaleReduction // Reduced to 52.5

        vsP2Img.style.backgroundImage = `url(${src})`
        vsP2Img.style.backgroundSize = `${bgWidth}% ${bgHeight * rows}%`
        vsP2Img.style.backgroundPosition = `50% 0%`
        vsP2Name.innerText = p2ConfigToUse.name
    }

    // Show VS Screen
    vsScreen.style.display = 'flex'
    window.inputLocked = true // Lock inputs

    // Sound
    // audioManager.playVsSound() // If exists

    setTimeout(() => {
        vsScreen.style.display = 'none'
        window.inputLocked = false // Unlock inputs
        // NOW start the round with ROUND 1 / FIGHT messages
        startRound()
    }, 3000)

    // Player 1 Asset
    const p1Name = player1Selection ? player1Selection.toUpperCase() : 'UNKNOWN'
    const p1ConfigRaw = (typeof characterData !== 'undefined' && characterData[p1Name]) ? characterData[p1Name] : null

    // Default Fallback
    const p1Config = p1ConfigRaw || {
        scale: 2.5,
        offset: { x: 215, y: 157 },
        imageSrc: `./img/char_${p1Name.toLowerCase().replace(/ /g, '_')}.png`
    }

    // Helper to build sprites object
    const buildSprites = (config) => {
        const sprites = {}
        if (config.spriteSheetData) {
            const sheet = config.spriteSheetData
            // Populate based on states
            const allStates = ['idle', 'run', 'jump', 'fall', 'attack1', 'attack2', 'takeHit', 'death', 'block']
            allStates.forEach(state => {
                if (sheet.states[state]) {
                    sprites[state] = {
                        imageSrc: sheet.imageSrc,
                        framesMax: sheet.states[state].frames || sheet.framesMax,
                        row: sheet.states[state].row
                    }
                } else {
                    // Fallback to idle or row 0
                    sprites[state] = {
                        imageSrc: sheet.imageSrc,
                        framesMax: sheet.framesMax,
                        row: 0
                    }
                }
            })
        } else {
            // Static Image
            const img = config.imageSrc
            const defaults = ['idle', 'run', 'jump', 'fall', 'attack1', 'attack2', 'takeHit', 'death', 'block']
            defaults.forEach(state => {
                sprites[state] = { imageSrc: img, framesMax: 1 }
            })
        }
        return sprites
    }

    const p1Sprites = buildSprites(p1Config)

    // fightScale override? If using sheets, use config scale. If static, maybe use global override?
    // Let's rely on config.scale.
    // The previous code used 'fighterScale = 0.65' for static images.
    // We should respect config.scale but maybe default to 0.65 for static if not in roster.
    const p1Scale = (p1ConfigRaw ? p1Config.scale : 0.65) * 1.32

    // Position/Offset logic
    // p1Config.offset is likely based on the large sprites. 
    // If we use static, we used offset {x:45, y:0}.
    const p1Offset = p1ConfigRaw ? p1Config.offset : { x: 45, y: 0 }

    // Row Offsets: Use character-specific if available, otherwise use defaults
    const defaultRowOffsets = {
        0: { cropTop: 0, cropBottom: -15, offsetY: 0 },   // Zmiana: -25 -> -15 (odejmij 10px od dołu dla wszystkich)
        1: { cropTop: 30, cropBottom: 10, offsetY: 0 },   // Odejmij 30px od góry, odejmij 10px od dołu
        2: { cropTop: 0, cropBottom: 20, offsetY: 0 },    // Obetnij 10px od góry (było -10), przytnij 20px od dołu
        3: { cropTop: -5, cropBottom: 5, offsetY: 0 }     // Dodaj 5px od góry, odejmij 5px od dołu
    }
    const p1RowOffsets = (p1ConfigRaw && p1Config.rowOffsets)
        ? { ...defaultRowOffsets, ...p1Config.rowOffsets }  // Merge: character-specific overrides defaults
        : defaultRowOffsets

    player = new Fighter({
        position: { x: 200, y: 150 },
        velocity: { x: 0, y: 0 },
        offset: p1Offset,
        imageSrc: p1Config.imageSrc || (p1Config.spriteSheetData ? p1Config.spriteSheetData.imageSrc : ''),
        framesMax: p1Config.spriteSheetData ? (p1Config.spriteSheetData.states.idle.frames || 1) : 1,
        framesRow: 0,
        rows: p1Config.spriteSheetData ? (p1Config.spriteSheetData.rows || 1) : 1,
        cols: p1Config.spriteSheetData ? (p1Config.spriteSheetData.framesMax || 1) : 1, // Pass max cols
        frameHeight: p1Config.spriteSheetData ? p1Config.spriteSheetData.frameHeight : undefined,
        scale: p1Scale,
        removeBackground: false,
        sprites: p1Sprites,
        rowOffsets: p1RowOffsets,
        hitboxOffset: { x: -60, y: 0 }, // P1: Pulled back 30px toward character (from -90)
        attackBox: {
            offset: { x: 190, y: 50 },
            width: 160,
            height: 50
        }
    })

    // DEBUG: Check if rows applied
    if (player.rows === 1 && p1Config.spriteSheetData) {
        console.error("CRITICAL ERROR: Rows not applied to Player!", p1Config.spriteSheetData.rows);
    }

    // Player 2 Asset
    const p2Name = player2Selection ? player2Selection.toUpperCase() : 'UNKNOWN'
    const p2ConfigRaw = (typeof characterData !== 'undefined' && characterData[p2Name]) ? characterData[p2Name] : null

    const p2Config = p2ConfigRaw || {
        scale: 2.5,
        offset: { x: 215, y: 157 },
        imageSrc: `./img/char_${p2Name.toLowerCase().replace(/ /g, '_')}.png`
    }

    const p2Sprites = buildSprites(p2Config)
    const p2Scale = (p2ConfigRaw ? p2Config.scale : 0.65) * 1.32
    const p2Offset = p2ConfigRaw ? p2Config.offset : { x: 45, y: 0 }

    const p2RowOffsets = (p2ConfigRaw && p2Config.rowOffsets)
        ? { ...defaultRowOffsets, ...p2Config.rowOffsets }
        : defaultRowOffsets

    enemy = new Fighter({
        position: { x: 750, y: 150 },
        velocity: { x: 0, y: 0 },
        color: 'blue',
        offset: p2Offset,
        imageSrc: p2Config.imageSrc || (p2Config.spriteSheetData ? p2Config.spriteSheetData.imageSrc : ''),
        framesMax: p2Config.spriteSheetData ? (p2Config.spriteSheetData.states.idle.frames || 1) : 1,
        rows: p2Config.spriteSheetData ? (p2Config.spriteSheetData.rows || 1) : 1,
        cols: p2Config.spriteSheetData ? (p2Config.spriteSheetData.framesMax || 1) : 1,
        frameHeight: p2Config.spriteSheetData ? p2Config.spriteSheetData.frameHeight : undefined,
        scale: p2Scale,
        removeBackground: false,
        sprites: p2Sprites,
        rowOffsets: p2RowOffsets,
        hitboxOffset: { x: -190, y: 0 }, // P2: Shifted 30px right (from -160)
        attackBox: {
            offset: { x: 40, y: 50 },
            width: 160,
            height: 50
        }
    })

    // decreaseTimer() (Moved to startRound)
    // startRound is now called after VS screen timeout
    animate()
}

function startRound() {
    // Reset Positions & Stats
    player.position = { x: 200, y: 150 }
    player.velocity = { x: 0, y: 0 }
    player.health = player.maxHealth
    player.dead = false
    player.switchSprite('idle')
    // Reset Attack Box
    player.attackBox.position = { x: player.position.x, y: player.position.y }

    enemy.position = { x: 750, y: 150 }
    enemy.velocity = { x: 0, y: 0 }
    enemy.health = enemy.maxHealth
    enemy.dead = false
    enemy.switchSprite('idle')

    // Reset UI
    document.querySelector('#playerHealth').style.width = '100%'
    document.querySelector('#enemyHealth').style.width = '100%'
    document.querySelector('#timer').innerHTML = '60'
    clearTimeout(timerId)
    timer = 60

    // Hide Game Over (Just in case)
    document.getElementById('displayText').style.display = 'none'
    document.getElementById('gameOverMenu').style.display = 'none'

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
    // Audio
    if (audioManager) safeAudio('playRoundStart', window.currentRound)

    // Sequence
    setTimeout(() => {
        roundMsg.display = 'none' // Oops, style.display
        roundMsg.style.display = 'none'
        fightMsg.style.display = 'block'
    }, 1500)

    setTimeout(() => {
        overlay.style.display = 'none'
        window.inputLocked = false
        window.isRoundActive = true
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
    // DEBUG: Toggle hitboxes with 'H' key (works anytime)
    if (event.key === 'h' || event.key === 'H') {
        window.showDebugHitboxes = !window.showDebugHitboxes
        console.log('Debug Hitboxes:', window.showDebugHitboxes ? 'ON' : 'OFF')
        return
    }

    if (!gameStarted || inputLocked) return
    if (!window.isRoundActive || window.matchOver) return // Disable input if round not active
    switch (event.key) {
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
                player.velocity.y = -16 // Reduced from -20
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
                player.attack2()
                safeAudio('playAttack')
            }
            break

        // P2
        case 'ArrowRight':
            if (gameMode === 'PVE') break
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
        case 'ArrowLeft':
            if (gameMode === 'PVE') break
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
        case 'ArrowUp': // Jump P2
            if (gameMode === 'PVE') break
            if (enemy.velocity.y === 0) {
                enemy.velocity.y = -16 // Reduced from -20
            }
            break
        case 'Enter': // Punch
            if (gameMode === 'PVE') break
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
        case 'Shift': // Kick (Right Shift commonly)
        case 'Control':
            if (gameMode === 'PVE') break
            if (!enemy.isAttacking && !enemy.isBlocking) {
                enemy.attack2()
                safeAudio('playAttack')
            }
            break
        case 'ArrowDown': // Block P2
            if (gameMode === 'PVE') break
            enemy.isBlocking = true
            enemy.velocity.x = 0 // Stop moving when blocking
            break
    }
})

window.addEventListener('keyup', (event) => {
    if (!gameStarted || inputLocked) return
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


function animate() {
    if (!gameStarted) return
    window.requestAnimationFrame(animate)

    // HIT STOP LOGIC
    if (frameFreeze > 0) {
        frameFreeze--
        // Draw black background or keep last frame?
        // Actually, for hitstop we usually just PAUSE updates but KEEP DRAWING the same state.
        // However, standard requestAnimationFrame clears canvas usually.
        // If we skip everything, the canvas might flicker or be empty if we did clearRect elsewhere.
        // But here we do fillRect black right below.
        // A simple "pause" is to skip update() calls but perform draw() calls.
        // But our draw is coupled with update() in classes.
        // So we will just RETURN early effectively "pausing" the frame completely visuals included? 
        // No, visual pause is exactly what we want.
        // But we need to ensure we don't clear the canvas if we return?
        // If we return here, the previous frame persists on canvas! Perfect.
        return
    }

    c.fillStyle = 'black'
    // GIF BACKGROUND SUPPORT
    if (background && background.isGif) {
        c.clearRect(0, 0, canvas.width, canvas.height)
    } else {
        c.fillRect(0, 0, canvas.width, canvas.height)
    }

    // ARCADE: Apply Zoom
    c.save()

    // Zoom Logic
    let targetScale = 1
    let targetX = 0
    let targetY = 0

    if (window.matchOver && window.winningPlayer) {
        targetScale = 2.0

        // ARCADE: Play Zoom Sound
        if (!zoomSoundPlayed) {
            safeAudio('playSound', 'close')
            zoomSoundPlayed = true
        }

        // Focus on winner center
        const focusX = window.winningPlayer.position.x + 75 // approx center width
        const focusY = window.winningPlayer.position.y + 75

        // Center the camera on focus point
        // Camera View = (Canvas center) - (Focus * Scale)
        targetX = (canvas.width / 2) - (focusX * targetScale)
        targetY = (canvas.height / 2) - (focusY * targetScale)

        // Clamp Y to not show below ground too much?? 
        // Actually, just let it center.
    }

    // Smooth Interpolation (LERP)
    camera.scale += (targetScale - camera.scale) * 0.05
    camera.x += (targetX - camera.x) * 0.05
    camera.y += (targetY - camera.y) * 0.05

    // Apply Transform
    if (camera.scale > 1.01) {
        c.translate(camera.x, camera.y)
        c.scale(camera.scale, camera.scale)
    }

    // Draw Background (Only if NOT GIF)
    if (!background.isGif) {
        background.update()
    }
    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0, canvas.height - 96, canvas.width, 96)
    c.fillRect(0, canvas.height - 96, canvas.width, 96)

    // 1. RESET VELOCITIES
    if (!player.isKnockedBack && !player.isDashing) player.velocity.x = 0
    if (!enemy.isKnockedBack && !enemy.isDashing) enemy.velocity.x = 0

    // 2. INPUT & AI
    if (window.isRoundActive && !window.matchOver) {
        // PVE AI LOGIC
        if (gameMode === 'PVE' && enemy && player && !enemy.dead && !enemy.isKnockedBack) {
            try {
                updateAI(enemy, player)
            } catch (err) {
                console.error("AI Error suppressed:", err)
            }
        }

        // P1 Movement
        if (!player.isKnockedBack && !player.isDashing) {
            if (keys.a.pressed && player.lastKey === 'a' && !player.isBlocking) {
                player.velocity.x = -4 // Reduced from -5
            } else if (keys.d.pressed && player.lastKey === 'd' && !player.isBlocking) {
                player.velocity.x = 4 // Reduced from 5
            }
        }
    }

    // P2 Movement (Keyboard - Only if PVP)
    // If PVE, updateAI has already set velocity.x, so we don't touch it here unless keys override (which we blocked in keydown)
    // P2 Movement (Keyboard - Only if PVP)
    // If PVE, updateAI has already set velocity.x, so we don't touch it here unless keys override (which we blocked in keydown)
    if (gameMode === 'PVP' && window.isRoundActive && !window.matchOver && !enemy.isKnockedBack && !enemy.isDashing) {
        if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
            enemy.velocity.x = -4 // Reduced from -5
        } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
            enemy.velocity.x = 4 // Reduced from 5
        }
    }

    // 3. UPDATE PHYSICS
    player.update()
    enemy.update()

    // ARCADE: Update Particles & Text (World Space)
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        } else {
            particle.update()
        }
    })

    floatingTexts.forEach((text, index) => {
        if (text.alpha <= 0 || text.lifeTime <= 0) {
            floatingTexts.splice(index, 1)
        } else {
            text.update()
        }
    })

    // Restore Canvas Context after sprites
    c.restore()

    // 4. FACE EACH OTHER (FLIPPING)
    if (player.position.x < enemy.position.x) {
        player.flipHorizontal = false
        enemy.flipHorizontal = true
    } else {
        player.flipHorizontal = true
        enemy.flipHorizontal = false
    }

    // Collision & Hits
    // Player hits Enemy
    // Player hits Enemy
    if (
        rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
        player.isAttacking &&
        !player.hasHit
    ) {
        player.hasHit = true // Mark as hit to prevent multi-damage
        const knockbackDir = enemy.position.x > player.position.x ? 1 : -1

        if (enemy.isBlocking) {
            // Blocked! -> Chip Damage (2) & Small Push (20px)
            enemy.health = Math.max(0, enemy.health - 2)
            enemy.position.x += knockbackDir * 20
            document.querySelector('#enemyHealth').style.width = (enemy.health / enemy.maxHealth * 100) + '%'
            safeAudio('playAttack') // Thud sound ideally, but reusing attack for now
        } else {
            // Hit!
            // ARCADE: Spawn Particles
            const hitX = enemy.position.x + enemy.width / 2
            const hitY = enemy.position.y + enemy.height / 2

            if (player.isSuperAttack) {
                // SUPER ATTACK PARTICLES (More + Energy type)
                // Blood
                for (let i = 0; i < 10; i++) {
                    particles.push(new Particle({
                        position: { x: hitX, y: hitY },
                        velocity: { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 },
                        type: 'blood',
                        imageSrc: './img/blood.png'
                    }))
                }
                // Energy Particles (Golden)
                for (let i = 0; i < 12; i++) {
                    particles.push(new Particle({
                        position: { x: hitX, y: hitY },
                        velocity: { x: (Math.random() - 0.5) * 15, y: (Math.random() - 0.5) * 15 },
                        type: 'energy',
                        imageSrc: './img/spark.png',
                        color: '#FFD700'
                    }))
                }
                // Screen Crack Effect
                if (window.arcadeEffects) window.arcadeEffects.screenCrack()
                // Heavy Screen Shake
                if (window.arcadeEffects) window.arcadeEffects.screenShake('heavy')
            } else {
                // NORMAL ATTACK PARTICLES
                // Blood
                for (let i = 0; i < 6; i++) {
                    particles.push(new Particle({
                        position: { x: hitX, y: hitY },
                        velocity: { x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 6 },
                        type: 'blood',
                        imageSrc: './img/blood.png'
                    }))
                }
                // Impact Particles
                for (let i = 0; i < 8; i++) {
                    particles.push(new Particle({
                        position: { x: hitX, y: hitY },
                        velocity: { x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10 },
                        type: 'impact',
                        imageSrc: './img/spark.png'
                    }))
                }
                // Medium Screen Shake
                if (window.arcadeEffects) window.arcadeEffects.screenShake('medium')
            }

            // Floating Text
            floatingTexts.push(new FloatingText({
                position: { x: hitX, y: hitY - 50 },
                text: player.currentDamage,
                color: '#ffeb3b',
                velocity: { x: (Math.random() - 0.5) * 2, y: -3 }
            }))

            if (player.isSuperAttack) {
                // SUPER KNOCKBACK
                enemy.takeHit(player.currentDamage)
                enemy.velocity.x = knockbackDir * 50 // HIGH VELOCITY
                enemy.velocity.y = -5
                enemy.isKnockedBack = true
                enemy.superEffectActive = true

                setTimeout(() => {
                    enemy.isKnockedBack = false
                    enemy.superEffectActive = false
                }, 800)

                safeAudio('playHit')
            } else {
                enemy.takeHit(player.currentDamage)
                enemy.position.x += knockbackDir * 100
                safeAudio('playHit')
            }

            // HIT STOP
            frameFreeze = 6 // Freeze for 6 frames (~100ms)

            document.querySelector('#enemyHealth').style.width = (enemy.health / enemy.maxHealth * 100) + '%'

            // ARCADE: Combo Logic P1
            player.comboCount++
            clearTimeout(comboTimer)
            comboEl.style.display = 'block'
            comboEl.innerText = player.comboCount + " HITS!"
            comboEl.style.color = '#ffeb3b' // Yellow for P1
            // Reset Combo after 1.5s
            comboTimer = setTimeout(() => {
                player.comboCount = 0
                comboEl.style.display = 'none'
            }, 1000)
        }
    }

    // Player Misses - Logic Removed (Handled by Timeout)

    // Enemy hits Player
    if (
        rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
        enemy.isAttacking &&
        !enemy.hasHit
    ) {
        enemy.hasHit = true
        const knockbackDir = player.position.x > enemy.position.x ? 1 : -1

        if (player.isBlocking) {
            // Blocked! -> Chip Damage (2) & Small Push (20px)
            player.health = Math.max(0, player.health - 2)
            player.position.x += knockbackDir * 20
            document.querySelector('#playerHealth').style.width = (player.health / player.maxHealth * 100) + '%'
            safeAudio('playAttack')
        } else {
            // Hit!
            // ARCADE: Spawn Particles
            const hitX = player.position.x + player.width / 2
            const hitY = player.position.y + player.height / 2

            if (enemy.isSuperAttack) {
                // SUPER ATTACK PARTICLES (More + Energy type)
                // Blood
                for (let i = 0; i < 10; i++) {
                    particles.push(new Particle({
                        position: { x: hitX, y: hitY },
                        velocity: { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 },
                        type: 'blood',
                        imageSrc: './img/blood.png'
                    }))
                }
                // Energy Particles (Cyan)
                for (let i = 0; i < 12; i++) {
                    particles.push(new Particle({
                        position: { x: hitX, y: hitY },
                        velocity: { x: (Math.random() - 0.5) * 15, y: (Math.random() - 0.5) * 15 },
                        type: 'energy',
                        imageSrc: './img/spark.png',
                        color: '#00FFFF'
                    }))
                }
                // Screen Crack Effect
                if (window.arcadeEffects) window.arcadeEffects.screenCrack()
                // Heavy Screen Shake
                if (window.arcadeEffects) window.arcadeEffects.screenShake('heavy')
            } else {
                // NORMAL ATTACK PARTICLES
                // Blood
                for (let i = 0; i < 6; i++) {
                    particles.push(new Particle({
                        position: { x: hitX, y: hitY },
                        velocity: { x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 6 },
                        type: 'blood',
                        imageSrc: './img/blood.png'
                    }))
                }
                // Impact Particles
                for (let i = 0; i < 8; i++) {
                    particles.push(new Particle({
                        position: { x: hitX, y: hitY },
                        velocity: { x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10 },
                        type: 'impact',
                        imageSrc: './img/spark.png'
                    }))
                }
                // Medium Screen Shake
                if (window.arcadeEffects) window.arcadeEffects.screenShake('medium')
            }

            // Floating Text
            floatingTexts.push(new FloatingText({
                position: { x: hitX, y: hitY - 50 },
                text: enemy.currentDamage,
                color: '#ff0055',
                velocity: { x: (Math.random() - 0.5) * 2, y: -3 }
            }))

            if (enemy.isSuperAttack) {
                // SUPER KNOCKBACK
                player.takeHit(enemy.currentDamage)
                player.velocity.x = knockbackDir * 50 // HIGH VELOCITY
                player.velocity.y = -5
                player.isKnockedBack = true
                player.superEffectActive = true

                setTimeout(() => {
                    player.isKnockedBack = false
                    player.superEffectActive = false
                }, 800)

                safeAudio('playHit')
            } else {
                player.takeHit(enemy.currentDamage)
                player.position.x += knockbackDir * 100
                safeAudio('playHit')
            }

            // HIT STOP
            frameFreeze = 6 // Freeze for 6 frames (~100ms)

            document.querySelector('#playerHealth').style.width = (player.health / player.maxHealth * 100) + '%'

            // ARCADE: Combo Logic P2
            enemy.comboCount++
            clearTimeout(comboTimer)
            comboEl.style.display = 'block'
            comboEl.innerText = enemy.comboCount + " HITS!"
            comboEl.style.color = '#00ffff' // Cyan for P2
            // Reset Combo after 1.5s
            comboTimer = setTimeout(() => {
                enemy.comboCount = 0
                comboEl.style.display = 'none'
            }, 1000)
        }
    }

    // Enemy Misses - Logic Removed (Handled by Timeout)

    // Update Energy Interface
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

    // End Game
    if ((enemy.health <= 0 || player.health <= 0) && window.isRoundActive) {
        window.isRoundActive = false
        determineWinner({ player, enemy, timerId })
    }
    // AI Function
}

function updateAI(ai, opponent) {
    if (!window.isRoundActive) return // Don't move if round hasn't started
    if (ai.death || opponent.death) return

    // AI Variables
    const dx = opponent.position.x - ai.position.x
    const dist = Math.abs(dx)

    // AGGRESSIVE AI BEHAVIOR
    // 1. Always Face Opponent
    if (dist > 100) {
        // Move towards
        if (dx > 0) {
            ai.velocity.x = 3 // Reduced from 4
            ai.switchSprite('run')
            ai.lastKey = 'ArrowRight'
        } else {
            ai.velocity.x = -3 // Reduced from -4
            ai.switchSprite('run')
            ai.lastKey = 'ArrowLeft'
        }
    } else {
        // Close distance
        ai.velocity.x = 0
        ai.switchSprite('idle')

        // Attack Aggressively (Nerfed)
        // 2% chance per frame
        if (Math.random() < 0.02) {
            if (Math.random() < 0.5) ai.attack()
            else ai.attack2()
        }
    }

    // Jump if opponent jumps or randomly (Nerfed)
    if (ai.velocity.y === 0) {
        if (Math.random() < 0.002 || (opponent.velocity.y < 0 && Math.random() < 0.02)) {
            ai.velocity.y = -16 // Reduced from -20
        }
    }
}

// SOFT RESET TO MAIN MENU
// SOFT RESET TO MAIN MENU
function returnToMenu() {
    gameStarted = false
    clearTimeout(window.timerId) // Stop Game Timer
    window.inputLocked = false // Reset Input Lock

    document.getElementById('gameOverMenu').style.display = 'none'
    document.getElementById('gameScreen').style.display = 'none'
    document.getElementById('roundOverlay').style.display = 'none'

    // Stop Fight Music / Play Menu Music handled by showMainMenu

    // Reset Fighters
    window.matchOver = false
    window.winningPlayer = null
    zoomSoundPlayed = false // Reset Zoom Sound flag
    camera = { x: 0, y: 0, scale: 1 } // Reset Camera
    if (player) {
        player.dead = false
        player.health = player.maxHealth
        document.querySelector('#playerHealth').style.width = '100%'
    }
    if (enemy) {
        enemy.dead = false
        enemy.health = enemy.maxHealth
        document.querySelector('#enemyHealth').style.width = '100%'
    }

    // Reset Selection
    p1Confirmed = false
    p2Confirmed = false
    mapSelectionActive = false
    mapSelectionScreen.style.display = 'none'
    menuScreen.style.display = 'none'

    // Show Main Menu
    showMainMenu()
}

// ==========================================
// MOBILE CONTROLS IMPLEMENTATION
// ==========================================

const mobileControls = document.getElementById('mobile-controls')
const mobileToggle = document.getElementById('mobile-toggle')
const dpadButtons = document.querySelectorAll('.dpad-btn')
const actionButtons = document.querySelectorAll('.action-btn')

// Toggle Controls Visibility
mobileToggle.addEventListener('click', () => {
    if (mobileControls.style.display === 'none') {
        mobileControls.style.display = 'flex'
    } else {
        mobileControls.style.display = 'none'
    }
})

// Prevent context menu on long press
window.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};

// Helper to trigger key events
function triggerKey(key, type) {
    const event = new KeyboardEvent(type, {
        key: key,
        bubbles: true
    })
    window.dispatchEvent(event)
}

// Touch Handlers for D-Pad and Actions
function setupTouchControls(buttons) {
    buttons.forEach(btn => {
        const key = btn.getAttribute('data-key')

        const startHandler = (e) => {
            e.preventDefault() // Prevent scrolling/zooming
            if (key === ' ') {
                // Space needs special handling in handleKeyDown potentially, 
                // but dispatching event works for general logic
                // But for menu confirmation, we need to ensure it works.
            }
            triggerKey(key, 'keydown')
            btn.style.backgroundColor = 'rgba(255, 255, 255, 0.5)' // Visual feedback
            if (btn.id.includes('kick') || btn.id.includes('punch')) {
                btn.style.backgroundColor = 'rgba(255, 0, 85, 0.5)'
                if (btn.id.includes('punch')) btn.style.backgroundColor = 'rgba(0, 255, 255, 0.5)'
            }
        }

        const endHandler = (e) => {
            e.preventDefault()
            triggerKey(key, 'keyup')
            btn.style.backgroundColor = '' // Reset visual
            // Restore original colors/opacity logic if needed, or rely on CSS :active which might not work with touchstart prevention
            // if (btn.classList.contains('dpad-btn')) itemStyle = "rgba(255, 255, 255, 0.2)"
            // Simple reset to class default is handled by removing inline style usually, 
            // but here we set inline style on press. 
            btn.style.cssText = "" // Clear inline styles to revert to CSS class
        }

        btn.addEventListener('touchstart', startHandler, { passive: false })
        btn.addEventListener('touchend', endHandler, { passive: false })
        btn.addEventListener('mousedown', startHandler) // For mouse testing
        btn.addEventListener('mouseup', endHandler)
    })
}

setupTouchControls(dpadButtons)
setupTouchControls(actionButtons)


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
    if (!statsManager) return
    icebergList.innerHTML = ''

    try {
        // Use Mock Data for Visualization as requested
        const data = statsManager.getMockIcebergData()

        // CONTAINER FOR 3 PYRAMIDS
        // We need a flex container here.
        // Clearning styles first
        icebergList.style.display = 'flex'
        icebergList.style.flexDirection = 'column'
        icebergList.style.alignItems = 'center'
        icebergList.style.gap = '20px'
        icebergList.style.overflowY = 'auto' // Re-enable scroll for vertical layout
        // expanded max width
        icebergList.style.maxWidth = '95%'

        // 1. HEADER IMAGE REMOVED (Background used instead)

        // 2. MAIN ROW (3 CATEGORIES)
        const categoriesContainer = document.createElement('div')
        categoriesContainer.style.display = 'flex'
        categoriesContainer.style.gap = '40px'
        categoriesContainer.style.width = '100%'
        categoriesContainer.style.justifyContent = 'center'
        categoriesContainer.style.flexWrap = 'wrap' // Mobile friendlier

        // HELPER TO BUILD PYRAMID
        const createPyramid = (title, items, color) => {
            const container = document.createElement('div')
            container.style.display = 'flex'
            container.style.flexDirection = 'column'
            container.style.alignItems = 'center'

            // Title
            const h3 = document.createElement('h3')
            h3.innerText = title
            h3.style.color = color
            h3.style.fontFamily = "'Press Start 2P'"
            h3.style.fontSize = '12px'
            h3.style.marginBottom = '10px'
            h3.style.textShadow = `2px 2px ${color}40` // semi transparent shadow
            container.appendChild(h3)

            // Items (6 total: 3 -> 2 -> 1)
            // Row 1 (Top) - 3 items
            const row1 = document.createElement('div')
            row1.style.display = 'flex'; row1.style.gap = '5px'; row1.style.marginBottom = '5px'
            items.slice(0, 3).forEach(item => row1.appendChild(createBadge(item, color)))
            container.appendChild(row1)

            // Row 2 (Mid) - 2 items
            const row2 = document.createElement('div')
            row2.style.display = 'flex'; row2.style.gap = '5px'; row2.style.marginBottom = '5px'
            items.slice(3, 5).forEach(item => row2.appendChild(createBadge(item, color)))
            container.appendChild(row2)

            // Row 3 (Bot) - 1 item
            const row3 = document.createElement('div')
            row3.style.display = 'flex'; row3.style.gap = '5px';
            if (items[5]) row3.appendChild(createBadge(items[5], color))
            container.appendChild(row3)

            return container
        }

        const createBadge = (item, color) => {
            const el = document.createElement('div')
            el.innerText = item.name
            el.style.backgroundColor = `${color}33` // 20% opacity
            el.style.border = `1px solid ${color}`
            el.style.color = 'white'
            el.style.padding = '5px'
            el.style.fontSize = '10px' // Increased font
            el.style.fontFamily = "'Press Start 2P'"
            el.style.textAlign = 'center'
            el.style.width = '150px' // Increased width
            el.style.whiteSpace = 'nowrap'
            el.style.overflow = 'hidden'
            el.style.textOverflow = 'ellipsis'
            return el
        }

        // APPEND PYRAMIDS
        // Vertical Stack
        const pyramidContainer = document.createElement('div')
        pyramidContainer.style.display = 'flex'
        pyramidContainer.style.flexDirection = 'column'
        pyramidContainer.style.gap = '30px'
        pyramidContainer.style.alignItems = 'center'
        pyramidContainer.style.width = '100%'
        pyramidContainer.style.paddingBottom = '40px' // Space for scrolling

        pyramidContainer.appendChild(createPyramid("NAJCZESCIEJ WYBIERANE", data.picks, "#00ffff"))
        pyramidContainer.appendChild(createPyramid("NAJCZESCIEJ WYGRYWAJA", data.wins, "#00ff00"))
        pyramidContainer.appendChild(createPyramid("NAJCZESCIEJ PRZEGRYWAJA", data.losses, "#ff0055"))

        icebergList.appendChild(pyramidContainer)

    } catch (e) {
        console.error("Critical Render Error:", e)
        const errorMsg = e && e.message ? e.message : "Unknown Error"
        icebergList.innerHTML = '<div style="color:red; text-align:center; padding:20px;">' +
            'CRITICAL ERROR:<br>' + errorMsg + '<br>' +
            '<button onclick="localStorage.clear(); location.reload()" style="margin-top:20px; padding:10px; background:red; color:white; border:2px solid white;">RESET DANYCH (NAPRAWCZE)</button>' +
            '</div>'
    }
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
                // Add more as needed or fetch dynamic if possible later
            }

            return birthdays[key] || "Nieznany Bohater"
        }

        const birthdayPerson = getBirthdayPerson()
        const birthdayMsg = birthdayPerson !== "Nieznany Bohater" ? ` >>> DZIS URODZIL SIE: ${birthdayPerson.toUpperCase()}` : ""

        message = `>>> ${randomInfo} >>> CYTAT NA DZIS: "${randomVerse}"${birthdayMsg} >>> MILEGO GRANIA!`
    } else {
        message = "+++ 2020 FIGHTERS +++ LOADING... +++"
    }

    // Add some padding text for scrolling
    newsContent.innerText = message + "       " + message
}

// Init
initTicker()

// Override showMainMenu to ensure Ticker is Visible
// Audio & Ticker Hooks
const originalShowMainMenu = window.showMainMenu || function () { }
window.showMainMenu = function () {
    originalShowMainMenu()
    if (typeof newsTickerBar !== 'undefined' && newsTickerBar) newsTickerBar.style.display = 'flex'
    // Play Menu Music
    if (typeof audioManager !== 'undefined' && typeof audioManager.playMusic === 'function') {
        safeAudio('playMusic', 'menu')
    }
}

// Hook into startGame (assumed global) to play music
const originalStartGameFn = startGame
startGame = function () {
    if (typeof newsTickerBar !== 'undefined' && newsTickerBar) newsTickerBar.style.display = 'none'

    // Play Fight Music (Announcer sounds now in startRound)
    if (typeof audioManager !== 'undefined' && typeof audioManager.playMusic === 'function') {
        safeAudio('playMusic', 'fight')
    }

    originalStartGameFn()
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
    options.forEach((opt, index) => {
        if (index === mainMenuIndex) {
            opt.classList.add('selected')
        } else {
            opt.classList.remove('selected')
        }
    })
}

function handleMainMenuSelection() {
    // 0: P1 vs P2
    // 1: P1 vs CPU
    // 2: Online
    // 3: Stats
    // 4: Controls
    // 5: Sound
    // 6: Fullscreen

    if (mainMenuIndex === 0) {
        // PVP
        gameMode = 'PVP'
        showCharSelect()
    } else if (mainMenuIndex === 1) {
        // PVE
        gameMode = 'PVE'
        showCharSelect()
    } else if (mainMenuIndex === 2) {
        // Online
        // alert('TRYB ONLINE DOSTEPNY WKROTCE (WERSJA BETA)')
        mainMenuActive = false
        document.getElementById('mainMenuScreen').style.display = 'none'
        document.getElementById('onlineScreen').style.display = 'flex'
        if (window.networkManager) window.networkManager.connect()
    } else if (mainMenuIndex === 3) {
        // Stats
        showStatsScreen()
    } else if (mainMenuIndex === 4) {
        // Controls
        controlsActive = true
        document.getElementById('controlsScreen').style.display = 'flex'
    } else if (mainMenuIndex === 5) {
        // Sound
        soundEnabled = !soundEnabled
        const soundOpt = document.querySelectorAll('.menu-option')[5]
        soundOpt.innerText = "DZWIEK: " + (soundEnabled ? "ON" : "OFF")

        if (typeof audioManager !== 'undefined') {
            audioManager.muted = !soundEnabled
            if (audioManager.muted) {
                safeAudio('stopMusic')
            } else {
                safeAudio('playMusic', 'menu')
            }
        }
    } else if (mainMenuIndex === 6) {
        // Fullscreen
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

function showCharSelect() {
    mainMenuActive = false
    document.getElementById('mainMenuScreen').style.display = 'none'
    document.getElementById('menuScreen').style.display = 'flex'

    if (typeof statsScreen !== 'undefined') statsScreen.style.display = 'none'

    // Reset Selection
    p1Index = 0
    p2Index = 1
    p1Confirmed = false
    p2Confirmed = false
    updateMenuVisuals()
}

// Ensure stats are hidden when returning to main menu as well (handled in showMainMenu mostly but good to be safe)
const originalShowMainMenu2 = window.showMainMenu
window.showMainMenu = function () {
    if (typeof statsScreen !== 'undefined') statsScreen.style.display = 'none'
    if (originalShowMainMenu2) originalShowMainMenu2()
    // Re-apply ticker logic if needed, but originalShowMainMenu2 (which is the accumulating wrapper) might already do it. 
    // Actually, we are wrapping the wrapper. Let's be careful.
    // The previous wrapper was: window.showMainMenu = function() { originalShowMainMenu(); ... }
    // If we wrap again, we might create a loop or double call. 
    // Safest is to just modify the returnToMenu or rely on the fact that showMainMenu clears mostly everything.
    // But showMainMenu definition in main.js (line 478) only hides intro and menuScreen.
    // It DOES NOT hide statsScreen. So we MUST update showMainMenu or the wrapper.
    // Let's rely on this wrapper effectively patching it.
}

// ==========================================
// ONLINE MULTIPLAYER LOGIC
// ==========================================

window.startOnlineGame = function() {
    gameMode = 'ONLINE'
    document.getElementById('onlineScreen').style.display = 'none'
    
    // Auto-select characters for BETA (Host=P1, Guest=P2)
    // We need to ensure roster is loaded. 
    // Defaults:
    if (!player1Selection) player1Selection = allCharacters[0]
    if (!player2Selection) player2Selection = allCharacters[1]
    
    p1Confirmed = true
    p2Confirmed = true
    
    console.log("STARTING ONLINE GAME via Map Selection")
    goToMapSelection()
}

window.handleOnlineInput = function(data) {
    // data: { key: 'w', type: 'keydown' }
    // Dispatch event to local window so main game logic handles it
    
    // Custom event dispatching logic tailored for our game's listeners
    // We construct a generic object that mimics the event because 'new KeyboardEvent' 
    // might be read-only or untrusted in some contexts, but usually works.
    // However, our existing listeners checking 'event.key' is enough.
    
    // We add a special property 'isRemote' to avoid echo loops
    const event = new KeyboardEvent(data.type, { key: data.key })
    Object.defineProperty(event, 'isRemote', { value: true, writable: false })
    
    window.dispatchEvent(event)
}

// Global Online Listeners
window.addEventListener('keydown', (e) => {
    if (gameMode !== 'ONLINE' || e.isRemote || e.repeat) return
    if (window.networkManager && window.networkManager.isOnline) {
        window.networkManager.sendInput({ key: e.key, type: 'keydown' })
    }
})

window.addEventListener('keyup', (e) => {
    if (gameMode !== 'ONLINE' || e.isRemote) return
    if (window.networkManager && window.networkManager.isOnline) {
        window.networkManager.sendInput({ key: e.key, type: 'keyup' })
    }
})
