function rectangularCollision({ rectangle1, rectangle2 }) {
    // Get hitbox offset (default to 0 if not defined)
    const r2OffsetX = rectangle2.hitboxOffset ? rectangle2.hitboxOffset.x : 0
    const r2OffsetY = rectangle2.hitboxOffset ? rectangle2.hitboxOffset.y : 0

    // Flip offset based on character direction
    const actualOffsetX = rectangle2.flipHorizontal ? -r2OffsetX : r2OffsetX

    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x + actualOffsetX &&
        rectangle1.attackBox.position.x <=
        rectangle2.position.x + actualOffsetX + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y + r2OffsetY &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + r2OffsetY + rectangle2.height
    )
}

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'none'

    // 1. Determine Round Winner
    let roundWinner = null
    if (player.health === enemy.health) {
        roundWinner = 'draw'
    } else if (player.health > enemy.health) {
        roundWinner = 'p1'
    } else {
        roundWinner = 'p2'
    }

    // 2. K.O. / Time Up Display
    const overlay = document.getElementById('roundOverlay')
    const roundMsg = document.getElementById('roundMessage')
    const fightMsg = document.getElementById('fightMessage')

    overlay.style.display = 'flex'
    fightMsg.style.display = 'none'
    roundMsg.style.display = 'block'

    // Choose Message
    if (timer === 0) {
        roundMsg.innerText = "TIME UP"
    } else {
        roundMsg.innerText = "K.O."
        if (typeof audioManager !== 'undefined') audioManager.playKO()
        // Trigger K.O. Red Overlay
        if (window.arcadeEffects) window.arcadeEffects.koOverlay()
    }

    // 3. Update Stats & Check Match
    // Wait small delay to let K.O. sink in
    setTimeout(() => {
        if (roundWinner === 'p1') {
            window.p1Wins++
            const pips = document.querySelectorAll('#p1Pips .round-pip')
            if (pips[window.p1Wins - 1]) pips[window.p1Wins - 1].classList.add('filled')
        } else if (roundWinner === 'p2') {
            window.p2Wins++
            const pips = document.querySelectorAll('#p2Pips .round-pip')
            if (pips[window.p2Wins - 1]) pips[window.p2Wins - 1].classList.add('filled')
        }

        // 4. Decision: Match Over or Next Round?
        if (window.p1Wins >= 2 || window.p2Wins >= 2) {
            // MATCH OVER
            endMatch(roundWinner)
        } else {
            window.currentRound++
            startRound()
        }
    }, 3000)
}

function endMatch(winner) {
    const gameOverMenu = document.getElementById('gameOverMenu')
    const gameOverSubtext = document.getElementById('gameOverSubtext')
    // Hide overlay
    document.getElementById('roundOverlay').style.display = 'none'

    gameOverMenu.style.display = 'flex'

    // Stop Fight Music on Match End
    if (typeof audioManager !== 'undefined') audioManager.stopMusic()

    // ARCADE: Winner Zoom
    window.matchOver = true

    if (winner === 'p1') {
        gameOverSubtext.innerText = 'WYGRAŁ GRACZ 1'
        window.winningPlayer = player // Start Zoom on P1
        if (typeof statsManager !== 'undefined' && typeof player1Selection !== 'undefined' && typeof player2Selection !== 'undefined') {
            statsManager.recordMatch(player1Selection, player2Selection, player1Selection)
        }
    } else if (winner === 'p2') {
        gameOverSubtext.innerText = 'WYGRAŁ GRACZ 2'
        window.winningPlayer = enemy // Start Zoom on P2
        if (typeof statsManager !== 'undefined' && typeof player1Selection !== 'undefined' && typeof player2Selection !== 'undefined') {
            statsManager.recordMatch(player1Selection, player2Selection, player2Selection)
        }
    } else {
        gameOverSubtext.innerText = 'REMIS'
        window.winningPlayer = null // No zoom on draw
        if (typeof statsManager !== 'undefined' && typeof player1Selection !== 'undefined' && typeof player2Selection !== 'undefined') {
            statsManager.recordMatch(player1Selection, player2Selection, 'DRAW')
        }
    }
}

var timer = 60
var timerId
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if (timer === 0 && window.isRoundActive) {
        window.isRoundActive = false
        determineWinner({ player, enemy, timerId })
    }
}

function shakeScreen() {
    const screen = document.getElementById('gameScreen')
    if (!screen) return

    // Reset to re-trigger
    screen.classList.remove('shake-effect')
    void screen.offsetWidth // Force Reflow
    screen.classList.add('shake-effect')

    // Remove after animation (cleanup)
    setTimeout(() => {
        screen.classList.remove('shake-effect')
    }, 450)
}

function triggerScreenFlash() {
    const div = document.createElement('div')
    div.classList.add('screen-flash')
    document.body.appendChild(div)
    setTimeout(() => {
        div.remove()
    }, 200)
}