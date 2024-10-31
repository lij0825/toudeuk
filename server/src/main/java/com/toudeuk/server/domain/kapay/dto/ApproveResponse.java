package com.toudeuk.server.domain.kapay.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApproveResponse {

	private String aid;
	private String tid;
	private String cid;
	private String sid;
	private String partnerOrderId;
	private String partnerUserId;
	private String itemName;
	private String itemCode;
	private String payload;
	private Integer quantity;
	private Amount amount;
	private String paymentMethodType;
	private String cardInfo;
	private String sequentialPaymentMethods;
	private String createdAt;
	private String approvedAt;

	@JsonCreator
	public ApproveResponse(
		@JsonProperty("aid") String aid,
		@JsonProperty("tid") String tid,
		@JsonProperty("cid") String cid,
		@JsonProperty("sid") String sid,
		@JsonProperty("partner_order_id") String partnerOrderId,
		@JsonProperty("partner_user_id") String partnerUserId,
		@JsonProperty("item_name") String itemName,
		@JsonProperty("item_code") String itemCode,
		@JsonProperty("payload") String payload,
		@JsonProperty("quantity") Integer quantity,
		@JsonProperty("amount") Amount amount,
		@JsonProperty("payment_method_type") String paymentMethodType,
		@JsonProperty("card_info") String cardInfo,
		@JsonProperty("sequential_payment_methods") String sequentialPaymentMethods,
		@JsonProperty("created_at") String createdAt,
		@JsonProperty("approved_at") String approvedAt
	) {
		this.aid = aid;
		this.tid = tid;
		this.cid = cid;
		this.sid = sid;
		this.partnerOrderId = partnerOrderId;
		this.partnerUserId = partnerUserId;
		this.itemName = itemName;
		this.itemCode = itemCode;
		this.payload = payload;
		this.quantity = quantity;
		this.amount = amount;
		this.paymentMethodType = paymentMethodType;
		this.cardInfo = cardInfo;
		this.sequentialPaymentMethods = sequentialPaymentMethods;
		this.createdAt = createdAt;
		this.approvedAt = approvedAt;
	}

	@Data
	@Builder
	public static class Amount {
		private Integer total;
		private Integer taxFree;
		private Integer vat;
		private Integer point;
		private Integer discount;
		private Integer greenDeposit;

		@JsonCreator
		public Amount(
			@JsonProperty("total") Integer total,
			@JsonProperty("tax_free") Integer taxFree,
			@JsonProperty("vat") Integer vat,
			@JsonProperty("point") Integer point,
			@JsonProperty("discount") Integer discount,
			@JsonProperty("green_deposit") Integer greenDeposit
		) {
			this.total = total;
			this.taxFree = taxFree;
			this.vat = vat;
			this.point = point;
			this.discount = discount;
			this.greenDeposit = greenDeposit;
		}
	}
}
