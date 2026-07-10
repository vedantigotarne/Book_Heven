package com.bookhaven.repository;

import com.bookhaven.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByFeaturedTrue();

    @Query("""
        SELECT b FROM Book b
        WHERE (:search IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%'))
                               OR LOWER(b.author) LIKE LOWER(CONCAT('%', :search, '%')))
          AND (:category IS NULL OR b.category = :category)
          AND (:minPrice IS NULL OR b.price >= :minPrice)
          AND (:maxPrice IS NULL OR b.price <= :maxPrice)
        """)
    Page<Book> findWithFilters(
        @Param("search") String search,
        @Param("category") String category,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        Pageable pageable
    );

    @Query("SELECT DISTINCT b.category FROM Book b ORDER BY b.category")
    List<String> findAllCategories();

    @Query("SELECT COUNT(b) FROM Book b")
    long countAll();

    @Query("SELECT COUNT(DISTINCT b.category) FROM Book b")
    long countCategories();

    @Query("SELECT MIN(b.price) FROM Book b")
    BigDecimal findMinPrice();

    @Query("SELECT MAX(b.price) FROM Book b")
    BigDecimal findMaxPrice();
}
