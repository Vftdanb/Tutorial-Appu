package org.openkoala.dmt.web.controller;

import java.util.List;

import javax.inject.Inject;

import org.openkoala.dmt.application.ProjectApplication;
import org.openkoala.dmt.domain.Project;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/project")
public class ProjectController extends BaseController {

	@Inject
	private ProjectApplication projectApplication;
	
	@ResponseBody
	@RequestMapping("/find-all-projects")
	public List<Project> findAllProjects() {
		return projectApplication.findAllProjects();
	}
	
	@ResponseBody
	@RequestMapping("/create")
	public String createProjects(Project project) {
		projectApplication.createProject(project);
		return String.valueOf(project.getId());
	}
}