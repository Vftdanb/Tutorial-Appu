package org.openkoala.dmt.application.impl;

import java.util.List;

import javax.inject.Named;

import org.openkoala.dmt.application.DomainsChartApplication;
import org.openkoala.dmt.domain.DomainsChart;
import org.openkoala.dmt.domain.Project;
import org.springframework.transaction.annotation.Transactional;

@Named
@Transactional(value = "transactionManager_dmt")
public class DomainsChartApplicationImpl implements DomainsChartApplication {

	@Override
	public void saveDomainsChart(DomainsChart domainsChart) {
		domainsChart.save();
	}

	@Override
	public DomainsChart getDomainsChart(Project project, String name) {
		return DomainsChart.getByProjectAndName(project, name);
	}

    @Override
    public DomainsChart getDomainsChart(Project project, Long id) {
        return DomainsChart.getByProjectAndId(project, id);
    }

	@Override
	public List<DomainsChart> findDomainsChartByProject(Project project) {
		return DomainsChart.findByProject(project);
	}

}
