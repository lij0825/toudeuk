package com.toudeuk.server.domain.item.entity;

import com.toudeuk.server.core.entity.TimeEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;

import java.time.LocalDateTime;


@Entity
@Table(name = "item")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Item extends TimeEntity {
//    item_id bigint [pk, not null]
//    item_name varchar(255) [not null]
//    item_image varchar(255)
//    item_price int [not null]
//    created_at timestamp(6) [not null]

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id", nullable = false)
    private Long id;


    @Column(name = "item_name", nullable = false)
    private String name;

    @Column(name = "item_image")
    private String image;

    @Column(name = "item_price", nullable = false)
    private int price;

}
