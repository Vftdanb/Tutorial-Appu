package org.openkoala.dmt.domain;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CollectionTable;
import javax.persistence.DiscriminatorValue;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;

@Entity
@DiscriminatorValue("ValueObjectShape")
public class ValueObjectShape extends DomainShape {
	
	private static final long serialVersionUID = -202101819505897756L;
	
	private Set<Property> properties = new HashSet<Property>();

	@ElementCollection
	@CollectionTable(name = "ENTITY_PROPERTIES", joinColumns = @JoinColumn(name = "ENTITY_SHAPE_ID"))
	public Set<Property> getProperties() {
		return properties;
	}

	public void setProperties(Set<Property> properties) {
		this.properties = properties;
	}

}
