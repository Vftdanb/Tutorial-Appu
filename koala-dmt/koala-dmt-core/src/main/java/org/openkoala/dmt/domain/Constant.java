package org.openkoala.dmt.domain;

import javax.persistence.Embeddable;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.dayatang.domain.ValueObject;

/**
 * 常量
 * @author xmfang
 *
 */
@Embeddable
public class Constant implements ValueObject {
	
	private static final long serialVersionUID = -8878431983318287057L;

	/**
	 * 常量名称
	 */
	private String name;
	
	/**
	 * 常量类型
	 */
	private String type;

	/**
	 * 常量值
	 */
	private String value;
	
	/**
	 * 描述
	 */
	private String description;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Override
	public boolean equals(final Object other) {
		if (this == other)
			return true;
		if (!(other instanceof Constant))
			return false;
		Constant castOther = (Constant) other;
		return new EqualsBuilder().append(name, castOther.name).isEquals();
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder(17, 37).append(name).toHashCode();
	}

	@Override
	public String toString() {
		return name + " = " + value;
	}

}
