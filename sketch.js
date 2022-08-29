var bg,bgImg;
var player, shooterImg, shooter_shooting;
var life = 3
var gameState = "play"
var score = 0
var bullets = 70

function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")
  zombieImg = loadAnimation("assets/Zombie1.png","assets/Zombie2.png","assets/Zombie3.png")
  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")
  bgImg = loadImage("assets/darkfbg.jpg")
  bulletImg = loadImage("assets/bullet1.png")
  deadImg = loadAnimation("assets/Dead.png","assets/Dead1.png","assets/Dead2.png")
  deadImg.playing = true
  deadImg.looping = false
}

function setup() {

  
  createCanvas(windowWidth,windowHeight);
  zumbiGroup = new Group()
  bulletGroup = new Group()
  heart1 = createSprite(displayWidth-225,40,20,20)
  heart2 = createSprite(displayWidth-175,40,20,20)
  heart3 = createSprite(displayWidth-125,40,20,20)
  heart1.visible = false
  heart2.visible = false
  heart1.addImage("heart1", heart1Img)
  heart2.addImage("heart2", heart2Img)
  heart3.addImage("heart3", heart3Img)
  heart1.scale = .4
  heart2.scale = .4
  heart3.scale = .4
  //adicionando a imagem de fundo
  

  

//criando o sprite do jogador
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   player.setCollider("rectangle",0,0,300,300)


}

function draw() {
  background(0); 
  image(bgImg, 0,0,width,height)
  if (gameState === "play"){
    if(keyDown("UP_ARROW")||touches.length>0){
      player.y = player.y-30
    }

    if(keyDown("DOWN_ARROW")||touches.length>0){
     player.y = player.y+30
    }
    
    if(keyWentDown("space")){
      player.addImage(shooter_shooting)
      shootgun()
      bullets -= 1
    }

    if(keyDown("LEFT_ARROW")||touches.length>0){
      player.x = player.x-30
    }

    if(keyDown("RIGHT_ARROW")||touches.length>0){
      player.x = player.x+30
    }

    else if(keyWentUp("space")){
      player.addImage(shooterImg)
    }
    
    if (zumbiGroup.isTouching(player)){
      for (var i=0;i<zumbiGroup.length;i++){
        if (zumbiGroup[i].isTouching(player)){
          zumbiGroup[i].destroy()
          life -= 1
        }
      }
    }
    if (life === 3){
      heart1.visible = false
      heart2.visible = false
      heart3.visible = true
    }
    if (life === 2){
      heart1.visible = false
      heart2.visible = true
      heart3.visible = false
    }
    if (life === 1){
      heart3.visible = false
      heart2.visible = false
      heart1.visible = true
    }
    if (life === 0){
      heart1.visible = false
      gameState = "end"

    }
    if (score>=200){
      gameState = "boss"
    }
    if (bullets === -1){
      gameState = "bullet"
    }
    zumbiGroup.overlap(bulletGroup,(zumbi,bullet)=>{
      zumbi.velocityX=0
      bullet.destroy()
      score += 5
      zumbi.changeAnimation("dead")
      zumbi.scale = .3  
      zumbi.setCollider("rectangle",1300,1300,0,0)
      setTimeout(()=>{
      zumbi.destroy()
     }, 1000) 

  })
    if (bulletGroup.isTouching(zumbiGroup)){
      for (var i = 0;i<bulletGroup.length;i++){
        if (bulletGroup[i].isTouching(zumbiGroup)){
          bulletGroup[i].destroyEach()
        }
      }
    }
    
    GenerateZombies()
  }

  drawSprites();
  textSize(25)
  text("Vidas: "+ life, displayWidth-200, displayHeight/2-450)
  text("Pontuação: "+score, displayWidth-200, displayHeight/2-400)
  if (gameState === "end"){
    textSize(100)
    fill("red")
    textFont("Georgia")
    text("Você Morreu!", width/2-300, height/2)
    zumbiGroup.destroyEach()
    player.destroy()

  } else if (gameState === "win"){
    textSize(100)
    fill("yellow")
    textFont("Georgia")
    text("Você Venceu!!!", width/2-300, height/2)
    zumbiGroup.destroyEach()
  } else if (gameState === "bullet"){
    textSize(100)
    fill("red")
    textFont("Georgia")
    text("Você não tem mais balas!", width/2-300, height/2)
    zumbiGroup.destroyEach()
    player.destroy()
    bulletGroup.destroyEach()
  }
} 
function GenerateZombies(){
  if (frameCount %50 === 0){
    zumbi = createSprite(width, random(500,height),40,40)
    zumbi.velocityX = -(6+2*score/15)
    zumbi.addAnimation("zumbie", zombieImg)
    zumbi.addAnimation("dead", deadImg)
    zumbi.scale = .4
    zumbi.lifetime = 800
    zumbiGroup.add(zumbi)
  }
}
function shootgun(){
  bullet = createSprite(player.x,player.y,20,10)
  bullet.velocityX = 12
  bullet.addImage(bulletImg)
  bullet.scale = .09
  bulletGroup.add(bullet)
}

