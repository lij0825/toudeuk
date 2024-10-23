package com.toudeuk.server.domain.user.service;

import com.toudeuk.server.core.exception.ErrorCode;
import com.toudeuk.server.core.jwt.TokenProvider;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final TokenProvider tokenProvider;

    public List<User> findAll() {

        return userRepository.findAll();
    }

//    public Long save(AddUserRequest dto) {
//        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
//
//        return userRepository.save(User.builder()
//                .email(dto.getEmail())
//                .password(encoder.encode(dto.getPassword()))
//                .build()).getId();
//    }

    public User findById(Long id) {

        User findUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_EXISTS.getMessage()));

        return findUser;
    }

    public User findByEmail(String email) {

        log.info("find by email: {}", email);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Unexpected user"));
    }

    public boolean findByNickname(String nickName) {
        log.info("find by nickname: {}", nickName);

        Optional<User> findUser = userRepository.findByNickname(nickName);

        return findUser.isEmpty();
    }

    // find user list by name field
    public List<User> findByNameContaining(String name) {

        List<User> findUserList = userRepository.findByNameContaining(name);

        if (findUserList.isEmpty())
            throw new EntityNotFoundException(ErrorCode.USER_NOT_EXISTS.getMessage());

        return findUserList;
    }

    public Long findUserIdByToken(String token) {

        Long userId = tokenProvider.getUserId(token);

        return userId;
    }

}
