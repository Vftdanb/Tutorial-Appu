package org.openkoala.dmt.codegen.metadata;

import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang3.StringUtils;


public class PropertyInfo {
	
	public static final String PROP_NUMERIC = "Numeric";
	
	public static final String PROP_STRING = "String";
	
	public static final String PROP_BOOL = "Bool";
	
	public static final String PROP_DATE = "Date";
	
	public static final String PROP_TIME = "Time";
	
	public static final String PROP_TIMESTAMP = "TimeStamp";
	
	public static final String PROP_CLOB = "Clob";
	
	public static final String PROP_BLOB = "Blob";
	
	public static final String PROP_ENUM = "Enum";
	
	public static final String PROP_VO = "Embeddable";
	
	public static final String PROP_ONE_TO_ONE = "OneToOne";
	
	public static final String PROP_ONE_TO_MANY = "OneToMany";
	
	public static final String PROP_MANY_TO_ONE = "ManyToOne";
	
	public static final String PROP_MANY_TO_MANY = "ManyToMany";
	
	public static final String PROP_ELEMENT_COLLECTION = "ElementCollection";
	
	private DomainClassInfo domainClassInfo;
	
	/* JAVA字段名 */
	private String name;
	
	/* JAVA字段名 */
	private String columnName;
	
	/* 字段注释 */
	private String comment;
	
	/* 字段类类型 */
	private PropertyExt typeExt;
	
	/* 字段类类型 */
	private PropertyType type;
	
	/* 是否为空 */
	private boolean nullable = true;
	
	private String min;
	
	private String max;

	private String pattern;
	
	private String mappedBy;

	private boolean businessPK;
	
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
		if (StringUtils.isBlank(columnName)) {
			columnName = CodeGenUtils.getColumnName(this.name);
			toJoinColumnIfNecessary();
		}
	}

	public String getColumnName() {
		return columnName;
	}

	public void setColumnName(String columnName) {
		if (StringUtils.isBlank(columnName)) {
			return;
		}
		this.columnName = columnName;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public PropertyExt getTypeExt() {
		return typeExt;
	}

	public void setTypeExt(PropertyExt typeExt) {
		this.typeExt = typeExt;
		toJoinColumnIfNecessary();
	}

	public PropertyType getType() {
		return type;
	}

	public void setType(PropertyType type) {
		this.type = type;
	}

	public boolean isNullable() {
		return nullable;
	}

	public void setNullable(boolean nullable) {
		this.nullable = nullable;
	}

	public String getMin() {
		return min;
	}

	public void setMin(String min) {
		this.min = min;
	}

	public String getMax() {
		return max;
	}

	public void setMax(String max) {
		this.max = max;
	}

	public String getPattern() {
		return pattern;
	}

	public void setPattern(String pattern) {
		this.pattern = pattern;
	}

	public String getMappedBy() {
		return mappedBy;
	}

	public void setMappedBy(String mappedBy) {
		this.mappedBy = mappedBy;
	}
	
	public boolean isBusinessPK() {
		return businessPK;
	}

	public void setBusinessPK(boolean businessPK) {
		this.businessPK = businessPK;
	}
	
	public boolean isNumeric() {
		List<String> types = Arrays.asList("int", "Integer", "long", "Long", "float", "Float", "double", "Double", "short", "Short", "BigDecimal");
		return types.contains(type);
	}

	private void toJoinColumnIfNecessary() {
		if (PropertyExt.MANY_TO_ONE == typeExt || PropertyExt.ONE_TO_ONE == typeExt) {
			if (columnName == null) {
				return;
			}
			if (columnName.endsWith("_ID")) {
				return;
			}
			columnName += "_ID";
		}
	}
}
