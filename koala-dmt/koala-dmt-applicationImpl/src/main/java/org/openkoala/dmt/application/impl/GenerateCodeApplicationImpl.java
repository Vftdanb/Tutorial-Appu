package org.openkoala.dmt.application.impl;

import javax.inject.Named;

import org.openkoala.dmt.application.GenerateCodeApplication;
import org.openkoala.dmt.domain.DomainsChart;
import org.openkoala.dmt.domain.gencode.CodeGenerator;

@Named
public class GenerateCodeApplicationImpl implements GenerateCodeApplication {

	@Override
	public void generateCodeFromDomainChart(DomainsChart domainsChart, String packageName, String destinationPath) {
		CodeGenerator codeGenerator = new CodeGenerator(domainsChart);
		codeGenerator.generateCode(packageName, destinationPath);
	}

}
