class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        framesRow = 0,
        rows = 1,
        frameHeight = undefined, // Support explicit frame height
        isBackground = false,
        removeBackground = false,
        rowOffsets = {}, // NEW: Per-row Y offset and height adjustments
        frameStart = 0, // NEW: Support sub-row animations (start frame index)
        frameCount = undefined, // NEW: Support sub-row animations (number of frames to play)
        image = undefined // Optional pre-loaded image
    }) {
        this.position = position
        this.width = 50
        this.height = 150
        if (image) {
            this.image = image
            this.loaded = true
        } else {
            this.image = new Image()
            this.image.src = imageSrc
        }
        this.scale = scale
        this.framesMax = framesMax
        this.framesRow = framesRow
        this.rows = rows
        this.customFrameHeight = frameHeight // Store explicit height
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
        this.rowOffsets = rowOffsets // Store row-specific offsets
        this.isBackground = isBackground
        this.shouldRemoveBackground = removeBackground
        this.loaded = false
        this.useBlendMode = false
        this.flipHorizontal = false
        this.loop = true
        this.rotation = 0
        this.shadowBlur = 0
        this.shadowColor = 'transparent'

        // NEW: Sub-row animation support
        this.frameStart = frameStart
        this.frameCount = frameCount !== undefined ? frameCount : framesMax

        this.image.onload = () => {
            this.loaded = true
            // If the user wants to force background removal (visual hack)
            if (this.shouldRemoveBackground) {
                this.useBlendMode = true
            }
        }
    }

    draw() {
        if (!this.loaded) return

        // 1. Background
        if (this.isBackground) {
            c.drawImage(this.image, 0, 0, canvas.width, canvas.height)
            return
        }

        // 2. Character Drawing
        c.save()

        if (this.useBlendMode) {
            c.globalCompositeOperation = 'multiply'
        }

        // Layout Calculations
        // --- VISUAL FALLBACK FOR LEGACY ASSETS ---
        // If logic requests Row 5/6 but image has only 4 rows -> Clamp to last valid row (Row 3)
        // If logic requests 8 frames but image is 1 frame -> Render full width

        // 1. Calculate Rows/Height
        const totalRows = this.rows || 1 // Configured rows, e.g. 8 for Bedoes
        // Check actual image height vs configured
        // Legacy: Config says rows=8 (standard), image might be small.
        // Actually, for legacy, we didn't change 'rows: 4' in config. We just requested 'row: 5'.
        // So this.rows is 4. this.framesRow is 5.

        let renderRow = this.framesRow
        if (renderRow >= this.rows) {
            // Fallback to last valid row (usually Row 3 = Attack 1)
            renderRow = this.rows - 1
        }

        // 2. Calculate Frame Width
        // Legacy: framesMax=8 (standardized), but image width is small (1 frame)
        let renderFrameIndex = this.framesCurrent
        let maxFrames = this.framesMax

        // Detection: If frame width would be < 16px (8x8 chars are ~60px wide total?)
        // Standard 8x8 sheet: 50px * 8 = 400px wide.
        // Legacy 500.png: ~50-100px wide (1 frame).
        // If we divide 100px by 8 -> 12px slice.

        if (this.image.width / maxFrames < 20) {
            // Assume single frame asset
            renderFrameIndex = 0
            maxFrames = 1
        }

        // --- END FALLBACK ---

        const frameWidth = (this.image.width / maxFrames) * this.scale
        let rows = this.rows || 1
        if (rows === 1 && this.image.src.includes('actions')) {
            rows = 7
        }

        const frameHeightOrg = this.customFrameHeight || (this.image.height / rows)
        const frameHeight = frameHeightOrg * this.scale

        // Use RENDER ROW for offsets
        const rowConfig = this.rowOffsets[renderRow] || {}
        let cropTop = rowConfig.cropTop || 0
        let cropBottom = rowConfig.cropBottom || 0
        const offsetY = rowConfig.offsetY || 0

        if (rows === 4) {
            if (renderRow === 0) cropBottom -= 10
            if (renderRow === 1) cropTop += 20
            if (renderRow === 2) cropBottom += 10
            if (renderRow === 3) cropTop -= 10
        }

        // Adjust source rectangle using RENDER ROW and MAX FRAMES
        const srcY = renderRow * frameHeightOrg + cropTop
        const srcHeight = frameHeightOrg - cropTop + cropBottom
        const scaledHeight = srcHeight * this.scale

        const widthMult = this.frameWidthMultiplier || 1
        const singleFrameWidth = this.image.width / maxFrames
        const srcWidth = singleFrameWidth * widthMult
        const dstWidth = srcWidth * this.scale

        let drawX = Math.floor(this.position.x - this.offset.x)
        let drawY = Math.floor(this.position.y - this.offset.y + offsetY)

        // --- DRAWING ---
        // Use standard transforms but with fallback values

        // Translate to Center of Sprite
        const centerX = drawX + Math.floor(dstWidth / 2)
        const centerY = drawY + Math.floor(scaledHeight / 2)

        c.save() // Save for translation/rotation/scale

        c.translate(centerX, centerY)

        // Apply Rotation (if any)
        if (this.rotation) c.rotate(this.rotation)

        // Apply Flip
        if (this.flipHorizontal) c.scale(-1, 1)

        // Apply Shadow Glow (if set)
        if (this.shadowBlur > 0) {
            c.shadowBlur = this.shadowBlur
            c.shadowColor = this.shadowColor
        }

        c.drawImage(
            this.image,
            renderFrameIndex * singleFrameWidth, // Source X (Render Index)
            srcY, // Source Y (Render Row)
            srcWidth, // Source Width (x Mult)
            srcHeight,
            -Math.floor(dstWidth / 2), // Offset relative to center
            -Math.floor(scaledHeight / 2),
            dstWidth, // Dest Width (x Mult)
            scaledHeight
        )

        c.restore() // Restore translation/rotation/scale

        // --- ROW DEBUGGING VISUALIZER ---
        if (window.showDebugHitboxes) {
            c.save()
            c.strokeStyle = 'rgba(255, 255, 255, 0.5)'
            c.lineWidth = 1
            c.strokeRect(-Math.floor(dstWidth / 2) + centerX, -Math.floor(scaledHeight / 2) + centerY, dstWidth, scaledHeight)

            c.fillStyle = 'white'
            c.font = '12px Courier New'
            c.fillText(`Row: ${renderRow}`, -Math.floor(dstWidth / 2) + centerX, -Math.floor(scaledHeight / 2) + centerY - 5)
            c.restore()
        }

        c.restore() // Restore globalCompositeOperation/state from line 63
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {

            // Calculate end frame based on startFrame and frameCount
            const endFrame = this.frameStart + this.frameCount - 1

            if (this.framesCurrent < endFrame) {
                this.framesCurrent++
            } else if (this.loop) {
                this.framesCurrent = this.frameStart
            }
        }
    }

    update() {
        this.draw()
        if (!this.dead) this.animateFrames()
    }
}
