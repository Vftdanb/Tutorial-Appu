package org.openkoala.dmt.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.dayatang.domain.ValueObject;

/**
 * 属性
 * @author xmfang
 *
 */
@Embeddable
public class Property implements ValueObject {

	private static final long serialVersionUID = 641431639974605747L;

	/**
	 * 属性名称
	 */
	private String name;
	
	/**
	 * 属性类型
	 */
	private String type;
	
	/**
	 * 属性引用泛型
	 */
	private String genericity;

	/**
	 * 是否业务主键
	 */
	private Boolean businessPK = false;
	
	/**
	 * 是否可以为空
	 */
	private Boolean nullable = true;
	
	/**
	 * 是否有唯一约束
	 */
	private Boolean isUnique = false;
	
	/**
	 * 是否瞬态的属性，即不进行持久化的属性
	 */
	private Boolean transientPro = false;
	
	/**
	 * 关联关系
	 */
	private DomainPropertyRelation relation;

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

	public String getGenericity() {
		return genericity;
	}

	public void setGenericity(String genericity) {
		this.genericity = genericity;
	}

	public Boolean getBusinessPK() {
		return businessPK;
	}

	public void setBusinessPK(Boolean businessPK) {
		this.businessPK = businessPK;
	}

	public Boolean getNullable() {
		return nullable;
	}

	public void setNullable(Boolean nullable) {
		this.nullable = nullable;
	}

	@Column(name = "IS_UNIQUE")
	public Boolean getIsUnique() {
		return isUnique;
	}

	public void setIsUnique(Boolean isUnique) {
		this.isUnique = isUnique;
	}

	@Column(name = "TRANSIENT_PRO")
	public Boolean getTransientPro() {
		return transientPro;
	}

	public void setTransientPro(Boolean transientPro) {
		this.transientPro = transientPro;
	}

	@Enumerated(EnumType.STRING)
	public DomainPropertyRelation getRelation() {
		return relation;
	}

	public void setRelation(DomainPropertyRelation relation) {
		this.relation = relation;
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
		if (!(other instanceof Property))
			return false;
		Property castOther = (Property) other;
		return new EqualsBuilder().append(name, castOther.name).isEquals();
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder(17, 37).append(name).toHashCode();
	}

	@Override
	public String toString() {
		return name;
	}

}
