package ee;

import javax.persistence.*;
import java.util.*;
import com.dayatang.domain.AbstractEntity;
import com.dayatang.domain.QuerySettings;
import javax.validation.constraints.*;
import org.apache.commons.lang3.builder.*;

/***/
@Entity
@Table(name = "ENTITY1")
@DiscriminatorValue("ENTITY1")
public class Entity1 extends AbstractEntity {

    Entity1() {
    }

    public static Entity1 get(long id) {
        return getRepository().get(Entity1.class, id);
    }

    public static Entity1 get(long id) {
        return getRepository().get(Entity1.class, id);
    }

    public static Entity1 getBy() {
        return getRepository().getSingleResult(QuerySettings.create(Entity1.class));
    }

    public static List<Entity1> findAll() {
        return getRepository().findAll(Entity1.class);
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37).toHashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof Entity1)) {
            return false;
        }
        Entity1 that = (Entity1) other;
        return new EqualsBuilder().isEquals();
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this).build();
    }
}
