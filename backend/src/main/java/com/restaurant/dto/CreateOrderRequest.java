package com.restaurant.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * 创建订单请求DTO
 */
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

    public static class OrderItemDto {
        private String itemType; // DISH, COMBO
        private Long itemId;
        private String itemName;
        private String itemImage;
        private BigDecimal price;
        private Integer quantity;
        private String spec;
        
        // Getters and Setters
        public String getItemType() {
            return itemType;
        }
        
        public void setItemType(String itemType) {
            this.itemType = itemType;
        }
        
        public Long getItemId() {
            return itemId;
        }
        
        public void setItemId(Long itemId) {
            this.itemId = itemId;
        }
        
        public String getItemName() {
            return itemName;
        }
        
        public void setItemName(String itemName) {
            this.itemName = itemName;
        }
        
        public String getItemImage() {
            return itemImage;
        }
        
        public void setItemImage(String itemImage) {
            this.itemImage = itemImage;
        }
        
        public BigDecimal getPrice() {
            return price;
        }
        
        public void setPrice(BigDecimal price) {
            this.price = price;
        }
        
        public Integer getQuantity() {
            return quantity;
        }
        
        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
        
        public String getSpec() {
            return spec;
        }
        
        public void setSpec(String spec) {
            this.spec = spec;
        }
    }
    
    // Getters and Setters
    public Long getStoreId() {
        return storeId;
    }
    
    public void setStoreId(Long storeId) {
        this.storeId = storeId;
    }
    
    public String getOrderType() {
        return orderType;
    }
    
    public void setOrderType(String orderType) {
        this.orderType = orderType;
    }
    
    public Long getTableId() {
        return tableId;
    }
    
    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }
    
    public String getContactName() {
        return contactName;
    }
    
    public void setContactName(String contactName) {
        this.contactName = contactName;
    }
    
    public String getContactPhone() {
        return contactPhone;
    }
    
    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }
    
    public String getDeliveryAddress() {
        return deliveryAddress;
    }
    
    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }
    
    public String getRemark() {
        return remark;
    }
    
    public void setRemark(String remark) {
        this.remark = remark;
    }
    
    public List<OrderItemDto> getItems() {
        return items;
    }
    
    public void setItems(List<OrderItemDto> items) {
        this.items = items;
    }
    
    public Long getCouponId() {
        return couponId;
    }
    
    public void setCouponId(Long couponId) {
        this.couponId = couponId;
    }
}