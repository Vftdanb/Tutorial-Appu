package org.openkoala.dmt.codegen.classgen;

import japa.parser.ASTHelper;
import japa.parser.ast.body.BodyDeclaration;
import japa.parser.ast.body.ClassOrInterfaceDeclaration;
import japa.parser.ast.body.MethodDeclaration;
import japa.parser.ast.body.ModifierSet;
import japa.parser.ast.body.Parameter;
import japa.parser.ast.expr.AnnotationExpr;
import japa.parser.ast.expr.ClassExpr;
import japa.parser.ast.expr.Expression;
import japa.parser.ast.expr.FieldAccessExpr;
import japa.parser.ast.expr.LongLiteralExpr;
import japa.parser.ast.expr.MarkerAnnotationExpr;
import japa.parser.ast.expr.MemberValuePair;
import japa.parser.ast.expr.MethodCallExpr;
import japa.parser.ast.expr.NameExpr;
import japa.parser.ast.expr.NormalAnnotationExpr;
import japa.parser.ast.expr.SingleMemberAnnotationExpr;
import japa.parser.ast.expr.StringLiteralExpr;
import japa.parser.ast.stmt.BlockStmt;
import japa.parser.ast.stmt.ReturnStmt;
import japa.parser.ast.stmt.Statement;
import japa.parser.ast.type.ClassOrInterfaceType;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.openkoala.dmt.codegen.metadata.DomainClassInfo;
import org.openkoala.dmt.codegen.metadata.PropertyInfo;
import org.openkoala.dmt.codegen.tools.MethodGenerator;

public class EntityGenerator extends DomainClassGenerator {

	public EntityGenerator(DomainClassInfo domainClassInfo) {
		super(domainClassInfo);
	}

	@Override
	public ClassOrInterfaceDeclaration createTypeDeclare() {
		ClassOrInterfaceDeclaration result = super.createTypeDeclare();
		result.setExtends(Arrays.asList(new ClassOrInterfaceType(domainClassInfo.getBaseClass()))); // 扩展基类
		
		MethodGenerator methodGenerator = new MethodGenerator(domainClassInfo.getActionInfos());
		methodGenerator.generateMethods(result);
		ASTHelper.addMember(result, createGetMethod());
		ASTHelper.addMember(result, createGetMethod());
		ASTHelper.addMember(result, createGetByBpkMethod());
		if (!domainClassInfo.isAbstract()) {
			ASTHelper.addMember(result, createFindAllMethod());
		}
		ASTHelper.addMember(result, createHashCodeMethod());
		ASTHelper.addMember(result, createEqualsMethod());
		ASTHelper.addMember(result, createToStringMethod());
		return result;
	}
	
	
	public List<AnnotationExpr> createClassAnnotations() {
		List<AnnotationExpr> results = new ArrayList<AnnotationExpr>();
		results.add(createEntityAnnotation());
		if (domainClassInfo.getBaseClass().equals("AbstractEntity")) {
			results.add(createTableAnnotation());
		}
		if (domainClassInfo.isAbstract() && domainClassInfo.getBaseClass().equals("AbstractEntity")) {
			results.add(createDiscriminatorColumnAnnotation());
		}
		if (StringUtils.isNotBlank(domainClassInfo.getDiscriminator())) {
			results.add(new SingleMemberAnnotationExpr(new NameExpr("DiscriminatorValue"), new StringLiteralExpr(domainClassInfo.getDiscriminator())));
		}
		return results;
	}

	/**
	 * 创建@Entity注解
	 * 
	 * @return
	 */
	private AnnotationExpr createEntityAnnotation() {
		return new MarkerAnnotationExpr(new NameExpr("Entity"));
	}

	/**
	 * 创建@Table注解
	 * 
	 * @return
	 */
	private AnnotationExpr createTableAnnotation() {
		List<MemberValuePair> pairs = new ArrayList<MemberValuePair>();
		pairs.add(new MemberValuePair("name", new StringLiteralExpr(domainClassInfo.getTableName())));
		if (domainClassInfo.hasBpks()) {
			pairs.add(createUniqueConstraintMemberValuePair());
		}
		return new NormalAnnotationExpr(new NameExpr("Table"), pairs);
	}

	private MemberValuePair createUniqueConstraintMemberValuePair() {
		Expression value = new NameExpr("@UniqueConstraint(columnNames = {" + domainClassInfo.getBpkColumns() + "})");
		return new MemberValuePair("uniqueConstraints", value);
	}

	/**
	 * 创建@DiscriminatorColumn注解
	 * 
	 * @return
	 */
	private AnnotationExpr createDiscriminatorColumnAnnotation() {
		List<MemberValuePair> pairs = new ArrayList<MemberValuePair>();
		pairs.add(new MemberValuePair("name", new StringLiteralExpr("CATEGORY")));
		pairs.add(new MemberValuePair("discriminatorType", new FieldAccessExpr(new NameExpr("DiscriminatorType"), "STRING")));
		return new NormalAnnotationExpr(new NameExpr("DiscriminatorColumn"), pairs);
	}

