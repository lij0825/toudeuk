package com.toudeuk.server.domain.user.repository;


import com.toudeuk.server.core.properties.JwtProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AuthCacheRepository {
    private final RedisTemplate<String, Object> redisTemplate;
    private final JwtProperties properties;

    public void save(String key, Object value) {
        redisTemplate.opsForValue().set(key, value, properties.getRefreshExpire());
    }

    public String findByUsername(String username) {
        return (String) redisTemplate.opsForValue().get(username);
    }

    public boolean existsByUsername(String username) {
        return redisTemplate.opsForValue().get(username) != null;
    }
}
