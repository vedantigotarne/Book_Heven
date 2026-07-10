package com.bookhaven.service;

import com.bookhaven.model.Book;
import com.bookhaven.model.CartItem;
import com.bookhaven.repository.BookRepository;
import com.bookhaven.repository.CartItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;

    public CartService(CartItemRepository cartItemRepository, BookRepository bookRepository) {
        this.cartItemRepository = cartItemRepository;
        this.bookRepository = bookRepository;
    }

    public Map<String, Object> getCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        return buildCartResponse(items);
    }

    @Transactional
    public Map<String, Object> addToCart(Long userId, Long bookId, int quantity) {
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new NoSuchElementException("Book not found"));

        Optional<CartItem> existing = cartItemRepository.findByUserIdAndBookId(userId, bookId);
        CartItem item;
        if (existing.isPresent()) {
            item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            item = new CartItem();
            item.setUserId(userId);
            item.setBook(book);
            item.setQuantity(quantity);
        }
        cartItemRepository.save(item);
        return getCart(userId);
    }

    @Transactional
    public Map<String, Object> updateCartItem(Long userId, Long itemId, int quantity) {
        CartItem item = cartItemRepository.findById(itemId)
            .orElseThrow(() -> new NoSuchElementException("Cart item not found"));
        if (!item.getUserId().equals(userId)) {
            throw new SecurityException("Forbidden");
        }
        item.setQuantity(quantity);
        cartItemRepository.save(item);
        return getCart(userId);
    }

    @Transactional
    public Map<String, Object> removeCartItem(Long userId, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
            .orElseThrow(() -> new NoSuchElementException("Cart item not found"));
        if (!item.getUserId().equals(userId)) {
            throw new SecurityException("Forbidden");
        }
        cartItemRepository.delete(item);
        return getCart(userId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    private Map<String, Object> buildCartResponse(List<CartItem> items) {
        List<Map<String, Object>> itemDtos = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        int itemCount = 0;

        for (CartItem ci : items) {
            Book b = ci.getBook();
            Map<String, Object> dto = new LinkedHashMap<>();
            dto.put("id", ci.getId());
            dto.put("bookId", b.getId());
            dto.put("title", b.getTitle());
            dto.put("author", b.getAuthor());
            dto.put("price", b.getPrice());
            dto.put("imageUrl", b.getImageUrl());
            dto.put("quantity", ci.getQuantity());
            itemDtos.add(dto);

            total = total.add(b.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())));
            itemCount += ci.getQuantity();
        }

        Map<String, Object> cart = new LinkedHashMap<>();
        cart.put("items", itemDtos);
        cart.put("total", total);
        cart.put("itemCount", itemCount);
        return cart;
    }
}
