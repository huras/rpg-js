import {Character} from './characters';
import {World} from './world';
import {Artifact} from './artifacts';

// // Create instances of Character, Job, and Artifact
const baker = new Character({
    position: { x: 0, y: 0 }, 
    job: 'baker', 
    speed: 2,
    inventory: [],
});
// const woodcutter = new Character({ x: 10, y: 10 }, 'woodcutter', 1);


const tree = new Artifact('tree', { x: 1, y: 0 });
// const door = new Artifact('door');

// // Create a World instance and add characters, jobs, and artifacts
// const gridWidth = 50;
// const gridHeight = 50;
const gameWorld = new World(50, 50);
console.log(gameWorld);
gameWorld.addCharacter(baker);
// gameWorld.addCharacter(woodcutter);
gameWorld.addArtifact(tree);
// gameWorld.addArtifact(door);

gameWorld.tick();
// // Simulate the game
// gameWorld.simulateGame();

console.log(baker);