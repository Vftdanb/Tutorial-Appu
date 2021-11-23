package org.openkoala.dmt.domain;

/**
 * 领域与属性之间的关联关系
 * @author xmfang
 *
 */
public enum DomainPropertyRelation {

	ManyToOne,
	ManyToMany,
	OneToOne,
	OneToMany,
	ElementCollection,
	Enumerated,
	Embedded
	
}
