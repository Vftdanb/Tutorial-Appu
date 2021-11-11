package org.openkoala.dmt.codegen.propgen;

import org.openkoala.dmt.codegen.metadata.PropertyInfo;

public class SingleValuePropertyGenerator extends AbstractPropertyGenerator {
	
	public SingleValuePropertyGenerator(PropertyInfo propertyInfo) {
		super(propertyInfo);
	}

	public SingleValuePropertyGenerator(PropertyInfo propertyInfo, FieldAnnotationGenerator annotationGenerator) {
		super(propertyInfo, annotationGenerator);
	}
}
