import {Character} from './characters';
import {World} from './world';
import {Artifact} from './artifacts';
import Phaser from 'phaser';



// // Create instances of Character, Job, and Artifact

// const woodcutter = new Character({ x: 10, y: 10 }, 'woodcutter', 1);


const tree = new Artifact('tree', { x: 1, y: 0 });
// const door = new Artifact('door');

// // Create a World instance and add characters, jobs, and artifacts
// const gridWidth = 50;
// const gridHeight = 50;
const gameWorld = new World(50, 50);

// gameWorld.addCharacter(woodcutter);
gameWorld.addArtifact(tree);
// gameWorld.addArtifact(door);

// // Simulate the game
// gameWorld.simulateGame();

// ====================================================================================================

// TODO: You'll want to have actual images for your character, tree, etc.
const preload = function () {
    this.load.image('baker', '../img/BakerMale.webp');
    // game.load.image('tree', 'path_to_tree_image.png');
    // ... add other assets here
}

const create = function () {
    const baker = new Character({
        position: { x: 0, y: 0 }, 
        job: 'baker', 
        speed: 1,
        inventory: [],
        sprite: this.add.image(0, 0, 'baker')
    });
    gameWorld.addCharacter(baker);

    console.log('create');
    console.log(gameWorld);
    console.log(baker);

    // Create the entities in the Phaser world using the loaded images
    
    //set width and height
    
    // game.add.image(tree.position.x * 16, tree.position.y * 16, 'tree');
    // ... create other entities here

    const days = 1;
    const minimumTimeUnit = 0.1;
    const ticks = Math.floor((24 / minimumTimeUnit) * days);

    var countedTicks = 0;
    var countedTime = 0;
        const myInterval = setInterval(() => {
            gameWorld.tick(countedTime);
            countedTicks ++;
            countedTime += minimumTimeUnit;
            if (countedTime >= 24) {
                countedTime %= 24;
            }

            if (countedTicks >= ticks) {
                clearInterval(myInterval);
            }
        }, 50);

    // for(let day = 0; day < 1; day++) { 
    //     for (let t = 0; t < 24; t += 0.1) {
    //     }
    // }
}

// Initialize Phaser
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
    }
};

const game = new Phaser.Game(config);