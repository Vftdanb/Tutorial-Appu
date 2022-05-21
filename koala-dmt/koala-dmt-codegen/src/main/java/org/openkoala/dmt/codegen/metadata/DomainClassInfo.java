package org.openkoala.dmt.codegen.metadata;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;

public class DomainClassInfo {
	
	private String packageName;
	private String className;
	private String tableName;
	private boolean abstractEntity;
	private String discriminator;
	private String baseClass;
	private ClassCategory category = ClassCategory.ENTITY;

	/* 表所对应的实体名注释 */
	private String entityComment;

	/* 表中每个字段的信息 */
	private List<PropertyInfo> propertyInfos = new ArrayList<PropertyInfo>();
	
	/* 枚举类的枚举项 */
	private List<String> enumItems = new ArrayList<String>();

	/* 方法 */
	private List<ActionInfo> actionInfos = new ArrayList<ActionInfo>();

    /*
    实现的接口
     */
    private Set<String> implementsInterfaces = new HashSet<String>();

	public String getPackageName() {
		return packageName;
	}

	public void setPackageName(String packageName) {
		this.packageName = packageName;
	}

	public String getClassName() {
		return className;
	}

	public void setClassName(String className) {
		if (StringUtils.isBlank(className)) {
			throw new IllegalArgumentException("Class name cannot be bull or blank!");
		}
		int lastDot = className.lastIndexOf(".");
		if (lastDot > 0) {
			packageName = className.substring(0, lastDot);
			this.className = className.substring(lastDot + 1);
		} else {
			this.className = className;
		}
		this.className = CodeGenUtils.formatClassName(this.className);
		if (StringUtils.isBlank(tableName)) {
			tableName = CodeGenUtils.getTableName(this.className);
		}
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		if (StringUtils.isBlank(tableName)) {
			return;
		}
		this.tableName = tableName;
	}
	
	public String getEntityComment() {
		return entityComment;
	}

	public void setEntityComment(String entityComment) {
		this.entityComment = entityComment;
	}

	public List<PropertyInfo> getPropertyInfos() {
		return propertyInfos;
	}

	public void setPropertyInfos(List<PropertyInfo> propertyInfos) {
		for (PropertyInfo propertyInfo : propertyInfos) {
			addPropertyInfo(propertyInfo);
		}
	}

	public List<String> getEnumItems() {
		return enumItems;
	}

	public void setEnumItems(List<String> enumItems) {
		this.enumItems = enumItems;
	}

	public List<ActionInfo> getActionInfos() {
		return actionInfos;
	}

	public void setActionInfos(List<ActionInfo> actionInfos) {
		this.actionInfos = actionInfos;
	}

    public Set<String> getImplementsInterfaces() {
        return implementsInterfaces;
    }

    public void setImplementsInterfaces(Set<String> implementsInterfaces) {
        this.implementsInterfaces = implementsInterfaces;
    }

    public void addPropertyInfo(PropertyInfo propertyInfo) {
		propertyInfo.setEntityInfo(this);
		propertyInfos.add(propertyInfo);
	}

	public boolean isAbstract() {
		return abstractEntity;
	}

	public void setAbstract(boolean abstractEntity) {
		this.abstractEntity = abstractEntity;
	}

	public String getDiscriminator() {
		return discriminator;
	}

	public void setDiscriminator(String discriminator) {
		this.discriminator = discriminator;
	}

	public String getBaseClass() {
		if (baseClass == null) {
			baseClass = "AbstractEntity";
		}
		return baseClass;
	}

	public void setBaseClass(String baseClass) {
		this.baseClass = baseClass;
	}

	public ClassCategory getCategory() {
		return category;
	}

	public void setCategory(ClassCategory category) {
		if (category == null) {
			return;
		}
		this.category = category;
	}

	public List<String> getBpkNames() {
		List<String> results = new ArrayList<String>();
		for (PropertyInfo prop : propertyInfos) {
			if (prop.isBusinessPK()) {
				results.add(prop.getName());
			}
		}
		return results;
	}
	
	public List<PropertyInfo> getBpkProperties() {
		List<PropertyInfo> results = new ArrayList<PropertyInfo>();
		for (PropertyInfo prop : propertyInfos) {
			if (prop.isBusinessPK()) {
				results.add(prop);
			}
		}
		return results;
	}
	
	public String getBpkColumns() {
		List<String> results = new ArrayList<String>();
		for (PropertyInfo prop : propertyInfos) {
			if (prop.isBusinessPK()) {
				results.add("\"" + prop.getColumnName() + "\"");
			}
		}
		return StringUtils.join(results, ", ");
	}
	
	public PropertyInfo getPropertyInfo(String propName) {
		for (PropertyInfo each : propertyInfos) {
			if (each.getName().equals(propName)) {
				return each;
			}
		}
		return null;
	}

	public boolean withoutProperties() {
		return propertyInfos.isEmpty();
	}
	
	public boolean hasBpks() {
		return !(getBpkProperties().isEmpty());
	}

	public List<PropertyInfo> getNotNullProperties() {
		List<PropertyInfo> results = new ArrayList<PropertyInfo>();
		for (PropertyInfo prop : propertyInfos) {
			if (!prop.isNullable()) {
				results.add(prop);
			}
		}
		return results;
	}
}
