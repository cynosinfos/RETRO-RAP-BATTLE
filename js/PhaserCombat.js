class CombatScene extends Phaser.Scene {
    constructor() {
        super('CombatScene');
    }

    init(data) {
        console.log("%cPhaser Scene Init", "color: cyan; font-weight: bold", data);
        this.p1Key = data.player1;
        this.p2Key = data.player2;
        this.p3Key = data.player3 || null;
        this.p4Key = data.player4 || null;
        this.mapData = data.map;
        this.gameMode = data.gameMode || 'PVP';
        this.aiDifficulty = data.aiDifficulty || 'KASZTAN';
        this.is2v2 = (this.gameMode === '2V2_CHAOS');
        this.roster = data.characterData || window.characterData || (typeof characterData !== 'undefined' ? characterData : {});
        this.findCharData = (key) => {
            if (!key) return null;
            const k = key.toUpperCase().trim();
            if (this.roster[k]) return this.roster[k];
            // Try underscores instead of spaces
            const kUnderscore = k.replace(/ /g, '_');
            if (this.roster[kUnderscore]) return this.roster[kUnderscore];
            // Try spaces instead of underscores
            const kSpace = k.replace(/_/g, ' ');
            if (this.roster[kSpace]) return this.roster[kSpace];
            // Final fallback: First character in roster
            return Object.values(this.roster)[0];
        };

        this.loadedCount = 0;
        this.targetCount = 0;
        this.isReady = false;
        this.syncTimer = 0;
    }

    preload() {
        // BYPASS CORS: We use Image objects instead of this.load.image
        // because file:// protocol blocks XHR/fetch.
        console.log("%cPhaser Preload (Safe Mode)", "color: cyan");

        if (!this.p1Key || !this.p2Key) {
            console.warn("[PhaserCombat] Missing character keys (P1/P2). Scene might be empty.", { p1: this.p1Key, p2: this.p2Key });
            // Don't return early without setting state, otherwise create() hangs
            this.isReady = true;
            this.events.emit('assets_done');
            return;
        }

        const p1Data = this.findCharData(this.p1Key);
        const p2Data = this.findCharData(this.p2Key);
        const p3Data = this.is2v2 ? this.findCharData(this.p3Key) : null;
        const p4Data = this.is2v2 ? this.findCharData(this.p4Key) : null;

        const assets = [];
        if (p1Data && p1Data.spriteSheetData) assets.push({ key: 'p1_raw', url: p1Data.spriteSheetData.imageSrc, isSheet: true, charData: p1Data });
        if (p2Data && p2Data.spriteSheetData) assets.push({ key: 'p2_raw', url: p2Data.spriteSheetData.imageSrc, isSheet: true, charData: p2Data });
        if (p3Data && p3Data.spriteSheetData) assets.push({ key: 'p3_raw', url: p3Data.spriteSheetData.imageSrc, isSheet: true, charData: p3Data });
        if (p4Data && p4Data.spriteSheetData) assets.push({ key: 'p4_raw', url: p4Data.spriteSheetData.imageSrc, isSheet: true, charData: p4Data });

        if (this.mapData && this.mapData.image && !this.mapData.image.toLowerCase().endsWith('.gif')) {
            assets.push({ key: 'map_bg', url: this.mapData.image, isSheet: false });
        } else {
            console.log("[PhaserCombat] Map is GIF or missing, skipping texture load (DOM will handle it)");
        }

        // Always load projectile/super assets
        assets.push({ key: 'police_car', url: './img/police_car.png', isSheet: false });

        this.targetCount = assets.length;
        console.log(`[PhaserCombat] Loading ${this.targetCount} assets...`);

        if (this.targetCount === 0) {
            this.isReady = true;
            this.events.emit('assets_done');
            return;
        }

        assets.forEach(asset => {
            const img = new Image();
            img.onload = () => {
                console.log("Loaded Asset (CORS-Safe):", asset.key);
                if (asset.isSheet) {
                    this.buildSpritesheetFromImg(asset.key, img, asset.charData);
                } else {
                    this.textures.addImage(asset.key, img);
                }
                this.loadedCount++;
                if (this.loadedCount >= this.targetCount) {
                    console.log("[PhaserCombat] All assets loaded successfully.");
                    this.isReady = true;
                    this.events.emit('assets_done');
                }
            };
            img.onerror = () => {
                console.error("Failed to load asset (CORS-Safe):", asset.url);
                this.loadedCount++; // Still count to avoid stalling
                if (this.loadedCount >= this.targetCount) {
                    this.isReady = true;
                    this.events.emit('assets_done');
                }
            };
            img.src = asset.url;
        });

        // Add a placeholder rect to prevent crash if things are slow
        const rect = this.add.graphics();
        rect.fillStyle(0xffffff, 1); // White for tinting
        rect.fillRect(0, 0, 1, 1);
        rect.generateTexture('placeholder', 1, 1);
        rect.destroy();
    }

    buildSpritesheetFromImg(prefix, img, charData) {
        let cols = charData.spriteSheetData.framesMax || 1;
        let rows = charData.spriteSheetData.rows || 1;
        const sheetKey = prefix.replace('_raw', '_sheet');

        if (this.textures.exists(sheetKey)) this.textures.remove(sheetKey);

        // CREATE TEXTURE MANUALLY
        const texture = this.textures.create(sheetKey, img, img.width, img.height);
        const fw = img.width / cols;
        const fh = img.height / rows;

        console.log(`[DEBUG] Building ${sheetKey}: ${img.width}x${img.height}, Rows=${rows}, fh=${fh}`);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const frameName = (r * cols + c); // Keep as number

                let cropTop = 0;
                let cropBottom = 0;

                // 1. Individual character offsets
                if (charData.rowOffsets && charData.rowOffsets[r]) {
                    cropTop = charData.rowOffsets[r].cropTop || 0;
                    cropBottom = charData.rowOffsets[r].cropBottom || 0;
                }
                // 2. Global defaults
                else if (rows <= 4) {
                    if (r === 0) cropBottom = 15; // Cut 5px more from bottom to hide Index 1
                    if (r === 1) { cropBottom = -5; cropTop = 30; }
                    if (r === 2) cropBottom = -20;
                    if (r === 3) cropTop = -10;
                }

                const finalCutY = (r * fh) + cropTop;
                const finalHeight = fh - cropTop + cropBottom;

                if (c === 0) {
                    console.log(`[DEBUG] Frame ${frameName}: y=${finalCutY}, h=${finalHeight}, cropTop=${cropTop}`);
                }

                // DIRECT FRAME ADDITION (Absolute control)
                texture.add(frameName, 0, c * fw, finalCutY, fw, finalHeight);
            }
        }

        this.createAnimsForChar(prefix.split('_')[0], charData);
    }

    createAnimsForChar(prefix, charData) {
        const sheet = charData.spriteSheetData;
        const cols = sheet.framesMax || 1;
        const sheetKey = `${prefix}_sheet`;

        Object.keys(sheet.states).forEach(state => {
            const s = sheet.states[state];
            const animKey = `${prefix}_${state}`;
            if (this.anims.exists(animKey)) this.anims.remove(animKey);

            // FIX: Ensure startFrame is respected and Debug log
            const startFrame = (s.startFrame || 0);

            this.anims.create({
                key: animKey,
                frames: this.anims.generateFrameNumbers(sheetKey, {
                    start: (s.row * cols) + startFrame,
                    end: (s.row * cols) + startFrame + (s.frames || 1) - 1
                }),
                frameRate: (state.includes('attack')) ? 18 : 10, repeat: (state === 'idle' || state === 'run' || state === 'block') ? -1 : 0
            });
        });
    }

    create() {
        console.log("%cPhaser Create", "color: cyan");
        // Wait for assets if not ready
        if (!this.isReady && this.targetCount > 0) {
            this.events.once('assets_done', () => this.createBattle());
            return;
        }
        this.createBattle();
    }

    createBattle() {
        // Map Bg
        if (this.textures.exists('map_bg')) {
            const bg = this.add.image(512, 288, 'map_bg');
            bg.setDisplaySize(1024, 576).setDepth(-100);
        }

        const groundLevel = window.groundLevel || 516;
        this.ground = this.add.rectangle(512, groundLevel + 75, 1024, 150, 0x000000, 0); // Much thicker floor (150px) to prevent tunneling
        this.physics.add.existing(this.ground, true);

        // ARCADE EFFECTS: Hit Sparks Particles
        this.sparks = this.add.particles(0, 0, 'placeholder', {
            speed: { min: 150, max: 400 },
            scale: { start: 0.2, end: 0 },
            rotate: { min: 0, max: 360 },
            alpha: { start: 1, end: 0 },
            tint: [0xffff00, 0xffa500, 0xffffff, 0x00ffff], // Added cyan for some high-energy sparks
            lifespan: 300,
            blendMode: 'ADD',
            emitting: false
        });
        this.sparks.setDepth(200);

        // ARCADE EFFECTS: Ground Dust Particles
        this.dust = this.add.particles(0, 0, 'placeholder', {
            speed: { min: 20, max: 100 },
            scale: { start: 0.8, end: 0 },
            alpha: { start: 0.4, end: 0 },
            tint: 0xcccccc,
            lifespan: 500,
            gravityY: -50,
            emitting: false,
            blendMode: 'NORMAL'
        });
        this.dust.setDepth(5);

        // P1
        const p1Data = this.findCharData(this.p1Key);
        const p1Scale = (p1Data && p1Data.scale ? p1Data.scale : 0.5) * 1.5;

        if (this.textures.exists('p1_sheet')) {
            this.player = this.physics.add.sprite(200, groundLevel, 'p1_sheet', 0);
            this.player.play('p1_idle');
        } else {
            // FALLBACK BOX
            this.player = this.add.rectangle(200, groundLevel, 100, 200, 0x00ffff);
            this.physics.add.existing(this.player);
            console.error("P1 Texture Missing - Using Fallback");
        }

        this.player.setOrigin(0.5, 1);
        this.player.setScale(p1Scale);
        this.player.setCollideWorldBounds(true).setDepth(10).setData({ health: 100, energy: 0, baseScale: p1Scale, team: 1, prefix: 'p1' });
        this.physics.add.collider(this.player, this.ground);

        // P2
        const p2Data = this.findCharData(this.p2Key);
        const p2Scale = (p2Data && p2Data.scale ? p2Data.scale : 0.5) * 1.5;

        if (this.textures.exists('p2_sheet')) {
            this.enemy = this.physics.add.sprite(824, groundLevel, 'p2_sheet', 0);
            this.enemy.play('p2_idle');
        } else {
            // FALLBACK BOX
            this.enemy = this.add.rectangle(824, groundLevel, 100, 200, 0xff0055);
            this.physics.add.existing(this.enemy);
            console.error("P2 Texture Missing - Using Fallback");
        }

        this.enemy.setOrigin(0.5, 1);
        this.enemy.setScale(p2Scale);
        this.enemy.setCollideWorldBounds(true).setDepth(10).setFlipX(true).setData({ health: 100, energy: 0, baseScale: p2Scale, team: 2, prefix: 'p2' });
        this.physics.add.collider(this.enemy, this.ground);

        // P3 (Team 1)
        if (this.is2v2) {
            const p3Data = this.findCharData(this.p3Key);
            const p3Scale = (p3Data && p3Data.scale ? p3Data.scale : 0.5) * 1.5;
            if (this.textures.exists('p3_sheet')) {
                this.p3 = this.physics.add.sprite(100, groundLevel, 'p3_sheet', 0);
                this.p3.play('p3_idle');
            } else {
                this.p3 = this.add.rectangle(100, groundLevel, 100, 200, 0x00ffff);
                this.physics.add.existing(this.p3);
            }
            this.p3.setOrigin(0.5, 1).setScale(p3Scale).setCollideWorldBounds(true).setDepth(9).setData({ health: 100, energy: 0, baseScale: p3Scale, team: 1, prefix: 'p3' });
            this.physics.add.collider(this.p3, this.ground);
        }

        // P4 (Team 2)
        if (this.is2v2) {
            const p4Data = this.findCharData(this.p4Key);
            const p4Scale = (p4Data && p4Data.scale ? p4Data.scale : 0.5) * 1.5;
            if (this.textures.exists('p4_sheet')) {
                this.p4 = this.physics.add.sprite(924, groundLevel, 'p4_sheet', 0);
                this.p4.play('p4_idle');
            } else {
                this.p4 = this.add.rectangle(924, groundLevel, 100, 200, 0xff0055);
                this.physics.add.existing(this.p4);
            }
            this.p4.setOrigin(0.5, 1).setScale(p4Scale).setCollideWorldBounds(true).setDepth(9).setFlipX(true).setData({ health: 100, energy: 0, baseScale: p4Scale, team: 2, prefix: 'p4' });
            this.physics.add.collider(this.p4, this.ground);
        }

        // CONSTRAIN WORLD: 0 to 1024 effectively creates "invisible walls" at screen edges
        this.physics.world.setBounds(0, 0, 1024, 576);


        this.setupKeys();

        // WEATHER EFFECTS (Zamek)
        this.isZamek = (this.mapData && this.mapData.name === 'Zamek');
        if (this.isZamek) {
            console.log("Weather Active: Zamek");

            // 1. Particle Rain
            this.rain = this.add.particles(0, 0, 'placeholder', {
                x: { min: -100, max: 1200 },
                y: -50,
                lifespan: 1200,
                speedY: { min: 800, max: 1200 },
                speedX: { min: -100, max: -300 }, // Wind to left
                scaleY: { min: 20, max: 40 },
                scaleX: 1,
                alpha: { start: 0.4, end: 0.1 },
                quantity: 4,
                frequency: 20,
                tint: 0xaaccff,
                blendMode: 'ADD'
            });
            this.rain.setDepth(300); // Foreground

            // 2. Wind Sound
            this.safeSound('startAmbient', 'wind');
        }

        console.log("%cBattle Ready (Safe Mode Active)", "color: green; font-weight: bold");
    }

    domShake(duration = 100, intensity = 5) {
        const gs = document.getElementById('gameScreen');
        if (!gs) return;
        const start = Date.now();
        const originalTransform = gs.style.transform || '';

        const shake = () => {
            const elapsed = Date.now() - start;
            if (elapsed < duration) {
                const x = (Math.random() - 0.5) * 2 * intensity;
                const y = (Math.random() - 0.5) * 2 * intensity;
                gs.style.transform = `translate(${x}px, ${y}px)`;
                requestAnimationFrame(shake);
            } else {
                gs.style.transform = originalTransform;
            }
        };
        shake();
    }

    setupKeys() {
        const cfg = window.config || {
            p1: { up: 'w', left: 'a', down: 's', right: 'd', punch: ' ', kick: 'c' },
            p2: { up: 'arrowup', left: 'arrowleft', down: 'arrowdown', right: 'arrowright', punch: 'enter', kick: 'shift' }
        };

        const toPhaser = (k) => {
            if (!k) return 'SPACE';
            k = k.toString().toUpperCase();
            if (k === ' ' || k === 'SPACE') return 'SPACE';
            if (k === 'ENTER') return 'ENTER';
            if (k === 'SHIFT') return 'SHIFT';
            if (k.includes('ARROW')) return k.replace('ARROW', '');
            if (k.includes('NUMPAD_')) {
                const map = { '1': 'ONE', '2': 'TWO', '3': 'THREE', '4': 'FOUR', '5': 'FIVE', '6': 'SIX', '7': 'SEVEN', '8': 'EIGHT', '9': 'NINE', '0': 'ZERO' };
                const num = k.replace('NUMPAD_', '');
                return 'NUMPAD_' + (map[num] || num);
            }
            return k;
        };

        this.ctrls = this.input.keyboard.addKeys({
            p1up: toPhaser(cfg.p1.up), p1left: toPhaser(cfg.p1.left),
            p1down: toPhaser(cfg.p1.down), p1right: toPhaser(cfg.p1.right),
            p1punch: toPhaser(cfg.p1.punch || ' '), p1kick: toPhaser(cfg.p1.kick || 'c'),
            p1super: toPhaser(cfg.p1.super || 'i'), p1special: toPhaser(cfg.p1.special || 'o'), p1taunt: toPhaser(cfg.p1.taunt || 'u'),
            debugHost: toPhaser('h'),

            p2up: toPhaser(cfg.p2.up), p2left: toPhaser(cfg.p2.left),
            p2down: toPhaser(cfg.p2.down), p2right: toPhaser(cfg.p2.right),
            p2punch: toPhaser(cfg.p2.punch), p2kick: toPhaser(cfg.p2.kick),
            p2special: toPhaser(cfg.p2.special),
            p2super: toPhaser(cfg.p2.super),
            p2taunt: toPhaser(cfg.p2.taunt),

            // P3 Controls (T F G H) + U/Y
            p3up: toPhaser('t'), p3left: toPhaser('f'), p3down: toPhaser('g'), p3right: toPhaser('h'),
            p3punch: toPhaser('y'), p3kick: toPhaser('u'),
            p3super: toPhaser('j'), p3special: toPhaser('k'), // p3taunt usunieto - konflikt z p1super (I)

            // P4 Controls (I J K L) + O/P (Actually avoid overlap with P3 specials... let's use Numpad for P4 or other keys)
            // P4: Arrow keys are usually guest.
            // Let's use:
            // P4: 8, 4, 5, 6 (Numpad) if possible, or distinct letters.
            // Let's use: U, H, J, K (vim style? no overlap P3).
            // P3: T,F,G,H (ok). P4: I,J,K,L (ok).
            // P3 specials: R, E, Q?
            // Let's redefine cleanly.

            // P3 (Team 1, Aux): T(Up), F(Left), G(Down), H(Right)
            // P3 Combat: R(Punch), Y(Kick)
            // P3 Special: E. Super: Q. Taunt: 5.

            // P4 (Team 2, Aux): I(Up), J(Left), K(Down), L(Right)
            // P4 Combat: U(Punch), O(Kick)
            // P4 Special: 9. Super: 0. Taunt: P.

            p3upNew: toPhaser('t'), p3leftNew: toPhaser('f'), p3downNew: toPhaser('g'), p3rightNew: toPhaser('h'),
            p3punchNew: toPhaser('r'), p3kickNew: toPhaser('y'),
            p3specialNew: toPhaser('e'), p3superNew: toPhaser('q'), p3tauntNew: toPhaser('5'),

            p4upNew: toPhaser('i'), p4leftNew: toPhaser('j'), p4downNew: toPhaser('k'), p4rightNew: toPhaser('l'),
            p4punchNew: toPhaser('u'), p4kickNew: toPhaser('o'),
            p4specialNew: toPhaser('9'), p4superNew: toPhaser('0'), p4tauntNew: toPhaser('p')
        });
    }

    update(time, delta) {
        if (!this.player || !this.enemy) return;

        // TRAINING MODE: Infinite Health, Energy & No KO
        if (this.gameMode === 'TRAINING') {
            this.player.setData('health', 100);
            this.player.setData('energy', 100);
            this.enemy.setData('health', 100);
            // enemy energy can be generic or full
        }

        // WEATHER UPDATE
        if (this.isZamek && Math.random() < 0.003) {
            this.cameras.main.flash(150, 255, 255, 255); // Flash
            this.safeSound('playThunder');
        }


        const fighters = [this.player, this.enemy, this.p3, this.p4].filter(f => f && f.active);
        const mapWidth = 1024; // Boundary

        // Dynamic Physics Correction (Prevents Sinking & Safety Warp)
        fighters.forEach(s => {
            // SAFETY WARP: If fell below world, reset to arena
            if (s.y > 650) {
                s.y = 400;
                s.setVelocityY(0);
                console.warn("Safety Warp Triggered for " + s.texture.key);
            }

            // ENERGY TRAP LOGIC
            if (s.getData('isEnergyTrapped')) {
                s.setVelocity(0, 0);
                if (s.anims && s.anims.isPlaying) s.anims.pause();

                // Floating effect
                s.y += Math.sin(time * 0.005) * 0.5;

                // Pulsing Green Tint
                const pulse = 0.6 + Math.sin(time * 0.01) * 0.4;
                const green = Math.floor(255 * pulse);
                s.setTint(Phaser.Display.Color.GetColor(0, green, 0));

                // SHIELD VISUAL
                if (s.energyShield) {
                    s.energyShield.clear();
                    s.energyShield.fillStyle(0x00ff00, 0.3 * pulse);
                    s.energyShield.lineStyle(4, 0x00ff00, 0.8 * pulse);
                    const r = 100 + (Math.sin(time * 0.01) * 10);
                    s.energyShield.strokeCircle(s.x, s.y - 90, r);
                    s.energyShield.fillCircle(s.x, s.y - 90, r);
                    s.energyShield.setDepth(s.depth - 1);
                }
                return; // Skip other physics/logic while trapped
            }

            const bodyH = 180;
            const bodyW = 60;
            s.body.setSize(bodyW, bodyH);
            s.body.setOffset((s.width - bodyW) / 2, s.height - bodyH);

            // ANIMATION & SCALING EFFECTS
            const isIdle = s.anims.currentAnim && s.anims.currentAnim.key.endsWith('_idle');
            // const isJumping = !s.body.touching.down;
            const baseScale = s.getData('baseScale') || 0.75;

            if (isIdle && !s.getData('isAttacking')) {
                // BREATHING EFFECT
                const breathing = 1 + Math.sin(time * 0.006) * 0.02;
                s.setScale(baseScale, baseScale * breathing);
            } else {
                s.setScale(baseScale); // Reset default
            }

            // COMBO TIMER
            let timer = s.getData('comboTimer') || 0;
            if (timer > 0) {
                timer -= delta * 0.05; // Fade over ~2 seconds
                s.setData('comboTimer', timer);
                if (timer <= 0) {
                    s.setData('combo', 0);
                    this.updateComboUI();
                }
            }

            // DUST EFFECTS
            const wasGrounded = s.getData('wasGrounded') !== false;
            const isGrounded = s.body.touching.down;
            s.setData('wasGrounded', isGrounded);

            if (isGrounded && !wasGrounded) {
                // LANDED
                if (this.dust) {
                    this.dust.emitParticleAt(s.x, s.y, 5);
                }
            }
            if (!isGrounded && wasGrounded && s.body.velocity.y < -100) {
                // JUMPED
                if (this.dust) {
                    this.dust.emitParticleAt(s.x, s.y, 3);
                }
            }

            // KO BOUNCE CHECK
            this.checkKoBounce(s);

            // STUCK PROTECTION: If isAttacking is true but no attack anim is playing, reset it.
            // This prevents "zaciskanie" if hitTest/animationcomplete fails.
            if (s.getData('isAttacking') && !s.getData('isKoBouncing')) {
                const anim = s.anims.currentAnim ? s.anims.currentAnim.key : '';
                const isPassiveAnim = anim.includes('idle') || anim.includes('block');
                if (isPassiveAnim) {
                    s.setData('isAttacking', false);
                }
            }
        });

        if (window.inputLocked || !window.isRoundActive) {
            fighters.forEach(f => {
                // Allow KO Bounce physics to continue even if input is locked/round over
                if (!f.getData('isKoBouncing')) {
                    f.setVelocityX(0);
                }
            });
            this.syncUI();

            // If bouncing, we still want to run physics/updates, so we should NOT return early if bouncing?
            // Actually only the bouncing char needs updates. 
            // If we return here, the rest of update() (AI, physics sync) might be skipped?
            // "this.handleMove" is input, which should be skipped.
            // But "update" for physics happens automatically by Phaser.
            // We just shouldn't zero velocity for the bouncer.

            // Ensure we don't return if someone is bouncing, so they can hit the wall?
            // checkKoBounce is inside the loop at line 450. Wait, checkKoBounce is BEFORE this block.
            // So checkKoBounce runs.
            return;
        }

        // POLAROID TRAP ENFORCEMENT & VISUAL UPDATE
        fighters.forEach(f => {
            if (f.getData('isPolaroidTrapped')) {
                f.setVelocity(0); // Force stop
                if (f.anims && f.anims.isPlaying) f.anims.pause(); // Ensure paused

                // Update Frame Position
                if (f.polaroidFrame) {
                    f.polaroidFrame.x = f.x;
                    f.polaroidFrame.y = f.y;
                }
                return; // SKIP CONTROLS
            } else {
                // Cleanup if frame exists but not trapped (safety)
                if (f.polaroidFrame) { f.polaroidFrame.destroy(); f.polaroidFrame = null; }
            }
        });

        const isOnline = (this.gameMode === 'ONLINE' || this.gameMode === '2V2_CHAOS');
        const role = (window.networkManager) ? window.networkManager.playerIndex : -1; // 0=P1, 1=P2, 2=P3, 3=P4

        if (isOnline && window.updateOnlineInputJustDown) window.updateOnlineInputJustDown();

        // Online Input Wrapper
        const getVKey = (tag, key) => ({
            isDown: window.onlineInputState[tag][key],
            justDown: window.onlineInputJustDown ? window.onlineInputJustDown[tag][key] : false
        });

        // P1 Control
        if (isOnline) {
            const keys = window.onlineInputState.P1;
            const jKeys = window.onlineInputJustDown ? window.onlineInputJustDown.P1 : {};
            if (!this.player.getData('isEnergyTrapped') && !this.player.getData('isPolaroidTrapped')) {
                this.handleMove(this.player, getVKey('P1', 'up'), getVKey('P1', 'left'), getVKey('P1', 'down'), getVKey('P1', 'right'), getVKey('P1', 'punch'), getVKey('P1', 'kick'), 'p1');
                if (jKeys.taunt) this.performMove(this.player, 'p1', 'taunt');
                if (jKeys.super) this.performMove(this.player, 'p1', 'super');
                if (jKeys.special) this.performMove(this.player, 'p1', 'special');
            }
        } else {
            // Local Play: P1 uses WASD
            if (!this.player.getData('isEnergyTrapped') && !this.player.getData('isPolaroidTrapped')) {
                this.handleMove(this.player, this.ctrls.p1up, this.ctrls.p1left, this.ctrls.p1down, this.ctrls.p1right, this.ctrls.p1punch, this.ctrls.p1kick, 'p1');
                if (Phaser.Input.Keyboard.JustDown(this.ctrls.p1taunt)) this.performMove(this.player, 'p1', 'taunt');
                if (Phaser.Input.Keyboard.JustDown(this.ctrls.p1super)) this.performMove(this.player, 'p1', 'super');
                if (Phaser.Input.Keyboard.JustDown(this.ctrls.p1special)) this.performMove(this.player, 'p1', 'special');
            }
        }

        // P2 Control
        if (isOnline) {
            const keys = window.onlineInputState.P2;
            const jKeys = window.onlineInputJustDown ? window.onlineInputJustDown.P2 : {};
            if (!this.enemy.getData('isEnergyTrapped') && !this.enemy.getData('isPolaroidTrapped')) {
                this.handleMove(this.enemy, getVKey('P2', 'up'), getVKey('P2', 'left'), getVKey('P2', 'down'), getVKey('P2', 'right'), getVKey('P2', 'punch'), getVKey('P2', 'kick'), 'p2');
                if (jKeys.taunt) this.performMove(this.enemy, 'p2', 'taunt');
                if (jKeys.super) this.performMove(this.enemy, 'p2', 'super');
                if (jKeys.special) this.performMove(this.enemy, 'p2', 'special');
            }
        } else {
            // Local Play: P2 uses Arrow Keys
            if (!this.enemy.getData('isEnergyTrapped') && !this.enemy.getData('isPolaroidTrapped')) {
                this.handleMove(this.enemy, this.ctrls.p2up, this.ctrls.p2left, this.ctrls.p2down, this.ctrls.p2right, this.ctrls.p2punch, this.ctrls.p2kick, 'p2');
                if (Phaser.Input.Keyboard.JustDown(this.ctrls.p2taunt)) this.performMove(this.enemy, 'p2', 'taunt');
                if (Phaser.Input.Keyboard.JustDown(this.ctrls.p2super)) this.performMove(this.enemy, 'p2', 'super');
                if (Phaser.Input.Keyboard.JustDown(this.ctrls.p2special)) this.performMove(this.enemy, 'p2', 'special');
            }
        }

        if (!isOnline && this.gameMode !== 'TRAINING' && this.gameMode !== 'PVP') {
            const p2Target = this.findClosestEnemy(this.enemy);
            if (p2Target && !this.enemy.getData('isEnergyTrapped') && !this.enemy.getData('isPolaroidTrapped')) {
                this.doAI(this.enemy, p2Target, 'p2');
            }
        }

        // P3 Control (Online Support)
        if (this.p3 && this.p3.active) {
            if (isOnline) {
                this.handleMove(this.p3, getVKey('P3', 'up'), getVKey('P3', 'left'), getVKey('P3', 'down'), getVKey('P3', 'right'), getVKey('P3', 'punch'), getVKey('P3', 'kick'), 'p3');
            } else if (role === 0 && this.gameMode !== 'TRAINING') {
                const target = this.findClosestEnemy(this.p3);
                if (target) this.doAI(this.p3, target, 'p3');
            }
        }

        // P4 Control (Online Support)
        if (this.p4 && this.p4.active) {
            if (isOnline) {
                this.handleMove(this.p4, getVKey('P4', 'up'), getVKey('P4', 'left'), getVKey('P4', 'down'), getVKey('P4', 'right'), getVKey('P4', 'punch'), getVKey('P4', 'kick'), 'p4');
            } else if ((role === 0 || !isOnline) && this.gameMode !== 'TRAINING') {
                const p4Target = this.findClosestEnemy(this.p4);
                if (p4Target) this.doAI(this.p4, p4Target, 'p4');
            }
        }

        this.syncUI();
    }

    handleMove(s, up, left, down, right, p, k, pre) {
        // JUMP ROTATION (Kolowrotek) - FIXED STUTTER v3
        // Only rotate when clearly airborne (>50px up).
        const isAirborne = !s.body.touching.down && !s.body.blocked.down;
        const isJumpAnim = s.anims.currentAnim && s.anims.currentAnim.key.endsWith('_jump');
        const groundY = window.groundLevel || 516;
        const safelyInAir = s.y < (groundY - 50);

        if (isAirborne && isJumpAnim && safelyInAir && !s.getData('isAttacking')) {
            s.setOrigin(0.5, 0.5);
            s.angle += (s.flipX ? -20 : 20);
        } else {
            s.setOrigin(0.5, 1);
            s.setAngle(0);
        }

        if (s.getData('isAttacking')) return;

        // POLAROID TRAP LOCK
        if (s.getData('isPolaroidTrapped')) {
            s.setVelocity(0);
            return;
        }

        let walk = false;
        if (left.isDown) {
            s.setVelocityX(-420).setFlipX(true);
            if (s.body.touching.down) s.play(`${pre}_run`, true);
            walk = true;
        }
        else if (right.isDown) {
            s.setVelocityX(420).setFlipX(false);
            if (s.body.touching.down) s.play(`${pre}_run`, true);
            walk = true;
        }
        else s.setVelocityX(0);

        if (up.isDown && s.body.touching.down) {
            s.setVelocityY(-1450).play(`${pre}_jump`, true); // Increased to -1450 for higher jump
            walk = true;
        }

        const now = this.time.now;

        // DASH DETECTION
        if (Phaser.Input.Keyboard.JustDown(left)) {
            const lastL = s.getData('lastPressLeft') || 0;
            if (now - lastL < 250) this.dash(s, pre, -1);
            s.setData('lastPressLeft', now);
        }
        if (Phaser.Input.Keyboard.JustDown(right)) {
            const lastR = s.getData('lastPressRight') || 0;
            if (now - lastR < 250) this.dash(s, pre, 1);
            s.setData('lastPressRight', now);
        }

        if (down.isDown) { s.setData('isBlocking', true).play(`${pre}_block`, true).setVelocityX(0); return; }
        else s.setData('isBlocking', false);

        const punchJustDown = (p.justDown !== undefined) ? p.justDown : Phaser.Input.Keyboard.JustDown(p);
        const kickJustDown = (k.justDown !== undefined) ? k.justDown : Phaser.Input.Keyboard.JustDown(k);

        if (punchJustDown) {
            const lastP = s.getData('lastPressPunch') || 0;
            if (now - lastP < 250) this.superAttack(s, pre, 'punch');
            else this.attack(s, pre, 'attack1');
            s.setData('lastPressPunch', now);
        }
        else if (kickJustDown) {
            const lastK = s.getData('lastPressKick') || 0;
            if (now - lastK < 250) this.superAttack(s, pre, 'kick');
            else this.attack(s, pre, 'attack2');
            s.setData('lastPressKick', now);
        }

        if (!walk && !s.getData('isAttacking') && !s.getData('isBlocking')) {
            if (s.body.touching.down) s.play(`${pre}_idle`, true);
        }
    }

    performMove(s, pre, type) {
        if (s.getData('isAttacking') || s.getData('isBlocking')) return;

        // ONLINE SYNC CHECK
        const isOnline = (this.gameMode === 'ONLINE' || this.gameMode === '2V2_CHAOS');
        const role = (window.networkManager) ? window.networkManager.playerIndex : 0;
        let isMine = true;
        if (isOnline) {
            const sTab = pre.toLowerCase(); // p1, p2, p3, p4
            if (sTab === 'p1' && role !== 0) isMine = false;
            if (sTab === 'p2' && role !== 1) isMine = false;
            if (sTab === 'p3' && role !== 2) isMine = false;
            if (sTab === 'p4' && role !== 3) isMine = false;
        }

        if (type === 'taunt') {
            s.setData('isAttacking', true).play(`${pre}_taunt`);
            this.time.delayedCall(800, () => {
                if (s.active) s.setData('isAttacking', false).play(`${pre}_idle`);
            });
        }
        else if (type === 'super') {
            // HORSE CHARGE / SUPER ATTACK

            // DJ IKE POLICE CAR SUPER
            const realKey = (pre === 'p1') ? this.p1Key : this.p2Key;
            if (realKey && realKey.toUpperCase().includes('IKE')) {
                const cost = 100;
                if (isMine && s.getData('energy') < cost) return;
                s.setData('energy', s.getData('energy') - cost);

                // Play only frames 0-3 of the Super animation (Row 6)
                // USER REQUEST: "dj ike w super ciosie ma sie pojawic tylko klatka 0-3"
                const superAnimKey = `${pre}_attack1_super`;
                s.setData('isAttacking', true).setVelocityX(0).play(superAnimKey);

                // Hack to limit animation range
                // We'll let it start, then pause/hold at frame 3.

                this.time.delayedCall(200, () => {
                    if (s.active) {
                        s.anims.pause();
                        if (s.anims.currentFrame && s.anims.currentFrame.index > 3) {
                            s.anims.setCurrentFrame(s.anims.currentAnim.frames[3]); // Force Frame 3
                        }
                    }
                });

                this.safeSound('playPower'); // Siren logic can go here later?

                // Spawn Car at after 4 frames (~220ms)
                this.time.delayedCall(220, () => {
                    this.spawnPoliceCar(s);
                });

                // Recovery
                this.time.delayedCall(1500, () => {
                    if (s.active) {
                        s.anims.resume();
                        s.setData('isAttacking', false).play(`${pre}_idle`);
                    }
                });
                return;
            }

            // ASTEK POLAROID CHECK (Dedicated Key)
            const data = this.findCharData(realKey);

            // Debug Log
            console.log(`[PerformMove] Super check for ${realKey}`);

            const isPolaroid = (data && data.spriteSheetData.states.attack1_super && data.spriteSheetData.states.attack1_super.type === 'polaroid');

            if (isPolaroid) {
                const cost = 100;
                if (isMine && s.getData('energy') < cost) return;
                s.setData('energy', s.getData('energy') - cost);

                s.setData('isAttacking', true).setVelocityX(0).play(`${pre}_attack1_super`);

                // Flash Effect
                this.cameras.main.flash(500, 255, 255, 255);
                this.safeSound('playCameraShutter');

                this.time.delayedCall(300, () => {
                    if (!s.active) return;
                    const vic = this.findClosestEnemy(s);
                    if (vic && vic.active) {
                        // APPLY TRAP
                        vic.setData('isPolaroidTrapped', true);
                        vic.setData('polaroidTime', this.time.now);
                        vic.setVelocity(0);
                        vic.anims.pause();
                        vic.setTint(0xeeeeff);

                        // Create Polaroid Frame
                        this.createPolaroidFrame(vic);

                        this.showFloatingText(vic.x, vic.y - 120, "CHEESE!", 0xffffff);

                        // Auto-release
                        this.time.delayedCall(3000, () => {
                            if (vic.active && vic.getData('isPolaroidTrapped')) {
                                vic.setData('isPolaroidTrapped', false);
                                vic.anims.resume();
                                vic.clearTint();
                                if (vic.polaroidFrame) { vic.polaroidFrame.destroy(); vic.polaroidFrame = null; }
                            }
                        });
                    }
                });

                s.once('animationcomplete', () => { if (s.active) s.setData('isAttacking', false).play(`${pre}_idle`); });
                return;
            }

            // WAIMA ENERGY TRAP CHECK (Dedicated Key)
            const isEnergyTrap = (data && data.spriteSheetData.states.attack1_super && data.spriteSheetData.states.attack1_super.type === 'energy_trap');
            if (isEnergyTrap) {
                const cost = 100;
                if (isMine && s.getData('energy') < cost) return;
                s.setData('energy', 0);

                s.setData('isAttacking', true).setVelocityX(0).play(`${pre}_attack1_super`);
                this.safeSound('playPower');

                this.time.delayedCall(400, () => {
                    if (!s.active) return;
                    const vic = this.findClosestEnemy(s);
                    const d = Phaser.Math.Distance.Between(s.x, s.y, vic.x, vic.y);
                    const facing = ((s.flipX && vic.x < s.x) || (!s.flipX && vic.x > s.x));
                    if (vic && vic.active && d < 450 && facing) {
                        // APPLY ENERGY TRAP
                        vic.setData('isEnergyTrapped', true);
                        vic.setData('energyTrappedTime', this.time.now);
                        vic.setVelocity(0, 0);
                        if (vic.body) vic.body.setAllowGravity(false);
                        vic.y -= 60; // Levitation lift
                        if (vic.anims && vic.anims.isPlaying) vic.anims.pause();
                        vic.setTint(0x00ff00);

                        // --- GREEN ENERGY SHIELD (AURA) ---
                        if (!vic.energyShield) {
                            const shield = this.add.graphics();
                            shield.setDepth(19); // Behind character (char depth is slightly higher)
                            vic.energyShield = shield;
                        }

                        this.showFloatingText(vic.x, vic.y - 120, "ENERGY TRAP!", 0x00ff00);

                        // Auto-release after 2 seconds
                        this.time.delayedCall(2000, () => {
                            if (vic.active && vic.getData('isEnergyTrapped')) {
                                vic.setData('isEnergyTrapped', false);
                                if (vic.body) vic.body.setAllowGravity(true);
                                vic.anims.resume();
                                vic.clearTint();
                                if (vic.energyShield) {
                                    vic.energyShield.destroy();
                                    vic.energyShield = null;
                                }
                            }
                        });
                    }
                });

                s.once('animationcomplete', () => { if (s.active) s.setData('isAttacking', false).play(`${pre}_idle`); });
                return;
            }

            // MIELZKY HEALING SUPER
            if (realKey && realKey.toUpperCase().includes('MIELZKY')) {
                const cost = 100;
                if (isMine && s.getData('energy') < cost) return;
                s.setData('energy', 0);

                const superAnimKey = this.anims.exists(`${pre}_attack1_super`) ? `${pre}_attack1_super` : `${pre}_special`;
                s.setData('isAttacking', true).setVelocityX(0).play(superAnimKey);
                this.safeSound('playMielon');

                this.cameras.main.flash(500, 100, 255, 100); // Green flash for healing

                // Healing logic - 40 HP over duration
                const healEvent = this.time.addEvent({
                    delay: 100,
                    repeat: 20,
                    callback: () => {
                        if (!s.active) return;
                        let hp = s.getData('health') + 2;
                        if (hp > 100) hp = 100;
                        s.setData('health', hp);

                        // Particle effect for healing
                        if (this.sparks) {
                            this.sparks.emitParticleAt(s.x, s.y - 40, 2);
                        }
                    }
                });

                this.time.delayedCall(2000, () => {
                    if (s.active) {
                        s.setData('isAttacking', false).play(`${pre}_idle`);
                    }
                });
                return;
            }

            // TACO SUPER - Screen flash effect
            const isTacoSuper = (data && data.spriteSheetData.states.attack1_super && data.spriteSheetData.states.attack1_super.type === 'taco_super');
            if (isTacoSuper) {
                const cost = 100;
                if (isMine && s.getData('energy') < cost) return;
                s.setData('energy', 0);

                const superAnimKey = this.anims.exists(`${pre}_attack1_super`) ? `${pre}_attack1_super` : `${pre}_special`;
                s.setData('isAttacking', true).play(superAnimKey);
                this.safeSound('playPower');

                // Ruch do przodu (jak inni podczas super) - szybki sprint przez cały ekran
                const dashDir = s.flipX ? -1 : 1;
                s.setVelocityX(dashDir * 3000);
                this.time.delayedCall(700, () => { if (s.active) s.setVelocityX(0); });

                // Flash 3x na CZARNO (nie biały)
                this.time.addEvent({
                    delay: 200,
                    repeat: 3,
                    callback: () => {
                        this.cameras.main.flash(80, 0, 0, 0); // czarny flash
                    }
                });

                const vic = this.findClosestEnemy(s);
                if (vic && vic.active) {
                    this.time.delayedCall(600, () => {
                        if (!s.active) return;
                        this.hit(s, vic, 35);
                        this.cameras.main.flash(200, 0, 0, 0); // czarny flash przy uderzeniu
                    });
                }

                s.once('animationcomplete', () => { if (s.active) s.setData('isAttacking', false).play(`${pre}_idle`); });
                return;
            }

            const cost = 100;
            if (s.getData('energy') < cost) return;
            s.setData('energy', 0);

            // Try attack1_super first, fallback to special if not found
            const superAnimKeyFinal = this.anims.exists(`${pre}_attack1_super`) ? `${pre}_attack1_super` : `${pre}_special`;
            s.setData('isAttacking', true).play(superAnimKeyFinal); // Uses Super Animation (Row 6)
            s.setVelocityX(s.flipX ? -900 : 900); // Faster Dash
            const superState = data && data.spriteSheetData.states.attack1_super;
            if (superState && superState.sound === 'car_horn') {
                this.safeSound('playCarHorn');
            } else {
                this.safeSound('playPower');
            }

            this.cameras.main.shake(500, 0.05);

            this.time.delayedCall(800, () => {
                if (s.active) {
                    s.setVelocityX(0);
                    s.setData('isAttacking', false).play(`${pre}_idle`);
                }
            });

            // Hitbox check during charge (Multiple checks)
            this.time.addEvent({
                delay: 80, repeat: 8, callback: () => {
                    const vic = (s === this.player) ? this.enemy : this.player;
                    if (this.hitTest(s, vic)) this.hit(s, vic, 40); // High Damage
                }
            });
        }
        else if (type === 'special') {
            // SPECIAL ATTACK (Row 5)
            const specialAnimKey = this.anims.exists(`${pre}_special`) ? `${pre}_special` : `${pre}_lasso_super`;
            const realKey = (pre === 'p1') ? this.p1Key : (pre === 'p2') ? this.p2Key : (pre === 'p3') ? this.p3Key : this.p4Key;
            const data = this.findCharData(realKey);

            const specialType = (data && data.spriteSheetData.states.special) ? data.spriteSheetData.states.special.type : null;

            s.setData('isAttacking', true).setVelocityX(0).play(specialAnimKey);
            s.setData('projectileSpawned', false);
            this.safeSound('playAttack');

            // SOBEL THROW - Play frames 0-2, then spawn projectile (frame 7) and go to idle
            if (specialType === 'sobel_throw') {
                let sobelHandled = false;

                const sobelTimer = this.time.addEvent({
                    delay: 16,
                    repeat: 60,
                    callback: () => {
                        if (!s.active || sobelHandled) return;
                        const currentAnim = s.anims.currentAnim;
                        if (!currentAnim || currentAnim.key !== specialAnimKey) return;

                        const fi = s.anims.currentFrame ? (s.anims.currentFrame.index - 1) : 0;

                        if (fi >= 2) {
                            sobelHandled = true;
                            sobelTimer.remove();

                            // Stop animation on postaci - wróć do idle
                            if (!s.getData('projectileSpawned')) {
                                this.spawnSpecialProjectile(s, pre);
                                s.setData('projectileSpawned', true);
                            }

                            // Od razu wróć do idle - NIE pokazuj klatki 7 na postaci
                            s.anims.stop();
                            if (s.active) s.setData('isAttacking', false).play(`${pre}_idle`);
                        }
                    }
                });

                s.once('animationcomplete', () => {
                    sobelTimer.remove();
                    if (!s.getData('projectileSpawned')) {
                        this.spawnSpecialProjectile(s, pre);
                        s.setData('projectileSpawned', true);
                    }
                    if (s.active) s.setData('isAttacking', false).play(`${pre}_idle`);
                });
                return;
            }

            // FRANCIS THROW - frames 0-2 leading to frame 7 (frame 7 IS SHOWN on character)
            if (specialType === 'francis_throw') {
                let francisHandled = false;
                const francisTimer = this.time.addEvent({
                    delay: 16,
                    repeat: 60,
                    callback: () => {
                        if (!s.active || francisHandled) return;
                        const currentAnim = s.anims.currentAnim;
                        if (!currentAnim || currentAnim.key !== specialAnimKey) return;

                        const fi = s.anims.currentFrame ? (s.anims.currentFrame.index - 1) : 0;

                        if (fi === 2) {
                            francisHandled = true;
                            francisTimer.remove();

                            // Show Frame 7 and throw
                            s.anims.pause();
                            const frames = s.anims.currentAnim.frames;
                            if (frames[7]) s.anims.setCurrentFrame(frames[7]);

                            if (!s.getData('projectileSpawned')) {
                                this.spawnSpecialProjectile(s, pre);
                                s.setData('projectileSpawned', true);
                            }

                            this.time.delayedCall(300, () => {
                                if (s.active) {
                                    s.anims.resume();
                                    s.setData('isAttacking', false).play(`${pre}_idle`);
                                }
                            });
                        }
                    }
                });
                s.once('animationcomplete', () => {
                    francisTimer.remove();
                    if (!s.getData('projectileSpawned')) {
                        this.spawnSpecialProjectile(s, pre);
                        s.setData('projectileSpawned', true);
                    }
                    if (s.active) s.setData('isAttacking', false).play(`${pre}_idle`);
                });
                return;
            }

            // GENERIC SPECIAL: Spawn projectile at triggerFrame
            let triggerFrame = 3;
            if (data && data.spriteSheetData.states.special && data.spriteSheetData.states.special.triggerFrame !== undefined) {
                triggerFrame = data.spriteSheetData.states.special.triggerFrame;
            }

            const onUpdate = (anim, frame) => {
                if (anim.key === specialAnimKey) {
                    if (s.getData('projectileSpawned')) return;
                    const currentFrameIndex = frame.index - 1;
                    if (currentFrameIndex >= triggerFrame) {
                        this.spawnSpecialProjectile(s, pre);
                        s.setData('projectileSpawned', true);
                    }
                }
            };

            const onComplete = (anim) => {
                if (anim.key === specialAnimKey) {
                    s.off('animationupdate', onUpdate);
                    s.off('animationcomplete', onComplete);
                    if (s.active) {
                        s.setData('isAttacking', false).play(`${pre}_idle`);
                    }
                }
            };

            s.on('animationupdate', onUpdate);
            s.on('animationcomplete', onComplete);
        }
    }

    spawnPoliceCar(owner) {
        // Start behind the player
        const startX = owner.flipX ? 1100 : -100;
        const targetX = owner.flipX ? -200 : 1200;
        const groundY = owner.y;

        // Create Sprite
        // Use 'police_car' key if loaded, else fallback to a box
        let car;
        if (this.textures.exists('police_car')) {
            const groundLevel = window.groundLevel || 516;
            // USER REQUEST: Lower 50px more (previously -25, so now +25 relative to ground)
            car = this.physics.add.image(startX, groundLevel + 25, 'police_car');
            car.setOrigin(0.5, 1);
            // USER REQUEST: Stretch height another 20% (190 * 1.2 approx 230)
            car.setDisplaySize(290, 230);
            car.setFlipX(owner.flipX);
        } else {
            // Fallback if image not loaded yet
            car = this.add.rectangle(startX, groundY, 200, 100, 0x0000ff);
            this.physics.add.existing(car);
            car.setOrigin(0.5, 1);
        }

        car.body.allowGravity = false;
        car.setDepth(20); // In front

        // Sound
        this.safeSound('playCarHorn');

        // Points 2: Motion trail / smoke particles
        const smoke = this.add.particles(0, 0, 'placeholder', {
            speed: { min: 20, max: 80 },
            scale: { start: 0.5, end: 2.5 },
            alpha: { start: 0.7, end: 0 },
            tint: 0xeeeeee,
            lifespan: 600,
            frequency: 40,
            blendMode: 'NORMAL',
            emitting: true,
            follow: car,
            followOffset: { x: owner.flipX ? 110 : -110, y: 10 } // Smoke from wheels area
        });
        smoke.setDepth(15);

        // Tween movement (Drive across screen)
        this.tweens.add({
            targets: car,
            x: targetX,
            duration: 1200, // Faster drive as requested (was 1500)
            ease: 'Linear',
            onUpdate: () => {
                // Just in case we need sync, but emitter with follow is automatic
            },
            onComplete: () => {
                smoke.stop();
                this.time.delayedCall(1000, () => smoke.destroy()); // Wait for last puffs
                car.destroy();
            }
        });

        // Hit Logic
        this.physics.add.overlap(car, (owner === this.player ? this.enemy : this.player), (c, victim) => {
            if (c.hasHit) return;
            c.hasHit = true;

            // Big Damage
            this.hit(owner, victim, 40);

            // Fly up
            victim.setVelocityY(-800);

            // Shake
            this.cameras.main.shake(200, 0.05);
        });
    }

    spawnSpecialProjectile(owner, pre) {
        const startX = owner.x + (owner.flipX ? -80 : 80);
        const startY = owner.y - 50;

        // Get actual character ID from p1Key/p2Key
        const realKey = (pre === 'p1') ? this.p1Key : this.p2Key;
        const data = this.findCharData(realKey);

        const cols = (data && data.spriteSheetData.framesMax) ? data.spriteSheetData.framesMax : 8;

        let frameIdx = 0;
        let animFrames = 8;

        if (data && data.spriteSheetData.states.special) {
            const state = data.spriteSheetData.states.special;
            const row = state.row;
            // Use projectileFrame if defined, else default to 7 (8th frame)
            const frameOffset = (state.projectileFrame !== undefined) ? state.projectileFrame : 7;
            frameIdx = (row * cols) + frameOffset;
        } else if (data && data.spriteSheetData.states.lasso_super) {
            const row = data.spriteSheetData.states.lasso_super.row;
            frameIdx = (row * cols) + 7;
        } else {
            frameIdx = 7;
        }

        // Clamp frameIdx to valid range? 
        // User said "Always frame 8". We trust it exists.
        // But for safety, check against spritesheet limit if known?
        // No, let's just do what is asked.

        const proj = this.physics.add.sprite(startX, startY, `${pre}_sheet`);
        proj.setDisplaySize(150, 150);
        proj.setDepth(15);

        // Add Poświata (Glow) Effect
        proj.setAlpha(0.9);
        proj.setTint(0xccffff);

        // --- PROJECTILE PARTICLE TRAIL ---
        // INCREASED SCALE AND LIFESPAN FOR VISIBILITY
        const particles = this.add.particles(0, 0, 'placeholder', {
            speed: { min: 20, max: 100 },
            angle: { min: 0, max: 360 },
            scale: { start: 3, end: 0 }, // INCREASED FROM 0.4
            alpha: { start: 0.8, end: 0 },
            lifespan: 600, // INCREASED
            quantity: 2, // INCREASED
            frequency: 15,
            tint: (pre === 'p1' || pre === 'p3') ? 0x00ffff : 0xff0055,
            follow: proj,
            blendMode: 'ADD'
        });
        particles.setDepth(14);

        // Force frame set
        proj.setFrame(frameIdx);

        const speed = 1300;
        proj.setVelocityX(owner.flipX ? -speed : speed);
        proj.body.allowGravity = false;

        // No rotation for WAIMA and SOBEL
        const noRotate = realKey.toUpperCase().includes('WAIMA') || (data && data.spriteSheetData.states.special && data.spriteSheetData.states.special.type === 'sobel_throw');
        if (!noRotate) {
            proj.setAngularVelocity(proj.flipX ? -720 : 720);
        }

        // Hit Logic
        this.physics.add.overlap(proj, (owner === this.player ? this.enemy : this.player), (p, victim) => {
            p.destroy();
            particles.stop(); // Stop emitting but let existing particles finish
            this.time.delayedCall(500, () => particles.destroy());

            this.hit(owner, victim, 15);
            victim.setVelocityX(0);
            this.cameras.main.shake(100, 0.01);
        });

        // Cleanup
        this.time.delayedCall(1500, () => {
            if (proj.active) proj.destroy();
            if (particles.active) {
                particles.stop();
                this.time.delayedCall(500, () => particles.destroy());
            }
        });
    }

    // Legacy alias
    spawnLassoProjectile(owner, pre) {
        this.spawnSpecialProjectile(owner, pre);
    }

    dash(s, pre, dir) {
        if (s.getData('isAttacking')) return;
        s.setData('isAttacking', true); // Lock movement
        s.setVelocityX(dir * 1200);
        s.play(`${pre}_run`, true);

        // --- DASH TRAIL EFFECT ---
        const trailColor = (pre === 'p1' || pre === 'p3') ? 0x00ffff : 0xff0055;
        const trailTimer = this.time.addEvent({
            delay: 30,
            repeat: 5,
            callback: () => {
                if (!s.active) return;
                const ghost = this.add.sprite(s.x, s.y, s.texture.key);
                ghost.setFrame(s.anims.currentFrame.frame.name);
                ghost.setOrigin(0.5, 1); // FIXED: Match character origin
                ghost.setFlipX(s.flipX);
                ghost.setScale(s.scaleX, s.scaleY);
                ghost.setTint(trailColor);
                ghost.setAlpha(0.6);
                ghost.setDepth(s.depth - 1);

                this.tweens.add({
                    targets: ghost,
                    alpha: 0,
                    duration: 300,
                    onComplete: () => ghost.destroy()
                });
            }
        });

        this.time.delayedCall(150, () => {
            s.setVelocityX(0);
            s.setData('isAttacking', false);
        });
    }

    superAttack(s, pre, type) {
        const cost = 100; // Full bar required
        console.log(`[SuperAttack] Attempt: ${pre} Type: ${type} Energy: ${s.getData('energy')}`);

        if (s.getData('energy') < cost) {
            console.log(`[SuperAttack] Failed - Not enough energy`);
            return;
        }

        // ASTEK POLAROID CHECK
        const realKey = (pre === 'p1') ? this.p1Key : this.p2Key;
        const data = this.findCharData(realKey);

        console.log(`[SuperAttack] RealKey: ${realKey}`, data);

        const isPolaroid = (data && data.spriteSheetData.states.attack1_super && data.spriteSheetData.states.attack1_super.type === 'polaroid');
        console.log(`[SuperAttack] IsPolaroid: ${isPolaroid}`);

        if (isPolaroid) {
            s.setData('energy', 0);
            s.setData('isAttacking', true).setVelocityX(0).play(`${pre}_attack1_super`);

            // Flash Effect
            this.cameras.main.flash(500, 255, 255, 255);
            this.safeSound('playCameraShutter'); // Assuming this exists or generic

            this.time.delayedCall(300, () => {
                if (!s.active) return;
                // Trap closest enemy
                const vic = this.findClosestEnemy(s);
                if (vic && vic.active) {
                    // APPLY TRAP
                    vic.setData('isPolaroidTrapped', true);
                    vic.setData('polaroidTime', this.time.now);
                    vic.setVelocity(0);
                    vic.anims.pause();
                    vic.setTint(0xccccff); // Slight blue-ish tint

                    // Create Polaroid Frame
                    if (!vic.polaroidFrame) {
                        const frame = this.add.graphics();
                        frame.lineStyle(6, 0xffffff, 1); // Thick white border
                        frame.fillStyle(0xffffff, 0); // Hollow center

                        const w = 80;
                        const h = 180; // Approximate char height
                        const xOffset = -w / 2;
                        const yOffset = -h;

                        frame.strokeRect(xOffset, yOffset, w, h);
                        // Bottom "Label" area
                        frame.fillStyle(0xffffff, 1);
                        frame.fillRect(xOffset, yOffset + h, w, 30);

                        frame.setDepth(25);
                        vic.polaroidFrame = frame;
                    }

                    this.showFloatingText(vic.x, vic.y - 100, "TRAPPED!", 0xffffff);

                    // Auto-release after 3 seconds if not hit
                    this.time.delayedCall(3000, () => {
                        if (vic.active && vic.getData('isPolaroidTrapped')) {
                            vic.setData('isPolaroidTrapped', false);
                            vic.anims.resume();
                            vic.clearTint();
                            if (vic.polaroidFrame) { vic.polaroidFrame.destroy(); vic.polaroidFrame = null; }
                        }
                    });
                }
            });

            s.once('animationcomplete', () => { if (s.active) s.setData('isAttacking', false).play(`${pre}_idle`); });
            return;
        }

        // WAIMA ENERGY TRAP CHECK
        const isEnergyTrap = (data && data.spriteSheetData.states.attack1_super && data.spriteSheetData.states.attack1_super.type === 'energy_trap');
        if (isEnergyTrap) {
            s.setData('energy', 0);
            s.setData('isAttacking', true).setVelocityX(0).play(`${pre}_attack1_super`);
            this.safeSound('playPower');

            this.time.delayedCall(400, () => {
                if (!s.active) return;
                const vic = this.findClosestEnemy(s);
                const d = Phaser.Math.Distance.Between(s.x, s.y, vic.x, vic.y);
                const facing = ((s.flipX && vic.x < s.x) || (!s.flipX && vic.x > s.x));
                if (vic && vic.active && d < 450 && facing) {
                    // APPLY ENERGY TRAP
                    vic.setData('isEnergyTrapped', true);
                    vic.setData('energyTrappedTime', this.time.now);
                    vic.setVelocity(0, 0);
                    if (vic.body) vic.body.setAllowGravity(false);
                    vic.y -= 60; // Levitation lift
                    if (vic.anims && vic.anims.isPlaying) vic.anims.pause();
                    vic.setTint(0x00ff00);

                    // --- GREEN ENERGY SHIELD (AURA) ---
                    if (!vic.energyShield) {
                        const shield = this.add.graphics();
                        shield.setDepth(19);
                        vic.energyShield = shield;
                    }

                    this.showFloatingText(vic.x, vic.y - 120, "ENERGY TRAP!", 0x00ff00);

                    // Auto-release after 2 seconds
                    this.time.delayedCall(2000, () => {
                        if (vic.active && vic.getData('isEnergyTrapped')) {
                            vic.setData('isEnergyTrapped', false);
                            if (vic.body) vic.body.setAllowGravity(true);
                            vic.anims.resume();
                            vic.clearTint();
                            if (vic.energyShield) {
                                vic.energyShield.destroy();
                                vic.energyShield = null;
                            }
                        }
                    });
                }
            });

            s.once('animationcomplete', () => { if (s.active) s.setData('isAttacking', false).play(`${pre}_idle`); });
            return;
        }

        s.setData('energy', s.getData('energy') - cost);
        s.setData('isAttacking', true).setVelocityX(0).play(`${pre}_attack${type === 'punch' ? 1 : 2}`);
        this.safeSound('playAttack');

        // Heavy super effects
        this.cameras.main.shake(400, 0.04);
        this.domShake(400, 15); // Powerful DOM shake for "screen" feel

        s.once('animationcomplete', () => { if (s.active) s.setData('isAttacking', false).play(`${pre}_idle`); });

        // Large hitbox hit test
        this.time.delayedCall(200, () => {
            if (!s.active) return;
            const vic = this.findClosestEnemy(s);
            if (vic && s.active) {
                const d = Phaser.Math.Distance.Between(s.x, s.y, vic.x, vic.y);
                // Super has longer range
                if (d < 280 && ((s.flipX && vic.x < s.x) || (!s.flipX && vic.x > s.x))) {
                    const damage = (type === 'punch') ? 35 : 55;
                    this.hit(s, vic, damage);
                }
            }
        });
    }

    showFloatingText(x, y, message, color) {
        const text = this.add.text(x, y, message, {
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }


    triggerImpactFlash(target, duration = 100) {
        if (!target || !target.active) return;
        target.setTint(0xffffff);
        this.time.delayedCall(duration, () => {
            if (target.active) target.clearTint();
        });
    }


    doAI(e, t, pre) {
        if (!e.active || !t.active) return;

        // POLAROID TRAP LOCK
        if (e.getData('isPolaroidTrapped')) {
            e.setVelocity(0);
            return;
        }

        // MOVEMENT LOCK (KO Bounce)
        if (e.getData('isKoBouncing')) return;

        // JUMP ROTATION (Kolowrotek) for AI
        const isJumpAnim = e.anims.currentAnim && e.anims.currentAnim.key.endsWith('_jump');
        if (!e.body.touching.down && !e.getData('isAttacking') && isJumpAnim) {
            e.setOrigin(0.5, 0.5);
            e.angle += (e.flipX ? -25 : 25); // Sync with player speed
        } else {
            e.setOrigin(0.5, 1);
            e.angle = 0;
        }

        if (e.getData('isAttacking')) return;

        const d = Phaser.Math.Distance.Between(e.x, e.y, t.x, t.y);
        const diff = this.aiDifficulty || 'KASZTAN';



        // 1. REACTIVE BLOCKING & COUNTERS
        const isPlayerAttacking = t.anims.currentAnim && (t.anims.currentAnim.key.includes('attack'));

        // Difficulty Tuning
        // KASZTAN: Dumb, rarely blocks
        // OGOR: Avg, blocks 40%
        // CHUCKNORRIS: Godlike, blocks 95%, predicts
        let blockChance = 0.01;
        let aggression = 0.01;
        let reactionSpeed = 1000;

        if (diff === 'OGOR') { blockChance = 0.4; aggression = 0.04; reactionSpeed = 400; }
        else if (diff === 'CHUCKNORRIS' || diff === 'HARD') { blockChance = 0.95; aggression = 0.25; reactionSpeed = 100; }

        // Block Logic
        if (isPlayerAttacking && d < 220 && Math.random() < blockChance) {
            e.setVelocityX(0);
            e.play(`${pre}_block`, true);
            return;
        }

        // 2. PREDICTIVE ATTACKS (The "Read")
        // If enemy is moving towards us and close, PRE-EMPTIVE STRIKE
        const movingTowards = (t.body.velocity.x > 0 && t.x < e.x) || (t.body.velocity.x < 0 && t.x > e.x);

        if (diff !== 'KASZTAN' && movingTowards && d < 130 && Math.random() < (diff === 'CHUCKNORRIS' ? 0.8 : 0.3)) {
            const attackType = Math.random() > 0.5 ? 'attack1' : 'attack2';
            this.attack(e, pre, attackType);
            return; // Acted
        }

        // 3. MOVEMENT & ZONING
        let speed = (diff === 'KASZTAN') ? 200 : (diff === 'OGOR' ? 320 : 450); // Speed boost for Chuck
        let jumpChance = (diff === 'KASZTAN') ? 0.001 : (diff === 'OGOR' ? 0.01 : 0.05);

        // Anti-Air / Jump Check
        if (t.y < e.y - 50 && e.body.touching.down) {
            // Enemy in air
            if (Math.random() < jumpChance * 5) {
                e.setVelocityY(-1100); // Meet them in air
            }
        }
        // Random Jump
        else if (e.body.touching.down && Math.random() < jumpChance) {
            e.setVelocityY(-1100);
        }

        // 4. SPECIALS & SUPERS (AI)
        if (diff !== 'KASZTAN' && !e.getData('isAttacking')) {
            // Super Attack (Full Energy)
            // Chuck uses it almost immediately when in range
            if (e.getData('energy') >= 100) {
                const superRange = 280;
                if (d < superRange && Math.random() < (diff === 'CHUCKNORRIS' ? 0.2 : 0.05)) {
                    this.performMove(e, pre, 'super');
                    return;
                }
            }

            // Special Attack (Projectile/Lasso)
            // Use at range to ZONE the player
            if (d > 350 && Math.random() < (diff === 'CHUCKNORRIS' ? 0.15 : 0.05)) {
                this.performMove(e, pre, 'special');
                return;
            }

            // Close range mixup (rare special)
            if (d < 180 && Math.random() < 0.02) {
                this.performMove(e, pre, 'special');
                return;
            }
        }

        // 5. STANDARD MOVEMENT & ATTACK
        if (d > 130) {
            // Chase
            const dir = (t.x < e.x) ? -1 : 1;
            e.setVelocityX(speed * dir).setFlipX(dir === -1).play(`${pre}_run`, true);
        } else if (d < 60) {
            // Uncomfortably close - Attack or Back off
            if (Math.random() < 0.5) {
                e.setVelocityX(0); // Stand ground
            } else {
                // Backdash kiting
                const dir = (t.x < e.x) ? 1 : -1;
                e.setVelocityX(speed * dir).setFlipX(dir === -1).play(`${pre}_run`, true);
            }
        } else {
            // In Combat Range (60-130)
            e.setVelocityX(0);

            // Attacking
            if (Math.random() < aggression) {
                const attackType = Math.random() > 0.4 ? 'attack1' : 'attack2';
                this.attack(e, pre, attackType);
            } else {
                e.play(`${pre}_idle`, true);
            }
        }
    }

    attack(s, pre, type) {
        s.setData('isAttacking', true).setVelocityX(0).play(`${pre}_${type}`);
        this.safeSound('playAttack');
        s.once('animationcomplete', () => { if (s.active) s.setData('isAttacking', false).play(`${pre}_idle`); });
        this.time.delayedCall(150, () => {
            if (!s.active) return;
            if (!s.active) return;
            const vic = this.findClosestEnemy(s);
            if (vic && this.hitTest(s, vic)) this.hit(s, vic, type === 'attack1' ? 10 : 12);
        });
    }

    hitTest(a, v) {
        const d = Phaser.Math.Distance.Between(a.x, a.y, v.x, v.y);
        return d < 140 && ((a.flipX && v.x < a.x) || (!a.flipX && v.x > a.x));
    }

    hit(a, v, d) {
        if (!d) d = (a === this.player ? 12 : 8);

        let finalDamage = d;
        let isBlocked = false;

        if (v.getData('isBlocking')) {
            finalDamage = d * 0.2; // 80% reduction
            isBlocked = true;
            this.safeSound('playNav');

            // --- BLOCK SPARKS ---
            if (this.sparks) {
                const offsetX = (a.x > v.x) ? 40 : -40;
                this.sparks.emitParticleAt(v.x + offsetX, v.y - 60, 5);
            }
        } else {
            // Check Polaroid Trap Break
            if (v.getData('isPolaroidTrapped')) {
                v.setData('isPolaroidTrapped', false);
                v.anims.resume();
                v.clearTint();
                this.safeSound('playGlassBreak');

                // SHATTER EFFECT
                if (v.polaroidFrame) {
                    v.polaroidFrame.destroy();
                    v.polaroidFrame = null;
                }

                // Spawn white particles
                const shatter = this.add.particles(v.x, v.y - 90, 'placeholder', {
                    speed: { min: 50, max: 200 },
                    angle: { min: 0, max: 360 },
                    scale: { start: 0.5, end: 0 },
                    lifespan: 600,
                    gravityY: 800,
                    quantity: 20,
                    tint: 0xffffff,
                    emitting: false
                });
                shatter.explode(20);
                this.time.delayedCall(1000, () => shatter.destroy());

                finalDamage *= 1.2;
                this.showFloatingText(v.x, v.y - 50, "SHATTER!", 0xffffff);
            }

            v.play(`${v.getData('prefix')}_takeHit`, true);
            this.safeSound('playHit');

            // --- ARCADE EFFECTS ---
            this.triggerImpactFlash(v);

            // STUN LOCK FIX: If v was attacking or blocking, interrupt it!
            if (v.getData('isAttacking') || v.getData('isBlocking')) {
                console.log(`[Combat] Interrupted action for ${v.getData('prefix')}`);
                v.setData('isAttacking', false);
                v.setData('isBlocking', false);
            }

            // Force return to idle after stun (prevents sticking in "death-like" frames)
            this.time.delayedCall(400, () => {
                if (v.active && !v.getData('dead') && !v.getData('isKoBouncing')) {
                    v.play(`${v.getData('prefix')}_idle`, true);
                }
            });
        }

        let hp = v.getData('health') - finalDamage;
        if (isNaN(hp)) hp = 0;
        hp = Math.max(0, hp);

        console.log(`[Combat] Hit! Target: ${v.getData('prefix')} Damage: ${finalDamage} (Initial HP: ${v.getData('health')} -> Final HP: ${hp})`);
        v.setData('health', hp);

        if (this.sparks) {
            this.sparks.emitParticleAt(v.x, v.y - 40, (hp <= 0 ? 30 : 15)); // Increased hit sparks
        }

        // --- ENHANCED SCREEN SHAKE ---
        const shakeIntensity = Math.min(0.015, (finalDamage / 100) * 0.05 + 0.005);
        this.cameras.main.shake(150, shakeIntensity);
        this.domShake(100, 3 + (finalDamage / 10));

        if (hp <= 0) {
            console.log(`[Combat] HP <= 0, triggering KO for ${v.getData('prefix')}`);

            // --- ARCADE EFFECTS ---

            // Force reset any stuck flags
            v.setData('isAttacking', true); // Lock for KO flight
            v.setData('isBlocking', false);

            // KO BOUNCE LOGIC
            // If already bouncing, we still might want to update the attacker reference for direction
            if (!v.getData('isKoBouncing')) {
                this.startKoBounce(v, a);
            }
        }

        // HYPER METER LOGIC
        // Attacker Gain
        const gainAtk = isBlocked ? 5 : 10;
        a.setData('energy', Math.min(100, a.getData('energy') + gainAtk));

        // Victim Gain (rage/revenge)
        const gainVic = isBlocked ? 5 : 10;
        v.setData('energy', Math.min(100, v.getData('energy') + gainVic));

        // COMBO LOGIC
        if (isBlocked) {
            a.setData('combo', 0);
            this.updateComboUI();
        } else {
            const combo = (a.getData('combo') || 0) + 1;
            a.setData('combo', combo);
            a.setData('comboTimer', 100); // Reset timer

            // Victim combo always resets on taking hit
            v.setData('combo', 0);
            this.updateComboUI();
        }

        // --- ONLINE HIT SYNC ---
        if (window.networkManager && window.networkManager.isOnline) {
            const role = window.networkManager.playerIndex;
            const aTag = a.getData('prefix').toUpperCase(); // P1, P2, P3, P4
            const vTag = v.getData('prefix').toUpperCase();

            // AUTHORITATIVE HIT: Only the owner of the attacker sends the hit event.
            // role: 0=P1, 1=P2, 2=P3, 3=P4
            const isOwner = (role === 0 && aTag === 'P1') ||
                (role === 1 && aTag === 'P2') ||
                (role === 2 && aTag === 'P3') ||
                (role === 3 && aTag === 'P4');

            if (isOwner) {
                window.networkManager.sendInput({
                    type: 'hit_event',
                    payload: {
                        target: vTag,
                        damage: finalDamage,
                        isBlocking: isBlocked,
                        knockbackDir: (a.x < v.x ? 1 : -1)
                    }
                });
            }
        }
    }

    startKoBounce(v, attacker) {
        v.setData('isKoBouncing', true);

        // Calculate knockback direction
        const dir = (v.x < attacker.x) ? -1 : 1;

        // Disable world bounds temporarily so they can fly HIGH
        v.setCollideWorldBounds(false);

        // Launch towards wall - MUCH STRONGER
        v.setVelocityX(dir * 1800);
        v.setVelocityY(-2000); // Even higher launch

        // Disable control
        v.setData('isAttacking', true); // Lock
        v.setData('isBlocking', false);

        // Spin effect during KO flight
        this.tweens.add({
            targets: v,
            angle: v.flipX ? -720 : 720,
            duration: 1500,
            ease: 'Linear'
        });

        // Play hit sound
        this.safeSound('playHit');

        // GUARANTEED KO FALLBACK: If hasn't hit wall in 0.8s, trigger crack/death anyway
        this.time.delayedCall(800, () => {
            if (v.active && v.getData('isKoBouncing') && !v.getData('hasHitWall')) {
                console.log("KO Fallback Triggered");
                v.setData('hasHitWall', true);
                this.koHitWall(v);
            }
        });

        // SAFETY FALLBACK: Force death if stuck for > 3s
        this.time.delayedCall(3000, () => {
            if (v.getData('isKoBouncing')) {
                console.warn("Forcing Death Fallback (KO Bounce Stuck?)");
                v.setCollideWorldBounds(true);
                this.die(v);
            }
        });
    }

    checkKoBounce(v) {
        if (!v.getData('isKoBouncing')) return;

        // Check Wall Collision - Increased sensitivity (60px -> 120px for better reliability)
        if (v.x <= 120 || v.x >= 904) { // Closer to edges
            // WALL HIT!
            if (!v.getData('hasHitWall')) {
                v.setData('hasHitWall', true);
                this.koHitWall(v);
            }
        }
    }

    koHitWall(v) {
        // Re-enable world bounds
        v.setCollideWorldBounds(true);

        // 1. Audio — KO voice + Glass crack sound
        this.safeSound('playKO');
        // Play glass crack sound directly (ko_sound.mp3)
        try {
            const glassCrack = new Audio('./audio/ko_sound.mp3');
            glassCrack.volume = 0.9;
            glassCrack.play().catch(() => { });
        } catch (e) { }

        // 2. Visual Crack
        this.showKoCrackAt(v.x, v.y);

        // 3. Stronger camera shake on wall impact
        this.cameras.main.shake(400, 0.04);
        this.domShake(400, 15);

        // 4. Bounce Off wall
        v.setVelocityX(v.body.velocity.x * -0.5);
        v.setVelocityY(-400);

        // 5. Stop KO bounce, start death
        v.setData('isKoBouncing', false);
        this.die(v);
    }

    showKoCrackAt(x, y) {
        // Prevent duplicate cracks too close in time
        const now = Date.now();
        if (this.lastCrackTime && (now - this.lastCrackTime < 500)) return;
        this.lastCrackTime = now;

        const crackWidth = 600;
        const crackX = (x < 512) ? -100 : 524;
        const crackY = y - 300;

        const crack = document.createElement('img');
        crack.src = './img/ko_crack.png';
        crack.style.position = 'absolute';
        crack.style.left = crackX + 'px';
        crack.style.top = crackY + 'px';
        crack.style.width = crackWidth + 'px';
        crack.style.height = 'auto';
        crack.style.zIndex = '20002'; // ABOVE EVERYTHING
        crack.style.pointerEvents = 'none';
        crack.className = 'shake-effect';

        const gs = document.getElementById('gameScreen');
        if (gs) gs.appendChild(crack);

        if (!this.activeTimers) this.activeTimers = [];

        const removeTimer = setTimeout(() => {
            crack.style.transition = 'opacity 1s';
            crack.style.opacity = '0';
            setTimeout(() => crack.remove(), 1000);
        }, 3000);
        this.activeTimers.push(removeTimer);
    }

    updateComboUI() {
        const comboEl = document.getElementById('comboCounter');
        if (!comboEl) return;

        const p1c = this.player.getData('combo') || 0;
        const p2c = this.enemy.getData('combo') || 0;
        const maxCombo = Math.max(p1c, p2c);

        if (maxCombo >= 2) {
            comboEl.style.display = 'block';
            comboEl.innerHTML = `<div class="combo-text">${maxCombo} HITS!</div>`;
            // Flash effect on increment
            comboEl.style.transform = 'translateX(-50%) scale(1.1)';
            setTimeout(() => { comboEl.style.transform = 'translateX(-50%) scale(1)'; }, 50);
        } else {
            comboEl.style.display = 'none';
        }
    }

    syncUI() {
        const p1h = this.player.getData('health');
        const p1e = this.player.getData('energy');
        const p2h = this.enemy.getData('health');
        const p2e = this.enemy.getData('energy');

        // Health
        const elP1H = document.getElementById('playerHealth');
        if (elP1H) elP1H.style.width = p1h + '%';
        const elP2H = document.getElementById('enemyHealth');
        if (elP2H) elP2H.style.width = p2h + '%';

        // Energy (Hyper Meter)
        const elP1E = document.getElementById('playerEnergy');
        if (elP1E) {
            elP1E.style.width = p1e + '%';
            // HYPER READY VISUAL
            if (p1e >= 100) {
                elP1E.style.backgroundColor = '#d946ef'; // Purple
                elP1E.style.boxShadow = '0 0 10px #d946ef, 0 0 20px white';
            } else {
                elP1E.style.backgroundColor = 'orange';
                elP1E.style.boxShadow = 'none';
            }
        }

        const elP2E = document.getElementById('enemyEnergy');
        if (elP2E) {
            elP2E.style.width = p2e + '%';
            // HYPER READY VISUAL
            if (p2e >= 100) {
                elP2E.style.backgroundColor = '#d946ef'; // Purple
                elP2E.style.boxShadow = '0 0 10px #d946ef, 0 0 20px white';
            } else {
                elP2E.style.backgroundColor = 'orange';
                elP2E.style.boxShadow = 'none';
            }
        }

        if (window.player) {
            window.player.health = p1h;
            window.player.energy = p1e;
            window.player.position = { x: this.player.x, y: this.player.y };
            window.player.isAttacking = this.player.getData('isAttacking');
        }
        if (window.enemy) {
            window.enemy.health = p2h;
            window.enemy.energy = p2e;
            window.enemy.position = { x: this.enemy.x, y: this.enemy.y };
            window.enemy.isAttacking = this.enemy.getData('isAttacking');
        }

        // TRAINING MODE: Infinite Health & Energy
        if (this.gameMode === 'TRAINING') {
            this.player.setData('health', 100);
            this.player.setData('energy', 100);
            this.enemy.setData('health', 100);
            // Update UI immediately to show full bars
            const elP1H = document.getElementById('playerHealth');
            if (elP1H) elP1H.style.width = '100%';
            const elP1E = document.getElementById('playerEnergy');
            if (elP1E) { elP1E.style.width = '100%'; elP1E.style.backgroundColor = '#d946ef'; elP1E.style.boxShadow = '0 0 10px #d946ef, 0 0 20px white'; }

            const elP2H = document.getElementById('enemyHealth');
            if (elP2H) elP2H.style.width = '100%';
        }
    }

    die(v) {
        if (v.getData('dead')) return; // Prevent double death trigger

        // Final Safety Check: HP must be 0 for death to be official
        const currentHP = v.getData('health');
        if (typeof currentHP !== 'number' || isNaN(currentHP) || currentHP > 0) {
            console.error(`[Combat] BLOCKED DEATH: ${v.getData('prefix')} has HP: ${currentHP}. Resetting to idle.`);

            // Force reset to active state
            v.setData('dead', false);
            v.setData('isKoBouncing', false);
            v.setData('isAttacking', false);
            v.setCollideWorldBounds(true);
            v.setAngle(0);

            const pre = v.getData('prefix');
            if (this.anims.exists(`${pre}_idle`)) v.play(`${pre}_idle`, true);

            return;
        }

        console.log(`[Combat] DIE called for ${v.getData('prefix')}. HP: ${currentHP}`);
        v.setData('dead', true);

        // Ensure crack shown if it skipped koHitWall (forced for all KOs)
        if (!v.getData('hasHitWall')) {
            v.setData('hasHitWall', true);
            // Wait a tiny bit for the "falling" look
            this.time.delayedCall(100, () => this.showKoCrackAt(v.x, v.y));
        }

        const pre = v.getData('prefix');
        v.setData('isAttacking', true); // Lock in death
        v.setAngle(0); // Reset any spin

        // Try to play death animation
        const deathAnimKey = `${pre}_death`;
        if (this.anims.exists(deathAnimKey)) {
            v.play(deathAnimKey);
            v.once('animationcomplete', () => {
                if (v.active) {
                    v.anims.pause(v.anims.currentAnim.frames[v.anims.currentAnim.frames.length - 1]);
                }
            });
        }

        // VISUAL DEATH EFFECT — Works for ALL characters (including 1-frame)
        // Red tint flash
        v.setTint(0xff0000);
        this.time.delayedCall(200, () => {
            if (v.active) v.setTint(0x888888); // Grey = dead
        });

        // Fall down + rotate to "lie down" position
        this.tweens.add({
            targets: v,
            angle: v.flipX ? 90 : -90, // Rotate to lying position
            duration: 600,
            ease: 'Bounce.easeOut'
        });

        window.isRoundActive = false;
        this.time.delayedCall(1500, () => {
            // PLAY VICTORY ANIMATION FOR WINNER
            // Determine winner based on who killed this unit
            const winner = this.findClosestEnemy(v); // The closest enemy usually is the killer/opponent
            if (winner && winner.active) {
                const pre = winner.getData('prefix');
                // Try 'victory' animation first, fallback to 'taunt' or 'idle'
                const vicKey = `${pre}_victory`;
                const tauntKey = `${pre}_taunt`;

                if (this.anims.exists(vicKey)) {
                    winner.setData('isAttacking', true).play(vicKey, true); // Lock controls
                } else if (this.anims.exists(tauntKey)) {
                    winner.setData('isAttacking', true).play(tauntKey, true);
                } else {
                    // FALLBACK: Idle or stay in current state but locked
                    winner.setData('isAttacking', true);
                }
            }

            if (typeof determineWinner === 'function') {
                determineWinner({
                    player: {
                        health: this.player.getData('health'),
                        maxHealth: 100,
                        position: { x: this.player.x, y: this.player.y }
                    },
                    enemy: {
                        health: this.enemy.getData('health'),
                        maxHealth: 100,
                        position: { x: this.enemy.x, y: this.enemy.y }
                    },
                    p3: this.p3 ? {
                        health: this.p3.getData('health'),
                        maxHealth: 100,
                        position: { x: this.p3.x, y: this.p3.y }
                    } : null,
                    p4: this.p4 ? {
                        health: this.p4.getData('health'),
                        maxHealth: 100,
                        position: { x: this.p4.x, y: this.p4.y }
                    } : null,
                    timerId: window.timerId
                });
            }
        });
    }


    findClosestEnemy(me) {
        if (!me || !me.active) return null;
        const myTeam = me.getData('team');
        const fighters = [this.player, this.enemy, this.p3, this.p4];
        let closest = null;
        let minDist = Infinity;

        fighters.forEach(f => {
            if (f && f.active && f !== me && f.getData('team') !== myTeam && f.getData('health') > 0) {
                const d = Phaser.Math.Distance.Between(me.x, me.y, f.x, f.y);
                if (d < minDist) {
                    minDist = d;
                    closest = f;
                }
            }
        });
        return closest;
    }

    resetRound() {
        if (!this.player || !this.enemy) return;

        console.log("%c[Combat] Resetting Round - Clearing all timers/tweens", "color: orange");

        // 1. CLEAR PHASER TIMERS & TWEENS (Prevent premature death from Round 1 KO)
        this.time.removeAllEvents();
        this.tweens.killAll();

        // 2. CLEAR NATIVE TIMERS
        if (this.activeTimers) {
            this.activeTimers.forEach(t => clearTimeout(t));
            this.activeTimers = [];
        }

        const g = window.groundLevel || 516;
        const resetData = {
            health: 100,
            energy: 0,
            isAttacking: false,
            isBlocking: false,
            combo: 0,
            comboTimer: 0,
            isKoBouncing: false,
            hasHitWall: false,
            dead: false,
            isPolaroidTrapped: false
        };

        this.player.setData(resetData).setVelocity(0).setPosition(200, g).setFlipX(false).setAngle(0).clearTint().play('p1_idle');
        this.enemy.setData(resetData).setVelocity(0).setPosition(824, g).setFlipX(true).setAngle(0).clearTint().play('p2_idle');

        if (this.p3) this.p3.setData(resetData).setVelocity(0).setAngle(0).clearTint().play('p3_idle');
        if (this.p4) this.p4.setData(resetData).setVelocity(0).setAngle(0).clearTint().play('p4_idle');

        // Clear any leftover cracks from DOM
        const gs = document.getElementById('gameScreen');
        if (gs) {
            const cracks = gs.querySelectorAll('img[src*="ko_crack.png"]');
            cracks.forEach(c => c.remove());
        }

        window.isRoundActive = true;
        this.updateComboUI();
        this.syncUI();
    }

    createPolaroidFrame(vic) {
        if (vic.polaroidFrame) vic.polaroidFrame.destroy();

        const container = this.add.container(vic.x, vic.y);

        // 1. Shadow (Off-center black rect)
        const shadow = this.add.graphics();
        shadow.fillStyle(0x000000, 0.5);
        shadow.fillRect(-65, -125, 140, 220); // Slightly offset
        container.add(shadow);

        // 2. White Paper Background
        const paper = this.add.graphics();
        paper.fillStyle(0xffffff, 1);
        paper.fillRect(-70, -130, 140, 220); // Main card
        container.add(paper);

        // 3. Black Photo Area (Behind character)
        const photoArea = this.add.graphics();
        photoArea.fillStyle(0x111111, 1); // Dark grey/black
        photoArea.fillRect(-60, -120, 120, 150);
        container.add(photoArea);

        // 4. Text Label
        const text = this.add.text(0, 60, "UPOKORZONY", {
            fontFamily: '"Press Start 2P"',
            fontSize: '12px',
            color: '#000000',
            align: 'center'
        }).setOrigin(0.5);
        container.add(text);

        // 5. Random Tilt
        const tilt = Phaser.Math.Between(-15, 15);
        container.setAngle(tilt);

        // container.setDepth(fighterDepth - 1); // REMOVED to fix ReferenceError
        // Actually, for a "Trapped in photo" look:
        // Paper BG -> Character -> Frame Overlay? 
        // Or just Paper BG behind character.

        // container.setDepth(fighterDepth - 1); // Error: fighterDepth not defined. 
        container.setDepth(vic.depth - 5);

        // We also need a "Front" overlay if we want to cover edges, but for now specific graphic behind is enough.
        // Actually, let's keep it simple: Character is ON TOP of the photo interaction. 
        // We just verify visual.

        vic.polaroidFrame = container;

        // Tween entry
        container.setScale(0);
        this.tweens.add({
            targets: container,
            scaleX: 1,
            scaleY: 1,
            duration: 200,
            ease: 'Back.out'
        });
    }

    safeSound(method, ...args) {
        if (window.audioManager && typeof window.audioManager[method] === 'function') {
            window.audioManager[method](...args);
        } else if (typeof window.safeAudio === 'function') {
            window.safeAudio(method, ...args);
        }
    }
}

const phaserConfig = {
    type: Phaser.CANVAS, width: 1024, height: 576, parent: 'gameScreen', transparent: true,
    fps: { target: 60, forceSetTimeOut: true },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 2200 },
            fixedStep: true,
            fps: 60
        }
    },
    pixelArt: true, antialias: false
};

