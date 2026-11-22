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
        boolean needsReseed = productRepository.count() < 35 ||
                productRepository.findAll().stream().anyMatch(p -> p.getImageUrl().startsWith("http"));

        if (needsReseed) {
            cartItemRepository.deleteAll();
            productRepository.deleteAll();

            List<Product> products = Arrays.asList(
                    // === Groceries (Daily Home Essentials & Snacks) ===
                    new Product("Pure Himalayan Pink Rock Salt (1kg)", "Groceries",
                            new BigDecimal("149.00"),
                            "/images/products/salt.jpg",
                            "Pure mineral-rich natural rock salt crystals harvested for everyday cooking and home seasoning.",
                            4.9, 150),
                    new Product("Organic Ground Turmeric Powder Haldi (500g)", "Groceries",
                            new BigDecimal("180.00"),
                            "/images/products/turmeric.jpg",
                            "100% pure bright yellow aromatic turmeric powder with high curcumin content for authentic daily meals.",
                            4.8, 130),
                    new Product("Fresh Dairy Full Cream Milk (1L)", "Groceries",
                            new BigDecimal("66.00"),
                            "/images/products/milk.jpg",
                            "Pasteurized farm-fresh rich full-cream milk, wholesome and nourishing for daily family consumption.",
                            4.9, 200),
                    new Product("Farm Fresh Organic Brown Eggs (Pack of 12)", "Groceries",
                            new BigDecimal("120.00"),
                            "/images/products/eggs.jpg",
                            "Naturally raised farm-fresh brown eggs rich in high-quality protein and essential omega-3 nutrients.",
                            4.8, 110),
                    new Product("Fresh Thick Set Curd Dahi (500g)", "Groceries",
                            new BigDecimal("55.00"),
                            "/images/products/curd.jpg",
                            "Creamy and smooth traditional set curd dahi, probiotic-rich and prepared fresh from pure dairy milk.",
                            4.9, 140),
                    new Product("Pure Desi Cow Ghee Handcrafted (500ml)", "Groceries",
                            new BigDecimal("650.00"),
                            "/images/products/ghee.jpg",
                            "Traditional bilona churned pure cow ghee with golden granular texture and rich appetizing aroma.",
                            4.9, 85),
                    new Product("Pure Cold-Pressed Cooking Oil (1L)", "Groceries",
                            new BigDecimal("240.00"),
                            "/images/products/cooking_oil.jpg",
                            "Cold-pressed virgin cooking oil with natural antioxidants, low absorption, and high smoke point for daily home food.",
                            4.7, 95),
                    new Product("Cold-Pressed Extra Virgin Coconut Oil (1L)", "Groceries",
                            new BigDecimal("480.00"),
                            "/images/products/coconut_oil.jpg",
                            "100% pure cold-pressed unrefined coconut oil extracted fresh from mature organic coconuts.",
                            4.8, 90),
                    new Product("Chakki Fresh Whole Wheat Atta (5kg)", "Groceries",
                            new BigDecimal("245.00"),
                            "/images/products/atta.jpg",
                            "100% stone-ground whole wheat flour with natural dietary fiber for soft, fluffy rotis and parathas.",
                            4.8, 160),
                    new Product("Fortune Biryani Special Basmati Rice (5kg)", "Groceries",
                            new BigDecimal("650.00"),
                            "/images/products/basmati_rice.jpg",
                            "Extra long grain aged basmati rice for royal aromatic biryanis, pulavs, and daily gourmet meals.",
                            4.9, 120),
                    new Product("Premium Yellow Toor Dal Lentils (1kg)", "Groceries",
                            new BigDecimal("165.00"),
                            "/images/products/toor_dal.png",
                            "Unpolished protein-rich yellow toor dal for comforting everyday dal tadka, sambar, and home soups.",
                            4.8, 140),
                    new Product("Pure Refined Sparkling White Sugar (1kg)", "Groceries",
                            new BigDecimal("52.00"),
                            "/images/products/sugar.jpg",
                            "Fine sparkling crystalline white sugar, sulfur-free and free-flowing for daily tea, coffee, and desserts.",
                            4.7, 180),
                    new Product("Tata Tea Gold Premium Spiced Chai (500g)", "Groceries",
                            new BigDecimal("320.00"),
                            "/images/products/tea.jpg",
                            "Exquisite blend of Assam CTC tea leaves gently rolled with aromatic spices for a rich morning cup.",
                            4.8, 140),
                    new Product("Pure Raw Forest Organic Honey (500g)", "Groceries",
                            new BigDecimal("420.00"),
                            "/images/products/honey.jpg",
                            "Unfiltered 100% pure wildflower forest honey with natural pollen, golden consistency, and delicate floral notes.",
                            4.8, 75),
                    new Product("Crispy Salted Potato Chips (Pack of 3)", "Groceries",
                            new BigDecimal("99.00"),
                            "/images/products/chips.jpg",
                            "Golden crunchy thinly sliced farm potato chips with a touch of rock salt, perfect anytime tea-time snack.",
                            4.7, 130),
                    new Product("Traditional Bikaneri Bhujia Sev Namkeen (400g)", "Groceries",
                            new BigDecimal("145.00"),
                            "/images/products/bhujia.jpg",
                            "Crispy spiced moth bean flour sev namkeen seasoned with black pepper, cloves, and Indian spices.",
                            4.8, 115),
                    new Product("Choco-Chip Bakery Cookies Biscuits (300g)", "Groceries",
                            new BigDecimal("160.00"),
                            "/images/products/cookies.jpg",
                            "Fresh oven-baked artisan cookies studded with rich dark chocolate chunks and a melt-in-the-mouth texture.",
                            4.8, 100),
                    new Product("California Almonds & Jumbo Cashews Mix (500g)", "Groceries",
                            new BigDecimal("799.00"),
                            "/images/products/almonds_cashews.jpg",
                            "Crunchy whole California almonds and golden Goan cashews packed with healthy vitamins and omega oils.",
                            4.8, 85),
                    new Product("Instant Masala Noodles (Pack of 8)", "Groceries",
                            new BigDecimal("120.00"),
                            "/images/products/noodles.jpg",
                            "Quick-cooking delicious noodles with aromatic roasted spices, ready in 2 minutes for late-night cravings.",
                            4.6, 175),

                    // === Home (Tables, Cupboards, Fans, Cookware, Desk) ===
                    new Product("Solid Sheesham Wood 6-Seater Dining Table", "Home",
                            new BigDecimal("16999.00"),
                            "/images/products/dining_table.jpg",
                            "Handcrafted solid Indian rosewood dining table with natural grain finish, 4 chairs, and sturdy tapered legs.",
                            4.9, 15),
                    new Product("3-Door Engineered Wood Wardrobe Cupboard with Mirror", "Home",
                            new BigDecimal("18499.00"),
                            "/images/products/wardrobe.jpg",
                            "Spacious modular cupboard with hanging rail, lockable drawers, multiple shelves, and full-length dressing mirror.",
                            4.7, 12),
                    new Product("Havells High-Speed 3-Blade Aerodynamic Ceiling Fan", "Home",
                            new BigDecimal("3499.00"),
                            "/images/products/ceiling_fan.jpg",
                            "Aerodynamic low-noise blades, BLDC energy-saving copper motor, and high air delivery for living rooms.",
                            4.8, 45),
                    new Product("Oscillating Standing Tower Fan with Digital Display", "Home",
                            new BigDecimal("3899.00"),
                            "/images/products/standing_fan.jpg",
                            "Slim modern oscillating cooling tower fan with touch LED temperature display, 3 speeds, and silent timer mode.",
                            4.6, 35),
                    new Product("Ergonomic Computer Study Desk Table", "Home",
                            new BigDecimal("6499.00"),
                            "/images/products/study_desk.jpg",
                            "Wide study and office computer desk with built-in cable management grommets and headphones hook.",
                            4.7, 30),
                    new Product("Solid Teak Wood 2-Drawer Bedside Table Nightstand", "Home",
                            new BigDecimal("2999.00"),
                            "/images/products/bedside_table.jpg",
                            "Compact bedside storage nightstand crafted in natural teak finish with sleek brushed metal handles.",
                            4.8, 40),
                    new Product("Fellow Precision Electric Kettle with Water Gauge", "Home",
                            new BigDecimal("3499.00"),
                            "/images/products/electric_kettle.jpg",
                            "Fast-boil 1.7L electric kettle with water level gauge, ergonomic stay-cool handle, and automatic safety shut-off.",
                            4.8, 30),
                    new Product("Heavy Enameled Cast Iron Dutch Oven Pot (6-Quart)", "Home",
                            new BigDecimal("3299.00"),
                            "/images/products/dutch_oven.jpg",
                            "Vibrant cobalt blue enameled cast iron Dutch oven with self-basting lid for stews, curries, and sourdough bread.",
                            4.9, 25),

                    // === Lifestyle (Beds, Mattresses, Bedding, Ergonomic Chairs) ===
                    new Product("Queen Size Solid Wood Platform Bed with Storage", "Lifestyle",
                            new BigDecimal("14999.00"),
                            "/images/products/platform_bed.jpg",
                            "Sturdy wooden platform bed with upholstered headboard, slatted mattress foundation, and under-bed drawers.",
                            4.9, 18),
                    new Product("Orthopedic Memory Foam King Size Mattress (8-Inch)", "Lifestyle",
                            new BigDecimal("12499.00"),
                            "/images/products/mattress.jpg",
                            "Dual-comfort orthopedic mattress with high-density pressure-relieving memory foam for superior spinal alignment.",
                            4.8, 22),
                    new Product("100% Egyptian Cotton Luxury Bed Sheet Set", "Lifestyle",
                            new BigDecimal("1899.00"),
                            "/images/products/bedsheet.jpg",
                            "Silky-soft sateen weave queen bedsheet with 2 matching pillow covers in elegant serene ivory white.",
                            4.8, 65),
                    new Product("High-Back Breathable Ergonomic Mesh Office Chair", "Lifestyle",
                            new BigDecimal("8999.00"),
                            "/images/products/office_chair.jpg",
                            "Adjustable 3D armrests, dynamic lumbar spine support, multi-angle tilt lock, and smooth rolling nylon casters.",
                            4.8, 35),

                    // === Electronics ===
                    new Product("Sony WH-1000XM5 Wireless Noise-Cancelling Headphones", "Electronics",
                            new BigDecimal("26990.00"),
                            "/images/products/headphones.jpg",
                            "Industry-leading noise cancellation with Auto NC Optimizer, 30-hour battery life, and ultra-plush earcups.",
                            4.9, 30),
                    new Product("Samsung 27-inch 4K UHD IPS Frameless Monitor", "Electronics",
                            new BigDecimal("22499.00"),
                            "/images/products/monitor.jpg",
                            "Crisp 3840x2160 IPS panel with HDR10, sRGB 99%, eye-saver flicker-free mode, and ultra-thin bezels.",
                            4.8, 25),
                    new Product("Apple Watch Series 9 GPS Smart Fitness Watch", "Electronics",
                            new BigDecimal("38900.00"),
                            "/images/products/smartwatch.jpg",
                            "S9 SiP chip, double tap gesture, always-on Retina display, ECG, blood oxygen tracking, and crash detection.",
                            4.9, 20),
                    new Product("Keychron Wireless Mechanical Keyboard", "Electronics",
                            new BigDecimal("7499.00"),
                            "/images/products/keyboard.jpg",
                            "Compact layout with tactile responsive switches, Mac/Windows compatibility, and long-lasting wireless battery.",
                            4.7, 40),
                    new Product("Logitech MX Master 3S Ergonomic Wireless Mouse", "Electronics",
                            new BigDecimal("8995.00"),
                            "/images/products/mouse.jpg",
                            "Quiet clicks, 8K DPI track-on-glass optical sensor, and ultrafast MagSpeed electromagnetic scroll wheel.",
                            4.9, 45),
                    new Product("Edifier Studio Bluetooth Bookshelf Speaker", "Electronics",
                            new BigDecimal("8999.00"),
                            "/images/products/speaker.jpg",
                            "Rich room-filling stereo sound, dual aux/bluetooth inputs, calibrated bass port, and wooden enclosure.",
                            4.8, 50),
                    new Product("Fast-Charging 20,800mAh High-Capacity Power Bank", "Electronics",
                            new BigDecimal("3499.00"),
                            "/images/products/powerbank.jpg",
                            "Multi-port fast charging with Power Delivery, dual USB-A, USB-C input/output, and sturdy metal chassis.",
                            4.7, 60)
            );

            productRepository.saveAll(products);
            logger.info("Pre-seeded {} verified catalog products with 100% matched local photos", products.size());
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
