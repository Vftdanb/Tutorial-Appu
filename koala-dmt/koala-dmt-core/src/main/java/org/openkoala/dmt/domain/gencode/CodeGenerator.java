package org.openkoala.dmt.domain.gencode;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.openkoala.dmt.codegen.metadata.DomainClassInfo;
import org.openkoala.dmt.codegen.tools.ClassGenerator;
import org.openkoala.dmt.codegen.tools.ClassGeneratorFactory;
import org.openkoala.dmt.domain.DomainsChart;

public class CodeGenerator {

	private DomainsChart domainsChart;
	
	private boolean allowOveride;
	
	public DomainsChart getDomainsChart() {
		return domainsChart;
	}

	public void setDomainsChart(DomainsChart domainsChart) {
		this.domainsChart = domainsChart;
	}

	public boolean isAllowOveride() {
		return allowOveride;
	}

	public void setAllowOveride(boolean allowOveride) {
		this.allowOveride = allowOveride;
	}
	
	/* 包路径分隔符 */
	private static final String DOT_SYMBOL = ".";
	
	public CodeGenerator(DomainsChart domainsChart) {
		if (domainsChart == null) {
			throw new RuntimeException("Domains chart can not be null");
		}
		this.domainsChart = domainsChart;
	}
	
	public void generateCode(String packageName, String outputDirectory) {
		Set<DomainClassInfo> entities = new EntityInfoGenerator(domainsChart.getDomainShapes()).generateEntityInfos();
		for (DomainClassInfo each : entities) {
			if (StringUtils.isBlank(each.getPackageName())) {
				each.setPackageName(packageName);
			}
			// CompilationUnit cu = new EntityClassGenerator(each, 
			// getLog()).generateCompilationUnit();
			ClassGenerator classGenerator = new ClassGeneratorFactory().getGenerator(each);
			String cu = classGenerator.generateCompilationUnit();
			String outputPath = new File(outputDirectory, each.getPackageName().replace(DOT_SYMBOL, File.separator)).getAbsolutePath();
			generatePojoFile(outputPath, each.getClassName(), cu.toString());
		}
	}
	
	/**
	 * 生成实体类
	 * @param basePath 要生成文件的目录
	 * @param fileName 要生成文件的名字
	 * @param classContent 文件内容
	 */
	public void generatePojoFile(String basePath, String fileName, String classContent) {
		File dir = new File(basePath);
		dir.mkdirs();
		OutputStreamWriter out = null;
		File file = new File(basePath, fileName + ".java");
		if (file.exists() && (!isAllowOveride())) {
			return;
		}
		try {
			out = new OutputStreamWriter(new FileOutputStream(file), "UTF-8");
			out.write(classContent);
		} catch (FileNotFoundException e) {
			throw new RuntimeException("Java源文件:" + file + "不存在");
		} catch (IOException e) {
			throw new RuntimeException("无法写入Java源文件:" + file);
		} finally {
			try {
				if (out != null) {
					out.close();
				}
			} catch (IOException e) {
				throw new RuntimeException("无法关闭Java源文件:" + file);
			}
		}
	}
}
