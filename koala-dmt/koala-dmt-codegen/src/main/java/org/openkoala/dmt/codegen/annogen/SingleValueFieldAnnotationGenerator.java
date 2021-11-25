package org.openkoala.dmt.codegen.annogen;

import japa.parser.ast.expr.AnnotationExpr;
import japa.parser.ast.expr.IntegerLiteralExpr;
import japa.parser.ast.expr.MarkerAnnotationExpr;
import japa.parser.ast.expr.MemberValuePair;
import japa.parser.ast.expr.NameExpr;
import japa.parser.ast.expr.NormalAnnotationExpr;
import japa.parser.ast.expr.SingleMemberAnnotationExpr;
import japa.parser.ast.expr.StringLiteralExpr;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.openkoala.dmt.codegen.metadata.PropertyInfo;
import org.openkoala.dmt.codegen.metadata.proptype.SingleValuePropertyType;
import org.openkoala.dmt.codegen.propgen.FieldAnnotationGenerator;

public class SingleValueFieldAnnotationGenerator implements FieldAnnotationGenerator {

	public List<AnnotationExpr> generateAnnotations(PropertyInfo propertyInfo) {
		SingleValuePropertyType propertyType = (SingleValuePropertyType) propertyInfo.getType();
		List<AnnotationExpr> results = new ArrayList<AnnotationExpr>();
		if (!propertyInfo.isNullable()) {
			results.add(new MarkerAnnotationExpr(new NameExpr("NotNull")));
		}
		if ((StringUtils.isNotBlank(propertyInfo.getMin()) || StringUtils.isNotBlank(propertyInfo.getMax()))) {
			if (propertyInfo.isNumeric()) {
				if (StringUtils.isNotBlank(propertyInfo.getMin())) {
					results.add(new SingleMemberAnnotationExpr(new NameExpr("Min"), new IntegerLiteralExpr(propertyInfo.getMin())));
				}
				if (StringUtils.isNotBlank(propertyInfo.getMax())) {
					results.add(new SingleMemberAnnotationExpr(new NameExpr("Max"), new IntegerLiteralExpr(propertyInfo.getMax())));
				}
			} else if ("String".equalsIgnoreCase(propertyType.getDataType())) {
				List<MemberValuePair> pairs = new ArrayList<MemberValuePair>();
				if (StringUtils.isNotBlank(propertyInfo.getMin())) {
					pairs.add(new MemberValuePair("min", new IntegerLiteralExpr(propertyInfo.getMin())));
				}
				if (StringUtils.isNotBlank(propertyInfo.getMax())) {
					pairs.add(new MemberValuePair("max", new IntegerLiteralExpr(propertyInfo.getMax())));
				}
				results.add(new NormalAnnotationExpr(new NameExpr("Size"), pairs));
			}
		}
		if (StringUtils.isNotBlank(propertyInfo.getPattern())) {
			MemberValuePair pair = new MemberValuePair("regexp", new StringLiteralExpr(propertyInfo.getPattern()));
			results.add(new NormalAnnotationExpr(new NameExpr("Pattern"), Collections.singletonList(pair)));
		}
		results.add(createFieldColumnAnnotation(propertyInfo));
		return results;
	}

	/**
	 * 创建Column标注
	 * 
	 * @param propertyInfo
	 * @return
	 */
	private AnnotationExpr createFieldColumnAnnotation(PropertyInfo propertyInfo) {
		List<MemberValuePair> pairs = new ArrayList<MemberValuePair>();
		pairs.add(new MemberValuePair("name", new StringLiteralExpr(propertyInfo.getColumnName())));
		/*
		if (propertyInfo.isUnique()) {
			pairs.add(new MemberValuePair("unique", new BooleanLiteralExpr(true)));
		}
		*/
		return new NormalAnnotationExpr(new NameExpr("Column"), pairs);
	}

}
