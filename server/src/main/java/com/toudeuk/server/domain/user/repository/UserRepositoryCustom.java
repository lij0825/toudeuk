package com.toudeuk.server.domain.user.repository;

import com.toudeuk.server.domain.user.entity.User;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface UserRepositoryCustom {

    List<User> findByNameContaining(String name);

    Optional<User> findByNickname(String nickname);
}