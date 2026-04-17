
package supplychainmanagement.inventoryservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "SKU Code is required")
    @Column(unique = true, nullable = false)
    private String skuCode;

    @NotBlank(message = "Product name is required")
    @Column(nullable = false)
    private String name;

    @Positive(message = "Price must be greater than 0")
    @Column(nullable = false)
    private Double price;

    @Positive(message = "Stock quantity must be greater than or equal to 0")
    @Column(nullable = false)
    private Integer stockQuantity;
}
