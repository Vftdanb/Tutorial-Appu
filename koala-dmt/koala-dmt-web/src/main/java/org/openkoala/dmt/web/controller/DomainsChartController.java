package org.openkoala.dmt.web.controller;

import java.lang.annotation.Documented;

import javax.inject.Inject;

import org.openkoala.dmt.application.DomainsChartApplication;
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
	public void createDomainsChart(DomainsChartDto domainsChartDTO) {
		domainsChartApplication.saveDomainsChart(domainsChartDTO.transformToDomainsChart());
	}
	
}
