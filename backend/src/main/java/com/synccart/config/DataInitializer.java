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
        if (productRepository.count() < 30) {
            cartItemRepository.deleteAll();
            productRepository.deleteAll();

            List<Product> products = Arrays.asList(
                    // === Groceries ===
                    new Product("Fortune Biryani Special Basmati Rice (5kg)", "Groceries",
                            new BigDecimal("650.00"),
                            "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
                            "Extra long grain aged basmati rice for royal aromatic biryanis and daily gourmet meals.",
                            4.9, 120),
                    new Product("Cold-Pressed Extra Virgin Coconut Oil (1L)", "Groceries",
                            new BigDecimal("480.00"),
                            "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=600&auto=format&fit=crop&q=80",
                            "100% pure cold-pressed unrefined coconut oil extracted from fresh organic coconuts.",
                            4.8, 95),
                    new Product("California Almonds & Jumbo Cashews Mix (500g)", "Groceries",
                            new BigDecimal("799.00"),
                            "https://images.unsplash.com/photo-1508061252224-414842d09c25?w=600&auto=format&fit=crop&q=80",
                            "Crunchy whole California almonds and golden Goan cashews packed with healthy nutrients.",
                            4.8, 85),
                    new Product("Pure Himalayan Pink Rock Salt (1kg)", "Groceries",
                            new BigDecimal("149.00"),
                            "https://images.unsplash.com/photo-1607672632458-9eb56696346b?w=600&auto=format&fit=crop&q=80",
                            "Mineral-rich unrefined pink salt harvested from pristine Himalayan foothills.",
                            4.7, 150),
                    new Product("Tata Tea Gold Premium Spiced Chai Blend (500g)", "Groceries",
                            new BigDecimal("320.00"),
                            "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
                            "Exquisite blend of Assam CTC tea leaves with 15% gently rolled long leaves and natural spices.",
                            4.8, 140),
                    new Product("Single-Origin Coorg Arabica Coffee (1kg)", "Groceries",
                            new BigDecimal("850.00"),
                            "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80",
                            "Freshly roasted specialty coffee beans with rich chocolatey undertones and citrus finish.",
                            4.9, 60),
                    new Product("Organic Extra Virgin Olive Oil (1L)", "Groceries",
                            new BigDecimal("1199.00"),
                            "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
                            "First cold-pressed Mediterranean olive oil with smooth fruity aroma and peppery finish.",
                            4.7, 80),
                    new Product("Artisan Dark Chocolate Truffles Box (24 pcs)", "Groceries",
                            new BigDecimal("650.00"),
                            "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80",
                            "Handmade pralines and dark truffles crafted with 72% rich cacao and roasted hazelnuts.",
                            4.8, 45),
                    new Product("Pure Raw Forest Organic Honey (500g)", "Groceries",
                            new BigDecimal("420.00"),
                            "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80",
                            "Unfiltered wildflower honey with active natural pollen, enzymes, and delicate herbal aroma.",
                            4.8, 55),
                    new Product("Ceremonial Grade Japanese Matcha (100g)", "Groceries",
                            new BigDecimal("750.00"),
                            "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80",
                            "Stone-ground first harvest ceremonial matcha with deep umami flavor and vibrant jade color.",
                            4.6, 40),
                    new Product("Organic Chia & Flax Seeds Superfood Mix (500g)", "Groceries",
                            new BigDecimal("349.00"),
                            "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=600&auto=format&fit=crop&q=80",
                            "Omega-3 rich whole chia and golden roasted flax seeds for smoothies and breakfast bowls.",
                            4.7, 90),

                    // === Home (Tables, Cupboards, Fans, Cookware, Decor) ===
                    new Product("Solid Sheesham Wood 6-Seater Dining Table", "Home",
                            new BigDecimal("16999.00"),
                            "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600&auto=format&fit=crop&q=80",
                            "Handcrafted solid Indian rosewood dining table with natural grain finish and sturdy tapered legs.",
                            4.9, 15),
                    new Product("3-Door Engineered Wood Wardrobe Cupboard with Mirror", "Home",
                            new BigDecimal("18499.00"),
                            "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop&q=80",
                            "Spacious modular cupboard with hanging rail, lockable drawers, multiple shelves, and full-length dressing mirror.",
                            4.7, 12),
                    new Product("Havells Stealth Air High-Speed Ceiling Fan with Remote", "Home",
                            new BigDecimal("3499.00"),
                            "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80",
                            "Aerodynamic low-noise blades, BLDC energy-saving copper motor, and wireless remote control.",
                            4.8, 45),
                    new Product("Ergonomic Computer Study Desk Table", "Home",
                            new BigDecimal("6499.00"),
                            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80",
                            "Wide study and office computer desk with built-in cable management grommets and headphones hook.",
                            4.7, 30),
                    new Product("Solid Wood 2-Drawer Bedside Table Nightstand", "Home",
                            new BigDecimal("2999.00"),
                            "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600&auto=format&fit=crop&q=80",
                            "Compact bedside storage nightstand crafted in natural teak finish with smooth sliding drawers.",
                            4.6, 35),
                    new Product("Oscillating Standing Tower Fan with Digital Display", "Home",
                            new BigDecimal("3899.00"),
                            "https://images.unsplash.com/photo-1618941716939-553df3c6c278?w=600&auto=format&fit=crop&q=80",
                            "Slim oscillating cooling fan with 3 speed modes, 12-hour timer, and touch control panel.",
                            4.5, 40),
                    new Product("Fellow Stagg EKG Electric Precision Kettle", "Home",
                            new BigDecimal("4299.00"),
                            "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80",
                            "Variable temperature control, gooseneck precision pour spout, and 60-minute temperature hold.",
                            4.9, 25),
                    new Product("Ultrasonic Ceramic Essential Oil Diffuser & Humidifier", "Home",
                            new BigDecimal("1799.00"),
                            "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80",
                            "Whisper-quiet ultrasonic cool mist aroma diffuser with 7 ambient LED colors and auto shut-off.",
                            4.7, 50),
                    new Product("Minimalist Ceramic Dinnerware Set (16-Piece)", "Home",
                            new BigDecimal("3299.00"),
                            "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&auto=format&fit=crop&q=80",
                            "Handmade stoneware plates, side bowls, and artisanal mugs with durable scratch-resistant glaze.",
                            4.6, 20),
                    new Product("Heavy Enameled Cast Iron Dutch Oven (6-Quart)", "Home",
                            new BigDecimal("2899.00"),
                            "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80",
                            "Superior heat retention pot with self-basting lid for curries, stews, baking sourdough bread.",
                            4.8, 30),

                    // === Lifestyle (Beds, Mattresses, Bedding, Furniture, Bags) ===
                    new Product("Wakefit Queen Size Solid Wood Platform Bed", "Lifestyle",
                            new BigDecimal("14999.00"),
                            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80",
                            "Premium engineered wood bed with headboard storage, sturdy slatted base, and scratch-proof teak finish.",
                            4.9, 18),
                    new Product("Orthopedic Memory Foam King Size Mattress (8-Inch)", "Lifestyle",
                            new BigDecimal("12499.00"),
                            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=80",
                            "Dual-comfort orthopedic mattress with high-density pressure-relieving memory foam for spinal support.",
                            4.8, 22),
                    new Product("100% Egyptian Cotton 400TC Luxury Bed Sheet Set", "Lifestyle",
                            new BigDecimal("1899.00"),
                            "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80",
                            "Silky-soft sateen weave queen bedsheet with 2 matching pillow covers in elegant serene ivory.",
                            4.7, 65),
                    new Product("High-Back Breathable Ergonomic Mesh Office Chair", "Lifestyle",
                            new BigDecimal("8999.00"),
                            "https://images.unsplash.com/photo-1580481077190-7361356a147e?w=600&auto=format&fit=crop&q=80",
                            "Adjustable 3D armrests, dynamic lumbar spine support, multi-angle tilt lock, and nylon caster wheels.",
                            4.8, 35),
                    new Product("Heavyweight Waxed Canvas Weekend Travel Duffle Bag", "Lifestyle",
                            new BigDecimal("2499.00"),
                            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
                            "Water-resistant vintage canvas with genuine full-grain leather straps and separate shoe compartment.",
                            4.7, 45),
                    new Product("Stainless Steel Vacuum Insulated Water Bottle (32oz)", "Lifestyle",
                            new BigDecimal("899.00"),
                            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
                            "Triple-wall copper insulation keeps water ice cold for 24 hours or steaming hot for 12 hours.",
                            4.9, 110),
                    new Product("Polarized Bamboo Wayfarer UV400 Sunglasses", "Lifestyle",
                            new BigDecimal("1299.00"),
                            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
                            "Eco-friendly sustainable bamboo wood temples with scratch-resistant polarized anti-glare lenses.",
                            4.5, 55),
                    new Product("Premium Dual-Layer Non-Slip Eco Yoga Mat", "Lifestyle",
                            new BigDecimal("1199.00"),
                            "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80",
                            "6mm thick eco-friendly TPE cushioning with body alignment guide markings and carrying sling strap.",
                            4.7, 75),

                    // === Electronics ===
                    new Product("Sony WH-1000XM5 Wireless Noise-Cancelling Headphones", "Electronics",
                            new BigDecimal("26990.00"),
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
                            "Industry-leading noise cancellation with Auto NC Optimizer, 30-hour battery, and ultra-comfortable fit.",
                            4.9, 30),
                    new Product("Samsung 27-inch 4K UHD IPS Frameless Monitor", "Electronics",
                            new BigDecimal("22499.00"),
                            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
                            "Crisp 3840x2160 IPS panel with HDR10, sRGB 99%, eye-saver flicker-free mode, and ultra-thin bezels.",
                            4.8, 25),
                    new Product("Apple Watch Series 9 GPS Smart Fitness Watch", "Electronics",
                            new BigDecimal("38900.00"),
                            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
                            "S9 SiP chip, double tap gesture, always-on Retina display, ECG, blood oxygen, and crash detection.",
                            4.9, 20),
                    new Product("Keychron K2 Wireless Mechanical Keyboard (RGB)", "Electronics",
                            new BigDecimal("7499.00"),
                            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
                            "75% compact layout with hot-swappable Gateron switches, Mac/Windows compatibility, and RGB backlights.",
                            4.7, 40),
                    new Product("Logitech MX Master 3S Ergonomic Wireless Mouse", "Electronics",
                            new BigDecimal("8995.00"),
                            "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
                            "Quiet clicks, 8K DPI track-on-glass sensor, and ultrafast MagSpeed electromagnetic scroll wheel.",
                            4.9, 45),
                    new Product("JBL Flip 6 Portable Waterproof Bluetooth Speaker", "Electronics",
                            new BigDecimal("8999.00"),
                            "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
                            "IP67 waterproof and dustproof, powerful racetrack woofer, separate tweeter, and 12 hours playtime.",
                            4.8, 50),
                    new Product("Anker 737 Fast-Charging Power Bank (24,000mAh)", "Electronics",
                            new BigDecimal("5499.00"),
                            "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80",
                            "Ultra-high 140W two-way fast charging with Power Delivery 3.1 and smart digital status display.",
                            4.6, 60),
                    new Product("Fire TV Stick 4K Max with Alexa Voice Remote", "Electronics",
                            new BigDecimal("4999.00"),
                            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
                            "Wi-Fi 6 support, Dolby Vision, HDR10+, immersive Dolby Atmos audio, and live TV integration.",
                            4.7, 70),
                    new Product("SanDisk 1TB Extreme Portable High-Speed SSD", "Electronics",
                            new BigDecimal("8499.00"),
                            "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80",
                            "Fast NVMe solid state performance with 1050MB/s read speeds, IP55 water resistance, and carabiner loop.",
                            4.8, 40)
            );

            productRepository.saveAll(products);
            logger.info("Pre-seeded {} rich catalog products across Groceries, Home, Lifestyle, and Electronics", products.size());
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
