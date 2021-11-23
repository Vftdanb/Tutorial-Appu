package org.openkoala.dmt.application;

import org.openkoala.dmt.domain.DomainsChart;

public interface GenerateCodeApplication {

	/**
	 * 从领域模型图生成代码
	 * @param domainsChart
	 * @param destinationPath
	 */
	void generateCodeFromDomainChart(DomainsChart domainsChart, String packageName, String destinationPath);
	
}
