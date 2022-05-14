package org.openkoala.dmt.codegen.annogen;

import japa.parser.ast.expr.AnnotationExpr;
import japa.parser.ast.expr.FieldAccessExpr;
import japa.parser.ast.expr.NameExpr;
import japa.parser.ast.expr.SingleMemberAnnotationExpr;

import java.util.ArrayList;
import java.util.List;

import org.openkoala.dmt.codegen.metadata.PropertyInfo;

public class EnumAnnotationGenerator extends SingleValueFieldAnnotationGenerator {

	public List<AnnotationExpr> generateAnnotations(PropertyInfo propertyInfo) {
		List<AnnotationExpr> results = new ArrayList<AnnotationExpr>();
		FieldAccessExpr enumType = new FieldAccessExpr(new NameExpr("EnumType"), "STRING");
		results.add(new SingleMemberAnnotationExpr(new NameExpr("Enumerated"), enumType));
		results.addAll(super.generateAnnotations(propertyInfo));
		return results;
	}

}