window.phaserGame = null;

function initPhaserCombat(data) {
    if (window.audioManager) {
        window.audioManager.stopAmbient(); // Stop legacy ambient
        // Music is now started in startGame() in main.js to avoid double playing
    }
    if (window.phaserGame) { window.phaserGame.destroy(true); window.phaserGame = null; }
    const gs = document.getElementById('gameScreen');
    if (gs) {
        gs.style.display = 'block';
        gs.style.zIndex = '60';
        gs.style.background = 'transparent';
        gs.querySelectorAll('canvas').forEach(c => c.remove());
    }

    // DYNAMIC FPS CONFIG
    const myDev = window.myDevice || 'desktop';
    const enDev = window.enemyDevice || 'desktop';
    const isOnline = (data && (data.gameMode === 'ONLINE' || data.gameMode === '2V2_CHAOS'));

    // Disable limits ONLY if Desktop vs Desktop (Online) 
    // OR if Local and it's not a mobile device.
    const pcMatch = (myDev === 'desktop' && (!isOnline || enDev === 'desktop'));

    if (pcMatch) {
        console.log("%cPC-PC MATCH: Unlocking FPS limits", "color: yellow; font-weight: bold");
        phaserConfig.fps.target = 240; // High limit instead of 0
        phaserConfig.fps.forceSetTimeOut = false;
        phaserConfig.physics.arcade.fixedStep = false; // Let physics run with FPS
    } else {
        console.log("%cMOBILE/MIXED MATCH: Enforcing 60 FPS Sync", "color: cyan; font-weight: bold");
        phaserConfig.fps.target = 60;
        phaserConfig.fps.forceSetTimeOut = true;
        phaserConfig.physics.arcade.fixedStep = true;
        phaserConfig.physics.arcade.fps = 60;
    }

    window.phaserGame = new Phaser.Game(phaserConfig);
    window.phaserGame.scene.add('CombatScene', CombatScene, true, data);
}
