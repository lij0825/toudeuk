package com.toudeuk.server.domain.user.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.LastModifiedDate;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.toudeuk.server.core.entity.TimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
	name = "users",
	uniqueConstraints = {
		@UniqueConstraint(columnNames = {"nickName", "email", "phoneNumber"})
	},
	indexes = {
		@Index(columnList = "email"),
	}
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends TimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id", nullable = false)
	private Long id;

	@Column(name = "email", nullable = false)
	private String email;

	@Column(name = "password", nullable = false)
	private String password;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "nick_name", nullable = false)
	private String nickName;

	@Column(name = "phone_number", nullable = false)
	private String phoneNumber;

	@Column(name = "profile_img")
	private String profileImg;

	@Column(name = "cash", nullable = false)
	@ColumnDefault("0")
	private int cash = 0;

	@Column(name = "role_type", nullable = false)
	@Enumerated(EnumType.STRING)
	private RoleType roleType = RoleType.USER;

	@JsonSerialize(using = LocalDateTimeSerializer.class)
	@JsonDeserialize(using = LocalDateTimeDeserializer.class)
	@Column(name = "updated_at", nullable = false)
	@LastModifiedDate
	private LocalDateTime updatedAt;

	public void updateCash(int cash) {
		this.cash = cash;
	}

}
