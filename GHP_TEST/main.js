/*
* Copyright (c) 2011-12 piluke <pikingqwerty@gmail.com>
* You can find the GitHub repository at https://github.com/piluke/GameMaker-HTML5-Player
* 
* This file is part of GameMaker HTML5 Player (GHP).
* GHP is free software and comes with ABSOLUTELY NO WARANTY.
* See LICENSE for more details.
*/

function gameStart()
{
  canvas.focus();
  for (var i=0;i<rooms.length;i++)
  {
    rooms[i].Create();
  }
  eventInstCrCode();
  eventCreate();
  eventGameStart();
  eventRoomCrCode();
  eventRoomStart(room);
  mainStep();
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
	eventAnimationEnd();
	eventCleanup();
	fnd = new Date();
	fnd = fnd.getSeconds();
	setTimeout(mainStep, 1000/fps);
}
window.onload = gameStart;
