package org.openkoala.dmt.codegen.classgen;

import japa.parser.ASTHelper;
import japa.parser.ast.CompilationUnit;
import japa.parser.ast.PackageDeclaration;
import japa.parser.ast.body.ClassOrInterfaceDeclaration;
import japa.parser.ast.body.JavadocComment;
import japa.parser.ast.body.ModifierSet;
import japa.parser.ast.expr.NameExpr;

import org.apache.commons.lang3.StringUtils;
import org.openkoala.dmt.codegen.metadata.DomainClassInfo;
import org.openkoala.dmt.codegen.tools.ClassGenerator;

/**
 * 实体生成器，根据实体信息生成Java编译单元（类文件）
 * 
 * @author yyang
 * 
 */
public class InterfaceGenerator implements ClassGenerator {

	protected DomainClassInfo domainClassInfo;

	private CompilationUnit result;

	public InterfaceGenerator(DomainClassInfo domainClassInfo) {
		this.domainClassInfo = domainClassInfo;
	}

	/**
	 * 生成Java编译单元。
	 * 
	 * @return
	 */
	public String generateCompilationUnit() {
		result = new CompilationUnit();
		if (StringUtils.isNotBlank(domainClassInfo.getPackageName())) {
			result.setPackage(new PackageDeclaration(new NameExpr(domainClassInfo.getPackageName())));
		}
		ASTHelper.addTypeDeclaration(result, createTypeDeclare());
		return result.toString();
	}

	/**
	 * 生成类型声明，也就是"public class Abc extends Xyz {}"这一块。
	 * 
	 * @return
	 */
	protected ClassOrInterfaceDeclaration createTypeDeclare() {
		ClassOrInterfaceDeclaration result = new ClassOrInterfaceDeclaration(ModifierSet.PUBLIC, false, domainClassInfo.getClassName());
		result.setInterface(true);
		result.setJavaDoc(new JavadocComment(domainClassInfo.getEntityComment())); // 设置类文档注释
		return result;
	}

}
