/*
* Copyright (c) 2011-12 piluke <pikingqwerty@gmail.com>
* Copyright (c) 2011-12 jimn346 <jds9496@gmail.com>
* You can find the GitHub repository at https://github.com/piluke/GameMaker-HTML5-Player
* 
* This file is part of GameMaker HTML5 Player (GHP).
* GHP is free software and comes with ABSOLUTELY NO WARANTY.
* See LICENSE for more details.
*/

canvas = document.getElementById("maincan");
local = true;
if ((window.location.protocol == "http:")||(window.location.protocol == "https:"))
{
	local = false;
}

context = canvas.getContext("2d");
cursurf = canvas;
curcon = context;
//These were added to handle the current surface
keymap = new Array();

//Constants and globals
mouseX = 0;
mouseY = 0;
pi = Math.PI;
mpd = 1000*60*60*24; //Milliseconds per day
all = -100;

fps = 60;
cfps = 0;
tfps = fps;
fnd = new Date();
fnd = fnd.getSeconds();
fod = fnd;

room = 0;
roomWidth = canvas.width;
roomHeight = canvas.height;

globalFont = null;
links = new Array();

foreground = new Array();
keys = new Array();
pkey = new Array();
cursor = new Image();

sounds = new Array();
volume = 1;

glin = new Array();

resource = new Array();
resource[0] = new Array(); //Sprites
resource[1] = new Array(); //Sounds
resource[2] = new Array(); //Backgrounds
resource[3] = new Array(); //Fonts
resource[4] = new Array(); //Paths
resource[5] = new Array(); //Scripts
resource[6] = new Array(); //Timelines
resource[7] = new Array(); //Objects
resource[8] = new Array(); //Rooms

//Colors
cAqua = "#00FFFF";
cBlack = "#000000";
cBlue = "#0000FF";
cDkgray = "#404040";
cFuchsia = "#FF00FF";
cGray = "#808080";
cGreen = "#008000";
cLime = "#00FF00";
cLtgray = "#C0C0C0";
cMaroon = "#800000";
cNavy = "#000080";
cOlive = "#808000";
cOrange = "#FFA000";
cPurple = "#800080";
cRed = "#FF0000";
cSilver = "#C0C0C0";
cTeal = "#008080";
cWhite = "#FFFFFF";
cYellow = "#FFFF00";

//Keys
vkNokey = undefined;
vkAnykey = 0;
vkLeft = 37;
vkRight = 39;
vkUp = 38;
vkDown = 40;
vkEnter = 13;
vkEscape = 27;
vkShift = 16;
vkControl = 17;
vkAlt = 18;
vkBackspace = 8;
vkTab = 9;
vkHome = 36;
vkEnd = 35;
vkDelete = 46;
vkInsert = 45;
vkPageup = 33;
vkPagedown = 34;
vkPause = 19;
vkPrintscreen = 44;
vkF1 = 112;
vkF2 = 113;
vkF3 = 114;
vkF4 = 115;
vkF5 = 116;
vkF6 = 117;
vkF7 = 118;
vkF8 = 119;
vkF9 = 120;
vkF10 = 121;
vkF11 = 122;
vkF12 = 123;
vkNumpad0 = 96;
vkNumpad1 = 97;
vkNumpad2 = 98;
vkNumpad3 = 99;
vkNumpad4 = 100;
vkNumpad5 = 101;
vkNumpad6 = 102;
vkNumpad7 = 103;
vkNumpad8 = 104;
vkNumpad9 = 105;
vkMultiply = 106;
vkDivide = 111;
vkAdd = 107;
vkSubtract = 109;
vkDecimal = 110;

//Invisible image (used for surfaceExists)
blankImage = new Image();
blankImage.src = "invis.png";

