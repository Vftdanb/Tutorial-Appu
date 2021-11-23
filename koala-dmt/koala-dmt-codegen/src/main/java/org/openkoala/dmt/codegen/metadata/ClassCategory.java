package org.openkoala.dmt.codegen.metadata;

public enum ClassCategory {
	ENTITY, MAPPED_SUPER_CLASS, EMBEDDABLE, INTERFACE;

//	private static String[] mscs = new String[] { "MappedSuperClass", "MSC",
//			"mapped-super-class" };
//
//	public static ClassCategory of(String value) {
//		if ("Embeddable".equalsIgnoreCase(value)) {
//			return EMBEDDABLE;
//		}
//		for (int i = 0; i < mscs.length; i++) {
//			if (mscs[i].equalsIgnoreCase(value)) {
//				return MAPPED_SUPER_CLASS;
//			}
//		}
//		return ENTITY; 
//	}
}
