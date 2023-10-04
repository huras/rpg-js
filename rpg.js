/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/artifacts.js":
/*!**************************!*\
  !*** ./src/artifacts.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Artifact: () => (/* binding */ Artifact)
/* harmony export */ });
// Artifact class
class Artifact {
    constructor(name, position) {
        this.name = name;
        this.position = position;
    }
}



/***/ }),

/***/ "./src/characters.js":
/*!***************************!*\
  !*** ./src/characters.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Character: () => (/* binding */ Character)
/* harmony export */ });
class Character {
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


/***/ }),

/***/ "./src/world.js":
/*!**********************!*\
  !*** ./src/world.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   World: () => (/* binding */ World)
/* harmony export */ });
// World class
class World {
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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./src/rpg.js ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _characters__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./characters */ "./src/characters.js");
/* harmony import */ var _world__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./world */ "./src/world.js");
/* harmony import */ var _artifacts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./artifacts */ "./src/artifacts.js");




// // Create instances of Character, Job, and Artifact
const baker = new _characters__WEBPACK_IMPORTED_MODULE_0__.Character({
    position: { x: 0, y: 0 }, 
    job: 'baker', 
    speed: 2,
    inventory: [],
});
// const woodcutter = new Character({ x: 10, y: 10 }, 'woodcutter', 1);


const tree = new _artifacts__WEBPACK_IMPORTED_MODULE_2__.Artifact('tree', { x: 1, y: 0 });
// const door = new Artifact('door');

// // Create a World instance and add characters, jobs, and artifacts
// const gridWidth = 50;
// const gridHeight = 50;
const gameWorld = new _world__WEBPACK_IMPORTED_MODULE_1__.World(50, 50);
console.log(gameWorld);
gameWorld.addCharacter(baker);
// gameWorld.addCharacter(woodcutter);
gameWorld.addArtifact(tree);
// gameWorld.addArtifact(door);

gameWorld.tick();
// // Simulate the game
// gameWorld.simulateGame();

console.log(baker);
})();

/******/ })()
;
//# sourceMappingURL=rpg.js.map