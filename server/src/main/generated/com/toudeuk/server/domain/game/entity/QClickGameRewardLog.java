package com.toudeuk.server.domain.game.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QClickGameRewardLog is a Querydsl query type for ClickGameRewardLog
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QClickGameRewardLog extends EntityPathBase<ClickGameRewardLog> {

    private static final long serialVersionUID = -305714157L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QClickGameRewardLog clickGameRewardLog = new QClickGameRewardLog("clickGameRewardLog");

    public final com.toudeuk.server.core.entity.QTimeEntity _super = new com.toudeuk.server.core.entity.QTimeEntity(this);

    public final NumberPath<Integer> clickCount = createNumber("clickCount", Integer.class);

    public final QClickGame clickGame;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> reward = createNumber("reward", Integer.class);

    public final EnumPath<RewardType> rewardType = createEnum("rewardType", RewardType.class);

    public final com.toudeuk.server.domain.user.entity.QUser user;

    public QClickGameRewardLog(String variable) {
        this(ClickGameRewardLog.class, forVariable(variable), INITS);
    }

    public QClickGameRewardLog(Path<? extends ClickGameRewardLog> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QClickGameRewardLog(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QClickGameRewardLog(PathMetadata metadata, PathInits inits) {
        this(ClickGameRewardLog.class, metadata, inits);
    }

    public QClickGameRewardLog(Class<? extends ClickGameRewardLog> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.clickGame = inits.isInitialized("clickGame") ? new QClickGame(forProperty("clickGame")) : null;
        this.user = inits.isInitialized("user") ? new com.toudeuk.server.domain.user.entity.QUser(forProperty("user")) : null;
    }

}

