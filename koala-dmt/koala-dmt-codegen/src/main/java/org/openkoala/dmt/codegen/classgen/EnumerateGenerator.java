package org.openkoala.dmt.codegen.classgen;

import java.util.ArrayList;
import java.util.List;

import japa.parser.ASTHelper;
import japa.parser.ast.CompilationUnit;
import japa.parser.ast.PackageDeclaration;
import japa.parser.ast.body.EnumConstantDeclaration;
import japa.parser.ast.body.EnumDeclaration;
import japa.parser.ast.body.JavadocComment;
import japa.parser.ast.body.ModifierSet;
import japa.parser.ast.expr.NameExpr;

import org.apache.commons.lang3.StringUtils;
import org.openkoala.dmt.codegen.metadata.DomainClassInfo;
import org.openkoala.dmt.codegen.tools.ClassGenerator;

public class EnumerateGenerator implements ClassGenerator {

	protected DomainClassInfo domainClassInfo;

	private CompilationUnit result;

	public EnumerateGenerator(DomainClassInfo domainClassInfo) {
		this.domainClassInfo = domainClassInfo;
	}

	@Override
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
	protected EnumDeclaration createTypeDeclare() {
		EnumDeclaration result = new EnumDeclaration(ModifierSet.PUBLIC, domainClassInfo.getClassName());
		result.setJavaDoc(new JavadocComment(domainClassInfo.getEntityComment())); // 设置类文档注释
		result.setEntries(createEnumConstantDeclarations(result));
		return result;
	}

	/**
	 * 创建枚举项
	 * 
	 * @param targetEnum
	 */
	private List<EnumConstantDeclaration> createEnumConstantDeclarations(EnumDeclaration targetEnum) {
		List<EnumConstantDeclaration> results = new ArrayList<EnumConstantDeclaration>();
		for (String enumItem : domainClassInfo.getEnumItems()) {
			results.add(new EnumConstantDeclaration(enumItem));
		}
		return results;
	}
	
}
