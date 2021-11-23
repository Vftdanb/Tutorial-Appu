package org.openkoala.dmt.domain;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;

@Entity
@DiscriminatorValue("EntityShape")
public class EntityShape extends DomainShape {
	
	private static final long serialVersionUID = 8316188536715463152L;

	private EntityType entityType;
	
	private Set<Property> properties = new HashSet<Property>();

	private Set<InterfaceShape> implementsInterfaceShapes = new HashSet<InterfaceShape>();

	@Enumerated(EnumType.STRING)
	@Column(name = "ENTITY_TYPE")
	public EntityType getEntityType() {
		return entityType;
	}

	public void setEntityType(EntityType entityType) {
		this.entityType = entityType;
	}

	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "ENTITY_PROPERTIES", joinColumns = @JoinColumn(name = "ENTITY_SHAPE_ID"))
	public Set<Property> getProperties() {
		return properties;
	}

	public void setProperties(Set<Property> properties) {
		this.properties = properties;
	}

	@ManyToMany
	@JoinTable(name = "ENTITY_INTERFACE_SHAPES", inverseJoinColumns = @JoinColumn(name = "IS_ID"), joinColumns = @JoinColumn(name = "ES_ID"))
	public Set<InterfaceShape> getImplementsInterfaceShapes() {
		return implementsInterfaceShapes;
	}

	public void setImplementsInterfaceShapes(
			Set<InterfaceShape> implementsInterfaceShapes) {
		this.implementsInterfaceShapes = implementsInterfaceShapes;
	}
	
}
