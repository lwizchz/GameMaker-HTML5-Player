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

///////////////////
//Drawing functions
///////////////////
function drawLine(x1, y1, x2, y2)
{
  x1-=0.5;
  y1-=0.5;
  x2-=0.5;
  y2-=0.5;
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
}
function drawRect(x1, y1, x2, y2, fill)
{
  if (fill == true)
  {
	context.fillRect(x1, y1, x2-x1, y2-y1);
  }
  else
  {
    drawLine(x1, y1, x2, y1);
	drawLine(x1, y1, x1, y2);
	drawLine(x2, y1, x2, y2);
	drawLine(x1, y2, x2, y2);
  }
}
function drawSetColor(color)
{
  context.strokeStyle = color;
  context.fillStyle = color;
}
function drawText(text, x, y)
{
  if (text.indexOf("#") != -1)
  {
    //Needs fixing
    if (text.indexOf("\\") != -1)
	{
	  if (text.indexOf("\\") == text.indexOf("#")-1)
	  {
	    text1 = text.substr(0, text.indexOf("\\"));
		text2 = text.substr(0, text.indexOf("\\")+1);
		text1.concat(text2);
		context.fillText(text, x, y);
	  }
	  else
	  {
	    text1 = text.substr(0, text.indexOf("#"));
	    text2 = text.substr(text.indexOf("#")+1, text.length);
	    drawText(text1, x, y);
	    drawText(text2, x, y+10);
	  }
	}
	else
	{
	  text1 = text.substr(0, text.indexOf("#"));
	  text2 = text.substr(text.indexOf("#")+1, text.length);
	  drawText(text1, x, y);
	  drawText(text2, x, y+10);
	}
  }
  else
  {
    context.fillText(text, x, y);
  }
}
function drawSetGradient(linear, x1, y1, x2, y2, col1, col2, r1, r2)
{
  var gradient;
  
  if (linear == true)
  {
	gradient = context.createLinearGradient(x1, y1, x2, y2);
  }
  else
  {
    gradient = context.createRadialGradient(x1, y1, r1, x2, y2, r2);
  }
  gradient.addColorStop(0, col1);
  gradient.addColorStop(1, col2);
  context.fillStyle = gradient;
}
function drawSprite(sprite, x, y)
{
  context.drawImage(sprite, x, y);
}
function drawCircle(x, y, r, fill)
{
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI*2, fill);
  context.stroke();
  if (fill == true)
  {
    context.fill();
  }
}
function clearDraw()
{
  canvas.width = canvas.width;
}
function drawSetBackground(isback, back_name, fill)
{
  var back = new Image();
  back.src = "backgrounds/"+back_name+".png";
  if (isback == true)
  {
    drawSetColor(fill);
	drawRect(0, 0, canvas.width, canvas.height, true);
	context.drawImage(back, 0, 0);
  }
  else
  {
    foreground[foreground.length] = back;
  }
}
function drawForegrounds()
{
  for (var i=0;i<foreground.length;i++)
  {
    context.drawImage(foreground[i], 0, 0);
  }
  foreground.length = 0;
}
function drawSetCursor(cur)
{
  cursor.src = cur.src;
}
function drawCursor()
{
  context.drawImage(cursor, mouseX, mouseY);
}
////////////////
//Math Functions
////////////////
function radToDeg(x)
{
  return x*180/Math.PI;
}
function degToRad(x)
{
  return x*Math.PI/180;
}
function sin(x)
{
  return Math.sin(x);
}
function cos(x)
{
  return Math.cos(x);
}
function tan(x)
{
  return Math.tan(x);
}
function arcsin(x)
{
  return Math.asin(x);
}
function arccos(x)
{
  return Math.acos(x);
}
function arctan(x)
{
  return Math.atan(x);
}
function arctan2(x, y)
{
  return Math.atan2(x, y);
}
function abs(x)
{
  return Math.abs(x);
}
function round(x)
{
  return Math.round(x);
}
function ceil(x)
{
  return Math.ceil(x);
}
function floor(x)
{
  return Math.floor(x);
}
function min(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16)
{
  var ary = [x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16];
  ary.sort
  (
    function (a, b)
	{
	  return a-b;
	}
  );
  return ary[0];
}
function max(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16)
{
  var ary = [x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16];
  ary.sort
  (
    function (a, b)
	{
	  return a-b;
	}
  )
  var i = 15;
  while(ary[i] == null)
  {
    i--;
  }
  return ary[i];
}
function random(x)
{
  return Math.random()*x;
}
function randomRange(x1, x2)
{
  return (Math.random()*(max(x1, x2)-min(x1, x2)))+min(x1, x2);
}
function irandom(x)
{
  return round(random(x));
}
function irandomRange(x)
{
  return round(randomRange(x));
}
function power(x, n)
{
  return Math.pow(x, n);
}
function exp(x)
{
  return Math.exp(x);
}
function logn(x, n)
{
  return Math.logN(x, n);
}
function log(x)
{
  return logn(x, Math.E);
}
function log2(x)
{
  return logn(x, 2);
}
function log10(x)
{
  return logn(x, 10);
}
function mean(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16)
{
  var ary = [x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16];
  ary.sort
  (
    function (a, b)
	{
	  return a-b;
	}
  );
  var i = 0;
  var avg = 0;
  while(ary[i] != null)
  {
    avg += ary[i];
	i++;
  }
  avg /= i;
  return avg;
}
function median(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16)
{
  var ary = [x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16];
  ary.sort
  (
    function (a, b)
	{
	  return a-b;
	}
  );
  var mid = Math.floor(ary.length/2);
  if ((ary.length % 2) == 1)
  {
    return ary[mid];
  }
  else
  {
    return (ary[mid - 1] + ary[mid]) / 2;
  }
}
function sqr(x)
{
  return x*x;
}
function sqrt(x)
{
  return Math.sqrt(x);
}
function pointDistance(x1, y1, x2, y2)
{
  return sqrt(sqr(x1-y1)+sqr(x2-y2));
}
function pointDirection(x1, y1, x2, y2)
{
  return radToDeg(arctan2(y1-y2, x1-x2));
}
//////////////////
//String Functions
//////////////////
function chr(x, y)
{
  if (y == null)
  {
    return x.fromCharCode(x);
  }
  else
  {
    return x.fromCharCode(y);
  }
}
function ord(x, y)
{
  x = stringUpper(x);
  if (y == null)
  {
    return x.charCodeAt(0);
  }
  else
  {
    return x.charCodeAt(y);
  }
}
function stringLength(str)
{
  return str.length;
}
function stringLower(str)
{
  return str.toLowerCase();
}
function stringUpper(str)
{
  return str.toUpperCase();
}
function stringCharAt(str, ind)
{
  return str.charAt(ind);
}
function stringPos(sub, str)
{
  var res = str.indexOf(sub);
  if (res == -1)
  {
    return 0;
  }
  else
  {
    return res;
  }
}
function stringCopy(str, ind, len)
{
  return str.substr(ind, len);
}
function stringDelete(str, ind, len)
{
  var part1, part2;
  part1 = str.substr(0, ind);
  part2 = str.substr(ind+len);
  return part1.concat(part2);
}
function stringInsert(sub, str, ind)
{
  var part1, part2;
  part1 = str.substr(0, ind);
  part2 = str.substr(ind);
  return part1.concat(sub, part2);
}
function stringReplace(str, sub, newstr)
{
  var pos = str.indexOf(sub);
  if (pos != -1)
  {
    var part1, part2;
	part1 = str.substr(0, pos);
	part2 = str.substr(pos+sub.length);
	return part1.concat(newstr, part2);
  }
  else
  {
    return str;
  }
}
function stringReplaceAll(str, sub, newstr)
{
  for (var start = 0; start <= str.length; start++)
  {
    var pos = str.indexOf(sub, start);
    if (pos != -1)
    {
      var part1, part2;
   	  part1 = str.substr(0, pos);
  	  part2 = str.substr(pos+sub.length);
	  str = part1.concat(newstr, part2);
	  start = str.indexOf(part2);
    }
    else
    {
      return str;
    }
  }
  return part1;
}
function stringCount(sub, str)
{
  var numb = 0;
  for (var start = 0; start <= str.length; start++)
  {
    var pos = str.indexOf(sub, start);
    if (pos != -1)
    {
      str = str.substr(pos);
	  numb++;
    }
    else
    {
      return numb;
    }
  }
  return numb;
}
function stringRepeat(str, numb)
{
  var newstr = "";
  while (numb > 0)
  {
    newstr = newstr.concat(str);
	numb--;
  }
  return newstr;
}
function stringLetters(str)
{
  return str.replace(/[^a-zA-Z]+/g, "");
}
function stringDigits(str)
{
  return str.replace(/[^0-9]+/g, "");
}
function stringLettersDigits(str)
{
  return str.replace(/[^a-zA-Z 0-9]+/g, "");
}
////////////////
//Time Functions
////////////////

