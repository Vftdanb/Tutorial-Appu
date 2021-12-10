package org.openkoala.dmt.domain;

import static org.junit.Assert.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.Test;

public class DomainsChartTest extends BaseIntegrationTest {

	private String chartName = "domainschart";
	private Project project = new Project();
	
	@Test
	public void testSave() {
		DomainsChart domainsChart = generateDomainsChart();
		domainsChart.save();
		assertEquals(domainsChart, DomainsChart.get(DomainsChart.class, domainsChart.getId()));
	}
	
	@Test
	public void testGetByProjectNameAndName() {
		DomainsChart domainsChart = generateDomainsChart();
		domainsChart.save();
		assertEquals(domainsChart, DomainsChart.getByProjectAndName(project, chartName));
	}
	
	@Test
	public void testFindByProjectName() {
		DomainsChart domainsChart = generateDomainsChart();
		domainsChart.save();
		
		List<DomainsChart> domainsCharts = DomainsChart.findByProject(project);
		assertNotNull(domainsCharts);
		assertTrue(domainsCharts.contains(domainsChart));
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
		entityShape.setPosition(new Position(100, 100));
		entityShape.setShapeId("entityshapeid");
		entityShape.setProperties(properties);
		
		InterfaceShape interfaceShap = new InterfaceShape();
		interfaceShap.setDomainsChart(result);
		interfaceShap.setName("Interface");
		interfaceShap.setHeight(20);
		interfaceShap.setWidth(20);
		interfaceShap.setPosition(new Position(200, 100));
		interfaceShap.setShapeId("interfaceshapeid");
		
		EnumShape enumShape = new EnumShape();
		enumShape.setDomainsChart(result);
		enumShape.setName("Enum");
		enumShape.setHeight(20);
		enumShape.setWidth(20);
		enumShape.setPosition(new Position(300, 100));
		enumShape.setShapeId("enumshapeid");
		
		domainShapes.add(entityShape);
		domainShapes.add(enumShape);
		domainShapes.add(interfaceShap);
		
		project.setName("projectname");
		project.save();
		result.setProject(project);
		
		result.setName(chartName);
		result.setDomainShapes(domainShapes);
		result.setLineInfo("line-info");
		
		return result;
	}

}
