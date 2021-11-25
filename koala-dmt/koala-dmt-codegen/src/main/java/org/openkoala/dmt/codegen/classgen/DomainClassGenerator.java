package org.openkoala.dmt.codegen.classgen;

import japa.parser.ASTHelper;
import japa.parser.ast.CompilationUnit;
import japa.parser.ast.ImportDeclaration;
import japa.parser.ast.PackageDeclaration;
import japa.parser.ast.body.BodyDeclaration;
import japa.parser.ast.body.ClassOrInterfaceDeclaration;
import japa.parser.ast.body.ConstructorDeclaration;
import japa.parser.ast.body.JavadocComment;
import japa.parser.ast.body.MethodDeclaration;
import japa.parser.ast.body.ModifierSet;
import japa.parser.ast.body.Parameter;
import japa.parser.ast.body.VariableDeclarator;
import japa.parser.ast.body.VariableDeclaratorId;
import japa.parser.ast.expr.AnnotationExpr;
import japa.parser.ast.expr.AssignExpr;
import japa.parser.ast.expr.AssignExpr.Operator;
import japa.parser.ast.expr.BooleanLiteralExpr;
import japa.parser.ast.expr.CastExpr;
import japa.parser.ast.expr.EnclosedExpr;
import japa.parser.ast.expr.Expression;
import japa.parser.ast.expr.FieldAccessExpr;
import japa.parser.ast.expr.InstanceOfExpr;
import japa.parser.ast.expr.IntegerLiteralExpr;
import japa.parser.ast.expr.MarkerAnnotationExpr;
import japa.parser.ast.expr.MethodCallExpr;
import japa.parser.ast.expr.NameExpr;
import japa.parser.ast.expr.ObjectCreationExpr;
import japa.parser.ast.expr.ThisExpr;
import japa.parser.ast.expr.UnaryExpr;
import japa.parser.ast.expr.VariableDeclarationExpr;
import japa.parser.ast.stmt.BlockStmt;
import japa.parser.ast.stmt.ExpressionStmt;
import japa.parser.ast.stmt.IfStmt;
import japa.parser.ast.stmt.ReturnStmt;
import japa.parser.ast.stmt.Statement;
import japa.parser.ast.type.ClassOrInterfaceType;
import japa.parser.ast.type.PrimitiveType;
import japa.parser.ast.type.PrimitiveType.Primitive;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.openkoala.dmt.codegen.metadata.CodeGenUtils;
import org.openkoala.dmt.codegen.metadata.DomainClassInfo;
import org.openkoala.dmt.codegen.metadata.PropertyInfo;
import org.openkoala.dmt.codegen.tools.ClassGenerator;
import org.openkoala.dmt.codegen.tools.PropertyGenerator;
import org.openkoala.dmt.codegen.tools.PropertyGeneratorFactory;

/**
 * 实体生成器，根据实体信息生成Java编译单元（类文件）
 * 
 * @author yyang
 * 
 */
public abstract class DomainClassGenerator implements ClassGenerator {

	/* 表定义的语义符: 注释 */
	protected static final String COMMENT_SYMBOL = "//";
	/* 表定义的语义符: 分隔符 */
	protected static final String SPLIT_SYMBOL = "\\|";

	protected DomainClassInfo domainClassInfo;

	private CompilationUnit result;

	public DomainClassGenerator(DomainClassInfo domainClassInfo) {
		this.domainClassInfo = domainClassInfo;
	}

	/**
	 * 生成Java编译单元。
	 * 
	 * @return
	 */
	public String generateCompilationUnit() {
		result = new CompilationUnit();
		if (StringUtils.isNotBlank(domainClassInfo.getPackageName())) {
			result.setPackage(new PackageDeclaration(new NameExpr(domainClassInfo.getPackageName())));
		}
		result.setImports(createImports());
		ASTHelper.addTypeDeclaration(result, createTypeDeclare());
		return result.toString();
	}

