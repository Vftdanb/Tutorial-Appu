package org.openkoala.dmt.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

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
	 * 是否可以为空
	 */
	private Boolean nullable = true;
	
	/**
	 * 是否有唯一约束
	 */
	private Boolean unique = false;
	
	/**
	 * 是否瞬态的属性，即不进行持久化的属性
	 */
	private Boolean transientPro = false;
	
	/**
	 * 关联关系
	 */
	private DomainPropertyRelation relation;

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

	public Boolean getNullable() {
		return nullable;
	}

	public void setNullable(Boolean nullable) {
		this.nullable = nullable;
	}

	public Boolean getUnique() {
		return unique;
	}

	public void setUnique(Boolean unique) {
		this.unique = unique;
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

}
