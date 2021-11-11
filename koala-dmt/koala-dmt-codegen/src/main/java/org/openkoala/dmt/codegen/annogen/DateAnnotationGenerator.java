package org.openkoala.dmt.codegen.annogen;

import japa.parser.ast.expr.AnnotationExpr;
import japa.parser.ast.expr.FieldAccessExpr;
import japa.parser.ast.expr.NameExpr;
import japa.parser.ast.expr.SingleMemberAnnotationExpr;

import java.util.ArrayList;
import java.util.List;

import org.openkoala.dmt.codegen.metadata.PropertyExt;
import org.openkoala.dmt.codegen.metadata.PropertyInfo;


public class DateAnnotationGenerator extends SingleValueFieldAnnotationGenerator {

	public List<AnnotationExpr> generateAnnotations(PropertyInfo propertyInfo) {
		String dateFormat = getDateFormat(propertyInfo.getTypeExt());
		List<AnnotationExpr> results = new ArrayList<AnnotationExpr>();
		results.add(new SingleMemberAnnotationExpr(new NameExpr("Temporal"), new FieldAccessExpr(new NameExpr("TemporalType"), dateFormat)));
		results.addAll(super.generateAnnotations(propertyInfo));
		return results;
	}

	private String getDateFormat(PropertyExt typeExt) {
		if (typeExt == null) {
			return "DATE";
		}
		return typeExt.name().toUpperCase();
	}

}