	/**
	 * 创建导入（import）语句
	 * 
	 * @return
	 */
	private List<ImportDeclaration> createImports() {
		List<ImportDeclaration> importDeclarList = new ArrayList<ImportDeclaration>();
		importDeclarList.add(new ImportDeclaration(new NameExpr("javax.persistence.*"), false, false));
		importDeclarList.add(new ImportDeclaration(new NameExpr("java.util.*"), false, false));
		importDeclarList.add(new ImportDeclaration(new NameExpr("com.dayatang.domain.AbstractEntity"), false, false));
		importDeclarList.add(new ImportDeclaration(new NameExpr("com.dayatang.domain.QuerySettings"), false, false));
		importDeclarList.add(new ImportDeclaration(new NameExpr("javax.validation.constraints.*"), false, false));
		importDeclarList.add(new ImportDeclaration(new NameExpr("org.apache.commons.lang3.builder.*"), false, false));
		return importDeclarList;
	}

	/**
	 * 生成类型声明，也就是"public class Abc extends Xyz {}"这一块。
	 * 
	 * @return
	 */
	protected ClassOrInterfaceDeclaration createTypeDeclare() {
		ClassOrInterfaceDeclaration result = new ClassOrInterfaceDeclaration(createClassModifiers(domainClassInfo), false, domainClassInfo.getClassName());
		result.setJavaDoc(new JavadocComment(domainClassInfo.getEntityComment())); // 设置类文档注释
		result.setAnnotations(createClassAnnotations()); // 添加注解（Annotation）
		createFieldDeclarations(result); // 生成字段声明
		// 添加构造函数
		for (ConstructorDeclaration constructor : createConstructors()) {
			ASTHelper.addMember(result, constructor);
		}
		createAccessorDeclarations(result); // 生成属性访问方法（get和set方法）
		return result;
	}

	/**
	 * 定义类的访问修饰符
	 * 
	 * @param domainClassInfo
	 * @return
	 */
	private int createClassModifiers(DomainClassInfo domainClassInfo) {
		int result = ModifierSet.PUBLIC;
		if (domainClassInfo.isAbstract()) {
			result += ModifierSet.ABSTRACT;
		}
		return result;
	}

	/**
	 * 创建类的注解
	 * 
	 * @return
	 */
	protected abstract List<AnnotationExpr> createClassAnnotations();

	/**
	 * 创建字段声明（如"private String id"或"private List<A> abc = new ArrayList<A>()"）
	 * 
	 * @param targetClazz
	 */
	private void createFieldDeclarations(ClassOrInterfaceDeclaration targetClazz) {
		PropertyGeneratorFactory factory = new PropertyGeneratorFactory();
		for (PropertyInfo propertyInfo : domainClassInfo.getPropertyInfos()) {
			PropertyGenerator property = factory.getGenerator(propertyInfo);
			ASTHelper.addMember(targetClazz, property.createFieldDeclaration());
		}
	}

	/**
	 * 创建构造函数
	 * 
	 * @return
	 */
	private List<ConstructorDeclaration> createConstructors() {
		List<ConstructorDeclaration> result = new ArrayList<ConstructorDeclaration>();
		result.add(createConstructorsWithoutParameters());
		if (!domainClassInfo.getBpkNames().isEmpty()) {
			result.add(createConstructorsByBpks());
		}
		return result;
	}

	/**
	 * 创建无参构造函数
	 * 
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private ConstructorDeclaration createConstructorsWithoutParameters() {
		ConstructorDeclaration result = new ConstructorDeclaration();
		result.setName(domainClassInfo.getClassName());
		result.setBlock(new BlockStmt(Collections.EMPTY_LIST));
		return result;
	}

	/**
	 * 创建以业务主键为参数的构造函数
	 * 
	 * @return
	 */
	private ConstructorDeclaration createConstructorsByBpks() {
		ConstructorDeclaration result = new ConstructorDeclaration();
		result.setName(domainClassInfo.getClassName());
		result.setModifiers(ModifierSet.PUBLIC);
		List<Parameter> parameters = new ArrayList<Parameter>();
		for (PropertyInfo prop : domainClassInfo.getBpkProperties()) {
			parameters.add(ASTHelper.createParameter(new ClassOrInterfaceType(prop.getType().getDeclareType()), prop.getName()));
		}
		result.setParameters(parameters);
		List<Statement> statements = new ArrayList<Statement>();
		for (String prop : domainClassInfo.getBpkNames()) {
			AssignExpr assignExpr = new AssignExpr(new FieldAccessExpr(new ThisExpr(), prop), new NameExpr(prop), Operator.assign);
			statements.add(new ExpressionStmt(assignExpr));
		}
		BlockStmt blockStmt = new BlockStmt(statements);
		result.setBlock(blockStmt);
		return result;
	}

