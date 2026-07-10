package com.bookhaven;

import com.bookhaven.model.Book;
import com.bookhaven.repository.BookRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final BookRepository bookRepository;

    public DataLoader(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public void run(String... args) {
        if (bookRepository.count() > 0) return; // Skip if already seeded

        List<Book> books = List.of(
            book("The Night Circus", "Erin Morgenstern",
                "A mysterious circus arrives without warning, becoming the venue for a fierce competition between two young magicians.",
                "18.99", "https://covers.openlibrary.org/b/id/8739161-L.jpg", "Fiction", true, 25),

            book("Project Hail Mary", "Andy Weir",
                "A lone astronaut must save the earth from disaster in this gripping tale of science and survival.",
                "16.99", "https://covers.openlibrary.org/b/id/10521270-L.jpg", "Science Fiction", true, 30),

            book("Educated", "Tara Westover",
                "A memoir about a young woman who, kept out of school, leaves her survivalist family and educates herself.",
                "15.99", "https://covers.openlibrary.org/b/id/8739200-L.jpg", "Memoir", true, 20),

            book("The Name of the Wind", "Patrick Rothfuss",
                "The tale of Kvothe — magician, musician, and perhaps the most notorious villain of his age.",
                "17.99", "https://covers.openlibrary.org/b/id/8739161-L.jpg", "Fantasy", true, 18),

            book("Where the Crawdads Sing", "Delia Owens",
                "A mystery set in the marshes of North Carolina where an abandoned girl raises herself.",
                "14.99", "https://covers.openlibrary.org/b/id/10521270-L.jpg", "Mystery", true, 22),

            book("Atomic Habits", "James Clear",
                "An easy and proven way to build good habits and break bad ones.",
                "19.99", "https://covers.openlibrary.org/b/id/8739200-L.jpg", "Self-Help", true, 40),

            book("Sapiens", "Yuval Noah Harari",
                "A brief history of humankind from the Stone Age to the present.",
                "16.99", "https://covers.openlibrary.org/b/id/8739161-L.jpg", "Non-Fiction", false, 15),

            book("The Hitchhiker's Guide to the Galaxy", "Douglas Adams",
                "The classic comic science fiction novel following the adventures of hapless Arthur Dent.",
                "13.99", "https://covers.openlibrary.org/b/id/10521270-L.jpg", "Science Fiction", false, 35),

            book("Normal People", "Sally Rooney",
                "A novel about two people and how love can fundamentally alter who we are.",
                "14.99", "https://covers.openlibrary.org/b/id/8739200-L.jpg", "Fiction", false, 28),

            book("Dune", "Frank Herbert",
                "An epic science fiction novel set on the desert planet Arrakis.",
                "18.99", "https://covers.openlibrary.org/b/id/8739161-L.jpg", "Science Fiction", false, 32),

            book("The Alchemist", "Paulo Coelho",
                "A mystical story about following your dreams and listening to your heart.",
                "12.99", "https://covers.openlibrary.org/b/id/10521270-L.jpg", "Fiction", false, 45),

            book("Gone Girl", "Gillian Flynn",
                "A psychological thriller about a marriage gone terribly, terribly wrong.",
                "13.99", "https://covers.openlibrary.org/b/id/8739200-L.jpg", "Mystery", false, 20),

            book("The Power of Now", "Eckhart Tolle",
                "A guide to spiritual enlightenment through present-moment awareness.",
                "15.99", "https://covers.openlibrary.org/b/id/8739161-L.jpg", "Self-Help", false, 25),

            book("Steve Jobs", "Walter Isaacson",
                "The exclusive biography of Steve Jobs, based on interviews with Jobs himself.",
                "17.99", "https://covers.openlibrary.org/b/id/10521270-L.jpg", "Biography", false, 18),

            book("The Girl with the Dragon Tattoo", "Stieg Larsson",
                "A thriller about a disgraced journalist and a hacker who uncover a decades-old mystery.",
                "14.99", "https://covers.openlibrary.org/b/id/8739200-L.jpg", "Mystery", false, 22),

            book("Thinking, Fast and Slow", "Daniel Kahneman",
                "A groundbreaking study of the two systems that drive the way we think.",
                "16.99", "https://covers.openlibrary.org/b/id/8739161-L.jpg", "Non-Fiction", false, 17)
        );

        bookRepository.saveAll(books);
    }

    private Book book(String title, String author, String description,
                      String price, String imageUrl, String category,
                      boolean featured, int stock) {
        Book b = new Book();
        b.setTitle(title);
        b.setAuthor(author);
        b.setDescription(description);
        b.setPrice(new BigDecimal(price));
        b.setImageUrl(imageUrl);
        b.setCategory(category);
        b.setFeatured(featured);
        b.setStock(stock);
        return b;
    }
}
