package org.openkoala.dmt.codegen.tools;

import japa.parser.ASTHelper;
import japa.parser.ast.body.ClassOrInterfaceDeclaration;
import japa.parser.ast.body.JavadocComment;
import japa.parser.ast.body.MethodDeclaration;
import japa.parser.ast.body.ModifierSet;
import japa.parser.ast.body.Parameter;
import japa.parser.ast.stmt.BlockStmt;
import japa.parser.ast.type.ClassOrInterfaceType;

import java.util.ArrayList;
import java.util.List;

import org.openkoala.dmt.codegen.metadata.ActionInfo;
import org.openkoala.dmt.codegen.metadata.Modifier;
import org.openkoala.dmt.codegen.metadata.PropertyInfo;

public class MethodGenerator {

	private List<ActionInfo> actionInfos = new ArrayList<ActionInfo>();

    private boolean needEmptyMethodBody;

	public MethodGenerator(List<ActionInfo> actionInfos, boolean needEmptyMethodBody) {
		this.actionInfos = actionInfos;
        this.needEmptyMethodBody = needEmptyMethodBody;
	}
	
	public void generateMethods(ClassOrInterfaceDeclaration classOrInterfaceDeclaration) {
		for (ActionInfo actionInfo : actionInfos) {
			generateMethod(actionInfo, classOrInterfaceDeclaration);
		}
	}
	
	private void generateMethod(ActionInfo actionInfo, ClassOrInterfaceDeclaration classOrInterfaceDeclaration) {
		MethodDeclaration methodDeclaration = new MethodDeclaration();
		methodDeclaration.setModifiers(assemModifier(actionInfo));
		methodDeclaration.setName(actionInfo.getName());
		methodDeclaration.setType(new ClassOrInterfaceType(actionInfo.getReturnType()));
		
		String parameterComments = "";
		for (PropertyInfo parameter : actionInfo.getParameters()) {
			parameterComments += "\r\n     * @param " + parameter.getName();
		}
		String comments = "\r\n     * " + actionInfo.getDescription() + parameterComments
				+ "\r\n     * @return " + actionInfo.getReturnType()
				+ "\r\n     ";
		methodDeclaration.setJavaDoc(new JavadocComment(comments));
		
		List<Parameter> parameters = new ArrayList<Parameter>();
		for(PropertyInfo propertyInfo : actionInfo.getParameters()) {
			parameters.add(ASTHelper.createParameter(new ClassOrInterfaceType(propertyInfo.getType().getDeclareType()), propertyInfo.getName()));
		}

        if (needEmptyMethodBody) {
            methodDeclaration.setParameters(parameters);
            methodDeclaration.setBody(new BlockStmt());
        }
		ASTHelper.addMember(classOrInterfaceDeclaration, methodDeclaration);
	}

    private int assemModifier(ActionInfo actionInfo) {
        int result = ModifierSet.PUBLIC;
        if (actionInfo.getModifier() == Modifier.PRIVATE) {
            result = ModifierSet.PRIVATE;
        } else if (actionInfo.getModifier() == Modifier.PROTECTED) {
            result = ModifierSet.PROTECTED;
        }

        if (actionInfo.isFinal()) {
            result += ModifierSet.FINAL;
        }
        if (actionInfo.isAbstract()) {
            result += ModifierSet.ABSTRACT;
        }
        if (actionInfo.isStatic()) {
            result += ModifierSet.STATIC;
        }
        return result;
    }

}
