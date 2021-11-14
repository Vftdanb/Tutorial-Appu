package org.openkoala.dmt.codegen.metadata.proptype;

public class SetPropertyType extends AbstractCollectionPropertyType {

	public SetPropertyType(String elementType) {
		super(elementType);
	}

	public String getDeclareType() {
		return "Set<" + getElementType() + ">";
	}

	@Override
	public String getImplementType() {
		return "HashSet<" + getElementType() + ">";
	}

	@Override
	public String getUnmodifiableCloneMethodName() {
		return "unmodifiableSet";
	}

}
