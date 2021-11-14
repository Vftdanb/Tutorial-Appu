package org.openkoala.dmt.codegen.metadata.proptype;

import org.openkoala.dmt.codegen.metadata.PropertyType;

public class SingleValuePropertyType implements PropertyType {
	private String dataType;

	public SingleValuePropertyType(String dataType) {
		super();
		this.dataType = dataType;
	}

	public String getDeclareType() {
		return dataType;
	}

	public String getDataType() {
		return dataType;
	}

	public String getImplementType() {
		return dataType;
	}
	
}
