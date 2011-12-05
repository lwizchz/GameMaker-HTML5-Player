//Copyright (c) 2011 Pixel Matrix Studios
//By piluke
//This is Open Source Copyleft code.
//Use it however you like, but this and all later versions must:
//  -remain Open Source
//  -remain free
//  -contain this license in all documents
//  -remain unobfuscated except for the code within object events,
//    scripts, and room creation codes
//  -give credit to the correct programmers
//You can find the GitHub repository at https://github.com/piluke/GameMaker-HTML5-Player
//Have fun.

function gameStart()
{
  for (var i=0;i<rooms.length;i++)
  {
    rooms[i].Create();
  }
  eventInstCrCode();
  eventCreate();
  eventGameStart();
  eventRoomCrCode();
  eventRoomStart(room);
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
setInterval("mainStep();", 1000/fps);