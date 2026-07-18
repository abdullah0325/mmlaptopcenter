import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCT_IMAGE = "https://placehold.co/400x300?text=Laptop";
const CATEGORY_IMAGE = "https://placehold.co/600x400?text=Category";
const HERO_IMAGE = "https://placehold.co/1400x600?text=MM+Laptop+Center";

const categories = [
  {
    name: "Gaming Laptops",
    slug: "gaming-laptops",
    description: "High-performance laptops for gaming and streaming.",
    order: 1,
    featured: true,
  },
  {
    name: "Business Laptops",
    slug: "business-laptops",
    description: "Reliable laptops for professionals and enterprise.",
    order: 2,
    featured: true,
  },
  {
    name: "Ultrabooks",
    slug: "ultrabooks",
    description: "Ultra-light laptops with all-day battery life.",
    order: 3,
    featured: true,
  },
  {
    name: "Budget Laptops",
    slug: "budget-laptops",
    description: "Affordable laptops for everyday computing.",
    order: 4,
    featured: false,
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Essential laptop accessories and peripherals.",
    order: 5,
    featured: true,
  },
  {
    name: "Monitors",
    slug: "monitors",
    description: "External displays for work and gaming.",
    order: 6,
    featured: false,
  },
  {
    name: "Keyboards",
    slug: "keyboards",
    description: "Mechanical and wireless keyboards.",
    order: 7,
    featured: false,
  },
  {
    name: "Mice",
    slug: "mice",
    description: "Precision mice for gaming and productivity.",
    order: 8,
    featured: false,
  },
  {
    name: "Bags",
    slug: "bags",
    description: "Laptop bags, sleeves, and backpacks.",
    order: 9,
    featured: false,
  },
];

