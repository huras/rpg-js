// World class
export class World {
    constructor(gridWidth, gridHeight) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.gameGrid = Array.from({ length: gridWidth }, () =>
            Array(gridHeight).fill(undefined)
        );
        for(let i = 0; i < gridWidth; i++) {
            for(let j = 0; j < gridHeight; j++) {
                this.gameGrid[i][j] = { floor: [], character_or_artifact: undefined }
            }
        }
        this.characters = [];
        this.jobs = [];
        this.artifacts = [];
    }

    addCharacter(character) {
        this.characters.push(character);
        this.gameGrid[character.position.x][character.position.y].character_or_artifact = character;
        character.world = this;
    }

    addArtifact(artifact) {
        this.artifacts.push(artifact);
        this.gameGrid[artifact.position.x][artifact.position.y].character_or_artifact = artifact;
        artifact.world = this;
    }

    moveTo(character, targetPosition, speed) {
        const start = { x: character.position.x, y: character.position.y };
        const target = { x: targetPosition.x, y: targetPosition.y };

        const path = this.findPath(start, target, [character]);
        // console.log(path)

        if (path && path.length > 0) {
            const nextPosition = path[Math.min(speed - 1, path.length - 1)];
            this.gameGrid[character.position.x][character.position.y].character_or_artifact = undefined;
            character.position = nextPosition;
            this.gameGrid[nextPosition.x][nextPosition.y].character_or_artifact = character;
            return true;
        } else {
            return false;
        }
    }

    findPath(start, target, ignore) {
        const queue = [{ x: start.x, y: start.y, path: [] }];
        const visited = new Set();

        while (queue.length > 0) {
            const { x, y, path } = queue.shift();

            if (x === target.x && y === target.y) {
                return path;
            }

            if (visited.has(`${x},${y}`) || ![undefined, ...ignore].includes(this.collision(x, y))) {
                continue;
            }

            visited.add(`${x},${y}`);

            const moves = [
                { dx: 1, dy: 0 },
                { dx: -1, dy: 0 },
                { dx: 0, dy: 1 },
                { dx: 0, dy: -1 }
            ];

            for (const move of moves) {
                const { x: wrappedX, y: wrappedY } = this.wrapCoordinates(x + move.dx, y + move.dy);

                if (!visited.has(`${wrappedX},${wrappedY}`) && [undefined, ...ignore].includes(this.collision(x, y))) {
                    const newPath = [...path, { x: wrappedX, y: wrappedY }];
                    queue.push({ x: wrappedX, y: wrappedY, path: newPath });
                }
            }
        }

        return null;
    }

    wrapCoordinates(x, y) {
        x = ((x % this.gridWidth) + this.gridWidth) % this.gridWidth;
        y = ((y % this.gridHeight) + this.gridHeight) % this.gridHeight;
        return { x, y };
    }

    collision(x, y) {
        var {x,y} = this.wrapCoordinates(x,y);
        return this.gameGrid[x][y].character_or_artifact;
    }

    async tick() {
        for(let day = 0; day < 1; day++) { 
            for (let t = 0; t < 24; t += 0.1) {
                for (const character of this.characters) {
                    t = Math.floor(Number.parseFloat(t.toFixed(2)) * 10) / 10;
                    await character.gameTick(t);
                }
            }
        }
    }
}
