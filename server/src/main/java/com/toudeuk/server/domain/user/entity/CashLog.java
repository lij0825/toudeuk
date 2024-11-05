package com.toudeuk.server.domain.user.entity;

import com.toudeuk.server.core.entity.TimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cash_log")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CashLog extends TimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "cash_log_id", nullable = false)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_cash_log_user_id"))
	private User user;

	@Column(name = "cash_name", nullable = false)
	private String name;

	@Column(name = "change_cash", nullable = false)
	private int changeCash;

	@Column(name = "result_cash", nullable = false)
	private int resultCash;

	@Column(name = "cash_log_type", nullable = false)
	@Enumerated(EnumType.STRING)
	private CashLogType cashLogType;

	public static CashLog create(User user, int changeCash, int resultCash, String name, CashLogType cashLogType) {
		CashLog cashLog = new CashLog();
		cashLog.user = user;
		cashLog.changeCash = changeCash;
		cashLog.resultCash = resultCash;
		cashLog.name = name;
		cashLog.cashLogType = cashLogType;
		return cashLog;
	}

}
