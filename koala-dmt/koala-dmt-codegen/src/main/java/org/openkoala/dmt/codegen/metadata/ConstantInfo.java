package org.openkoala.dmt.codegen.metadata;

import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

public class ConstantInfo {
	
	private DomainClassInfo domainClassInfo;
	
	/* JAVA字段名 */
	private String name;
	
	/* 字段注释 */
	private String comment;
	
	/* 字段类类型 */
	private PropertyType type;
	
	private String value;
	
	public DomainClassInfo getEntityInfo() {
		return domainClassInfo;
	}

	public void setEntityInfo(DomainClassInfo domainClassInfo) {
		this.domainClassInfo = domainClassInfo;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		if (StringUtils.isBlank(name)) {
			throw new IllegalArgumentException("Property name cannot be bull or blank!");
		}
		this.name = CodeGenUtils.formatPropName(name);
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public PropertyType getType() {
		return type;
	}

	public void setType(PropertyType type) {
		this.type = type;
	}

	
	public boolean isNumeric() {
		List<String> types = Arrays.asList("int", "Integer", "long", "Long", "float", "Float", "double", "Double", "short", "Short", "BigDecimal");
		return types.contains(type);
	}

}
