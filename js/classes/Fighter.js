class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        rows = 1,
        cols = 1,
        frameHeight = undefined, // Pass through
        offset = { x: 0, y: 0 },
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined },
        removeBackground = false,
        rowOffsets = {}, // NEW: Per-row adjustments
        hitboxOffset = { x: -150, y: 0 } // NEW: Customizable hitbox offset
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            rows,
            cols,
            offset,
            frameHeight, // Pass to Sprite
            removeBackground,
            rowOffsets // Pass to Sprite
        })

        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.hitboxOffset = hitboxOffset // Use provided hitbox offset
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color
        this.isAttacking
        this.health = 130 // +30% HP (was 100)
        this.maxHealth = 130
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites
        this.dead = false
        this.isBlocking = false
        this.currentDamage = 10
        this.hasHit = false

        // SUPER ATTACK STATS
        this.energy = 20
        this.maxEnergy = 100
        this.lastEnergyUpdate = Date.now()

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    update() {
        this.draw()
        if (!this.dead) {
            this.animateFrames()
            // FIX: Reset Attack State when animation finishes (ONLY FOR ANIMATED SPRITES)
            if (this.framesMax > 1 && this.isAttacking && !this.loop && this.framesCurrent >= this.framesMax - 1) {
                this.isAttacking = false
                this.switchSprite('idle')
            }
        }

        // BLOCKING ANIMATION CHECK
        if (this.isBlocking) {
            this.switchSprite('block')
        }

        // Idle Bobbing Animation
        if (this.velocity.x === 0 && this.velocity.y === 0) {
            this.offset.y = Math.sin(Date.now() / 200) * 5
        } else {
            this.offset.y = 0
        }

        // attack boxes
        if (!this.flipHorizontal) {
            this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        } else {
            this.attackBox.position.x = this.position.x + this.width - this.attackBox.offset.x - this.attackBox.width
        }

        this.attackBox.position.y = this.position.y + this.attackBox.offset.y - this.offset.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // GRAVITY LOGIC
        const groundY = window.groundLevel || 480
        const visualHeight = (this.image && this.image.height) ? (this.image.height * this.scale / (this.rows || 1)) : 150

        if (this.position.y + visualHeight + this.velocity.y >= groundY) {
            this.velocity.y = 0
            this.position.y = groundY - visualHeight
        } else {
            this.velocity.y += gravity
        }

        // Map Boundaries
        if (this.position.x < -170) this.position.x = -170
        if (this.position.x > canvas.width - 350) this.position.x = canvas.width - 350

        // ENERGY REGEN (Auto +5 per second)
        if (!this.dead) {
            const now = Date.now()
            if (now - this.lastEnergyUpdate >= 200) { // Update every 200ms
                if (this.energy < 100) {
                    this.energy = Math.min(100, this.energy + 1)
                }
                this.lastEnergyUpdate = now
            }
        }

        // ENERGY REGEN (Auto +5 per second)
        if (!this.dead) {
            const now = Date.now()
            if (now - this.lastEnergyUpdate >= 200) { // Update every 200ms
                if (this.energy < 100) {
                    this.energy = Math.min(100, this.energy + 1)
                }
                this.lastEnergyUpdate = now
            }
        }

        // ARCADE JUMP SPIN
        if (this.velocity.y !== 0 && !this.dead && !this.isAttacking && !this.isBlocking) {
            // Only spin static images (framesMax == 1) or if preferred for all
            // User asked for "kołowrotek during jump"
            const spinSpeed = 0.3
            this.rotation += this.flipHorizontal ? -spinSpeed : spinSpeed
        } else {
            this.rotation = 0
        }
    }

    draw() {
        // RAGE MODE GLOW (HP < 31)
        if (this.health < 31) {
            c.save()
            c.shadowBlur = 20
            c.shadowColor = 'rgba(255, 0, 0, 0.8)' // Red Glow
        }
        // ENERGY GLOW (Full Energy) - Optional: Keep or Remove? User asked specifically for Red on Low HP
        // Let's keep transparent or subtle gold if full energy AND high hp? 
        // User said "wolałbym czerwoną", so let's stick to Red for Low HP as priority.

        super.draw()

        if (this.health < 31) {
            c.restore()
        }

        // 1. BLOCK SHIELD VISUAL - REMOVED
        // if (this.isBlocking) {
        //     c.save()
        //     c.globalAlpha = 0.5
        //     c.fillStyle = '#00ffff'
        //     const shieldX = this.flipHorizontal ? this.position.x - 10 : this.position.x + this.width
        //     c.fillRect(shieldX, this.position.y, 10, this.height)
        //     c.restore()
        // }

        // 2. ATTACK SWIPE VISUAL - REMOVED
        // if (this.isAttacking) {
        //     c.save()
        //     c.globalAlpha = 0.8
        //     c.strokeStyle = 'white'
        //     c.lineWidth = 4
        //     c.shadowBlur = 20
        //     c.shadowColor = 'white'
        //     c.beginPath()
        //
        //     const startX = this.attackBox.position.x
        //     const startY = this.attackBox.position.y
        //     const width = this.attackBox.width
        //     const height = this.attackBox.height
        //
        //     c.moveTo(startX, startY + height)
        //     c.quadraticCurveTo(startX + width / 2, startY - 20, startX + width, startY + height)
        //     c.stroke()
        //
        //     c.shadowBlur = 0
        //     c.strokeStyle = '#00ffff'
        //     c.lineWidth = 2
        //     c.stroke()
        //     c.restore()
        // }

        // ATTACK DEBUG BOX - REMOVED
        // if (this.isAttacking) {
        //     const isKick = (this.image === this.sprites.attack2.image)
        //     c.save()
        //     c.fillStyle = isKick ? 'rgba(138, 43, 226, 0.5)' : 'rgba(255, 0, 0, 0.5)'
        //     c.fillRect(
        //         this.attackBox.position.x,
        //         this.attackBox.position.y,
        //         this.attackBox.width - 1,
        //         this.attackBox.height
        //     )
        //     c.restore()
        // }

        // DEBUG HITBOXES (Toggle with 'H' key)
        if (window.showDebugHitboxes) {
            // Character Hitbox (Pink) - flip offset based on direction
            const hitboxX = this.flipHorizontal
                ? this.position.x - this.hitboxOffset.x  // Facing left: offset to the left
                : this.position.x + this.hitboxOffset.x  // Facing right: offset to the right

            c.save()
            c.strokeStyle = '#ff1493'
            c.lineWidth = 2
            c.strokeRect(
                hitboxX,
                this.position.y + this.hitboxOffset.y,
                this.width,
                this.height
            )
            c.restore()

            // AttackBox (Always show, Green when not attacking, Red/Purple when attacking)
            c.save()
            c.strokeStyle = this.isAttacking ? (this.image === this.sprites.attack2.image ? '#8a2be2' : '#ff0000') : '#00ff00'
            c.lineWidth = 2
            c.strokeRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            )
            c.restore()
        }
    }

    attack() {
        if (this.isBlocking || this.isAttacking) return
        this.switchSprite('attack1')
        this.isAttacking = true
        this.hasHit = false
        this.currentDamage = 15
        this.attackBox.width = 160
        this.attackBox.height = 50

        if (!this.flipHorizontal) this.position.x += 20
        else this.position.x -= 20

        // Hybrid Reset Logic
        if (this.framesMax <= 1) {
            setTimeout(() => {
                this.isAttacking = false
                this.switchSprite('idle')
            }, 400) // 400ms duration for static sprites
        }
    }

    attack2() {
        if (this.isBlocking || this.isAttacking) return
        this.switchSprite('attack2')
        this.isAttacking = true
        this.hasHit = false
        this.currentDamage = 20
        this.attackBox.width = 200
        this.attackBox.height = 50

        if (!this.flipHorizontal) this.position.x += 10
        else this.position.x -= 10

        // Hybrid Reset Logic
        if (this.framesMax <= 1) {
            setTimeout(() => {
                this.isAttacking = false
                this.switchSprite('idle')
            }, 400) // 400ms duration for static sprites
        }
    }

    dash(direction) {
        if (this.isBlocking || this.isAttacking || this.dead || this.isDashing) return

        this.isDashing = true
        this.velocity.x = direction * 12 // Slowed down from 15
        this.switchSprite('run') // Or specific dash sprite if available

        // Creating after-image effect (optional / simplified)
        // ...

        setTimeout(() => {
            this.isDashing = false
            this.velocity.x = 0
            this.switchSprite('idle')
        }, 200) // Dash duration
    }

    takeHit(amount = 10) {
        this.health = Math.max(0, this.health - amount)

        // ARCADE TILT
        shakeScreen()

        if (this.health <= 0) {
            this.switchSprite('death')
        } else this.switchSprite('takeHit')
    }

    superAttack() {
        if (this.energy < 100) return
        if (this.isBlocking || this.isAttacking || this.dead) return

        // Consume Energy
        this.energy = 0

        // Activate
        this.switchSprite('attack1')
        this.isAttacking = true
        this.hasHit = false
        this.currentDamage = 50 // SUPER DAMAGE

        // Mega Hitbox
        this.attackBox.width = 300
        this.attackBox.height = 150

        // Lunging Forward
        if (!this.flipHorizontal) this.position.x += 60
        else this.position.x -= 60

        // Visual FX
        if (typeof triggerScreenFlash === 'function') triggerScreenFlash()

        // Sound FX
        if (typeof audioManager !== 'undefined') audioManager.playPower() // Use Power sound

        // Hybrid Reset Logic for static sprites
        if (this.framesMax <= 1) {
            setTimeout(() => {
                this.isAttacking = false
                this.switchSprite('idle')
            }, 500)
        }
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1)
                this.dead = true
            return
        }

        if (
            (this.image === this.sprites.attack1.image &&
                this.framesCurrent < this.sprites.attack1.framesMax - 1) ||
            (this.image === this.sprites.attack2.image &&
                this.framesCurrent < this.sprites.attack2.framesMax - 1)
        )
            return

        if (
            this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1
        )
            return

        const targetSprite = this.sprites[sprite]

        // Handle Looping
        if (sprite === 'attack1' || sprite === 'attack2' || sprite === 'takeHit' || sprite === 'death') {
            this.loop = false
        } else {
            this.loop = true
        }

        if (targetSprite.row !== undefined) {
            if (this.framesRow !== targetSprite.row) {
                this.framesRow = targetSprite.row
                this.framesMax = targetSprite.framesMax
                this.framesCurrent = 0
            }
        } else {
            if (this.image !== targetSprite.image) {
                this.image = targetSprite.image
                this.framesMax = targetSprite.framesMax
                this.framesCurrent = 0
            }
        }
    }
}