////////////////////////
//General Game Functions
////////////////////////
function variableGlobalExists(a)
{
  if (a == null)
  {
    return false
  }
  else
  {
    return true
  }
}
function variableGlobalGet(a)
{
  return a;
}
function variableGlobalArrayGet(a, i)
{
  return a[i];
}
function variableGlobalArray2Get(a, i1, i2)
{
  return a[i1, i2];
}
function variableGlobalSet(a, val)
{
  a = val;
}
function variableGlobalArraySet(a, i, val)
{
  a[i] = val;
}
function variableGlobalArray2Set(a, i1, i2, val)
{
  a[i1, i2] = val;
}
function variableLocalExists(a)
{
  if (self.a == null)
  {
    return false;
  }
  else
  {
    return true;
  }
}
function variableLocalGet(a)
{
  return self.a;
}
function variableLocalArrayGet(a, i)
{
  return self.a[i];
}
function variableLocalArray2Get(a, i1, i2)
{
  return self.a[i1, i2];
}
function variableLocalSet(a, val)
{
  self.a = val;
}
function variableLocalArraySet(a, i, val)
{
  self.a[i] = val;
}
function variableLocalArray2Set(a, i1, i2, val)
{
  self.a[i1, i2] = val;
}
function setApplicationTitle(t)
{
  document.title = t;
}
/////////////////
//Sound functions
/////////////////
function soundPlay(snd)
{
  var sound = new Audio();
  sound.src = snd.src;
  sound.load();
  sound.play();
}
////////////////////
//Instance functions
////////////////////

