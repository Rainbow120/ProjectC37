var dog,happyDog,database,foodS,foodStock;
var dog_img,happyDog_img;
var feed,addfood, foodObj;
var fedTime,lastFed;
var input,button;
var gameState, changeState, readState, updateState;
var bedroom, garden, washroom;

function preload(){
  dog_img=loadImage("images/dogImg.png");
  happyDog_img=loadImage("images/dogImg1.png");
  bedroom = loadImage("images/bedroom.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/washroom.png");
}

function setup(){
  database=firebase.database();

  foodStock=database.ref("Food");
  foodStock.on("value",readStock);

  createCanvas(1000,400);

  dog=createSprite(800,200);
  dog.addImage(dog_img);
  dog.scale=0.2;

  foodObj=new food();

  feed=createButton("Feed the Dog");
  feed.position(1000,67);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food")
  addFood.position(1100,67);
  addFood.mousePressed(addFoods);

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  })
}
 
function draw(){
  background(46, 139, 87);

  if(gameState!=="Hungry"){
    feed.hide();  
    addFood.hide();
    dog.visible=false;
  }
  else {
    feed.show();
    addFood.show();
    dog.visible=true;
   // dog.addImage(dog_img);
  }

  foodObj.display();  

  fedTime=database.ref("FeedTime");
  fedTime.on("value",function(data){
    lastFed=data.val();
  })

  fill("white");
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM",350,30);
  }
  else if(lastFed===0){
    text("Last Feed : 12 AM",350,30)
  }
  else{
    text("Last Feed : "+ lastFed + " AM",350,30);
  }

  currenttime=hour();
  if(currenttime==(lastFed+1)) {
    update("Playing")
    foodObj.garden();
    //console.log(background);
  }
  else if(currenttime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom()
    //console.log(background);
  }
  else if(currenttime>(lastFed+2)&&currenttime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }
  else{
    update("Hungry");
    foodObj.display();
    dog.addImage(dog_img);
  }

  drawSprites();
}

function readStock(data){ 
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog_img);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref("/").update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
  
}

function addFoods(){
  foodS++;
  database.ref("/").update({
    Food:foodS
  })
}

function update(state){
  database.ref("/").update({
    gameState:state
  })
}