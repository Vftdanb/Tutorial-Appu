package org.openkoala.dmt.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CollectionTable;
import javax.persistence.DiscriminatorValue;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;

@Entity
@DiscriminatorValue("EnumShape")
public class EnumShape extends DomainShape {

	private static final long serialVersionUID = 3649817604378412071L;
	
	private List<String> enumItems = new ArrayList<String>();
	
	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "ENUM_ITEMS", joinColumns = @JoinColumn(name = "ENUM_ID"))
	public List<String> getEnumItems() {
		return enumItems;
	}

	public void setEnumItems(List<String> enumItems) {
		this.enumItems = enumItems;
	}
	
}
