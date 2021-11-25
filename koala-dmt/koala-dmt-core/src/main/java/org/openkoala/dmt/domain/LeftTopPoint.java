package org.openkoala.dmt.domain;

import javax.persistence.Embeddable;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.dayatang.domain.ValueObject;

/**
 * 图形左上角的点
 * @author xmfang
 *
 */
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
	
	public LeftTopPoint() {
	}

	public LeftTopPoint(Integer x, Integer y) {
		this.x = x;
		this.y = y;
	}
	
	@Override
	public boolean equals(final Object other) {
		if (this == other)
			return true;
		if (!(other instanceof LeftTopPoint))
			return false;
		LeftTopPoint castOther = (LeftTopPoint) other;
		return new EqualsBuilder().append(x, castOther.x).append(y, castOther.y).isEquals();
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder(17, 37).append(x).append(y).toHashCode();
	}

	@Override
	public String toString() {
		return "(" + x + "," + y + ")";
	}
	
}
