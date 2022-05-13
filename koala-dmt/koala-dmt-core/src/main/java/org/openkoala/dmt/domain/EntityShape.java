package org.openkoala.dmt.domain;

import java.util.HashSet;
import java.util.Set;

public class EntityShape extends DomainShape {
	
	private static final long serialVersionUID = 8316188536715463152L;

	private EntityType entityType;
	
	private Set<Property> properties = new HashSet<Property>();

	private Set<InterfaceShape> implementsInterfaceShapes = new HashSet<InterfaceShape>();

	public EntityType getEntityType() {
		return entityType;
	}

	public void setEntityType(EntityType entityType) {
		this.entityType = entityType;
	}

	public Set<Property> getProperties() {
		return properties;
	}

	public void setProperties(Set<Property> properties) {
		this.properties = properties;
	}

	public Set<InterfaceShape> getImplementsInterfaceShapes() {
		return implementsInterfaceShapes;
	}

	public void setImplementsInterfaceShapes(
			Set<InterfaceShape> implementsInterfaceShapes) {
		this.implementsInterfaceShapes = implementsInterfaceShapes;
	}
	
}
