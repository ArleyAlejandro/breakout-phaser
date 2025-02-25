import { Scoreboard } from "./Scoreboard";

export class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
  }

  init() {
    this.scoreboard = new Scoreboard(this);
  }

  preload() {
    this.load.image("background", "assets/images/background.png");
    this.load.image("gameover", "assets/images/gameover.png");
    this.load.image("platform", "assets/images/platform.png");
    this.load.image("ball", "assets/images/ball.png");
    this.load.image("bluebrick", "assets/images/brickBlue.png");
    this.load.image("blackbrick", "assets/images/brickBlack.png");
    this.load.image("greenbrick", "assets/images/brickGreen.png");
    this.load.image("orangebrick", "assets/images/brickOrange.png");
    this.load.image("congratulations", "assets/images/congratulations.png");
  }

  create() {
    this.physics.world.setBoundsCollision(true, true, true, false);

    this.add.image(400, 250, "background");
    this.gameoverImage = this.add.image(400, 90, "gameover");
    this.gameoverImage.visible = false;
    this.congratsImage = this.add.image(400, 90, "congratulations");
    this.congratsImage.visible = false;

    this.myGroup = this.physics.add.staticGroup();
    const blockTypes = ["bluebrick", "orangebrick", "greenbrick", "blackbrick"];

    // Lista de posiciones específicas para los bloques
    const positions = [
      { x: 50, y: 150 },
      { x: 120, y: 150 },
      { x: 190, y: 250 },
      { x: 260, y: 250 },
      { x: 330, y: 50 },
      { x: 400, y: 50 },
      { x: 470, y: 150 },
      { x: 540, y: 250 },
      { x: 610, y: 150 },
      { x: 680, y: 50 },
      { x: 750, y: 50 },
      { x: 50, y: 100 },
      { x: 120, y: 100 },
      { x: 190, y: 100 },
      { x: 260, y: 100 }
    ];

    // Crear bloques en las posiciones especificadas
    positions.forEach(position => {
      const blockType = Phaser.Utils.Array.GetRandom(blockTypes);
      this.myGroup.create(position.x, position.y, blockType);
    });

    this.scoreboard.create();

    // Crear la plataforma y la bola
    this.platform = this.physics.add.image(400, 460, "platform").setImmovable();
    this.platform.body.allowGravity = false;
    this.platform.setCollideWorldBounds(true);

    this.ball = this.physics.add.image(385, 430, "ball");
    this.ball.setData('glue', true);
    this.ball.setCollideWorldBounds(true);

    this.physics.add.collider(this.ball, this.platform, this.platformImpact, null, this);
    this.physics.add.collider(this.ball, this.myGroup, this.brickImpact, null, this);

    this.ball.setBounce(1);

    this.cursors = this.input.keyboard.createCursorKeys();

    // Añadir el temporizador
    this.initialTime = 60;
    this.timeText = this.add.text(600, 16, 'Tiempo: 60', { fontSize: '25px', fill: '#ffffff' });
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.onEvent,
      callbackScope: this,
      loop: true
    });
  }

  onEvent() {
    this.initialTime -= 1;
    this.timeText.setText('Tiempo: ' + this.initialTime);

    if (this.initialTime <= 0) {
      this.gameOver();
    }
    
  }

  gameOver() {
    this.gameoverImage.visible = true;
    this.scene.pause();
    this.ball.setVisible(false);
    this.myGroup.setVisible(false);
  }

  brickImpact(ball, brick) {
    brick.disableBody(true, true);
    this.scoreboard.incrementPoints(50);

    if (this.myGroup.countActive() === 0) {
      this.congratsImage.visible = true;
      this.scene.pause();
      this.ball.visible = false;
    }
  }

  platformImpact() {

    this.scoreboard.decrementPoints(5);

    let relativeImpact = this.ball.x - this.platform.x;
    if (relativeImpact < 1.0 && relativeImpact > -0.1) {
      this.ball.setVelocityX(Phaser.Math.Between(-10, 10));
    } else {
      this.ball.setVelocityX(10 * relativeImpact);
    }
  }

  update() {
    if (this.cursors.left.isDown && this.platform.x > this.platform.width / 2) {
      this.platform.setVelocityX(-600);
      if (this.ball.getData('glue')) {
        this.ball.setVelocityX(-600);
      }
    } else if (this.cursors.right.isDown && this.platform.x < this.physics.world.bounds.width - this.platform.width / 2) {
      this.platform.setVelocityX(600);
      if (this.ball.getData('glue')) {
        this.ball.setVelocityX(600);
      }
    } else {
      this.platform.setVelocityX(0);
      if (this.ball.getData('glue')) {
        this.ball.setVelocityX(0);
      }
    }

    if (this.ball.y > 500) {
      this.gameOver();
    }

    if (this.cursors.up.isDown) {
      this.ball.setVelocity(-75, -300);
      this.ball.setData('glue', false);
    }
  }
}