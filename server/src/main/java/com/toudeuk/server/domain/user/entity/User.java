package com.toudeuk.server.domain.user.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.LastModifiedDate;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.toudeuk.server.core.entity.BaseEntity;
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
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
	name = "users",
	uniqueConstraints = {
		@UniqueConstraint(columnNames = "nickname"),
		@UniqueConstraint(columnNames = "email"),
		@UniqueConstraint(columnNames = "phoneNumber")
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

	@Column(name = "password")
	private String password;

	@Column(name = "name")
	private String name;

	@Column(name = "nickname")
	private String nickname;

	@Column(name = "phone_number")
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
	@Column(name = "updated_at")
	@LastModifiedDate
	private LocalDateTime updatedAt;

	@Enumerated(EnumType.STRING)
	private UserStatus userStatus;

	@Column(nullable = false)
	private String username;

	@Column(name = "provider_id", nullable = false)
	private String providerId;


	@Column(name = "provider_type", nullable = false)
	@Enumerated(EnumType.STRING)
	private ProviderType providerType;

	public void updateCash(int cash) {
		this.cash = cash;
	}

	public static User createUser(String username, String name, ProviderType providerType,
								  String providerId) {
		User user = new User();
		user.username = username;
		user.name = name;
		user.email = username;
		user.providerType = providerType;
		user.providerId = providerId;
		return user;
	}
}
