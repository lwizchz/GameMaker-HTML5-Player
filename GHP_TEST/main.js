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

function gameStart()
{
  preImg = new Image();
  imgUrl = new Array();
  imgUrl[0] = "sprites/sprPie.png";
  imgUrl[1] = "sprites/sprCursor.png";
  imgUrl[2] = "backgrounds/bckMain.png";
  imgUrl[3] = "backgrounds/bckFore.png";
  for (var i=0;i<imgUrl.length;i++)
  {
    preImg.src = imgUrl[i];
  }
  eventInstCrCode();
  eventCreate();
  eventGameStart();
  eventRoomCrCode();
  eventRoomStart();
  eventDraw();
}
function mainStep()
{
  if (cfps == fps)
  {
    tfps = cfps;
    cfps = 0;
    return 0;
  }
  cfps += 1;
  eventStepBegin();
  eventAlarm();
  eventKeyboard();
  eventMouse();
  eventKeyboardPress();
  eventMousePress();
  eventKeyboardRelease();
  eventMouseRelease();
  eventStep();
  eventPathEnd();
  eventOutsideRoom();
  eventIntersectBoundary();
  eventCollision();
  eventStepEnd();
  eventDraw();
  eventAnimationEnd();
}
function stepInit()
{
  cfps = 0;
  for (i=0;i<fps;i++)
  {
    setTimeout("mainStep()", i);
  }
}
setInterval("mainStep()", 1000/fps);