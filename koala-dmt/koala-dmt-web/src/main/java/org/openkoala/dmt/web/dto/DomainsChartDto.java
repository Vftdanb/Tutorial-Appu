package org.openkoala.dmt.web.dto;

import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.openkoala.dmt.domain.DomainShape;
import org.openkoala.dmt.domain.DomainsChart;
import org.openkoala.dmt.domain.EntityShape;
import org.openkoala.dmt.domain.InterfaceShape;
import org.openkoala.dmt.domain.Project;
import org.openkoala.dmt.web.dto.DomainShapeDto.ShapeType;

public class DomainsChartDto implements Dto {

	private static final long serialVersionUID = 3411792002890207219L;

	private Long id;
	
	private int version;
	
	private Project project;
	
	private String name;
	
	private Set<DomainShapeDto> domainShapeDtos = new HashSet<DomainShapeDto>();

    private String domainShapeInfo;

	private String lineInfo;
	
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

	public Project getProject() {
		return project;
	}

	public void setProject(Project project) {
		this.project = project;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Set<DomainShapeDto> getDomainShapeDtos() {
		return domainShapeDtos;
	}

	public void setDomainShapeDtos(Set<DomainShapeDto> domainShapeDtos) {
		this.domainShapeDtos = domainShapeDtos;
	}

    public String getDomainShapeInfo() {
        return domainShapeInfo;
    }

    public void setDomainShapeInfo(String domainShapeInfo) {
        this.domainShapeInfo = domainShapeInfo;
    }

    public String getLineInfo() {
		return lineInfo;
	}

	public void setLineInfo(String lineInfo) {
		this.lineInfo = lineInfo;
	}

	public DomainsChart transformToDomainsChart() {
		DomainsChart result = new DomainsChart();
		result.setId(id);
		result.setVersion(version);
		result.setName(name);
		result.setProject(project);
		result.setLineInfo(lineInfo);
		
		for (DomainShapeDto domainShapeDto : domainShapeDtos) {
			DomainShape domainShape = domainShapeDto.transformToDomainShape();
			domainShape.setDomainsChart(result);
			result.getDomainShapes().add(domainShape);
		}

		setEntityAndInterfaceAssociation(result);
		setDomainShapeParent(result);
		return result;
	}
	
	private void setEntityAndInterfaceAssociation(DomainsChart domainsChart) {
		for (DomainShapeDto domainShapeDto : getDomainShapeDtos()) {
			if (domainShapeDto.getShapeType() == ShapeType.ENTITY) {
				for (String interfaceName : domainShapeDto.getImplementsNameSet()) {
					EntityShape entityShape = (EntityShape) getDomainShapeByName(domainsChart, domainShapeDto.getName());
					InterfaceShape interfaceShape = (InterfaceShape) getDomainShapeByName(domainsChart, interfaceName);
					entityShape.getImplementsInterfaceShapes().add(interfaceShape);
					interfaceShape.getEntityShapes().add(entityShape);
				}
			}
		}
	}
	
	private void setDomainShapeParent(DomainsChart domainsChart) {
		for (DomainShapeDto domainShapeDto : getDomainShapeDtos()) {
			if (domainShapeDto.getParentName() != null) {
				getDomainShapeByName(domainsChart, domainShapeDto.getName())
					.setParent(getDomainShapeByName(domainsChart, domainShapeDto.getParentName()));
			}
		}
	}

	private DomainShape getDomainShapeByName(DomainsChart domainsChart, String name) {
		for (DomainShape domainShape : domainsChart.getDomainShapes()) {
			if (domainShape.getName().equals(name)) {
				return domainShape;
			}
		}
		return null;
	}
	
	public static DomainsChartDto getInstance(DomainsChart domainsChart) {
		DomainsChartDto result = new DomainsChartDto();
		result.setId(domainsChart.getId());
		result.setVersion(domainsChart.getVersion());
		result.setProject(domainsChart.getProject());
		result.setName(domainsChart.getName());
		result.setLineInfo(domainsChart.getLineInfo());
		
		for (DomainShape domainShape : domainsChart.getDomainShapes()) {
			result.getDomainShapeDtos().add(DomainShapeDto.getInstance(domainShape));
		}
		
		return result;
	}
	
	@Override
	public boolean equals(final Object other) {
		if (this == other)
			return true;
		if (!(other instanceof DomainsChartDto))
			return false;
		DomainsChartDto castOther = (DomainsChartDto) other;
		return new EqualsBuilder().append(project, castOther.project).append(name, castOther.name).isEquals();
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder(17, 37).append(name).append(project).toHashCode();
	}
	
}
