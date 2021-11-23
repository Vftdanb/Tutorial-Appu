package org.openkoala.dmt.codegen.propgen;

import japa.parser.ASTHelper;
import japa.parser.ast.body.FieldDeclaration;
import japa.parser.ast.body.JavadocComment;
import japa.parser.ast.body.MethodDeclaration;
import japa.parser.ast.body.ModifierSet;
import japa.parser.ast.body.Parameter;
import japa.parser.ast.expr.AnnotationExpr;
import japa.parser.ast.expr.AssignExpr;
import japa.parser.ast.expr.AssignExpr.Operator;
import japa.parser.ast.expr.FieldAccessExpr;
import japa.parser.ast.expr.NameExpr;
import japa.parser.ast.stmt.BlockStmt;
import japa.parser.ast.stmt.ExpressionStmt;
import japa.parser.ast.stmt.ReturnStmt;
import japa.parser.ast.stmt.Statement;
import japa.parser.ast.type.ClassOrInterfaceType;
import japa.parser.ast.type.VoidType;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.openkoala.dmt.codegen.annogen.SingleValueFieldAnnotationGenerator;
import org.openkoala.dmt.codegen.metadata.CodeGenUtils;
import org.openkoala.dmt.codegen.metadata.PropertyInfo;
import org.openkoala.dmt.codegen.tools.PropertyGenerator;

/**
 * 属性信息生成器，根据属性信息生成字段声明，Annotation和访问方法
 * 
 * @author yyang
 * 
 */
public abstract class AbstractPropertyGenerator implements PropertyGenerator {

	protected PropertyInfo propertyInfo;
	protected FieldAnnotationGenerator annotationGenerator;

	public AbstractPropertyGenerator(PropertyInfo propertyInfo) {
		this.propertyInfo = propertyInfo;
		this.annotationGenerator = new SingleValueFieldAnnotationGenerator();
	}

	public AbstractPropertyGenerator(PropertyInfo propertyInfo, FieldAnnotationGenerator annotationGenerator) {
		this(propertyInfo);
		this.annotationGenerator = annotationGenerator;
	}

	/**
	 * 创建字段声明
	 * 
	 * @return
	 */
	public FieldDeclaration createFieldDeclaration() {
		FieldDeclaration result = ASTHelper.createFieldDeclaration(ModifierSet.PRIVATE, new ClassOrInterfaceType(propertyInfo.getType().getDeclareType()),
				propertyInfo.getName());
		result.setJavaDoc(new JavadocComment(propertyInfo.getComment()));
		result.setAnnotations(createFieldAnnotations());
		return result;
	}

	/**
	 * 创建字段声明
	 * 
	 * @param propertyInfo
	 * @return
	 */
	private List<AnnotationExpr> createFieldAnnotations() {
		return annotationGenerator.generateAnnotations(propertyInfo);
	}

	/**
	 * 创建访问方法
	 * 
	 * @return
	 */
	public List<MethodDeclaration> createAccessorDeclarations() {
		List<MethodDeclaration> results = new ArrayList<MethodDeclaration>();
		results.add(createGetterMethodDeclaration());
		results.add(createSetterMethodDeclaration());
		return results;
	}

	/**
	 * 创建“获取属性”方法
	 * 
	 * @return
	 */
	private MethodDeclaration createGetterMethodDeclaration() {
		MethodDeclaration result = new MethodDeclaration();
		String comments = "\r\n     * 取得" + propertyInfo.getComment() + "\r\n     * @return " + propertyInfo.getName() + " " + propertyInfo.getComment()
				+ "\r\n     ";
		result.setJavaDoc(new JavadocComment(comments));
		result.setModifiers(ModifierSet.PUBLIC);
		result.setType(new ClassOrInterfaceType(propertyInfo.getType().getDeclareType()));
		result.setName(CodeGenUtils.getGetterMethodName(propertyInfo));
		Statement returnStmt = new ReturnStmt(new NameExpr(propertyInfo.getName()));
		result.setBody(new BlockStmt(Arrays.asList(returnStmt)));
		return result;
	}

	/**
	 * 创建“设置属性”方法
	 * 
	 * @return
	 */
	private MethodDeclaration createSetterMethodDeclaration() {
		MethodDeclaration result = new MethodDeclaration();
		String comments = "\r\n     * 设置" + propertyInfo.getComment() + "\r\n     * @param " + propertyInfo.getName() + " " + propertyInfo.getComment()
				+ "\r\n     ";
		result.setJavaDoc(new JavadocComment(comments));
		result.setModifiers(ModifierSet.PUBLIC);
		result.setType(new VoidType());
		result.setName(CodeGenUtils.getSetterMethodName(propertyInfo));
		Parameter parameter = ASTHelper.createParameter(new ClassOrInterfaceType(propertyInfo.getType().getDeclareType()), propertyInfo.getName());
		result.setParameters(Arrays.asList(parameter));
		AssignExpr assignExpr = new AssignExpr(new FieldAccessExpr(new NameExpr("this"), propertyInfo.getName()), new NameExpr(propertyInfo.getName()),
				Operator.assign);
		Statement es = new ExpressionStmt(assignExpr);
		BlockStmt setterBlockStmt = new BlockStmt(Arrays.asList(es));
		result.setBody(setterBlockStmt);
		return result;
	}

}
