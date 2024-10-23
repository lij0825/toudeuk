package com.toudeuk.server.domain.item.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.toudeuk.server.domain.item.entity.Item;

public interface ItemRepository extends JpaRepository<Item, Long> {
}
