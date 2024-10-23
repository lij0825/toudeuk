package com.toudeuk.server.domain.user.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QCashLog is a Querydsl query type for CashLog
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCashLog extends EntityPathBase<CashLog> {

    private static final long serialVersionUID = -1325353440L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QCashLog cashLog = new QCashLog("cashLog");

    public final com.toudeuk.server.core.entity.QTimeEntity _super = new com.toudeuk.server.core.entity.QTimeEntity(this);

    public final EnumPath<CashLogType> cashLogType = createEnum("cashLogType", CashLogType.class);

    public final NumberPath<Integer> changeCash = createNumber("changeCash", Integer.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath name = createString("name");

    public final NumberPath<Integer> resultCash = createNumber("resultCash", Integer.class);

    public final QUser user;

    public QCashLog(String variable) {
        this(CashLog.class, forVariable(variable), INITS);
    }

    public QCashLog(Path<? extends CashLog> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QCashLog(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QCashLog(PathMetadata metadata, PathInits inits) {
        this(CashLog.class, metadata, inits);
    }

    public QCashLog(Class<? extends CashLog> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user")) : null;
    }

}

