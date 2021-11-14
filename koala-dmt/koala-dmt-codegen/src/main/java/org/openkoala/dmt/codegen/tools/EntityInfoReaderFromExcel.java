package org.openkoala.dmt.codegen.tools;

import java.io.File;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
//import org.apache.poi.ss.usermodel.Workbook;
import org.openkoala.dmt.codegen.metadata.CodeGenUtils;
import org.openkoala.dmt.codegen.metadata.DomainClassInfo;
import org.openkoala.dmt.codegen.metadata.PropertyExt;
import org.openkoala.dmt.codegen.metadata.PropertyInfo;
import org.openkoala.dmt.codegen.metadata.PropertyType;
import org.openkoala.dmt.codegen.metadata.proptype.CollectionPropertyType;
import org.openkoala.dmt.codegen.metadata.proptype.ListPropertyType;
import org.openkoala.dmt.codegen.metadata.proptype.MapPropertyType;
import org.openkoala.dmt.codegen.metadata.proptype.SetPropertyType;
import org.openkoala.dmt.codegen.metadata.proptype.SingleValuePropertyType;
import org.openkoala.dmt.codegen.metadata.proptype.SortedMapPropertyType;
import org.openkoala.dmt.codegen.metadata.proptype.SortedSetPropertyType;

/**
 * 从Excel中读入实体信息，生成EntityInfo。
 * @author yyang
 *
 */
