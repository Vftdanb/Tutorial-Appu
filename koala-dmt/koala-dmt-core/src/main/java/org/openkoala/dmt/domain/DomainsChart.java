package org.openkoala.dmt.domain;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.dayatang.domain.AbstractEntity;

@Entity
@Table(name = "KD_DOMAINS_CHART")
public class DomainsChart extends AbstractEntity {

	private static final long serialVersionUID = 3043999013741427550L;

	private Project project;
	
	private String name;
	
	private Set<DomainShape> domainShapes = new HashSet<DomainShape>();

	private Set<Line> lines = new HashSet<Line>();
	
	@ManyToOne
	@JoinColumn(name = "PROJECT_ID")
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

	@OneToMany(mappedBy = "domainsChart", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	public Set<DomainShape> getDomainShapes() {
		return domainShapes;
	}

	public void setDomainShapes(Set<DomainShape> domainShapes) {
		this.domainShapes = domainShapes;
	}

	@OneToMany(mappedBy = "domainsChart", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
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
	public static List<DomainsChart> findByProject(Project project) {
		return getRepository().createCriteriaQuery(DomainsChart.class)
				.eq("project", project).list();
	}

	/**
	 * 查找某个项目下对应名称的领域模型图
	 * @param projectName
	 * @param name
	 * @return
	 */
	public static DomainsChart getByProjectAndName(Project project, String name) {
		return getRepository().createCriteriaQuery(DomainsChart.class)
				.eq("project", project)
				.eq("name", name).singleResult();
	}
	
	@Override
	public boolean equals(final Object other) {
		if (this == other)
			return true;
		if (!(other instanceof DomainsChart))
			return false;
		DomainsChart castOther = (DomainsChart) other;
		return new EqualsBuilder().append(project, castOther.project).append(name, castOther.name).isEquals();
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder(17, 37).append(name).append(project).toHashCode();
	}

	@Override
	public String toString() {
		return name;
	}
	
}
