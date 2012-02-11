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

glin = new Array();
dolo = new Array();
dldone = false;

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

//Sprites
sprCursor = new Image();
sprCursor.src = "sprites/sprCursor.png";
sprCursor.dolo = dolo.length;
dolo[dolo.length] = false;
sprCursor.onload = function(){dolo[sprCursor.dolo] = true};
sprPie = new Image();
sprPie.src = "sprites/sprPie.png";
sprPie.dolo = dolo.length;
dolo[dolo.length] = false;
sprPie.onload = function(){dolo[sprPie.dolo] = true};
sprPlayer = new Image();
sprPlayer.src = "sprites/sprPlayer.png";
sprPlayer.dolo = dolo.length;
dolo[dolo.length] = false;
sprPlayer.onload = function(){dolo[sprPlayer.dolo] = true};
sprPlayer.siwidth = 32;
sprPlayer.colors = new Array();
sprFloor = new Image();
sprFloor.src = "sprites/sprFloor.png";
sprFloor.dolo = dolo.length;
dolo[dolo.length] = false;
sprFloor.onload = function(){dolo[sprFloor.dolo] = true};
sprBitFont = new Image();
sprBitFont.src = "sprites/sprBitFont.png";
sprBitFont.dolo = dolo.length;
dolo[dolo.length] = false;
sprBitFont.onload = function(){dolo[sprBitFont.dolo] = true};
sprBitFont.siwidth = 32;

//Sounds
sndClick = new Audio();
sndClick.src = "sounds/sndClick.wav";
sndClick.load();

//Backgrounds
bckMain = new Image();
bckMain.src = "backgrounds/bckMain.png";
bckMain.dolo = dolo.length;
dolo[dolo.length] = false;
bckMain.onload = function(){dolo[bckMain.dolo] = true};
bckFore = new Image();
bckFore.src = "backgrounds/bckFore.png";
bckFore.dolo = dolo.length;
dolo[dolo.length] = false;
bckFore.onload = function(){dolo[bckFore.dolo] = true};

//Fonts
fntMain = fontAdd("Calibri", 8, false, false);
fntSwitch1 = fontAdd("Comic Sans MS", 16, true, true);
fntSwitch2 = fontAdd("Verdana", 16, false, true);
fntOther = fntSwitch1;
fntBitmap = fontAddSprite(sprBitFont, 33, false, -16);

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
  drawCircle(32, 32, 16, 1);
  drawSetColor(cBlue);
  drawCircle(64, 64, 32, 0);
  surfaceResetTarget();
  drawSetCursor(sprCursor);
}
objControl.MousePress = function(i)
{
	for (var e=0;e<objControl.id.length;e++)
	{
		soundPlay(sndClick);
	}
}
objControl.Draw = function()
{
	for (var i=0;i<objControl.id.length;i++)
	{
		drawSetBackground(true, bckMain, cGray);
		drawSetColor(cBlack);
		drawSetFont(fntMain);
		var str = "Copyright (c) 2011-12 Pixel Matrix Studios, by piluke, see the commented license for more information.";
		drawText(str, 0, 10);
		drawText("FPS: "+tfps, 600, 10);
		drawRect(0, 0, stringWidth(str)+1, stringHeight(str)+3, false);
		drawSetColor(cOrange);
		drawRect(30, 30, 50, 50, true);
		drawSetColor(cBlue);
		drawCircle(100, 40, 20, false);
		drawSprite(sprPie, 5, 70, 0);
		drawSetGradient(true, 100, 70, mouseX, mouseY, cGreen, cYellow);
		drawRect(100, 70, 200, 170, true);
		drawSetGradient(false, 275, 100, mouseX, mouseY, cBlue, cDkgray, 15, 50);
		drawCircle(275, 100, 50, true);
		drawSetColor(cBlue);
		drawText("Radial gradients are actually cones.~#They render differently in different browsers.", 350, 100);
		drawSetFont(fntOther);
		drawText("Use fonts and ~a:fntOther=(fntOther==fntSwitch1)?fntSwitch2:fntSwitch1~links!~", 350, 300);
		drawSetFont(fntBitmap);
		drawText("You can even use~#sprite fonts!", 16, 176);
		drawSetBackground(false, bckFore, cBlack);
		drawSurface(objControl.id[0]["surf"], 12, 240);
		drawSetFont(fntMain);
		drawSetColor(surfaceGetPixel(objControl.id[0]["surf"], 32, 32));
		drawText("Surfaces can be~#used too!", 12, 312);
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
  for (var e=0;e<rooms[i].inst.length;e++)
  {
    instanceCreate(rooms[i].inst[e][0], rooms[i].inst[e][1], rooms[i].inst[e][2]);
  }
  roomWidth = rooms[i].width;
  roomHeight = rooms[i].height;
  canvas.width = roomWidth;
  canvas.height = roomHeight;
  room = i;
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
  rmMain.inst[1] = new Array();
  rmMain.inst[1][0] = objPlayer;
  rmMain.inst[1][1] = 100;
  rmMain.inst[1][2] = 250;
  rmMain.inst[2] = new Array();
  rmMain.inst[2][0] = objFloor;
  rmMain.inst[2][1] = 100;
  rmMain.inst[2][2] = 350;
  rmMain.inst[3] = new Array();
  rmMain.inst[3][0] = objFloor;
  rmMain.inst[3][1] = 132;
  rmMain.inst[3][2] = 350;
  rmMain.inst[4] = new Array();
  rmMain.inst[4][0] = objFloor;
  rmMain.inst[4][1] = 164;
  rmMain.inst[4][2] = 350;
  rmMain.inst[5] = new Array();
  rmMain.inst[5][0] = objFloor;
  rmMain.inst[5][1] = 196;
  rmMain.inst[5][2] = 350;
  rmMain.inst[6] = new Array();
  rmMain.inst[6][0] = objFloor;
  rmMain.inst[6][1] = 228;
  rmMain.inst[6][2] = 350;
  rmMain.inst[7] = new Array();
  rmMain.inst[7][0] = objFloor;
  rmMain.inst[7][1] = 260;
  rmMain.inst[7][2] = 318;
  rmMain.inst[8] = new Array();
  rmMain.inst[8][0] = objFloor;
  rmMain.inst[8][1] = 292;
  rmMain.inst[8][2] = 350;
}
//rmDraw
function rmDraw(i)
{
  //Do nothing
}
rmDraw.inst = new Array();
rmDraw.rmCrCode = false;
rmDraw.objCrCode = false;
rmDraw.width = 700;
rmDraw.height = 500;
rmDraw.Create = function()
{
  rmDraw.inst[0] = new Array();
  rmDraw.inst[0][0] = objControl;
  rmDraw.inst[0][1] = 0;
  rmDraw.inst[0][2] = 0;
}