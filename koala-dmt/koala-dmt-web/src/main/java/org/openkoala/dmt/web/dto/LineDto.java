package org.openkoala.dmt.web.dto;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.openkoala.dmt.domain.DomainsChart;
import org.openkoala.dmt.domain.Line;
import org.openkoala.dmt.domain.LineType;

public class LineDto implements Dto {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -4497942170058061831L;

	private Long id;
	
	private int version;
	
	private LineType lineType;
	
	private String fromShapeId;
	
	private String toShapeId;
	
	private String description;
	
	private Long domainsChartId;

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

	public LineType getLineType() {
		return lineType;
	}

	public void setLineType(LineType lineType) {
		this.lineType = lineType;
	}

	public String getFromShapeId() {
		return fromShapeId;
	}

	public void setFromShapeId(String fromShapeId) {
		this.fromShapeId = fromShapeId;
	}

	public String getToShapeId() {
		return toShapeId;
	}

	public void setToShapeId(String toShapeId) {
		this.toShapeId = toShapeId;
	}
	
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Long getDomainsChartId() {
		return domainsChartId;
	}

	public void setDomainsChartId(Long domainsChartId) {
		this.domainsChartId = domainsChartId;
	}

	public Line generateLine(DomainsChartDto domainsChartDto) {
		Line result = new Line();
		result.setLineType(lineType);
		result.setFromShape(domainsChartDto.getDomainShapeByShapeId(fromShapeId));
		result.setToShape(domainsChartDto.getDomainShapeByShapeId(toShapeId));
		result.setDescription(description);
		
		DomainsChart domainsChart = new DomainsChart();
		domainsChart.setId(domainsChartId);
		result.setDomainsChart(domainsChart);
		
		return result;
	}

	public static LineDto generateDtoBy(Line line) {
		LineDto result = new LineDto();
		result.setId(line.getId());
		result.setVersion(line.getVersion());
		result.setLineType(line.getLineType());
		result.setFromShapeId(line.getFromShape().getShapeId());
		result.setToShapeId(line.getToShape().getShapeId());
		result.setDescription(line.getDescription());
		result.setDomainsChartId(line.getDomainsChart().getId());
		
		return result;
	}

	@Override
	public boolean equals(final Object other) {
		if (this == other)
			return true;
		if (!(other instanceof LineDto))
			return false;
		LineDto castOther = (LineDto) other;
		return new EqualsBuilder().append(domainsChartId, castOther.domainsChartId)
				.append(fromShapeId, castOther.fromShapeId)
				.append(toShapeId, castOther.toShapeId)
				.append(lineType, castOther.lineType).isEquals();
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder(17, 37).append(domainsChartId).append(fromShapeId).append(toShapeId).append(lineType).toHashCode();
	}
	
}
