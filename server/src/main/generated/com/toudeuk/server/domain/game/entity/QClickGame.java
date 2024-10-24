package com.toudeuk.server.domain.game.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QClickGame is a Querydsl query type for ClickGame
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QClickGame extends EntityPathBase<ClickGame> {

    private static final long serialVersionUID = 1252049826L;

    public static final QClickGame clickGame = new QClickGame("clickGame");

    public final com.toudeuk.server.core.entity.QTimeEntity _super = new com.toudeuk.server.core.entity.QTimeEntity(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Long> round = createNumber("round", Long.class);

    public QClickGame(String variable) {
        super(ClickGame.class, forVariable(variable));
    }

    public QClickGame(Path<? extends ClickGame> path) {
        super(path.getType(), path.getMetadata());
    }

    public QClickGame(PathMetadata metadata) {
        super(ClickGame.class, metadata);
    }

}

