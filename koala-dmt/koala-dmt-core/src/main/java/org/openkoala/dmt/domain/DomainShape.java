package org.openkoala.dmt.domain;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.ElementCollection;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.dayatang.domain.AbstractEntity;

/**
 * 领域图形
 * @author xmfang
 *
 */
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Table(name="DOMAIN_SHAPE")
@DiscriminatorColumn(name = "CATEGORY", discriminatorType = DiscriminatorType.STRING)
public abstract class DomainShape extends AbstractEntity {

	private static final long serialVersionUID = 5786291695802079586L;

	private String shapeId;
	
	private LeftTopPoint leftTopPoint;
	
	private Integer width;
	
	private Integer height;
	
	private String name;

	private Set<Constant> constants = new HashSet<Constant>();
	
	private String description;
	
	private DomainShape parent;
	
	private DomainsChart domainsChart;
	
	@Column(name = "SHAPE_ID", nullable = false)
	public String getShapeId() {
		return shapeId;
	}

	public void setShapeId(String shapeId) {
		this.shapeId = shapeId;
	}

	@Embedded
	public LeftTopPoint getLeftTopPoint() {
		return leftTopPoint;
	}

	public void setLeftTopPoint(LeftTopPoint leftTopPoint) {
		this.leftTopPoint = leftTopPoint;
	}

	public Integer getWidth() {
		return width;
	}

	public void setWidth(Integer width) {
		this.width = width;
	}

	public Integer getHeight() {
		return height;
	}

	public void setHeight(Integer height) {
		this.height = height;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "CONSTANTS", joinColumns = @JoinColumn(name = "DOMAIN_ID"))
	public Set<Constant> getConstants() {
		return constants;
	}

	public void setConstants(Set<Constant> constants) {
		this.constants = constants;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@ManyToOne
	@JoinColumn(name = "PARENT_ID")
	public DomainShape getParent() {
		return parent;
	}

	public void setParent(DomainShape parent) {
		this.parent = parent;
	}

	@ManyToOne
	@JoinColumn(name = "DC_ID")
	public DomainsChart getDomainsChart() {
		return domainsChart;
	}

	public void setDomainsChart(DomainsChart domainsChart) {
		this.domainsChart = domainsChart;
	}

	@Override
	public String[] businessKeys() {
		return new String[]{shapeId};
	}

	@Override
	public boolean equals(final Object other) {
		if (this == other)
			return true;
		if (!(other instanceof DomainShape))
			return false;
		DomainShape castOther = (DomainShape) other;
		return new EqualsBuilder()
				.append(shapeId, castOther.shapeId)
				.append(name, castOther.name)
				.append(domainsChart, castOther.domainsChart).isEquals();
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder(17, 37).append(shapeId).append(name).append(domainsChart).toHashCode();
	}

	@Override
	public String toString() {
		return domainsChart.getName() + ":" + name;
	}
	
}
