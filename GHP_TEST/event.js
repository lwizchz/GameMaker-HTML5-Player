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
  objControl.Draw();
  objPlayer.Draw();
  objFloor.Draw();
  drawForegrounds();
  drawCursor();
}
function eventStepBegin()
{
  
}
function eventStep()
{
  objPlayer.Step();
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
	    objPlayer.Keyboard(i);
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
	  objPlayer.KeyboardPress(i);
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
	if ((typeof width1 == undefined)||(width1 == 0)||(typeof height1 ==  undefined)||(height1 == 0))
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
    click = "#0000FF";
  }
}
function eventMousePress(e)
{
  if (e != undefined)
  {
    soundPlay(sndClick);
  }
}
function eventMouseRelease(e)
{
  if (e != undefined)
  {
    click = "#0000FF";
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