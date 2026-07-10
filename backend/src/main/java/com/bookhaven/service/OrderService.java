package com.bookhaven.service;

import com.bookhaven.model.*;
import com.bookhaven.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;

    public OrderService(OrderRepository orderRepository,
                        CartItemRepository cartItemRepository) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Transactional
    public Order placeOrder(Long userId, String shippingAddress) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setShippingAddress(shippingAddress);
        order.setStatus("PENDING");

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem ci : cartItems) {
            Book book = ci.getBook();
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setBookId(book.getId());
            oi.setTitle(book.getTitle());
            oi.setAuthor(book.getAuthor());
            oi.setPrice(book.getPrice());
            oi.setQuantity(ci.getQuantity());
            orderItems.add(oi);
            total = total.add(book.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())));
        }

        order.setTotal(total);
        order.setItems(orderItems);
        Order saved = orderRepository.save(order);

        // Clear cart after successful order
        cartItemRepository.deleteByUserId(userId);

        return saved;
    }

    public List<Order> listOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<Order> getOrder(Long userId, Long orderId) {
        return orderRepository.findById(orderId)
            .filter(o -> o.getUserId().equals(userId));
    }

    public Map<String, Object> getStats(Long userId) {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalOrders", orderRepository.countByUserId(userId));
        stats.put("totalSpent", orderRepository.sumTotalByUserId(userId));
        stats.put("pendingOrders", orderRepository.countPendingByUserId(userId));
        return stats;
    }
}
