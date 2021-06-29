package org.openkoala.dmt.application.impl;

import javax.inject.Named;

import org.openkoala.dmt.application.DomainsChartApplication;
import org.openkoala.dmt.domain.DomainsChart;
import org.springframework.transaction.annotation.Transactional;

@Named
@Transactional(value = "transactionManager_dmt")
public class DomainsChartApplicationImpl implements DomainsChartApplication {

	@Override
	public void saveDomainsChart(DomainsChart domainsChart) {
		domainsChart.save();
	}

}