	/**
	 * 创建根据id从数据库中获取实体实例的方法
	 * 
	 * @return
	 */
	private BodyDeclaration createGetMethod() {
		MethodDeclaration result = new MethodDeclaration();
		result.setModifiers(ModifierSet.PUBLIC + ModifierSet.STATIC);
		result.setName("get");
		result.setType(new ClassOrInterfaceType(domainClassInfo.getClassName()));
		Parameter parameter = ASTHelper.createParameter(ASTHelper.LONG_TYPE, "id");
		result.setParameters(Arrays.asList(parameter));
		MethodCallExpr exp = new MethodCallExpr(null, "getRepository");
		exp = new MethodCallExpr(exp, "get");
		exp.setArgs(toArgs(new ClassExpr(new ClassOrInterfaceType(domainClassInfo.getClassName())), new LongLiteralExpr("id")));
		Statement returnStmt = new ReturnStmt(exp);
		BlockStmt blockStmt = new BlockStmt(Arrays.asList(returnStmt));
		result.setBody(blockStmt);
		return result;
	}

	/**
	 * 创建根据业务主键从数据库中获取实体实例的方法
	 * 
	 * @return
	 */
	private BodyDeclaration createGetByBpkMethod() {
		MethodDeclaration result = new MethodDeclaration();
		result.setModifiers(ModifierSet.PUBLIC + ModifierSet.STATIC);
		result.setName(getByBpkMethodName());
		result.setType(new ClassOrInterfaceType(domainClassInfo.getClassName()));
		List<Parameter> parameters = new ArrayList<Parameter>();
		for (PropertyInfo propertyInfo : domainClassInfo.getPropertyInfos()) {
			if (propertyInfo.isBusinessPK()) {
				parameters.add(ASTHelper.createParameter(new ClassOrInterfaceType(propertyInfo.getType().getDeclareType()), propertyInfo.getName()));
			}
		}
		result.setParameters(parameters);

		MethodCallExpr queryExpr = new MethodCallExpr(new NameExpr("QuerySettings"), "create");
		queryExpr.setArgs(toArgs(new ClassExpr(new ClassOrInterfaceType(domainClassInfo.getClassName()))));
		for (String prop : domainClassInfo.getBpkNames()) {
			queryExpr = new MethodCallExpr(queryExpr, "eq");
			queryExpr.setArgs(toArgs(new StringLiteralExpr(prop), new NameExpr(prop)));
		}
		MethodCallExpr repositoryExpr = new MethodCallExpr(null, "getRepository");
		repositoryExpr = new MethodCallExpr(repositoryExpr, "getSingleResult");
		repositoryExpr.setArgs(toArgs(queryExpr));
		Statement returnStmt = new ReturnStmt(repositoryExpr);
		BlockStmt blockStmt = new BlockStmt(Arrays.asList(returnStmt));
		result.setBody(blockStmt);
		return result;
	}

	/**
	 * 获得根据业务主键从数据库中获取实体实例的方法的方法名
	 * 
	 * @return
	 */
	private String getByBpkMethodName() {
		List<String> bpks = new ArrayList<String>();
		for (String prop : domainClassInfo.getBpkNames()) {
			bpks.add(StringUtils.capitalize(prop));
		}
		return "getBy" + StringUtils.join(bpks, "And");
	}

	/**
	 * 创建findAll()方法，从数据库中找出所有该类型的实体实例
	 * 
	 * @return
	 */
	private BodyDeclaration createFindAllMethod() {
		MethodDeclaration result = new MethodDeclaration();
		result.setModifiers(ModifierSet.PUBLIC + ModifierSet.STATIC);
		result.setName("findAll");
		result.setType(new ClassOrInterfaceType("List<" + domainClassInfo.getClassName() + ">"));
		MethodCallExpr exp = new MethodCallExpr(null, "getRepository");
		exp = new MethodCallExpr(exp, "findAll");
		exp.setArgs(toArgs(new ClassExpr(new ClassOrInterfaceType(domainClassInfo.getClassName()))));
		Statement returnStmt = new ReturnStmt(exp);
		BlockStmt blockStmt = new BlockStmt(Arrays.asList(returnStmt));
		result.setBody(blockStmt);
		return result;
	}

	@Override
	public List<PropertyInfo> getEqualityProperties() {
		List<PropertyInfo> results = domainClassInfo.getBpkProperties();
		if (results.isEmpty()) {
			return domainClassInfo.getPropertyInfos();
		}
		return results;
	}

}
