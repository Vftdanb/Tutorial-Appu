package org.openkoala.dmt.codegen.metadata;

public enum PropertyExt {
	DATE,
	TIME,
	TIMESTAMP,
	EMBEDDABLE,
	ENUM,
	LOB,
	ELEMENT_COLLECTION,
	MANY_TO_MANY,
	MANY_TO_ONE,
	ONE_TO_MANY,
	ONE_TO_ONE;

	public static PropertyExt of(String value) {
		if ("Date".equalsIgnoreCase(value)) {
			return DATE;
		}
		if ("Time".equalsIgnoreCase(value)) {
			return TIME;
		}
		if ("Timestamp".equalsIgnoreCase(value)) {
			return TIMESTAMP;
		}
		if ("Embeddable".equalsIgnoreCase(value)) {
			return EMBEDDABLE;
		}
		if ("Enum".equalsIgnoreCase(value)) {
			return ENUM;
		}
		if ("Lob".equalsIgnoreCase(value)) {
			return LOB;
		}
		if ("ElementCollection".equalsIgnoreCase(value) || "element-collection".equalsIgnoreCase(value)) {
			return ELEMENT_COLLECTION;
		}
		for (int i = 0; i < m2m.length; i++) {
			if (m2m[i].equalsIgnoreCase(value)) {
				return MANY_TO_MANY;
			}
		}
		for (int i = 0; i < m2o.length; i++) {
			if (m2o[i].equalsIgnoreCase(value)) {
				return MANY_TO_ONE;
			}
		}
		for (int i = 0; i < o2m.length; i++) {
			if (o2m[i].equalsIgnoreCase(value)) {
				return ONE_TO_MANY;
			}
		}
		for (int i = 0; i < o2o.length; i++) {
			if (o2o[i].equalsIgnoreCase(value)) {
				return ONE_TO_ONE;
			}
		}
		return null;
	}
	
	private static String[] m2m = new String[] {"ManyToMany", "many-to-many", "m2m"};
	private static String[] m2o = new String[] {"ManyToOne", "many-to-one", "m2o"};
	private static String[] o2m = new String[] {"OneToMany", "one-to-many", "o2m"};
	private static String[] o2o = new String[] {"OneToOne", "one-to-one", "o2o"};
	
}
