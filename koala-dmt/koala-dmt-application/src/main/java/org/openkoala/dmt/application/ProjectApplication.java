package org.openkoala.dmt.application;

import java.util.List;

import org.openkoala.dmt.domain.Project;

public interface ProjectApplication {

	List<Project> findAllProjects();
	
}
