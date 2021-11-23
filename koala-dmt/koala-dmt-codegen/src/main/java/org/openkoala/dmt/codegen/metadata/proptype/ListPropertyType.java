package org.openkoala.dmt.codegen.metadata.proptype;

public class ListPropertyType extends AbstractCollectionPropertyType {

	public ListPropertyType(String elementType) {
		super(elementType);
	}

	public String getDeclareType() {
		return "List<" + getElementType() + ">";
	}

	@Override
	public String getImplementType() {
		return "ArrayList<" + getElementType() + ">";
	}

	@Override
	public String getUnmodifiableCloneMethodName() {
		return "unmodifiableList";
	}

}
