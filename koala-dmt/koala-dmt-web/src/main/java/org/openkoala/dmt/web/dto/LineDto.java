package org.openkoala.dmt.web.dto;

import org.openkoala.dmt.domain.Line;
import org.openkoala.dmt.domain.LineType;

public class LineDto {
	
	private Long id;
	
	private int version;
	
	private LineType lineType;
	
	private String fromShapeId;
	
	private String toShapeId;

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
	
	public Line generateLine(DomainsChartDto domainsChartDto) {
		Line result = new Line();
		result.setLineType(lineType);
		result.setFromShape(domainsChartDto.getDomainShapeByShapeId(fromShapeId));
		result.setToShape(domainsChartDto.getDomainShapeByShapeId(toShapeId));
		
		return result;
	}

	public static LineDto generateDtoBy(Line line) {
		LineDto result = new LineDto();
		result.setId(line.getId());
		result.setVersion(line.getVersion());
		result.setLineType(line.getLineType());
		result.setFromShapeId(line.getFromShape().getShapeId());
		result.setToShapeId(line.getToShape().getShapeId());
		
		return result;
	}
	
}
