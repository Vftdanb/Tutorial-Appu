package org.openkoala.dmt.codegen.metadata;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

public class ActionInfo {

	private String name;
	
	private List<PropertyInfo> parameters = new ArrayList<PropertyInfo>();
	
	private PropertyInfo returnValue;

	private String description;
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<PropertyInfo> getParameters() {
		return parameters;
	}

	public void setParameters(List<PropertyInfo> parameters) {
		this.parameters = parameters;
	}

	public PropertyInfo getReturnValue() {
		return returnValue;
	}

	public void setReturnValue(PropertyInfo returnValue) {
		this.returnValue = returnValue;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Override
	public boolean equals(final Object other) {
		if (this == other)
			return true;
		if (!(other instanceof ActionInfo))
			return false;
		ActionInfo castOther = (ActionInfo) other;
		return new EqualsBuilder().append(name, castOther.name)
				.append(parameters, castOther.parameters)
				.append(returnValue, castOther.returnValue)
				.isEquals();
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder(17, 37)
			.append(name)
			.append(parameters)
			.append(returnValue)
			.toHashCode();
	}

	@Override
	public String toString() {
		return name;
	}
	
}
