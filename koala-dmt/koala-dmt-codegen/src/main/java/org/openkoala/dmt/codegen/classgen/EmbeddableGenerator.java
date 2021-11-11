package org.openkoala.dmt.codegen.classgen;

import japa.parser.ASTHelper;
import japa.parser.ast.body.ClassOrInterfaceDeclaration;
import japa.parser.ast.expr.AnnotationExpr;
import japa.parser.ast.expr.MarkerAnnotationExpr;
import japa.parser.ast.expr.NameExpr;

import java.util.ArrayList;
import java.util.List;

import org.openkoala.dmt.codegen.metadata.DomainClassInfo;
import org.openkoala.dmt.codegen.metadata.PropertyInfo;

public class EmbeddableGenerator extends DomainClassGenerator {

	public EmbeddableGenerator(DomainClassInfo domainClassInfo) {
		super(domainClassInfo);
	}

	@Override
	protected List<AnnotationExpr> createClassAnnotations() {
		List<AnnotationExpr> annotations = new ArrayList<AnnotationExpr>();
		annotations.add(new MarkerAnnotationExpr(new NameExpr("Embeddable")));
		return annotations;
	}

	@Override
	protected ClassOrInterfaceDeclaration createTypeDeclare() {
		ClassOrInterfaceDeclaration result = super.createTypeDeclare();
		ASTHelper.addMember(result, createHashCodeMethod());
		ASTHelper.addMember(result, createEqualsMethod());
		ASTHelper.addMember(result, createToStringMethod());
		return result;
	}

	@Override
	public List<PropertyInfo> getEqualityProperties() {
		List<PropertyInfo> results = domainClassInfo.getNotNullProperties();
		if (results.isEmpty()) {
			return domainClassInfo.getPropertyInfos();
		}
		return results;
	}

}
