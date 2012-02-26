/*
* Copyright (c) 2011-12 piluke <pikingqwerty@gmail.com>
* Copyright (c) 2011-12 jimn346 <jds9496@gmail.com>
* You can find the GitHub repository at https://github.com/piluke/GameMaker-HTML5-Player
* 
* This file is part of GameMaker HTML5 Player (GHP).
* GHP is free software and comes with ABSOLUTELY NO WARANTY.
* See LICENSE for more details.
*/

///////////////////
//Drawing functions
///////////////////
function requestAnimFrame()
{
	return (window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame)(eventDraw); //Cross-browser support
}
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
  if (fill === true)
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
function drawGetColor()
{
	return curcon.fillStyle || curcon.strokeStyle;
}
function drawText(text, x, y)
{
  if (text.indexOf("~#") != -1)
  {
    var text1 = text.substr(0, text.indexOf("~#"));
	var text2 = text.substr(text.indexOf("~#")+2, text.length);
	drawText(text1, x, y);
	drawText(text2, x, y+stringHeight(text1)+2);
  }
  else if (text.indexOf("~a:") != -1) //Hyperlinks
  {
	var link = text.substr(text.indexOf("~a:")+3, text.length).indexOf("~");
	var func = text.substr(text.indexOf("~a:")+3, link);
	var text1 = text.substr(0, text.indexOf("~a:"));
	var text2 = text.substr(text.indexOf("~a:")+func.length+4, text.substring(text.indexOf("~a:")+func.length+4, text.length).indexOf("~"));
	drawText(text1+text2, x, y);
	addLink(func, undefined, x+stringWidth(text1), y-stringHeight(text), stringWidth(text2), stringHeight(text), true, drawGetColor());
  }
  else
  {
    if ((instanceOf(globalFont) == "Font") || (globalFont === null))
	{
		curcon.font = globalFont.font;
		curcon.fillText(text, x, y);
	}
	else if (instanceOf(globalFont) == "SpriteFont")
	{
	  if (globalFont.prop === false)
	  {
 	    for(var i = 0; i <= text.length - 1; i++)
	    {
	      if (ord(stringCharAt(text, i)) >= globalFont.start && ord(stringCharAt(text, i)) < globalFont.start + globalFont.sprite.width / globalFont.sprite.siwidth)
		  {
			drawSpriteExt(globalFont.sprite, x + (globalFont.sprite.siwidth + globalFont.sep) * i, y, ord(stringCharAt(text, i)) - globalFont.start);
		  }
	    }
	  }
	  else
	  {
	    this.curx = x;
 	    for(var i = 0; i <= text.length - 1; i++)
	    {
	      if (ord(stringCharAt(text, i)) >= globalFont.start && ord(stringCharAt(text, i)) < globalFont.start + globalFont.sprite.width / globalFont.sprite.siwidth)
		  {
			curx -= globalFont.propx[ord(stringCharAt(text, i)) - globalFont.start];
			drawSpriteExt(globalFont.sprite, curx, y, ord(stringCharAt(text, i)) - globalFont.start);
			curx += globalFont.propwidth[ord(stringCharAt(text, i)) - globalFont.start] + globalFont.sep;
		  }
	    }
	  }
	}
  }
}
function drawSetGradient(linear, x1, y1, x2, y2, col1, col2, r1, r2)
{
  var gradient;
  
  if (linear === true)
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
function drawSprite(sprite, x, y, subimg)
{
    this.xx = 0;
	this.yy = 0;
	if (sprite.xorig != undefined)
	    xx = sprite.xorig;
	if (sprite.yorig != undefined)
	    yy = sprite.yorig;
	curcon.save();
	curcon.translate(x, y);
	if (sprite.siwidth != undefined)
	{
		curcon.drawImage(sprite, floor(subimg) * sprite.siwidth, 0, sprite.siwidth, sprite.height, -xx, -yy, sprite.siwidth, sprite.height);
	}
	else
	{
		curcon.drawImage(sprite, -xx, -yy);
	}
	curcon.restore();
}

function drawSpriteExt(sprite, x, y, subimg, xscale, yscale, angle, color, alpha)
{
    this.xx = 0;
	this.yy = 0;
	if (sprite.xorig != undefined)
	    xx = sprite.xorig;
	if (sprite.yorig != undefined)
	    yy = sprite.yorig;
	image = sprite;
	if (sprite.colors != undefined && color.toUpperCase() != cWhite)
	{
		if (sprite.colors.indexOf(stringUpper(color)) == -1)
		{
			sprite.colors[stringUpper(color)] = imageBlend(sprite, color);
		}
		image = sprite.colors[stringUpper(color)];
	}
	curcon.save();
	curcon.translate(x, y);
	curcon.rotate(angle * (pi / 180));
	curcon.scale(xscale, yscale);
	curcon.globalAlpha = alpha;
	if (sprite.siwidth != undefined)
	{
		curcon.drawImage(image, floor(subimg) * sprite.siwidth, 0, sprite.siwidth, sprite.height, -xx, -yy, sprite.siwidth, sprite.height);
	}
	else
	{
		curcon.drawImage(image, floor(subimg) * sprite.width, 0, sprite.width, sprite.height, -xx, -yy, sprite.width, sprite.height);
	}
	curcon.restore();
}
function drawCircle(x, y, r, fill)
{
	curcon.beginPath();
	curcon.arc(x, y, r, 0, pi*2, fill);
	curcon.stroke();
	if (fill === true)
	{
		curcon.fill();
	}
}
function clearDraw()
{
	delete window.links;
	links = new Array();
	context.clearRect(0, 0, roomWidth, roomHeight);
}
function drawSetBackground(isback, back, fill)
{
  if (isback === true)
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
function addLink(func, arg, x, y, width, height, istext, color)
{
  var i = links.length
  links[i] = new Array();
  links[i][0] = func;
  links[i][1] = arg
  links[i][2] = x;
  links[i][3] = y;
  links[i][4] = width;
  links[i][5] = height;
  links[i][6] = istext;
  links[i][7] = color;
}
function drawLinks()
{
	if (links.length > 0)
	{
		for (var i=0;i<links.length;i++)
		{
			if ((mouseX >= links[i][2])&&(mouseY >= links[i][3])&&(mouseX <= links[i][2]+links[i][4])&&(mouseY <= links[i][3]+links[i][5])&&(links[i][6]))
			{
				drawSetColor(links[i][7]);
				drawLine(links[i][2], links[i][3]+links[i][5]+2, links[i][2]+links[i][4], links[i][3]+links[i][5]+2);
			}
		}
	}
}
function drawSetAlpha(alpha)
{
	curcon.globalAlpha = alpha;
}
////////////////
//Font functions
////////////////
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
  temp.prop = prop;
  if (prop === true)
  {
    temp.propx = new Array();
    temp.propwidth = new Array();
	this.minx = sprite.siwidth;
	this.maxw = 0;
	this.surf = surfaceCreate(sprite.width, sprite.height);
	this.con = surf.getContext("2d");
	con.drawImage(sprite, 0, 0);
	this.imgdata = con.getImageData(0, 0, sprite.width, sprite.height);
	for (var i = 0; i < sprite.width / sprite.siwidth; i++)
	{
	  for (var x = 0; x < sprite.siwidth; x++)
	  {
	    for (var y = 0; y < sprite.height; y++)
	    {
	      if (imgdata.data[(i * sprite.siwidth + x + (y * sprite.width)) * 4 + 3] > 0)
		  {
		    minx = min(minx, x);
		  }
	    }
	  }
	  temp.propx[i] = minx;
	  for (var x = minx + 1; x < sprite.siwidth; x++)
	  {
	    for (var y = 0; y < sprite.height; y++)
	    {
	      if (imgdata.data[(i * sprite.siwidth + x + (y * sprite.width)) * 4 + 3] > 0)
		  {
		    maxw = max(maxw, x - minx);
		  }
	    }
	  }
	  temp.propwidth[i] = maxw;
	}
  }
  return temp;
}
function fontExists(ind)
{
  if (instanceOf(ind) == "Font" || instanceOf(ind) == "SpriteFont")
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
  delete this.ind;
}
function fontGetBold(ind)
{
  if (instanceOf(ind) == "Font" && (ind.style == 1 || ind.style == 3))
  {
    return true;
  }
  else{
    return false;
  }
}
function fontGetItalic(ind)
{
  if (instanceOf(ind) == "Font" && (ind.style == 2 || ind.style == 3))
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
  return x*180/pi;
}
function degToRad(x)
{
  return x*pi/180;
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
function round(x, d)
{
	if (d == undefined)
	{
		d = 1;
	}
	else
	{
		d = round(d);
	}
	return Math.round(x*d)/d;
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
  );
  var i = 15;
  while(ary[i] === null)
  {
    i--;
  }
  return ary[i];
}
function random(x)
{
  if (x == undefined)
  {
	x = 1;
  }
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
function ln(x)
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
  while(ary[i] !== null)
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
  var mid = floor(ary.length/2);
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
  return sqrt(sqr(x1-x2)+sqr(y1-y2));
}
function pointDistance3d(x1, y1, z1, x2, y2, z2)
{
	return sqrt(sqr(x1-x2)+sqr(y1-y2)+sqr(z1-z2));
}
function pointDirection(x1, y1, x2, y2)
{
  return radToDeg((y2-y1)/(x2-x1));
}
function rayPoint(obj, dir, spd) //Point along ray from object
{
	if (isReal(obj))
	{
		obj = glin[obj];
	}
	m = degToRad(dir);
	b = -m*obj["x"] + obj["y"];
	if (spd !== undefined)
	{
		spd = min(spd, (roomWidth+roomHeight)*2);
		x = obj["x"];
		y = obj["y"];
		for (var i=0;pointDistance(obj["x"], obj["y"], x, y) >= spd;i++)
		{
			if (sign(m) >= 0)
			{
				x = obj["x"]+i;
			}
			else if (sign(m) < 0)
			{
				x = obj["x"]-i;
			}
			obj["y"] = m*obj["x"] + b;
		}
		return i;
	}
	else
	{
		obj["x"] += 1;
		obj["y"] = m*obj["x"] + b;
	}
}
function lengthdirX(len, dir)
{
	return cos(dir*pi/180)*len;
}
function lengthdirY(len, dir)
{
	return -sin(dir*pi/180)*len;
}
function dotProduct(x1, y1, x2, y2)
{
	return x1*x2+y1*y1;
}
function dotProduct3d(x1, y1, z1, x2, y2, z2)
{
	return x1*x2+y1*y2+z1*z2;
}
function isReal(x)
{
	return (typeof x === "number") ? true : false;
}
function choose(x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16)
{
	var ary = [x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16];
	return ary[irandom(ary.length)];
}
function sign(x)
{
	return (isNaN(x/abs(x))) ? 0 : (x/abs(x));
}
function frac(x)
{
	return x-floor(x);
}
function isDefined(x)
{
	if ((x !== undefined)&&(!isNaN(x)))
	{
		return true;
	}
	return false;
}
//Fix
function randomGetSeed()
{
	return new Date();
}
function randomSetSeed()
{
	return false;
}
function randomize()
{
	return false;
}

//////////////////
//String Functions
//////////////////
function isString(x)
{
	return (typeof x === "string") ? true : false;
}
function string(x)
{
  return "" + x;
}
function stringFormat(x, tot, dec)
{
	str = string(x);
	while (str.substring(str.indexOf(".")).length < dec)
	{
		str += "0";
	}
	while (str.substring(0, str.indexOf(".")).length < tot)
	{
		str = " "+str;
	}
	return str;
}
function chr(x)
{
	return String.fromCharCode(x);
}
function ord(x, y)
{
  if (y === null)
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
  if (instanceOf(globalFont) == "Font")
  {
    curcon.font = globalFont.font;
    return curcon.measureText("m").width * (stringCount("~#", str) + 1) + 2 * stringCount("~#", str);
  }
  else if (instanceOf(globalFont) == "SpriteFont")
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
//Fix
function ansiChar(x)
{
	return false;
}
function clipboardHasText()
{
	return false;
}
function clipboardGetText()
{
	return "";
}
function clipboardSetText()
{
	return false;
}

/////////////////
//Data Structures
/////////////////
function dsListCreate()
{
  return new Array();
}
function dsListDestroy(id)
{
  delete this.id;
}
function dsListClear(id)
{
  id.Clear();
}
function dsListCopy(id, src)
{
  id.Clear();
  id.Concat(src);
}
function dsListSize(id)
{
  return id.length;
}
function dsListEmpty(id)
{
  return (id.length === 0);
}
function dsListAdd(id, val)
{
  id[id.length] = val;
}
function dsListInsert(id, pos, val)
{
  this.start = new Array();
  this.end = new Array();
  
  start.Concat(id);
  start.length = pos;
  start.Add(val);
  
  end.Concat(id);
  end.Reverse();
  end.length = id.length - pos - 1;
  end.Reverse();
  
  start.Concat(end);
  
  id.Clear();
  id.Concat(start);
  
  delete this.start;
  delete this.end;
}
function dsListReplace(id, pos, val)
{
  id[pos] = val;
}
function dsListDelete(id, pos)
{
  id.RemoveAt(pos);
}
function dsListFindIndex(id, val)
{
  this.exit = false;
  this.i = 0;
  while (exit === false)
  {
    if (i == id.length)
	{
	  exit = true;
	  return -1;
	}
	else
	{
	  if (id[i] == val)
	  {
	    exit = true;
	    return i;
	  }
	}
	i += 1;
  }
}
function dsListFindValue(id, pos)
{
  return id[pos];
}
//Later add support for dsListSort. Javascript sorts purely alphabetically, not alphabetically and numerically.
function dsListShuffle(id)
{
  //This works by going through the array in order and switching the current value with a random one.
  for (var i = 0; i < id.length; i++)
  {
    this.a = id[i];
	this.b = parseInt(random()*len);
	id[i] = id[b];
	id[p] = a;
  }
}
//Later add support for dsListRead and dsListWrite. Javascript uses a different method than Game Maker, and we would want compatibility between executable and on games in the case of save files.

////////////////////////
//General Game Functions
////////////////////////
function variableGlobalExists(a)
{
  if (a === null)
  {
    return false;
  }
  else
  {
    return true;
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
  if (self.a === null)
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
function instanceOf(o) //Fixes instanceof cross-frame breakage
{
	var s = Object.prototype.toString.call(o);
	s = s.substring(s.indexOf(" ")+1, s.length-1);
	if (s == "Object") //User defined
	{
		return o.constructor.name
	}
	return s;
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
  //temps has to be used instead of temp because this method is used in fontAddSprite which uses temp.
  this.temps = document.createElement("canvas");
  temps.setAttribute("width", w);
  temps.setAttribute("height", h);
  temps.setAttribute("style", "visibility: hidden;");
  return temps;
}
function surfaceFree(id)
{
  id.remove(0);
}
function surfaceExists(id)
{
  if (id === -1)
  {
    id = canvas;
  }
  if (id === null)
  {
    return false;
  }
  else
  {
    return (id.getContext);
  }
}
function surfaceGetWidth(id)
{
  if (id === -1)
  {
    id = canvas;
  }
  return id.width;
}
function surfaceGetHeight(id)
{
  if (id === -1)
  {
    id = canvas;
  }
  return id.height;
}
function surfaceSetTarget(id)
{
  if (id === -1)
  {
    id = canvas;
  }
  this.tmpstroke = curcon.strokeStyle;
  this.tmpfill = curcon.fillStyle;
  this.tmpalpha = curcon.globalAlpha;
  cursurf = id;
  curcon = cursurf.getContext("2d");
  curcon.strokeStyle = tmpstroke;
  curcon.fillStyle = tmpfill;
  curcon.globalAlpha = tmpalpha;
}
function surfaceResetTarget()
{
  surfaceSetTarget(canvas);
}
function surfaceGetPixel(id, x, y)
{
  if (id === -1)
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
  curcon.rotate(angle * (pi / 180));
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
  curcon.rotate(angle * (pi / 180));
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

////////////////
//Date functions
////////////////
function dateDatetimeString(d)
{
	return d.toLocaleDateString()+d.toLocaleTimeString()+(d.getHours <= 12) ? " AM" : " PM";
}
function dateDateString(d)
{
	return d.toLocaleDateString();
}
function dateTimeString(d)
{
	return d.toLocaleTimeString()+(d.getHours <= 12) ? " AM" : " PM";
}
function dateCurrentDatetime()
{
	return new Date();
}
function dateCurrentDate()
{
	var d = new Date();
	return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function dateCurrentTime()
{
	var d = new Date();
	return new Date(0, 0, 0, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
}
function dateCreateDatetime(y, m, d, h, mi, s, ms)
{
	return new Date(y, m, d, h, mi, s, ms);
}
function dateCreateDate(y, m, d)
{
	return new Date(y, m, d);
}
function dateCreateTime(h, m, s, ms)
{
	return new Date(0, 0, 0, h, m, s, ms);
}
function dateValidDatetime(y, m, d, h, mi, s, ms)
{
	var dt = new Date(y, m, d, h, mi, s, ms);
	var tom = {0:"", 2:"", 4:"", 6:"", 7:"", 9:"", 11:""}; //Months with 31 days
	if (instanceOf(dt) !== "Date")
	{
		return false;
	}
	if ((abs(y) != y)||(abs(m) != m)||(abs(d) != d)||(abs(h) != h)||(abs(mi) != mi)||(abs(s) != s)||(abs(ms) != ms))
	{
		return new Date(abs(y), abs(m), abs(d), abs(h), abs(mi), abs(s), abs(ms));
	}
	if (m > 11)
	{
		return dt;
	}
	if ((m == 1)&&(d > 29)) //Leap years
	{
		return dt;
	}
	else if ((m == 1)&&(d == 29)&&!(y % 4))
	{
		return dt;
	}
	if (d > 31)
	{
		return dt;
	}
	else if ((d == 31)&&!(m in tom))
	{
		return dt;
	}
	if (isNaN(dt.getTime()))
	{
		return dt;
	}
	if ((h > 23)||(h < 0))
	{
		return dt;
	}
	if ((m > 59)||(m < 0))
	{
		return dt;
	}
	if ((s > 59)||(s < 0))
	{
		return dt;
	}
	if ((ms > 999)||(ms < 0))
	{
		return dt;
	}
	return true;
}
function dateValidDate(y, m, d)
{
	return dateValidDatetime(y, m, d, 0, 0, 0, 0);
}
function dateValidTime(h, m, s, ms)
{
	return dateValieDatetime(0, 0, 0, h, m, s, ms);
}
function dateValidate(d)
{
	var r = dateValidDatetime(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
	if (r === true)
	{
		return d;
	}
	return r;
}
function dateInc(d, x1, x2, x3, x4, x5, x6, x7)
{
	return dateValidate(new Date(d.getFullYear()+x1, d.getMonth()+x2, d.getDate()+x3, d.getHours()+x4, d.getMinutes()+x5, d.getSeconds()+x6, d.getMilliseconds()+x7));
}
function dateIncYear(d, x)
{
	return dateInc(d, x, 0, 0, 0, 0, 0, 0);
}
function dateIncMonth(d, x)
{
	return dateInc(d, 0, x, 0, 0, 0, 0, 0);
}
function dateIncWeek(d, x)
{
	return dateInc(d, 0, 0, 7*x, 0, 0, 0, 0);
}
function dateIncDay(d, x)
{
	return dateInc(d, 0, 0, x, 0, 0, 0, 0);
}
function dateIncHour(d, x)
{
	return dateInc(d, 0, 0, 0, x, 0, 0, 0);
}
function dateIncMinute(d, x)
{
	return dateInc(d, 0, 0, 0, 0, x, 0, 0);
}
function dateIncSeconds(d, x)
{
	return dateInc(d, 0, 0, 0, 0, 0, x, 0);
}
function dateIncMillisecond(d, x)
{
	return dateInc(d, 0, 0, 0, 0, 0, 0, x);
}
function dateGetYear(d)
{
	return d.getFullYear();
}
function dateGetMonth(d)
{
	return d.getMonth();
}
function dateGetWeek(d)
{
	var j = new Date(d.getFullYear(), 0, 1);
	return ceil((((d-j)/86400000)+j.getDay()+1)/7);
}
function dateGetDay(d)
{
	return d.getDate();
}
function dateGetHour(d)
{
	return d.getHours();
}
function dateGetMinutes(d)
{
	return d.getMinutes();
}
function dateGetSeconds(d)
{
	return d.getSeconds();
}
function dateGetMilliseconds(d)
{
	return d.getMilliseconds();
}
function dateGetWeekday(d)
{
	return d.getDay();
}
function dateGetDayOfYear(d)
{
	var j = new Date(d.getFullYear(), 0, 1);
	return ceil((d-j)/86400000)+1;
}
function dateGetHourOfYear(d)
{
	var j = new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
	return ceil((d-j)/3600000)+1;
}
function dateGetMinuteOfYear(d)
{
	var j = new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
	return ceil((d-j)/60000)+1;
}
function dateGetSecondOfYear(d)
{
	var j = new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
	return ceil((d-j)/1000)+1;
}
function dateGetMillisecondOfYear(d)
{
	var j = new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
	return ceil(d-j)+1;
}
function dateYearSpan(d1, d2)
{
	return round(abs(d1-d2)/31536000000, 10);
}
function dateWeekSpan(d1, d2)
{
	return round(abs(d1-d2)/604800000, 10);
}
function dateDaySpan(d1, d2)
{
	return round(abs(d1-d2)/86400000, 10);
}
function dateHourSpan(d1, d2)
{
	return round(abs(d1-d2)/3600000, 10);
}
function dateMinuteSpan(d1, d2)
{
	return round(abs(d1-d2)/60000, 10);
}
function dateSecondSpan(d1, d2)
{
	return round(abs(d1-d2)/1000, 10);
}
function dateMillisecondSpan(d1, d2)
{
	return round(abs(d1-d2));
}
function dateCompareDatetime(d1, d2)
{
	return sign(d1-d2);
}
function dateCompareDate(d1, d2)
{
	return dateCompareDatetime(d1, d2);
}
function dateCompareTime(d1, d2)
{
	return dateCompareDatetime(d1, d2);
}
function dateDateOf(d)
{
	return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function dateTimeOf(d)
{
	return new Date(0, 0, 0, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
}
function dateDatetimeString(d)
{
	return d.toString();
}
function dateDateString(d)
{
	return d.toDateString();
}
function dateTimeString(d)
{
	return d.toTimeString();
}
function dateDaysInMonth(d)
{
	return 32-new Date(d.getFullYear(), d.getMonth(), 32).getDate();
}
function dateDaysInYear(d)
{
	return 365+dateLeapYear(d);
}
function dateLeapYear(d)
{
	return (new Date(d.getFullYear(), 1, 29).getDate() == 1) ? false : true;
}
function dateIsToday(d)
{
	var t = new Date();
	return (new Date(d.getFullYear(), d.getMonth(), d.getDate()) == new Date(t.getFullYear(), t.getMonth(), t.getDate())) ? true : false;
}
//Fix
function dateMonthSpan(d1, d2)
{
	return round(abs(d1-d2)/2628000000, 10); //Not all months have 30 days
}

////////////////////
//Instance functions
////////////////////
function instanceDestroy(obj)
{
	if (obj !== undefined)
	{
		glin[obj["glin"]] = null;
	}
	return null;
}

////////////////////
//Movement Functions
////////////////////
function motionSet(obj, dir, spd)
{
	inst = glin[obj["glin"]];
	if (inst !== undefined)
	{
		inst["direction"] = dir;
		inst["speed"] = spd;
	}
	else
	{
		return false;
	}
}
function motionAdd(obj, dir, spd)
{
	var inst = glin[obj["glin"]];
	if (inst !== undefined)
	{
		if (inst["direction"] === undefined)
		{
			inst["direction"] = 0;
		}
		var dir2 = inst["direction"];
		if (dir-dir2 > dir2-dir)
		{
			inst["direction"] = min(360-dir+dir2, dir-dir2);
		}
		else if (dir-dir2 < dir2-dir)
		{
			inst["direction"] = min(360-dir2+dir, dir2-dir);
		}
		inst["speed"] += spd;
	}
	else
	{
		return false;
	}
}
function placeSnapped(obj, hsnap, vsnap)
{
	if ((obj["x"] % hsnap == 0)&&(obj["y"] % vsnap == 0))
	{
		return true;
	}
	else
	{
		return false;
	}
}
function moveRandom(obj, hsnap, vsnap)
{
	var x = irandom(roomWidth);
	while (x % hsnap != 0)
	{
		x = irandom(roomWidth);
	}
	var y = irandom(roomHeight);
	while (y % vsnap != 0)
	{
		y = irandom(roomHeight);
	}
	obj["x"] = x;
	obj["y"] = y;
}
function moveSnap(obj, hsnap, vsnap)
{
	if (obj["x"] % hsnap != 0)
	{
		var m = obj["x"] % hsnap;
		if (m > (hsnap/2))
		{
			obj["x"] += hsnap-m;
		}
		else
		{
			obj["x"] -= m;
		}
	}
	if (obj["y"] % vsnap != 0)
	{
		var m = obj["y"] % vsnap;
		if (m > (vsnap/2))
		{
			obj["y"] += vsnap-m;
		}
		else
		{
			obj["y"] -= m;
		}
	}
}
function moveTowardsPoint(obj, x, y, spd)
{
	motionSet(obj, pointDirection(obj["x"], obj["y"], x, y), spd);
}
//Fix
function placeFree(obj, x, y, main)
{
  inst = glin[obj["glin"]];
  if (inst !== null)
  {
    for (var i=0;i<glin.length;i++)
    {
  	  if (glin[i] !== inst)
	  {
 	    if ((glin[i]["x"] < x)&&(glin[i]["x"]+glin[i]["width"] >= x)&&(glin[i]["y"] < y)&&(glin[i]["y"]+glin[i]["height"] >= y))
	    {
		  if (main !== undefined)
		  {
			return false;
		  }
		  else if (glin[i]["solid"] !== undefined)
		  {
			if (glin[i]["solid"] == true)
			{
				return false;
			}
		  }
	    }
	  }
    }
  }
  else
  {
    for (var i=0;i<glin.length;i++)
	{
	  if ((glin[i]["x"] < x)&&(glin[i]["x"]+glin[i]["width"] >= x)&&(glin[i]["y"] < y)&&(glin[i]["y"]+glin[i]["height"] >= y))
	  {
		if (main !== undefined)
		  {
			return false;
		  }
		  else if (glin[i]["solid"] !== undefined)
		  {
			if (glin[i]["solid"] == true)
			{
				return false;
			}
		  }
	  }
	}
  }
  return true;
}
function placeEmpty(obj, x, y)
{
	return placeFree(obj, x, y, false);
}
function placeMeeting(x, y, obj)
{
	for (var i=0;i<glin.length;i++)
	{
		if ((glin[i]["x"] == x)&&(glin[i]["y"] == y))
		{
			if ((glin[i]["x"] < obj["x"])&&(glin[i]["x"]+glin[i]["width"] >= obj["x"])&&(glin[i]["y"] < obj["y"])&&(glin[i]["y"]+glin[i]["height"] >= obj["y"]))
			{
				return true;
			}
		}
	}
	return false;
}

////////////////
//Room functions
////////////////
function roomGoto(r, m)
{
	var rm = undefined;
	if (!isNaN(Number(r)))
	{
		rm = r;
	}
	else
	{
		for (var i=0;i<rooms.length;i++)
		{
			if (rooms[i] == r)
			{
				rm = i;
				break;
			}
		}
		if (rm == undefined)
		{
			return false;
		}
	}
	if (m !== undefined)
	{
		rm += m;
	}
	for (var i=0;i<rooms[room].inst.length;i++)
	{
		rooms[room].inst[i][0].id.length = 0;
	}
	delete window.glin;
	glin = new Array();
	roomOpen(rm);
	return true;
}
function roomGotoNext()
{
	return roomGoto(room, 1);
}
function roomGotoPrevious()
{
	return roomGoto(room, -1);
}
function roomRestart()
{
	return roomGoto(room);
}

//Collision System

//This collision system works by finding how close two shapes must be to collide, given the direction from one to the other.
//It calculates the distance from the center to the edge of each shape in the respective direction, adds those, and checks if
//that distance is less than the distance from the center of one shape to the center of the next.

//Rectangle
function lengthRectangle(w, h, dir)
{
  if (dir >= 180)
    dir -= 180;

  if (!(dir > Math.atan(h / w)) * 180 / Math.PI || dir > (180 - Math.atan(h / w)) * 180 / Math.PI)
    return Math.abs(w / 2 / Math.cos(dir * Math.PI / 180));
  else
    return Math.abs(h / 2 / Math.cos((90 - dir) * Math.PI / 180));
}

//Ellipse
function lengthEllipse(w, h, dir)
{
  dir = dir * Math.PI / 180;
  return (w * h) / (Math.sqrt(Math.pow(h * Math.cos(dir), 2) + Math.pow(w * Math.sin(dir), 2))) / 2;
}

//Diamond
function lengthDiamond(w, h, dir)
{
  if (dir > 180)
    dir -= 180;

  if (dir > 90)
    dir = 90 - (dir - 90);

  this.sl1 = Math.tan(dir * pi / 180);
  this.sl2 = -(h / 2) / (w / 2);

  this.xx = (h / 2) / (sl1 - s2l);
  this.yy = xx * sl1;

  return Math.sqrt(Math.pow(xx, 2) + Math.pow(yy, 2));
}

//This function checks of collisions.
//The character codes for different shapes are:
//r - rectangle
//e - ellipse
//d - diamond
//p - precise (not yet supported)
function checkCollision(sh1, centX1, centY1, w1, h1, rot1, sh2, centX2, centY2, w2, h2, rot2)
{
  //Calculate the direction the line from the center should be based on direction from one mask to the other and rotation.
  this.dir1 = (centY2 - centY1) / (centX2 - centX1) * 180 / Math.PI + rot1;
  this.dir2 = (centY1 - centY2) / (centX1 - centX2) * 180 / Math.PI + rot2;
  
  //Fix the directions so that they are usable.
  while (dir1 >= 360)
    dir1 -= 360;
  while (dir1 < 0)
    dir1 += 360;

  while (dir2 >= 360)
    dir2 -= 360;
  while (dir2 < 0)
    dir2 += 360;
  
  //Find the distance from center to edge for each mask.
  if (sh1 == "r")
    this.l1 = lengthRectangle(w1, h1, dir1);
  if (sh1 == "e")
    this.l1 = lengthEllipse(w1, h1, dir1);
  if (sh1 == "d")
    this.l1 = lengthDiamond(w1, h1, dir1);
  
  if (sh2 == "r")
    this.l2 = lengthRectangle(w2, h2, dir2);
  if (sh2 == "e")
    this.l2 = lengthEllipse(w2, h2, dir2);
  if (sh2 == "d")
    this.l2 = lengthDiamond(w2, h2, dir2);
	
  //Check if the masks are close enough to collide.
  if (Math.sqrt(Math.pow(centX1 - centX2, 2) + Math.pow(centY1 - centY2, 2)) < l1 + l2)
    return true;
  else
    return false;
}