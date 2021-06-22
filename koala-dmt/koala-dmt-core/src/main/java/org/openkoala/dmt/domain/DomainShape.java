package org.openkoala.dmt.domain;

import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

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

	private LeftTopPoint leftTopPoint;
	
	private Integer width;
	
	private Integer height;
	
	private String name;

	private DomainsChart domainsChart;
	
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
		// TODO Auto-generated method stub
		return null;
	}
	
}
