package org.openkoala.dmt.application;

import java.util.List;

import org.openkoala.dmt.domain.DomainsChart;
import org.openkoala.dmt.domain.Project;

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
	DomainsChart getDomainsChart(Project project, String name);

	/**
	 * 获取某个项目下的所有领域图形
	 * @param domainsChart
	 */
	List<DomainsChart> findDomainsChartByProject(Project project);
	
}