//Required functions
function fontAdd(name, size, bold, italic)
{
  this.temp = new Font();
  temp.style = bold + italic * 2;
  this.str = "";
  if (temp.style == 1)
  {
    str = "bold ";
  }
  if (temp.style == 2)
  {
    str = "italic ";
  }
  if (temp.style == 3)
  {
    str = "italic bold ";
  }
  str += size + "pt " + name;
  temp.font = str;
  temp.name = name;
  temp.size = size;
  return temp;
}
function surfaceCreate(w, h)
{
  //temps has to be used instead of temp because this method is used in fontAddSprite which uses temp.
  this.temps = document.createElement("canvas");
  temps.setAttribute("width", w);
  temps.setAttribute("height", h);
  temps.setAttribute("style", "visibility: hidden;");
  return temps;
}
function fontAddSprite(sprite, first, prop, sep)
{
  this.temp = new SpriteFont();
  temp.sprite = sprite;
  temp.start = first;
  temp.sep = sep;
  temp.prop = prop;
  if (prop === true)
  {
    temp.propx = new Array();
    temp.propwidth = new Array();
	this.minx = sprite.siwidth;
	this.maxw = 0;
	this.surf = surfaceCreate(sprite.width, sprite.height);
	this.con = surf.getContext("2d");
	con.drawImage(sprite, 0, 0);
	this.imgdata = con.getImageData(0, 0, sprite.width, sprite.height);
	for (var i = 0; i < sprite.width / sprite.siwidth; i++)
	{
	  for (var x = 0; x < sprite.siwidth; x++)
	  {
	    for (var y = 0; y < sprite.height; y++)
	    {
	      if (imgdata.data[(i * sprite.siwidth + x + (y * sprite.width)) * 4 + 3] > 0)
		  {
		    minx = min(minx, x);
		  }
	    }
	  }
	  temp.propx[i] = minx;
	  for (var x = minx + 1; x < sprite.siwidth; x++)
	  {
	    for (var y = 0; y < sprite.height; y++)
	    {
	      if (imgdata.data[(i * sprite.siwidth + x + (y * sprite.width)) * 4 + 3] > 0)
		  {
		    maxw = max(maxw, x - minx);
		  }
	    }
	  }
	  temp.propwidth[i] = maxw;
	}
  }
  return temp;
}
function Font()
{
  this.font = null;
  this.name = null;
  this.size = null;
  this.style = null;
}
function SpriteFont()
{
  this.sprite = null;
  this.start = null;
  this.sep = null;
  this.prop = null;
  
  //These two variables are used for proportional sprite fonts.
  this.propx = null;
  this.propwidth = null;
}

//Stuff to make color blending possible
function imageBlend(img, col)
{
  if (local)
  {
	return img;
  }
  this.temp = document.createElement("canvas");
  temp.setAttribute("width", image.width);
  temp.setAttribute("height", image.height);
  temp.setAttribute("style", "visibility: hidden;");
  this.tmpctx = temp.getContext("2d");
  
  //Get the data for the single color
  col = col.replace("#", "");
  this.rgb = parseInt(col, 16);
 
  this.red = (rgb & (255 << 16)) >> 16;
  this.green = (rgb & (255 << 8)) >> 8;
  this.blue = (rgb & 255);
  
  //Put the image on the new canvas
  tmpctx.drawImage(img, 0, 0);
  this.imageData = tmpctx.getImageData(0, 0, temp.width, temp.height);
  this.data = imageData.data;
  
  //Blend the image.
  for (var i = 0; i < data.length; i += 4)
  {
	data[i] = Math.round(data[i] * red * (1 / 255));
	data[i + 1] = Math.round(data[i + 1] * green * (1 / 255));
	data[i + 2] = Math.round(data[i + 2] * blue * (1 / 255));
  }
  
  //Set the data to the canvas.
  tmpctx.putImageData(imageData, 0, 0);
  
  return temp;
}
//Resources
function Sprite(fname, imgn, rmback, sm, xo, yo)
{
	var img = new Image();
	img.src = fname;
	var tmp = fname.replace(/^.*[\\\/]/, "").split(".");
	tmp.pop();
	img.name = tmp.join();
	img.numb = imgn;
	img.removeback = rmback;
	img.smooth = sm;
	img.xorig = xo;
	img.yorig = yo;
	img.onload = function() {
		this.siwidth = this.width/this.numb;
		resource[0][resource[0].length] = this;
	};
	return img;
}
function Sound(fname, kind, pre)
{
	var snd = new Audio();
	snd.src = fname;
	snd.kind = kind;
	if (pre)
	{
		snd.load();
	}
	snd.onload = function() {
		resource[1][resource[1].length] = this;
	}
	return snd;
}
function Background(fname, rmback, sm)
{
	var bck = new Image();
	bck.src = fname;
	bck.removeback = rmback;
	bck.smooth = sm;
	bck.onload = function() {
		resource[2][resource[2].length] = this;
	}
	return bck;
}
function Path()
{
	var pth = new Array();
	resource[4][resource[4].length] = this;
	return pth;
}
function Timeline()
{
	var tml = new Array();
	resource[6][resource[6].length] = this;
	return tml;
}
function GmObject()
{
	var obj = new Array();
	resource[7][resource[7].length] = this;
	return obj;
}
function Room()
{
	var rm = new Array();
	resource[8][resource[8].length] = this;
	return rm;
}

