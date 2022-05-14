package org.openkoala.dmt.domain;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Action implements Serializable {

	private static final long serialVersionUID = -5683932639335290666L;

	private String name;
	
	private List<Property> parameters = new ArrayList<Property>();
	
	private Property returnValue;

	private String description;
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Property> getParameters() {
		return parameters;
	}

	public void setParameters(List<Property> parameters) {
		this.parameters = parameters;
	}

	public Property getReturnValue() {
		return returnValue;
	}

	public void setReturnValue(Property returnValue) {
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
		if (!(other instanceof Action))
			return false;
		Action castOther = (Action) other;
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
