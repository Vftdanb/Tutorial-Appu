package org.openkoala.dmt.domain.gencode;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.openkoala.dmt.codegen.metadata.ActionInfo;
import org.openkoala.dmt.codegen.metadata.ClassCategory;
import org.openkoala.dmt.codegen.metadata.DomainClassInfo;
import org.openkoala.dmt.codegen.metadata.PropertyExt;
import org.openkoala.dmt.codegen.metadata.PropertyInfo;
import org.openkoala.dmt.codegen.metadata.PropertyType;
import org.openkoala.dmt.codegen.metadata.proptype.CollectionPropertyType;
import org.openkoala.dmt.codegen.metadata.proptype.ListPropertyType;
import org.openkoala.dmt.codegen.metadata.proptype.SetPropertyType;
import org.openkoala.dmt.codegen.metadata.proptype.SingleValuePropertyType;
import org.openkoala.dmt.codegen.metadata.proptype.SortedSetPropertyType;
import org.openkoala.dmt.domain.Action;
import org.openkoala.dmt.domain.DomainPropertyRelation;
import org.openkoala.dmt.domain.DomainShape;
import org.openkoala.dmt.domain.EntityShape;
import org.openkoala.dmt.domain.EntityType;
import org.openkoala.dmt.domain.EnumShape;
import org.openkoala.dmt.domain.InterfaceShape;
import org.openkoala.dmt.domain.Property;
import org.openkoala.dmt.utils.UpperUnderscoreConvertor;

import com.google.common.base.CaseFormat;

public class EntityInfoGenerator {

	Set<DomainShape> domainShapes;
	
	public EntityInfoGenerator(Set<DomainShape> domainShapes) {
		this.domainShapes = domainShapes;
	}
	
	public Set<DomainClassInfo> generateEntityInfos() {
		if (domainShapes == null) {
			throw new RuntimeException("domainShapes is null");
		}
		
		Set<DomainClassInfo> result = new HashSet<DomainClassInfo>();
		for (DomainShape domainShape : domainShapes) {
			result.add(generateEntityInfo(domainShape));
		}
		return result;
	}
	
	public DomainClassInfo generateEntityInfo(DomainShape domainShape) {
		DomainClassInfo result = createBasicEntityInfo(domainShape);
		result.setPropertyInfos(createPropertyInfos(domainShape));
		result.setActionInfos(createActionInfos(domainShape.getActions()));

        if (domainShape instanceof EntityShape) {
            EntityShape entityShape = (EntityShape) domainShape;
            result.setImplementsInterfaces(createInterfaceInfos(entityShape));
        }
		if (domainShape instanceof EnumShape) {
			EnumShape enumShape = (EnumShape) domainShape;
			result.setEnumItems(enumShape.getEnumItems());
		}
		return result;
	}

    private DomainClassInfo createBasicEntityInfo(DomainShape domainShape) {
		DomainClassInfo result = new DomainClassInfo();
		result.setClassName(domainShape.getName());
		
		UpperUnderscoreConvertor upperUnderscoreConvertor = new UpperUnderscoreConvertor(domainShape.getName());
		result.setTableName(upperUnderscoreConvertor.convert());
		result.setEntityComment(domainShape.getDescription());
		result.setAbstract(isAbstractEntity(domainShape));
		result.setDiscriminator(domainShape.getName().toUpperCase());
		
		if (domainShape.getParent() != null) {
			result.setBaseClass(domainShape.getParent().getName());
		}
		result.setCategory(getClassCategory(domainShape));
		return result;
	}

    private Set<String> createInterfaceInfos(EntityShape entityShape) {
        Set<String> results = new HashSet<String>();
        for (InterfaceShape interfaceShape : entityShape.getImplementsInterfaceShapes()) {
            results.add(interfaceShape.getName());
        }
        return results;
    }

	private ClassCategory getClassCategory(DomainShape domainShape) {
		if (domainShape instanceof InterfaceShape) {
			return ClassCategory.INTERFACE;
		}
		
		if (domainShape instanceof EnumShape) {
			return ClassCategory.ENUM;
		}
		
		if (domainShape instanceof EntityShape) {
			EntityShape entityShape = (EntityShape) domainShape;
			if (entityShape.getEntityType().equals(EntityType.MAPPED_SUPER_CLASS)) {
				return ClassCategory.MAPPED_SUPER_CLASS;
			}
			if (entityShape.getEntityType().equals(EntityType.VALUE_OBJECT)) {
				return ClassCategory.EMBEDDABLE;
			}
		}
		
		return ClassCategory.ENTITY;
	}

