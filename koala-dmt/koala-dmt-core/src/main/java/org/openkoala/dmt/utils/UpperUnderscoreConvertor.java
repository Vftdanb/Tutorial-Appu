package org.openkoala.dmt.utils;

import com.google.common.base.CaseFormat;

public class UpperUnderscoreConvertor {

	private String primaryString;
	
	public UpperUnderscoreConvertor(String primaryString) {
		this.primaryString = primaryString;
	}
	
	public String convert() {
		if (primaryString == null) {
			throw new NullPointerException("primary string is null!");
		}
		
		if (primaryString.contains("_")) {
			return CaseFormat.UPPER_CAMEL.to(CaseFormat.UPPER_UNDERSCORE, primaryString).replace("__", "_");
		}
		
		return CaseFormat.UPPER_CAMEL.to(CaseFormat.UPPER_UNDERSCORE, primaryString);
	}
	
}
