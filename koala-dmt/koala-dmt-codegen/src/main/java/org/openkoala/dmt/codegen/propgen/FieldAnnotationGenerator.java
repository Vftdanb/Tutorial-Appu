package org.openkoala.dmt.codegen.propgen;

import japa.parser.ast.expr.AnnotationExpr;

import java.util.List;

import org.openkoala.dmt.codegen.metadata.PropertyInfo;

/**
 * 字段Annotation生成器主要生成JPA和Validation的Annotation
 * @author yyang
 *
 */
public interface FieldAnnotationGenerator {
	
	/**
	 * 为指定的属性生成Annotation
	 * @param propertyInfo
	 * @return
	 */
	List<AnnotationExpr> generateAnnotations(PropertyInfo propertyInfo);
}
