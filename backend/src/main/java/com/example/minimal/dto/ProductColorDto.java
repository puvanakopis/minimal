package com.example.minimal.dto;

import com.example.minimal.model.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductColorDto {
    private String id;
    private String name;
    private String hex;

    public static ProductColorDto fromEntity(Product.ProductColor entity) {
        if (entity == null) return null;
        return ProductColorDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .hex(entity.getHex())
                .build();
    }

    public Product.ProductColor toEntity() {
        return Product.ProductColor.builder()
                .id(this.id)
                .name(this.name)
                .hex(this.hex)
                .build();
    }
}
