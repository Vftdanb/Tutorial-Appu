package org.openkoala.dmt.domain;

import javax.persistence.Entity;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.dayatang.domain.AbstractEntity;

@Entity
@Table(name = "PROJECT")
public class Project extends AbstractEntity {

	private static final long serialVersionUID = 114734803852429270L;
	
	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Project() {}
	
	public Project(String name) {
		this.name = name;
	}
	
	@Override
	public String[] businessKeys() {
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	public boolean equals(final Object other) {
		if (this == other)
			return true;
		if (!(other instanceof Project))
			return false;
		Project castOther = (Project) other;
		return new EqualsBuilder().append(name, castOther.name).isEquals();
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder(17, 37).append(name).toHashCode();
	}

	@Override
	public String toString() {
		return name;
	}
	
}
