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

// determineWinner and endMatch removed to avoid conflict with game_core.js logic
// Logic is now centralized in window.determineWinner (game_core.js)

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
        if (typeof window.determineWinner === 'function') {
            window.determineWinner({ player, enemy, timerId: null })
        }
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