	/**
	 * 创建属性访问方法声明
	 * 
	 * @param targetClazz
	 */
	private void createAccessorDeclarations(ClassOrInterfaceDeclaration targetClazz) {
		PropertyGeneratorFactory factory = new PropertyGeneratorFactory();
		for (PropertyInfo propertyInfo : domainClassInfo.getPropertyInfos()) {
			PropertyGenerator property = factory.getGenerator(propertyInfo);
			for (MethodDeclaration method : property.createAccessorDeclarations()) {
				ASTHelper.addMember(targetClazz, method);
			}
		}
	}

	/**
	 * 工具方法，创建一批表达式
	 * 
	 * @param expressions
	 * @return
	 */
	protected List<Expression> toArgs(Expression... expressions) {
		return Arrays.asList(expressions);
	}
	
	protected List<PropertyInfo> getEqualityProperties() {
		return new ArrayList<PropertyInfo>();
	}

	/**
	 * 创建hashCode()方法
	 * 
	 * @return
	 */
	protected BodyDeclaration createHashCodeMethod() {
		MethodDeclaration result = new MethodDeclaration();
		AnnotationExpr overrideAnnotation = new MarkerAnnotationExpr(new NameExpr("Override"));
		result.setAnnotations(Arrays.asList(overrideAnnotation));
		result.setModifiers(ModifierSet.PUBLIC);
		result.setName("hashCode");
		result.setType(new PrimitiveType(Primitive.Int));
		ObjectCreationExpr creationExpr = new ObjectCreationExpr();
		creationExpr.setType(new ClassOrInterfaceType("HashCodeBuilder"));
		creationExpr.setArgs(toArgs(new IntegerLiteralExpr("17"), new IntegerLiteralExpr("37")));
		MethodCallExpr toHashCodeExpr = null;
		Expression appendExpr = creationExpr;
		if (domainClassInfo.withoutProperties()) {
			toHashCodeExpr = new MethodCallExpr(creationExpr, "toHashCode");
		} else {
			for (PropertyInfo propertyInfo : getEqualityProperties()) {
				appendExpr = singlePropertyAppend(appendExpr, propertyInfo);
			}
			toHashCodeExpr = new MethodCallExpr(appendExpr, "toHashCode");
		}
		Statement returnStmt = new ReturnStmt(toHashCodeExpr);
		BlockStmt blockStmt = new BlockStmt(Arrays.asList(returnStmt));
		result.setBody(blockStmt);
		return result;
	}

	private Expression singlePropertyAppend(Expression parent, PropertyInfo propertyInfo) {
		Expression expr = new MethodCallExpr(new ThisExpr(), CodeGenUtils.getGetterMethodName(propertyInfo));
		return new MethodCallExpr(parent, "append", Collections.singletonList(expr));
	}

