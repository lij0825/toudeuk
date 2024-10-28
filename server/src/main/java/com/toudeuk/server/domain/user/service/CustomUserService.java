package com.toudeuk.server.domain.user.service;

import com.toudeuk.server.core.exception.BaseException;
import com.toudeuk.server.core.exception.ErrorCode;
import com.toudeuk.server.domain.user.entity.User;
import com.toudeuk.server.domain.user.repository.UserRepository;
import com.toudeuk.server.domain.user.response.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("------------------------------------------------------------------------------------------ loadUserByUsername 실행 ------------------------------------------------------------------------------------------");
        User user = userRepository.findByUsername(username).orElseThrow();
//        return new CustomOAuth2User(user)
        return null;
    }

//    @Bean
//    public Function<UserDetails, User> fetchUser() {
//
//        log.info("------------------------------------------------------------------------------------------ fetchUser 실행 ------------------------------------------------------------------------------------------")
//
//        return userDetails -> userRepository.findByUsername(userDetails.getUsername()).orElseThrow(
//                () -> new BaseException(ErrorCode.USER_NOT_FOUND)
//        );
//    }

    @Bean
    public Function<UserDetails, Long> fetchUser() {
        return userDetails -> Long.parseLong(userDetails.getUsername());
    }

}
