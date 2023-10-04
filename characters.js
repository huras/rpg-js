// Character class
export class Character {
    constructor(position, routine, speed) {
        this.position = position;
        this.routine = routine;
        this.speed = speed;
        this.status = 'sleeping';
    }

    async moveTo(targetX, targetY) {
        const newPosition = await moveTo(
            this.position,
            { x: targetX, y: targetY },
            this.speed
        );
        console.log(
            "Current position",
            this.position,
            "New position",
            newPosition
        );
        if (newPosition) {
            this.position = newPosition;
        }

        // Return if reached position
        return this.position.x === targetX && this.position.y === targetY;
    }

    async gameTick(time) {
        switch (this.routine) {
            case 'baker':
                switch (this.status) {
                    case 'sleeping':
                        if (time >= 8 && time < 9) {
                            console.log("Wake up", time);
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
                        } else {
                            console.log("Move to the house", time);
                            if (await this.moveTo(0, 0)) {
                                this.status = 'sleeping';
                            }
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