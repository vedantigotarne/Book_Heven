package com.bookhaven.controller;

import com.bookhaven.service.AuthService;
import com.bookhaven.service.CartService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;
    private final AuthService authService;

    public CartController(CartService cartService, AuthService authService) {
        this.cartService = cartService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> getCart(HttpSession session) {
        try {
            Long userId = authService.requireUserId(session);
            return ResponseEntity.ok(cartService.getCart(userId));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Not authenticated"));
        }
    }

    @PostMapping("/items")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> body,
                                       HttpSession session) {
        try {
            Long userId   = authService.requireUserId(session);
            Long bookId   = ((Number) body.get("bookId")).longValue();
            int  quantity = ((Number) body.get("quantity")).intValue();
            return ResponseEntity.ok(cartService.addToCart(userId, bookId, quantity));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Not authenticated"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long itemId,
                                            @RequestBody Map<String, Object> body,
                                            HttpSession session) {
        try {
            Long userId   = authService.requireUserId(session);
            int  quantity = ((Number) body.get("quantity")).intValue();
            return ResponseEntity.ok(cartService.updateCartItem(userId, itemId, quantity));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Not authenticated"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<?> removeCartItem(@PathVariable Long itemId,
                                            HttpSession session) {
        try {
            Long userId = authService.requireUserId(session);
            return ResponseEntity.ok(cartService.removeCartItem(userId, itemId));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Not authenticated"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(HttpSession session) {
        try {
            Long userId = authService.requireUserId(session);
            cartService.clearCart(userId);
            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
