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
    this.load.image("bluebrick", "assets/images/brickBlue.png")
    this.load.image("blackbrick", "assets/images/brickBlack.png")
    this.load.image("greenbrick", "assets/images/brickGreen.png")
    this.load.image("orangebrick", "assets/images/brickOrange.png")
    this.load.image("congratulations", "assets/images/congratulations.png" )
  }

  create() {
    this.physics.world.setBoundsCollision(true, true, true, false);
    
    
    this.add.image(400, 250, "background");
    this.gameoverImage = this.add.image(400, 90, "gameover");
    this.gameoverImage.visible = false;
    this.congratsImage = this.add.image(400, 90, "congratulations")
    this.congratsImage.visible = false;
    
    this.myGroup = this.physics.add.staticGroup({
      key: ["bluebrick", "orangebrick", "greenbrick", "blackbrick"],
      frameQuantity:1,
      gridAlign: {
        width: 10,
        height:4,
        cellWidth: 67,
        cellHeight: 34,
        x: 112,
        y:10

      }
    });
    
    this.scoreboard.create();

    this.platform = this.physics.add.image(400, 460, "platform").setImmovable();
    this.platform.body.allowGravity = false;

    this.ball = this.physics.add.image(385, 430, "ball");
    this.ball.setData('glue', true);
    this.ball.setCollideWorldBounds(true);

    this.physics.add.collider(this.ball, this.platform, this.platformImpact, null, this);
    this.physics.add.collider(this.ball, this.myGroup, this.brickImpact, null, this);

    this.ball.setBounce(1);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  brickImpact(ball, brick){
    brick.disableBody(true, true);
    this.scoreboard.incrementPoints(50);

    if(this.myGroup.countActive()===0){
      this.congratsImage.visible = true;
      this.scene.pause();
      this.ball.visible=false;
    }
  }

  platformImpact() {
    this.scoreboard.incrementPoints(10);

    let relativeImpact = this.ball.x - this.platform.x;
    if (relativeImpact < 1.0 && relativeImpact > -0.1) {
      this.ball.setVelocityX(Phaser.Math.Between(-10, 10));
    } else {
      this.ball.setVelocityX(10 * relativeImpact);
    }
  }

  update() {
    if (this.cursors.left.isDown) {
      this.platform.setVelocityX(-500);
        if (this.ball.getData('glue')) {
            this.ball.setVelocityX(-500)
        }
    } else if (this.cursors.right.isDown) {
        this.platform.setVelocityX(500);
        if (this.ball.getData('glue')) {
            this.ball.setVelocityX(500)
        }
    } else {
      this.platform.setVelocityX(0);
      if (this.ball.getData('glue')) {
          this.ball.setVelocityX(0);
      }
    }

    if (this.ball.y > 500) {
      console.log("fin");
      this.gameoverImage.visible = true;
      this.scene.pause();
      this.myGroup.setVisible(false)
    }

    if(this.cursors.up.isDown){
        this.ball.setVelocity(-75, -300)
        this.ball.setData('glue', false);
    }
  }
}