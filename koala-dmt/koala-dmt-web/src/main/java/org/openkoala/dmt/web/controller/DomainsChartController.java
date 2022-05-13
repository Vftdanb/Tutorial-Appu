package org.openkoala.dmt.web.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.openkoala.dmt.application.DomainsChartApplication;
import org.openkoala.dmt.application.GenerateCodeApplication;
import org.openkoala.dmt.application.ProjectApplication;
import org.openkoala.dmt.codegen.tools.FileCompressor;
import org.openkoala.dmt.domain.DomainsChart;
import org.openkoala.dmt.domain.Project;
import org.openkoala.dmt.domain.gencode.DefaultRelationSetter;
import org.openkoala.dmt.web.dto.DomainsChartDto;
import org.openkoala.dmt.web.dto.ProjectDomainsChartDto;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/domains-chart")
public class DomainsChartController extends BaseController {

	@Inject
	private DomainsChartApplication domainsChartApplication;

	@Inject
	private ProjectApplication projectApplication;

	@Inject
	private GenerateCodeApplication generateCodeApplication;
	
	private static final String GENERATE_CODE_DIR = "codefiles";
	
	private static final String COMPRESSED_FILE_SUFFIX = ".zip";
	
	@ResponseBody
	@RequestMapping("/get")
	public DomainsChartDto getDomainsChart(Long projectId, Long domainChartId) {
		Project project = new Project();
		project.setId(projectId);
		DomainsChart domainsChart = domainsChartApplication.getDomainsChart(project, domainChartId);
		return DomainsChartDto.getInstance(domainsChart);
	}
	
	@ResponseBody
	@RequestMapping("/find-by-project")
	public List<DomainsChartDto> getDomainsChart(Long projectId) {
		Project project = new Project();
		project.setId(projectId);
		
		List<DomainsChartDto> results = new ArrayList<DomainsChartDto>();
		for (DomainsChart domainsChart : domainsChartApplication.findDomainsChartByProject(project)) {
			results.add(DomainsChartDto.getInstance(domainsChart));
		}
		return results;
	}
	
	@ResponseBody
	@RequestMapping("/create")
	public String createDomainsChart(String name, Long projectId) {
		DomainsChart domainsChart = new DomainsChart();
		domainsChart.setName(name);
		
		Project project = new Project();
		project.setId(projectId);
		domainsChart.setProject(project);
		domainsChartApplication.saveDomainsChart(domainsChart);
		return String.valueOf(domainsChart.getId());
	}
	
	@ResponseBody
	@RequestMapping(value = "/save", method = RequestMethod.POST, consumes = "application/json")
	public void saveDomainsChart(@RequestBody DomainsChartDto domainsChartDTO) {
		DomainsChart domainsChart = domainsChartDTO.transformToDomainsChart();
		DefaultRelationSetter defaultRelationSetter = new DefaultRelationSetter(domainsChart);
		defaultRelationSetter.setRelationForProperties();
		domainsChartApplication.saveDomainsChart(domainsChart);
	}
	
	/**
	 * 获得所有信息 //TODO 此方法一次性获得所有信息，后期应考虑修改这种交互方式。
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/find-all")
	public List<ProjectDomainsChartDto> findAllInfo() {
		List<ProjectDomainsChartDto> results = new ArrayList<ProjectDomainsChartDto>();
		for (Project project : projectApplication.findAllProjects()) {
			results.add(ProjectDomainsChartDto.getInstance(project, domainsChartApplication.findDomainsChartByProject(project)));
		}
		return results;
	}
	
	@ResponseBody
	@RequestMapping(value = "/gencode", method = RequestMethod.POST, consumes = "application/json")
	public String gencode(@RequestBody DomainsChartDto domainsChartDTO, String packageName, HttpServletRequest request) {
		String destinationPath = GENERATE_CODE_DIR + "/"
				+ generateDirName(domainsChartDTO.getProject().getName());
		String destinationRealPath = request.getSession().getServletContext().getRealPath("/") + "/"
				+ destinationPath;
		
		DomainsChart domainsChart = domainsChartDTO.transformToDomainsChart();
		DefaultRelationSetter defaultRelationSetter = new DefaultRelationSetter(domainsChart);
		defaultRelationSetter.setRelationForProperties();
		generateCodeApplication.generateCodeFromDomainChart(domainsChart, packageName, destinationRealPath);
		
		String zipFileName = destinationRealPath + "/"
				+ domainsChartDTO.getName() + COMPRESSED_FILE_SUFFIX;
		try {
			FileCompressor.zipFile(destinationRealPath, zipFileName);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return destinationPath;
	}
	
	private String generateDirName(String projectName) {
		Random random = new Random();
		return projectName + new Date().getTime() + random.nextInt(10000);
	}
}
