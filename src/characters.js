export class Character {
    constructor({position = {x: 0 , y: 0}, job = undefined, speed = 1, inventory = []}) {
        this.world = undefined;   // Adding a reference to the world
        this.position = position;
        this.job = job;
        this.speed = speed;
        this.status = 'sleeping';
        this.inventory = inventory;
    }

    async moveTo(targetX, targetY) {
        const position = { x: this.position.x, y: this.position.y };
        const reached = this.world.moveTo(this, { x: targetX, y: targetY }, this.speed);

        console.log("moved from ", position, " to ", this.position);

        // Return if reached position
        return this.position.x === targetX && this.position.y === targetY;
    }

    async gameTick(time) {
        switch (this.job) {
            case 'baker':
                switch (this.status) {
                    case 'sleeping':
                        if (time >= 8 && time < 9) {
                            console.log("Woke up", time);
                            this.status = 'idle';
                        } else {
                            console.log("Sleeping", time);
                        }
                        break;
                    case 'idle':
                        console.log("Reach bakery", time);
                        if (await this.moveTo(3, 3)) {
                            this.status = 'working';
                        }
                        break;
                    case 'working':
                        if (time <= 17) {
                            console.log("Produce and sell bread in the morning", time);
                            this.inventory.push('bread');
                        } else {
                            console.log("Move to the house", time);
                            if (await this.moveTo(0, 0)) {
                                this.status = 'hobby';
                            }
                        }
                        break;
                    case 'hobby':
                        if (time <= 22) {
                            console.log("Playing the piano", time);
                        } else {
                            console.log("Going to bed", time);
                            this.status = 'sleeping';
                        }
                        break;
                    default:
                        console.log("Unknown status", this.status);
                        break;
                }
                break;
        }
    }
}
