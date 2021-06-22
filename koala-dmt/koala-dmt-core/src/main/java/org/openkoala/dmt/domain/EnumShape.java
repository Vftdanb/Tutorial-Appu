package org.openkoala.dmt.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("EnumShape")
public class EnumShape extends DomainShape {

	private static final long serialVersionUID = 3649817604378412071L;
	
	private List<String> enumItems = new ArrayList<String>();

	public List<String> getEnumItems() {
		return enumItems;
	}

	public void setEnumItems(List<String> enumItems) {
		this.enumItems = enumItems;
	}
	
}
