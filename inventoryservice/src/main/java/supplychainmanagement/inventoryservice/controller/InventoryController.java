package supplychainmanagement.inventoryservice.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import supplychainmanagement.inventoryservice.dto.InventoryCheckResponse;
import supplychainmanagement.inventoryservice.dto.ProductDTO;
import supplychainmanagement.inventoryservice.dto.ReduceStockRequest;
import supplychainmanagement.inventoryservice.service.ProductService;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@Slf4j
public class InventoryController {

    private final ProductService productService;

    @GetMapping("/{skuCode}")
    public ResponseEntity<InventoryCheckResponse> checkInventory(@PathVariable String skuCode) {
        log.info("Received request to check inventory for SKU: {}", skuCode);
        try {
            InventoryCheckResponse response = productService.checkInventory(skuCode);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error checking inventory for SKU: {}", skuCode, e);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ProductDTO> addProduct(@Valid @RequestBody ProductDTO productDTO) {
        log.info("Received request to add product: {}", productDTO.getSkuCode());
        try {
            ProductDTO createdProduct = productService.addProduct(productDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (Exception e) {
            log.error("Error adding product", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/reduce")
    public ResponseEntity<InventoryCheckResponse> reduceStock(@Valid @RequestBody ReduceStockRequest request) {
        log.info("Received request to reduce stock for SKU: {} by quantity: {}", request.getSkuCode(), request.getQuantity());
        try {
            InventoryCheckResponse response = productService.reduceStock(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error reducing stock for SKU: {}", request.getSkuCode(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}