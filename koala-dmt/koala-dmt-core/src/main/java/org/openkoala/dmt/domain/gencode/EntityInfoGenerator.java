package org.openkoala.dmt.domain.gencode;

import java.util.HashSet;
import java.util.Set;

import org.openkoala.dmt.codegen.metadata.DomainClassInfo;
import org.openkoala.dmt.domain.DomainsChart;

public class EntityInfoGenerator {

	DomainsChart domainsChart;
	
	public EntityInfoGenerator(DomainsChart domainsChart) {
		this.domainsChart = domainsChart;
	}
	
	public Set<DomainClassInfo> generateEntityInfo() {
		Set<DomainClassInfo> result = new HashSet<DomainClassInfo>();
		return result;
	}
	
}
