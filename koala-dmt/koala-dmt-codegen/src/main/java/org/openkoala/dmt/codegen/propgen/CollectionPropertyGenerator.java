package org.openkoala.dmt.codegen.propgen;

import japa.parser.ASTHelper;
import japa.parser.ast.body.FieldDeclaration;
import japa.parser.ast.body.JavadocComment;
import japa.parser.ast.body.MethodDeclaration;
import japa.parser.ast.body.ModifierSet;
import japa.parser.ast.body.Parameter;
import japa.parser.ast.body.VariableDeclarator;
import japa.parser.ast.body.VariableDeclaratorId;
import japa.parser.ast.expr.AssignExpr;
import japa.parser.ast.expr.AssignExpr.Operator;
import japa.parser.ast.expr.Expression;
import japa.parser.ast.expr.FieldAccessExpr;
import japa.parser.ast.expr.MethodCallExpr;
import japa.parser.ast.expr.NameExpr;
import japa.parser.ast.expr.ObjectCreationExpr;
import japa.parser.ast.expr.ThisExpr;
import japa.parser.ast.stmt.BlockStmt;
import japa.parser.ast.stmt.ExpressionStmt;
import japa.parser.ast.stmt.ReturnStmt;
import japa.parser.ast.stmt.Statement;
import japa.parser.ast.type.ClassOrInterfaceType;
import japa.parser.ast.type.VoidType;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.openkoala.dmt.codegen.metadata.CodeGenUtils;
import org.openkoala.dmt.codegen.metadata.PropertyInfo;
import org.openkoala.dmt.codegen.metadata.proptype.AbstractCollectionPropertyType;
import org.openkoala.dmt.codegen.tools.Inflector;

public class CollectionPropertyGenerator extends AbstractPropertyGenerator {
	
	public CollectionPropertyGenerator(PropertyInfo propertyInfo) {
		super(propertyInfo);
	}

	public CollectionPropertyGenerator(PropertyInfo propertyInfo, FieldAnnotationGenerator annotationGenerator) {
		super(propertyInfo, annotationGenerator);
	}
	
	private AbstractCollectionPropertyType getPropertyType() {
		return (AbstractCollectionPropertyType) propertyInfo.getType();
	}

	
	@Override
	public FieldDeclaration createFieldDeclaration() {
		FieldDeclaration result = super.createFieldDeclaration();
		VariableDeclarator variableDeclarator = new VariableDeclarator(
				new VariableDeclaratorId(propertyInfo.getName()), 
				new ObjectCreationExpr(null, new ClassOrInterfaceType(getPropertyType().getImplementType()), null));
		result.setVariables(Arrays.asList(variableDeclarator));
		return result;
	}

	@Override
	public List<MethodDeclaration> createAccessorDeclarations() {
		List<MethodDeclaration> results = new ArrayList<MethodDeclaration>();
		results.add(createGetterMethodDeclaration());
		results.add(createSetterMethodDeclaration());
		results.add(createCollectionAddMethodDeclaration());
		results.add(createCollectionRemoveMethodDeclaration());
		return results;
	}

	private MethodDeclaration createGetterMethodDeclaration() {
		MethodDeclaration result = new MethodDeclaration();
		String comments = "\r\n     * 取得" + propertyInfo.getComment() + "\r\n     * @return " + propertyInfo.getName() + " " + propertyInfo.getComment()
				+ "\r\n     ";
		result.setJavaDoc(new JavadocComment(comments));
		result.setModifiers(ModifierSet.PUBLIC);
		result.setType(new ClassOrInterfaceType(propertyInfo.getType().getDeclareType()));
		result.setName(CodeGenUtils.getGetterMethodName(propertyInfo));
		MethodCallExpr callExpr = new MethodCallExpr(new NameExpr("Collections"), getPropertyType().getUnmodifiableCloneMethodName(), createFieldArgs(propertyInfo.getName()));
		Statement returnStmt = new ReturnStmt(callExpr);
		BlockStmt blockStmt = new BlockStmt(Arrays.asList(returnStmt));
		result.setBody(blockStmt);
		return result;
	}

