package org.openkoala.dmt.domain;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.dayatang.domain.AbstractEntity;

@Entity
@Table(name = "DOMAINS_CHART")
public class DomainsChart extends AbstractEntity {

	private static final long serialVersionUID = 3043999013741427550L;

	private String projectName;
	
	private String name;
	
	private Set<DomainShape> domainShapes = new HashSet<DomainShape>();

	private Set<Line> lines = new HashSet<Line>();
	
	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@OneToMany(mappedBy = "domainsChart", cascade = CascadeType.ALL)
	public Set<DomainShape> getDomainShapes() {
		return domainShapes;
	}

	public void setDomainShapes(Set<DomainShape> domainShapes) {
		this.domainShapes = domainShapes;
	}

	@OneToMany(mappedBy = "domainsChart", cascade = CascadeType.ALL)
	public Set<Line> getLines() {
		return lines;
	}

	public void setLines(Set<Line> lines) {
		this.lines = lines;
	}

	@Override
	public String[] businessKeys() {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * 查找某个项目下的所有领域模型图
	 * @param projectName
	 * @return
	 */
	public static List<DomainsChart> findByProjectName(String projectName) {
		return getRepository().createCriteriaQuery(DomainsChart.class)
				.eq("projectName", projectName).list();
	}

	/**
	 * 查找某个项目下对应名称的领域模型图
	 * @param projectName
	 * @param name
	 * @return
	 */
	public static DomainsChart getByProjectNameAndName(String projectName, String name) {
		return getRepository().createCriteriaQuery(DomainsChart.class)
				.eq("projectName", projectName)
				.eq("name", name).singleResult();
	}
	
	@Override
	public boolean equals(final Object other) {
		if (this == other)
			return true;
		if (!(other instanceof DomainsChart))
			return false;
		DomainsChart castOther = (DomainsChart) other;
		return new EqualsBuilder().append(projectName, castOther.projectName).append(name, castOther.name).isEquals();
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder(17, 37).append(name).append(projectName).toHashCode();
	}

	@Override
	public String toString() {
		return name;
	}
	
}
