package supplychainmanagement.inventoryservice.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import supplychainmanagement.inventoryservice.dto.InventoryCheckResponse;
import supplychainmanagement.inventoryservice.dto.ProductDTO;
import supplychainmanagement.inventoryservice.dto.ReduceStockRequest;
import supplychainmanagement.inventoryservice.entity.Product;
import supplychainmanagement.inventoryservice.repository.ProductRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;

    public InventoryCheckResponse checkInventory(String skuCode) {
        log.info("Checking inventory for SKU: {}", skuCode);
        return productRepository.findBySkuCode(skuCode)
                .map(product -> new InventoryCheckResponse(
                        product.getSkuCode(),
                        product.getStockQuantity() > 0,
                        product.getStockQuantity()
                ))
                .orElseThrow(() -> {
                    log.warn("Product not found for SKU: {}", skuCode);
                    return new RuntimeException("Product not found for SKU: " + skuCode);
                });
    }

    @Transactional
    public ProductDTO addProduct(ProductDTO productDTO) {
        log.info("Adding new product: {}", productDTO.getSkuCode());
        Product product = new Product();
        product.setSkuCode(productDTO.getSkuCode());
        product.setName(productDTO.getName());
        product.setPrice(productDTO.getPrice());
        product.setStockQuantity(productDTO.getStockQuantity());

        Product savedProduct = productRepository.save(product);
        return mapToDTO(savedProduct);
    }

    @Transactional
    public InventoryCheckResponse reduceStock(ReduceStockRequest request) {
        log.info("Reducing stock for SKU: {} by quantity: {}", request.getSkuCode(), request.getQuantity());
        Product product = productRepository.findBySkuCode(request.getSkuCode())
                .orElseThrow(() -> new RuntimeException("Product not found for SKU: " + request.getSkuCode()));

        if (product.getStockQuantity() < request.getQuantity()) {
            log.warn("Insufficient stock for SKU: {}", request.getSkuCode());
            throw new RuntimeException("Insufficient stock for SKU: " + request.getSkuCode());
        }

        product.setStockQuantity(product.getStockQuantity() - request.getQuantity());
        productRepository.save(product);

        log.info("Stock reduced successfully for SKU: {}", request.getSkuCode());
        return new InventoryCheckResponse(
                product.getSkuCode(),
                product.getStockQuantity() > 0,
                product.getStockQuantity()
        );
    }

    private ProductDTO mapToDTO(Product product) {
        return new ProductDTO(
                product.getId(),
                product.getSkuCode(),
                product.getName(),
                product.getPrice(),
                product.getStockQuantity()
        );
    }
}