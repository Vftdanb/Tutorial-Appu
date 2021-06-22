package org.openkoala.dmt.domain;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CollectionTable;
import javax.persistence.DiscriminatorValue;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OrderColumn;

@Entity
@DiscriminatorValue("EntityShape")
public class EntityShape extends DomainShape {
	
	private static final long serialVersionUID = 8316188536715463152L;
	
	private Set<Property> properties = new HashSet<Property>();

	@ElementCollection
	@CollectionTable(name = "PROPERTIES", joinColumns = @JoinColumn(name = "ENTITY_SHAPE_ID"))
//	@OrderColumn(name = "ORDER_COLUMN")
	public Set<Property> getProperties() {
		return properties;
	}

	public void setProperties(Set<Property> properties) {
		this.properties = properties;
	}

}
