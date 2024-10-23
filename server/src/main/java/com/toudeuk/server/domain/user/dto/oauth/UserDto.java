package com.toudeuk.server.domain.user.dto.oauth;


import com.toudeuk.server.domain.user.entity.UserStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {

    private String name;
    private String email;
    private UserStatus userStatus;
}
