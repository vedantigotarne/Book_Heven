package com.bookhaven.service;

import com.bookhaven.model.Book;
import com.bookhaven.repository.BookRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> getFeaturedBooks() {
        return bookRepository.findByFeaturedTrue();
    }

    public Page<Book> searchBooks(String search, String category,
                                   BigDecimal minPrice, BigDecimal maxPrice,
                                   int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        String s = (search != null && search.isBlank()) ? null : search;
        String c = (category != null && category.isBlank()) ? null : category;
        return bookRepository.findWithFilters(s, c, minPrice, maxPrice, pageable);
    }

    public List<String> getCategories() {
        return bookRepository.findAllCategories();
    }

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBooks", bookRepository.countAll());
        stats.put("totalCategories", bookRepository.countCategories());
        stats.put("minPrice", bookRepository.findMinPrice());
        stats.put("maxPrice", bookRepository.findMaxPrice());
        return stats;
    }

    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }
}
