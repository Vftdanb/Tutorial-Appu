package org.openkoala.dmt.domain;

import static org.junit.Assert.*;

import java.util.HashSet;
import java.util.Set;

import org.junit.Test;

public class DomainsChartTest extends BaseIntegrationTest {

	@Test
	public void testSave() {
		DomainsChart domainsChart = generateDomainsChart();
		domainsChart.save();
		assertEquals(domainsChart, DomainsChart.get(DomainsChart.class, domainsChart.getId()));
	}
	
	private DomainsChart generateDomainsChart() {
		DomainsChart result = new DomainsChart();
		Set<DomainShape> domainShapes = new HashSet<DomainShape>();
		
		Set<Property> properties = new HashSet<Property>();
		Property property = new Property();
		property.setName("property1");
		property.setType("String");
		properties.add(property);
		
		EntityShape entityShape = new EntityShape();
		entityShape.setDomainsChart(result);
		entityShape.setName("Entity");
		entityShape.setHeight(20);
		entityShape.setWidth(20);
		entityShape.setLeftTopPoint(new LeftTopPoint(100, 100));
		entityShape.setShapeId("entityshapeid");
		entityShape.setProperties(properties);
		
		InterfaceShape interfaceShap = new InterfaceShape();
		interfaceShap.setDomainsChart(result);
		interfaceShap.setName("Interface");
		interfaceShap.setHeight(20);
		interfaceShap.setWidth(20);
		interfaceShap.setLeftTopPoint(new LeftTopPoint(200, 100));
		interfaceShap.setShapeId("interfaceshapeid");
		
		EnumShape enumShape = new EnumShape();
		enumShape.setDomainsChart(result);
		enumShape.setName("Enum");
		enumShape.setHeight(20);
		enumShape.setWidth(20);
		enumShape.setLeftTopPoint(new LeftTopPoint(300, 100));
		enumShape.setShapeId("enumshapeid");
		
		domainShapes.add(entityShape);
		domainShapes.add(enumShape);
		domainShapes.add(interfaceShap);
		
		Set<Line> lines = new HashSet<Line>();
		Line line = new Line();
		line.setFromShape(entityShape);
		line.setToShape(enumShape);
		line.setLineType(LineType.ASSOCIATE);
		lines.add(line);
		
		result.setName("domainschart");
		result.setDomainShapes(domainShapes);
		result.setLines(lines);
		
		return result;
	}

}
