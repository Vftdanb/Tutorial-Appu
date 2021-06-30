package org.openkoala.dmt.domain;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.dayatang.domain.AbstractEntity;

@Entity
@Table(name = "LINE")
public class Line extends AbstractEntity {

	private static final long serialVersionUID = -5333830727544685257L;

	private DomainShape fromShape;
	
	private DomainShape toShape;
	
	private LineType lineType;
	
	private DomainsChart domainsChart;
	
	@ManyToOne
	@JoinColumn(name = "FROM_DS_ID")
	public DomainShape getFromShape() {
		return fromShape;
	}

	public void setFromShape(DomainShape fromShape) {
		this.fromShape = fromShape;
	}

	@ManyToOne
	@JoinColumn(name = "TO_DS_ID")
	public DomainShape getToShape() {
		return toShape;
	}

	public void setToShape(DomainShape toShape) {
		this.toShape = toShape;
	}

	@Enumerated(EnumType.STRING)
	public LineType getLineType() {
		return lineType;
	}

	public void setLineType(LineType lineType) {
		this.lineType = lineType;
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
	public boolean equals(final Object other) {
		if (this == other)
			return true;
		if (!(other instanceof DomainShape))
			return false;
		Line castOther = (Line) other;
		return new EqualsBuilder().append(domainsChart, castOther.domainsChart)
				.append(fromShape, castOther.fromShape)
				.append(toShape, castOther.toShape)
				.append(lineType, castOther.lineType).isEquals();
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder(17, 37).append(domainsChart).append(fromShape).append(toShape).append(lineType).toHashCode();
	}

	@Override
	public String toString() {
		return domainsChart.getName() + " line: from " + fromShape.getName() + " to " + toShape.getName();
	}

	@Override
	public String[] businessKeys() {
		// TODO Auto-generated method stub
		return null;
	}

}
