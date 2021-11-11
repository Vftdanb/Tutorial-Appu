package org.openkoala.dmt.codegen.annogen;

import japa.parser.ast.expr.AnnotationExpr;
import japa.parser.ast.expr.MarkerAnnotationExpr;
import japa.parser.ast.expr.MemberValuePair;
import japa.parser.ast.expr.NameExpr;
import japa.parser.ast.expr.NormalAnnotationExpr;
import japa.parser.ast.expr.StringLiteralExpr;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.openkoala.dmt.codegen.metadata.CodeGenUtils;
import org.openkoala.dmt.codegen.metadata.PropertyInfo;
import org.openkoala.dmt.codegen.propgen.FieldAnnotationGenerator;
import org.openkoala.dmt.codegen.tools.Inflector;

public class OneToManyAnnotationGenerator implements FieldAnnotationGenerator {

	public List<AnnotationExpr> generateAnnotations(PropertyInfo propertyInfo) {
		List<AnnotationExpr> results = new ArrayList<AnnotationExpr>();
		if (StringUtils.isBlank(propertyInfo.getMappedBy())) {
			results.add(new MarkerAnnotationExpr(new NameExpr("OneToMany")));
			results.add(generateJoinTableAnnotation(propertyInfo));
		} else {
			List<MemberValuePair> pairs = new ArrayList<MemberValuePair>();
			pairs.add(new MemberValuePair("mappedBy", new StringLiteralExpr(propertyInfo.getMappedBy())));
			results.add(new NormalAnnotationExpr(new NameExpr("OneToMany"), pairs));
		}
		return results;
	}

	private AnnotationExpr generateJoinTableAnnotation(PropertyInfo propertyInfo) {
		String className = propertyInfo.getEntityInfo().getClassName();
		String tableName = CodeGenUtils.getTableName(className + propertyInfo.getName());
		String joinColumn = CodeGenUtils.getJoinColumnName(className);
		String inverseJoinColumn = CodeGenUtils.getColumnName(Inflector.getInstance().singularize(propertyInfo.getName())) + "_ID";
		List<MemberValuePair> pairs = new ArrayList<MemberValuePair>();
		pairs.add(new MemberValuePair("name", new StringLiteralExpr(tableName)));
		pairs.add(new MemberValuePair("joinColumns", new NameExpr("@JoinColumn(name = \"" + joinColumn + "\")")));
		pairs.add(new MemberValuePair("inverseJoinColumns", new NameExpr("@JoinColumn(name = \"" + inverseJoinColumn + "\")")));
		return new NormalAnnotationExpr(new NameExpr("JoinTable"), pairs);
	}

}
