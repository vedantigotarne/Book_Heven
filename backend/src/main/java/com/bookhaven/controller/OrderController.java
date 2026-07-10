package com.bookhaven.controller;

import com.bookhaven.model.Order;
import com.bookhaven.service.AuthService;
import com.bookhaven.service.OrderService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;
    private final AuthService authService;

    public OrderController(OrderService orderService, AuthService authService) {
        this.orderService = orderService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> listOrders(HttpSession session) {
        try {
            Long userId = authService.requireUserId(session);
            List<Order> orders = orderService.listOrders(userId);
            return ResponseEntity.ok(orders);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Not authenticated"));
        }
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody Map<String, String> body,
                                        HttpSession session) {
        try {
            Long userId = authService.requireUserId(session);
            String address = body.get("shippingAddress");
            if (address == null || address.isBlank()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Shipping address is required"));
            }
            Order order = orderService.placeOrder(userId, address);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Not authenticated"));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(HttpSession session) {
        try {
            Long userId = authService.requireUserId(session);
            return ResponseEntity.ok(orderService.getStats(userId));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Not authenticated"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable Long id, HttpSession session) {
        try {
            Long userId = authService.requireUserId(session);
            return orderService.getOrder(userId, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Not authenticated"));
        }
    }
}
