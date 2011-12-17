//Copyright (c) 2011 piluke <pikingqwerty@gmail.com>
//You can find the GitHub repository at https://github.com/piluke/GameMaker-HTML5-Player

var de = document.createElement("div");
de.setAttribute("style", "border: 3px solid black; border-radius: 4px; background: #336699; position: fixed; top: 9px; left: 10px;");
de.style.width = (document.getElementById("maincan").width/2)+"px";
de.style.height = document.getElementById("maincan").height+"px";
document.body.appendChild(de);

function teChange(t)
{
	while (t.value.length > te.width)
	{
		te.style.width = te.style.width.substring(0, te.style.width.length-2)+1+"px";
	}
	console.log(t.value.length+""+te.width);
}

var te = document.createElement("input");
te.setAttribute("type", "text");
te.setAttribute("name", "query");
te.setAttribute("onchange", "teChange(this);");
te.setAttribute("style", "border: 1px dotted black; background: #FFFFA0; position: absolute; bottom: 5px; left: 5px;");
te.style.width = Math.round(de.style.width.substring(0, de.style.width.length-2)/5*4)+"px";
de.appendChild(te);