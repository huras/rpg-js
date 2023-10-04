
// Create instances of Character, Job, and Artifact
const baker = new Character({ x: 0, y: 0 }, 'baker', 1);
const woodcutter = new Character({ x: 10, y: 10 }, 'woodcutter', 1);


const tree = new Artifact('tree');
const door = new Artifact('door');

// Create a World instance and add characters, jobs, and artifacts
const gridWidth = 50;
const gridHeight = 50;
const gameWorld = new World(gridWidth, gridHeight);
gameWorld.addCharacter(baker);
gameWorld.addCharacter(woodcutter);
gameWorld.addJob(bakerJob);
gameWorld.addJob(woodcutterJob);
gameWorld.addArtifact(tree);
gameWorld.addArtifact(door);

// Simulate the game
gameWorld.simulateGame();