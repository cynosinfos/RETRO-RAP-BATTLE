class Particle {
    constructor({ position, velocity, type = 'spark', imageSrc, color = '#ffff00' }) {
        this.position = position
        this.velocity = velocity
        this.type = type // 'spark', 'blood', 'dust', 'energy', 'impact'
        this.alpha = 1
        this.color = color
        this.image = new Image()
        this.image.src = imageSrc
        this.framesMax = 1
        this.scale = 0.04 // Retro pixel size (Doubled)
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.2
        this.loaded = false
        this.image.onload = () => {
            this.loaded = true
        }
        // Unique Logic based on type
        if (this.type === 'blood') {
            this.gravity = 0.5
            this.friction = 0.98
            this.fadeStart = 0
        } else if (this.type === 'energy') {
            this.gravity = 0
            this.friction = 0.92
            this.rotationSpeed = (Math.random() - 0.5) * 0.8
            this.scale = 0.06 // Bigger for energy
        } else if (this.type === 'impact') {
            this.gravity = 0.3
            this.friction = 0.94
            this.rotationSpeed = (Math.random() - 0.5) * 0.6
            this.scale = 0.05
        } else {
            this.gravity = 0
            this.friction = 0.95 // Sparks slow down
            this.rotationSpeed = (Math.random() - 0.5) * 0.5
        }
    }

    draw() {
        if (this.type !== 'energy' && !this.loaded) return

        c.save()
        c.globalAlpha = this.alpha

        // Pivot Center
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)

        if (this.type === 'energy') {
            // Draw Colored Energy Rectangle instead of Image
            c.fillStyle = this.color
            c.shadowBlur = 10
            c.shadowColor = this.color
            const size = (this.scale * 100) // Arbitrary base size scaling
            c.fillRect(
                this.position.x - size / 2,
                this.position.y - size / 2,
                size,
                size
            )
        } else {
            // Draw Image
            const width = this.image.width * this.scale
            const height = this.image.height * this.scale

            c.drawImage(
                this.image,
                this.position.x - width / 2,
                this.position.y - height / 2,
                width,
                height
            )
        }
        c.restore()
    }

    update() {
        this.draw()

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.rotation += this.rotationSpeed

        if (this.type === 'blood') {
            this.velocity.y += this.gravity

            // Ground Collision
            if (this.position.y + 10 >= (window.groundLevel || 480)) {
                this.position.y = (window.groundLevel || 480) - 10
                this.velocity.y *= -0.5 // Bounce
                this.velocity.x *= 0.8 // Friction
            }

            // Fade out
            if (this.alpha > 0) this.alpha -= 0.015
        } else if (this.type === 'energy') {
            // Energy particles float and fade slowly
            this.velocity.x *= this.friction
            this.velocity.y *= this.friction
            if (this.alpha > 0) this.alpha -= 0.03
        } else if (this.type === 'impact') {
            // Impact particles have gravity and bounce
            this.velocity.y += this.gravity
            this.velocity.x *= this.friction

            // Ground collision
            if (this.position.y + 10 >= (window.groundLevel || 480)) {
                this.position.y = (window.groundLevel || 480) - 10
                this.velocity.y *= -0.4
                this.velocity.x *= 0.9
            }

            if (this.alpha > 0) this.alpha -= 0.04
        } else {
            // Spark logic (default)
            this.velocity.x *= this.friction
            this.velocity.y *= this.friction
            if (this.alpha > 0) this.alpha -= 0.05 // Sparks vanish fast
        }
    }
}
