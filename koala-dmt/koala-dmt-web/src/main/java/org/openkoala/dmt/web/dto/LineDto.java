package org.openkoala.dmt.web.dto;

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
	
}
