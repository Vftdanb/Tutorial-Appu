package org.openkoala.dmt.codegen.metadata.proptype;

import org.openkoala.dmt.codegen.metadata.PropertyType;

public abstract class AbstractMapPropertyType implements PropertyType {
	private String keyType;
	private String valueType;

	public AbstractMapPropertyType(String keyType, String valueType) {
		this.keyType = keyType;
		this.valueType = valueType;
	}

	public String getKeyType() {
		return keyType;
	}

	public String getValueType() {
		return valueType;
	}

	public abstract String getImplementType();

	public abstract String getUnmodifiableCloneMethodName();

}
