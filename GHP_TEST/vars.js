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
}spr_floor = new Image();
spr_floor.src = "sprites/spr_floor.png";
spr_pie = new Image();
spr_pie.src = "sprites/spr_pie.png";
spr_cursor = new Image();
spr_cursor.src = "sprites/spr_cursor.png";
spr_bitfont = new Image();
spr_bitfont.src = "sprites/spr_bitfont.png";

//Sounds
snd_click = new Audio();
snd_click.src = "sounds/snd_click.wav";
snd_click.load();

//Backgrounds
bck_main = new Image();
bck_main.src = "backgrounds/bck_main.png";
bck_fore = new Image();
bck_fore.src = "backgrounds/bck_fore.png";
//Fonts
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
function fontAddSprite(sprite, first, prop, sep)
{
	this.temp = new SpriteFont();
	temp.sprite = sprite;
	temp.start = first;
	temp.sep = sep;
	return temp;
}
function Font() //jimn346
{
	this.font = null;
	this.name = null;
	this.size = null;
	this.style = null;
}
function SpriteFont() //jimn346
{
	this.sprite = null;
	this.start = null;
	this.sep = null;
}fnt_main = fontAdd("Calibri", 8, false, false);
fnt_switch1 = fontAdd("Comic Sans MS", 16, true, true);
fnt_switch2 = fontAdd("Verdana", 16, false, true);
//Scripts
function draw_copyright()
{
	drawSetColor(c_black);
	drawSetFont(fnt_main);
	var str;	str = "Copyright (c) 2011-12 Pixel Matrix Studios, by piluke, see the commented license for more information.";	drawText( str, 0,  10);
	drawText( "FPS: "+string(fps), 600,  10);
	drawRectangle(0,  0,  string_width(str)+1,  string_height(str)+3,  true);
}
function font_switch()
{
	if (fnt_other = fnt_switch1)	{	    fnt_other = fnt_switch2;	}	else	{	    fnt_other = fnt_switch1;	}}

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
	obj_control.Draw();
}

function objStep(){}

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
	obj_control.Draw();
}

function objStep(){}
function objKeys(){}

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
	obj_control.Draw();
}

function objStep(){}
function objKeys(){}
function objKeyP(){}

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
	obj_control.Draw();
}

function objStep(){}
function objKeys(){}
function objKeyP(){}
function objKeyR(){}
//obj_control
obj_control = function()
{
	//Do nothing
}
obj_control.id = new Array();
obj_control.Create = function(i, x, y)
{
	obj_control.id[i] = new Array();
	obj_control.id[i]["x"] = x;
	obj_control.id[i]["y"] = y;
	obj_control.id[i]["startx"] = x;
	obj_control.id[i]["starty"] = y;
	surf = surface_create(64, 64);	surfaceSetTarget(surf);
	drawSetColor(c_red);
	drawCircle(32,  32,  16,  false);
	drawSetColor(c_blue);
	drawCircle(64,  64,  32,  true);
	surfaceResetTarget();
	windowSetCursor(spr_cursor);
	fnt_other = fnt_switch1;	fnt_bitmap = font_add_sprite(spr_bitfont, 33, false, -16);	ps1 = part_system_create();	partSystemAutomaticDraw(ps1,  false);
	partSystemAutomaticUpdate(ps1,  false);
	type1 = part_type_create();	partTypeShape(type1,  pt_shape_ring);
	partTypeSize(type1,  .25,  .5,  .03125,  0);
	partTypeOrientation(type1,  0,  360,  4,  0,  0);
	partTypeColor3(type1,  c_white,  c_white,  c_white);
	partTypeAlpha3(type1,  1,  .5,  0);
	partTypeBlend(type1,  false);
	partTypeLife(type1,  5,  10);
	partTypeSpeed(type1,  1,  2,  0,  0);
	partTypeDirection(type1,  0,  360,  0,  0);
	partTypeGravity(type1,  0,  0);
	em1 = part_emitter_create(ps1);	partEmitterRegion(ps1,  em1,  240,  248,  240,  248,  ps_shape_ellipse,  ps_distr_gaussian);
	partEmitterStream(ps1,  em1,  type1,  1);

}
obj_control.Draw = function()
{
		if (room = rm_main)	{	    draw_copyright();	    draw_set_color(c_black);	    draw_rectangle(50, 70, 300, 250, false);	    draw_rectangle(350, 70, 600, 250, false);	    draw_rectangle(50, 270, 300, 450, false);	    draw_rectangle(350, 270, 600, 450, false);	    addLink("room_goto", "rm_draw", 50, 70, 250, 180);	    draw_set_font(fnt_bitmap);	    draw_set_color(c_red);	    draw_text(100, 100, "Drawing");	    draw_set_color(c_orange);	    draw_text(400, 100, "Movement");	    draw_set_color(c_yellow);	    draw_text(100, 300, "Text#Embedding");	    draw_set_color(c_green);	    draw_text(400, 300, "Other");	}	else	{	    drawSetBackground(true, bck_main, c_gray);	    draw_copyright();	    draw_set_color(c_orange);	    draw_rectangle(30, 30, 50, 50, false);	    draw_set_color(c_blue);	    draw_circle(100, 40, 20, true);	    draw_sprite(spr_pie, 0, 5, 70);	    drawGradientRect(100, 70, mouse_x, mouse_y, 100, 70, 200, 170, c_green, c_yellow);	    drawGradientCircle(275, 100, mouse_x, mouse_y, 15, 275, 100, 50, c_blue, c_dkgray);	    draw_set_color(c_blue);	    draw_text(350, 100, "Radial gradients are actually cones.#They render differently in different browsers.");	    draw_set_font(fnt_other);	    drawText("Use fonts and ~a:font_switch();~links!~", 350, 300);	    draw_set_font(fnt_bitmap);	    draw_text(16, 176, "You can even use#sprite fonts!");	    drawSetBackground(false, bck_fore, c_black);	    draw_surface(surf, 12, 240);	    draw_set_font(fnt_main);	    draw_set_color(surface_getpixel(surf, 32, 32));	    draw_text(12, 312, "Surfaces can be#used too!");	    part_system_update(ps1);	    part_system_drawit(ps1);	}	if (room != rm_main)	{	    draw_set_color(c_black);	    draw_rectangle(500, 10, 550, 30, false);	    addLink("room_goto", "rm_main", 500, 10, 550, 30, false);	    draw_set_font(fnt_main);	    draw_set_color(c_white);	    draw_text(510, 25-string_height("Back")/2, "Back");	}
}