const products = [
  {
    handle: "asus-rog-strix-g16",
    title: "ASUS ROG Strix G16",
    category: "gaming-laptops",
    price: 1299,
    compareAtPrice: 1499,
    description:
      "16-inch FHD 165Hz, RTX 4060, Intel i7-13650HX, 16GB RAM, 512GB SSD",
    isFeatured: true,
    inventory: 15,
  },
  {
    handle: "dell-xps-15",
    title: "Dell XPS 15",
    category: "business-laptops",
    price: 1599,
    compareAtPrice: 1799,
    description:
      "15.6-inch OLED, Intel i9, 32GB RAM, 1TB SSD, premium build",
    isFeatured: true,
    inventory: 10,
  },
  {
    handle: "lenovo-thinkpad-x1-carbon",
    title: "Lenovo ThinkPad X1 Carbon",
    category: "ultrabooks",
    price: 1199,
    compareAtPrice: 1349,
    description:
      "14-inch IPS, Intel i7, 16GB RAM, 512GB SSD, ultra-light 1.12kg",
    isFeatured: true,
    inventory: 12,
  },
  {
    handle: "hp-pavilion-15",
    title: "HP Pavilion 15",
    category: "budget-laptops",
    price: 599,
    compareAtPrice: 699,
    description: "15.6-inch FHD, AMD Ryzen 5, 8GB RAM, 256GB SSD",
    isFeatured: true,
    inventory: 25,
  },
  {
    handle: "apple-macbook-air-m2",
    title: "Apple MacBook Air M2",
    category: "ultrabooks",
    price: 1099,
    compareAtPrice: 1199,
    description:
      "13.6-inch Liquid Retina, Apple M2, 8GB RAM, 256GB SSD, 18hr battery",
    isFeatured: true,
    inventory: 18,
  },
  {
    handle: "msi-katana-15",
    title: "MSI Katana 15",
    category: "gaming-laptops",
    price: 999,
    compareAtPrice: 1149,
    description:
      "15.6-inch FHD 144Hz, RTX 4050, Intel i7, 16GB RAM, 512GB SSD",
    isFeatured: true,
    inventory: 14,
  },
  {
    handle: "acer-swift-3",
    title: "Acer Swift 3",
    category: "ultrabooks",
    price: 749,
    compareAtPrice: 849,
    description: "14-inch FHD, AMD Ryzen 7, 16GB RAM, 512GB SSD",
    isFeatured: false,
    inventory: 20,
  },
  {
    handle: "lenovo-ideapad-gaming-3",
    title: "Lenovo IdeaPad Gaming 3",
    category: "gaming-laptops",
    price: 849,
    compareAtPrice: 949,
    description: "15.6-inch FHD 120Hz, RTX 3050, Ryzen 5, 8GB RAM, 512GB SSD",
    isFeatured: false,
    inventory: 16,
  },
  {
    handle: "hp-elitebook-840",
    title: "HP EliteBook 840 G10",
    category: "business-laptops",
    price: 1349,
    compareAtPrice: 1499,
    description: "14-inch FHD, Intel i7, 16GB RAM, 512GB SSD, MIL-STD tested",
    isFeatured: false,
    inventory: 8,
  },
  {
    handle: "samsung-galaxy-book3",
    title: "Samsung Galaxy Book3",
    category: "business-laptops",
    price: 899,
    compareAtPrice: 999,
    description: "15.6-inch AMOLED, Intel i5, 16GB RAM, 512GB SSD",
    isFeatured: false,
    inventory: 11,
  },
  {
    handle: "logitech-mx-master-3s",
    title: "Logitech MX Master 3S",
    category: "mice",
    price: 99,
    compareAtPrice: 119,
    description: "Wireless ergonomic mouse with 8K DPI sensor and quiet clicks",
    isFeatured: true,
    inventory: 40,
  },
  {
    handle: "keychron-k2-v2",
    title: "Keychron K2 V2",
    category: "keyboards",
    price: 89,
    compareAtPrice: 99,
    description: "Compact 75% wireless mechanical keyboard, hot-swappable",
    isFeatured: false,
    inventory: 30,
  },
  {
    handle: "dell-27-monitor-s2721d",
    title: "Dell 27\" 4K Monitor S2721D",
    category: "monitors",
    price: 349,
    compareAtPrice: 399,
    description: "27-inch 4K UHD IPS display with USB-C connectivity",
    isFeatured: true,
    inventory: 22,
  },
  {
    handle: "asus-tuf-gaming-monitor",
    title: "ASUS TUF Gaming VG27AQ",
    category: "monitors",
    price: 279,
    compareAtPrice: 329,
    description: "27-inch QHD 165Hz IPS gaming monitor with G-Sync",
    isFeatured: false,
    inventory: 18,
  },
  {
    handle: "tomtoc-laptop-backpack",
    title: "Tomtoc Laptop Backpack",
    category: "bags",
    price: 59,
    compareAtPrice: 69,
    description: "Water-resistant backpack fits up to 16-inch laptops",
    isFeatured: false,
    inventory: 50,
  },
  {
    handle: "anker-usb-c-hub",
    title: "Anker USB-C Hub 7-in-1",
    category: "accessories",
    price: 45,
    compareAtPrice: 55,
    description: "HDMI, USB 3.0, SD card reader, 100W PD pass-through",
    isFeatured: false,
    inventory: 60,
  },
  {
    handle: "razer-deathadder-v3",
    title: "Razer DeathAdder V3",
    category: "mice",
    price: 69,
    compareAtPrice: 79,
    description: "Lightweight esports gaming mouse with Focus Pro 30K sensor",
    isFeatured: false,
    inventory: 35,
  },
  {
    handle: "corsair-k70-rgb",
    title: "Corsair K70 RGB Pro",
    category: "keyboards",
    price: 129,
    compareAtPrice: 149,
    description: "Full-size mechanical keyboard with Cherry MX switches",
    isFeatured: false,
    inventory: 25,
  },
  {
    handle: "laptop-cooling-pad",
    title: "Cooler Master NotePal X3",
    category: "accessories",
    price: 39,
    compareAtPrice: 49,
    description: "Ergonomic laptop cooling pad with 200mm silent fan",
    isFeatured: false,
    inventory: 45,
  },
  {
    handle: "lenovo-legion-slim-5",
    title: "Lenovo Legion Slim 5",
    category: "gaming-laptops",
    price: 1149,
    compareAtPrice: 1299,
    description: "16-inch QHD 165Hz, RTX 4070, Ryzen 7, 16GB RAM, 1TB SSD",
    isFeatured: true,
    inventory: 9,
  },
];

