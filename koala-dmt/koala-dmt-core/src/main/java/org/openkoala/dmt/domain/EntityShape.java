package org.openkoala.dmt.domain;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;

@Entity
@DiscriminatorValue("EntityShape")
public class EntityShape extends DomainShape {
	
	private static final long serialVersionUID = 8316188536715463152L;
	
	private Set<Property> properties = new HashSet<Property>();

	private Boolean isAbstractEntity = false;
	
	private Boolean isMappedSuperClass = false;
	
	@ElementCollection
	@CollectionTable(name = "ENTITY_PROPERTIES", joinColumns = @JoinColumn(name = "ENTITY_SHAPE_ID"))
	public Set<Property> getProperties() {
		return properties;
	}

	public void setProperties(Set<Property> properties) {
		this.properties = properties;
	}

	@Column(name = "IS_ABSTRACT_ENTITY")
	public Boolean getIsAbstractEntity() {
		return isAbstractEntity;
	}

	public void setIsAbstractEntity(Boolean isAbstractEntity) {
		this.isAbstractEntity = isAbstractEntity;
	}

	@Column(name = "IS_MAPPED_SUPER_CLASS")
	public Boolean getIsMappedSuperClass() {
		return isMappedSuperClass;
	}

	public void setIsMappedSuperClass(Boolean isMappedSuperClass) {
		this.isMappedSuperClass = isMappedSuperClass;
	}

}
