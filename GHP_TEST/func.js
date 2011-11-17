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
  curcon.beginPath();
  curcon.moveTo(x1, y1);
  curcon.lineTo(x2, y2);
  curcon.stroke();
}
function drawRect(x1, y1, x2, y2, fill)
{
  if (fill == true)
  {
	curcon.fillRect(x1, y1, x2-x1, y2-y1);
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
  curcon.strokeStyle = color;
  curcon.fillStyle = color;
}
function drawText(text, x, y)
{
  if (text.indexOf("~#") != -1)
  {
    text1 = text.substr(0, text.indexOf("~#"));
	text2 = text.substr(text.indexOf("~#")+2, text.length);
	drawText(text1, x, y);
	drawText(text2, x, y+stringHeight(text1)+2);
  }
  else if (text.indexOf("~a:") != -1) //Hyperlinks
  {
	link = text.substr(text.indexOf("~a:")+3, text.length).indexOf("~");
	func = text.substr(text.indexOf("~a:")+3, link);
	text1 = text.substr(0, text.indexOf("~a:"));
	text2 = text.substr(text.indexOf("~a:")+func.length+4, text.substring(text.indexOf("~a:")+func.length+4, text.length).indexOf("~"));
	drawText(text1+text2, x, y);
	addLink(func, x+stringWidth(text1), y-stringHeight(text), stringWidth(text2), stringHeight(text));
  }
  else
  {
    if ((globalFont instanceof Font) || (globalFont == null))
	{
	  curcon.font = globalFont.font;
	  curcon.fillText(text, x, y);
	}
	else if (globalFont instanceof SpriteFont) //jimn346
	{
 	  for(var i = 0; i <= text.length - 1; i++)
	  {
	    if (ord(stringCharAt(text, i)) >= globalFont.start && ord(stringCharAt(text, i)) < globalFont.start + globalFont.sprite.width / globalFont.sprite.siwidth)
		{
	      drawSpriteExt(globalFont.sprite, x + (globalFont.sprite.siwidth + globalFont.sep) * i, y, ord(stringCharAt(text, i)) - globalFont.start);
		}
	  }
	}
  }
}
function drawSetGradient(linear, x1, y1, x2, y2, col1, col2, r1, r2)
{
  var gradient;
  
  if (linear == true)
  {
	gradient = curcon.createLinearGradient(x1, y1, x2, y2);
  }
  else
  {
    gradient = curcon.createRadialGradient(x1, y1, r1, x2, y2, r2);
  }
  gradient.addColorStop(0, col1);
  gradient.addColorStop(1, col2);
  curcon.fillStyle = gradient;
}
function drawSprite(sprite, x, y)
{
  curcon.drawImage(sprite, x, y);
}
function drawSpriteExt(sprite, x, y, subimg, xscale, yscale, angle, color, alpha) //jimn346
{
  curcon.save();
  curcon.translate(x, y);
  curcon.rotate(angle * (Math.PI / 180));
  curcon.scale(xscale, yscale);
  curcon.globalAlpha = alpha;
  if (typeof sprite.siwidth != undefined)
  {
    curcon.drawImage(sprite, Math.floor(subimg) * sprite.siwidth, 0, sprite.siwidth, sprite.height, 0, 0, sprite.siwidth, sprite.height);
  }
  else
  {
    curcon.drawImage(sprite, Math.floor(subimg) * sprite.width, 0, sprite.width, sprite.height, 0, 0, sprite.width, sprite.height);
  }
  curcon.restore();
}
function drawCircle(x, y, r, fill)
{
  curcon.beginPath();
  curcon.arc(x, y, r, 0, Math.PI*2, fill);
  curcon.stroke();
  if (fill == true)
  {
    curcon.fill();
  }
}
function clearDraw()
{
  links.length = 0;
  canvas.width = canvas.width;
}
function drawSetBackground(isback, back, fill)
{
  if (isback == true)
  {
    drawSetColor(fill);
	drawRect(0, 0, canvas.width, canvas.height, true);
	curcon.drawImage(back, 0, 0);
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
    curcon.drawImage(foreground[i], 0, 0);
  }
  foreground.length = 0;
}
function drawSetCursor(cur)
{
  cursor.src = cur.src;
}
function drawCursor()
{
  curcon.drawImage(cursor, mouseX, mouseY);
}
function drawSetFont(font)
{
  globalFont = font;
}
function addLink(func, x, y, width, height)
{
  links[0] = new Array();
  links[0][0] = func;
  links[0][1] = x;
  links[0][2] = y;
  links[0][3] = width;
  links[0][4] = height;
}
function drawLinks()
{
  if (links.length > 0)
  {
	for (var i=0;i<links.length;i++)
	{
	  if ((mouseX >= links[i][1])&&(mouseY >= links[i][2])&&(mouseX <= links[i][1]+links[i][3])&&(mouseY <= links[i][2]+links[i][4]))
	  {
		drawLine(links[i][1], links[i][2]+links[i][4]+2, links[i][1]+links[i][3], links[i][2]+links[i][4]+2, false);
	  }
	}
  }
}
//////////////////////////
//Font functions - jimn346
//////////////////////////
function fontAdd(name, size, bold, italic)
{
  this.temp = new Font();
  temp.font = name;
  temp.size = size;
  temp.style = bold + italic * 2;
  return temp;
}
function fontAddSprite(sprite, first, prop, sep)
{
  this.temp = new SpriteFont();
  temp.sprite = sprite;
  temp.start = first;
  temp.sep = sep;
  return temp;
}
function fontExists(ind)
{
  if (ind instanceof Font || ind instanceof SpriteFont)
  {
    return true;
  }
  else
  {
    return false;
  }
}
function fontGetFontname(ind)
{
  return ind.name;
}
function fontDelete(ind)
{
  delete ind;
}
function fontGetBold(ind)
{
  if (ind instanceof Font && (ind.style == 1 || ind.style == 3))
  {
    return true;
  }
  else{
    return false;
  }
}
function fontGetItalic(ind)
{
  if (ind instanceof Font && (ind.style == 2 || ind.style == 3))
  {
    return true;
  }
  else
  {
    return false;
  }
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
function string(x)
{
  return "" + x;
}
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
function stringWidth(str)
{
  return curcon.measureText(str).width;
}
function stringHeight(str)
{
  if (globalFont instanceof Font)
  {
    curcon.font = globalFont.font;
    return curcon.measureText("m").width * (stringCount("~#", str) + 1) + 2 * stringCount("~#", str);
  }
  else if (globalFont instanceof SpriteFont)
  {
    return globalFont.sprite.height * (stringCount("~#", str) + 1) + 2 * stringCount("~#", str);
  }
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
///////////////////
//Surface Functions
///////////////////
function surfaceCreate(w, h)
{
   this.temp = document.createElement("canvas");
   temp.setAttribute("width", w);
   temp.setAttribute("height", h);
   temp.setAttribute("style", "visibility: hidden;");
   return temp;
}
function surfaceFree(id)
{
  //This doesn't work.
  delete id;
}
function surfaceExists(id)
{
  //This doesn't usually work.
  if (id == null)
  {
    return false;
  }
  else
  {
    return true;
  }
}
function surfaceGetWidth(id)
{
  if (id == -1)
  {
    id = canvas;
  }
  return id.width;
}
function surfaceGetHeight(id)
{
  if (id == -1)
  {
    id = canvas;
  }
  return id.height;
}
function surfaceSetTarget(id)
{
  if (id == -1)
  {
    id = canvas;
  }
  cursurf = id;
  curcon = cursurf.getContext("2d");
}
function surfaceResetTarget()
{
  cursurf = canvas;
  curcon = cursurf.getContext("2d");
}
function surfaceGetpixel(id, x, y)
{
  if (id == -1)
  {
    id = canvas;
  }
  this.imgdata = id.getContext("2d").getImageData(x, y, 1, 1);
  this.data = imgdata.data;
  this.red = data[0];
  this.green = data[1];
  this.blue = data[2];
  return "#" + parseInt(red) + parseInt(green) + parseInt(blue);
}
function drawSurface(id, x, y)
{
  if (id == -1)
  {
    id = canvas;
  }
  curcon.drawImage(id, x, y);
}
function drawSurfaceStretched(id, x, y, w, h)
{
  if (id == -1)
  {
    id = canvas;
  }
  curcon.drawImage(id, x, y, w, h);
}
function drawSurfacePart(id, left, top, w, h, x, y)
{
  if (id == -1)
  {
    id = canvas;
  }
  curcon.drawImage(id, left, top, w, h, x, y, w, h);
}
function drawSurfaceExt(id, x, y, xscale, yscale, angle, color, alpha)
{
  if (id == -1)
  {
    id = canvas;
  }
  curcon.save();
  curcon.translate(x, y);
  curcon.rotate(angle * (Math.PI / 180));
  curcon.scale(xscale, yscale);
  curcon.globalAlpha = alpha;
  curcon.drawImage(id, 0, 0);
  curcon.restore();
}
function drawSurfaceStretchedExt(id, x, y, w, h, angle, color, alpha)
{
  if (id == -1)
  {
    id = canvas;
  }
  curcon.save();
  curcon.translate(x, y);
  curcon.rotate(angle * (Math.PI / 180));
  curcon.globalAlpha = alpha;
  curcon.drawImage(id, w, h);
  curcon.restore();
}
function drawSurfacePartExt(id, left, top, w, h, x, y, xscale, yscale, color, alpha)
{
  if (id == -1)
  {
    id = canvas;
  }
  curcon.save();
  curcon.globalAlpha = alpha;
  curcon.drawImage(id, left, top, w, h, x, y, w, h);
  curcon.restore();
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