	private MethodDeclaration createSetterMethodDeclaration() {
		MethodDeclaration result = new MethodDeclaration();
		String setComments = "\r\n     * 设置" + propertyInfo.getComment() + "\r\n     * @param " + propertyInfo.getName() + " " + propertyInfo.getComment()
				+ "\r\n     ";
		result.setJavaDoc(new JavadocComment(setComments));
		result.setModifiers(ModifierSet.PUBLIC);
		result.setType(new VoidType());
		result.setName(CodeGenUtils.getSetterMethodName(propertyInfo));
		Parameter parameter = ASTHelper.createParameter(new ClassOrInterfaceType(propertyInfo.getType().getDeclareType()), propertyInfo.getName());
		result.setParameters(Arrays.asList(parameter));

		Expression args = new NameExpr(propertyInfo.getName());
		Expression valueExpr = new ObjectCreationExpr(null, new ClassOrInterfaceType(getPropertyType().getImplementType()), Arrays.asList(args));
	
		AssignExpr assignExpr = new AssignExpr(
				new FieldAccessExpr(new NameExpr("this"), propertyInfo.getName()),
				valueExpr,
				Operator.assign);
		Statement es = new ExpressionStmt(assignExpr);
		BlockStmt setterBlockStmt = new BlockStmt(Arrays.asList(es));
		result.setBody(setterBlockStmt);
		return result;
	}
	
	private MethodDeclaration createCollectionAddMethodDeclaration() {
		MethodDeclaration result = new MethodDeclaration();
		String argName = Inflector.getInstance().singularize(propertyInfo.getName());
		String comments = "\r\n     * 添加" + propertyInfo.getComment() + "\r\n     * @param " + argName + " 要添加的" + propertyInfo.getComment()
				+ "\r\n     ";
		result.setJavaDoc(new JavadocComment(comments));
		result.setModifiers(ModifierSet.PUBLIC);
		result.setType(new VoidType());
		result.setName("add" + CodeGenUtils.upperFirstLetter(argName));
		Parameter parameter = ASTHelper.createParameter(new ClassOrInterfaceType(getPropertyType().getElementType()), argName);
		result.setParameters(Arrays.asList(parameter));

		FieldAccessExpr fieldAccessExpr = new FieldAccessExpr(new ThisExpr(), propertyInfo.getName());
		Expression args = new NameExpr(argName);
		MethodCallExpr callExpr = new MethodCallExpr(fieldAccessExpr, "add", Arrays.asList(args));
		Statement es = new ExpressionStmt(callExpr);
		BlockStmt setterBlockStmt = new BlockStmt(Arrays.asList(es));
		result.setBody(setterBlockStmt);
		return result;
	}

	private MethodDeclaration createCollectionRemoveMethodDeclaration() {
		MethodDeclaration result = new MethodDeclaration();
		String argName = Inflector.getInstance().singularize(propertyInfo.getName());
		String comments = "\r\n     * 删除" + propertyInfo.getComment() + "\r\n     * @param " + argName + " 要删除的" + propertyInfo.getComment()
				+ "\r\n     ";
		result.setJavaDoc(new JavadocComment(comments));
		result.setModifiers(ModifierSet.PUBLIC);
		result.setType(new VoidType());
		result.setName("remove" + CodeGenUtils.upperFirstLetter(argName));
		Parameter parameter = ASTHelper.createParameter(new ClassOrInterfaceType(getPropertyType().getElementType()), argName);
		result.setParameters(Arrays.asList(parameter));

		FieldAccessExpr fieldAccessExpr = new FieldAccessExpr(new ThisExpr(), propertyInfo.getName());
		Expression args = new NameExpr(argName);
		MethodCallExpr callExpr = new MethodCallExpr(fieldAccessExpr, "remove", Arrays.asList(args));
		Statement es = new ExpressionStmt(callExpr);
		BlockStmt setterBlockStmt = new BlockStmt(Arrays.asList(es));
		result.setBody(setterBlockStmt);
		return result;
	}

	private List<Expression> createFieldArgs(String prop) {
		List<Expression> result = new ArrayList<Expression>();
		result.add(new FieldAccessExpr(new ThisExpr(), prop));
		return result;
	}
}
