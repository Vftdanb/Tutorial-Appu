package org.openkoala.dmt.web.dto;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.openkoala.dmt.domain.*;

public class DomainShapeDto implements Dto {

	private static final long serialVersionUID = -1551254242524216902L;

	enum ShapeType {
		ENTITY,
		INTERFACE,
		ENUM
	}

	private Long id;
	
	private int version;
	
	private ShapeType shapeType;

	private String shapeId;
	
	private Position position;
	
	private Integer width;
	
	private Integer height;
	
	private String name;
	
	private EntityType entityType;
	
	private Set<Property> properties = new HashSet<Property>();

	private List<String> enumItems = new ArrayList<String>();
	
	private String description;
	
	private String parentName;
	
	private Set<String> implementsNameSet = new HashSet<String>();
	
	private Long domainsChartId;

    private Set<Action> actions = new HashSet<Action>();

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

	public Position getPosition() {
		return position;
	}

	public void setPosition(Position position) {
		this.position = position;
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

	public List<String> getEnumItems() {
		return enumItems;
	}

	public void setEnumItems(List<String> enumItems) {
		this.enumItems = enumItems;
	}
	
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getParentName() {
		return parentName;
	}

	public void setParentName(String parentName) {
		this.parentName = parentName;
	}

	public Set<String> getImplementsNameSet() {
		return implementsNameSet;
	}

	public void setImplementsNameSet(
			Set<String> implementsNameSet) {
		this.implementsNameSet = implementsNameSet;
	}

	public Long getDomainsChartId() {
		return domainsChartId;
	}

	public void setDomainsChartId(Long domainsChartId) {
		this.domainsChartId = domainsChartId;
	}

    public Set<Action> getActions() {
        return actions;
    }

    public void setActions(Set<Action> actions) {
        this.actions = actions;
    }

	public DomainShape transformToDomainShape() {
		if (ShapeType.ENTITY.equals(shapeType)) {
			return generateEntityShape();
		}
		
		if (ShapeType.INTERFACE.equals(shapeType)) {
			return generateInterfaceShape();
		}
		
		if (ShapeType.ENUM.equals(shapeType)) {
			return generateEnumShape();
		}
		
		return null;
	}
	
	private EntityShape generateEntityShape() {
		EntityShape result = new EntityShape();
		dealCommonsPropertiesValue(result);
		result.setEntityType(entityType);
		result.setProperties(properties);
		return result;
	}
	
	private <T extends DomainShape> void dealCommonsPropertiesValue(T domainShape) {
		domainShape.setId(id);
		domainShape.setVersion(version);
		domainShape.setShapeId(shapeId);
		domainShape.setName(name);
		domainShape.setPosition(position);
		domainShape.setDescription(description);
	}
	
	private InterfaceShape generateInterfaceShape() {
		InterfaceShape result = new InterfaceShape();
		dealCommonsPropertiesValue(result);
		return result;
	}
	
	private EnumShape generateEnumShape() {
		EnumShape result = new EnumShape();
		dealCommonsPropertiesValue(result);
		result.setEnumItems(enumItems);
		return result;
	}
	
	public static DomainShapeDto getInstance(DomainShape domainShape) {
		DomainShapeDto result = new DomainShapeDto();
		result.setId(domainShape.getId());
		result.setVersion(domainShape.getVersion());
		result.setName(domainShape.getName());
		result.setShapeId(domainShape.getShapeId());
		result.setPosition(domainShape.getPosition());
		result.setDescription(domainShape.getDescription());
		result.setDomainsChartId(domainShape.getDomainsChart().getId());
		
		if (domainShape instanceof EntityShape) {
			EntityShape entityShape = (EntityShape) domainShape;
			result.setShapeType(ShapeType.ENTITY);
			result.setEntityType(entityShape.getEntityType());
			result.setProperties(entityShape.getProperties());
			
			for (InterfaceShape interfaceShape : entityShape.getImplementsInterfaceShapes()) {
				result.getImplementsNameSet().add(interfaceShape.getName());
			}
		}
		
		if (domainShape instanceof InterfaceShape) {
			result.setShapeType(ShapeType.INTERFACE);
		}
		
		if (domainShape instanceof EnumShape) {
			EnumShape enumShape = (EnumShape) domainShape;
			result.setShapeType(ShapeType.ENUM);
			result.setEnumItems(enumShape.getEnumItems());
		}
		
		return result;
	}

	@Override
	public boolean equals(final Object other) {
		if (this == other)
			return true;
		if (!(other instanceof DomainShapeDto))
			return false;
		DomainShapeDto castOther = (DomainShapeDto) other;
		return new EqualsBuilder()
				.append(shapeId, castOther.shapeId)
				.append(name, castOther.name)
				.append(domainsChartId, castOther.domainsChartId).isEquals();
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder(17, 37).append(shapeId).append(name).append(domainsChartId).toHashCode();
	}

}
