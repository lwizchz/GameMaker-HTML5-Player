/* 
 * Copyright (C) 2011-12 piluke <pikingqwerty@gmail.com>
 * 
 * This file is part of GHPC.
 * GHPC is free software and comes with ABSOLUTELY NO WARRANTY.
 * See LICENSE for details.
 */

package com.pixelmatrixstudios.ghpc;

import java.awt.*;
import java.awt.event.*;
import java.awt.image.BufferedImage;
import java.awt.image.RenderedImage;

import javax.imageio.ImageIO;
import javax.imageio.stream.FileImageOutputStream;
import javax.imageio.stream.ImageOutputStream;
import javax.swing.*;

import org.lateralgm.file.GmFile;
import org.lateralgm.main.Util;
import static org.lateralgm.main.Util.deRef;
import org.lateralgm.resources.Background;
import org.lateralgm.resources.Font.PFont;
import org.lateralgm.resources.GameSettings;
import org.lateralgm.resources.GmObject;
import org.lateralgm.resources.Path;
import org.lateralgm.resources.ResourceReference;
import org.lateralgm.resources.Room;
import org.lateralgm.resources.Room.PRoom;
import org.lateralgm.resources.Script;
import org.lateralgm.resources.Sound;
import org.lateralgm.resources.Sprite;
import org.lateralgm.resources.sub.Argument;
import org.lateralgm.resources.sub.Instance;
import org.lateralgm.resources.sub.Instance.PInstance;
import org.lateralgm.resources.sub.MainEvent;

import com.pixelmatrixstudios.ghpc.FileChooser;

import java.io.*;
import java.util.*;
import java.util.zip.*;

