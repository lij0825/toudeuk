package com.toudeuk.server.domain.game.controller;

import com.toudeuk.server.core.response.SuccessResponse;
import com.toudeuk.server.domain.game.repository.ClickCacheRepository;
import com.toudeuk.server.domain.game.service.ClickGameService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping(value = "/api/v1/game")
@RequiredArgsConstructor
@Tag(name = "게임", description = "게임 관련 API")
public class ClickGameController {

    private final ClickGameService clickGameService;
    private final ClickCacheRepository clickCacheRepository;

    /**
     * 사용자 클릭
     * @param userId
     * @return {@link SuccessResponse <Void>}
     */
    @PostMapping(value = "/click")
    @Operation(summary = "클릭", description = "버튼을 클릭합니다.")
    public SuccessResponse<Void> click(@RequestParam Long userId) {
        clickGameService.clickButton(userId);
        return SuccessResponse.empty();
    }



}