///////////
//Particles
///////////

//This handles all of the systems.
var systems = new Array();

//Constants
var psDeflectHorizontal = 0;
var psDeflectVertical = 1;

var psShapeRectangle = 0;
var psShapeEllipse = 1;
var psShapeDiamond = 2;
var psShapeLine = 3;

var psDistrLinear = 0;
var psDistrGaussian = 1;
var psDistrInvgaussian = 2;

var psChangeMotion = 0;
var psChangeShape = 1;
var psChangeAll = 2;

var psForceConstant = 0;
var psForceLinear = 1;
var psForceQuadratic = 2;

//Shapes
ptShapePixel = new Image();
ptShapePixel.src = "particles/00_pixel.png";
ptShapePixel.colors = new Array();

ptShapeDisk = new Image();
ptShapeDisk.src = "particles/01_disk.png";
ptShapeDisk.colors = new Array();

ptShapeSquare = new Image();
ptShapeSquare.src = "particles/02_square.png";
ptShapeSquare.colors = new Array();

ptShapeLine = new Image();
ptShapeLine.src = "particles/03_line.png";
ptShapeLine.colors = new Array();

ptShapeStar = new Image();
ptShapeStar.src = "particles/04_star.png";
ptShapeStar.colors = new Array();

ptShapeCircle = new Image();
ptShapeCircle.src = "particles/05_circle.png";
ptShapeCircle.colors = new Array();

ptShapeRing = new Image();
ptShapeRing.src = "particles/06_ring.png";
ptShapeRing.colors = new Array();

ptShapeSphere = new Image();
ptShapeSphere.src = "particles/07_sphere.png";
ptShapeSphere.colors = new Array();

ptShapeFlare = new Image();
ptShapeFlare.src = "particles/08_flare.png";
ptShapeFlare.colors = new Array();

ptShapeSpark = new Image();
ptShapeSpark.src = "particles/09_spark.png";
ptShapeSpark.colors = new Array();

ptShapeExplosion = new Image();
ptShapeExplosion.src = "particles/10_explosion.png";
ptShapeExplosion.colors = new Array();

ptShapeCloud = new Image();
ptShapeCloud.src = "particles/11_cloud.png";
ptShapeCloud.colors = new Array();

ptShapeSmoke = new Image();
ptShapeSmoke.src = "particles/12_smoke.png";
ptShapeSmoke.colors = new Array();

ptShapeSnow = new Image();
ptShapeSnow.src = "particles/13_snow.png";
ptShapeSnow.colors = new Array();

function ParticleSystem()
{
	this.attractors = new Array();
	this.changers = new Array();
	this.deflectors = new Array();
	this.destroyers = new Array();
	this.emitters = new Array();
	this.particles = new Array();
	
	this.order = true;
	this.depth = 0;
	
	this.x = 0;
	this.y = 0;
	
	this.autoUpdate = true;
	this.autoDraw = true;
}

function ParticleAttractor()
{
	this.x = 0;
	this.y = 0;
	this.dist = 0;
	this.kind = psForceConstant;
	this.additive = true;
}

function ParticleChanger()
{
	this.xMin = 0;
	this.xMax = 0;
	this.yMin = 0;
	this.yMax = 0;
	this.shape = psShapeRectangle;
	this.kind = psChangeAll;
	this.type1 = null;
	this.type2 = null;
}

function ParticleDeflector()
{
	this.xMin = 0;
	this.xMax = 0;
	this.yMin = 0;
	this.yMax = 0;
	this.kind = psDeflectHorizontal;
	this.friction = 0;
}

