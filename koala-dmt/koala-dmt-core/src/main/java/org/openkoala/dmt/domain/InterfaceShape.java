package org.openkoala.dmt.domain;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;

@Entity
@DiscriminatorValue("InterfaceShape")
public class InterfaceShape extends DomainShape {

	private static final long serialVersionUID = 4578638473368397507L;

	private Set<EntityShape> entityShapes = new HashSet<EntityShape>();

	@ManyToMany(cascade = CascadeType.ALL, mappedBy = "implementsInterfaceShapes")
	public Set<EntityShape> getEntityShapes() {
		return entityShapes;
	}

	public void setEntityShapes(Set<EntityShape> entityShapes) {
		this.entityShapes = entityShapes;
	}
	
}