//obj_player
obj_player = function()
{
	//Do nothing
}
obj_player.id = new Array();
obj_player.Create = function(i, x, y)
{
	obj_player.id[i] = new Array();
	obj_player.id[i]["x"] = x;
	obj_player.id[i]["y"] = y;
	obj_player.id[i]["startx"] = x;
	obj_player.id[i]["starty"] = y;
}
obj_player.Draw = function()
{
	}

//obj_floor
obj_floor = function()
{
	//Do nothing
}
obj_floor.id = new Array();
obj_floor.Create = function(i, x, y)
{
	obj_floor.id[i] = new Array();
	obj_floor.id[i]["x"] = x;
	obj_floor.id[i]["y"] = y;
	obj_floor.id[i]["startx"] = x;
	obj_floor.id[i]["starty"] = y;
}
obj_floor.Draw = function()
{
	}

//Rooms
var rooms = new Array();
rooms[0] = rm_main;
function roomOpen(i)
{
	for (var e=0;e<rooms[i].inst.length;e++)
	{
	instanceCreate(rooms[i].inst[e][0], rooms[i].inst[e][1], rooms[i].inst[e][2]);
	}
	room_width = rooms[i].width;
	room_height = rooms[i].height;
}

//rm_main
function rm_main(i)
{
	//Do nothing
}
rm_main.inst = new Array();
rm_main.rmCrCode = function()
{

}
rm_main.objCrCode = function()
{
	with(100003)
	{
		
	}
}
rm_main.width = 640;
rm_main.height = 480;
rm_main.Create = function()
{
	rm_main.inst[0] = new Array();
	rm_main.inst[0][0] = obj_control;
	rm_main.inst[0][1] = 0;
	rm_main.inst[0][2] = 0;
}//rm_draw
function rm_draw(i)
{
	//Do nothing
}
rm_draw.inst = new Array();
rm_draw.rmCrCode = function()
{

}
rm_draw.objCrCode = function()
{
	with(100005)
	{
		
	}
}
rm_draw.width = 640;
rm_draw.height = 480;
rm_draw.Create = function()
{
	rm_draw.inst[0] = new Array();
	rm_draw.inst[0][0] = obj_control;
	rm_draw.inst[0][1] = 0;
	rm_draw.inst[0][2] = 0;
}//rm_other
function rm_other(i)
{
	//Do nothing
}
rm_other.inst = new Array();
rm_other.rmCrCode = function()
{

}
rm_other.objCrCode = function()
{
	with(100006)
	{
		
	}
}
rm_other.width = 640;
rm_other.height = 480;
rm_other.Create = function()
{
	rm_other.inst[0] = new Array();
	rm_other.inst[0][0] = obj_control;
	rm_other.inst[0][1] = 0;
	rm_other.inst[0][2] = 0;
}