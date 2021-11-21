package org.openkoala.dmt.codegen.tools;

import org.openkoala.dmt.codegen.classgen.EmbeddableGenerator;
import org.openkoala.dmt.codegen.classgen.EntityGenerator;
import org.openkoala.dmt.codegen.classgen.EnumerateGenerator;
import org.openkoala.dmt.codegen.classgen.InterfaceGenerator;
import org.openkoala.dmt.codegen.classgen.MappedSuperClassGenerator;
import org.openkoala.dmt.codegen.metadata.ClassCategory;
import org.openkoala.dmt.codegen.metadata.DomainClassInfo;

/**
 * 属性生成器工厂类，根据属性信息返回相应的属性生成器。
 * @author yyang
 *
 */
public class ClassGeneratorFactory {
	public ClassGenerator getGenerator(DomainClassInfo domainClassInfo) {
		ClassCategory category = domainClassInfo.getCategory();
		if (ClassCategory.MAPPED_SUPER_CLASS == category) {
			return new MappedSuperClassGenerator(domainClassInfo);
		}
		if (ClassCategory.EMBEDDABLE == category) {
			return new EmbeddableGenerator(domainClassInfo);
		}
		if (ClassCategory.INTERFACE == category) {
			return new InterfaceGenerator(domainClassInfo);
		}
		if (ClassCategory.ENUM == category) {
			return new EnumerateGenerator(domainClassInfo);
		}
		return new EntityGenerator(domainClassInfo);
	}

}
