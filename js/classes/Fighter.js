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
        frameHeight = undefined,
        offset = { x: 0, y: 0 },
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined },
        removeBackground = false,
        rowOffsets = {},
        hitboxOffset = { x: -150, y: 0 }
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            rows,
            cols,
            offset,
            frameHeight,
            removeBackground,
            rowOffsets
        })

        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.hitboxOffset = hitboxOffset
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
        this.isAttacking = false
        this.health = 130
        this.maxHealth = 130
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites
        this.dead = false
        this.isBlocking = false
        this.currentDamage = 10
        this.hasHit = false

        this.isEnergyTrapped = false
        this.energyTrappedTime = 0
        this.ghosts = []
        this.isDashing = false
        this.showTacoBlink = false
        this.tacoBlinkTimer = 0
        this.energy = 20
        this.maxEnergy = 100
        this.lastEnergyUpdate = Date.now()

        for (const sprite in this.sprites) {
            this.sprites[sprite].image = new Image()
            this.sprites[sprite].image.src = this.sprites[sprite].imageSrc
        }
    }

    update() {
        if (this.shouldDraw !== false) this.draw()
        if (!this.dead) {
            this.animateFrames()

            // ===============================================
            // STANDARDIZED ATTACK LOGIC (Rows 5 & 6)
            // ===============================================

            // SOBEL THROW SPECIAL (Row 5 - Jump from 2 to 7)
            if (this.currentType === 'sobel_throw' && this.isAttacking) {
                if (this.framesCurrent <= 2) {
                    this.framesHold = 10
                }
                else if (this.framesCurrent >= 3 && this.framesCurrent < 7) {
                    this.framesCurrent = 7
                }
                else if (this.framesCurrent === 7) {
                    if (!this.specialSpawned) {
                        const projectileDirection = this.flipHorizontal ? -1 : 1
                        if (typeof Projectile !== 'undefined') {
                            const specialProjectile = new Projectile({
                                position: {
                                    x: this.position.x + (this.flipHorizontal ? -50 : this.width + 50),
                                    y: this.position.y + 40
                                },
                                velocity: {
                                    x: projectileDirection * 15,
                                    y: 0
                                },
                                image: this.sprites.special.image,
                                framesMax: 1,
                                scale: this.scale,
                                owner: this,
                                framesRow: 5,
                                startFrame: 7,
                                radius: 40
                            })
                            specialProjectile.shadowBlur = 20
                            specialProjectile.shadowColor = '#ffffff'
                            if (typeof projectiles !== 'undefined') projectiles.push(specialProjectile)
                        }
                        this.specialSpawned = true
                    }
                    this.framesHold = 30 // Hold throw frame longer
                }
                this.attackBox.width = 0
            }

            // TACO SUPER BLINK Logic
            else if (this.isAttacking && this.currentType === 'taco_super') {
                this.showTacoBlink = [1, 3, 5].includes(this.framesCurrent);
                this.framesHold = 12
                this.attackBox.width = 0
            }

            // ROW 5: SPECIAL (Generic)
            else if (this.currentType === 'special_row5' && this.isAttacking) {
                if (this.sprites.special && this.sprites.special.type === 'taco_blink') {
                    this.showTacoBlink = [1, 3, 5].includes(this.framesCurrent);
                }

                if (this.framesCurrent >= 0 && this.framesCurrent <= 6) {
                    this.framesHold = 10
                } else if (this.framesCurrent === 7) {
                    if (!this.specialSpawned && typeof Projectile !== 'undefined') {
                        const projectileDirection = this.flipHorizontal ? -1 : 1
                        const specialProjectile = new Projectile({
                            position: {
                                x: this.position.x + (this.flipHorizontal ? -50 : this.width + 50),
                                y: this.position.y + 50
                            },
                            velocity: { x: projectileDirection * 12, y: 0 },
                            image: this.sprites.special.image,
                            framesMax: 1,
                            scale: this.scale * 2,
                            owner: this,
                            framesRow: 5,
                            startFrame: 7,
                            radius: 50
                        })
                        specialProjectile.shadowBlur = 30;
                        specialProjectile.shadowColor = '#00ffff';
                        if (typeof projectiles !== 'undefined') projectiles.push(specialProjectile)
                        this.specialSpawned = true
                    }
                    this.framesHold = 5
                }
                this.attackBox.width = 0
            }

            // ROW 6: SUPER (Generic)
            else if (this.currentType === 'super_row6' && this.isAttacking) {
                if (this.sprites.attack1_super && this.sprites.attack1_super.type === 'polaroid') {
                    if (this.framesCurrent === 2 && !this.flashTriggered) {
                        this.showPolaroidFlash = true
                        this.polaroidFlashOpacity = 1.0
                        this.flashTriggered = true
                        let target = null
                        if (typeof player !== 'undefined' && this === player && typeof enemy !== 'undefined') target = enemy
                        else if (typeof enemy !== 'undefined' && this === enemy && typeof player !== 'undefined') target = player
                        if (target) {
                            target.isPolaroidTrapped = true
                            target.polaroidTrappedTime = Date.now()
                            target.takeHit(0)
                        }
                    }
                    if (this.framesCurrent === 0) this.flashTriggered = false
                    this.attackBox.width = 0
                }
                else {
                    if (this.framesCurrent >= 0 && this.framesCurrent <= 3) {
                        this.framesHold = 10
                    }
                    else if (this.framesCurrent === 4) {
                        if (!this.carSpawned && typeof Projectile !== 'undefined') {
                            const projectileDirection = this.flipHorizontal ? -1 : 1
                            const vehicleProjectile = new Projectile({
                                position: {
                                    x: this.position.x + (this.flipHorizontal ? -50 : this.width + 50),
                                    y: this.position.y + 20
                                },
                                velocity: { x: projectileDirection * 20, y: 0 },
                                image: this.sprites.attack1_super.image,
                                framesMax: 1,
                                scale: this.scale * 1.5,
                                owner: this,
                                framesRow: 6,
                                startFrame: 4,
                                radius: 60
                            })
                            if (typeof projectiles !== 'undefined') projectiles.push(vehicleProjectile)
                            this.carSpawned = true
                        }
                        this.framesHold = 12
                    }
                    this.attackBox.width = 0
                }
            }

            // End of Attack / Action
            if (this.framesMax > 1 && this.isAttacking && !this.loop && this.framesCurrent >= this.framesMax - 1) {
                this.isAttacking = false
                this.frameWidthMultiplier = 1
                this.showTacoBlink = false
                this.switchSprite('idle')
            }
        }

        // Blocking
        if (this.isBlocking) this.switchSprite('block')

        // Physics
        if (this.velocity.x === 0 && this.velocity.y === 0) {
            this.offset.y = Math.sin(Date.now() / 200) * 5
        } else {
            this.offset.y = 0
        }

        if (!this.flipHorizontal) {
            this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        } else {
            this.attackBox.position.x = this.position.x + this.width - this.attackBox.offset.x - this.attackBox.width
        }
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y - this.offset.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        const groundY = window.groundLevel || 480
        const visualHeight = (this.image && this.image.height) ? (this.image.height * this.scale / (this.rows || 1)) : 150
        if (this.position.y + visualHeight + this.velocity.y >= groundY) {
            this.velocity.y = 0
            this.position.y = groundY - visualHeight
        } else {
            this.velocity.y += gravity
        }

        if (this.position.x < -170) this.position.x = -170
        if (this.position.x > canvas.width - 350) this.position.x = canvas.width - 350

        // Energy & Regen
        if (!this.dead) {
            const now = Date.now()
            let energyWait = 200
            if (this === window.player && window.perkManager) {
                energyWait = Math.round(energyWait / window.perkManager.getEffectValue('hype_rate'))
            }
            if (now - this.lastEnergyUpdate >= energyWait) {
                if (this.energy < 100) this.energy = Math.min(100, this.energy + 1)
                this.lastEnergyUpdate = now
            }
        }

        // Traps
        if (this.isPolaroidTrapped) {
            this.velocity.x = 0
            this.velocity.y = 0
            this.isAttacking = false
            this.framesCurrent = 0
            if (Date.now() - this.polaroidTrappedTime > 2000) this.isPolaroidTrapped = false
        }
        if (this.isEnergyTrapped) {
            this.velocity.x = 0
            this.velocity.y = 0
            this.isAttacking = false
            this.framesCurrent = 0
            this.position.y += Math.sin(Date.now() / 150) * 1
            if (Date.now() - this.energyTrappedTime > 2000) this.isEnergyTrapped = false
        }

        // Spin & Ghosts
        if (this.velocity.y !== 0 && !this.dead && !this.isAttacking && !this.isBlocking && !this.isPolaroidTrapped) {
            this.rotation += this.flipHorizontal ? -0.1 : 0.1
        } else {
            this.rotation = 0
        }

        if (this.isDashing) {
            this.ghosts.push({
                x: this.position.x,
                y: this.position.y,
                image: this.image,
                framesCurrent: this.framesCurrent,
                framesRow: this.framesRow,
                frameStart: this.frameStart,
                flip: this.flipHorizontal,
                opacity: 0.5
            })
        }
        this.ghosts.forEach(ghost => { ghost.opacity -= 0.05 })
        this.ghosts = this.ghosts.filter(ghost => ghost.opacity > 0)
    }

    draw() {
        let healthSaved = false
        if (this.health < 31) {
            c.save()
            healthSaved = true
            c.shadowBlur = 20
            c.shadowColor = 'rgba(255, 0, 0, 0.8)'
        }

        if (this.isPolaroidTrapped) {
            c.save()
            const framePadding = 20
            const frameBottomPadding = 60
            const frameX = this.position.x - framePadding
            const frameY = this.position.y - framePadding
            const frameW = this.width + (framePadding * 2)
            const frameH = this.height + framePadding + frameBottomPadding
            c.fillStyle = '#ffffff'
            c.fillRect(frameX, frameY, frameW, frameH)
            c.strokeStyle = '#000000'
            c.lineWidth = 2
            c.strokeRect(this.position.x - 5, this.position.y - 5, this.width + 10, this.height + 10)
            c.restore()
        }

        if (window.showDebugHitboxes) {
            // Debug Frames and Type
            c.save()
            c.font = '10px "Press Start 2P"'
            c.fillStyle = 'white'
            c.strokeStyle = 'black'
            c.lineWidth = 2
            const debugText = `TYPE: ${this.currentType || 'none'} | FRAME: ${this.framesCurrent}/${this.framesMax - 1}`
            c.strokeText(debugText, this.position.x, this.position.y - 20)
            c.fillText(debugText, this.position.x, this.position.y - 20)
            c.restore()

            const hitboxX = this.flipHorizontal ? this.position.x - this.hitboxOffset.x : this.position.x + this.hitboxOffset.x
            c.save()
            c.strokeStyle = '#ff1493'
            c.lineWidth = 2
            c.strokeRect(hitboxX, this.position.y + this.hitboxOffset.y, this.width, this.height)
            c.restore()

            c.save()
            c.strokeStyle = this.isAttacking ? '#ff0000' : '#00ff00'
            c.lineWidth = 2
            c.strokeRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
            c.restore()
        }
        if (this.isEnergyTrapped) {
            c.save()
            c.shadowBlur = 40
            c.shadowColor = '#00ff00'
            c.strokeStyle = '#00ff00'
            c.lineWidth = 4
            c.strokeRect(this.position.x - 10, this.position.y - 10, this.width + 20, this.height + 20)
            c.fillStyle = `rgba(0, 255, 0, ${0.1 + Math.sin(Date.now() / 100) * 0.05})`
            c.fillRect(this.position.x - 10, this.position.y - 10, this.width + 20, this.height + 20)
            c.restore()
        }

        this.ghosts.forEach(ghost => {
            c.save()
            c.globalAlpha = ghost.opacity
            const rowHeight = ghost.image.height / (this.rows || 1)
            const colWidth = ghost.image.width / (this.cols || 1)
            c.translate(ghost.x, ghost.y)
            if (ghost.flip) {
                c.scale(-1, 1)
                c.translate(-this.width, 0)
            }
            const drawX = ghost.flip ? this.offset.x : -this.offset.x
            const drawY = -this.offset.y
            c.drawImage(ghost.image, ghost.framesCurrent * colWidth, ghost.framesRow * rowHeight, colWidth, rowHeight, drawX, drawY, colWidth * this.scale, rowHeight * this.scale)
            c.restore()
        })

        if (this.isAttacking && this.currentType === 'super_row6') {
            c.save()
            c.shadowBlur = 30
            c.shadowColor = '#ffff00'
            super.draw()
            c.restore()
        } else {
            super.draw()
        }

        if (this.showTacoBlink) {
            c.save()
            c.fillStyle = 'black'
            c.fillRect(0, 0, canvas.width, canvas.height)
            c.restore()
        }

        if (healthSaved) c.restore()

        if (this.showPolaroidFlash) {
            c.save()
            c.fillStyle = `rgba(255, 255, 255, ${this.polaroidFlashOpacity})`
            c.fillRect(0, 0, canvas.width, canvas.height)
            c.restore()
            this.polaroidFlashOpacity -= 0.1
            if (this.polaroidFlashOpacity <= 0) this.showPolaroidFlash = false
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
    }

    attack2() {
        if (this.isBlocking || this.isAttacking) return
        this.switchSprite('attack2')
        this.isAttacking = true
        this.hasHit = false
        this.currentDamage = 20
        this.attackBox.width = 200
        this.attackBox.height = 50
    }

    dash(direction) {
        if (this.isBlocking || this.isAttacking || this.dead || this.isDashing) return
        this.isDashing = true
        this.velocity.x = direction * 12
        this.switchSprite('run')
        setTimeout(() => {
            this.isDashing = false
            this.velocity.x = 0
            this.switchSprite('idle')
        }, 200)
    }

    takeHit(amount = 10, attacker = null) {
        if (this.isParrying && amount > 0) {
            this.isParrying = false;
            this.switchSprite('idle');
            if (attacker) {
                attacker.velocity.x = (attacker.position.x < this.position.x) ? -10 : 10;
                attacker.takeHit(0);
            }
            return;
        }
        this.health = Math.max(0, this.health - amount)
        shakeScreen()
        if (this.health <= 0) this.switchSprite('death')
        else this.switchSprite('takeHit')
    }

    superAttack() {
        if (this.energy < 100 || this.isAttacking || this.dead) return
        this.energy = 0
        this.carSpawned = false
        this.specialSpawned = false
        this.flashTriggered = false
        this.trapTriggered = false
        this.switchSprite('attack1_super')
        this.currentType = (this.sprites.attack1_super && this.sprites.attack1_super.type) || 'super_row6'
        this.isAttacking = true
        this.hasHit = false
        this.currentDamage = 50
        this.attackBox.width = 0
        if (typeof triggerScreenFlash === 'function') triggerScreenFlash()
        if (typeof audioManager !== 'undefined') {
            if (this.sprites.attack1_super && this.sprites.attack1_super.sound === 'car_horn') audioManager.playCarHorn();
            else audioManager.playPower();
        }
    }

    parry() {
        if (this.isBlocking || this.isAttacking || this.dead || this.isParrying) return
        this.isParrying = true
        this.switchSprite('takeHit')
        setTimeout(() => { this.isParrying = false }, 300)
    }

    specialAttack() {
        if (this.isBlocking || this.isAttacking || this.dead || this.isDashing) return
        this.specialSpawned = false
        this.switchSprite('special')
        this.currentType = (this.sprites.special && this.sprites.special.type) || 'special_row5'
        this.isAttacking = true
        this.hasHit = false
        this.currentDamage = 25
        this.attackBox.width = 0
    }

    victory() { this.switchSprite('victory') }

    taunt() {
        if (this.isBlocking || this.isAttacking || this.dead || this.isDashing) return
        this.switchSprite('taunt')
        this.isAttacking = true
        const duration = (this.sprites.taunt.frames || 4) > 1 ? 2000 : 1500
        setTimeout(() => {
            this.isAttacking = false
            this.switchSprite('idle')
        }, duration)
    }

    switchSprite(sprite) {
        if (this.sprites.death && this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.framesMax - 1) this.dead = true
            return
        }

        // Prevent interrupting normal attacks unless they are finished
        if (
            (this.sprites.attack1 && this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) ||
            (this.sprites.attack2 && this.image === this.sprites.attack2.image && this.framesCurrent < this.sprites.attack2.framesMax - 1) ||
            (this.isAttacking && this.currentType === 'super_row6' && this.framesCurrent < this.framesMax - 1) ||
            (this.isAttacking && this.currentType === 'special_row5' && this.framesCurrent < this.framesMax - 1) ||
            (this.sprites.takeHit && this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1)
        ) return

        const targetSprite = this.sprites[sprite]
        if (!targetSprite) return

        // FIX: Always update animation properties, even if image is the same (8x8 sheets)
        if (this.image !== targetSprite.image || this.framesRow !== (targetSprite.row || 0)) {
            this.image = targetSprite.image
            this.framesMax = targetSprite.frames || 1
            this.framesCurrent = 0
            this.rows = targetSprite.rows || 1
            this.framesRow = targetSprite.row || 0
            this.frameStart = targetSprite.startFrame || 0
        }
    }
}
