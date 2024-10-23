package com.toudeuk.server.domain.user.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.toudeuk.server.domain.user.entity.CashLog;
import com.toudeuk.server.domain.user.event.CashLogEvent;
import com.toudeuk.server.domain.user.repository.CashLogRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CashLogService {

	private final CashLogRepository cashLogRepository;

	@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void CashLogEvent(CashLogEvent event) {

		CashLog cashLog = CashLog.create(
			event.getUser(),
			event.getChangeCash(),
			event.getResultCash(),
			event.getCashName(),
			event.getCashLogType()
		);

		cashLogRepository.save(cashLog);
		
	}

}
