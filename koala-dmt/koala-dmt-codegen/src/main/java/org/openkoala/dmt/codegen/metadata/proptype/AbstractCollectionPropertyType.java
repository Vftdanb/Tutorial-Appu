package org.openkoala.dmt.codegen.metadata.proptype;

import org.openkoala.dmt.codegen.metadata.PropertyType;

public abstract class AbstractCollectionPropertyType implements PropertyType {
	private String elementType;

	public AbstractCollectionPropertyType(String elementType) {
		super();
		this.elementType = elementType;
	}

	public String getElementType() {
		return elementType;
	}

	public abstract String getImplementType();

	public abstract String getUnmodifiableCloneMethodName();
}
