package com.restaurant.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 订单实体类
 */
@Data
@TableName("orders")
public class Orders implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private String orderNo;

    @TableField(value = "user_id")
    private Long userId;

    @TableField(value = "store_id")
    private Long storeId;

    @TableField(value = "order_type")
    private String orderType;

    @TableField(value = "table_id")
    private Long tableId;

    @TableField(value = "total_amount")
    private BigDecimal totalAmount;

    @TableField(value = "discount_amount")
    private BigDecimal discountAmount;

    @TableField(value = "delivery_fee")
    private BigDecimal deliveryFee;

    @TableField(value = "actual_amount")
    private BigDecimal actualAmount;

    @TableField(value = "pay_method")
    private String payMethod;

    @TableField(value = "pay_status")
    private String payStatus;

    @TableField(value = "order_status")
    private String orderStatus;

    @TableField(value = "contact_name")
    private String contactName;

    @TableField(value = "contact_phone")
    private String contactPhone;

    @TableField(value = "delivery_address")
    private String deliveryAddress;

    @TableField(value = "expected_time")
    private LocalDateTime expectedTime;

    @TableField(value = "actual_time")
    private LocalDateTime actualTime;

    private String remark;

    @TableField(value = "cancel_reason")
    private String cancelReason;

    @TableLogic
    private Integer deleted;

    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
