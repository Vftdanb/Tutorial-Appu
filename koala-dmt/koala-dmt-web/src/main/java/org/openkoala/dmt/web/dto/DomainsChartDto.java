package org.openkoala.dmt.web.dto;

import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.openkoala.dmt.domain.DomainShape;
import org.openkoala.dmt.domain.DomainsChart;
import org.openkoala.dmt.domain.Line;
import org.openkoala.dmt.domain.Project;

public class DomainsChartDto implements Dto {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3411792002890207219L;

	private Long id;
	
	private int version;
	
	private Project project;
	
	private String name;
	
	private Set<DomainShapeDto> domainShapeDtos = new HashSet<DomainShapeDto>();
	
	private Set<LineDto> lineDtos = new HashSet<LineDto>();

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

	public Set<LineDto> getLineDtos() {
		return lineDtos;
	}

	public void setLineDtos(Set<LineDto> lineDtos) {
		this.lineDtos = lineDtos;
	}
	
	public DomainsChart transformToDomainsChart() {
		DomainsChart result = new DomainsChart();
		result.setId(id);
		result.setVersion(version);
		result.setName(name);
		result.setProject(project);
		
		for (DomainShapeDto domainShapeDto : domainShapeDtos) {
			result.getDomainShapes().add(domainShapeDto.transformToDomainShape(this));
		}
		
		return result;
	}
	
	public DomainShape getDomainShapeByShapeId(String shapeId) {
		for (DomainShapeDto domainShapeDto : domainShapeDtos) {
			if (shapeId.equals(domainShapeDto.getShapeId())) {
				return domainShapeDto.transformToDomainShape(this);
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
		
		for (DomainShape domainShape : domainsChart.getDomainShapes()) {
			result.getDomainShapeDtos().add(DomainShapeDto.getInstance(domainShape));
		}
		
		for (Line line : domainsChart.getLines()) {
			result.getLineDtos().add(LineDto.getInstance(line));
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