function ParticleDestroyer()
{
	this.xMin = 0;
	this.xMax = 0;
	this.yMin = 0;
	this.yMax = 0;
	this.shape = spShapeRectangle;
}

function ParticleEmitter()
{
	this.xMin = 0;
	this.xMax = 0;
	this.yMin = 0;
	this.yMax = 0;
	this.shape = psShapeRectangle;
	this.distribution = psDistrLinear;
	this.stream = new Array();
	this.number = new Array();
	this.count = new Array();
}

function ParticleType()
{
	this.shape = ptShapePixel;
	
	this.sizeMin = 1;
	this.sizeMax = 1;
	this.sizeIncr = 0;
	this.sizeWiggle = 0;
	
	this.xscale = 1;
	this.yscale = 1;
	
	this.angMin = 0;
	this.angMax = 0;
	this.angIncr = 0;
	this.angWiggle = 0;
	this.angRelative = 0;
	
	this.color1 = cWhite;
	this.color2 = cWhite;
	this.color3 = cWhite;
	
	this.colorMix = false;
	
	this.rgb = false;
	this.rMin = 255;
	this.gMin = 255;
	this.bMin = 255;
	this.rMax = 255;
	this.gMax = 255;
	this.bMax = 255;
	
	this.hsv = false;
	this.hMin = 255;
	this.sMin = 255;
	this.vMin = 255;
	this.hMax = 255;
	this.sMax = 255;
	this.vMax = 255;
	
	this.alpha1 = 1;
	this.alpha2 = 1;
	this.alpha3 = 1;
	
	this.blend = false;
	
	this.lifeMin = 100;
	this.lifeMax = 100;
	
	this.stepNumber = 0;
	this.stepType = null;
	
	this.deathNumber = 0;
	this.deathType = null;
	
	this.speedMin = 1;
	this.speedMax = 1;
	this.speedIncr = 0;
	this.speedWiggle = 0;
	
	this.dirMin = 360;
	this.dirMax = 0;
	this.dirIncr = 0;
	this.dirWiggle = 0;
	
	this.gravAmount = 0;
	this.gravDirection = 0;
	
	this.stepType = null;
	this.stepNumber = 0;
	
	this.deathType = null;
	this.deathNumber = 0;
	
	//Only used if it is a sprite
	this.animat = false;
	this.stretch = false;
	this.rand = false;
}

function Particle()
{
	this.type = null;
	this.size = null;
	this.ang = null;
	this.color = null;
	this.overcolor = false;
	this.alpha = null;
	this.life = 0;
	this.time = null;
	this.speed = null;
	this.dir = null;
	this.x = null;
	this.y = null;
	this.subimg = null;
	this.stepCount = 0;
	
	//If hit by a changer...
	this.type2 = null;
	this.chtype = null;
}

//Sprites
sprCursor = new Sprite("sprites/sprCursor.png", 1, true, false, 0, 0);
sprPie = new Sprite("sprites/sprPie.png", 1, false, false, 0, 0);
sprPlayer = new Sprite("sprites/sprPlayer.png", 8, true, false, 0, 0);
sprPlayer.colors = new Array();
sprFloor = new Sprite("sprites/sprFloor.png", 1, false, false, 0, 0);
sprBitFont = new Sprite("sprites/sprBitFont.png", 144, true, false, 0, 0);

//Sounds
sndClick = new Sound("sounds/sndClick.wav", 0, true);

//Backgrounds
bckMain = new Background("backgrounds/bckMain.png", false, false);
bckFore = new Background("backgrounds/bckFore.png", false, false);

//Fonts
fntMain = fontAdd("Calibri", 8, false, false);
fntSwitch1 = fontAdd("Comic Sans MS", 16, true, true);
fntSwitch2 = fontAdd("Verdana", 16, false, true);
fntOther = fntSwitch1;
fntBitmap = fontAddSprite(sprBitFont, 33, false, -16);

//Scripts
function drawCopyright()
{
	drawSetColor(cBlack);
	drawSetFont(fntMain);
	var str = "Copyright (c) 2011-12 Pixel Matrix Studios, by piluke, see the commented license for more information.";
	drawText(str, 0, 10);
	drawText("FPS: "+tfps, 600, 10);
	drawRectangle(0, 0, stringWidth(str)+1, stringHeight(str)+3, true);
}

