package org.openkoala.dmt.application.impl;

import java.util.List;

import javax.inject.Named;

import org.openkoala.dmt.application.ProjectApplication;
import org.openkoala.dmt.domain.Project;
import org.springframework.transaction.annotation.Transactional;

@Named
@Transactional(value = "transactionManager_dmt")
public class ProjectApplicationImpl implements ProjectApplication {

	@Override
	public List<Project> findAllProjects() {
		return Project.findAll(Project.class);
	}

}
