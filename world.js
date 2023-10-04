// World class
export class World {
    constructor(gridWidth, gridHeight) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.gameGrid = Array.from({ length: gridWidth }, () =>
            Array(gridHeight).fill({ floor: [], character_or_artifact: undefined })
        );
        this.characters = [];
        this.jobs = [];
        this.artifacts = [];
    }

    addCharacter(character) {
        this.characters.push(character);
    }

    addArtifact(artifact) {
        this.artifacts.push(artifact);
    }

    // Function to simulate a game character's movement to a target
    moveTo(currentPosition, targetPosition, speed) {
        const start = { x: currentPosition.x, y: currentPosition.y };
        const target = { x: targetPosition.x, y: targetPosition.y };

        const path = findPath(start, target, (x, y) => this.collision(x, y));

        // Check if a path exists
        if (path && path.length > 0) {
            // Determine the next position based on speed
            const nextPosition = path[Math.min(speed, path.length - 1)];

            // Update the game grid to mark the character's path
            gameWorld.gameGrid[nextPosition.x][nextPosition.y].type = 'character';

            // Return the updated position
            return nextPosition;
        } else {
            return null;
        }
    }

    findPath(start, target, world) {
        const queue = [{ x: start.x, y: start.y, path: [] }];
        const visited = new Set();
    
        while (queue.length > 0) {
            const { x, y, path } = queue.shift();
    
            if (x === target.x && y === target.y) {
                return path;
            }
    
            if (visited.has(`${x},${y}`) || this.collision(x, y)) {
                continue;
            }
    
            visited.add(`${x},${y}`);
    
            // Define possible moves (up, down, left, right)
            const moves = [
                { dx: 1, dy: 0 },  // Right
                { dx: -1, dy: 0 }, // Left
                { dx: 0, dy: 1 },  // Down
                { dx: 0, dy: -1 }, // Up
            ];
    
            for (const move of moves) {
                const newX = x + move.dx;
                const newY = y + move.dy;
    
                if (!visited.has(`${newX},${newY}`) && !this.collision(newX, newY)) {
                    const newPath = [...path, { x: newX, y: newY }];
                    queue.push({ x: newX, y: newY, path: newPath });
                }
            }
        }
    
        return null; // No path found
    }
    
    // Function to handle coordinate wrapping
    wrapCoordinates(x, y) {
        x = ((x % this.gridWidth) + this.gridWidth) % this.gridWidth;
        y = ((y % this.gridHeight) + this.gridHeight) % this.gridHeight;
        return { x, y };
    }
    
    // Function to check for collisions at a specific tile
    collision(x, y, world) {
        const { x: wrappedX, y: wrappedY } = this.wrapCoordinates(x, y);
        return this.gameGrid[wrappedX][wrappedY].type !== 'empty';
    }

    async tick() {
        for (let t = 0; t < 24; t += 0.5) {
            this.characters.forEach(async (character) => {
                await character.gameTick(t);
            });
        }
    }
}