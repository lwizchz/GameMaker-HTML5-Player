//Copyright (c) 2011 piluke <pikingqwerty@gmail.com>
//You can find the GitHub repository at https://github.com/piluke/GameMaker-HTML5-Player

function eventGameStart()
{
  
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
  eventDraw();
}
function eventRoomEnd()
{

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
  objDraw();
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
}
function eventStepEnd()
{
  
}
function eventAlarm()
{
  
}
function eventKeyboard(key)
{
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
  if ((obj1 != undefined)&&(obj2 != undefined))
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
    
  }
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
  if (e != undefined)
  {
    //
  }
}
function eventMousePress(e)
{
  if (e != undefined)
  {
    objMouseP();
  }
}
function eventMouseRelease(e)
{
  if (e != undefined)
  {
    //Do links
	if (links.length > 0)
	{
	  for (var i=0;i<links.length;i++)
	  {
	    if ((mouseX >= links[i][1])&&(mouseY >= links[i][2])&&(mouseX <= links[i][1]+links[i][3])&&(mouseY <= links[i][2]+links[i][4]))
		{
		  eval(links[i][0]);
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
		if ((glin[i]["xprevious"] !== undefined)&&(glin[i]["yprevious"] !== undefined))
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
		}
	}
}