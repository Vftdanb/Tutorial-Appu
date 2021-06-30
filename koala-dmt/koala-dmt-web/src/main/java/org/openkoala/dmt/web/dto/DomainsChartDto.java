package org.openkoala.dmt.web.dto;

import java.util.HashSet;
import java.util.Set;

import org.openkoala.dmt.domain.DomainsChart;

public class DomainsChartDto {

	private Long id;
	
	private String name;
	
	private Set<DomainShapeDto> domainShapeDtos = new HashSet<DomainShapeDto>();
	
	private Set<LineDto> lineDtos = new HashSet<LineDto>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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
		//TODO 待实现
		return null;
	}
	
}
