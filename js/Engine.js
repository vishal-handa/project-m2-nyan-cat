// The engine class will only be instantiated once. It contains all the logic
// of the game relating to the interactions between the player and the
// enemy and also relating to how our enemies are created and evolve over time
class Engine {
  // The constructor has one parameter. It will refer to the DOM node that we will be adding everything to.
  // You need to provide the DOM node when you create an instance of the class
  constructor(theRoot) {
    // We need the DOM element every time we create a new enemy so we
    // store a reference to it in a property of the instance.
    this.root = theRoot;
    // We create our hamburger.
    // Please refer to Player.js for more information about what happens when you create a player
    this.player = new Player(this.root);
    // Initially, we have no enemies in the game. The enemies property refers to an array
    // that contains instances of the Enemy class
    this.enemies = [];
    // We add the background image to the game
    addBackground(this.root);
    this.life=LIFE;
    lives(this.life);
    //setting the main image
    this.mainsection=document.getElementById('initialImage');

    //intro text and next button animation
    this.titleText=document.getElementById('mainTitle');
    this.titleText.setAttribute('class', 'entry');
    this.nextButton=document.getElementById('next');
    this.nextButton.setAttribute('class','entry');

    //link to the rules page
    this.nextButton.addEventListener('click', this.nextpage);
    
    //start game button
    this.startGame=document.getElementById('startGame');

    //add the audio files and play the first intro mp3
    this.intro = new Audio('musics/Intro.mp3');
    this.gameplay=new Audio('musics/Play.mp3');
    this.over=new Audio('musics/Over.mp3');
    this.intro.play();
    
    //the rules page
    this.introtext=document.getElementById('text');
    this.rules=document.getElementById('rules');
  }

  nextpage=()=>{
    //animation to remove the intro text
    this.titleText.removeAttribute('class','entry');
    this.nextButton.removeAttribute('class','entry');
    this.titleText.setAttribute('class','exit');
    this.nextButton.setAttribute('class','exit');

    //animation to the display of rules page
    this.rules.setAttribute('class','entry');
    this.rules.style.display='block';
    this.startGame.setAttribute('class','entry');
    this.startGame.style.display="block";

    // start the game below
    this.startGame.addEventListener('click', startIt);
  }
  
  // The gameLoop will run every few milliseconds. It does several things
  //  - Updates the enemy positions
  //  - Detects a collision between the player and any enemy
  //  - Removes enemies that are too low from the enemies array
  gameLoop = () => {
    this.intro.pause();
    this.gameplay.play();
    this.over.pause();
    //reset the gameover sound to start from beginning if there are multiple replays.
    this.over.currentTime=0;

    //remove all the intro pics texts and buttons
    this.mainsection.style.display="none";
    this.startGame.style.display="none";
    this.introtext.style.display="none";
    this.rules.style.display='none';

    // This code is to see how much time, in milliseconds, has elapsed since the last
    // time this method was called.
    // (new Date).getTime() evaluates to the number of milliseconds since January 1st, 1970 at midnight.
    if (this.lastFrame === undefined) {
      this.lastFrame = new Date().getTime();
    }

    let timeDiff = new Date().getTime() - this.lastFrame;
    this.lastFrame = new Date().getTime();
    // We use the number of milliseconds since the last call to gameLoop to update the enemy positions.
    // Furthermore, if any enemy is below the bottom of our game, its destroyed property will be set. (See Enemy.js)
    this.enemies.forEach((enemy) => {
      enemy.update(timeDiff);
    });

    // We remove all the destroyed enemies from the array referred to by \`this.enemies\`.
    // We use filter to accomplish this.
    // Remember: this.enemies only contains instances of the Enemy class.
    this.enemies = this.enemies.filter((enemy) => {
      return !enemy.destroyed;
    });
    function gameover(){
      let gameOver=document.getElementById("gameover");
      gameOver.style.display="block";
      let replay=document.getElementById('replay');
      replay.style.display='block';
      replay.setAttribute('class', 'entryZ');
      replay.addEventListener('click', playAgain);//playAgain defined in engine-utilities.js
      let gameovertext=document.getElementById('gameoverText');
      gameovertext.style.display='block';
      replay.setAttribute('class', 'entryZ');
      gameovertext.setAttribute('class', 'entryZ');
    }
    
  
    // We need to perform the addition of enemies until we have enough enemies.
    while (this.enemies.length < MAX_ENEMIES) {
      // We find the next available spot and, using this spot, we create an enemy.
      // We add this enemy to the enemies array
      const spot = nextEnemySpot(this.enemies);
      //randompick of the animal from kittyhaus.
      let drops=kittyhaus[Math.floor(Math.random() * kittyhaus.length)];
      //console.log(drops.name);
      let name=drops.name;
      let source=drops.src;

      // instance of the Enemy.js in enemies. Here it picks the name of the object and other properties
      this.enemies.push(new Enemy(this.root, spot, name, source));
      //console.log(this.enemies);
    }

    //set the name property

    //console.log(this.enemies);
    // We check if the player is dead. If he is, we alert the user
    // and return from the method (Why is the return statement important?)
    if (this.isPlayerDead() && this.life <= 0) {
      this.gameplay.pause();
      this.gameplay.currentTime=0;
      this.over.play();
      this.life=LIFE;
      lives(this.life);
      gameover();
      return;
      //gameOver.style.display=block;
    }

    // If the player is not dead, then we put a setTimeout to run the gameLoop in 20 milliseconds
    setTimeout(this.gameLoop, 20);
  };

  // This method is not implemented correctly, which is why
  // the burger never dies. In your exercises you will fix this method.
  isPlayerDead = () => {
    const enemy = this.enemies.find((enemy)=>{
      return this.player.x===enemy.x && (enemy.y + PLAYER_HEIGHT-70>= this.player.y)
    });
    if(enemy){
      if(enemy.name === 'cat'){
        this.life++;
        lives(this.life);
        console.log(this.life);
      } else if (enemy.name === 'centaur'){
        this.life -=10;
        lives(this.life);
      }
      enemy.update();
      //console.log(enemy, this.life);
    }
    //return enemy;
  };

  
}
