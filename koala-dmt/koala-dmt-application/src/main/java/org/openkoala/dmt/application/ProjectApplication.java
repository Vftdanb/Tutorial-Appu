package org.openkoala.dmt.application;

import java.util.List;

import org.openkoala.dmt.domain.Project;

public interface ProjectApplication {

	/**
	 * 查找所有项目
	 * @return
	 */
	List<Project> findAllProjects();
	
	/**
	 * 创建一个项目
	 */
	void createProject(Project project);
	
}
