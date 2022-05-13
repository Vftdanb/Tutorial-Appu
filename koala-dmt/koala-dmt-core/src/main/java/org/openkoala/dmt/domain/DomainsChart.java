package org.openkoala.dmt.domain;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.*;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.dayatang.domain.AbstractEntity;

@Entity
@Table(name = "KD_DOMAINS_CHARTS")
public class DomainsChart extends AbstractEntity {

	private static final long serialVersionUID = 3043999013741427550L;

    @ManyToOne
    @JoinColumn(name = "PROJECT_ID")
	private Project project;
	
	private String name;

    @Transient
	private Set<DomainShape> domainShapes = new HashSet<DomainShape>();

    @Column(name = "DOMAIN_SHAPE_INFO")
    @Lob
    private String domainShapeInfo;

    @Column(name = "LINE_INFO")
    @Lob
	private String lineInfo;
	
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

	public Set<DomainShape> getDomainShapes() {
		return domainShapes;
	}

	public void setDomainShapes(Set<DomainShape> domainShapes) {
		this.domainShapes = domainShapes;
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

	@Override
	public String[] businessKeys() {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * 查找某个项目下的所有领域模型图
	 * @param project
	 * @return
	 */
	public static List<DomainsChart> findByProject(Project project) {
		return getRepository().createCriteriaQuery(DomainsChart.class)
				.eq("project", project).list();
	}

	/**
	 * 查找某个项目下对应名称的领域模型图
	 * @param project
	 * @param name
	 * @return
	 */
	public static DomainsChart getByProjectAndName(Project project, String name) {
		return getRepository().createCriteriaQuery(DomainsChart.class)
				.eq("project", project)
				.eq("name", name).singleResult();
	}

    /**
     * 查找某个项目下对应名称的领域模型图
     * @param project
     * @param id
     * @return
     */
    public static DomainsChart getByProjectAndId(Project project, Long id) {
        return getRepository().createCriteriaQuery(DomainsChart.class)
                .eq("project", project)
                .eq("id", id).singleResult();
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
