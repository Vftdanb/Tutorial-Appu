package org.openkoala.dmt.application;

import org.openkoala.dmt.domain.DomainsChart;

/**
 * 领域图形应用接口
 * @author xmfang
 *
 */
public interface DomainsChartApplication {

	/**
	 * 保存领域图形
	 * @param domainsChart
	 */
	void saveDomainsChart(DomainsChart domainsChart);

	/**
	 * 获取领域图形
	 * @param domainsChart
	 */
	DomainsChart getDomainsChart(String projectName, String name);
	
}
