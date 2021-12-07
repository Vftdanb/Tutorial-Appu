package org.openkoala.dmt.domain;

import javax.persistence.Embeddable;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.dayatang.domain.ValueObject;

/**
 * 图形位置，以左上角的点确定位置
 * @author xmfang
 *
 */
@Embeddable
public class Position implements ValueObject {

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
	
	public Position() {
	}

	public Position(Integer x, Integer y) {
		this.x = x;
		this.y = y;
	}
	
	@Override
	public boolean equals(final Object other) {
		if (this == other)
			return true;
		if (!(other instanceof Position))
			return false;
		Position castOther = (Position) other;
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
