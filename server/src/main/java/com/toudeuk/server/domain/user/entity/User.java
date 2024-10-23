package com.toudeuk.server.domain.user.entity;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.toudeuk.server.core.entity.BaseEntity;
import com.toudeuk.server.core.entity.TimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

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

    @Column(name = "password")
    private String password;

    @Column(name = "name")
    private String name;

    @Column(name = "nickname", nullable = false)
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

    public User update(String name) {
        this.name = name;
        return this;
    }


    @Builder
    public User(Long id, String email, String password, String name, String nickname, String phoneNumber, String profileImg, int cash, RoleType roleType, LocalDateTime updatedAt, UserStatus userStatus) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.nickname = nickname;
        this.phoneNumber = phoneNumber;
        this.profileImg = profileImg;
        this.cash = cash;
        this.roleType = roleType;
        this.updatedAt = updatedAt;
        this.userStatus = userStatus;
    }
}