	private boolean isAbstractEntity(DomainShape domainShape) {
		if (domainShape instanceof EntityShape) {
			EntityShape entityShape = (EntityShape) domainShape;
			if (entityShape.getEntityType().equals(EntityType.ABSTRACT_ENTITY)
					|| entityShape.getEntityType().equals(EntityType.MAPPED_SUPER_CLASS)) {
				return true;
			}
		}
		return false;
	}

	private List<PropertyInfo> createPropertyInfos(DomainShape domainShape) {
		List<PropertyInfo> results = new ArrayList<PropertyInfo>();
		
		if (!(domainShape instanceof EntityShape)) {
			return results;
		}
		
		EntityShape entityShape = (EntityShape) domainShape;
		for (Property property : entityShape.getProperties()) {
			results.add(createPropertyInfoByProperty(property));
		}
		return results;
	}
	
	private List<ActionInfo> createActionInfos(Set<Action> actions) {
		List<ActionInfo> results = new ArrayList<ActionInfo>();
		for (Action action : actions) {
			results.add(createActionInfo(action));
		}
		return results;
	}
	
	private ActionInfo createActionInfo(Action action) {
		ActionInfo result = new ActionInfo();
        result.setModifier(action.getModifier());
		result.setName(action.getName());
		result.setDescription(action.getDescription());
		result.setReturnType(action.getReturnType());
        result.setAbstract(action.isAbstract());
        result.setFinal(action.isFinal());
        result.setStatic(action.isStatic());
		for (Property parameter : action.getArguments()) {
			result.getParameters().add(createPropertyInfoByProperty(parameter));
		}
		
		return result;
	}

	private PropertyInfo createPropertyInfoByProperty(Property property) {
		PropertyInfo result = new PropertyInfo();
		result.setName(property.getName());
		
		UpperUnderscoreConvertor upperUnderscoreConvertor = new UpperUnderscoreConvertor(property.getName());
		result.setColumnName(upperUnderscoreConvertor.convert());
		result.setComment(property.getDescription());
		result.setType(getPropertyType(property.getType(), property.getGenericity()));
		result.setTypeExt(getTypeExt(property));
		result.setBusinessPK(property.getBusinessPK());
		
		//如果是OneToMany的关联关系，默认mappedby使用类名，首字母小写。
		if (property.getRelation() == DomainPropertyRelation.OneToMany) {
			result.setMappedBy(CaseFormat.UPPER_CAMEL.to(CaseFormat.LOWER_CAMEL, property.getName()));
		}
		
		result.setNullable(property.getNullable());
		return result;
	}

	private PropertyExt getTypeExt(Property property) {
		if (property.getType().equals("Date")) {
			return PropertyExt.TIMESTAMP;
		}
		if (property.getRelation() != null) {
			if (property.getRelation().equals(DomainPropertyRelation.ManyToOne)) {
				return PropertyExt.MANY_TO_ONE;
			}
			if (property.getRelation().equals(DomainPropertyRelation.ManyToMany)) {
				return PropertyExt.MANY_TO_MANY;
			}
			if (property.getRelation().equals(DomainPropertyRelation.OneToOne)) {
				return PropertyExt.ONE_TO_ONE;
			}
			if (property.getRelation().equals(DomainPropertyRelation.OneToMany)) {
				return PropertyExt.ONE_TO_MANY;
			}
			if (property.getRelation().equals(DomainPropertyRelation.ElementCollection)) {
				return PropertyExt.ELEMENT_COLLECTION;
			}
			if (property.getRelation().equals(DomainPropertyRelation.Embedded)) {
				return PropertyExt.EMBEDDABLE;
			}
			if (property.getRelation().equals(DomainPropertyRelation.Enumerated)) {
				return PropertyExt.ENUM;
			}
		}
		return null;
	}

	private PropertyType getPropertyType(String propertyType, String genericity) {
		if (propertyType.equals("Collection")) {
			return new CollectionPropertyType(genericity);
		}
		if (propertyType.equals("List")) {
			return new ListPropertyType(genericity);
		}
		if (propertyType.equals("Set")) {
			return new SetPropertyType(genericity);
		}
		if (propertyType.equals("SortedSet")) {
			return new SortedSetPropertyType(genericity);
		}
//		if (propertyType.equals("Map")) {
//			return new MapPropertyType(CodeGenUtils.getMapKeyType(genericity), CodeGenUtils.getMapValueType(dataType));
//		}
//		if (propertyType.equals("SortedMap")) {
//			return new SortedMapPropertyType(CodeGenUtils.getMapKeyType(dataType), CodeGenUtils.getMapValueType(dataType));
//		} 
		return new SingleValuePropertyType(propertyType);
	}
}
