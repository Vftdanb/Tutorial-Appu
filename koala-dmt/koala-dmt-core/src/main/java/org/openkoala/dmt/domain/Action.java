package org.openkoala.dmt.domain;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.openkoala.dmt.codegen.metadata.Modifier;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Action implements Serializable {

	private static final long serialVersionUID = -5683932639335290666L;

    private Modifier modifier;

	private String name;
	
	private List<Property> arguments = new ArrayList<Property>();
	
	private String returnType;

	private String description;

    private boolean isFinal;

    private boolean isStatic;

    private boolean isAbstract;

    public Modifier getModifier() {
        return modifier;
    }

    public void setModifier(Modifier modifier) {
        this.modifier = modifier;
    }

    public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Property> getArguments() {
		return arguments;
	}

	public void setArguments(List<Property> arguments) {
		this.arguments = arguments;
	}

	public String getReturnType() {
		return returnType;
	}

	public void setReturnType(String returnType) {
		this.returnType = returnType;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

    public boolean isFinal() {
        return isFinal;
    }

    public void setFinal(boolean isFinal) {
        this.isFinal = isFinal;
    }

    public boolean isStatic() {
        return isStatic;
    }

    public void setStatic(boolean isStatic) {
        this.isStatic = isStatic;
    }

    public boolean isAbstract() {
        return isAbstract;
    }

    public void setAbstract(boolean isAbstract) {
        this.isAbstract = isAbstract;
    }

    @Override
	public boolean equals(final Object other) {
		if (this == other)
			return true;
		if (!(other instanceof Action))
			return false;
		Action castOther = (Action) other;
		return new EqualsBuilder().append(name, castOther.name)
				.append(arguments, castOther.arguments)
				.append(returnType, castOther.returnType)
				.isEquals();
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder(17, 37)
			.append(name)
			.append(arguments)
			.append(returnType)
			.toHashCode();
	}

	@Override
	public String toString() {
		return name;
	}
	
}
