package org.openkoala.dmt.web.controller;

import javax.inject.Inject;

import org.openkoala.dmt.application.DomainsChartApplication;
import org.openkoala.dmt.domain.DomainsChart;
import org.openkoala.dmt.web.dto.DomainsChartDto;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/domains-chart")
public class DomainsChartController {

	@Inject
	private DomainsChartApplication domainsChartApplication;

	@ResponseBody
	@RequestMapping("/create")
	public DomainsChartDto getDomainsChart(String projectName, String name) {
		DomainsChart domainsChart = domainsChartApplication.getDomainsChart(projectName, name);
		return DomainsChartDto.generateDtoBy(domainsChart);
	}
	
	@ResponseBody
	@RequestMapping("/create")
	public void createDomainsChart(DomainsChartDto domainsChartDTO) {
		domainsChartApplication.saveDomainsChart(domainsChartDTO.transformToDomainsChart());
	}
	
}
