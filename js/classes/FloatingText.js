class FloatingText {
    constructor({ position, text, color = 'white', velocity = { x: 0, y: -2 } }) {
        this.position = position
        this.text = text
        this.color = color
        this.velocity = velocity
        this.alpha = 1
        this.lifeTime = 50 // Frames
        this.fontSize = 20
        this.scale = 1
    }

    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.font = `${this.fontSize}px "Press Start 2P"`
        c.fillStyle = this.color
        c.strokeStyle = 'black'
        c.lineWidth = 3
        c.textAlign = 'center'

        // Simple scale pop effect at start
        if (this.lifeTime > 40) {
            const progress = (50 - this.lifeTime) / 10
            // Scale up slightly? 
            // Canvas text scaling is tricky without transform.
            // Let's stick to simple movement first.
        }

        c.strokeText(this.text, this.position.x, this.position.y)
        c.fillText(this.text, this.position.x, this.position.y)
        c.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.lifeTime--

        // Gravity effect for text?
        this.velocity.y += 0.1

        if (this.lifeTime < 20) {
            this.alpha -= 0.05
        }
    }
}
