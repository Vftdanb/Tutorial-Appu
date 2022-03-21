package org.openkoala.dmt.codegen.tools;

import japa.parser.ASTHelper;
import japa.parser.ast.body.ClassOrInterfaceDeclaration;
import japa.parser.ast.body.JavadocComment;
import japa.parser.ast.body.MethodDeclaration;
import japa.parser.ast.body.ModifierSet;
import japa.parser.ast.body.Parameter;
import japa.parser.ast.type.ClassOrInterfaceType;

import java.util.ArrayList;
import java.util.List;

import org.openkoala.dmt.codegen.metadata.ActionInfo;
import org.openkoala.dmt.codegen.metadata.PropertyInfo;

public class MethodGenerator {

	private List<ActionInfo> actionInfos = new ArrayList<ActionInfo>();
	
	public MethodGenerator(List<ActionInfo> actionInfos) {
		this.actionInfos = actionInfos;
	}
	
	public void generateMethods(ClassOrInterfaceDeclaration classOrInterfaceDeclaration) {
		for (ActionInfo actionInfo : actionInfos) {
			generateMethod(actionInfo, classOrInterfaceDeclaration);
		}
	}
	
	private void generateMethod(ActionInfo actionInfo, ClassOrInterfaceDeclaration classOrInterfaceDeclaration) {
		MethodDeclaration methodDeclaration = new MethodDeclaration();
		methodDeclaration.setModifiers(ModifierSet.PUBLIC);
		methodDeclaration.setName(actionInfo.getName());
		methodDeclaration.setType(new ClassOrInterfaceType(actionInfo.getReturnValue().getType().getDeclareType()));
		
		String parameterComments = "";
		for (PropertyInfo parameter : actionInfo.getParameters()) {
			parameterComments += "\r\n     * @param " + parameter.getName();
		}
		String comments = "\r\n     * " + actionInfo.getDescription() + parameterComments
				+ "\r\n     * @return " + actionInfo.getReturnValue().getType().getDeclareType()
				+ "\r\n     ";
		methodDeclaration.setJavaDoc(new JavadocComment(comments));
		
		List<Parameter> parameters = new ArrayList<Parameter>();
		for(PropertyInfo propertyInfo : actionInfo.getParameters()) {
			parameters.add(ASTHelper.createParameter(new ClassOrInterfaceType(propertyInfo.getType().getDeclareType()), propertyInfo.getName()));
		}
		methodDeclaration.setParameters(parameters);
		ASTHelper.addMember(classOrInterfaceDeclaration, methodDeclaration);
	}

	
	
}
