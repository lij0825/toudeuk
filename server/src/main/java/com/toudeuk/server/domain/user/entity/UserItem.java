package com.toudeuk.server.domain.user.entity;

import org.hibernate.annotations.ColumnDefault;

import com.toudeuk.server.core.entity.BaseEntity;
import com.toudeuk.server.domain.item.entity.Item;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserItem extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_items_id", nullable = false)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_user_items_user_id"))
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item_id", nullable = false, foreignKey = @ForeignKey(name = "fk_user_items_item_id"))
	private Item item;

	@Column(name = "is_used", nullable = false)
	@ColumnDefault("false")
	private boolean isUsed;

	public static UserItem create(User user, Item item) {
		UserItem userItem = new UserItem();
		userItem.user = user;
		userItem.item = item;
		userItem.isUsed = false;
		return userItem;
	}

	public void useItem() {
		this.isUsed = true;
	}
}
