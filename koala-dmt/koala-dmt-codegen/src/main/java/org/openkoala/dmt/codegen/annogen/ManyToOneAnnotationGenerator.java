package org.openkoala.dmt.codegen.annogen;

import japa.parser.ast.expr.AnnotationExpr;
import japa.parser.ast.expr.MarkerAnnotationExpr;
import japa.parser.ast.expr.MemberValuePair;
import japa.parser.ast.expr.NameExpr;
import japa.parser.ast.expr.NormalAnnotationExpr;
import japa.parser.ast.expr.StringLiteralExpr;

import java.util.ArrayList;
import java.util.List;

import org.openkoala.dmt.codegen.metadata.CodeGenUtils;
import org.openkoala.dmt.codegen.metadata.PropertyInfo;
import org.openkoala.dmt.codegen.propgen.FieldAnnotationGenerator;

public class ManyToOneAnnotationGenerator implements FieldAnnotationGenerator {

	public List<AnnotationExpr> generateAnnotations(PropertyInfo propertyInfo) {
		List<AnnotationExpr> results = new ArrayList<AnnotationExpr>();
		results.add(new MarkerAnnotationExpr(new NameExpr("ManyToOne")));
		
		String joinColumn = CodeGenUtils.getJoinColumnName(propertyInfo.getName());
		List<MemberValuePair> pairs = new ArrayList<MemberValuePair>();
		pairs.add(new MemberValuePair("name", new StringLiteralExpr(joinColumn)));
		results.add(new NormalAnnotationExpr(new NameExpr("JoinColumn"), pairs));
		return results;
	}

}
