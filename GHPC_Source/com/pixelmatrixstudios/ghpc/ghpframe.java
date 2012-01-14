/* 
 * Copyright (C) 2011 piluke <pikingqwerty@gmail.com>
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
	JComboBox<?> el;
	JCheckBox zc;
	Container con;
	String lf;
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
		bb = new JButton("Browse...");
		bb.addActionListener(this);
		bb.setBounds(100, 75, 100, 40);
		pane.add(bb);
		cb = new JButton("Convert");
		cb.addActionListener(this);
		cb.setBounds(200, 75, 100, 40);
		pane.add(cb);
		String[] export = {"HTML5"};
		el = new JComboBox<Object>(export);
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
		zc.setBounds(120, 120, 100, 40);
		pane.add(zc);
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
			proBar(2);
			if (d.exists() == false) {
				proBar(0, "File doesn't exist.");
				return;
			}
			String dir = d.getName();
			proBar(4);
			GmFile gmfile = lfc.openFile(d);
			int rsnum = gmfile.sprites.size()+gmfile.sounds.size()+gmfile.backgrounds.size()+gmfile.paths.size()+gmfile.scripts.size()+gmfile.fonts.size()+gmfile.timelines.size()+gmfile.gmObjects.size()+gmfile.rooms.size();
			proBar(6);
			
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
			Iterator<GmObject> gmobjects = gmfile.gmObjects.iterator(); 
			int objnum = gmfile.gmObjects.size();
			Iterator<Room> rooms = gmfile.rooms.iterator();
			//int roomnum = gmfile.rooms.size();
			
			//Add files
			proBar("Adding JavaScript...");
			File tmpdir = new File(d.getPath().substring(0, d.getPath().lastIndexOf("\\"))+"\\"+dir.substring(0, dir.lastIndexOf(".")));
			File udir = new File(d.getPath().substring(0, d.getPath().lastIndexOf("\\")));
			tmpdir.mkdir();
			FileOutputStream main, event, func, mainjs, vars;
			byte buf;
			String line;
			try {
					//main.html
					File mainsf = new File(tmpdir+"\\main.html");
					mainsf.createNewFile();
					main = new FileOutputStream(mainsf);
					InputStreamReader[] mainf = new InputStreamReader[3];
					mainf[0] = new InputStreamReader(ghpc.class.getResourceAsStream("mainf0"));
					while (mainf[0].ready()) {
							buf = (byte) mainf[0].read();
							main.write(buf);
					}
					mainf[0].close();
					for (int i=0;i<dir.substring(0, dir.lastIndexOf(".")).length();i++) {
							buf = (byte) dir.substring(0, dir.lastIndexOf(".")).toCharArray()[i];
							main.write(buf);
					}
					mainf[1] = new InputStreamReader(ghpc.class.getResourceAsStream("mainf1"));
					while (mainf[1].ready()) {
							buf = (byte) mainf[1].read();
							main.write(buf);
					}
					mainf[1].close();
					for (int i=0;i<descr.length();i++) {
							buf = (byte) descr.toCharArray()[i];
							main.write(buf);
					}
					mainf[2] = new InputStreamReader(ghpc.class.getResourceAsStream("mainf2"));
					while (mainf[2].ready()) {
							buf = (byte) mainf[2].read();
							main.write(buf);
					}
					mainf[2].close();
					main.close();
					proBar(7);
					
					//Browser icons/main dir imgs
					BufferedImage[] bicof = new BufferedImage[10];
					FileOutputStream bicosf = new FileOutputStream(tmpdir+"\\chrome.png");
					bicof[0] = ImageIO.read(ghpc.class.getResourceAsStream("bicof0"));
					ImageIO.write(bicof[0], "png", bicosf);
					bicosf.close();
					bicosf = new FileOutputStream(tmpdir+"\\firefox.png");
					bicof[1] = ImageIO.read(ghpc.class.getResourceAsStream("bicof1"));
					ImageIO.write((RenderedImage) bicof[1], "png", bicosf);
					bicosf.close();
					bicosf = new FileOutputStream(tmpdir+"\\safari.png");
					bicof[2] = ImageIO.read(ghpc.class.getResourceAsStream("bicof2"));
					ImageIO.write((RenderedImage) bicof[2], "png", bicosf);
					bicosf.close();
					bicosf = new FileOutputStream(tmpdir+"\\opera.png");
					bicof[3] = ImageIO.read(ghpc.class.getResourceAsStream("bicof3"));
					ImageIO.write((RenderedImage) bicof[3], "png", bicosf);
					bicosf.close();
					bicosf = new FileOutputStream(tmpdir+"\\invis.png");
					bicof[4] = ImageIO.read(ghpc.class.getResourceAsStream("invis"));
					ImageIO.write((RenderedImage) bicof[4], "png", bicosf);
					bicosf.close();
					proBar(8);
					
					//event.js, func.js, main.js
					File eventsf = new File(tmpdir+"\\event.js");
					eventsf.createNewFile();
					event = new FileOutputStream(eventsf);
					InputStreamReader eventf = new InputStreamReader(ghpc.class.getResourceAsStream("eventf"));
					while (eventf.ready()) {
							buf = (byte) eventf.read();
							event.write(buf);
					}
					eventf.close();
					File funcsf = new File(tmpdir+"\\func.js");
					funcsf.createNewFile();
					func = new FileOutputStream(funcsf);
					InputStreamReader funcf = new InputStreamReader(ghpc.class.getResourceAsStream("funcf"));
					while (funcf.ready()) {
							buf = (byte) funcf.read();
							func.write(buf);
					}
					funcf.close();
					File mainjsf = new File(tmpdir+"\\main.js");
					mainjsf.createNewFile();
					mainjs = new FileOutputStream(mainjsf);
					InputStreamReader mainjf = new InputStreamReader(ghpc.class.getResourceAsStream("mainjf"));
					while (mainjf.ready()) {
							buf = (byte) mainjf.read();
							mainjs.write(buf);
					}
					mainjf.close();
					
					//vars.js
					File varsf = new File(tmpdir+"\\vars.js");
					varsf.createNewFile();
					vars = new FileOutputStream(varsf);
					InputStreamReader[] varf = new InputStreamReader[10];
					varf[0] = new InputStreamReader(ghpc.class.getResourceAsStream("varf0"));
					while (varf[0].ready()) {
							buf = (byte) varf[0].read();
							vars.write(buf);
					}
					varf[0].close();
					for (int i=0;i<Integer.toString(fps).length();i++) {
							buf = (byte) Integer.toString(fps).toCharArray()[i];
							vars.write(buf);
					}
					varf[1] = new InputStreamReader(ghpc.class.getResourceAsStream("varf1"));
					while (varf[1].ready()) {
							buf = (byte) varf[1].read();
							vars.write(buf);
					}
					varf[1].close();
					while (sprites.hasNext()) {
							String sprname = sprites.next().getName();
							line = sprname+" = new Image();\n"+sprname+".src = \"sprites/"+sprname+".png\";\n";
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
					line = "//Fonts\nfunction fontAdd(name, size, bold, italic)\n{\n	this.temp = new Font();\n	temp.style = bold + italic * 2;\n		this.str = \"\";\n	if (temp.style == 1)\n	{\n	str = \"bold \";\n	}\n	if (temp.style == 2)\n	{\n		str = \"italic \";\n	}\n	if (temp.style == 3)\n	{\n		str = \"italic bold \";\n	}\n	str += size + \"pt \" + name;\n	temp.font = str;\n	temp.name = name;\n	temp.size = size;\n	return temp;\n}\nfunction fontAddSprite(sprite, first, prop, sep)\n{\n	this.temp = new SpriteFont();\n	temp.sprite = sprite;\n	temp.start = first;\n	temp.sep = sep;\n	return temp;\n}\nfunction Font() //jimn346\n{\n	this.font = null;\n	this.name = null;\n	this.size = null;\n	this.style = null;\n}\nfunction SpriteFont() //jimn346\n{\n	this.sprite = null;\n	this.start = null;\n	this.sep = null;\n}";
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
					proBar(9);
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
															if (arg.kind == Argument.ARG_STRING) {
																	line += "	"+gmltoghp(arg.getVal())+"\n";
															}
															else if (arg.kind == Argument.ARG_EXPRESSION) {
							//										line += "	"+arg.getVal().substring(0, arg.getVal().indexOf("\n"))+" = "+arg.getVal().substring(arg.getVal().indexOf("\n")+2)+"\n";
															}
													}
											}
									}
							}
							line += "}\n";
							line += objname+".Draw = function()\n{\n	";
							if (curobj.mainEvents.get(MainEvent.EV_DRAW).events.size() > 0) {
									Iterator<org.lateralgm.resources.sub.Event> ev_draw = curobj.mainEvents.get(MainEvent.EV_DRAW).events.iterator();
									while (ev_draw.hasNext()) {
											org.lateralgm.resources.sub.Event ev_cur = ev_draw.next();
											Iterator<org.lateralgm.resources.sub.Action> ev_actions = ev_cur.actions.iterator();
											while (ev_actions.hasNext()) {
													org.lateralgm.resources.sub.Action action = ev_actions.next();
													Iterator<Argument> eab = action.getArguments().iterator();
													while (eab.hasNext()) {
															Argument arg = eab.next();
															if (arg.kind == Argument.ARG_STRING) {
																	line += "	"+gmltoghp(arg.getVal())+"\n";
															}
															else if (arg.kind == Argument.ARG_EXPRESSION) {
							//										line += "	"+arg.getVal().substring(0, arg.getVal().indexOf("\n"))+" = "+arg.getVal().substring(arg.getVal().indexOf("\n")+2)+"\n";
															}
													}
											}
									}
							}
							line += "}\n\n";
							for (int e=0;e<line.length();e++) {
									buf = (byte) line.toCharArray()[e];
									vars.write(buf);
							}
							proBar(9+(i/objnum));
					}
					line = "//Rooms\nvar rooms = new Array();\nrooms[0] = "+gmfile.rooms.toArray()[0].toString()+";\nfunction roomOpen(i)\n{\n	for (var e=0;e<rooms[i].inst.length;e++)\n	{\n	instanceCreate(rooms[i].inst[e][0], rooms[i].inst[e][1], rooms[i].inst[e][2]);\n	}\n	room_width = rooms[i].width;\n	room_height = rooms[i].height;\n}\n\n";
					for (int e=0;e<line.length();e++) {
							buf = (byte) line.toCharArray()[e];
							vars.write(buf);
					}
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
							i = 0;
							while (rmi.hasNext()) {
									Instance inst = rmi.next();
									line += "	"+rm.getName()+".inst["+i+"] = new Array();\n	"+rm.getName()+".inst["+i+"][0] = "+deRef((ResourceReference<?>) inst.properties.get(PInstance.OBJECT))+";\n	"+rm.getName()+".inst["+i+"][1] = "+inst.getPosition().x+";\n	"+rm.getName()+".inst["+i+"][2] = "+inst.getPosition().y+";\n";
									i++;
							}
							line += "}";
							for (int e=0;e<line.length();e++) {
									buf = (byte) line.toCharArray()[e];
									vars.write(buf);
							}
					}
			} catch (IOException e) {
					System.out.println("Could not include files.");
					return;
			}
			
			//Add sprites
			proBar("Converting Sprites...");
			File sprdir = new File(tmpdir+"\\sprites");
			sprdir.mkdir();
			proBar(11);
			sprites = gmfile.sprites.iterator();
			for (int i=0;sprites.hasNext();i++) {
					Sprite sprname = sprites.next();
					try {
							FileOutputStream spr = new FileOutputStream(sprdir.getPath()+"\\"+sprname.toString()+".png");
							BufferedImage img = gmfile.sprites.get(sprname.toString()).getDisplayImage();
							if (img == null) {
									spr.close();
									continue;
							}
							ImageIO.write(img, "png", spr);
							spr.close();
					} catch (IOException e) {
							System.out.println("Could not include "+sprname+".");
					}
					proBar(Math.round(11+(i/sprnum)));
			}
			if (sprnum == 0) {
					sprdir.delete();
			}
			proBar(20);
			
			//Add sounds
			proBar("Converting Sounds...");
			File snddir = new File(tmpdir+"\\sounds");
			snddir.mkdir();
			proBar(21);
			sounds = gmfile.sounds.iterator();
			for (int i=0;sounds.hasNext();i++) {
					Sound sndname = sounds.next();
					try {
							FileOutputStream snd = new FileOutputStream(snddir.getPath()+"\\"+sndname.toString()+".wav");
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
					proBar(Math.round(21+(i/sndnum)));
			}
			if (sndnum == 0) {
					snddir.delete();
			}
			proBar(30);
			
			//Add backgrounds
			proBar("Converting Backgrounds...");
			File bckdir = new File(tmpdir+"\\backgrounds");
			bckdir.mkdir();
			proBar(31);
			backgrounds = gmfile.backgrounds.iterator();
			for (int i=0;backgrounds.hasNext();i++) {
					Background bckname = backgrounds.next();
					try {
							FileOutputStream bck = new FileOutputStream(bckdir.getPath()+"\\"+bckname.toString()+".png");
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
					proBar(Math.round(31+(i/bcknum)));
			}
			if (bcknum == 0) {
					bckdir.delete();
			}
			proBar(40);
			
			//Add paths
			proBar("Converting Paths...");
			Iterator<Path> paths = gmfile.paths.iterator();
			int pathnum = gmfile.paths.size();
			proBar(41);
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
					proBar(Math.round(41+(i/pathnum)));
			}
			if (pathnum == 0) {
					//Do something?
			}
			proBar(50);
			
			//Add to zip
			dir = dir.substring(0, dir.lastIndexOf("."));
			if (!zc.isSelected()) {
					proBar(100, "Done!");
					try {
							vars.close();
					} catch (IOException err) {
							System.out.println("Could not close files.");
					}
					Desktop desktop = Desktop.getDesktop();
					try {
							desktop.open(new File(udir+"\\"+dir));
					} catch (IOException err) {
							System.out.println("Couldn't open folder "+dir+".");
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
					out = new ZipOutputStream(new FileOutputStream(udir+"\\"+dir+".zip"));
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
											in = new FileInputStream(tmpdir+"\\"+cdir.getName()+"\\"+f.getName());
									} catch (FileNotFoundException err) {
											System.out.println("Couldn't open entry "+tmpdir+"\\"+cdir.getName()+"\\"+f.getName()+".");
									}
									entry = new ZipEntry(cdir.getName()+"\\"+f.getName());
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
					desktop.open(new File(udir+"\\"+dir+".zip"));
			} catch (IOException err) {
					System.out.println("Couldn't open zip "+dir+".zip.");
			}
	}
	public String gmltoghp(String code) {
			String[] cl = code.split(";\n");
			String cc = "";
			String[] gml = {"window_set_cursor", "draw_sprite"};
			String[] gcl = {"drawSetCursor", "drawSprite"};
			for (int i=0;i<cl.length;i++) {
					char[] nc = cl[i].toCharArray();
					int pap = code.indexOf("(");
					int gc = -1;
					for (int e=0;e<gml.length;e++) {
							if (new String(nc).substring(0, pap).equals(gml[e].toString())) {
									gc = e;
									break;
							}
					}
					if (gc >= 0) {
							cc += gcl[gc]+new String(nc).substring(pap, nc.length);
							continue;
					}
					cc += new String(nc);
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
}
