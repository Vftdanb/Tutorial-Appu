package org.openkoala.dmt.codegen.metadata.proptype;

public class CollectionPropertyType extends AbstractCollectionPropertyType {

	public CollectionPropertyType(String elementType) {
		super(elementType);
	}

	public String getDeclareType() {
		return "Collection<" + getElementType() + ">";
	}

	@Override
	public String getImplementType() {
		return "ArrayList<" + getElementType() + ">";
	}

	@Override
	public String getUnmodifiableCloneMethodName() {
		return "unmodifiableCollection";
	}

}
