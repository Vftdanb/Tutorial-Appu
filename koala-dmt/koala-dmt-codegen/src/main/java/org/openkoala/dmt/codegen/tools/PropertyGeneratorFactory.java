package org.openkoala.dmt.codegen.tools;

import org.openkoala.dmt.codegen.annogen.DateAnnotationGenerator;
import org.openkoala.dmt.codegen.annogen.ElementCollectionAnnotationGenerator;
import org.openkoala.dmt.codegen.annogen.EmbeddableAnnotationGenerator;
import org.openkoala.dmt.codegen.annogen.EnumAnnotationGenerator;
import org.openkoala.dmt.codegen.annogen.LobAnnotationGenerator;
import org.openkoala.dmt.codegen.annogen.ManyToManyAnnotationGenerator;
import org.openkoala.dmt.codegen.annogen.ManyToOneAnnotationGenerator;
import org.openkoala.dmt.codegen.annogen.OneToManyAnnotationGenerator;
import org.openkoala.dmt.codegen.annogen.OneToOneAnnotationGenerator;
import org.openkoala.dmt.codegen.annogen.SingleValueFieldAnnotationGenerator;
import org.openkoala.dmt.codegen.metadata.PropertyExt;
import org.openkoala.dmt.codegen.metadata.PropertyInfo;
import org.openkoala.dmt.codegen.metadata.PropertyType;
import org.openkoala.dmt.codegen.metadata.proptype.CollectionPropertyType;
import org.openkoala.dmt.codegen.metadata.proptype.ListPropertyType;
import org.openkoala.dmt.codegen.metadata.proptype.MapPropertyType;
import org.openkoala.dmt.codegen.metadata.proptype.SetPropertyType;
import org.openkoala.dmt.codegen.metadata.proptype.SingleValuePropertyType;
import org.openkoala.dmt.codegen.metadata.proptype.SortedMapPropertyType;
import org.openkoala.dmt.codegen.metadata.proptype.SortedSetPropertyType;
import org.openkoala.dmt.codegen.propgen.CollectionPropertyGenerator;
import org.openkoala.dmt.codegen.propgen.FieldAnnotationGenerator;
import org.openkoala.dmt.codegen.propgen.MapPropertyGenerator;
import org.openkoala.dmt.codegen.propgen.SingleValuePropertyGenerator;

/**
 * 属性生成器工厂类，根据属性信息返回相应的属性生成器。
 * @author yyang
 *
 */
public class PropertyGeneratorFactory {
	public PropertyGenerator getGenerator(PropertyInfo propertyInfo) {
		PropertyType propType = propertyInfo.getType();
		if (propType == null) {
			return new SingleValuePropertyGenerator(propertyInfo, new SingleValueFieldAnnotationGenerator());
		}
		PropertyExt propExt = propertyInfo.getTypeExt();
		if (propType instanceof CollectionPropertyType) {
			return new CollectionPropertyGenerator(propertyInfo, getAnnotationGenerator(propertyInfo));
		}
		if (propType instanceof ListPropertyType) {
			return new CollectionPropertyGenerator(propertyInfo, getAnnotationGenerator(propertyInfo));
		}
		if (propType instanceof SetPropertyType) {
			return new CollectionPropertyGenerator(propertyInfo, getAnnotationGenerator(propertyInfo));
		}
		if (propType instanceof SortedSetPropertyType) {
			return new CollectionPropertyGenerator(propertyInfo, getAnnotationGenerator(propertyInfo));
		}
		if (propType instanceof MapPropertyType) {
			return new MapPropertyGenerator(propertyInfo, getAnnotationGenerator(propertyInfo));
		}
		if (propType instanceof SortedMapPropertyType) {
			return new MapPropertyGenerator(propertyInfo, getAnnotationGenerator(propertyInfo));
		}
		SingleValuePropertyType propertyType1 = (SingleValuePropertyType) propType;
		if ("Date".equalsIgnoreCase(propertyType1.getDataType())) {
			return new SingleValuePropertyGenerator(propertyInfo, new DateAnnotationGenerator());
		}
		if (PropertyExt.LOB == propExt) {
			return new SingleValuePropertyGenerator(propertyInfo, new LobAnnotationGenerator());
		}
		if (PropertyExt.ENUM == propExt) {
			return new SingleValuePropertyGenerator(propertyInfo, new EnumAnnotationGenerator());
		}
		if (PropertyExt.EMBEDDABLE == propExt) {
			return new SingleValuePropertyGenerator(propertyInfo, new EmbeddableAnnotationGenerator());
		}
		if (PropertyExt.MANY_TO_ONE == propExt) {
			return new SingleValuePropertyGenerator(propertyInfo, new ManyToOneAnnotationGenerator());
		}
		if (PropertyExt.ONE_TO_ONE == propExt) {
			return new SingleValuePropertyGenerator(propertyInfo, new OneToOneAnnotationGenerator());
		}
		
		return new SingleValuePropertyGenerator(propertyInfo, new SingleValueFieldAnnotationGenerator());
	}

	private FieldAnnotationGenerator getAnnotationGenerator(PropertyInfo propertyInfo) {
		PropertyExt propExt = propertyInfo.getTypeExt();
		if (PropertyExt.ELEMENT_COLLECTION == propExt) {
			return new ElementCollectionAnnotationGenerator();
		}
		if (PropertyExt.ONE_TO_MANY == propExt) {
			return new OneToManyAnnotationGenerator();
		}
		if (PropertyExt.MANY_TO_MANY == propExt) {
			return new ManyToManyAnnotationGenerator();
		}
		throw new IllegalArgumentException("Annotation type '" + propExt + "' not exists");
	}
}
