package org.openkoala.dmt.codegen.tools;


/**
 * 实体生成器，根据实体信息生成Java编译单元（类文件）
 * 
 * @author yyang
 * 
 */
public interface ClassGenerator {

	/**
	 * 生成Java编译单元。
	 * 
	 * @return
	 */
	String generateCompilationUnit();
}
