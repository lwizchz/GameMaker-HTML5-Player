/*
 * Copyright (C) 2007-2011 IsmAvatar <IsmAvatar@gmail.com>
 * 
 * This file is part of LateralGM.
 * LateralGM is free software and comes with ABSOLUTELY NO WARRANTY.
 * See LICENSE for details.
 */

package com.pixelmatrixstudios.ghpc;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.swing.Icon;
import javax.swing.filechooser.FileFilter;
import javax.swing.filechooser.FileView;

import org.lateralgm.components.CustomFileChooser;
import org.lateralgm.components.CustomFileChooser.FilterSet;
import org.lateralgm.components.impl.CustomFileFilter;
import org.lateralgm.components.impl.ResNode;
import org.lateralgm.file.GmFile;
import org.lateralgm.file.GmFileReader;
import org.lateralgm.file.GmFormatException;
import org.lateralgm.messages.Messages;
import org.lateralgm.resources.Resource.Kind;

public class FileChooser
	{
	List<FileReader> readers = new ArrayList<FileReader>();
	CustomFileChooser fc = new CustomFileChooser("/org/lateralgm","LAST_FILE_DIR"); //$NON-NLS-1$ //$NON-NLS-2$
	FilterSet openFs = new FilterSet();
	FilterUnion openAllFilter = new FilterUnion();
	FilterSet saveFs = new FilterSet();
	public static List<FileView> fileViews = new ArrayList<FileView>();

	public static interface FileReader
		{
		public FileFilter getGroupFilter();

		public FileFilter[] getFilters();

		public boolean canRead(File f);

		public GmFile readFile(File f, ResNode root) throws GmFormatException;
		}

	public static interface FileWriter
		{
		}

	public void addReader(FileReader fr)
		{
		readers.add(fr);
		openFs.add(fr.getGroupFilter());
		for (FileFilter ff : fr.getFilters())
			openFs.add(ff);
		openAllFilter.add(fr.getGroupFilter());
		if (readers.size() == 2) openFs.add(0,openAllFilter);
		}

	public FileChooser()
		{
		fc.setFileView(new FileViewUnion());
		addReader(new GmReader());

		String exts[] = { ".gm81",".gmk",".gm6" }; //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$
		saveFs.addFilter("FileChooser.FORMAT_WRITERS_GM",exts); //$NON-NLS-1$
		saveFs.addFilter("FileChooser.FORMAT_GM81",exts[0]); //$NON-NLS-1$
		saveFs.addFilter("FileChooser.FORMAT_GMK",exts[1]); //$NON-NLS-1$
		saveFs.addFilter("FileChooser.FORMAT_GM6",exts[2]); //$NON-NLS-1$
		}

	private class FileViewUnion extends FileView
		{
		public String getName(File f)
			{
			for (FileView fv : fileViews)
				{
				String val = fv.getName(f);
				if (val != null) return val;
				}
			return super.getName(f);
			}

		public String getDescription(File f)
			{
			for (FileView fv : fileViews)
				{
				String val = fv.getDescription(f);
				if (val != null) return val;
				}
			return super.getDescription(f);
			}

		public String getTypeDescription(File f)
			{
			for (FileView fv : fileViews)
				{
				String val = fv.getTypeDescription(f);
				if (val != null) return val;
				}
			return super.getTypeDescription(f);
			}

		public Icon getIcon(File f)
			{
			for (FileView fv : fileViews)
				{
				Icon val = fv.getIcon(f);
				if (val != null) return val;
				}
			return super.getIcon(f);
			}

		public Boolean isTraversable(File f)
			{
			for (FileView fv : fileViews)
				{
				Boolean val = fv.isTraversable(f);
				if (val != null) return val;
				}
			return super.isTraversable(f);
			}
		}

	private class FilterUnion extends FileFilter
		{
		List<FileFilter> filters = new ArrayList<FileFilter>();

		public FilterUnion(FileFilter...filters)
			{
			add(filters);
			}

		public void add(FileFilter...filters)
			{
			for (FileFilter ff : filters)
				this.filters.add(ff);
			}

		@Override
		public boolean accept(File f)
			{
			for (FileFilter ff : filters)
				if (ff.accept(f)) return true;
			return false;
			}

		@Override
		public String getDescription()
			{
			return Messages.getString("FileChooser.ALL_SUPPORTED"); //$NON-NLS-1$
			}
		}

	protected class GmReader implements FileReader
		{
		CustomFileFilter[] filters;
		CustomFileFilter groupFilter;

		GmReader()
			{
			String[] exts = { ".gm81",".gmk",".gm6",".gmd" }; //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$ //$NON-NLS-4$
			String[] descs = { "GM81","GMK","GM6","GMD" }; //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$ //$NON-NLS-4$
			groupFilter = new CustomFileFilter(Messages.getString("FileChooser.FORMAT_READERS_GM"),exts); //$NON-NLS-1$
			filters = new CustomFileFilter[exts.length];
			for (int i = 0; i < exts.length; i++)
				filters[i] = new CustomFileFilter(
						Messages.getString("FileChooser.FORMAT_" + descs[i]),exts[i]); //$NON-NLS-1$
			}

		public FileFilter getGroupFilter()
			{
			return groupFilter;
			}

		public FileFilter[] getFilters()
			{
			return filters;
			}

		public boolean canRead(File f)
			{
			return groupFilter.accept(f);
			}

		public GmFile readFile(File f, ResNode root) throws GmFormatException
			{
			return GmFileReader.readGmFile(f,root);
			}
		}

	/** Note that passing in null will cause an open dialog to display */
	public GmFile openFile(File file)
		{
		GmFile gmfile = new GmFile();
		if (file == null)
			{
			return gmfile;
			}
		if (!file.exists()) return gmfile;

		FileReader reader = findReader(file);
		if (reader == null)
			{
			return gmfile;
			}
		ResNode rn = new ResNode("rn1", (byte)0, Kind.SPRITE);
		try {
			 gmfile = reader.readFile(file, rn);
		} catch (GmFormatException e) {
			return gmfile;
		}
		return gmfile;
		}

	private FileReader findReader(File file)
		{
		for (FileReader fr : readers)
			if (fr.canRead(file)) return fr;
		return null;
		}
	/*public boolean saveFile()
		{
			try
			{
			writeFile(currentFile,root);
			return true;
			}
		catch (IOException e)
			{
			return false;
			}
		}
	//TODO: Remove
	void writeFile(GmFile f, ResNode root) throws IOException
		{
		GmFileWriter.writeGmFile(f,root);
		}*/
	}