package com.toudeuk.server.domain.item.entity;

import com.toudeuk.server.core.entity.TimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "item")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Item extends TimeEntity {

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
