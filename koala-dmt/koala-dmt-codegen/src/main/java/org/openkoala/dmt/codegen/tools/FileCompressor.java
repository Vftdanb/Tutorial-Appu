package org.openkoala.dmt.codegen.tools;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * 文件压缩工具
 * @author xmfang
 *
 */
public class FileCompressor {

	private static final int BUFFER_SIZE = 1024;
	
	public static void zipFile(String baseDir, String fileName) throws IOException {
		List<File> fileList = getSubFiles(new File(baseDir));
		ZipOutputStream zipOutputStream = new ZipOutputStream(new FileOutputStream(fileName));
		ZipEntry zipEntry = null;
		byte[] buf = new byte[BUFFER_SIZE];
		int readLen = 0;
		
		for (File file : fileList) {
			zipEntry = new ZipEntry(getAbsFileName(baseDir, file));
			zipEntry.setSize(file.length());
			zipEntry.setTime(file.lastModified());
			zipOutputStream.putNextEntry(zipEntry);
			InputStream is = new BufferedInputStream(new FileInputStream(file));
			while ((readLen = is.read(buf, 0, BUFFER_SIZE)) != -1) {
				zipOutputStream.write(buf, 0, readLen);
			}
			is.close();
		}
		zipOutputStream.close();
	}

	private static String getAbsFileName(String baseDir, File realFileName) {
		File real = realFileName;
		File base = new File(baseDir);
		String result = real.getName();
		while (true) {
			real = real.getParentFile();
			if (real == null)
				break;
			if (real.equals(base))
				break;
			else
				result = real.getName() + "/" + result;
		}
		return result;
	}

	private static List<File> getSubFiles(File baseDir) {
		List<File> results = new ArrayList<File>();
		File[] tempFiles = baseDir.listFiles();
		for (File file : tempFiles) {
			if (file.isFile()) {
				results.add(file);
			} else if (file.isDirectory()) {
				results.addAll(getSubFiles(file));
			}
		}
		return results;
	}
}
