package org.openkoala.dmt.codegen.annogen;

import japa.parser.ast.expr.AnnotationExpr;
import japa.parser.ast.expr.MarkerAnnotationExpr;
import japa.parser.ast.expr.MemberValuePair;
import japa.parser.ast.expr.NameExpr;
import japa.parser.ast.expr.NormalAnnotationExpr;
import japa.parser.ast.expr.StringLiteralExpr;

import java.util.ArrayList;
import java.util.List;

import org.openkoala.dmt.codegen.metadata.PropertyInfo;
import org.openkoala.dmt.codegen.propgen.FieldAnnotationGenerator;
import org.openkoala.dmt.codegen.tools.Inflector;

public class ElementCollectionAnnotationGenerator implements FieldAnnotationGenerator {

	public List<AnnotationExpr> generateAnnotations(PropertyInfo propertyInfo) {
		List<AnnotationExpr> results = new ArrayList<AnnotationExpr>();
		results.add(new MarkerAnnotationExpr(new NameExpr("ElementCollection")));
		results.add(generateCollectionTableAnnotation(propertyInfo));
		return results;
	}

	private AnnotationExpr generateCollectionTableAnnotation(PropertyInfo propertyInfo) {
		String className = propertyInfo.getEntityInfo().getClassName();
		String tableName = Inflector.getInstance().underscore(className + "_" + propertyInfo.getName());
		tableName = Inflector.getInstance().pluralize(tableName).toUpperCase();
		String joinColumn = Inflector.getInstance().underscore(className + "_ID").toUpperCase();
		List<MemberValuePair> pairs = new ArrayList<MemberValuePair>();
		pairs.add(new MemberValuePair("name", new StringLiteralExpr(tableName)));
		pairs.add(new MemberValuePair("joinColumns", new NameExpr("@JoinColumn(name = \"" + joinColumn + "\")")));
		return new NormalAnnotationExpr(new NameExpr("CollectionTable"), pairs);
	}
	
}
