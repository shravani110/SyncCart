package com.synccart.config;

import com.synccart.model.*;
import com.synccart.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ShoppingRoomRepository roomRepository;
    private final RoomMemberRepository memberRepository;
    private final CartItemRepository cartItemRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ProductRepository productRepository,
                           ShoppingRoomRepository roomRepository,
                           RoomMemberRepository memberRepository,
                           CartItemRepository cartItemRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.roomRepository = roomRepository;
        this.memberRepository = memberRepository;
        this.cartItemRepository = cartItemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedUsers();
        seedProducts();
        seedDemoRoom();
        logger.info("SyncCart database initialization completed successfully!");
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            String encodedPass = passwordEncoder.encode("password123");

            User alice = new User("alice", "alice@example.com", encodedPass, "Alice Chen",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                    Role.ROLE_USER);

            User bob = new User("bob", "bob@example.com", encodedPass, "Bob Smith",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                    Role.ROLE_USER);

            User charlie = new User("charlie", "charlie@example.com", encodedPass, "Charlie Davis",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
                    Role.ROLE_USER);

            User diana = new User("diana", "diana@example.com", encodedPass, "Diana Prince",
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                    Role.ROLE_USER);

            userRepository.saveAll(Arrays.asList(alice, bob, charlie, diana));
            logger.info("Pre-seeded 4 sample demo users (password: password123)");
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            List<Product> products = Arrays.asList(
                    // Electronics
                    new Product("Sony WH-1000XM5 Wireless Headphones", "Electronics",
                            new BigDecimal("349.99"),
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
                            "Industry-leading noise cancellation with two processors and 8 microphones for unparalleled quietness.",
                            4.8, 25),
                    new Product("Keychron K2 Mechanical Keyboard", "Electronics",
                            new BigDecimal("89.99"),
                            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
                            "Wireless mechanical keyboard with RGB backlighting, Mac and Windows layout compatibility.",
                            4.7, 40),
                    new Product("Logitech MX Master 3S Mouse", "Electronics",
                            new BigDecimal("99.99"),
                            "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
                            "Quiet clicks, 8K DPI any-surface tracking, and ultrafast MagSpeed electromagnetic scrolling.",
                            4.9, 35),
                    new Product("Anker 737 Power Bank (24,000mAh)", "Electronics",
                            new BigDecimal("129.99"),
                            "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80",
                            "Ultra-powerful two-way fast charging with 140W max output and smart digital display.",
                            4.6, 50),
                    new Product("JBL Flip 6 Waterproof Speaker", "Electronics",
                            new BigDecimal("119.95"),
                            "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
                            "Bold audio with 2-way speaker system, IP67 waterproof/dustproof, and 12-hour playtime.",
                            4.5, 30),

                    // Groceries & Gourmet
                    new Product("Single-Origin Ethiopian Arabica Coffee (1kg)", "Groceries",
                            new BigDecimal("28.50"),
                            "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80",
                            "Freshly roasted specialty coffee beans with bright floral notes, citrus acidity, and jasmine finish.",
                            4.9, 60),
                    new Product("Organic Extra Virgin Olive Oil (1L)", "Groceries",
                            new BigDecimal("24.99"),
                            "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
                            "First cold-pressed from estate-grown Koroneiki olives with robust peppery finish.",
                            4.7, 80),
                    new Product("Artisan Belgian Dark Chocolate Box (24 pcs)", "Groceries",
                            new BigDecimal("36.00"),
                            "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80",
                            "Handmade pralines and truffles crafted with 72% single-origin cacao and hazelnut praline.",
                            4.8, 45),
                    new Product("Pure Raw Organic Honey (500g)", "Groceries",
                            new BigDecimal("18.75"),
                            "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80",
                            "Unfiltered wildflower honey packed with natural pollen, enzymes, and delicate floral aroma.",
                            4.8, 55),
                    new Product("Matcha Green Tea Ceremonial Grade (100g)", "Groceries",
                            new BigDecimal("32.00"),
                            "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80",
                            "Stone-ground first harvest Uji matcha with rich umami flavor and vibrant jade color.",
                            4.6, 40),

                    // Home & Living
                    new Product("Fellow Stagg EKG Electric Pour-Over Kettle", "Home",
                            new BigDecimal("165.00"),
                            "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80",
                            "Variable temperature control, gooseneck spout for precision flow, and 60-minute hold mode.",
                            4.9, 20),
                    new Product("Minimalist Ceramic Dinnerware Set (16-Piece)", "Home",
                            new BigDecimal("149.99"),
                            "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&auto=format&fit=crop&q=80",
                            "Matte stone glaze ceramic plates, bowls, and mugs for contemporary dinner aesthetics.",
                            4.5, 15),
                    new Product("Ultrasonic Ceramic Essential Oil Diffuser", "Home",
                            new BigDecimal("49.99"),
                            "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80",
                            "Whisper-quiet cold mist humidifier with ambient LED glow and automatic safety shut-off.",
                            4.7, 30),
                    new Product("Cast Iron Dutch Oven 6-Quart", "Home",
                            new BigDecimal("84.99"),
                            "https://images.unsplash.com/photo-1584990347449-3997193c7820?w=600&auto=format&fit=crop&q=80",
                            "Heavy-duty enameled cast iron pot with self-basting lid for perfect stews, soups, and artisan breads.",
                            4.8, 25),

                    // Lifestyle & Fashion
                    new Product("Canvas Weekend Travel Duffle Bag", "Lifestyle",
                            new BigDecimal("79.50"),
                            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
                            "Heavyweight waxed canvas bag with genuine leather straps, shoe compartment, and brass hardware.",
                            4.7, 35),
                    new Product("Stainless Steel Insulated Water Bottle 32oz", "Lifestyle",
                            new BigDecimal("34.99"),
                            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
                            "Double-wall vacuum insulation keeps ice cold for 24 hours or piping hot for 12 hours.",
                            4.9, 90),
                    new Product("Polarized Bamboo Wayfarer Sunglasses", "Lifestyle",
                            new BigDecimal("45.00"),
                            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
                            "Eco-friendly natural bamboo arms with UV400 anti-glare polarized lenses.",
                            4.4, 40)
            );

            productRepository.saveAll(products);
            logger.info("Pre-seeded {} realistic catalog products across 4 categories", products.size());
        }
    }

    private void seedDemoRoom() {
        if (roomRepository.count() == 0) {
            User alice = userRepository.findByUsername("alice").orElse(null);
            User bob = userRepository.findByUsername("bob").orElse(null);

            if (alice != null && bob != null) {
                ShoppingRoom demoRoom = new ShoppingRoom("SYNC99", "Weekend Party & Tech Gear",
                        new BigDecimal("500.00"), alice);
                ShoppingRoom savedRoom = roomRepository.save(demoRoom);

                RoomMember hostMember = new RoomMember(savedRoom, alice, RoomRole.HOST);
                RoomMember guestMember = new RoomMember(savedRoom, bob, RoomRole.MEMBER);
                memberRepository.saveAll(Arrays.asList(hostMember, guestMember));

                // Add sample items
                List<Product> products = productRepository.findAll();
                if (products.size() >= 3) {
                    Product p1 = products.get(0); // Headphones
                    Product p2 = products.get(5); // Coffee
                    Product p3 = products.get(7); // Chocolates

                    CartItem item1 = new CartItem(savedRoom, p1, alice, 1, p1.getPrice());
                    CartItem item2 = new CartItem(savedRoom, p2, bob, 2, p2.getPrice());
                    CartItem item3 = new CartItem(savedRoom, p3, bob, 1, p3.getPrice());

                    cartItemRepository.saveAll(Arrays.asList(item1, item2, item3));
                }

                logger.info("Created pre-seeded collaborative demo room: SYNC99 with Host 'alice' and Member 'bob'");
            }
        }
    }
}
