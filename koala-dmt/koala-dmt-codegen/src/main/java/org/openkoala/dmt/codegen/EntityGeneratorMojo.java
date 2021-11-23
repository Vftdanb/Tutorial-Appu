package org.openkoala.dmt.codegen;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
//import org.apache.maven.plugin.AbstractMojo;
//import org.apache.maven.plugin.MojoExecutionException;
//import org.apache.maven.plugin.MojoFailureException;
import org.openkoala.dmt.codegen.metadata.DomainClassInfo;
import org.openkoala.dmt.codegen.tools.ClassGenerator;
import org.openkoala.dmt.codegen.tools.ClassGeneratorFactory;
import org.openkoala.dmt.codegen.tools.EntityInfoReaderFromExcel;


public class EntityGeneratorMojo{}

///**
// * 
// * @author yyang
// * 
// * @goal entity
// * 
// */
//public class EntityGeneratorMojo extends AbstractMojo {
//
//	/* 包路径分隔符 */
//	private static final String DOT_SYMBOL = ".";
//
//	/**
//	 * 实体类的包名
//	 * 
//	 * @parameter default-value="com.dayatang.app.domain"
//	 * @required
//	 */
//	private String packageName;
//
//	/**
//	 * 包含实体信息定义的Excel文件
//	 * 
//	 * @parameter default-value="${basedir}/src/test/resources/entities.xls"
//	 * @required
//	 */
//	private File excelFile;
//
//	/**
//	 * 实体类输出的文件路径
//	 * 
//	 * @parameter expression="${project.build.sourceDirectory}"
//	 * @required
//	 */
//	private File outputDirectory;
//	
//	/**
//	 * @parameter default-value="com.dayatang.app.domain"
//	 */
//	private boolean allowOveride = false;
//
//	public String getPackageName() {
//		return packageName;
//	}
//
//	public void setPackageName(String packageName) {
//		this.packageName = packageName;
//	}
//
//	public File getExcelFile() {
//		return excelFile;
//	}
//
//	public void setExcelFile(File excelFile) {
//		this.excelFile = excelFile;
//	}
//
//	public File getOutputDirectory() {
//		return outputDirectory;
//	}
//
//	public void setOutputDirectory(File sourceDirectory) {
//		this.outputDirectory = sourceDirectory;
//	}
//
//	public boolean isAllowOveride() {
//		return allowOveride;
//	}
//
//	public void setAllowOveride(boolean allowOveride) {
//		this.allowOveride = allowOveride;
//	}
//
//	public void execute() throws MojoExecutionException, MojoFailureException {
//		Set<DomainClassInfo> entities = new EntityInfoReaderFromExcel(getLog()).read(excelFile);
//		for (DomainClassInfo each : entities) {
//			if (StringUtils.isBlank(each.getPackageName())) {
//				each.setPackageName(packageName);
//			}
//			// CompilationUnit cu = new EntityClassGenerator(each,
//			// getLog()).generateCompilationUnit();
//			ClassGenerator classGenerator = new ClassGeneratorFactory().getGenerator(each);
//			String cu = classGenerator.generateCompilationUnit();
//			String outputPath = new File(outputDirectory.getAbsolutePath(), each.getPackageName().replace(DOT_SYMBOL, File.separator)).getAbsolutePath();
//			generatePojoFile(outputPath, each.getClassName(), cu.toString());
//		}
//	}
//
//	/**
//	 * 根据表相应信息描述生成实体类
//	 * @param basePath 要生成文件的目录
//	 * @param fileName 要生成文件的名字
//	 * @param classContent 文件内容
//	 */
//	public void generatePojoFile(String basePath, String fileName, String classContent) {
//		File dir = new File(basePath);
//		dir.mkdirs();
//		OutputStreamWriter out = null;
//		File file = new File(basePath, fileName + ".java");
//		if (file.exists() && (!isAllowOveride())) {
//			getLog().info("File '" + file.getAbsolutePath() + "' existed, omitting...");
//			return;
//		}
//		getLog().info("Generating file ->" + file.getAbsolutePath());
//		try {
//			out = new OutputStreamWriter(new FileOutputStream(file), "UTF-8");
//			out.write(classContent);
//		} catch (FileNotFoundException e) {
//			throw new RuntimeException("Java源文件:" + file + "不存在");
//		} catch (IOException e) {
//			throw new RuntimeException("无法写入Java源文件:" + file);
//		} finally {
//			try {
//				if (out != null) {
//					out.close();
//				}
//			} catch (IOException e) {
//				throw new RuntimeException("无法关闭Java源文件:" + file);
//			}
//		}
//	}
//}