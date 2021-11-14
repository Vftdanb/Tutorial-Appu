package org.openkoala.dmt.codegen.tools;

import japa.parser.ast.body.FieldDeclaration;
import japa.parser.ast.body.MethodDeclaration;

import java.util.List;

/**
 * 属性信息生成器，根据属性信息生成字段声明，Annotation和访问方法
 * 
 * @author yyang
 * 
 */
public interface PropertyGenerator {

	/**
	 * 创建字段声明
	 * 
	 * @return
	 */
	FieldDeclaration createFieldDeclaration();

	/**
	 * 创建访问方法
	 * 
	 * @return
	 */
	List<MethodDeclaration> createAccessorDeclarations();
}
