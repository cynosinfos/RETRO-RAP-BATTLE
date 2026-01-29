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
        rowOffsets = {} // NEW: Per-row Y offset and height adjustments
    }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
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
        const frameWidth = (this.image.width / this.framesMax) * this.scale
        let rows = this.rows || 1
        if (rows === 1 && this.image.src.includes('actions')) {
            rows = 7
        }

        const frameHeightOrg = this.customFrameHeight || (this.image.height / rows)
        const frameHeight = frameHeightOrg * this.scale

        // NEW: Get row-specific adjustments
        const currentRow = this.framesRow
        const rowConfig = this.rowOffsets[currentRow] || {}
        const cropTop = rowConfig.cropTop || 0      // Pixels to crop from top
        const cropBottom = rowConfig.cropBottom || 0 // Pixels to crop from bottom
        const offsetY = rowConfig.offsetY || 0       // Additional Y offset for rendering

        // Adjust source rectangle
        const srcY = currentRow * frameHeightOrg + cropTop
        const srcHeight = frameHeightOrg - cropTop - cropBottom
        const scaledHeight = srcHeight * this.scale

        let drawX = Math.floor(this.position.x - this.offset.x)
        let drawY = Math.floor(this.position.y - this.offset.y + offsetY)

        // Unified Transformation (Rotate + Flip)
        // Translate to Center of Sprite
        const centerX = drawX + Math.floor(frameWidth / 2)
        const centerY = drawY + Math.floor(scaledHeight / 2)

        c.translate(centerX, centerY)

        // Apply Rotation (if any)
        if (this.rotation) c.rotate(this.rotation)

        // Apply Flip
        if (this.flipHorizontal) c.scale(-1, 1)

        // Draw at relative origin (-width/2, -height/2)
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            srcY,
            this.image.width / this.framesMax,
            srcHeight,
            -Math.floor(frameWidth / 2),
            -Math.floor(scaledHeight / 2),
            Math.floor(frameWidth),
            Math.floor(scaledHeight)
        )

        c.restore()
    }

    animateFrames() {
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else if (this.loop) {
                this.framesCurrent = 0
            }
        }
        this.framesElapsed++
    }

    update() {
        this.draw()
        if (!this.dead) this.animateFrames()
    }
}
