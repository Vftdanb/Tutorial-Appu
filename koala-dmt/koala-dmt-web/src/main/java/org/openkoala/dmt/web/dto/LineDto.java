package org.openkoala.dmt.web.dto;

import org.openkoala.dmt.domain.Line;
import org.openkoala.dmt.domain.LineType;

public class LineDto {
	
	private LineType lineType;
	
	private String fromShapeId;
	
	private String toShapeId;

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
	
}
