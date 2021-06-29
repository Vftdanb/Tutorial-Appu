package org.openkoala.dmt.domain;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.dayatang.domain.AbstractEntity;

@Entity
@Table(name = "DOMAINS_CHART")
public class DomainsChart extends AbstractEntity {

	private static final long serialVersionUID = 3043999013741427550L;

	private String name;
	
	private Set<DomainShape> domainShapes = new HashSet<DomainShape>();

	private Set<Line> lines = new HashSet<Line>();
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@OneToMany(mappedBy = "domainsChart", cascade = CascadeType.ALL)
	public Set<DomainShape> getDomainShapes() {
		return domainShapes;
	}

	public void setDomainShapes(Set<DomainShape> domainShapes) {
		this.domainShapes = domainShapes;
	}

	@OneToMany(mappedBy = "domainsChart", cascade = CascadeType.ALL)
	public Set<Line> getLines() {
		return lines;
	}

	public void setLines(Set<Line> lines) {
		this.lines = lines;
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
		if (!(other instanceof DomainsChart))
			return false;
		DomainsChart castOther = (DomainsChart) other;
		return new EqualsBuilder().append(name, castOther.name).append(domainShapes, castOther.domainShapes).isEquals();
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder(17, 37).append(name).append(domainShapes).toHashCode();
	}

	@Override
	public String toString() {
		return name;
	}
	
}
