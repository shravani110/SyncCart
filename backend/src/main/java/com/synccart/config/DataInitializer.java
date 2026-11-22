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
        boolean needsReseed = productRepository.count() != 29 ||
                productRepository.findAll().stream().anyMatch(p -> !p.getImageUrl().startsWith("/images/products/"));

        if (needsReseed) {
            cartItemRepository.deleteAll();
            productRepository.deleteAll();

            List<Product> products = Arrays.asList(
                    // === Groceries (The 10 Reference Products) ===
                    new Product("Apples", "Groceries",
                            new BigDecimal("180.00"),
                            "/images/products/apples.jpg",
                            "Crisp, sweet, and juicy farm-fresh red apples rich in dietary fiber, vitamins, and essential antioxidants.",
                            4.9, 100, "1kg"),

                    new Product("Milk", "Groceries",
                            new BigDecimal("70.00"),
                            "/images/products/milk.jpg",
                            "Farm-fresh pasteurized rich dairy milk, wholesome and nourishing for daily family breakfast and tea.",
                            4.8, 120, "2 packs"),

                    new Product("Bread", "Groceries",
                            new BigDecimal("55.00"),
                            "/images/products/bread.jpg",
                            "Soft, oven-fresh sliced artisan sandwich bread baked daily with wholesome whole golden wheat.",
                            4.7, 80, "1 pack"),

                    new Product("Eggs", "Groceries",
                            new BigDecimal("95.00"),
                            "/images/products/eggs.jpg",
                            "Farm-fresh organic grade-A eggs packed with high-quality protein, omega-3, and vital nutrients.",
                            4.9, 90, "12 pcs"),

                    new Product("Rice", "Groceries",
                            new BigDecimal("650.00"),
                            "/images/products/rice.jpg",
                            "Premium aged long-grain aromatic rice, perfect for royal biryanis, pulavs, and comforting home meals.",
                            4.9, 60, "5kg"),

                    new Product("Coffee", "Groceries",
                            new BigDecimal("320.00"),
                            "/images/products/coffee.jpg",
                            "Freshly roasted and ground aromatic specialty dark roast coffee with rich chocolatey notes and velvety crema.",
                            4.8, 75, "250g"),

                    new Product("Tomatoes", "Groceries",
                            new BigDecimal("90.00"),
                            "/images/products/tomatoes.jpg",
                            "Vine-ripened bright red juicy farm-fresh tomatoes, rich in vitamin C and authentic culinary flavor.",
                            4.7, 110, "1kg"),

                    new Product("Bananas", "Groceries",
                            new BigDecimal("65.00"),
                            "/images/products/bananas.jpg",
                            "Naturally ripened golden Cavendish sweet bananas, high in potassium and instant wholesome energy.",
                            4.8, 85, "1 dozen"),

                    new Product("Biscuits", "Groceries",
                            new BigDecimal("45.00"),
                            "/images/products/biscuits.jpg",
                            "Crisp, buttery golden baked tea biscuits, the beloved crunchy companion for evening chai and coffee.",
                            4.7, 150, "1 pack"),

                    new Product("Yogurt", "Groceries",
                            new BigDecimal("85.00"),
                            "/images/products/yogurt.jpg",
                            "Creamy and smooth traditional probiotic set curd yogurt, cool, refreshing, and great for daily digestion.",
                            4.9, 95, "900gms"),

                    // === Home (Furniture, Tables, Fans, Kitchenware) ===
                    new Product("Solid Sheesham Wood 6-Seater Dining Table", "Home",
                            new BigDecimal("16999.00"),
                            "/images/products/dining_table.jpg",
                            "Handcrafted premium solid Sheesham wood dining table with natural walnut grain and durable honey teak finish.",
                            4.9, 15, "1 table"),

                    new Product("3-Door Engineered Wood Wardrobe Cupboard with Mirror", "Home",
                            new BigDecimal("18499.00"),
                            "/images/products/wardrobe.jpg",
                            "Spacious three-door bedroom wardrobe cupboard with built-in dressing mirror, hanger rail, and secure lockable drawers.",
                            4.8, 12, "1 unit"),

                    new Product("Havells High-Speed 3-Blade Aerodynamic Ceiling Fan", "Home",
                            new BigDecimal("3499.00"),
                            "/images/products/ceiling_fan.jpg",
                            "Energy-efficient 1200mm high-delivery ceiling fan with metallic rust-proof finish and whisper-quiet motor.",
                            4.8, 40, "1 fan"),

                    new Product("Oscillating Standing Tower Cooling Fan with LED Display", "Home",
                            new BigDecimal("3899.00"),
                            "/images/products/standing_fan.jpg",
                            "Slim modern oscillating cooling tower fan with touch LED temperature display, 3 speed modes, and wireless remote.",
                            4.6, 28, "1 fan"),

                    new Product("Ergonomic Computer Study Desk Table with Cable Grommets", "Home",
                            new BigDecimal("6499.00"),
                            "/images/products/study_desk.jpg",
                            "Wide study and office computer desk with built-in cable management grommets and bottom utility CPU/book shelf.",
                            4.7, 20, "1 desk"),

                    new Product("Solid Teak Wood 2-Drawer Bedside Table Nightstand", "Home",
                            new BigDecimal("2999.00"),
                            "/images/products/bedside_table.jpg",
                            "Compact elegant solid wood nightstand with two soft-glide drawers for books, bedside lamps, and personal essentials.",
                            4.8, 35, "1 unit"),

                    new Product("Precision Gooseneck Electric Fast-Boil Kettle (1.7L)", "Home",
                            new BigDecimal("3499.00"),
                            "/images/products/electric_kettle.jpg",
                            "Modern sleek matte electric kettle with precision pour spout, ergonomic handle, and automatic safety shut-off.",
                            4.8, 30, "1 kettle"),

                    new Product("Heavy Enameled Cast Iron Dutch Oven Pot (6-Quart)", "Home",
                            new BigDecimal("3299.00"),
                            "/images/products/dutch_oven.jpg",
                            "Vibrant cobalt blue enameled cast iron Dutch oven with self-basting lid for stews, curries, and artisan sourdough bread.",
                            4.9, 25, "1 pot"),

                    // === Lifestyle (Beds, Mattresses, Bedding, Ergonomic Chairs) ===
                    new Product("Queen Size Solid Wood Platform Bed with Storage", "Lifestyle",
                            new BigDecimal("14999.00"),
                            "/images/products/platform_bed.jpg",
                            "Contemporary solid pine wood platform bed frame with integrated hydraulic under-bed storage compartments.",
                            4.9, 10, "1 bed"),

                    new Product("Orthopedic Memory Foam King Size Mattress (8-Inch)", "Lifestyle",
                            new BigDecimal("12499.00"),
                            "/images/products/mattress.jpg",
                            "Zero-motion transfer dual-comfort memory foam mattress engineered for spine alignment and restorative deep sleep.",
                            4.8, 18, "1 mattress"),

                    new Product("100% Egyptian Cotton Luxury Bed Sheet Set", "Lifestyle",
                            new BigDecimal("1899.00"),
                            "/images/products/bedsheet.jpg",
                            "Ultra-soft 400 thread-count breathable satin-finish luxury bed sheet set with two matching pillow covers.",
                            4.8, 55, "1 set"),

                    new Product("High-Back Breathable Ergonomic Mesh Office Chair", "Lifestyle",
                            new BigDecimal("8999.00"),
                            "/images/products/office_chair.jpg",
                            "Multi-adjustable ergonomic desk chair with responsive lumbar support, 3D armrests, and pneumatic height tilt.",
                            4.9, 22, "1 chair"),

                    // === Electronics ===
                    new Product("Sony WH-1000XM5 Wireless Noise-Cancelling Headphones", "Electronics",
                            new BigDecimal("26990.00"),
                            "/images/products/headphones.jpg",
                            "Industry-leading active noise canceling with 8 microphones, 30-hour battery life, and crystal-clear hands-free calling.",
                            4.9, 35, "1 unit"),

                    new Product("Samsung 27-inch 4K UHD IPS Frameless Monitor", "Electronics",
                            new BigDecimal("22499.00"),
                            "/images/products/monitor.jpg",
                            "Crisp 3840x2160 IPS panel with HDR10, USB-C 65W charging connectivity, and height-adjustable stand.",
                            4.8, 25, "1 monitor"),

                    new Product("Apple Watch Series 9 GPS Smart Fitness Watch", "Electronics",
                            new BigDecimal("38900.00"),
                            "/images/products/smartwatch.jpg",
                            "Advanced health tracking with blood oxygen sensor, ECG app, always-on Retina display, and fast S9 chip.",
                            4.8, 40, "1 watch"),

                    new Product("Keychron Wireless Mechanical Keyboard", "Electronics",
                            new BigDecimal("7499.00"),
                            "/images/products/keyboard.jpg",
                            "Compact layout with tactile responsive switches, Mac/Windows compatibility, and long-lasting wireless battery.",
                            4.8, 50, "1 keyboard"),

                    new Product("Logitech MX Master 3S Ergonomic Wireless Mouse", "Electronics",
                            new BigDecimal("8995.00"),
                            "/images/products/mouse.jpg",
                            "Quiet clicks, 8K DPI track-on-glass optical sensor, and ultrafast MagSpeed electromagnetic scroll wheel.",
                            4.9, 45, "1 mouse"),

                    new Product("Edifier Studio Bluetooth Bookshelf Speakers", "Electronics",
                            new BigDecimal("8999.00"),
                            "/images/products/speaker.jpg",
                            "Rich room-filling stereo sound, dual aux/bluetooth inputs, calibrated bass port, and wooden enclosure.",
                            4.8, 50, "1 pair"),

                    new Product("Fast-Charging 20,800mAh High-Capacity Power Bank", "Electronics",
                            new BigDecimal("3499.00"),
                            "/images/products/powerbank.jpg",
                            "Multi-port fast charging with Power Delivery, dual USB-A, USB-C input/output, and sturdy metal chassis.",
                            4.7, 60, "1 unit")
            );

            productRepository.saveAll(products);
            logger.info("Pre-seeded exactly {} products across all categories (Groceries, Home, Lifestyle, Electronics)", products.size());
        }
    }

    private void seedDemoRoom() {
        if (roomRepository.count() == 0) {
            User alice = userRepository.findByUsername("alice").orElse(null);
            User bob = userRepository.findByUsername("bob").orElse(null);

            if (alice != null && bob != null) {
                ShoppingRoom demoRoom = new ShoppingRoom("SYNC99", "Weekend Party & Tech Gear",
                        new BigDecimal("25000.00"), alice);
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
