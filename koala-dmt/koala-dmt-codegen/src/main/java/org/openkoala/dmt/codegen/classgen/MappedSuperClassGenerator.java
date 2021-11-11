package org.openkoala.dmt.codegen.classgen;

import japa.parser.ast.body.ClassOrInterfaceDeclaration;
import japa.parser.ast.expr.AnnotationExpr;
import japa.parser.ast.expr.MarkerAnnotationExpr;
import japa.parser.ast.expr.NameExpr;
import japa.parser.ast.type.ClassOrInterfaceType;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.openkoala.dmt.codegen.metadata.DomainClassInfo;

public class MappedSuperClassGenerator extends DomainClassGenerator {

	public MappedSuperClassGenerator(DomainClassInfo domainClassInfo) {
		super(domainClassInfo);
	}

	@Override
	public ClassOrInterfaceDeclaration createTypeDeclare() {
		ClassOrInterfaceDeclaration result = super.createTypeDeclare();
		result.setExtends(Arrays.asList(new ClassOrInterfaceType(domainClassInfo.getBaseClass()))); // 扩展基类
		return result;
	}

	@Override
	protected List<AnnotationExpr> createClassAnnotations() {
		List<AnnotationExpr> annotations = new ArrayList<AnnotationExpr>();
		annotations.add(new MarkerAnnotationExpr(new NameExpr("MappedSuperClass")));
		return annotations;
	}
}
