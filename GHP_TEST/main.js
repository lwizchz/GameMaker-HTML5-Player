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
  if (fnd != fod)
  {
    tfps = cfps+1;
    cfps = 0;
	fod = fnd;
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
  eventCleanup();
  fnd = new Date();
  fnd = fnd.getSeconds();
}
if (ie)
{
	setInterval("mainStep()", 10);
}
else
{
	setInterval("mainStep();", 1000/fps);
}