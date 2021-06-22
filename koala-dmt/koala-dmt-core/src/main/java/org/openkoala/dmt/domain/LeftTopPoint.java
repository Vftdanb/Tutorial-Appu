package org.openkoala.dmt.domain;

import javax.persistence.Embeddable;

import org.dayatang.domain.ValueObject;

@Embeddable
public class LeftTopPoint implements ValueObject {

	private static final long serialVersionUID = 125685375013186476L;

	private Integer x;
	
	private Integer y;

	public Integer getX() {
		return x;
	}

	public void setX(Integer x) {
		this.x = x;
	}

	public Integer getY() {
		return y;
	}

	public void setY(Integer y) {
		this.y = y;
	}
	
}
