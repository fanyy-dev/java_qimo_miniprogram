package com.restaurant.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * 创建订单请求DTO
 */
@Data
public class CreateOrderRequest {
    private Long storeId;
    private String orderType; // DINE_IN, TAKEOUT, RESERVE
    private Long tableId;
    private String contactName;
    private String contactPhone;
    private String deliveryAddress;
    private String remark;
    private List<OrderItemDto> items;
    private Long couponId;

    @Data
    public static class OrderItemDto {
        private String itemType; // DISH, COMBO
        private Long itemId;
        private String itemName;
        private String itemImage;
        private BigDecimal price;
        private Integer quantity;
        private String spec;
    }
}
