package com.toudeuk.server.domain.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.toudeuk.server.domain.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
