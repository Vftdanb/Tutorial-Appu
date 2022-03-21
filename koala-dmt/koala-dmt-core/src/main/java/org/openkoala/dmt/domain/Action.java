package org.openkoala.dmt.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.dayatang.domain.AbstractEntity;

@Entity
@Table(name = "ACTIONS")
public class Action extends AbstractEntity {

	private static final long serialVersionUID = -5683932639335290666L;

	private String name;
	
	private List<Property> parameters = new ArrayList<Property>();
	
	private Property returnValue;

	private String description;
	
	private DomainShape domainShape;
	
	@Column(name = "ACTION_NAME")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ElementCollection//TODO 不能eager的问题
	@CollectionTable(name = "PARAMETERS", joinColumns = @JoinColumn(name = "ACTION_ID"))
	public List<Property> getParameters() {
		return parameters;
	}

	public void setParameters(List<Property> parameters) {
		this.parameters = parameters;
	}

	@Embedded
	public Property getReturnValue() {
		return returnValue;
	}

	public void setReturnValue(Property returnValue) {
		this.returnValue = returnValue;
	}

	@Column(name = "ACTION_DES")
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@ManyToOne
	@JoinColumn(name = "DS_ID")
	public DomainShape getDomainShape() {
		return domainShape;
	}

	public void setDomainShape(DomainShape domainShape) {
		this.domainShape = domainShape;
	}

	@Override
	public String[] businessKeys() {
		return null;
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
