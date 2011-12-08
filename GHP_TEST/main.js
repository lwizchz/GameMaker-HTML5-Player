//Copyright (c) 2011 piluke <pikingqwerty@gmail.com>
//You can find the GitHub repository at https://github.com/piluke/GameMaker-HTML5-Player

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