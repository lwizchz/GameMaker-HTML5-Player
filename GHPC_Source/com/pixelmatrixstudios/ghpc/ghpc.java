/* 
 * Copyright (C) 2011-12 piluke <pikingqwerty@gmail.com>
 * 
 * This file is part of GHPC.
 * GHPC is free software and comes with ABSOLUTELY NO WARRANTY.
 * See LICENSE for details.
 */

package com.pixelmatrixstudios.ghpc;

import java.io.File;

import org.lateralgm.main.Listener;

import com.pixelmatrixstudios.ghpc.ghpframe;

public final class ghpc {
	public static Listener listener = new Listener();
	public static ghpframe frame = new ghpframe();
	public static void main(String[] args) {
		if (args.length != 0){
			listener.fc.openFile(new File(args[0]));
		}
	}
}