	/**
	 * 创建equals()方法
	 * 
	 * @return
	 */
	protected BodyDeclaration createEqualsMethod() {
		// equals
		MethodDeclaration result = new MethodDeclaration();
		AnnotationExpr overrideAnnotation = new MarkerAnnotationExpr(new NameExpr("Override"));
		result.setAnnotations(Arrays.asList(overrideAnnotation));
		result.setModifiers(ModifierSet.PUBLIC);
		result.setType(new PrimitiveType(Primitive.Boolean));
		result.setName("equals");
		VariableDeclaratorId other = new VariableDeclaratorId("other");
		Parameter parameters = new Parameter(new ClassOrInterfaceType("Object"), other);
		result.setParameters(Arrays.asList(parameters));

		ClassOrInterfaceType entityClass = new ClassOrInterfaceType(domainClassInfo.getClassName());
		Expression expr = new InstanceOfExpr(new NameExpr("other"), entityClass);
		expr = new UnaryExpr(new EnclosedExpr(expr), UnaryExpr.Operator.not);
		Statement returnStmt1 = new ReturnStmt(new BooleanLiteralExpr(false));
		IfStmt ifStmt = new IfStmt(expr, new BlockStmt(Collections.singletonList(returnStmt1)), null);

		VariableDeclarator that = new VariableDeclarator(new VariableDeclaratorId("that"));
		VariableDeclarationExpr expr2 = new VariableDeclarationExpr(entityClass, Arrays.asList(that));
		AssignExpr assignExpr = new AssignExpr(expr2, new CastExpr(entityClass, new NameExpr("other")), Operator.assign);
		ExpressionStmt assignStmt = new ExpressionStmt(assignExpr);

		ObjectCreationExpr creationExpr = new ObjectCreationExpr();
		creationExpr.setType(new ClassOrInterfaceType("EqualsBuilder"));
		// String propOfUnique = domainClassInfo.getPropOfUnique();
		MethodCallExpr isEqualsExpr = null;
		Expression appendExpr = creationExpr;
		if (domainClassInfo.withoutProperties()) {
			isEqualsExpr = new MethodCallExpr(creationExpr, "isEquals");
		} else {
			for (PropertyInfo propertyInfo : getEqualityProperties()) {
				appendExpr = twoPropertyAppend(appendExpr, propertyInfo);
			}
			isEqualsExpr = new MethodCallExpr(appendExpr, "isEquals");
		}
		Statement returnStmt = new ReturnStmt(isEqualsExpr);
		BlockStmt blockStmt = new BlockStmt(Arrays.asList(ifStmt, assignStmt, returnStmt));
		result.setBody(blockStmt);
		return result;
	}

	private Expression twoPropertyAppend(Expression parent, PropertyInfo propertyInfo) {
		Expression thisExpr = new MethodCallExpr(new ThisExpr(), CodeGenUtils.getGetterMethodName(propertyInfo));
		Expression thatExpr = new MethodCallExpr(new NameExpr("that"), CodeGenUtils.getGetterMethodName(propertyInfo));
		return new MethodCallExpr(parent, "append", Arrays.asList(thisExpr, thatExpr));
	}


	/**
	 * 创建toString()方法
	 * 
	 * @return
	 */
	protected BodyDeclaration createToStringMethod() {
		MethodDeclaration result = new MethodDeclaration();
		AnnotationExpr overrideAnnotation = new MarkerAnnotationExpr(new NameExpr("Override"));
		result.setAnnotations(Arrays.asList(overrideAnnotation));
		result.setModifiers(ModifierSet.PUBLIC);
		result.setType(new ClassOrInterfaceType("String"));
		result.setName("toString");
		List<Expression> args = toArgs(new ThisExpr());
		ObjectCreationExpr creationExpr = new ObjectCreationExpr(null, new ClassOrInterfaceType("ToStringBuilder"), args);
		MethodCallExpr toStringExpr = null;
		Expression appendExpr = creationExpr;
		if (domainClassInfo.withoutProperties()) {
			toStringExpr = new MethodCallExpr(creationExpr, "build");
		} else {
			for (PropertyInfo propertyInfo : getEqualityProperties()) {
				appendExpr = singlePropertyAppend(appendExpr, propertyInfo);
			}
			toStringExpr = new MethodCallExpr(appendExpr, "build");
		}
		Statement returnStmt = new ReturnStmt(toStringExpr);
		BlockStmt blockStmt = new BlockStmt(Arrays.asList(returnStmt));
		result.setBody(blockStmt);
		return result;
	}
}
