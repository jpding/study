package com.succez.test.file;

import java.io.File;
import java.io.FileFilter;
import java.util.Arrays;
import java.util.Comparator;

public class TaFiles {
	private static final String path = "D:\\demo\\BIAllInOne2.2";

	public static void main(String[] args) {
		File file = new File(path);
		File[] files = file.listFiles(new FileFilter() {

			public boolean accept(File pathname) {
				return pathname.isFile();
			}
		});

		Arrays.sort(files, new Comparator<File>() {

			public int compare(File o1, File o2) {
				return o1.lastModified() - o2.lastModified() > 0 ? -1 : 1;
			}
		});

		for (File file2 : files) {
			System.out.println(file2.getAbsolutePath());
		}
	}
}