//Objects
function instanceCreate(inst, x, y)
{
  var i = inst.id.length;
  inst.id[i] = new inst(i, x, y);
  inst.Create(i, x, y);
  return i;
}
function objDraw()
{
  objControl.Draw();
  objPlayer.Draw();
  objFloor.Draw();
}
function objStep()
{
  objPlayer.Step();
}
function objKeys(i)
{
  objPlayer.Keyboard(i);
}
function objKeyP(i)
{
  objPlayer.KeyboardPress(i);
}
function objMouseP()
{
  objControl.MousePress();
}

//ObjControl
objControl = function()
{
  //Do nothing
}
objControl.id = new Array();
objControl.sprite = 0;
objControl.Create = function(i, x, y)
{
  objControl.id[i] = new Array();
  objControl.id[i]["glin"] = glin.length;
  glin[glin.length] = objControl.id[i];
  objControl.id[i]["x"] = x;
  objControl.id[i]["y"] = y;
  objControl.id[i]["sprite"] = 0;
  objControl.id[i]["width"] = 0;
  objControl.id[i]["height"] = 0;
  objControl.id[i]["surf"] = surfaceCreate(64, 64);
  surfaceSetTarget(objControl.id[i]["surf"]);
  drawSetColor(cRed);
  drawCircle(32, 32, 16, false);
  drawSetColor(cBlue);
  drawCircle(64, 64, 32, true);
  surfaceResetTarget();
  drawSetCursor(sprCursor);
  objControl.id[i]["ps1"] = partSystemCreate();
  partSystemAutomaticDraw(objControl.id[i]["ps1"], false);
  partSystemAutomaticUpdate(objControl.id[i]["ps1"], false);
  objControl.id[i]["type1"] = partTypeCreate();
  partTypeShape(objControl.id[i]["type1"], ptShapeFlare);
  partTypeSize(objControl.id[i]["type1"], .25, .5, .03125, 0);
  partTypeOrientation(objControl.id[i]["type1"], 0, 360, 4, 0, 0);
  partTypeColor3(objControl.id[i]["type1"], cRed, cGreen, cBlue);
  partTypeAlpha3(objControl.id[i]["type1"], 1, .5, 0);
  partTypeBlend(objControl.id[i]["type1"], true);
  partTypeLife(objControl.id[i]["type1"], 5,10);
  partTypeSpeed(objControl.id[i]["type1"], 1, 2, 0, 0);
  partTypeDirection(objControl.id[i]["type1"], 0, 360, 0, 0);
  partTypeGravity(objControl.id[i]["type1"], 0, 0);
  objControl.id[i]["em1"] = partEmitterCreate(objControl.id[i]["ps1"]);
  partEmitterRegion(objControl.id[i]["ps1"], objControl.id[i]["em1"], 192, 192, 288, 288, psShapeEllipse, psDistrGaussian);
  partEmitterStream(objControl.id[i]["ps1"], objControl.id[i]["em1"], objControl.id[i]["type1"], 1);
}
objControl.MousePress = function(i)
{
	for (var e=0;e<objControl.id.length;e++)
	{
		if (rooms[room] == rmOther)
		{
			soundPlay(sndClick);
		}
	}
}
objControl.Draw = function()
{
	for (var i=0;i<objControl.id.length;i++)
	{
		if (rooms[room] == rmMain)
		{
			drawCopyright();
			drawSetColor(cBlack);
			drawRectangle(50, 70, 300, 250, false);
			drawRectangle(350, 70, 600, 250, false);
			drawRectangle(50, 270, 300, 450, false);
			drawRectangle(350, 270, 600, 450, false);
			addLink(roomGoto, rmDraw, 50, 70, 250, 180, false);
			drawSetFont(fntBitmap);
			drawSetColor(cRed);
			drawText("Drawing", 100, 100);
			drawSetColor(cOrange);
			drawText("Movement", 400, 100);
			drawSetColor(cYellow);
			drawText("Text~#embedding", 100, 300);
			drawSetColor(cGreen);
			drawText("Other", 400, 300);
		}
		else if (rooms[room] == rmDraw)
		{
			drawSetBackground(true, bckMain, cGray);
			drawCopyright();
			drawSetColor(cOrange);
			drawRectangle(30, 30, 50, 50, false);
			drawSetColor(cBlue);
			drawCircle(100, 40, 20, true);
			drawSprite(sprPie, 5, 70, 0);
			drawSetGradient(true, 100, 70, mouseX, mouseY, cGreen, cYellow);
			drawRectangle(100, 70, 200, 170, false);
			drawSetGradient(false, 275, 100, mouseX, mouseY, cBlue, cDkgray, 15, 50);
			drawCircle(275, 100, 50, false);
			drawSetColor(cBlue);
			drawText("Radial gradients are actually cones.~#They render differently in different browsers.", 350, 100);
			drawSetFont(fntOther);
			drawText("Use fonts and ~a:fntOther=(fntOther==fntSwitch1)?fntSwitch2:fntSwitch1~links!~", 350, 300);
			drawSetFont(fntBitmap);
			drawText("You can even use~#sprite fonts!", 16, 176);
			drawSetBackground(false, bckFore, cBlack);
			drawSurface(objControl.id[i]["surf"], 12, 240);
			drawSetFont(fntMain);
			drawSetColor(surfaceGetPixel(objControl.id[i]["surf"], 32, 32));
			drawText("Surfaces can be~#used too!", 12, 312);
			partSystemUpdate(objControl.id[i]["ps1"]);
			partSystemDrawit(objControl.id[i]["ps1"]);
		}
		if (rooms[room] != rmMain)
		{
			drawSetColor(cBlack);
			drawRectangle(500, 10, 550, 30, false);
			addLink(roomGoto, rmMain, 500, 10, 550, 30, false);
			drawSetFont(fntMain);
			drawSetColor(cWhite);
			drawText("Back", 510, 25);
		}
	}
}
objControl.Destroy = function()
{
	for (var i=0;i<objControl.id.length;i++)
	{
		surfaceFree(objControl.id[i]["surf"]);
	}
}

