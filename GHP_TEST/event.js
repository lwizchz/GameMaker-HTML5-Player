/*
* Copyright (c) 2011-12 piluke <pikingqwerty@gmail.com>
* Copyright (c) 2011-12 jimn346 <jds9496@gmail.com>
* You can find the GitHub repository at https://github.com/piluke/GameMaker-HTML5-Player
* 
* This file is part of GameMaker HTML5 Player (GHP).
* GHP is free software and comes with ABSOLUTELY NO WARANTY.
* See LICENSE for more details.
*/
function eventGameStart()
{
	canvas.style.background = cLtgray;
}
function eventGameEnd()
{
  eventRoomEnd();
}
function eventRoomStart(i)
{
  roomOpen(i);
}
function eventRoomChange()
{
  eventRoomEnd();
  eventInstCrCode();
  eventCreate();
  eventRoomCrCode();
  eventRoomStart();
  //eventDraw();
}
function eventRoomEnd()
{
	for (var i=0;i<rooms[room].inst.length;i++)
	{
		if (rooms[room].inst[i][0].id.length > 0)
		{
			rooms[room].inst[i][0].id.length = instanceDestroy();
		}
		delete rooms[room].inst[i];
	}
	glin.length = null;
	delete glin;
}
function eventInstCrCode()
{
  
}
function eventRoomCrCode()
{
  
}
function eventCreate()
{
  
}
function eventDraw()
{
  clearDraw();
  requestAnimFrame();
  objDraw();
  
  //Draw particle systems.
  if (systems.length > 0)
  {
	systems.sort(sortDepth);
	for (var g = 0; g < systems.length; g++)
		if (systems[g].autoDraw)
			partSystemDrawit(systems[g]);
  }
  drawForegrounds();
  drawLinks();
  drawCursor();
}
function eventStepBegin()
{
  
}
function eventStep()
{
  for (var i=0;i<glin.length;i++)
  {
	if ((glin[i]["gravity"] !== undefined)&&(glin[i]["gravity_direction"] !== undefined))
	{
		motionAdd(glin[i]["glin"], glin[i]["gravity_direction"], glin[i]["gravity"]);
	}
	if ((isDefined(glin[i]["speed"]))&&(isDefined(glin[i]["direction"])))
	{
		rayPoint(glin[i]["glin"], glin[i]["direction"], glin[i]["speed"]);
	}
  }
  objStep();
  
  //Update particle systems.
  if (systems.length > 0)
	for (var g = 0; g < systems.length; g++)
		if (systems[g].autoUpdate)
			partSystemUpdate(systems[g]);
}
function eventStepEnd()
{
  
}
function eventAlarm()
{
  
}
function eventKeyboard(key)
{
  if (document.activeElement != canvas)
  {
	return;
  }
  if (key != undefined)
  {
    if (key in keys)
    {
      return keys[key];
    }
    else
    {
      return 0;
    }
  }
  else //Called as event, not function
  {
    for (var i=0;i<125;i++)
	{
	  if (keys[i] == 1)
	  {
	    objKeys(i);
	  }
	}
  }
}
function eventKeyboardPress(e)
{
  if (document.activeElement != canvas)
  {
	return;
  }
  if (e != undefined)
  {
    //Any key
	keys[e.keyCode] = 1;
  }
  else
  {
    //No key
  }
  for (var i=0;i<125;i++)
  {
    if (pkey[i] != keys[i])
	{
	  objKeyP(i);
	  pkey[i] = keys[i];
	}
  }
}
function eventKeyboardRelease(e)
{
  if (document.activeElement != canvas)
  {
	return;
  }
  if (e != undefined)
  {
    //Any key
	keys[e.keyCode] = 0;
  }
  else
  {
    //No key
  }
  for (var i=0;i<125;i++)
  {
    if (pkey[i] != keys[i])
	{
	  //Call KeyboardReleases
	  pkey[i] = keys[i];
	}
  }
}
function eventPathEnd()
{
  
}
function eventOutsideRoom()
{
  
}
function eventIntersectBoundary()
{
  
}
function eventCollision(obj1, obj2)
{
  /*if ((obj1 != undefined)&&(obj2 != undefined))
  {
    x1 = obj1["x"];
	y1 = obj1["y"];
	width1 = obj1["width"];
	height1 = obj1["height"];
	if ((width1 == undefined)||(width1 == 0)||(height1 ==  undefined)||(height1 == 0))
	{
	  return false;
	}
	for (var i=0;i<obj2.id.length;i++)
	{
	  x2 = obj2.id[i]["x"];
	  y2 = obj2.id[i]["y"];
	  width2 = obj2.id[i]["width"];
	  height2 = obj2.id[i]["height"];
	  if ((x2 >= x1)&&(x2 <= x1+width1)&&(y2 >= y1)&&(y2 <= y1+height1))
      {
		return true;
	  }
	  else if ((x2+width2 >= x1)&&(x2+width2 <= x1+width1)&&(y2+height2 >= y1)&&(y2+height2 <= y1+height1))
	  {
	    return true;
	  }
	  //else if ((x2)&&())
	  {
	    //return true;
	  }
	}
	return false;
  }
  else //Called as event, not function
  {
    
  }*/
}
function eventAnimationEnd()
{
  
}
function eventUserDefined(define)
{
  
}
function eventNoHealth()
{
  
}
function eventNoLives()
{
  
}
function eventDestroy()
{
  
}
function eventMouse(e)
{
  if (document.activeElement != canvas)
  {
	return;
  }
  if (e != undefined)
  {
    //
  }
}
function eventMousePress(e)
{
  if (document.activeElement != canvas)
  {
	return;
  }
  if (e != undefined)
  {
    objMouseP();
  }
}
function eventMouseRelease(e)
{
	if (document.activeElement != canvas)
	{
		return;
	}
	if (e != undefined)
	{
		//Do links
		if (links.length > 0)
		{
			for (var i=0;i<links.length;i++)
			{
				if ((mouseX >= links[i][2])&&(mouseY >= links[i][3])&&(mouseX <= links[i][2]+links[i][4])&&(mouseY <= links[i][3]+links[i][5]))
				{
					if (links[i][1] !== undefined)
					{
						links[i][0](links[i][1]);
					}
					else
					{
						eval(links[i][0]);
					}
				}
			}
		}
	}
}
function eventMouseMove(e)
{
  if (e != undefined)
  {
	mouseX = e.pageX-canvas.offsetLeft;
	mouseY = e.pageY-canvas.offsetTop;
  }
}
function eventCleanup()
{
	for (var i=0;i<glin.length;i++)
	{
		/*if ((glin[i]["xprevious"] !== undefined)&&(glin[i]["yprevious"] !== undefined))
		{
			glin[i]["direction"] = pointDirection(glin[i]["x"], glin[i]["y"], glin[i]["xprevious"], glin[i]["yprevious"]);
			glin[i]["speed"] = pointDistance(glin[i]["x"], glin[i]["y"], glin[i]["xprevious"], glin[i]["yprevious"]);
			glin[i]["hspeed"] = lengthdirX(glin[i]["speed"], glin[i]["direction"]);
			glin[i]["vspeed"] = lengthdirY(glin[i]["speed"], glin[i]["direction"]);
			glin[i]["xprevious"] = glin[i]["x"];
			glin[i]["yprevious"] = glin[i]["y"];
		}
		else //Fix
		{
			glin[i]["xprevious"] = glin[i]["x"];
			glin[i]["yprevious"] = glin[i]["y"];
		}
		if ((glin[i]["friction"] !== undefined)&&(glin[i]["speed"] !== undefined))
		{
			glin[i]["speed"] -= glin[i]["friction"];
		}*/
	}
}
