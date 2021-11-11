package org.openkoala.dmt.codegen.metadata.proptype;

public class MapPropertyType extends AbstractMapPropertyType {

	public MapPropertyType(String keyType, String valueType) {
		super(keyType, valueType);
	}

	public String getDeclareType() {
		return "Map<" + getKeyType() + ", " + getValueType() + ">";
	}

	@Override
	public String getImplementType() {
		return "HashMap<" + getKeyType() + ", " + getValueType() + ">";
	}

	@Override
	public String getUnmodifiableCloneMethodName() {
		return "unmodifiableMap";
	}

}
