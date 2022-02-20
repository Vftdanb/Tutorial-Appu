package org.openkoala.dmt.domain.gencode;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.openkoala.dmt.domain.DomainPropertyRelation;
import org.openkoala.dmt.domain.DomainShape;
import org.openkoala.dmt.domain.DomainsChart;
import org.openkoala.dmt.domain.EntityShape;
import org.openkoala.dmt.domain.EntityType;
import org.openkoala.dmt.domain.Property;

public class DefaultRelationSetter {

	private static final String[] STRING_AND_WRAP_TYPES = {"String", "Integer", "Long ", "Character", "Float", "Double", "Byte", "Short", "Boolean"};
	private static final String[] COLLECTION_TYPES = {"Collection", "List", "Set ", "Map"};
	
	private DomainsChart domainsChart;
	
	public DefaultRelationSetter(DomainsChart domainsChart) {
		this.domainsChart = domainsChart;
	}
	
	public void setRelationForProperties() {
		for (DomainShape domainShape : domainsChart.getDomainShapes()) {
			if (domainShape instanceof EntityShape) {
				EntityShape entityShape = (EntityShape) domainShape;
				for (Property property : entityShape.getProperties()) {
					setRelation(property);
				}
			}
		}
	}
	
	private DomainPropertyRelation setRelation(Property property) {
		if (!isCollectionType(property.getType())) {
			return null;
		}
		
		if (isStringOrWrapType(property.getGenericity()) || isObjectValue(property.getType())) {
			return DomainPropertyRelation.ElementCollection;
		}
		
		return null;
	}
	
	private boolean isObjectValue(String entityName) {
		for (DomainShape domainShape : domainsChart.getDomainShapes()) {
			if (domainShape instanceof EntityShape) {
				EntityShape entityShape = (EntityShape) domainShape;
				return entityShape.getName().equals(entityName) && entityShape.getEntityType() == EntityType.VALUE_OBJECT;
			}
		}
		return false;
	}
	
	private boolean isStringOrWrapType(String type) {
		if (type == null) {
			return false;
		}
		
		List<String> types = Arrays.asList(STRING_AND_WRAP_TYPES);
		return types.contains(type);
	}
	
	private boolean isCollectionType(String type) {
		if (type == null) {
			return false;
		}
		
		List<String> types = Arrays.asList(COLLECTION_TYPES);
		return types.contains(type);
	}
}
