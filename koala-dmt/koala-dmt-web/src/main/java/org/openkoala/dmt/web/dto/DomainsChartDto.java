package org.openkoala.dmt.web.dto;

import java.util.HashSet;
import java.util.Set;

import org.openkoala.dmt.domain.DomainShape;
import org.openkoala.dmt.domain.DomainsChart;

public class DomainsChartDto {

	private Long id;
	
	private int version;
	
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
		result.setName(name);
		result.setVersion(version);
		
		for (DomainShapeDto domainShapeDto : domainShapeDtos) {
			result.getDomainShapes().add(domainShapeDto.transformToDomainShape());
		}
		
		return result;
	}
	
	public DomainShape getDomainShapeByShapeId(String shapeId) {
		for (DomainShapeDto domainShapeDto : domainShapeDtos) {
			if (shapeId.equals(domainShapeDto.getShapeId())) {
				return domainShapeDto.transformToDomainShape();
			}
		}
		return null;
	}
	
}
