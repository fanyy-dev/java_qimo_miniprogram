package com.restaurant.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 优惠券模板实体类
 */
@Data
@TableName("coupon_template")
public class CouponTemplate implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private String couponName;

    private String couponType;

    private BigDecimal discountValue;

    private BigDecimal minAmount;

    private BigDecimal maxDiscount;

    private Integer totalCount;

    private Integer receivedCount;

    private Integer validDays;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private String description;

    private Integer status;

    @TableLogic
    private Integer deleted;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
