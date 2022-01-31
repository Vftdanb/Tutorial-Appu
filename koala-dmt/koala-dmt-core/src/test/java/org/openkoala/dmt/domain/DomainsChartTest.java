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
		
		InterfaceShape interfaceShap = new InterfaceShape();
		EntityShape entityShape = new EntityShape();
		EnumShape enumShape = new EnumShape();
		
		interfaceShap.setDomainsChart(result);
		interfaceShap.setName("Interface");
		interfaceShap.setPosition(new Position(200, 100));
		interfaceShap.setShapeId("interfaceshapeid");
		interfaceShap.getEntityShapes().add(entityShape);
		
		entityShape.setDomainsChart(result);
		entityShape.setName("Entity");
		entityShape.setPosition(new Position(100, 100));
		entityShape.setShapeId("entityshapeid");
		entityShape.setProperties(properties);
		entityShape.getImplementsInterfaceShapes().add(interfaceShap);
		
		enumShape.setDomainsChart(result);
		enumShape.setName("Enum");
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
