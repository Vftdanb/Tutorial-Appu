package org.openkoala.dmt.domain;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * 领域图形
 * @author xmfang
 *
 */
public abstract class DomainShape implements Serializable {

	private static final long serialVersionUID = 5786291695802079586L;

	private String id;
	
	private String name;

	private String description;
	
	private List<Action> actions = new ArrayList<Action>();
	
	private DomainShape parent;
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	public List<Action> getActions() {
		return actions;
	}

	public void setActions(List<Action> actions) {
		this.actions = actions;
	}

	public DomainShape getParent() {
		return parent;
	}

	public void setParent(DomainShape parent) {
		this.parent = parent;
	}

	@Override
	public boolean equals(final Object other) {
		if (this == other)
			return true;
		if (!(other instanceof DomainShape))
			return false;
		DomainShape castOther = (DomainShape) other;
		return new EqualsBuilder()
				.append(id, castOther.id)
				.append(name, castOther.name)
				.isEquals();
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder(17, 37).append(id).append(name).toHashCode();
	}

	@Override
	public String toString() {
		return name;
	}
	
}