////////////////////
//Movement Functions
////////////////////
function placeFree(obj, x, y)
{
  name = obj["name"];
  width = obj["width"]-1;
  height = obj["height"]-1;
  if (name != "objControl")
  {
    for (var i=0;i<objControl.id.length;i++)
    {
      if ((x >= objControl.id[i]["x"])&&(y >= objControl.id[i]["y"])&&(x <= objControl.id[i]["x"]+objControl.id[i]["width"])&&(y <= objControl.id[i]["y"]+objControl.id[i]["height"]))
  	  {
	    return false;
	  }
      else if ((x <= objControl.id[i]["x"])&&(x+width >= objControl.id[i]["x"])&&(((y <= objControl.id[i]["y"])&&(y+height >= objControl.id[i]["y"]))||((y >= objControl.id[i]["y"])&&(y <= objControl.id[i]["y"]+objControl.id[i]["height"]))))
      {
        return false;
      }
      else if ((x >= objControl.id[i]["x"])&&(y <= objControl.id[i]["y"])&&(x <= objControl.id[i]["x"]+objControl.id[i]["width"])&&(y+height >= objControl.id[i]["y"]))
      {
        return false;
      }
    }
  }
  if (name != "objPlayer")
  {
    for (var i=0;i<objPlayer.id.length;i++)
    {
      if ((x >= objPlayer.id[i]["x"])&&(y >= objPlayer.id[i]["y"])&&(x <= objPlayer.id[i]["x"]+objPlayer.id[i]["width"])&&(y <= objPlayer.id[i]["y"]+objPlayer.id[i]["height"]))
   	  {
	    return false;
	  }
      else if ((x <= objPlayer.id[i]["x"])&&(x+width >= objPlayer.id[i]["x"])&&(((y <= objPlayer.id[i]["y"])&&(y+height >= objPlayer.id[i]["y"]))||((y >= objPlayer.id[i]["y"])&&(y <= objPlayer.id[i]["y"]+objPlayer.id[i]["height"]))))
      {
        return false;
      }
      else if ((x >= objPlayer.id[i]["x"])&&(y <= objPlayer.id[i]["y"])&&(x <= objPlayer.id[i]["x"]+objPlayer.id[i]["width"])&&(y+height >= objPlayer.id[i]["y"]))
      {
        return false;
      }
    }
  }
  if (name != "objFloor")
  {
    for (var i=0;i<objFloor.id.length;i++)
    {
      if ((x >= objFloor.id[i]["x"])&&(y >= objFloor.id[i]["y"])&&(x <= objFloor.id[i]["x"]+objFloor.id[i]["width"])&&(y <= objFloor.id[i]["y"]+objFloor.id[i]["height"]))
	  {
	    return false;
	  }
      else if ((x <= objFloor.id[i]["x"])&&(x+width >= objFloor.id[i]["x"])&&(((y <= objFloor.id[i]["y"])&&(y+height >= objFloor.id[i]["y"]))||((y >= objFloor.id[i]["y"])&&(y <= objFloor.id[i]["y"]+objFloor.id[i]["height"]))))
      {
        return false;
      }
      else if ((x >= objFloor.id[i]["x"])&&(x <= objFloor.id[i]["x"]+objFloor.id[i]["width"])&&(((y <= objFloor.id[i]["y"])&&(y+height >= objFloor.id[i]["y"]))||((y >= objFloor.id[i]["y"])&&(y <= objFloor.id[i]["y"]+objFloor.id[i]["height"]))))
      {
        return false;
      }
    }
  }
  return true;
}