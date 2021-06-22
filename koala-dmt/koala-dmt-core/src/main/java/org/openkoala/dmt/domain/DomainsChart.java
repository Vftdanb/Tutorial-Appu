package org.openkoala.dmt.domain;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.dayatang.domain.AbstractEntity;

@Entity
@Table(name = "DOMAINS_CHART")
public class DomainsChart extends AbstractEntity {

	private static final long serialVersionUID = 3043999013741427550L;

	private String name;
	
	private Set<DomainShape> domainShapes = new HashSet<DomainShape>();

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@OneToMany(mappedBy = "domainChart")
	public Set<DomainShape> getDomainShapes() {
		return domainShapes;
	}

	public void setDomainShapes(Set<DomainShape> domainShapes) {
		this.domainShapes = domainShapes;
	}

	@Override
	public String[] businessKeys() {
		// TODO Auto-generated method stub
		return null;
	}
	
}