public class ghpframe extends JFrame implements ActionListener {
	private static final long serialVersionUID = 7477350675923471946L;
	JPanel pane = new JPanel();
	JFileChooser jfc;
	JButton ob, bb, cb;
	JTextField ff;
	JProgressBar pb;
	Rectangle wr, pr;
	FileChooser lfc;
	JComboBox el;
	JCheckBox zc, dc;
	Container con;
	String lf;
	//GML Helper scripts
	String gmhescr = "initGHP"+"addLink"+"drawText"+"drawGradientRect"+"drawGradientCircle"+"drawSetBackground";
	ghpframe()	{
		super("GHP Converter");
		wr = new Rectangle(100, 100, 315, 152);
		setBounds(wr);
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		con = this.getContentPane();
		pane.setLayout(null);
		jfc = new JFileChooser();
		jfc.setCurrentDirectory(new File(System.getProperty("user.home")+"/Desktop"));
		lfc = new FileChooser();
		pb = new JProgressBar(0, 100);
		proBar(0, "Select a file.");
		pb.setStringPainted(true);
		pb.setBounds(0, 0, 300, 50);
		pane.add(pb);
		pr = pb.getBounds();
		pr.x = 0;
		pr.y = 0;
		pb.paintImmediately(pr);
		ff = new JTextField(128);
		ff.addActionListener(this);
		ff.setBounds(0, 50, 300, 25);
		final Properties prop = new Properties();
		try {
				prop.load(new FileInputStream("ghpc.properties"));
		} catch (IOException err) {
				//
		}
		lf = prop.getProperty("last_file");
		if ((lf != null)&&(lf != "")) {
				ff.setText(lf);
		}
		pane.add(ff);
		ob = new JButton("Options");
		ob.addActionListener(this);
		ob.setBounds(0, 75, 100, 40);
		pane.add(ob);
		bb = new JButton("Browse");
		bb.addActionListener(this);
		bb.setBounds(100, 75, 100, 40);
		pane.add(bb);
		cb = new JButton("Convert");
		cb.addActionListener(this);
		cb.setBounds(200, 75, 100, 40);
		pane.add(cb);
		String[] export = {"HTML5"};
		el = new JComboBox(export);
		if (prop.getProperty("default_export") == null) {
				el.setSelectedIndex(0);
		}
		else {
				el.setSelectedItem(prop.getProperty("default_export"));
		}
		el.setBounds(0, 120, 100, 40);
		pane.add(el);
		zc = new JCheckBox("Zip?");
		zc.setSelected(Boolean.valueOf(prop.getProperty("zip")));
		zc.setBounds(120, 120, 80, 40);
		pane.add(zc);
		dc = new JCheckBox("Debug?");
		dc.setSelected(Boolean.valueOf(prop.getProperty("debug")));
		dc.setBounds(210, 120, 100, 40);
		pane.add(dc);
		con.add(pane);
		Runtime.getRuntime().addShutdownHook(new Thread() {
				public void run() {
						if (el.getSelectedItem() == null) {
								el.setSelectedIndex(0);
						}
						prop.setProperty("default_export", el.getSelectedItem().toString());
						prop.setProperty("zip", zc.isSelected()+"");
						if (lf == null) {
								lf = "";
						}
						prop.setProperty("last_file", lf);
						try {
								prop.store(new FileOutputStream("ghpc.properties"), null);
						} catch (IOException err) {
								System.out.println("Could not save options.");
						}
				}
		});
		setVisible(true);
	}
	public void actionPerformed(ActionEvent e) {
		if (e.getSource() == ob) { 
				if (getBounds().height == wr.height) {
						setBounds(wr.x, wr.y, wr.width, wr.height+100);
				}
				else {
						setBounds(wr);
				}
		}
		else if (e.getSource() == bb) {
			proBar(0, "Select a File");
			int returnval = jfc.showOpenDialog(this);
			if (returnval == JFileChooser.APPROVE_OPTION) {
				File file = jfc.getSelectedFile();
				ff.setText(file.getPath());
			}
		}
		else if (e.getSource() == cb) {
			if (el.getSelectedItem() == "HTML5") {
					gmtohtml();
			}
		}
		else if (e.getSource() == ff) {
			File file = new File(ff.getText());
			if (file.exists() == true) {
					if (el.getSelectedItem() == "HTML5") {
							gmtohtml();
					}
			}
		}
	}
	public void proBar(int i) {
			pb.setValue(i);
			pr = pb.getBounds();
			pr.x = 0;
			pr.y = 0;
			pb.paintImmediately(pr);
	}
	public void proBar(String s) {
			pb.setString(s);
			pr = pb.getBounds();
			pr.x = 0;
			pr.y = 0;
			pb.paintImmediately(pr);
	}
	public void proBar(int i, String s) {
			pb.setValue(i);
			pb.setString(s);
			pr = pb.getBounds();
			pr.x = 0;
			pr.y = 0;
			pb.paintImmediately(pr);
	}
	public void gmtohtml() {
			//Read and convert file
			proBar("Reading...");
			File d = new File(ff.getText());
			lf = d.getPath();
			proBar(5);
			if (d.exists() == false) {
				proBar(0, "File doesn't exist.");
				return;
			}
			String dir = d.getName();
			proBar(7);
			GmFile gmfile = lfc.openFile(d);
			int rsnum = gmfile.sprites.size()+gmfile.sounds.size()+gmfile.backgrounds.size()+gmfile.paths.size()+gmfile.scripts.size()+gmfile.fonts.size()+gmfile.timelines.size()+gmfile.gmObjects.size()+gmfile.rooms.size();
			proBar(10);
			
			//Get settings and other variables
			String descr = gmfile.gameSettings.get(GameSettings.PGameSettings.DESCRIPTION);
			int fps = gmfile.rooms.first().get(Room.PRoom.SPEED);
			Iterator<Sprite> sprites = gmfile.sprites.iterator();
			int sprnum = gmfile.sprites.size();
			Iterator<Sound> sounds = gmfile.sounds.iterator();
			int sndnum = gmfile.sounds.size();
			Iterator<Background> backgrounds = gmfile.backgrounds.iterator();
			int bcknum = gmfile.backgrounds.size();
			Iterator<org.lateralgm.resources.Font> fonts = gmfile.fonts.iterator();
			//int fntnum = gmfile.fonts.size();
			Iterator<Script> scripts = gmfile.scripts.iterator();
			//int scrnum = gmfile.scripts.size();
			Iterator<GmObject> gmobjects = gmfile.gmObjects.iterator(); 
			int objnum = gmfile.gmObjects.size();
			Iterator<Room> rooms = gmfile.rooms.iterator();
			int roomnum = gmfile.rooms.size();
			
			//Add files
			proBar("Adding JavaScript...");
			File tmpdir = new File(d.getPath().substring(0, d.getPath().lastIndexOf(File.separator))+File.separator+dir.substring(0, dir.lastIndexOf(".")));
			File udir = new File(d.getPath().substring(0, d.getPath().lastIndexOf(File.separator)));
			tmpdir.mkdir();
			FileOutputStream li, re, main, event, func, mainjs, debug, vars;
			byte buf;
			String line;
			try {
					//LICENSE
					File lisf = new File(tmpdir+"/LICENSE");
					lisf.createNewFile();
					li = new FileOutputStream(lisf);
					InputStreamReader lif = new InputStreamReader(ghpc.class.getResourceAsStream("/LICENSE"));
					while (lif.ready()) {
							buf = (byte) lif.read();
							li.write(buf);
					}
					lif.close();
					//README
					File resf = new File(tmpdir+"/README");
					resf.createNewFile();
					re = new FileOutputStream(resf);
					InputStreamReader ref = new InputStreamReader(ghpc.class.getResourceAsStream("/README"));
					while (ref.ready()) {
							buf = (byte) ref.read();
							re.write(buf);
					}
					lif.close();
					//main.html
					File mainsf = new File(tmpdir+"/main.html");
					mainsf.createNewFile();
					main = new FileOutputStream(mainsf);
					InputStreamReader[] mainf = new InputStreamReader[3];
					mainf[0] = new InputStreamReader(ghpc.class.getResourceAsStream("src/mainf0"));
					while (mainf[0].ready()) {
							buf = (byte) mainf[0].read();
							main.write(buf);
					}
					mainf[0].close();
					for (int i=0;i<dir.substring(0, dir.lastIndexOf(".")).length();i++) {
							buf = (byte) dir.substring(0, dir.lastIndexOf(".")).toCharArray()[i];
							main.write(buf);
					}
					mainf[1] = new InputStreamReader(ghpc.class.getResourceAsStream("src/mainf1"));
					while (mainf[1].ready()) {
							buf = (byte) mainf[1].read();
							main.write(buf);
					}
					mainf[1].close();
					for (int i=0;i<descr.length();i++) {
							buf = (byte) descr.toCharArray()[i];
							main.write(buf);
					}
					mainf[2] = new InputStreamReader(ghpc.class.getResourceAsStream("src/mainf2"));
					while (mainf[2].ready()) {
							buf = (byte) mainf[2].read();
							main.write(buf);
					}
					mainf[2].close();
					if (dc.isSelected()) {
							line = "<script type=\"text/javascript\" src=\"debug.js\"></script>\n";
							for (int e=0;e<line.length();e++) {
									buf = (byte) line.toCharArray()[e];
									main.write(buf);
							}
					}
					line = "\n</body>\n</html>";
					for (int e=0;e<line.length();e++) {
							buf = (byte) line.toCharArray()[e];
							main.write(buf);
					}
					main.close();
					proBar(11);
					
					//Browser icons/main dir imgs
					BufferedImage[] bric = new BufferedImage[10];
					FileOutputStream brics = new FileOutputStream(tmpdir+"/chrome.png");
					bric[0] = ImageIO.read(ghpc.class.getResourceAsStream("src/bric0.png"));
					ImageIO.write(bric[0], "png", brics);
					brics.close();
					brics = new FileOutputStream(tmpdir+"/firefox.png");
					bric[1] = ImageIO.read(ghpc.class.getResourceAsStream("src/bric1.png"));
					ImageIO.write((RenderedImage) bric[1], "png", brics);
					brics.close();
					brics = new FileOutputStream(tmpdir+"/safari.png");
					bric[2] = ImageIO.read(ghpc.class.getResourceAsStream("src/bric2.png"));
					ImageIO.write((RenderedImage) bric[2], "png", brics);
					brics.close();
					brics = new FileOutputStream(tmpdir+"/opera.png");
					bric[3] = ImageIO.read(ghpc.class.getResourceAsStream("src/bric3.png"));
					ImageIO.write((RenderedImage) bric[3], "png", brics);
					brics.close();
					brics = new FileOutputStream(tmpdir+"/invis.png");
					bric[4] = ImageIO.read(ghpc.class.getResourceAsStream("src/invis"));
					ImageIO.write((RenderedImage) bric[4], "png", brics);
					brics.close();
					
					//Particles
					BufferedImage[] part = new BufferedImage[16];
					File partf = new File(tmpdir+"/particles");
					partf.mkdir();
					FileOutputStream parts = new FileOutputStream(tmpdir+"/particles/00_pixel.png");
					part[0] = ImageIO.read(ghpc.class.getResourceAsStream("src/particles/part00.png"));
					ImageIO.write(part[0], "png", parts);
					parts.close();
					parts = new FileOutputStream(tmpdir+"/particles/01_disk.png");
					part[0] = ImageIO.read(ghpc.class.getResourceAsStream("src/particles/part01.png"));
					ImageIO.write(part[0], "png", parts);
					parts.close();
					parts = new FileOutputStream(tmpdir+"/particles/02_square.png");
					part[0] = ImageIO.read(ghpc.class.getResourceAsStream("src/particles/part02.png"));
					ImageIO.write(part[0], "png", parts);
					parts.close();
					parts = new FileOutputStream(tmpdir+"/particles/03_line.png");
					part[0] = ImageIO.read(ghpc.class.getResourceAsStream("src/particles/part03.png"));
					ImageIO.write(part[0], "png", parts);
					parts.close();
					parts = new FileOutputStream(tmpdir+"/particles/04_star.png");
					part[0] = ImageIO.read(ghpc.class.getResourceAsStream("src/particles/part04.png"));
					ImageIO.write(part[0], "png", parts);
					parts.close();
					parts = new FileOutputStream(tmpdir+"/particles/05_circle.png");
					part[0] = ImageIO.read(ghpc.class.getResourceAsStream("src/particles/part05.png"));
					ImageIO.write(part[0], "png", parts);
					parts.close();
					parts = new FileOutputStream(tmpdir+"/particles/06_ring.png");
					part[0] = ImageIO.read(ghpc.class.getResourceAsStream("src/particles/part06.png"));
					ImageIO.write(part[0], "png", parts);
					parts.close();
					parts = new FileOutputStream(tmpdir+"/particles/07_sphere.png");
					part[0] = ImageIO.read(ghpc.class.getResourceAsStream("src/particles/part07.png"));
					ImageIO.write(part[0], "png", parts);
					parts.close();
					parts = new FileOutputStream(tmpdir+"/particles/08_flare.png");
					part[0] = ImageIO.read(ghpc.class.getResourceAsStream("src/particles/part08.png"));
					ImageIO.write(part[0], "png", parts);
					parts.close();
					parts = new FileOutputStream(tmpdir+"/particles/09_spark.png");
					part[0] = ImageIO.read(ghpc.class.getResourceAsStream("src/particles/part09.png"));
					ImageIO.write(part[0], "png", parts);
					parts.close();
					parts = new FileOutputStream(tmpdir+"/particles/10_explosion.png");
					part[0] = ImageIO.read(ghpc.class.getResourceAsStream("src/particles/part10.png"));
					ImageIO.write(part[0], "png", parts);
					parts.close();
					parts = new FileOutputStream(tmpdir+"/particles/11_cloud.png");
					part[0] = ImageIO.read(ghpc.class.getResourceAsStream("src/particles/part11.png"));
					ImageIO.write(part[0], "png", parts);
					parts.close();
					parts = new FileOutputStream(tmpdir+"/particles/12_smoke.png");
					part[0] = ImageIO.read(ghpc.class.getResourceAsStream("src/particles/part12.png"));
					ImageIO.write(part[0], "png", parts);
					parts.close();
					parts = new FileOutputStream(tmpdir+"/particles/13_snow.png");
					part[0] = ImageIO.read(ghpc.class.getResourceAsStream("src/particles/part13.png"));
					ImageIO.write(part[0], "png", parts);
					parts.close();
					proBar(12);
					
					//event.js, func.js, main.js, debug.js
					File eventsf = new File(tmpdir+"/event.js");
					eventsf.createNewFile();
					event = new FileOutputStream(eventsf);
					InputStreamReader eventf = new InputStreamReader(ghpc.class.getResourceAsStream("src/eventf"));
					while (eventf.ready()) {
							buf = (byte) eventf.read();
							event.write(buf);
					}
					eventf.close();
					File funcsf = new File(tmpdir+"/func.js");
					funcsf.createNewFile();
					func = new FileOutputStream(funcsf);
					InputStreamReader funcf = new InputStreamReader(ghpc.class.getResourceAsStream("src/funcf"));
					while (funcf.ready()) {
							buf = (byte) funcf.read();
							func.write(buf);
					}
					funcf.close();
					File mainjsf = new File(tmpdir+"/main.js");
					mainjsf.createNewFile();
					mainjs = new FileOutputStream(mainjsf);
					InputStreamReader mainjf = new InputStreamReader(ghpc.class.getResourceAsStream("src/mainjf"));
					while (mainjf.ready()) {
							buf = (byte) mainjf.read();
							mainjs.write(buf);
					}
					mainjf.close();
					if (dc.isSelected()) {
							File debugsf = new File(tmpdir+"/debug.js");
							debugsf.createNewFile();
							debug = new FileOutputStream(debugsf);
							InputStreamReader debugf = new InputStreamReader(ghpc.class.getResourceAsStream("src/debugf"));
							while (debugf.ready()) {
									buf = (byte) debugf.read();
									debug.write(buf);
							}
							debugf.close();
					}
					proBar(13);
					
					//vars.js
					File varsf = new File(tmpdir+"/vars.js");
					varsf.createNewFile();
					vars = new FileOutputStream(varsf);
					InputStreamReader[] varf = new InputStreamReader[10];
					varf[0] = new InputStreamReader(ghpc.class.getResourceAsStream("src/varf0"));
					while (varf[0].ready()) {
							buf = (byte) varf[0].read();
							vars.write(buf);
					}
					varf[0].close();
					for (int i=0;i<Integer.toString(fps).length();i++) {
							buf = (byte) Integer.toString(fps).toCharArray()[i];
							vars.write(buf);
					}
					varf[1] = new InputStreamReader(ghpc.class.getResourceAsStream("src/varf1"));
					while (varf[1].ready()) {
							buf = (byte) varf[1].read();
							vars.write(buf);
					}
					varf[1].close();
					while (sprites.hasNext()) {
							Sprite spr = sprites.next();
							line = spr.getName()+" = new Sprite(\"sprites/"+spr.getName()+".png\", "+spr.subImages.size()+");\n";
							for (int e=0;e<line.length();e++) {
									buf = (byte) line.toCharArray()[e];
									vars.write(buf);
							}
					}
					line = "\n//Sounds\n";
					for (int e=0;e<line.length();e++) {
							buf = (byte) line.toCharArray()[e];
							vars.write(buf);
					}
					while (sounds.hasNext()) {
							String sndname = sounds.next().getName();
							line = sndname+" = new Audio();\n"+sndname+".src = \"sounds/"+sndname+".wav\";\n"+sndname+".load();\n";
							for (int e=0;e<line.length();e++) {
									buf = (byte) line.toCharArray()[e];
									vars.write(buf);
							}
					}
					line = "\n//Backgrounds\n";
					for (int e=0;e<line.length();e++) {
							buf = (byte) line.toCharArray()[e];
							vars.write(buf);
					}
					while (backgrounds.hasNext()) {
							String bckname = backgrounds.next().getName();
							line = bckname+" = new Image();\n"+bckname+".src = \"backgrounds/"+bckname+".png\";\n";
							for (int e=0;e<line.length();e++) {
									buf = (byte) line.toCharArray()[e];
									vars.write(buf);
							}
					}
					line = "\n//Fonts\nfunction fontAdd(name, size, bold, italic)\n{\n	this.temp = new Font();\n	temp.style = bold + italic * 2;\n		this.str = \"\";\n	if (temp.style == 1)\n	{\n	str = \"bold \";\n	}\n	if (temp.style == 2)\n	{\n		str = \"italic \";\n	}\n	if (temp.style == 3)\n	{\n		str = \"italic bold \";\n	}\n	str += size + \"pt \" + name;\n	temp.font = str;\n	temp.name = name;\n	temp.size = size;\n	return temp;\n}\nfunction fontAddSprite(sprite, first, prop, sep)\n{\n	this.temp = new SpriteFont();\n	temp.sprite = sprite;\n	temp.start = first;\n	temp.sep = sep;\n	return temp;\n}\nfunction Font() //jimn346\n{\n	this.font = null;\n	this.name = null;\n	this.size = null;\n	this.style = null;\n}\nfunction SpriteFont() //jimn346\n{\n	this.sprite = null;\n	this.start = null;\n	this.sep = null;\n}";
					for (int e=0;e<line.length();e++) {
							buf = (byte) line.toCharArray()[e];
							vars.write(buf);
					}
					while (fonts.hasNext()) {
							org.lateralgm.resources.Font fnt = fonts.next();
							line = fnt.getName()+" = fontAdd(\""+fnt.get(PFont.FONT_NAME)+"\", "+fnt.get(PFont.SIZE)+", "+fnt.get(PFont.BOLD)+", "+fnt.get(PFont.ITALIC)+");\n";
							for (int e=0;e<line.length();e++) {
									buf = (byte) line.toCharArray()[e];
									vars.write(buf);
							}
					}
					line = "\n//Scripts\n";
					for (int e=0;e<line.length();e++) {
							buf = (byte) line.toCharArray()[e];
							vars.write(buf);
					}
					while (scripts.hasNext()) {
							org.lateralgm.resources.Script scr = scripts.next();
							if (gmhescr.contains(scr.getName())) {continue;}
							line = "function "+scr.getName()+"()\n{\n"+gmltoghp(scr.getCode(), "this", "	")+"}\n";
							for (int e=0;e<line.length();e++) {
									buf = (byte) line.toCharArray()[e];
									vars.write(buf);
							}
					}
					proBar(14);
					line = "\n//Objects\nfunction instanceCreate(inst, x, y)\n{\n	var i = inst.id.length;\n	inst.id[i] = new inst(i, x, y);\n	inst.Create(i, x, y);\n	return i;\n}\n";
					boolean ie = false;
					while (gmobjects.hasNext()) {
							GmObject curobj = gmobjects.next();
							if (curobj.mainEvents.get(MainEvent.EV_DRAW).events.size() > 0) {
									if (!ie) {
											line += "function objDraw()\n{\n";
									}
									line += "	"+curobj.getName()+".Draw();\n";
									ie = true;
							}
					}
					if (ie) {
							line += "}\n\n";
					}
					else {
							line += "function objDraw(){}\n";
					}
					for (int e=0;e<line.length();e++) {
							buf = (byte) line.toCharArray()[e];
							vars.write(buf);
					}
					line = "";
					ie = false;
					gmobjects = gmfile.gmObjects.iterator();
					while (gmobjects.hasNext()) {
							GmObject curobj = gmobjects.next();
							if (curobj.mainEvents.get(MainEvent.EV_STEP).events.size() > 0) {
									if (!ie) {
											line += "function objStep()\n{\n";
									}
									line += "	"+curobj.getName()+".Step();\n";
									ie = true;
							}
					}
					if (ie) {
							line += "}\n\n";
					}
					else {
							line += "function objStep(){}\n";
					}
					for (int e=0;e<line.length();e++) {
							buf = (byte) line.toCharArray()[e];
							vars.write(buf);
					}
					line = "";
					ie = false;
					gmobjects = gmfile.gmObjects.iterator();
					while (gmobjects.hasNext()) {
							GmObject curobj = gmobjects.next();
							if (curobj.mainEvents.get(MainEvent.EV_KEYBOARD).events.size() > 0) {
									if (!ie) {
											line += "function objKeys(i)\n{\n";
									}
									line += "	"+curobj.getName()+".Keyboard(i);\n";
									ie = true;
							}
					}
					if (ie) {
							line += "}\n\n";
					}
					else {
							line += "function objKeys(){}\n";
					}
					for (int e=0;e<line.length();e++) {
							buf = (byte) line.toCharArray()[e];
							vars.write(buf);
					}
					line = "";
					ie = false;
					gmobjects = gmfile.gmObjects.iterator();
					while (gmobjects.hasNext()) {
							GmObject curobj = gmobjects.next();
							if (curobj.mainEvents.get(MainEvent.EV_KEYPRESS).events.size() > 0) {
									if (!ie) {
											line += "function objKeyP(i)\n{\n";
									}
									line += "	"+curobj.getName()+".KeyboardPress(i);\n";
									ie = true;
							}
					}
					if (ie) {
							line += "}\n\n";
					}
					else {
							line += "function objKeyP(){}\n";
					}
					for (int e=0;e<line.length();e++) {
							buf = (byte) line.toCharArray()[e];
							vars.write(buf);
					}
					line = "";
					ie = false;
					gmobjects = gmfile.gmObjects.iterator();
					while (gmobjects.hasNext()) {
							GmObject curobj = gmobjects.next();
							if (curobj.mainEvents.get(MainEvent.EV_KEYRELEASE).events.size() > 0) {
									if (!ie) {
											line += "function objKeyR()\n{\n";
									}
									line += "	"+curobj.getName()+".KeyboardRelease();\n";
									ie = true;
							}
					}
					if (ie) {
							line += "}\n\n";
					}
					else {
							line += "function objKeyR(){}\n";
					}
					for (int e=0;e<line.length();e++) {
							buf = (byte) line.toCharArray()[e];
							vars.write(buf);
					}
					line = "";
					int i = 0;
					gmobjects = gmfile.gmObjects.iterator();
					while (gmobjects.hasNext()) {
							GmObject curobj = gmobjects.next();
							i++;
							String objname = curobj.getName();
							line = "//"+objname+"\n"+objname+" = function()\n{\n	//Do nothing\n}\n"+objname+".id = new Array();\n"+objname+".Create = function(i, x, y)\n{\n	"+objname+".id[i] = new Array();\n	"+objname+".id[i][\"x\"] = x;\n	"+objname+".id[i][\"y\"] = y;\n	"+objname+".id[i][\"startx\"] = x;\n	"+objname+".id[i][\"starty\"] = y;\n";
							if (curobj.get(GmObject.PGmObject.SPRITE) != null)	{
									line += "	"+objname+".id[i].[\"sprite\"] = "+curobj.get(GmObject.PGmObject.SPRITE).toString()+";\n	"+"	"+objname+".id[i].[\"width\"] = ";
									ResourceReference<Sprite> r = curobj.get(GmObject.PGmObject.SPRITE);
									line += deRef(r).getDisplayImage().getWidth()+";\n	"+"	"+objname+".id[i].[\"height\"] = "+Util.deRef(r).getDisplayImage().getWidth()+";\n";
							}
							if (curobj.mainEvents.get(MainEvent.EV_CREATE).events.size() > 0) {
									Iterator<org.lateralgm.resources.sub.Event> ev_create = curobj.mainEvents.get(MainEvent.EV_CREATE).events.iterator();
									while (ev_create.hasNext()) {
											org.lateralgm.resources.sub.Event ev_cur = ev_create.next();
											Iterator<org.lateralgm.resources.sub.Action> ev_actions = ev_cur.actions.iterator();
											while (ev_actions.hasNext()) {
													org.lateralgm.resources.sub.Action action = ev_actions.next();
													Iterator<Argument> eab = action.getArguments().iterator();
													while (eab.hasNext()) {
															Argument arg = eab.next();
															if ((arg.kind == Argument.ARG_STRING)&&(!Character.isDigit(arg.getVal().charAt(0)))) {
																	line += gmltoghp(arg.getVal(), objname, "	")+"\n";
															}
															else {
																	line += "	//Sorry no DnD support yet\n";
															}
													}
											}
									}
							}
							line += "}\n";
							for (int e=0;e<line.length();e++) {
									buf = (byte) line.toCharArray()[e];
									vars.write(buf);
							}
							proBar(Math.round(15+(2*i/objnum)));
							processEvent(curobj, objname, MainEvent.EV_DESTROY, vars);
							processEvent(curobj, objname, MainEvent.EV_ALARM, vars);
							processEvent(curobj, objname, MainEvent.EV_STEP, vars);
							processEvent(curobj, objname, MainEvent.EV_COLLISION, vars);
							processEvent(curobj, objname, MainEvent.EV_KEYBOARD, vars);
							processEvent(curobj, objname, MainEvent.EV_KEYPRESS, vars);
							processEvent(curobj, objname, MainEvent.EV_KEYPRESS, vars);
							processEvent(curobj, objname, MainEvent.EV_MOUSE, vars);
							processEvent(curobj, objname, MainEvent.EV_OTHER, vars);
							processEvent(curobj, objname, MainEvent.EV_DRAW, vars);
							processEvent(curobj, objname, MainEvent.EV_TRIGGER, vars);
					}
					line = "//Rooms\nvar rooms = new Array();\nrooms[0] = "+gmfile.rooms.toArray()[0].toString()+";\nfunction roomOpen(i)\n{\n	for (var e=0;e<rooms[i].inst.length;e++)\n	{\n	instanceCreate(rooms[i].inst[e][0], rooms[i].inst[e][1], rooms[i].inst[e][2]);\n	}\n	room_width = rooms[i].width;\n	room_height = rooms[i].height;\n}\n\n";
					for (int e=0;e<line.length();e++) {
							buf = (byte) line.toCharArray()[e];
							vars.write(buf);
					}
					i = 0;
					while (rooms.hasNext()) {
							Room rm = rooms.next();
							line = "//"+rm.getName()+"\nfunction "+rm.getName()+"(i)\n{\n	//Do nothing\n}\n"+rm.getName()+".inst = new Array();\n"+rm.getName()+".rmCrCode = ";
							if ((rm.get(PRoom.CREATION_CODE) == null)||(rm.get(PRoom.CREATION_CODE) == "")) {
									line += "false;\n";
							}
							else {
									line += "function()\n{\n"+rm.get(PRoom.CREATION_CODE).toString()+"\n}\n";
							}
							Iterator<Instance> rmi = rm.instances.iterator();
							boolean icc = false;
							line += rm.getName()+".objCrCode = ";
							while (rmi.hasNext()) {
									Instance inst = rmi.next();
									if ((inst.properties.get(PInstance.CREATION_CODE) != null)&&(inst.properties.get(PInstance.CREATION_CODE) != "")) {
											if (icc) {
													line += inst.getCreationCode();
											}
											else {
													line += "function()\n{\n	with("+inst.properties.get(PInstance.ID)+")\n	{\n		"+inst.getCreationCode().replace("\n", "\n		")+"\n	}\n";
											}
											icc = true;
									}
							}
							if (!icc) {
									line += "false;\n";
							}
							else {
									line += "}\n";
							}
							line += rm.getName()+".width = "+rm.get(PRoom.WIDTH)+";\n"+rm.getName()+".height = "+rm.get(PRoom.HEIGHT)+";\n"+rm.getName()+".Create = function()\n{\n";
							rmi = rm.instances.iterator();
							int e = 0;
							while (rmi.hasNext()) {
									Instance inst = rmi.next();
									line += "	"+rm.getName()+".inst["+e+"] = new Array();\n	"+rm.getName()+".inst["+e+"][0] = "+deRef((ResourceReference<?>) inst.properties.get(PInstance.OBJECT))+";\n	"+rm.getName()+".inst["+e+"][1] = "+inst.getPosition().x+";\n	"+rm.getName()+".inst["+e+"][2] = "+inst.getPosition().y+";\n";
									e++;
							}
							line += "}";
							for (e=0;e<line.length();e++) {
									buf = (byte) line.toCharArray()[e];
									vars.write(buf);
							}
							proBar(Math.round(18+(2*i/roomnum)));
					}
			} catch (IOException e) {
					System.out.println("Could not include files.");
					return;
			}
			
			//Add sprites
			proBar("Converting Sprites...");
			File sprdir = new File(tmpdir+"/sprites");
			sprdir.mkdir();
			proBar(20);
			sprites = gmfile.sprites.iterator();
			for (int i=0;sprites.hasNext();i++) {
					Sprite sprname = sprites.next();
					try {
							ImageOutputStream spr = new FileImageOutputStream(new File(sprdir.getPath()+"/"+sprname.toString()+".png"));
							if (sprname.subImages.get(0) == null) {
									spr.close();
									continue;
							}
							Image img = createImage(sprname.getDisplayImage().getWidth()*sprname.subImages.size(), sprname.getDisplayImage().getHeight());
							Graphics g = img.getGraphics();
							g.drawImage(sprname.subImages.get(0), 0, 0, this);
							for (int e=1;e<sprname.subImages.size();e++) {
									g.drawImage(sprname.subImages.get(e), sprname.getDisplayImage().getWidth()*e, 0, this);
							}
							ImageIO.write((RenderedImage) img, "png", spr);
							spr.close();
					} catch (IOException e) {
							System.out.println("Could not include "+sprname.toString()+".");
					}
					proBar(Math.round(22+(2*i/sprnum)));
			}
			if (sprnum == 0) {
					sprdir.delete();
			}
			
			//Add sounds
			proBar("Converting Sounds...");
			File snddir = new File(tmpdir+"/sounds");
			snddir.mkdir();
			proBar(25);
			sounds = gmfile.sounds.iterator();
			for (int i=0;sounds.hasNext();i++) {
					Sound sndname = sounds.next();
					try {
							FileOutputStream snd = new FileOutputStream(snddir.getPath()+"/"+sndname.toString()+".wav");
							byte[] aud = gmfile.sounds.get(sndname.toString()).data;
							if (aud == null) {
									snd.close();
									continue;
							}
							snd.write(aud);
							snd.close();
					} catch (IOException e) {
							System.out.println("Could not include "+sndname+".");
					}
					proBar(Math.round(27+(2*i/sndnum)));
			}
			if (sndnum == 0) {
					snddir.delete();
			}
			
			//Add backgrounds
			proBar("Converting Backgrounds...");
			File bckdir = new File(tmpdir+"/backgrounds");
			bckdir.mkdir();
			proBar(30);
			backgrounds = gmfile.backgrounds.iterator();
			for (int i=0;backgrounds.hasNext();i++) {
					Background bckname = backgrounds.next();
					try {
							FileOutputStream bck = new FileOutputStream(bckdir.getPath()+"/"+bckname.toString()+".png");
							BufferedImage bimg = gmfile.backgrounds.get(bckname.toString()).getDisplayImage();
							if (bimg == null) {
									bck.close();
									continue;
							}
							ImageIO.write(bimg, "png", bck);
							bck.close();
					} catch (IOException e) {
							System.out.println("Could not include "+bckname+".");
					}
					proBar(Math.round(32+(2*i/bcknum)));
			}
			if (bcknum == 0) {
					bckdir.delete();
			}
			
			//Add paths
			proBar("Converting Paths...");
			Iterator<Path> paths = gmfile.paths.iterator();
			int pathnum = gmfile.paths.size();
			proBar(35);
			for (int i=0;paths.hasNext();i++) {
					Path pathname = paths.next();
					try {
							int pnum = pathname.points.size();
							if (pnum == 0) {
									return;
							}
							//Write to file
							vars.write(null);
					} catch (IOException e) {
							System.out.println("Could not include "+pathname+".");
					}
					proBar(Math.round(37+(2*i/pathnum)));
			}
			if (pathnum == 0) {
					//Do something?
			}
			
			//Add to zip
			dir = dir.substring(0, dir.lastIndexOf("."));
			if (!zc.isSelected()) {
					proBar(100, "Done!");
					try {
							vars.close();
					} catch (IOException err) {
							System.out.println("Could not close files.");
					}
					try {
							if (System.getProperty("os.name").indexOf("Windows") != -1) {
									Runtime.getRuntime().exec("explorer /e /select,"+udir+"\\"+dir);
							}
							else if (System.getProperty("os.name").indexOf("Linux") != -1) {
									Runtime.getRuntime().exec("xdg-open "+udir+"/"+dir);
							}
							else if (System.getProperty("os.name").indexOf("Mac") != -1) {
									Runtime.getRuntime().exec("/usr/bin/open "+udir+"/"+dir);
							}
					} catch (IOException err) {
							System.out.println("Couldn't open "+udir+"/"+dir+".");
					}
					return;
			}
			proBar(0, "Packing into zip...");
			d = tmpdir;
			String[] entries = d.list();
			byte[] buffer = new byte[4096];
			int bytesRead;
			ZipOutputStream out = null;
			FileInputStream in = null;
			ZipEntry entry = null;
			File f = null;
			try {
					out = new ZipOutputStream(new FileOutputStream(udir+"/"+dir+".zip"));
			} catch (FileNotFoundException err) {
					System.out.println("Couldn't create zip "+dir+".zip.");
			}
			for (int i=0;i<entries.length;i++) {
					f = new File(d, entries[i]);
					if (f.isDirectory()) {
							File cdir = f;
							String[] subdirent = f.list(); 
							for (int e=0;e<subdirent.length;e++) {
									f = new File(cdir, subdirent[e]);
									try {
											in = new FileInputStream(tmpdir+"/"+cdir.getName()+"/"+f.getName());
									} catch (FileNotFoundException err) {
											System.out.println("Couldn't open entry "+tmpdir+"/"+cdir.getName()+"/"+f.getName()+".");
									}
									entry = new ZipEntry(cdir.getName()+"/"+f.getName());
									try {
											out.putNextEntry(entry);
									} catch (IOException err) {
											System.out.println("Couldn't add entry "+entry.getName()+".");
									}
									try {
											while ((bytesRead = in.read(buffer)) != -1) {
													out.write(buffer, 0, bytesRead);
											}
											out.flush();
											in.close();
									} catch (IOException err) {
											System.out.println("Couldn't write entry "+entry.getName()+".");
									}
							}
							proBar(i/rsnum);
							continue;
					}
					try {
							in = new FileInputStream(f);
					} catch (FileNotFoundException err) {
							System.out.println("Couldn't open entry "+f.getName()+".");
					}
					entry = new ZipEntry(f.getName());
					try {
							out.putNextEntry(entry);
					} catch (IOException err) {
							System.out.println("Couldn't add entry "+entry.getName()+".");
					}
					try {
							while ((bytesRead = in.read(buffer)) != -1) {
									out.write(buffer, 0, bytesRead);
							}
							out.flush();
							in.close();
					} catch (IOException err) {
							System.out.println("Couldn't write entry "+entry.getName()+".");
					}
					proBar(i/rsnum);
			}
			try {
					out.close();
					in.close();
			} catch (IOException err) {
					System.out.println("Couldn't close zip "+dir+".zip.");
			}
			delDir(tmpdir);
			proBar(100, "Done!");
			Desktop desktop = Desktop.getDesktop();
			try {
					desktop.open(new File(udir+"/"+dir+".zip"));
			} catch (IOException err) {
					System.out.println("Couldn't open zip "+dir+".zip.");
			}
	}
	String[] vr = new String[512];
	int vn = 0;
	public String gmltoghp(String code, String obj, String indent) {
			String[] cl = code.split("\n");
			for (int i=0;i<cl.length;i++) {
					cl[i] = cl[i].trim();
			}
			String cc = "";
			DataInputStream gmlf = new DataInputStream(ghpc.class.getResourceAsStream("func/gmnames"));
			DataInputStream gclf = new DataInputStream(ghpc.class.getResourceAsStream("func/ghpnames"));
			DataInputStream gmcf = new DataInputStream(ghpc.class.getResourceAsStream("func/gmcon"));
			DataInputStream gccf = new DataInputStream(ghpc.class.getResourceAsStream("func/ghpcon"));
			String gmls = "";
			String gcls = "";
			String gmcs = "";
			String gccs = "";
			byte[] buf = new byte[2048];
			try {
					while (gmlf.read(buf) != -1) {
							gmls += new String(buf);
					}
					gmlf.close();
					buf = new byte[2048];
					while (gclf.read(buf) != -1) {
							gcls += new String(buf);
					}
					gclf.close();
					buf = new byte[2048];
					while (gmcf.read(buf) != -1) {
							gmcs += new String(buf);
					}
					gmcf.close();
					buf = new byte[2048];
					while (gccf.read(buf) != -1) {
							gccs += new String(buf);
					}
					gccf.close();
			} catch (IOException e) {
					System.out.println("Can't read fnames.");
			}
			String[] gml = gmls.split("\n");
			String[] gcl = gcls.split("\n");
			String[] gmc = gmcs.split("\n");
			String[] gcc = gccs.split("\n");
			for (int i=0;i<cl.length;i++) {
					char[] nc = cl[i].toCharArray();
					String ars = new String();
					if ((cl[i].indexOf('=') > -1)&&(cl[i].indexOf("if (") == -1)&&(obj != "this")) {
							boolean iv = false;
							for (int e=0;e<vn;e++) {
									if (cl[i].indexOf(' ') == -1) {
											continue;
									}
									if (vr[e].equals(cl[i].substring(0, cl[i].indexOf(' ')))) {
											iv = true;
											break;
									}
							}
							if ((!iv)&&(cl[i].indexOf(' ') > -1)&&(cl[i].indexOf('=') == cl[i].lastIndexOf('='))) {
									if ((cl[i].indexOf('!') == -1)) {
											vr[vn] = cl[i].substring(0, cl[i].indexOf(' '));
											vn += 1;
									}
							}
					}
					int pap = cl[i].indexOf("(");
					if (pap == -1) {
							String[] cla = cl[i].split(" ");
							cl[i] = "";
							for (int e=0;e<cla.length;e++) {
									if (cla[e].trim().equals("")) {
											continue;
									}
									for (int o=0;o<gmc.length;o++) {
											if (cla[e].trim().replace(",", "").equals(gmc[o].trim())) {
													cla[e] = cla[e].replace(gmc[o].trim(), gcc[o].trim());
													if (e < cla.length-1) {
															cla[e] += ",";
													}
											}
									}
									if (e > 0) {
											cl[i] += " ";
									}
									cl[i] += cla[e];
							}
							cc += cl[i];
							continue;
					}
					if ((cl[i].indexOf(" ") > -1)&&(cl[i].indexOf(" ") < pap)) {
							int est = 0, fn = 0;
							boolean ifu = false;
							String[] fl = new String[cl[i].split(" ").length];
							for (int e=0;e<cl[i].length();e++) {
									if ((cl[i].charAt(e) == ' ')&&(!ifu)) {
											fl[fn] = cl[i].substring(est, e);
											fn += 1;
											est = e+1;
									}
									else if (e+1 == cl[i].length()) {
											fl[fn] = cl[i].substring(est, e+1);
											fn += 1;
									}
									else if (cl[i].charAt(e) == '(') {
											ifu = true;
									}
									else if (cl[i].charAt(e) == ')') {
											ifu = false;
									}
							}
							cl[i] = "";
							boolean instr = false;
							for (int e=0;e<fn;e++) {
									if ((!instr)&&(fl[e].indexOf('"') > -1)) {
											instr = true;
											cl[i] += fl[e];
									}
									else if (instr) {
											cl[i] += fl[e];
									}
									else {
											cl[i] += gmltoghp(fl[e], obj, "	")+" ";
									}
							}
							cc += cl[i].trim();
							continue;
					}
					if (new String(nc).contains("initGHP")) {
							continue;
					}
					int gc = -1;
					for (int e=0;e<gml.length;e++) {
							String gmlc = gml[e].toString();
							int gmlp = gmlc.indexOf("(");
							gmlc = gmlc.substring(0, (gmlp == -1) ? gmlc.length() : gmlp);
							if (new String(nc).substring(0, pap).equals(gmlc)) {
									gc = e;
									break;
							}
					}
					if (gc > -1) {
							String ac = gcl[gc].substring(gcl[gc].indexOf("(")+1);
							if (ac.indexOf(")") == -1) {break;}
							ac = ac.substring(0, ac.indexOf(")"));
							String[] garg = gcl[gc].split(",");
							if (garg.length > 0) {
								String[] oarg = new String[17];
								if (new String(nc).indexOf("(") > -1) {
										String as = new String(nc).substring(new String(nc).indexOf("(")+1, new String(nc).lastIndexOf(")"));
										if (as.indexOf(")") > -1) {
												int ai = 0, ast = 0;
												boolean ip = false;
												for (int e=0;e<as.length();e++) {
														if ((as.charAt(e) == ',')&&(!ip)) {
																oarg[ai++] = as.substring(ast, e);
																ast = e+1;
														}
														else if (as.charAt(e) == '(') {
																ip = true;
														}
														else if (as.charAt(e) == ')') {
																ip = false;
														}
												}
										}
										else {
												oarg = as.split(",");
										}
								}
								else {
										oarg = new String(nc).split(",");
								}
								for (int e=0;e<oarg.length;e++) {
										if ((e+1 < oarg.length)&&(oarg[e] == null)) {
												oarg[e] = oarg[e+1];
										}
								}
								for (int e=0;e<oarg.length;e++) {
										if (oarg[e] == null) {
												break;
										}
										oarg[e] = oarg[e].trim();
										oarg[e] = gmltoghp(oarg[e], obj, "");
								}
								for (int e=0;e<garg.length;e++) {
										if (garg[e].contains("%obj%")) {
												ars += obj;
										}
										else if (garg[e].contains("%q%")) {
												ars += oarg[0];
										}
										else if (garg[e].contains("%w%")) {
												ars += oarg[1];
										}
										else if (garg[e].contains("%e%")) {
												ars += oarg[2];
										}
										else if (garg[e].contains("%r%")) {
												ars += oarg[3];
										}
										else if (garg[e].contains("%t%")) {
												ars += oarg[4];
										}
										else if (garg[e].contains("%y%")) {
												ars += oarg[5];
										}
										else if (garg[e].contains("%u%")) {
												ars += oarg[6];
										}
										else if (garg[e].contains("%i%")) {
												ars += oarg[7];
										}
										else if (garg[e].contains("%o%")) {
												ars += oarg[8];
										}
										else if (garg[e].contains("%p%")) {
												ars += oarg[9];
										}
										else if (garg[e].contains("%a%")) {
												ars += oarg[10];
										}
										else if (garg[e].contains("%s%")) {
												ars += oarg[11];
										}
										else if (garg[e].contains("%d%")) {
												ars += oarg[12];
										}
										else if (garg[e].contains("%f%")) {
												ars += oarg[13];
										}
										else if (garg[e].contains("%g%")) {
												ars += oarg[14];
										}
										else if (garg[e].contains("%h%")) {
												ars += oarg[15];
										}
										else if (garg[e].contains("%j%")) {
												ars += oarg[16];
										}
										if (e < garg.length-1) {
												ars += ", ";
										}
										if (e == garg.length-1) {
												if (cl[i].indexOf(")") != -1) {
														ars += ")";
												}
												if (!indent.equals("")) {
														ars += ";";
												}
										}
								}
							}
							nc = gcl[gc].substring(0, gcl[gc].indexOf("(")+1).toCharArray();
					}
					cc += indent+(new String(nc))+ars;
					if (!indent.equals("")) {
							cc += "\n";
					}
					for (int e=0;e<vn;e++) {
							if (cl[i].indexOf(' ') > -1) {
									cc.replaceAll(vr[e], obj+".id[i][\""+cl[i].substring(0, cl[i].indexOf(' '))+"\"]");
							}
					}
			}
			return cc;
	}
	public boolean delDir(File dir) {
			if (dir.isDirectory()) {
					String[] df = dir.list();
					for (int i=0;i<df.length;i++) {
							boolean b = delDir(new File(dir, df[i]));
							if (!b) {
									System.out.println("Couldn't delete temp file "+df[i]+".");
									return false;
							}
					}
			}
			return dir.delete();
	}
	public boolean processEvent(GmObject curobj, String objname, byte evt, FileOutputStream vars) {
			String line = "";
			if (curobj.mainEvents.get(evt).events.size() > 0) {
					Iterator<org.lateralgm.resources.sub.Event> ev = curobj.mainEvents.get(evt).events.iterator();
					while (ev.hasNext()) {
							org.lateralgm.resources.sub.Event ev_cur = ev.next();
							Iterator<org.lateralgm.resources.sub.Action> ev_actions = ev_cur.actions.iterator();
							if (ev_cur.toString().compareTo("Global Left Pressed") == 0) {
									line += objname+".MousePress = function()\n{\n	";
							}
							else {
									line += objname+"."+ev_cur.toString()+" = function()\n{\n	";
							}
							while (ev_actions.hasNext()) {
									org.lateralgm.resources.sub.Action action = ev_actions.next();
									Iterator<Argument> eab = action.getArguments().iterator();
									while (eab.hasNext()) {
											Argument arg = eab.next();
											if ((arg.kind == Argument.ARG_STRING)&&(!Character.isDigit(arg.getVal().charAt(0)))) {
													line += gmltoghp(arg.getVal(), objname, "	")+"\n";
											}
											else {
													line += "	//Sorry no DnD support yet\n";
											}
									}
							}
					}
					line += "}\n\n";
					try {
							for (int e=0;e<line.length();e++) {
								byte buf = (byte) line.toCharArray()[e];
								vars.write(buf);
							}
					}
					catch (IOException e) {
							System.out.println("Could not write object event.");
					}
					return true;
			}
			return false;
	}
}