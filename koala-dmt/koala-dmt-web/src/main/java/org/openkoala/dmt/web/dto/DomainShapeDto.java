package org.openkoala.dmt.web.dto;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.openkoala.dmt.domain.LeftTopPoint;
import org.openkoala.dmt.domain.Property;

public class DomainShapeDto {

	private Long id;
	
	private ShapeType shapeType;

	private String shapeId;
	
	private LeftTopPoint leftTopPoint;
	
	private Integer width;
	
	private Integer height;
	
	private String name;
	
	private Set<Property> properties = new HashSet<Property>();

	private Boolean isAbstractEntity = false;
	
	private Boolean isMappedSuperClass = false;
	
	private List<String> enumItems = new ArrayList<String>();
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public ShapeType getShapeType() {
		return shapeType;
	}

	public void setShapeType(ShapeType shapeType) {
		this.shapeType = shapeType;
	}

	public String getShapeId() {
		return shapeId;
	}

	public void setShapeId(String shapeId) {
		this.shapeId = shapeId;
	}

	public LeftTopPoint getLeftTopPoint() {
		return leftTopPoint;
	}

	public void setLeftTopPoint(LeftTopPoint leftTopPoint) {
		this.leftTopPoint = leftTopPoint;
	}

	public Integer getWidth() {
		return width;
	}

	public void setWidth(Integer width) {
		this.width = width;
	}

	public Integer getHeight() {
		return height;
	}

	public void setHeight(Integer height) {
		this.height = height;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Set<Property> getProperties() {
		return properties;
	}

	public void setProperties(Set<Property> properties) {
		this.properties = properties;
	}

	public Boolean getIsAbstractEntity() {
		return isAbstractEntity;
	}

	public void setIsAbstractEntity(Boolean isAbstractEntity) {
		this.isAbstractEntity = isAbstractEntity;
	}

	public Boolean getIsMappedSuperClass() {
		return isMappedSuperClass;
	}

	public void setIsMappedSuperClass(Boolean isMappedSuperClass) {
		this.isMappedSuperClass = isMappedSuperClass;
	}

	public List<String> getEnumItems() {
		return enumItems;
	}

	public void setEnumItems(List<String> enumItems) {
		this.enumItems = enumItems;
	}

	private enum ShapeType {
		EntityShape,
		InterfaceShape,
		EnumShape
	}
	
}
