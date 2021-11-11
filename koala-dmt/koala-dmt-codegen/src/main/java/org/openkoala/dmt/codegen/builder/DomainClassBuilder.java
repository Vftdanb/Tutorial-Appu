package org.openkoala.dmt.codegen.builder;

import org.openkoala.dmt.codegen.metadata.ClassCategory;
import org.openkoala.dmt.codegen.metadata.DomainClassInfo;


public class DomainClassBuilder {
	

	private String packageName;
	private String className;
	private String tableName;
	private String comment;
	private String baseClass = "AbstractEntity";
	private boolean isAbstract = false;
	private String discriminatorValue;
	private ClassCategory category = ClassCategory.ENTITY;

	public DomainClassBuilder(String packageName) {
		this.packageName = packageName;
	}

	public DomainClassBuilder name(String className) {
		this.className = className;
		return this;
	}

	public DomainClassBuilder table(String tableName) {
		this.tableName = tableName;
		return this;
	}

	public DomainClassBuilder comment(String comment) {
		this.comment = comment;
		return this;
	}

	public DomainClassBuilder baseClass(String baseClass) {
		this.baseClass = baseClass;
		return this;
	}

	public DomainClassBuilder category(ClassCategory category) {
		this.category = category;
		return this;
	}

	public DomainClassBuilder isAbstract() {
		this.isAbstract = true;
		return this;
	}

	public DomainClassBuilder discriminatorValue(String discriminatorValue) {
		this.discriminatorValue = discriminatorValue;
		return this;
	}
	
	public DomainClassInfo build() {
		DomainClassInfo result = new DomainClassInfo();
		result.setPackageName(packageName);
		result.setBaseClass(baseClass);
		result.setClassName(className);
		result.setTableName(tableName);
		result.setEntityComment(comment);
		result.setAbstract(isAbstract);
		result.setCategory(category);
		result.setDiscriminator(discriminatorValue);
		return result;
	}
	
	void x() {
		new DomainClassBuilder("a.b.c").name("QuestionLib").category(ClassCategory.ENTITY).build();
	}
}
