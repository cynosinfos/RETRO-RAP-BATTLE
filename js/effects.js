// ============================================
// RETRO ARCADE EFFECTS SYSTEM
// ============================================

// Global variables
window.comboCount = 0;
window.comboTimeout = null;
window.lastHitTime = 0;

// Initialize effect containers
function initEffects() {
    const gameScreen = document.querySelector('div[style*="position: relative"]') || document.body;

    // Combo Counter Container
    if (!document.getElementById('comboCounter')) {
        const comboDiv = document.createElement('div');
        comboDiv.id = 'comboCounter';
        gameScreen.appendChild(comboDiv);
    }

    // Performance Text Container
    if (!document.getElementById('performanceText')) {
        const perfDiv = document.createElement('div');
        perfDiv.id = 'performanceText';
        gameScreen.appendChild(perfDiv);
    }
}

// 2. Glitch Effect on Super Attack
function triggerGlitchEffect() {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    canvas.classList.add('glitch-effect');
    setTimeout(() => {
        canvas.classList.remove('glitch-effect');
    }, 300);
}

// 4. Combo Counter System
function updateCombo(isHit) {
    const now = Date.now();

    if (isHit) {
        // Reset combo if too much time has passed (1.5 seconds)
        if (now - window.lastHitTime > 1500) {
            window.comboCount = 0;
        }

        window.comboCount++;
        window.lastHitTime = now;

        // Clear existing timeout
        if (window.comboTimeout) {
            clearTimeout(window.comboTimeout);
        }

        // Show combo text
        showComboText();

        // Auto-reset after 2 seconds of no hits
        window.comboTimeout = setTimeout(() => {
            window.comboCount = 0;
        }, 2000);
    }
}

function showComboText() {
    const comboDiv = document.getElementById('comboCounter');
    if (!comboDiv) return;

    const count = window.comboCount;
    let text = '';
    let isUltra = false;

    if (count === 2) text = 'HIT x2!';
    else if (count === 3) text = 'COMBO!';
    else if (count === 4) text = 'GREAT!';
    else if (count === 5) text = 'AWESOME!';
    else if (count >= 6) {
        text = `ULTRA x${count}!`;
        isUltra = true;
    }

    if (text) {
        comboDiv.innerHTML = `<div class="combo-text ${isUltra ? 'ultra' : ''}">${text}</div>`;

        setTimeout(() => {
            comboDiv.innerHTML = '';
        }, 1000);
    }
}

// 5. Perfect/Excellent Performance Text
function showPerformanceText(type) {
    const perfDiv = document.getElementById('performanceText');
    if (!perfDiv) return;

    let text = '';
    if (type === 'perfect') text = 'PERFECT!';
    else if (type === 'excellent') text = 'EXCELLENT!';
    else if (type === 'flawless') text = 'FLAWLESS VICTORY!';

    if (text) {
        perfDiv.innerHTML = `<div class="performance-text">${text}</div>`;

        setTimeout(() => {
            perfDiv.innerHTML = '';
        }, 1500);
    }
}

// 6. Trail Effect (called from Fighter update)
function createTrailEffect(fighter) {
    // Only create trail if moving fast
    if (Math.abs(fighter.velocity.x) < 3 && Math.abs(fighter.velocity.y) < 3) return;

    // Limit trail creation rate
    if (!fighter.lastTrailTime) fighter.lastTrailTime = 0;
    if (Date.now() - fighter.lastTrailTime < 50) return;
    fighter.lastTrailTime = Date.now();

    // Create trail canvas snapshot
    const trail = document.createElement('div');
    trail.className = 'fighter-trail';
    trail.style.left = fighter.position.x + 'px';
    trail.style.top = fighter.position.y + 'px';
    trail.style.width = fighter.width + 'px';
    trail.style.height = fighter.height + 'px';
    trail.style.backgroundColor = fighter === window.player ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 85, 0.3)';

    const gameScreen = document.querySelector('div[style*="position: relative"]') || document.body;
    gameScreen.appendChild(trail);

    setTimeout(() => {
        trail.remove();
    }, 300);
}

// 7. Impact Particles on Hit
function createImpactParticles(x, y, color = '#ffff00') {
    const particleCount = 8;
    const gameScreen = document.querySelector('div[style*="position: relative"]') || document.body;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'impact-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.backgroundColor = color;

        // Random direction
        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = 30 + Math.random() * 20;
        const px = Math.cos(angle) * distance;
        const py = Math.sin(angle) * distance;

        particle.style.setProperty('--px', px + 'px');
        particle.style.setProperty('--py', py + 'px');

        gameScreen.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 500);
    }
}

// Export functions
window.arcadeEffects = {
    init: initEffects,
    glitch: triggerGlitchEffect,
    updateCombo: updateCombo,
    showPerformance: showPerformanceText,
    createTrail: createTrailEffect,
    createImpact: createImpactParticles,
    koOverlay: triggerKOOverlay,
    screenCrack: triggerScreenCrack,
    screenShake: triggerScreenShake
};

// ============================================
// NOWE EFEKTY - WERSJA 36
// ============================================

// 8. K.O. Red Overlay
function triggerKOOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'ko-overlay';
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.remove();
    }, 1500);
}

// 9. Screen Crack Effect (Super Attack)
function triggerScreenCrack() {
    const crack = document.createElement('div');
    crack.className = 'screen-crack';
    // Append to game container to scale with it
    const container = document.getElementById('game-container') || document.body;
    container.appendChild(crack);

    setTimeout(() => {
        crack.remove();
    }, 600);
}

// 10. Enhanced Screen Shake with Intensity
function triggerScreenShake(intensity = 'medium') {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    // Remove any existing shake classes
    canvas.classList.remove('shake-light', 'shake-medium', 'shake-heavy');

    // Add new shake class
    const shakeClass = `shake-${intensity}`;
    canvas.classList.add(shakeClass);

    // Duration based on intensity
    const durations = {
        light: 300,
        medium: 400,
        heavy: 500
    };

    setTimeout(() => {
        canvas.classList.remove(shakeClass);
    }, durations[intensity] || 400);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEffects);
} else {
    initEffects();
}
