package org.openkoala.dmt.web.dto;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.openkoala.dmt.domain.DomainShape;
import org.openkoala.dmt.domain.DomainsChart;
import org.openkoala.dmt.domain.EntityShape;
import org.openkoala.dmt.domain.EnumShape;
import org.openkoala.dmt.domain.InterfaceShape;
import org.openkoala.dmt.domain.LeftTopPoint;
import org.openkoala.dmt.domain.Property;
import org.openkoala.dmt.domain.ValueObjectShape;

public class DomainShapeDto {

	private enum ShapeType {
		EntityShape,
		ValueObjectShape,
		InterfaceShape,
		EnumShape
	}

	private Long id;
	
	private int version;
	
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
	
	private Long domainsChartId;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
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
	
	public Long getDomainsChartId() {
		return domainsChartId;
	}

	public void setDomainsChartId(Long domainsChartId) {
		this.domainsChartId = domainsChartId;
	}

	public DomainShape transformToDomainShape() {
		if (ShapeType.EntityShape.equals(shapeType)) {
			return generateEntityShape();
		}
		
		if (ShapeType.InterfaceShape.equals(shapeType)) {
			return generateInterfaceShape();
		}
		
		if (ShapeType.EnumShape.equals(shapeType)) {
			return generateEnumShape();
		}
		
		return null;
	}
	
	public EntityShape generateEntityShape() {
		EntityShape result = new EntityShape();
		result.setId(id);
		result.setVersion(version);
		result.setShapeId(shapeId);
		result.setName(name);
		result.setLeftTopPoint(leftTopPoint);
		result.setHeight(height);
		result.setWidth(width);
		result.setIsAbstractEntity(isAbstractEntity);
		result.setIsMappedSuperClass(isMappedSuperClass);
		result.setProperties(properties);
		result.setDomainsChart(generateDomainsChart());
		
		return result;
	}
	
	public ValueObjectShape generateValueObjectShape() {
		ValueObjectShape result = new ValueObjectShape();
		result.setId(id);
		result.setVersion(version);
		result.setShapeId(shapeId);
		result.setName(name);
		result.setLeftTopPoint(leftTopPoint);
		result.setHeight(height);
		result.setWidth(width);
		result.setProperties(properties);
		result.setDomainsChart(generateDomainsChart());
		
		return result;
	}
	
	public InterfaceShape generateInterfaceShape() {
		InterfaceShape result = new InterfaceShape();
		result.setId(id);
		result.setVersion(version);
		result.setShapeId(shapeId);
		result.setName(name);
		result.setLeftTopPoint(leftTopPoint);
		result.setHeight(height);
		result.setWidth(width);
		result.setDomainsChart(generateDomainsChart());
		
		return result;
	}
	
	public EnumShape generateEnumShape() {
		EnumShape result = new EnumShape();
		result.setId(id);
		result.setVersion(version);
		result.setShapeId(shapeId);
		result.setName(name);
		result.setLeftTopPoint(leftTopPoint);
		result.setHeight(height);
		result.setWidth(width);
		result.setEnumItems(enumItems);
		result.setDomainsChart(generateDomainsChart());
		
		return result;
	}
	
	public DomainsChart generateDomainsChart() {
		DomainsChart result = new DomainsChart();
		result.setId(domainsChartId);
		return result;
	}

	public static DomainShapeDto generateDtoBy(DomainShape domainShape) {
		DomainShapeDto result = new DomainShapeDto();
		result.setId(domainShape.getId());
		result.setVersion(domainShape.getVersion());
		result.setName(domainShape.getName());
		result.setShapeId(domainShape.getShapeId());
		result.setLeftTopPoint(domainShape.getLeftTopPoint());
		result.setHeight(domainShape.getHeight());
		result.setWidth(domainShape.getWidth());
		result.setDomainsChartId(domainShape.getDomainsChart().getId());
		
		if (domainShape instanceof EntityShape) {
			EntityShape entityShape = (EntityShape) domainShape;
			result.setShapeType(ShapeType.EntityShape);
			result.setIsAbstractEntity(entityShape.getIsAbstractEntity());
			result.setIsMappedSuperClass(entityShape.getIsMappedSuperClass());
			result.setProperties(entityShape.getProperties());
		}
		
		if (domainShape instanceof ValueObjectShape) {
			ValueObjectShape valueObjectShape = (ValueObjectShape) domainShape;
			result.setShapeType(ShapeType.ValueObjectShape);
			result.setProperties(valueObjectShape.getProperties());
		}
		
		if (domainShape instanceof InterfaceShape) {
			result.setShapeType(ShapeType.InterfaceShape);
		}
		
		if (domainShape instanceof EnumShape) {
			EnumShape enumShape = (EnumShape) domainShape;
			result.setShapeType(ShapeType.EnumShape);
			result.setEnumItems(enumShape.getEnumItems());
		}
		
		return result;
	}
}
