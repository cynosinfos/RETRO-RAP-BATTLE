class Projectile extends Sprite {
    constructor({ position, velocity, image, framesMax = 1, scale = 1, offset = { x: 0, y: 0 }, owner, framesRow = 0, startFrame = 0, radius = 30 }) {
        super({
            position,
            image,
            scale,
            framesMax,
            offset
        })
        this.velocity = velocity
        this.owner = owner
        this.radius = radius
        this.active = true
        this.image = image

        // Frame Control
        this.framesRow = framesRow
        this.framesCurrent = startFrame // Start at specific frame
        this.framesElapsed = 0
        this.framesHold = 5

        // Disable animation if single frame intended
        this.loop = false
    }

    update(enemy) {
        if (!this.active) return
        // this.draw() // REMOVED: Drawing handled by main loop to prevent clearing
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // Collision with Enemy
        // Simple Box/Circle collision
        // Enemy hitbox is usually detection box, but let's use body position
        if (
            this.position.x + this.radius > enemy.position.x &&
            this.position.x - this.radius < enemy.position.x + enemy.width &&
            this.position.y + this.radius > enemy.position.y &&
            this.position.y - this.radius < enemy.position.y + enemy.height
        ) {
            enemy.takeHit(10) // Fixed damage for now
            this.active = false
            // Hit Effect?
        }

        // Out of bounds
        if (this.position.x < -100 || this.position.x > 1200) {
            this.active = false
        }
    }
}