//ObjPlayer
function objPlayer(i)
{
  //Do nothing
}
objPlayer.id = new Array();
objPlayer.sprite = sprPlayer;
objPlayer.subimg = 0;
objPlayer.sid = 0;
objPlayer.imgnumb = 8;
objPlayer.Create = function(i, x, y)
{
  objPlayer.id[i] = new Array();
  objPlayer.id[i]["glin"] = glin.length;
  glin[glin.length] = objPlayer.id[i];
  objPlayer.id[i]["x"] = x;
  objPlayer.id[i]["y"] = y;
  objPlayer.id[i]["startx"] = x;
  objPlayer.id[i]["starty"] = y;
  objPlayer.id[i]["face"] = 1;
  objPlayer.id[i]["sprite"] = sprPlayer;
  objPlayer.id[i]["width"] = 32;
  objPlayer.id[i]["height"] = 32;
  objPlayer.id[i]["self"] = objPlayer.id[i];
  objPlayer.id[i]["name"] = objPlayer.name;
}
objPlayer.Keyboard = function(i)
{
  for (var e=0;e<objPlayer.id.length;e++)
  {
	if ((keys[vkLeft] == 1)&&(placeEmpty(objPlayer.id[e], objPlayer.id[e]["x"]-1, objPlayer.id[e]["y"])))
    {
      objPlayer.id[e]["x"] -= 1;
      objPlayer.id[e]["face"] = -1;
    }
    if ((keys[vkRight] == 1)&&(placeEmpty(objPlayer.id[e], objPlayer.id[e]["x"]+objPlayer.id[e]["width"]+1, objPlayer.id[e]["y"])))
    {
      objPlayer.id[e]["x"] += 1;
  	  objPlayer.id[e]["face"] = 1;
    }
  }
}
objPlayer.KeyboardPress = function(i)
{
	for (var e=0;e<objPlayer.id.length;e++)
	{
		if (keys[vkUp] == 1)
		{
		for (var a=25;a>0;a--)
		{
			if (placeEmpty(objPlayer.id[e], objPlayer.id[e]["x"], objPlayer.id[e]["y"]-a))
			{
			objPlayer.id[e]["y"] -= a;
			break;
			}
		}
		}
		if (keys[ord("R")] == 1)
		{
			roomRestart();
		}
	}
}
objPlayer.Step = function()
{
  for (var i=0;i<objPlayer.id.length;i++)
  {
    //Gravity
    if ((placeEmpty(objPlayer.id[i], objPlayer.id[i]["x"], objPlayer.id[i]["y"]+objPlayer.id[i]["height"]))&&(placeEmpty(objPlayer.id[i], objPlayer.id[i]["x"]+objPlayer.id[i]["width"], objPlayer.id[i]["y"]+objPlayer.id[i]["height"])))
    {
      objPlayer.id[i]["y"] += 1;
    }
  }
}
objPlayer.Draw = function()
{
  objPlayer.sid = objPlayer.sid+(1000/fps);
  objPlayer.subimg = objPlayer.sid % objPlayer.imgnumb;
  for (var i=0;i<objPlayer.id.length;i++)
  {
	if (keys[vkLeft])
	{
	  drawSpriteExt(objPlayer.id[i]["sprite"], objPlayer.id[i]["x"] + objPlayer.id[i]["sprite"]["siwidth"], objPlayer.id[i]["y"], objPlayer.subimg, -1, 1, 0, cYellow, 1);
	}
	else if (keys[vkRight])
	{
	  drawSpriteExt(objPlayer.id[i]["sprite"], objPlayer.id[i]["x"], objPlayer.id[i]["y"], objPlayer.subimg, 1, 1, 0, cWhite, 1);
	}
	else
	{
	  drawSpriteExt(objPlayer.id[i]["sprite"], objPlayer.id[i]["x"], objPlayer.id[i]["y"], 0, 1, 1, 0, cWhite, 1);
	}
	drawSetFont(fntMain);
    drawText("Move and click the mouse!~#Move around with the arrow keys!~#Press \"R\" to reset.", 100, 250);
  }
}
objPlayer.Collision = function(obj)
{
  if (obj == "objFloor")
  {
    alert("Collision!");
  }
}

