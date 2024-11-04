package com.toudeuk.server.domain.user.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.toudeuk.server.domain.user.entity.UserItem;

public interface UserItemRepository extends JpaRepository<UserItem, Long> {

	Optional<List<UserItem>> findByUserId(Long userId);

	Optional<List<UserItem>> findAllByUserId(Long userId);
}
