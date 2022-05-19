package org.openkoala.dmt.codegen.metadata;

import org.apache.commons.lang3.StringUtils;
import org.openkoala.dmt.codegen.metadata.proptype.SingleValuePropertyType;
import org.openkoala.dmt.codegen.tools.Inflector;

public class CodeGenUtils {
	private CodeGenUtils() {
	}

	public static String getGetterMethodName(PropertyInfo propertyInfo) {
		PropertyType propType = propertyInfo.getType();
		String prefix = "get";
		if (propType instanceof SingleValuePropertyType) {
			if (((SingleValuePropertyType) propType).getDataType().equalsIgnoreCase("boolean")) {
				prefix = "is";
			}
		}
		return prefix + upperFirstLetter(propertyInfo.getName());
	}

	public static String getSetterMethodName(PropertyInfo propertyInfo) {
		return "set" + upperFirstLetter(propertyInfo.getName());
	}

	public static String upperFirstLetter(String value) {
		return value.substring(0, 1).toUpperCase() + value.substring(1);
	}

	public static String getCollectionTypeParam(String dataType) {
		return getSubString(dataType, "<", ">");
	}

	public static String getMapKeyType(String dataType) {
		return getSubString(dataType, "<", ",");
	}

	public static String getMapValueType(String dataType) {
		return getSubString(dataType, ",", ">");
	}
	
	private static String getSubString(String str, String prefix, String suffix) {
		int start = str.indexOf(prefix);
		int end = str.lastIndexOf(suffix);
		if (start < 0 || end < 0 || end < start) {
			throw new IllegalArgumentException("Type '" + str + "' is invalid");
		}
		return str.substring(start + 1, end).trim();
	}

	public static String formatClassName(String value) {
		String result = value.replace(" ", "");
		result = result.replace("_", "");
		return result.substring(0, 1).toUpperCase() + result.substring(1);
	}

	public static String formatPropName(String value) {
		if (StringUtils.isBlank(value)) {
			throw new RuntimeException("属性名不能为空!");
		}
		String result = value.replace(" ", "");
		result = result.replace("_", "");
		return result.substring(0, 1).toLowerCase() + result.substring(1);
	}
	
	public static String getTableName(String className) {
		return Inflector.getInstance().tableize(className).toUpperCase();
	}

	public static String getColumnName(String propName) {
		return Inflector.getInstance().underscore(propName).toUpperCase();
	}

	public static String getJoinColumnName(String propName) {
		return (Inflector.getInstance().underscore(propName) + "_ID").toUpperCase();
	}
}