//ObjFloor
function objFloor(i)
{
  //Do nothing
}
objFloor.id = new Array();
objFloor.sprite = 0;
objFloor.Create = function(i, x, y)
{
  objFloor.id[i] = new Array();
  objFloor.id[i]["glin"] = glin.length;
  glin[glin.length] = objFloor.id[i];
  objFloor.id[i]["x"] = x;
  objFloor.id[i]["y"] = y;
  objFloor.id[i]["width"] = 32;
  objFloor.id[i]["height"] = 32;
  objFloor.id[i]["sprite"] = sprFloor;
}
objFloor.Draw = function()
{
  for (var i=0;i<objFloor.id.length;i++)
  {
    drawSprite(objFloor.id[i]["sprite"], objFloor.id[i]["x"], objFloor.id[i]["y"], 0);
  }
}

//Rooms
rooms = new Array();
rooms[0] = rmMain;
rooms[1] = rmDraw;
function roomOpen(i)
{
  if (rooms[i] == undefined)
  {
	return;
  }
  for (var e=0;e<rooms[i].inst.length;e++)
  {
    instanceCreate(rooms[i].inst[e][0], rooms[i].inst[e][1], rooms[i].inst[e][2]);
  }
  roomWidth = rooms[i].width;
  roomHeight = rooms[i].height;
  canvas.width = roomWidth;
  canvas.height = roomHeight;
  room = i;
  clearDraw();
}

//rmMain
function rmMain(i)
{
  //Do nothing
}
rmMain.inst = new Array();
rmMain.rmCrCode = false;
rmMain.objCrCode = false;
rmMain.width = 640;
rmMain.height = 480;
rmMain.Create = function()
{
  rmMain.inst[0] = new Array();
  rmMain.inst[0][0] = objControl;
  rmMain.inst[0][1] = 0;
  rmMain.inst[0][2] = 0;
}
//rmDraw
function rmDraw(i)
{
  //Do nothing
}
rmDraw.inst = new Array();
rmDraw.rmCrCode = false;
rmDraw.objCrCode = false;
rmDraw.width = 640;
rmDraw.height = 480;
rmDraw.Create = function()
{
  rmDraw.inst[0] = new Array();
  rmDraw.inst[0][0] = objControl;
  rmDraw.inst[0][1] = 0;
  rmDraw.inst[0][2] = 0;
}