public class EntityInfoReaderFromExcel {

//	private static final int ENTITY_ROW = 1;
//
//	private static final int ENTITY_NAME_COLUMN = 0;
//
//	private static final int ENTITY_TABLE_NAME_COLUMN = 1;
//
//	private static final int ENTITY_COMMENT_COLUMN = 2;
//
//	private static final int ENTITY_ABSTRACT_COLUMN = 3;
//
//	private static final int ENTITY_DISCRIM_COLUMN = 4;
//
//	private static final int ENTITY_BASE_CLASS_COLUMN = 5;
//
//	private static final int ENTITY_CATEGORY_COLUMN = 6;
//
//	private static final int PROP_ROW_FROM = 3;
//
//	private static final int PROP_NAME_COLUMN = 0;
//
//	private static final int PROP_COLUMN_NAME_COLUMN = 1;
//
//	private static final int PROP_COMMENT_COLUMN = 2;
//
//	private static final int PROP_TYPE_COLUMN = 3;
//
//	private static final int PROP_TYPE_EXT_COLUMN = 4;
//
//	private static final int PROP_BPK_COLUMN = 5;
//
//	private static final int PROP_MAPPED_BY_COLUMN = 6;
//
//	private static final int PROP_NULLABLE_COLUMN = 7;
//
//	private static final int PROP_MIN_COLUMN = 8;
//
//	private static final int PROP_MAX_COLUMN = 9;
//
//	private static final int PROP_PATTERN_COLUMN = 10;
//
//	
//	private Log log;
//	
//	public EntityInfoReaderFromExcel(Log log) {
//		super();
//		this.log = log;
//	}
//
//	public Log getLog() {
//		return log;
//	}
//
//	public void setLog(Log log) {
//		this.log = log;
//	}
//
//	public Set<DomainClassInfo> read(File excelFile) {
//		Set<DomainClassInfo> results = new HashSet<DomainClassInfo>();
//		int sheetCount = getSheetCount(excelFile);
//		getLog().info("Sheet count of Excel: " + sheetCount);
//		ExcelHandler excelHandler = new ExcelHandler(excelFile);
//		for (int i = 0; i < excelHandler.getSheetCount(); i++) {
//			ExcelRangeData data = excelHandler.readRange(ExcelRange.sheetIndex(i).rowFrom(0).columnRange("A", "K"));
//			DomainClassInfo domainClassInfo = createBasicEntityInfo(data);
//			domainClassInfo.setPropertyInfos(createPropertyInfos(data));
//			results.add(domainClassInfo);
//		}
//		return results;
//	}
//
//	private int getSheetCount(File excelFile) {
//            Workbook workbook = WorkbookFactory.createWorkbook(excelFile);
//            return workbook.getNumberOfSheets();
//	}
//	
//	private DomainClassInfo createBasicEntityInfo(ExcelRangeData data) {
//		DomainClassInfo result = new DomainClassInfo();
//		String className = data.getString(ENTITY_ROW, ENTITY_NAME_COLUMN);
//		getLog().info("Reading entity information of " + className + " from excel......");
//		result.setClassName(className);
//		result.setTableName(data.getString(ENTITY_ROW, ENTITY_TABLE_NAME_COLUMN));
//		result.setEntityComment(data.getString(ENTITY_ROW, ENTITY_COMMENT_COLUMN));
//		String isAbstract = data.getString(ENTITY_ROW, ENTITY_ABSTRACT_COLUMN);
//		result.setAbstract("true".equalsIgnoreCase(isAbstract) ? true : false);
//		String discriminatorValue = data.getString(ENTITY_ROW, ENTITY_DISCRIM_COLUMN);
//		if (StringUtils.isNotBlank(discriminatorValue)) {
//			result.setDiscriminator(discriminatorValue);
//		}
//		String baseClass = data.getString(ENTITY_ROW, ENTITY_BASE_CLASS_COLUMN);
//		if (StringUtils.isNotBlank(baseClass)) {
//			result.setBaseClass(baseClass);
//		}
//		String category = data.getString(ENTITY_ROW, ENTITY_CATEGORY_COLUMN);
//		result.setCategory(ClassCategory.of(category));
//		return result;
//	}
//
//	private List<PropertyInfo> createPropertyInfos(ExcelRangeData data) {
//		List<PropertyInfo> results = new ArrayList<PropertyInfo>();
//		if (data.getRowCount() <= PROP_ROW_FROM) {
//			return results;
//		}
//		for (int row = PROP_ROW_FROM; row < data.getRowCount(); row++) {
//			results.add(createPropertyInfo(data, row));
//		}
//		return results;
//	}
//
//	private PropertyInfo createPropertyInfo(ExcelRangeData data, int row) {
//		PropertyInfo result = new PropertyInfo();
//		result.setName(data.getString(row, PROP_NAME_COLUMN));
//		result.setColumnName(data.getString(row, PROP_COLUMN_NAME_COLUMN));
//		result.setComment(data.getString(row, PROP_COMMENT_COLUMN));
//		//result.setType(data.getString(row, PROP_TYPE_COLUMN));
//		result.setType(getPropertyType(data.getString(row, PROP_TYPE_COLUMN)));
//	
//		result.setTypeExt(PropertyExt.of(data.getString(row, PROP_TYPE_EXT_COLUMN)));
//		String isBpk = data.getString(row, PROP_BPK_COLUMN);
//		if ("true".equalsIgnoreCase(isBpk)) {
//			result.setBusinessPK(true);
//		}
//		String mappedBy = data.getString(row, PROP_MAPPED_BY_COLUMN);
//		if (StringUtils.isNotBlank(mappedBy)) {
//			result.setMappedBy(mappedBy);
//		}
//		String nullable = data.getString(row, PROP_NULLABLE_COLUMN);
//		if ("false".equalsIgnoreCase(nullable)) {
//			result.setNullable("false".equalsIgnoreCase(nullable) ? false :true);
//		}
//		String min = data.getString(row, PROP_MIN_COLUMN);
//		if (StringUtils.isNumeric(min)) {
//			result.setMin(min);
//		}
//		String max = data.getString(row, PROP_MAX_COLUMN);
//		if (StringUtils.isNumeric(max)) {
//			result.setMax(max);
//		}
//		String pattern = data.getString(row, PROP_PATTERN_COLUMN);
//		if (StringUtils.isNotBlank(pattern)) {
//			result.setPattern(pattern);
//		}
//		return result;
//	}
//
//	private PropertyType getPropertyType(String dataType) {
//		if (dataType.startsWith("Collection<")) {
//			return new CollectionPropertyType(CodeGenUtils.getCollectionTypeParam(dataType));
//		}
//		if (dataType.startsWith("List<")) {
//			return new ListPropertyType(CodeGenUtils.getCollectionTypeParam(dataType));
//		}
//		if (dataType.startsWith("Set<")) {
//			return new SetPropertyType(CodeGenUtils.getCollectionTypeParam(dataType));
//		}
//		if (dataType.startsWith("SortedSet<")) {
//			return new SortedSetPropertyType(CodeGenUtils.getCollectionTypeParam(dataType));
//		}
//		if (dataType.startsWith("Map<")) {
//			return new MapPropertyType(CodeGenUtils.getMapKeyType(dataType), CodeGenUtils.getMapValueType(dataType));
//		}
//		if (dataType.startsWith("SortedMap<")) {
//			return new SortedMapPropertyType(CodeGenUtils.getMapKeyType(dataType), CodeGenUtils.getMapValueType(dataType));
//		}
//		return new SingleValuePropertyType(dataType);
//	}
}
