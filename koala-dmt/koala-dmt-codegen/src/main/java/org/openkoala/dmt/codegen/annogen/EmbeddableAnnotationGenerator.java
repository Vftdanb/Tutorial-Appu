package org.openkoala.dmt.codegen.annogen;

import japa.parser.ast.expr.AnnotationExpr;
import japa.parser.ast.expr.MarkerAnnotationExpr;
import japa.parser.ast.expr.NameExpr;

import java.util.ArrayList;
import java.util.List;

import org.openkoala.dmt.codegen.metadata.PropertyInfo;
import org.openkoala.dmt.codegen.propgen.FieldAnnotationGenerator;

public class EmbeddableAnnotationGenerator implements FieldAnnotationGenerator {

	public List<AnnotationExpr> generateAnnotations(PropertyInfo propertyInfo) {
		List<AnnotationExpr> results = new ArrayList<AnnotationExpr>();
		results.add(new MarkerAnnotationExpr(new NameExpr("Embedded")));
		return results;
	}

}
