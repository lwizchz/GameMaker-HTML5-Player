//Copyright (c) 2011 Pixel Matrix Studios
//By piluke
//This is Open Source Copyleft code.
//Use it however you like, but this and all later versions must:
//  -remain Open Source
//  -remain free
//  -contain this license in all documents
//  -remain unobfuscated except specific sprites, sounds, backgrounds
//    paths, GML scripts, fonts, time lines, objects, or rooms
//  -give credit to the correct programmers
//You can find the GitHub repository at https://github.com/piluke/GameMaker-HTML5-Player
//Have fun.

var canvas = document.getElementById("maincan");
var context = canvas.getContext("2d");
var keymap = new Array();

//Constants and globals
var mouseX, mouseY;
mouseX = 0;
mouseY = 0;

var fps, cfps, tfps;
fps = 60;
cfps = 0;
tfps = fps;

var room, room_width, room_height;
room = 0;
room_width = 640;
room_height = 480;

var foreground = new Array();
var keys = new Array();
var pkey = new Array();
var cursor = new Image();

//Colors
var cAqua, cBlack, cBlue, cDkgray, cFuchsia, cGray, cGreen, cLime, cLtgray, cMaroon, cNavy, cOlive;
var cOrange, cPurple, cRed, cSilver, cTeal, cWhite, cYellow;
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
var vkNokey, vkAnykey, vkLeft, vkRight, vkUp, vkDown, vkEnter, vkEscape, vkSpace, vkShift;
var vkControl, vkAlt, vkBackspace, vkTab, vkHome, vkEnd, vkDelete, vkInsert, vkPageup, vkPagedown;
var vkPause, vkPrintscreen, vkF1, vkF2, vkF3, vkF4, vkF5, vkF6, vkF7, vkF8, vkF9, vkF10, vkF11, vkF12;
var vkNumpad0, vkNumpad1, vkNumpad2, vkNumpad3, vkNumpad4, vkNumpad5, vkNumpad6, vkNumpad7, vkNumpad8, vkNumpad9;
var vkMultiply, vkDivide, vkAdd, vkSubtract, vkDecimal;
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

//Sprites
sprCursor = new Image();
sprCursor.src = "sprites/sprCursor.png";
sprPie = new Image();
sprPie.src = "sprites/sprPie.png";
sprPlayer = new Image();
sprPlayer.src = "sprites/sprPlayer.png";
sprPlayer.siwidth = 32;
sprFloor = new Image();
sprFloor.src = "sprites/sprFloor.png";

//Sounds
sndClick = new Audio();
sndClick.src = "sounds/sndClick.wav";
sndClick.load();

//Backgrounds
bckMain = new Image();
bckMain.src = "backgrounds/bckMain.png";
bckFore = new Image();
bckFore.src = "backgrounds/bckFore.png";

//Objects
function instanceCreate(inst, x, y)
{
  var i = inst.id.length;
  inst.id[i] = new inst(i, x, y);
  inst.Create(i, x, y);
  return i;
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
  objControl.id[i]["x"] = x;
  objControl.id[i]["y"] = y;
  objControl.id[i]["sprite"] = 0;
  objControl.id[i]["width"] = 0;
  objControl.id[i]["height"] = 0;
  drawSetCursor(sprCursor);
}
objControl.Draw = function()
{
  drawSetBackground(true, bckMain, "#999999");
  drawSetColor(cBlack);
  drawText("Copyright (c) 2011 Pixel Matrix Studios, by piluke, see the commented license for more information.", 0, 10);
  drawText("FPS: "+tfps, 600, 10);
  drawRect(0, 0, 470, 12, false);
  drawSetColor(cGray);
  drawRect(30, 30, 50, 50, true);
  drawSetColor(cBlue);
  drawCircle(100, 40, 20, false);
  drawSprite(sprPie, 5, 70);
  drawSetGradient(true, 100, 70, mouseX, mouseY, cGreen, cYellow);
  drawRect(100, 70, 200, 170, true);
  drawSetGradient(false, 275, 100, mouseX, mouseY, cBlue, cDkgray, 15, 50);
  drawCircle(275, 100, 50, true);
  drawSetColor(cBlue);
  drawText("Radial gradients are actually cones.\#They render differently in different browsers.", 350, 100);
  drawSetBackground(false, bckFore, cBlack);
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
	if ((keys[vkLeft] == 1)&&(placeFree(objPlayer.id[e], objPlayer.id[e]["x"]-1, objPlayer.id[e]["y"]) == 1))
    {
      objPlayer.id[e]["x"] -= 1;
      objPlayer.id[e]["face"] = -1;
    }
    if ((keys[vkRight] == 1)&&(placeFree(objPlayer.id[e], objPlayer.id[e]["x"]+1, objPlayer.id[e]["y"]) == 1))
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
	  objPlayer.id[e]["y"] -= 25;
    }
	if (keys[ord("R")] == 1)
	{
	  objPlayer.id[e]["x"] = objPlayer.id[e]["startx"];
	  objPlayer.id[e]["y"] = objPlayer.id[e]["starty"];
      objPlayer.id[e]["face"] = 1;
	}
  }
}
objPlayer.Step = function()
{
  for (var i=0;i<objPlayer.id.length;i++)
  {
    //Gravity
    if (placeFree(objPlayer.id[i], objPlayer.id[i]["x"], objPlayer.id[i]["y"]+1) == 1)
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
	  drawSpriteExt(objPlayer.id[i]["sprite"], objPlayer.id[i]["x"] + objPlayer.id[i]["sprite"]["siwidth"], objPlayer.id[i]["y"], objPlayer.subimg, -1, 1, 0, cWhite, 1);
	}
	else if (keys[vkRight])
	{
	  drawSpriteExt(objPlayer.id[i]["sprite"], objPlayer.id[i]["x"], objPlayer.id[i]["y"], objPlayer.subimg, 1, 1, 0, cWhite, 1);
	}
	else
	{
	  drawSpriteExt(objPlayer.id[i]["sprite"], objPlayer.id[i]["x"], objPlayer.id[i]["y"], 0, 1, 1, 0, cWhite, 1);
	}
    drawText("Move and click the mouse!#Move around with the arrow keys!#Press \"R\" to reset.", 100, 250);
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
    drawSprite(objFloor.id[i]["sprite"], objFloor.id[i]["x"], objFloor.id[i]["y"]);
  }
}

//Rooms
var rooms = new Array();
rooms[0] = rmMain;
function roomOpen(i)
{
  for (var e=0;e<rooms[i].inst.length;e++)
  {
    instanceCreate(rooms[i].inst[e][0], rooms[i].inst[e][1], rooms[i].inst[e][2]);
  }
  room_width = rooms[i].width;
  room_height = rooms[i].height;
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
}