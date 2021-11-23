package org.openkoala.dmt.domain;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;

@Entity
@DiscriminatorValue("InterfaceShape")
public class InterfaceShape extends DomainShape {

	private static final long serialVersionUID = 4578638473368397507L;

//	private Set<EntityShape> superEntityShapes;

//	@ManyToMany(cascade = CascadeType.ALL, mappedBy = "implementsInterfaceShapes")
//	public Set<EntityShape> getSuperEntityShapes() {
//		return superEntityShapes;
//	}

//	public void setSuperEntityShapes(Set<EntityShape> superEntityShapes) {
//		this.superEntityShapes = superEntityShapes;
//	}
	
}
