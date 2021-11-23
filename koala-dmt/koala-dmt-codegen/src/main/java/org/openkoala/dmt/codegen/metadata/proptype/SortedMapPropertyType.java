package org.openkoala.dmt.codegen.metadata.proptype;

public class SortedMapPropertyType extends AbstractMapPropertyType {

	public SortedMapPropertyType(String keyType, String valueType) {
		super(keyType, valueType);
	}

	public String getDeclareType() {
		return "SortedMap<" + getKeyType() + ", " + getValueType() + ">";
	}

	@Override
	public String getImplementType() {
		return "TreeMap<" + getKeyType() + ", " + getValueType() + ">";
	}

	@Override
	public String getUnmodifiableCloneMethodName() {
		return "unmodifiableSortedSet";
	}

}
