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
if (!window.requestAnimationFrame)
{
	window.requestAnimationFrame = ( function() {
			return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			function () {
				setTimeout(eventDraw, 1000/fps);
			};
		} )();
}
function requestAnimFrame()
{
	return window.requestAnimationFrame(eventDraw);
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
function drawRectangle(x1, y1, x2, y2, fill)
{
  if (fill === false)
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
  else if (text.indexOf("~a:") > -1) //Hyperlinks
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
function drawCircle(x, y, r, outline)
{
	curcon.beginPath();
	curcon.arc(x, y, r, 0, pi*2, outline);
	curcon.stroke();
	if (outline === false)
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
	drawRectangle(0, 0, canvas.width, canvas.height, true);
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

function makeColorRGB(r, g, b)
{
	return "#" + toHex(r) + toHex(g) + toHex(b);
}

//Adapted from (basically copied) http://www.easyrgb.com/math.html.
function makeColorHSV(h, s, v)
{
	this.r = null;
	this.g = null;
	this.b = null;
	
	h /= 255;
	s /= 255;
	v /= 255;
	
	if (s == 0)
	{
		r = v * 255;
		g = v * 255;
		b = v * 255;
	}
	else
	{
		this.var_h = h * 6;
		if (var_h == 6)
			var_h = 0;
		this.var_i = int(var_h);
		this.var_1 = V * ( 1 - S );
		var_2 = V * ( 1 - S * ( var_h - var_i ) );
		var_3 = V * ( 1 - S * ( 1 - ( var_h - var_i ) ) );

		if      ( var_i == 0 ) { this.var_r = v     ; this.var_g = var_3 ; this.var_b = var_1 ;}
		else if ( var_i == 1 ) { this.var_r = var_2 ; this.var_g = v     ; this.var_b = var_1 ;}
		else if ( var_i == 2 ) { this.var_r = var_1 ; this.var_g = v     ; this.var_b = var_3 ;}
		else if ( var_i == 3 ) { this.var_r = var_1 ; this.var_g = var_2 ; this.var_b = v     ;}
		else if ( var_i == 4 ) { this.var_r = var_3 ; this.var_g = var_1 ; this.var_b = v     ;}
		else                   { this.var_r = v     ; this.var_g = var_1 ; this.var_b = var_2 ;}

		r = var_r * 255;
		g = var_g * 255;
		b = var_b * 255;
	}
	return "#" + toHex(r) + toHex(g) + toHex(b);
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

function dsListSort(id, ascending)
{
	for (this.index = 0; index < id.length - 1; index++)
	{
		this.min = index;
		for (this.scan = index + 1; scan < id.length; scan++)
			if (isNaN(id[min]))
				if (isNaN(id[scan]))
				{
					if (id[min].compareTo(id[scan]) > 0)
						min = scan;
				}
				else
					min = scan;
			else if (!isNaN(id[scan]))
				if (id[scan] < id[min])
					min = scan;
		this.tmp = id[index];
		id[index] = id[min];
		id[min] = tmp;
	}
	
	if (!acsending)
		id.Reverse();
}
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
function windowSetCursor(c)
{
	drawSetCursor(c);
}
/////////////////
//Sound functions
/////////////////
function soundPlay(snd)
{
	var i = sounds.length;
	sounds[i] = new Audio();
	sounds[i].src = snd.src;
	sounds[i].volume = volume;
	sounds[i].load();
	sounds[i].play();
}
function soundLoop(snd)
{
	var i = sounds.length;
	sounds[i] = new Audio();
	sounds[i].src = snd.src;
	sounds[i].volume = volume;
	sounds[i].loop = true;
	sounds[i].load();
	sounds[i].play();
}
function soundStop(snd)
{
	for (var i=0;i<sounds.length;i++)
	{
		if (sounds[i].src == snd.src)
		{
			sounds[i].pause();
			sounds.splice(i, 1);
		}
	}
}
function soundStopAll()
{
	for (var i=0;i<sounds.length;i++)
	{
		sounds[i].pause();
	}
	sounds = new Array();
}
function soundIsPlaying()
{
	for (var i=0;i<sounds.length;i++)
	{
		if (sounds[i].src == snd.src)
		{
			return true;
		}
	}
	return false;
}
function soundVolume(snd, vol)
{
	for (var i=0;i<sounds.length;i++)
	{
		if (sounds[i].src == snd.src)
		{
			sounds[i].volume = vol;
		}
	}
}
function soundGlobalVolume(vol)
{
	volume = vol;
	for (var i=0;i<sounds.length;i++)
	{
		sounds[i].volume = volume;
	}
}
function soundFade(snd, v, t)
{
	for (var i=0;i<sounds.length;i++)
	{
		if (sounds[i].src == snd.src)
		{
			sounds[i].volume += (v-sounds[i].volume)/t;
			setTimeout(soundFade, v, t--);
		}
	}
}
function soundPan(snd, v)
{
	for (var i=0;i<sounds.length;i++)
	{
		if (sounds[i].src == snd.src)
		{
			sounds[i].pan = v;
			//HTML5 can't pan sounds yet
		}
	}
}
function soundBackgroundTempo(snd, f)
{
	for (var i=0;i<sounds.length;i++)
	{
		if (sounds[i].src == snd.src)
		{
			sounds[i].playbackRate *= f;
		}
	}
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
function instanceFind(obj, n)
{
	return obj.id[n];
}
function instanceExists(obj)
{
	return (obj == null) ? false : true;
}
function instanceNumber(obj)
{
	if (obj == all)
	{
		return glin.length;
	}
	return obj.id.length;
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

//////////////////
//Collision System
//////////////////

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

/////////////////
//Particle System
/////////////////

//Functions necessary.

function sortDepth(a, b)
{
	return b.depth - a.depth;
}

function sortNum(a, b)
{
	return a - b;
}

//This returns a random number from 0 to x. If weight is true, it is more likely to be near x. Otherwise it is more likely to be near 0.
function randomWeight(x, weight)
{
	this.ar = new Array();
	for (var a = 0; a < 6; a++)
		ar[a] = Math.random() * x;
	ar.sort(sortNum);
	if (weight)
		return ar[Math.round(Math.random() * 2) + 3];
	else
		return ar[Math.round(Math.random() * 2)];
}

function drawParticle(shape, x, y, subimg, xscale, yscale, angle, color, alpha, blend)
{
	this.xx = 0;
	this.yy = 0;
	if (shape.xorig != undefined)
		xx = shape.xorig;
	if (shape.yorig != undefined)
		yy = shape.yorig;
	image = shape;
	if (shape.colors != undefined && color.toUpperCase() != cWhite)
	{
		if (shape.colors.indexOf(stringUpper(color)) == -1)
			shape.colors[stringUpper(color)] = imageBlend(shape, color);
		image = shape.colors[stringUpper(color)];
	}
	curcon.save();
	curcon.translate(x, y);
	curcon.rotate(angle * (pi / 180));
	curcon.scale(xscale, yscale);
	curcon.globalAlpha = alpha;
	if (blend == true)
		curcon.globalCompositeOperation = "lighter";
	else
		curcon.globalCompositeOperation = "source-over";
		
	//Subimages are kept in case the particle is a sprite.
	if (shape.siwidth != undefined)
		curcon.drawImage(image, floor(subimg) * shape.siwidth, 0, shape.siwidth, shape.height, -xx * xscale, -yy * yscale, shape.siwidth, shape.height);
	else
		curcon.drawImage(image, floor(subimg) * shape.width, 0, shape.width, shape.height, -xx * xscale, -yy * yscale, shape.width, shape.height);
	curcon.restore();
}

function mixColorRandom(col1, col2)
{
	col1 = col1.replace("#", "");
	this.rgb1 = parseInt(col, 16);
 
	this.red1 = (rgb1 & (255 << 16)) >> 16;
	this.green1 = (rgb1 & (255 << 8)) >> 8;
	this.blue1 = (rgb1 & 255);
	
	col2 = col2.replace("#", "");
	this.rgb2 = parseInt(col, 16);
 
	this.red2 = (rgb2 & (255 << 16)) >> 16;
	this.green2 = (rgb2 & (255 << 8)) >> 8;
	this.blue2 = (rgb2 & 255);
	
	this.red = Math.round(Math.random() * Math.abs(red1 - red2) + Math.min(red1, red2));
	this.green = Math.round(Math.random() * Math.abs(green1 - green2) + Math.min(green1, green2));
	this.blue = Math.round(Math.random() * Math.abs(blue1 - blue2) + Math.min(blue1, blue2));
	
	this.str = "#" + red.toString(16) + green.toString(16) + blue.toString(16);
	
	return str;
}

function toHex(num)
{
	this.str = num.toString(16);
	return (str.length == 1) ? "0" + str : str;
}
function mixColorAmount(col1, col2, amt1, amt2)
{
	col1 = col1.replace("#", "");
	this.rgb1 = parseInt(col1, 16);
 
	this.red1 = (rgb1 & (255 << 16)) >> 16;
	this.green1 = (rgb1 & (255 << 8)) >> 8;
	this.blue1 = (rgb1 & 255);
	
	col2 = col2.replace("#", "");
	this.rgb2 = parseInt(col2, 16);
 
	this.red2 = (rgb2 & (255 << 16)) >> 16;
	this.green2 = (rgb2 & (255 << 8)) >> 8;
	this.blue2 = (rgb2 & 255);
	
	this.red = Math.round(red1 * amt1 + red2 * amt2);
	this.green = Math.round(green1 * amt1 + green2 * amt2);
	this.blue = Math.round(blue1 * amt1 + blue2 * amt2);
	
	this.str = "#" + toHex(red) + toHex(green) + toHex(blue);
	
	return str;
}

//Actual GM functions.

//Attractors
function partAttractorCreate(ps)
{
	this.tmp = new ParticleAttractor();
	ps.attractors[ps.attractors.length] = tmp;
	return tmp;
}
function partAttractorDestroy(ps, ind)
{
	ps.attractors.splice(ps.attractors.indexOf(ind), 1);
	delete ind;
}
function partAttractorDestroyAll(ps)
{
	for (var i = 0; i < ps.attractors.length; i++)
		delete ps.attractors[i];
	ps.attractors.length = 0;
}
function partAttractorExists(ps, ind)
{
	return (ps.attractors.indexOf(ind) != -1);
}
function partAttractorClear(ps, ind)
{
	ind.x = 0;
	ind.y = 0;
	ind.dist = 0;
	ind.kind = psForceConstant;
	ind.additive = true;
}
function partAttractorPosition(ps, ind, x, y)
{
	ind.x = x;
	ind.y = y;
}
function partAttractorForce(ps, ind, dist, kind, addative)
{
	ind.dist = dist;
	ind.kind = kind;
	ind.additive = additive;
}

//Changers
function partChangerCreate(ps)
{
	this.tmp = ParticleChanger();
	ps.changers[ps.changers.length] = tmp;
	return tmp;
}
function partChangerDestroy(ps, ind)
{
	ps.changers.splice(ps.changers.indexOf(ind), 1);
	delete ind;
}
function partChangerDestroyAll(ps)
{
	for (var i = 0; i < ps.changers.length; i++)
		delete ps.changers[i];
	ps.changers.length = 0;
}
function partChangerExists(ps, ind)
{
	return (ps.changers.indexOf(ind) != -1);
}
function partChangerClear(ps, ind)
{
	ind.xMin = 0;
	ind.xMax = 0;
	ind.yMin = 0;
	ind.yMax = 0;
	ind.shape = psShapeRectangle;
	ind.kind = psChangeAll;
	ind.type1 = null;
	ind.type2 = null;
}
function partChangerRegion(ps, ind, xMin, xMax, yMin, yMax, shape)
{
	ind.xMin = xMin;
	ind.xMax = xMax;
	ind.yMin = yMin;
	ind.yMax = yMax;
	ind.shape = shape;
}
function partChangerTypes(ps, ind, type1, type2)
{
	ind.type1 = type1;
	ind.type2 = type2;
}
function partChangerKind(ps, ind, kind)
{
	ind.kind = kind;
}

//Deflectors
function partDeflectorCreate(ps)
{
	this.tmp = ParticleChanger();
	ps.deflectors[ps.deflectors.length] = tmp;
	return tmp;
}
function partDeflectorDestroy(ps, ind)
{
	ps.deflectors.splice(ps.deflectors.indexOf(ind), 1);
	delete ind;
}
function partDeflectorDestroyAll(ps)
{
	for (var i = 0; i < ps.deflectors.length; i++)
		delete ps.deflectors[i];
	ps.deflectors.length = 0;
}
function partDeflectorExists(ps, ind)
{
	return (ps.deflectors.indexOf(ind) != -1);
}
function partDeflectorClear(ps, ind)
{
	ind.xMin = 0;
	ind.xMax = 0;
	ind.yMin = 0;
	ind.yMax = 0;
	ind.kind = psDeflectHorizontal;
	ind.friction = 0;
}
function partDeflectorRegion(ps, ind, xMin, xMax, yMin, yMax)
{
	ind.xMin = xMin;
	ind.xMax = xMax;
	ind.yMin = yMin;
	ind.yMax = yMax;
}
function partDeflectorKind(ps, ind, kind)
{
	ind.kind = kind;
}
function partDeflectorFriction(ps, ind, friction)
{
	ind.friction = friction;
}

//Destroyers
function partDestroyerCreate(ps)
{
	this.tmp = ParticleChanger();
	ps.destroyers[ps.destroyers.length] = tmp;
	return tmp;
}
function partDestroyerDestroy(ps, ind)
{
	ps.destroyers.splice(ps.destroyers.indexOf(ind), 1);
	delete ind;
}
function partDestroyerDestroyAll(ps)
{
	for (var i = 0; i < ps.destroyers.length; i++)
		delete ps.destroyers[i];
	ps.destroyers.length = 0;
}
function partDestroyerExists(ps, ind)
{
	return (ps.destroyers.indexOf(ind) != -1);
}
function partDestroyerClear(ps, ind)
{
	ind.xMin = 0;
	ind.xMax = 0;
	ind.yMin = 0;
	ind.yMax = 0;
	ind.shape = spShapeRectangle;
}
function partDestroyerRegion(ps, ind, xMin, xMax, yMin, yMax, shape)
{
	ind.xMin = xMin;
	ind.xMax = xMax;
	ind.yMin = yMin;
	ind.yMax = yMax;
	ind.shape = shape;
}

//Emitters
function partEmitterCreate(ps)
{
	this.tmp = new ParticleEmitter();
	ps.emitters[ps.emitters.length] = tmp;
	return tmp;
}
function partEmitterDestroy(ps, ind)
{
	ps.emitters.splice(ps.emitters.indexOf(ind), 1);
	delete ind;
}
function partEmitterDestroyAll(ps)
{
	for (var i = 0; i < ps.emitters.length; i++)
		delete ps.emitters[i];
	ps.emitters.length = 0;
}
function partEmitterExists(ps, ind)
{
	return (ps.emitters.indexOf(ind) != -1);
}
function partEmitterClear(ps, ind)
{
	ind.xMin = 0;
	ind.xMax = 0;
	ind.yMin = 0;
	ind.yMax = 0;
	ind.shape = psShapeRectangle;
	ind.distribution = psDistrLinear;
	ind.stream = new Array();
	ind.number = new Array();
	ind.count = new Array();
}
function partEmitterRegion(ps, ind, xmin, xmax, ymin, ymax, shape, distribution)
{
	ind.xMin = xmin;
	ind.xMax = xmax;
	ind.yMin = ymin;
	ind.yMax = ymax;
	ind.shape = shape;
	ind.distribution = distribution;
}
function partEmitterBurst(ind, emit, parttype, number)
{
	for (c = 0; c < number; c++)
	{
		this.dir = Math.random() * 360;
		
		if (emit.shape == psShapeRectangle)
			this.length = lengthRectangle(Math.abs(emit.xMax - emit.xMin), Math.abs(emit.yMax - emit.yMin), dir);
		if (emit.shape == psShapeEllipse)
			this.length = lengthEllipse(Math.abs(emit.xMax - emit.xMin), Math.abs(emit.yMax - emit.yMin), dir);
		if (emit.shape == psShapeDiamond)
			this.length = lengthDiamond(Math.abs(emit.xMax - emit.xMin), Math.abs(emit.yMax - emit.yMin), dir);
		if (emit.shape == psShapeLine)
			this.length = Math.sqrt(Math.pow(Math.abs(emit.xMax - emit.xMin), 2) + Math.pow(Math.abs(emit.yMax - emit.yMin), 2)) / 2;
		
		if (emit.distribution == psDistrLinear)
			length = Math.random() * length;
		if (emit.distribution == psDistrGaussian)
			length = randomWeight(length, false);
		if (emit.distribution == psDistrInvgaussian)
			length = randomWeight(length, true);
		
		if (emit.shape == psShapeLine)
			if (dir >= 180)
			{
				this.x = (emit.xMax == emit.xMin) ? emit.xMax : (emit.xMax + emit.xMin) / 2 + Math.cos(Math.abs(emit.yMax - emit.yMin) / Math.abs(emit.xMax - emit.xMin)) * length;
				this.y = (emit.yMax == emit.yMin) ? emit.yMax : (emit.yMax + emit.yMin) / 2 - Math.sin(Math.abs(emit.yMax - emit.yMin) / Math.abs(emit.xMax - emit.xMin)) * length;
			}
			else
			{
				this.x = (emit.xMax == emit.xMin) ? emit.xMax : (emit.xMax + emit.xMin) / 2 - Math.cos(Math.abs(emit.yMax - emit.yMin) / Math.abs(emit.xMax - emit.xMin)) * length;
				this.y = (emit.yMax == emit.yMin) ? emit.yMax : (emit.yMax + emit.yMin) / 2 + Math.sin(Math.abs(emit.yMax - emit.yMin) / Math.abs(emit.xMax - emit.xMin)) * length;
			}
		else
		{
			this.x = (emit.xMax == emit.xMin) ? emit.xMax : (emit.xMax + emit.xMin) / 2 + Math.cos(dir*Math.PI / 180) * length;
			this.y = (emit.yMax == emit.yMin) ? emit.yMax : (emit.yMax + emit.yMin) / 2 + -Math.sin(dir*Math.PI / 180) * length;
		}
		
		partParticlesCreate(ind, x, y, parttype, number);
	}
}
function partEmitterStream(ps, ind, parttype, number)
{
	ind.stream[ind.stream.length] = parttype;
	ind.number[ind.number.length] = number;
	ind.count[ind.count.length] = 0;
}

//Systems
function partSystemCreate()
{
	this.tmp = new ParticleSystem();
	systems[systems.length] = tmp;
	return tmp;
}
function partSystemDestroy(ind)
{
	systems.splice(systems.indexOf(ind), 1);
	delete ind;
}
function partSystemExists(ind)
{
	return (systems.indexOf(ind) != -1);
}
function partSystemClear(ind)
{
	partAttractorDestroyAll(ind);
	partChangerDestroyAll(ind);
	partDeflectorDestroyAll(ind);
	partDestroyerDestroyAll(ind);
	partEmitterDestroyAll(ind);
	
	for (var i = 0; i < ind.particles.length; i++)
		delete ind.particles[i];
	ind.particles.length = 0;
	
	ind.order = true;
	ind.depth = 0;
	
	ind.x = 0;
	ind.y = 0;
	
	ind.autoUpdate = true;
	ind.autoDraw = true;
}
function partSystemDrawOrder(ind, oldtonew)
{
	ind.order = oldtonew;
}
function partSystemDepth(ind, depth)
{
	ind.depth = depth;
}
function partSystemPosition(ind, x, y)
{
	ind.x = x;
	ind.y = y;
}
function partSystemAutomaticUpdate(ind, automatic)
{
	ind.autoUpdate = automatic;
}
function partSystemAutomaticDraw(ind, automatic)
{
	ind.autoDraw = automatic;
}
function partSystemUpdate(ind)
{
	if (ind.particles.length > 0)
		for (var i = 0; i < ind.particles.length; i++)
		{
			this.part = ind.particles[i];
			
			//Update position, size, speed, etc.
			part.x += Math.cos(part.dir * Math.PI / 180) * part.speed;
			part.y += -Math.sin(part.dir * Math.PI / 180) * part.speed;
			
			if (part.type2 != null && part.chtype == psChangeMotion)
			{
				part.ang += part.type2.angIncr;
				part.ang += part.type2.angWiggle * (Math.round(Math.random() * 2) - 1);
				
				part.speed += part.type2.speedIncr;
				part.speed += part.type2.speedWiggle * (Math.round(Math.random() * 2) - 1);
			
				part.dir += part.type2.dirIncr;
				part.dir += part.type2.dirWiggle * (Math.round(Math.random() * 2) - 1);
				
				this.tmphs = lengthdirX(part.speed, part.dir) + lengthdirX(part.type2.gravAmount, part.type2.gravDirection);
				this.tmpvs = lengthdirY(part.speed, part.dir) + lengthdirY(part.type2.gravAmount, part.type2.gravDirection);
				
				part.speed = Math.sqrt(Math.pow(tmphs, 2) + Math.pow(tmpvs, 2));
				part.dir = pointDirection(0, 0, tmphs, tmpvs);
			}
			else
			{
				part.ang += part.type.angIncr;
				part.ang += part.type.angWiggle * (Math.round(Math.random() * 2) - 1);
				
				part.speed += part.type.speedIncr;
				part.speed += part.type.speedWiggle * (Math.round(Math.random() * 2) - 1);
			
				part.dir += part.type.dirIncr;
				part.dir += part.type.dirWiggle * (Math.round(Math.random() * 2) - 1);
				
				this.tmphs = lengthdirX(part.speed, part.dir) + lengthdirX(part.type.gravAmount, part.type.gravDirection);
				this.tmpvs = lengthdirY(part.speed, part.dir) + lengthdirY(part.type.gravAmount, part.type.gravDirection);
				
				part.speed = Math.sqrt(Math.pow(tmphs, 2) + Math.pow(tmpvs, 2));
				part.dir = pointDirection(0, 0, tmphs, tmpvs);
			}
			
			if (part.type2 != null && part.chtype == psChangeShape)
			{
				part.size += part.type2.sizeIncr;
				part.size += part.type2.sizeWiggle * (Math.round(Math.random() * 2) - 1);
			
				if (!(part.type2.colorMix || part.type2.rgb || part.type2.hsv || part.overcolor))
				{
					if (part.time / part.life <= 1 / 2)
						part.color = mixColorAmount(part.type2.color1, part.type2.color2, 1 - part.time / (part.life / 2), part.time / (part.life / 2))
					else
						part.color = mixColorAmount(part.type2.color2, part.type2.color3, 1 - ((part.time - (part.life / 2)) / (part.life / 2)), ((part.time - (part.life / 2)) / (part.life / 2)))
				}
			
				if (part.type2.animat)
					if (part.type2.stretch)
						part.subimg += (part.type2.shape.width / part.type2.shape.siwidth) / life;
					else
						part.subimg++;
			}
			else
			{
				part.size += part.type.sizeIncr;
				part.size += part.type.sizeWiggle * (Math.round(Math.random() * 2) - 1);
			
				if (!(part.type.colorMix || part.type.rgb || part.type.hsv))
				{
					if (part.time / part.life <= 1 / 2)
						part.color = mixColorAmount(part.type.color1, part.type.color2, 1 - part.time / (part.life / 2), part.time / (part.life / 2))
					else
						part.color = mixColorAmount(part.type.color2, part.type.color3, 1 - ((part.time - (part.life / 2)) / (part.life / 2)), ((part.time - (part.life / 2)) / (part.life / 2)))
				}
			
				if (part.type.animat)
					if (part.type.stretch)
						part.subimg += (part.type.shape.width / part.type.shape.siwidth) / life;
					else
						part.subimg++;
			}
			
			
			if (part.time / part.life <= 1 / 2)
				part.alpha = (part.time / (part.life / 2)) * part.type.alpha1 + (1 - part.time / (part.life / 2)) * part.type.alpha2;
			else
				part.alpha = (((part.time - (part.life / 2)) / (part.life / 2))) * part.type.alpha2 + (1 - ((part.time - (part.life / 2)) / (part.life / 2))) * part.type.alpha3;
			
			//Create particles each step.
			if (part.type.stepNumber != 0)
				if (part.type.stepNumber > 0)
					partParticlesCreate(ind, part.x, part.y, part.type.stepType, part.type.stepNumber);
				else
				{
					part.stepCount++;
					if (part.stepCount = Math.floor(-part.type.stepNumber))
						{
							partParticlesCreate(ind, part.x, part.y, part.type.stepType, 1);
							part.stepCount = 0;
						}
				}
			
			//Update based on attractors.
			if (ind.attractors.length > 0)
				for (var a = 0; a < ind.attractors.length; a++)
				{
					this.dist = Math.sqrt(Math.pow(ind.attractors[a].x - part.x, 2) + Math.pow(ind.attractors[a].y - part.y, 2));
					if (dist < ind.attractors[a].dist)
					{
						if (ind.attractors[a].kind == psForceConstant)
							this.force = ind.attractors[a].force;
						else if (ind.attractors[a].kind == psForceLinear)
							this.force = ind.attractors[a].force * (1 - dist / ind.attractors[a].dist);
						else if (ind.attractors[a].kind == psForceQuadratic)
							this.force = Math.pow(Math.sqrt(ind.attractors[a].force) * (1 - dist / ind.attractors[a].dist), 2);
						
						if (ind.attractors[a].additive == true)
						{
							part.speed += force;
							part.dir += sign(pointDirection(part.x, pary.y, attractors[a].x, attractors[a].y) - part.dir) * force / pointDirection(part.x, pary.y, attractors[a].x, attractors[a].y);
						}
						else
						{
							part.x += lengthdirX(force, pointDirection(part.x, pary.y, attractors[a].x, attractors[a].y));
							part.y += lengthdirY(force, pointDirection(part.x, pary.y, attractors[a].x, attractors[a].y));
						}
					}
				}
			
			//Update based on changers.
			if (ind.changers.length > 0)
				for (var a = 0; a < ind.changers.length; a++)
				{
					this.centX = (ind.changers[a].xMin + ind.changers[a].xMax) / 2;
					this.centY = (ind.changers[a].yMin + ind.changers[a].yMax) / 2;
					this.w = Math.abs(ind.changers[a].xMin - ind.changers[a].xMax);
					this.h = Math.abs(ind.changers[a].yMin - ind.changers[a].yMax);
					this.dir = ((part.y - centY) / (part.x - centX)) / Math.PI * 180;
					
					if (ind.changers[a].shape == psShapeRectangle)
						this.length = lengthRectangle(w, h, dir);
					else if (ind.changers[a].shape == psShapeEllipse)
						this.length = lengthEllipse(w, h, dir);
					else if (ind.changers[a].shape == psShapeDiamond)
						this.length = lengthDiamond(w, h, dir);
					
					if (Math.sqrt(Math.pow(centX - part.x, 2) + Math.pow(centY - part.y, 2)) <= length && part.type2 == null && part.type == ind.changers[a].type1)
					{
						if (ind.changers[a].kind == psChangeMotion)
						{
							part.type2 = ind.changers[a].type2;
							part.chtype = psChangeMotion;
						}
						else if (ind.changers[a].kind == psChangeShape)
						{
							part.type2 = ind.changers[a].type2;
							part.chtype = psChangeShape;
							if (part.type2.colorMix)
								part.color = mixColorRandom(part.type2.color1, part.type2.color2)
							else if (part.type2.rgb)
							{
								this.tr = Math.round(Math.random() * (part.type2.rMax - part.type2.rMin) + part.type2.rMin);
								this.tg = Math.round(Math.random() * (part.type2.gMax - part.type2.gMin) + part.type2.gMin);
								this.tb = Math.round(Math.random() * (part.type2.bMax - part.type2.bMin) + part.type2.bMin);
								part.color = makeColorRGB(tr, tg, tb);
							}
							else if (part.type2.hsv)
							{
								this.th = Math.round(Math.random() * (part.type2.hMax - part.type2.hMin) + part.type2.hMin);
								this.ts = Math.round(Math.random() * (part.type2.sMax - part.type2.sMin) + part.type2.sMin);
								this.tv = Math.round(Math.random() * (part.type2.vMax - part.type2.vMin) + part.type2.vMin);
								part.color = makeColorHSV(th, ts, tv);
							}
						}
						else if (ind.changers[a].kind == psChangeAll)
						{
							part.type == ind.changers[a].type2;
							if (part.type.colorMix)
								part.color = mixColorRandom(part.type.color1, part.type.color2)
							else if (part.type.rgb)
							{
								this.tr = Math.round(Math.random() * (part.type.rMax - part.type.rMin) + part.type.rMin);
								this.tg = Math.round(Math.random() * (part.type.gMax - part.type.gMin) + part.type.gMin);
								this.tb = Math.round(Math.random() * (part.type.bMax - part.type.bMin) + part.type.bMin);
								part.color = makeColorRGB(tr, tg, tb);
							}
							else if (part.type.hsv)
							{
								this.th = Math.round(Math.random() * (part.type.hMax - part.type.hMin) + part.type.hMin);
								this.ts = Math.round(Math.random() * (part.type.sMax - part.type.sMin) + part.type.sMin);
								this.tv = Math.round(Math.random() * (part.type.vMax - part.type.vMin) + part.type.vMin);
								part.color = makeColorHSV(th, ts, tv);
							}
						}
					}
				}
				
			//Update based on deflectors
			if (ind.deflectors.length > 0)
				for (var a = 0; a < ind.deflectors.length; a++)
				{
					this.centX = (ind.deflectors[a].xMin + ind.deflectors[a].xMax) / 2;
					this.centY = (ind.deflectors[a].yMin + ind.deflectors[a].yMax) / 2;
					this.w = Math.abs(ind.deflectors[a].xMin - ind.deflectors[a].xMax);
					this.h = Math.abs(ind.deflectors[a].yMin - ind.deflectors[a].yMax);
					this.dir = ((part.y - centY) / (part.x - centX)) / Math.PI * 180;
					
					this.length = lengthRectangle(w, h, dir);
					
					if (Math.sqrt(Math.pow(centX - part.x, 2) + Math.pow(centY - part.y, 2)) <= length)
					{
						part.speed -= ind.deflectors[a].friction;
						if (ind.deflectors[a].kind == psDeflectHorizontal)
							part.dir = pointDirection(0, 0, -lengthDirX(part.speed, part.dir), lengthDirY(part.speed, part.dir));
						else if (ind.deflectors[a].kind == psDeflectVertical)
							part.dir = pointDirection(0, 0, lengthDirX(part.speed, part.dir), -lengthDirY(part.speed, part.dir));
					}
				}
				
			//Update based on destroyers
			if (ind.destroyers.length > 0)
				for (var a = 0; a < ind.destroyers.length; a++)
				{
					this.centX = (ind.destroyers[a].xMin + ind.destroyers[a].xMax) / 2;
					this.centY = (ind.destroyers[a].yMin + ind.destroyers[a].yMax) / 2;
					this.w = Math.abs(ind.destroyers[a].xMin - ind.destroyers[a].xMax);
					this.h = Math.abs(ind.destroyers[a].yMin - ind.destroyers[a].yMax);
					this.dir = ((part.y - centY) / (part.x - centX)) / Math.PI * 180;
					
					if (ind.destroyers[a].shape == psShapeRectangle)
						this.length = lengthRectangle(w, h, dir);
					else if (ind.destroyers[a].shape == psShapeEllipse)
						this.length = lengthEllipse(w, h, dir);
					else if (ind.destroyers[a].shape == psShapeDiamond)
						this.length = lengthDiamond(w, h, dir);
					
					if (Math.sqrt(Math.pow(centX - part.x, 2) + Math.pow(centY - part.y, 2)) <= length)
					{
						ind.particles.splice(ind.particles.indexOf(part), 1);
						delete part;
						i--;
					}		
				}
			
			if (part != undefined && part != null)
			{
				part.time += 1;
	
				if (part.time >= part.life)
				{
					if (part.type.deathNumber != 0)
						partParticlesCreate(ind, part.x, part.y, part.type.deathType, part.type.deathNumber);
					ind.particles.splice(ind.particles.indexOf(part), 1);
					delete part;
					i--;
				}
			}
		}

		
	//Create particles from emitters.
	if (ind.emitters.length > 0)
		for (var i = 0; i < ind.emitters.length; i++)
		{
			this.emit = ind.emitters[i];
			if (emit.stream.length > 0)
				for (var a = 0; a < emit.stream.length; a++)
					if (emit.number[a] >= 0)
						partEmitterBurst(ind, emit, emit.stream[a], emit.number[a]);
					else
					{
						emit.count[a]++;
						if (emit.count[a] == Math.floor(-emit.number[a]))
						{
							partEmitterBurst(ind, emit, emit.stream[a], 1);
							emit.count[a] = 0;
						}
					}
		}
}
function partSystemDrawit(ind)
{
	if (ind.particles.length > 0)
		if (ind.order == true)
		{
			for (var i = 0; i < ind.particles.length; i++)
			{
				this.particle = ind.particles[i];
				if (ind.particles[i] != null)
				{
					if (particle.type2 != null && particle.chtype == psChangeShape)
						this.shape = particle.type2.shape;
					else
						this.shape = particle.type.shape;
					drawParticle(shape, ind.x + particle.x, ind.y + particle.y, particle.subimg, particle.size * particle.type.xscale, particle.size * particle.type.yscale, particle.ang, particle.color, particle.alpha, particle.type.blend);
				}
			}
		}
		else
		{
			for (var i = ind.particles.length - 1; i >= 0; i--)
			{
				this.particle = ind.particles[i];
				
				if (ind.particles[i] != null)
				{
					if (particle.type2 != null && particle.chtype == psChangeShape)
						this.shape = particle.type2.shape;
					else
						this.shape = particle.type.shape;
					drawParticle(shape, ind.x + particle.x, ind.y + particle.y, particle.subimg, particle.size * particle.type.xscale, particle.size * particle.type.yscale, particle.ang + particle.dir * particle.angRelative, particle.color, particle.alpha, particle.type.blend);
				}
			}
		}
}
function partParticlesCreate(ind, x, y, type, number)
{
	for (c = 0; c < number; c++)
	{
		this.part2 = new Particle();
		part2.type = type;
		part2.size = Math.random() * (part2.type.sizeMax - part2.type.sizeMin) + part2.type.sizeMin;
		part2.ang = Math.random() * (part2.type.angMax - part2.type.angMin) + part2.type.angMin;
		
		if (part2.type.colorMix)
			part2.color = mixColorRandom(part2.type.color1, part2.type.color2);
		else if (part2.type.rgb)
		{
			this.tr = Math.round(Math.random() * (part2.type.rMax - part2.type.rMin) + part2.type.rMin);
			this.tg = Math.round(Math.random() * (part2.type.gMax - part2.type.gMin) + part2.type.gMin);
			this.tb = Math.round(Math.random() * (part2.type.bMax - part2.type.bMin) + part2.type.bMin);
			part2.color = makeColorRGB(tr, tg, tb);
		}
		else if (part2.type.hsv)
		{
			this.th = Math.round(Math.random() * (part2.type.hMax - part2.type.hMin) + part2.type.hMin);
			this.ts = Math.round(Math.random() * (part2.type.sMax - part2.type.sMin) + part2.type.sMin);
			this.tv = Math.round(Math.random() * (part2.type.vMax - part2.type.vMin) + part2.type.vMin);
			part2.color = makeColorHSV(th, ts, tv);
		}
		else
			part2.color = part2.type.color1;
			
		part2.alpha = part2.type.alpha1;
		part2.life = Math.random() * (part2.type.lifeMax - part2.type.lifeMin) + part2.type.lifeMin;
		part2.speed = Math.random() * (part2.type.speedMax - part2.type.speedMin) + part2.type.speedMin;
		part2.dir = Math.random() * (part2.type.dirMax - part2.type.dirMin) + part2.type.dirMin;
		part2.x = x;
		part2.y = y;
		
		if (part2.type.rand && part2.type.shape.siwidth != undefined)
			part2.subimg = Math.round(Math.random() * (part2.type.shape.width / part2.type.shape.siwidth));
		else
			part2.subimg = 0;
		
		ind.particles[ind.particles.length] = part2;
	}
}
function partParticlesCreateColor(ind, x, y, type, color, number)
{
	for (c = 0; c < number; c++)
	{
		this.part = new Particle();
		part.type = type;
		part.size = Math.random() * (part.type.sizeMax - part.type.sizeMin) + part.type.sizeMin;
		part.ang = Math.random() * (part.type.angMax - part.type.angMin) + part.type.angMin;
		
		part.color = color;
		part.overcolor = true;
			
		part.alpha = part.type.alpha1;
		part.life = Math.random() * (part.type.lifeMax - part.type.lifeMin) + part.type.lifeMin;
		part.speed = Math.random() * (part.type.speedMax - part.type.speedMin) + part.type.speedMin;
		part.dir = Math.random() * (part.type.dirMax - part.type.dirMin) + part.type.dirMin;
		part.x = x;
		part.y = y;
		
		if (part.type.rand && part.type.shape.siwidth != undefined)
			part.subimg = Math.round(Math.random() * (part.type.shape.width / part.type.shape.siwidth));
		else
			part.subimg = 0;
		
		ind.particles[ind.particles.length] = part;
	}
}
function partParticlesClear(ind)
{
	for (var i = 0; i < ind.particles.length; i++)
		delete ind.particles[i];
	ind.particles.length = 0;
}
function partParticlesCount(ind)
{
	return ind.particles.length;
}

function partTypeCreate()
{
	return new ParticleType();
}
function partTypeDestroy(ind)
{
	delete ind;
}
function partTypeExists(ind)
{
	return (ind != undefined && ind != null);
}
function partTypeClear(ind)
{
	ind.shape = ptShapePixel;
	
	ind.sizeMin = 1;
	ind.sizeMax = 1;
	ind.sizeIncr = 0;
	ind.sizeWiggle = 0;
	
	ind.xscale = 1;
	ind.yscale = 1;
	
	ind.angMin = 0;
	ind.angMax = 0;
	ind.angIncr = 0;
	ind.angWiggle = 0;
	ind.angRelative = 0;
	
	ind.color1 = cWhite;
	ind.color2 = cWhite;
	ind.color3 = cWhite;
	
	ind.colorMix = false;
	
	ind.rgb = false;
	ind.rMin = 255;
	ind.gMin = 255;
	ind.bMin = 255;
	ind.rMax = 255;
	ind.gMax = 255;
	ind.bMax = 255;
	
	ind.hsv = false;
	ind.hMin = 255;
	ind.sMin = 255;
	ind.vMin = 255;
	ind.hMax = 255;
	ind.sMax = 255;
	ind.vMax = 255;
	
	ind.alpha1 = 1;
	ind.alpha2 = 1;
	ind.alpha3 = 1;
	
	ind.blend = false;
	
	ind.lifeMin = 100;
	ind.lifeMax = 100;
	
	ind.stepNumber = 0;
	ind.stepType = null;
	
	ind.deathNumber = 0;
	ind.deathType = null;
	
	ind.speedMin = 1;
	ind.speedMax = 1;
	ind.speedIncr = 0;
	ind.speedWiggle = 0;
	
	ind.dirMin = 360;
	ind.dirMax = 0;
	ind.dirIncr = 0;
	ind.dirWiggle = 0;
	
	ind.gravAmount = 0;
	ind.gravDirection = 0;
	
	//Only used if it is a sprite
	ind.animat = false;
	ind.stretch = false;
	ind.rand = false;
}
function partTypeShape(ind, shape)
{
	ind.shape = shape;
	ind.animat = false;
	ind.stretch = false;
	ind.rand = false;
}
function partTypeSprite(ind, sprite, animat, stretch, random)
{
	ind.shape = sprite;
	ind.animat = animat;
	ind.stretch = stretch;
	ind.rand = random;
}
function partTypeSize(ind, sizeMin, sizeMax, sizeIncr, sizeWiggle)
{
	ind.sizeMin = sizeMin;
	ind.sizeMax = sizeMax;
	ind.sizeIncr = sizeIncr;
	ind.sizeWiggle = sizeWiggle;
}
function partTypeScale(ind, xscale, yscale)
{
	ind.xscale = xscale;
	ind.yscale = yscale;
}
function partTypeOrientation(ind, angMin, angMax, angIncr, angWiggle, angRelative)
{
	ind.angMin = angMin;
	ind.angMax = angMax;
	ind.angIncr = angIncr;
	ind.angWiggle = angWiggle;
	ind.angRelative = angRelative;
}
function partTypeColor1(ind, color1)
{
	ind.color1 = color1;
	ind.color2 = color1;
	ind.color3 = color1;
	ind.colorMix = false;
	ind.rgb = false;
	ind.hsv = false;
}
function partTypeColor1(ind, color1, color2)
{
	ind.color1 = color1;
	ind.color2 = mixColorAmount(color1, color2, .5, .5);
	ind.color3 = color2;
	ind.colorMix = false;
	ind.rgb = false;
	ind.hsv = false;
}
function partTypeColor3(ind, color1, color2, color3)
{
	ind.color1 = color1;
	ind.color2 = color2;
	ind.color3 = color3;
	ind.colorMix = false;
	ind.rgb = false;
	ind.hsv = false;
}
function partTypeColorMix(ind, color1, color2)
{
	ind.color1 = color1;
	ind.color2 = color2;
	ind.colorMix = true;
	ind.rgb = false;
	ind.hsv = false;
}
function partTypeColorRGB(ind, rMin, rMax, gMin, gMax, bMin, bMax)
{
	ind.colorMix = false;
	ind.rgb = true;
	ind.hsv = false;
	ind.rMin = rMin;
	ind.rMax = rMax;
	ind.gMin = gMin;
	ind.gMax = gMax;
	ind.bMin = bMin;
	ind.bMax = bMax;
}
function partTypeHSV(ind, hMin, hMax, sMin, sMax, vMin, vMax)
{
	ind.colorMix = false;
	ind.rgb = false;
	ind.hsv = true;
	ind.hMin = hMin;
	ind.hMax = hMax;
	ind.sMin = sMin;
	ind.sMax = sMax;
	ind.vMin = vMin;
	ind.vMax = vMax;
}
function partTypeAlpha1(ind, alpha1)
{
	ind.alpha1 = alpha1;
	ind.alpha2 = alpha1;
	ind.alpha3 = alpha1;
}
function partTypeAlpha2(ind, alpha1, alpha2)
{
	ind.alpha1 = alpha1;
	ind.alpha2 = (alpha1 + alpha2) / 2;
	ind.alpha3 = alpha2;
}
function partTypeAlpha3(ind, alpha1, alpha2, alpha3)
{
	ind.alpha1 = alpha1;
	ind.alpha2 = alpha2;
	ind.alpha3 = alpha3;
}
function partTypeBlend(ind, additive)
{
	ind.blend = additive;
}
function partTypeLife(ind, lifeMin, lifeMax)
{
	ind.lifeMin = lifeMin;
	ind.lifeMax = lifeMax;
}
function partTypeStep(ind, stepNumber, stepType)
{
	ind.stepNumber = stepNumber;
	ind.stepType = stepType;
}
function partTypeDeath(ind, deathNumber, deathType)
{
	ind.deathNumber = deathNumber;
	ind.deathType = deathType;
}
function partTypeSpeed(ind, speedMin, speedMax, speedIncr, speedWiggle)
{
	ind.speedMin = speedMin;
	ind.speedMax = speedMax;
	ind.speedIncr = speedIncr;
	ind.speedWiggle = speedWiggle;
}
function partTypeDirection(ind, dirMin, dirMax, dirIncr, dirWiggle)
{
	ind.dirMin = dirMin;
	ind.dirMax = dirMax;
	ind.dirIncr = dirIncr;
	ind.dirWiggle = dirWiggle;
}
function partTypeGravity(ind, gravAmount, gravDir)
{
	ind.gravAmount = gravAmount;
	ind.gravDir = gravDir;
}

////////////////////
//Resource functions
////////////////////
function spriteExists(ind)
{
	if (resource[0][ind] != null)
	{
		return true;
	}
	return false;
}
function spriteGetName(ind)
{
	return resource[0][ind].name;
}
function spriteGetNumber(ind)
{
	return resource[0][ind].numb;
}
function spriteGetWidth(ind)
{
	return resource[0][ind].width;
}
function spriteGetHeight(ind)
{
	return resource[0][ind].height;
}
function spriteGetTransparent(ind)
{
	return false; //For now just change with drawSpriteExt
}
function spriteGetSmooth(ind)
{
	return resource[0][ind].smooth;
}
function spriteGetPreload(ind)
{
	return true; //Sprites are always automatically loaded
}
function spriteGetXoffset(ind)
{
	return resource[0][ind].xorig;
}
function spriteGetYoffset(ind)
{
	return resource[0][ind].yorig;
}