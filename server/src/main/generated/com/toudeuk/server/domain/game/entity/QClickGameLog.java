package com.toudeuk.server.domain.game.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QClickGameLog is a Querydsl query type for ClickGameLog
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QClickGameLog extends EntityPathBase<ClickGameLog> {

    private static final long serialVersionUID = -1974522814L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QClickGameLog clickGameLog = new QClickGameLog("clickGameLog");

    public final com.toudeuk.server.core.entity.QTimeEntity _super = new com.toudeuk.server.core.entity.QTimeEntity(this);

    public final QClickGame clickGame;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> order = createNumber("order", Integer.class);

    public final com.toudeuk.server.domain.user.entity.QUser user;

    public QClickGameLog(String variable) {
        this(ClickGameLog.class, forVariable(variable), INITS);
    }

    public QClickGameLog(Path<? extends ClickGameLog> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QClickGameLog(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QClickGameLog(PathMetadata metadata, PathInits inits) {
        this(ClickGameLog.class, metadata, inits);
    }

    public QClickGameLog(Class<? extends ClickGameLog> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.clickGame = inits.isInitialized("clickGame") ? new QClickGame(forProperty("clickGame")) : null;
        this.user = inits.isInitialized("user") ? new com.toudeuk.server.domain.user.entity.QUser(forProperty("user")) : null;
    }

}

