package com.toudeuk.server.domain.user.entity;

import com.toudeuk.server.core.entity.BaseEntity;
import com.toudeuk.server.domain.item.entity.Item;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_items")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserItem extends BaseEntity {
//    Table user_items {
//        user_items_id bigint [pk, not null]
//        user_id bigint [ref: > users.user_id, unique, not null]
//        item_id bigint [ref: > item.item_id, unique, not null]
//        is_used boolean [default: false,not null]
//            is_deleted boolean [default: false, not null]
//    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ Column(name = "user_items_id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(name = "is_used", nullable = false)
    private boolean isUsed;
}
