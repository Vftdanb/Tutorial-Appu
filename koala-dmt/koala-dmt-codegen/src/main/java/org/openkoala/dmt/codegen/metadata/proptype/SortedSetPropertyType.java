package org.openkoala.dmt.codegen.metadata.proptype;

public class SortedSetPropertyType extends AbstractCollectionPropertyType {

	public SortedSetPropertyType(String elementType) {
		super(elementType);
	}

	public String getDeclareType() {
		return "SortedSet<" + getElementType() + ">";
	}

	@Override
	public String getImplementType() {
		return "TreeSet<" + getElementType() + ">";
	}

	@Override
	public String getUnmodifiableCloneMethodName() {
		return "unmodifiableSortedSet";
	}

}
