package com.toudeuk.server.domain.user.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUserItem is a Querydsl query type for UserItem
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QUserItem extends EntityPathBase<UserItem> {

    private static final long serialVersionUID = 1573070927L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QUserItem userItem = new QUserItem("userItem");

    public final com.toudeuk.server.core.entity.QBaseEntity _super = new com.toudeuk.server.core.entity.QBaseEntity(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    //inherited
    public final BooleanPath isDeleted = _super.isDeleted;

    public final BooleanPath isUsed = createBoolean("isUsed");

    public final com.toudeuk.server.domain.item.entity.QItem item;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public final QUser user;

    public QUserItem(String variable) {
        this(UserItem.class, forVariable(variable), INITS);
    }

    public QUserItem(Path<? extends UserItem> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QUserItem(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QUserItem(PathMetadata metadata, PathInits inits) {
        this(UserItem.class, metadata, inits);
    }

    public QUserItem(Class<? extends UserItem> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.item = inits.isInitialized("item") ? new com.toudeuk.server.domain.item.entity.QItem(forProperty("item")) : null;
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user")) : null;
    }

}