const collections = [
  {
    handle: "hot-deals",
    title: "Hot Deals",
    description: "Limited-time discounts on top laptops and accessories.",
    isFeatured: true,
  },
  {
    handle: "new-arrivals",
    title: "New Arrivals",
    description: "The latest laptops and tech just landed in store.",
    isFeatured: true,
  },
  {
    handle: "gaming-setup",
    title: "Gaming Setup",
    description: "Build your ultimate gaming rig with our curated picks.",
    isFeatured: true,
  },
  {
    handle: "work-from-home",
    title: "Work From Home",
    description: "Everything you need for a productive home office.",
    isFeatured: false,
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_USER ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASS ?? "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "MM Laptop Center Admin",
    },
  });

  // Clear existing catalog data for fresh seed
  await prisma.productVariation.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.review.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.homepageSection.deleteMany();

  const categoryMap = new Map<string, string>();

  for (const cat of categories) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: CATEGORY_IMAGE,
        order: cat.order,
        featured: cat.featured,
        seoTitle: `${cat.name} – MM Laptop Center`,
        seoDescription: `Shop ${cat.name.toLowerCase()} at MM Laptop Center – premium laptops and tech.`,
      },
    });
    categoryMap.set(cat.slug, created.id);
  }

  const productHandles: string[] = [];

  for (const product of products) {
    const categoryId = categoryMap.get(product.category);
    const created = await prisma.product.create({
      data: {
        handle: product.handle,
        title: product.title,
        description: product.description,
        descriptionHtml: `<p>${product.description}</p>`,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        inventory: product.inventory,
        availableForSale: true,
        status: "ACTIVE",
        featuredImage: PRODUCT_IMAGE,
        images: JSON.stringify([{ url: PRODUCT_IMAGE, altText: product.title }]),
        productType: product.category,
        categoryId,
        vendor: "MM Laptop Center",
        tags: JSON.stringify(["laptop", "tech", product.category]),
        isFeatured: product.isFeatured,
        seoTitle: `${product.title} – MM Laptop Center`,
        seoDescription: product.description,
      },
    });
    productHandles.push(created.handle);
  }

  const featuredHandles = products.filter((p) => p.isFeatured).map((p) => p.handle);

  for (const col of collections) {
    await prisma.collection.create({
      data: {
        handle: col.handle,
        title: col.title,
        description: col.description,
        descriptionHtml: `<p>${col.description}</p>`,
        image: CATEGORY_IMAGE,
        isFeatured: col.isFeatured,
        productHandles: JSON.stringify(featuredHandles.slice(0, 6)),
        seoTitle: `${col.title} – MM Laptop Center`,
        seoDescription: col.description,
      },
    });
  }

  const reviews = [
    {
      authorName: "Ahmed K.",
      rating: 5,
      content:
        "Bought the ASUS ROG Strix G16 – runs every game smoothly. Great service from MM Laptop Center!",
      isFeatured: true,
    },
    {
      authorName: "Sara M.",
      rating: 5,
      content:
        "My Dell XPS 15 arrived perfectly configured. Best laptop shop in town.",
      isFeatured: true,
    },
    {
      authorName: "Usman R.",
      rating: 5,
      content:
        "Excellent prices on gaming laptops. Fast delivery and genuine products.",
      isFeatured: true,
    },
    {
      authorName: "Fatima A.",
      rating: 4,
      content:
        "Got a MacBook Air M2 for university. Lightweight and the battery lasts all day.",
      isFeatured: false,
    },
    {
      authorName: "Bilal H.",
      rating: 5,
      content:
        "Ordered a monitor and keyboard bundle – everything works perfectly together.",
      isFeatured: false,
    },
  ];

  for (const review of reviews) {
    await prisma.review.create({
      data: {
        ...review,
        status: "approved",
        isVerifiedPurchase: true,
      },
    });
  }

  const certificates = [
    {
      name: "Authorized Dealer",
      image: "https://placehold.co/200x200?text=Authorized",
      description: "Official authorized dealer for major laptop brands.",
      order: 1,
    },
    {
      name: "Genuine Products",
      image: "https://placehold.co/200x200?text=Genuine",
      description: "100% authentic products with manufacturer warranty.",
      order: 2,
    },
    {
      name: "Warranty Support",
      image: "https://placehold.co/200x200?text=Warranty",
      description: "Full warranty support on all laptops and accessories.",
      order: 3,
    },
    {
      name: "Secure Checkout",
      image: "https://placehold.co/200x200?text=Secure",
      description: "Safe and secure payment processing.",
      order: 4,
    },
  ];

  for (const cert of certificates) {
    await prisma.certificate.create({ data: { ...cert, isActive: true } });
  }

  await prisma.homepageSection.create({
    data: {
      sectionKey: "essence",
      title: "Your Trusted Tech Destination",
      subtitle: "Premium laptops and accessories for work, gaming, and everyday life.",
      content: [],
      isActive: true,
      order: 1,
      image: HERO_IMAGE,
    },
  });

  const blogPosts = [
    {
      title: "How to Choose the Right Gaming Laptop in 2026",
      slug: "choose-gaming-laptop-2026",
      excerpt:
        "GPU, refresh rate, cooling – everything you need to know before buying a gaming laptop.",
      content:
        "<p>Gaming laptops have evolved rapidly. Here's our guide to picking the perfect machine for your budget and games.</p>",
      featuredImage: PRODUCT_IMAGE,
      author: "MM Laptop Center",
      status: "published",
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      title: "Top 5 Business Laptops for Remote Work",
      slug: "top-business-laptops-remote-work",
      excerpt:
        "Our picks for the best business laptops that keep you productive from anywhere.",
      content:
        "<p>Remote work demands reliability. These business laptops deliver performance, battery life, and portability.</p>",
      featuredImage: PRODUCT_IMAGE,
      author: "MM Laptop Center",
      status: "published",
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      title: "Essential Laptop Accessories You Should Own",
      slug: "essential-laptop-accessories",
      excerpt:
        "From USB-C hubs to cooling pads – upgrade your setup with these must-have accessories.",
      content:
        "<p>The right accessories can transform your laptop experience. Here are our top recommendations.</p>",
      featuredImage: PRODUCT_IMAGE,
      author: "MM Laptop Center",
      status: "published",
      isFeatured: false,
      publishedAt: new Date(),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post });
  }

  await prisma.navigationMenu.upsert({
    where: { location: "header" },
    update: {
      items: [
        { text: "Home", href: "/" },
        { text: "Laptops", href: "/products" },
        { text: "Accessories", href: "/category/accessories" },
        { text: "Deals", href: "/collections/hot-deals" },
        { text: "About", href: "/about-us" },
        { text: "Contact", href: "/contact" },
      ],
    },
    create: {
      location: "header",
      items: [
        { text: "Home", href: "/" },
        { text: "Laptops", href: "/products" },
        { text: "Accessories", href: "/category/accessories" },
        { text: "Deals", href: "/collections/hot-deals" },
        { text: "About", href: "/about-us" },
        { text: "Contact", href: "/contact" },
      ],
    },
  });

  const siteSettings = [
    { key: "siteName", value: "MM Laptop Center" },
    {
      key: "termsOfService",
      value: {
        title: "Terms and Conditions",
        body: "<p>Welcome to MM Laptop Center. These terms and conditions outline the rules and regulations for the use of our website.</p>",
      },
    },
    {
      key: "privacyPolicy",
      value: {
        title: "Privacy Policy",
        body: "<p>At MM Laptop Center, we value your privacy and protect the information you share with us.</p>",
      },
    },
    {
      key: "refundPolicy",
      value: {
        title: "Refund Policy",
        body: "<p>If you are not satisfied with your purchase, please contact us within 7 days so we can help resolve it.</p>",
      },
    },
    { key: "blogArticles", value: [] },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log(`Seeded ${categories.length} categories, ${products.length} products, ${collections.length} collections`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
