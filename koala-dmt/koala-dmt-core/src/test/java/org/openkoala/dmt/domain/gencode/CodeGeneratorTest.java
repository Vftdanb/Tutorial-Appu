package org.openkoala.dmt.domain.gencode;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.Ignore;
import org.junit.Test;
import org.openkoala.dmt.domain.Action;
import org.openkoala.dmt.domain.DomainPropertyRelation;
import org.openkoala.dmt.domain.DomainShape;
import org.openkoala.dmt.domain.DomainsChart;
import org.openkoala.dmt.domain.EntityShape;
import org.openkoala.dmt.domain.EntityType;
import org.openkoala.dmt.domain.EnumShape;
import org.openkoala.dmt.domain.InterfaceShape;
import org.openkoala.dmt.domain.Project;
import org.openkoala.dmt.domain.Property;

@Ignore
public class CodeGeneratorTest {

	@Test
	public void testGenerateCodeFromDomainChart() {
		DomainsChart domainsChart = buildDomainsChartInstance();
		CodeGenerator codeGenerator = new CodeGenerator(domainsChart);
		codeGenerator.generateCode("org.openkoala.dmt.domain", "E:\\temp\\dmt-test");
	}
	
	private DomainsChart buildDomainsChartInstance() {
		DomainsChart result = new DomainsChart();
		result.setName("test-chart");
		result.setProject(new Project("test-project"));
		result.setDomainShapes(buildDomainShapes());
		return result;
	}

	private Set<DomainShape> buildDomainShapes() {
		Set<DomainShape> results = new HashSet<DomainShape>();
        DomainShape interfaceShape = buildInterfaceShape();
		results.add(interfaceShape);

		DomainShape abstractEntity = buildAbstractEntityShape();
		results.add(abstractEntity);

        Set<InterfaceShape> interfaceShapes = new HashSet<InterfaceShape>();
        interfaceShapes.add((InterfaceShape) interfaceShape);
		results.add(buildEntityShape(abstractEntity, interfaceShapes));

		results.add(buildValueObjectShape());
		results.add(buildMscShape());
		results.add(buildEnumerateShape());
		return results;
	}

	private DomainShape buildInterfaceShape() {
		InterfaceShape result = new InterfaceShape();
		result.setName("Thing");
		result.setDescription("test-interface");
		return result;
	}

	private DomainShape buildAbstractEntityShape() {
		EntityShape result = new EntityShape();
		result.setEntityType(EntityType.ABSTRACT_ENTITY);
		result.setName("Party");
		result.setDescription("test-abstract-entity");
		
		Set<Property> properties = new HashSet<Property>();
		Property nameProp = new Property();
		nameProp.setType("String");
		nameProp.setName("name");
		properties.add(nameProp);
		
		result.setProperties(properties);
		return result;
	}

	private DomainShape buildEntityShape(DomainShape parent, Set<InterfaceShape> implementsInterfaces) {
		EntityShape result = new EntityShape();
		result.setEntityType(EntityType.ENTITY);
		result.setName("Person");
		result.setDescription("test-entity");
		result.setParent(parent);
        result.setImplementsInterfaceShapes(implementsInterfaces);
		
		Set<Property> properties = new HashSet<Property>();
		Property ageProp = new Property();
		ageProp.setType("int");
		ageProp.setName("age");
		ageProp.setNullable(false);
		properties.add(ageProp);
		
		Property marriedProp = new Property();
		marriedProp.setType("Boolean");
		marriedProp.setName("married");
		properties.add(marriedProp);
		
		Property addrProp = new Property();
		addrProp.setType("Address");
		addrProp.setName("address");
		addrProp.setRelation(DomainPropertyRelation.Embedded);
		properties.add(addrProp);
		
		Property listProp = new Property();
		listProp.setType("List");
		listProp.setName("testList");
		listProp.setGenericity("String");
		listProp.setRelation(DomainPropertyRelation.ElementCollection);
		properties.add(listProp);
		result.setProperties(properties);
		
		List<Action> actions = new ArrayList<Action>();
		Action action = new Action();
		action.setName("action");
		action.setDescription("action-description");
		action.setReturnType("List<String>");
		
		Property parameter1 = new Property();
		parameter1.setType("Set");
		parameter1.setGenericity("Long");
		parameter1.setName("para1");
		action.getArguments().add(parameter1);
		
		Property parameter2 = new Property();
		parameter2.setType("String");
		parameter2.setName("para2");
		action.getArguments().add(parameter2);
		
		actions.add(action);
		result.setActions(actions);
		
		return result;
	}

	private DomainShape buildValueObjectShape() {
		EntityShape result = new EntityShape();
		result.setEntityType(EntityType.VALUE_OBJECT);
		result.setName("Address");
		result.setDescription("test-value-object");
		
		Set<Property> properties = new HashSet<Property>();
		Property countryProp = new Property();
		countryProp.setType("String");
		countryProp.setName("country");
		properties.add(countryProp);
		
		Property cityProp = new Property();
		cityProp.setType("String");
		cityProp.setName("city");
		properties.add(cityProp);
		
		result.setProperties(properties);
		return result;
	}

	private DomainShape buildMscShape() {
		EntityShape result = new EntityShape();
		result.setEntityType(EntityType.MAPPED_SUPER_CLASS);
		result.setName("MscEntity");
		result.setDescription("test-mapped-super-class");
		return result;
	}

	private DomainShape buildEnumerateShape() {
		EnumShape result = new EnumShape();
		result.setName("Gender");
		
		List<String> enumItems = new ArrayList<String>();
		enumItems.add("Male");
		enumItems.add("Female");
		enumItems.add("Unknown");
		enumItems.add("Bisexual");
		result.setEnumItems(enumItems);
		
		return result;
	}

}
