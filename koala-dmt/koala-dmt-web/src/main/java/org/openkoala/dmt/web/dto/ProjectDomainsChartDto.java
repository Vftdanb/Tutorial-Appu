package org.openkoala.dmt.web.dto;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.openkoala.dmt.domain.DomainsChart;
import org.openkoala.dmt.domain.Project;

public class ProjectDomainsChartDto implements Dto {

	private static final long serialVersionUID = -7516354332722533035L;

	private Long projectId;
	
	private int projectVersion;
	
	private String projectName;
	
	private List<DomainsChartDto> domainsChartDtos = new ArrayList<DomainsChartDto>();

	public Long getProjectId() {
		return projectId;
	}

	public void setProjectId(Long projectId) {
		this.projectId = projectId;
	}

	public int getProjectVersion() {
		return projectVersion;
	}

	public void setProjectVersion(int projectVersion) {
		this.projectVersion = projectVersion;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public List<DomainsChartDto> getDomainsChartDtos() {
		return domainsChartDtos;
	}

	public void setDomainsChartDtos(List<DomainsChartDto> domainsChartDtos) {
		this.domainsChartDtos = domainsChartDtos;
	}

	public static ProjectDomainsChartDto getInstance(Project project, List<DomainsChart> domainsCharts) {
		ProjectDomainsChartDto result = new ProjectDomainsChartDto();
		result.setProjectId(project.getId());
		result.setProjectVersion(project.getVersion());
		result.setProjectName(project.getName());
		
		for (DomainsChart domainsChart : domainsCharts) {
			result.getDomainsChartDtos().add(DomainsChartDto.getInstance(domainsChart));
		}
		
		return result;
	}
	
	@Override
	public boolean equals(final Object other) {
		if (this == other)
			return true;
		if (!(other instanceof ProjectDomainsChartDto))
			return false;
		ProjectDomainsChartDto castOther = (ProjectDomainsChartDto) other;
		return new EqualsBuilder().append(projectId, castOther.projectId).isEquals();
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder(17, 37).append(projectId).toHashCode();
	}

}