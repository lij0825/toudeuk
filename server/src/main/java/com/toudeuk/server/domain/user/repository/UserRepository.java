package com.toudeuk.server.domain.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.toudeuk.server.domain.user.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long>, UserRepositoryCustom {

//    @Query("select u from users u where u.email =:email")
    Optional<User> findByEmail(String email);


    Optional<User> findByName(String name);
    List<User> findByNicknameContaining(String nickname);

    @Override
//    @Query("SELECT DISTINCT u FROM users u left join u.toFollowList f on f.toUser.id=u.id WHERE u.nickname = :nickname")
    Optional<User> findByNickname(@Param("nickname") String nickname);
}
