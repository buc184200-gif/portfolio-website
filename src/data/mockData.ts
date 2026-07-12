import { siteConfig } from "./siteConfig";

// 1. Website Types
export interface WebsiteType {
  id: string;
  title: string;
  icon: string;
  bestFor: string;
  mainGoal: string;
  features: string[];
  priceRange: string;
  description: string;
}

export const websiteTypes: WebsiteType[] = [
  {
    id: "coaching",
    title: "Coaching Institute Website",
    icon: "GraduationCap",
    bestFor: "Coaching centres, tuition classes, NEET/JEE test-prep academies",
    mainGoal: "Parent enquiries, student registrations, and course discoverability",
    features: [
      "Dynamic Course Catalog",
      "Faculty/Teacher Profile Cards",
      "Student Results & Hall of Fame Grid",
      "Direct WhatsApp Enquiry for Courses",
      "Testimonials Slider"
    ],
    priceRange: siteConfig.pricing.basic.range + " to " + siteConfig.pricing.business.range,
    description: "Designed to establish trust with parents, display your academic track record, and capture leads for upcoming batches."
  },
  {
    id: "clinic",
    title: "Clinic / Doctor Website",
    icon: "Stethoscope",
    bestFor: "Doctors, dentists, healthcare clinics, pediatricians, physiotherapists",
    mainGoal: "Patient trust, service awareness, and online appointment booking request",
    features: [
      "Doctor Profile & Credentials Section",
      "Service/Treatment Cards with detailed info",
      "Clinic Timings & Google Maps integration",
      "One-click Appointment Enquiry (WhatsApp)",
      "Frequently Asked Questions"
    ],
    priceRange: siteConfig.pricing.business.range,
    description: "A highly professional, clean, comforting website to answer patients' questions, show timings, and drive appointments."
  },
  {
    id: "gym",
    title: "Gym & Fitness Website",
    icon: "Dumbbell",
    bestFor: "Gyms, yoga studios, crossfit boxes, personal trainers",
    mainGoal: "Membership conversions, package sales, and trial bookings",
    features: [
      "Membership Plan Comparison Grid",
      "Trainer Credentials & Profiles",
      "Client Before/After Transformations Grid",
      "Free 1-Day Pass lead capture",
      "WhatsApp Support button"
    ],
    priceRange: siteConfig.pricing.basic.range + " to " + siteConfig.pricing.business.range,
    description: "High-energy, visual-first layouts that showcase equipment, show real client transformations, and offer a simple trial sign-up."
  },
  {
    id: "restaurant",
    title: "Restaurant / Cafe Website",
    icon: "Utensils",
    bestFor: "Restaurants, cafes, cloud kitchens, bakeries",
    mainGoal: "Food ordering, table reservation requests, and menu downloads",
    features: [
      "Visual Digital Food Menu",
      "WhatsApp Direct Food Ordering",
      "Table Reservation Form",
      "Map & Delivery Area highlights",
      "Instagram feed integration placeholder"
    ],
    priceRange: siteConfig.pricing.basic.range + " to " + siteConfig.pricing.business.range,
    description: "Mouth-watering visual showcase of dishes, location, operating hours, and instant ordering through WhatsApp."
  },
  {
    id: "shop",
    title: "Local Shop Website",
    icon: "Store",
    bestFor: "Grocery shops, clothing boutiques, hardware stores, gift shops",
    mainGoal: "Foot traffic, inventory showcase, and home-delivery enquiries",
    features: [
      "Product Catalog / Visual Shelf",
      "Store timing & Location Pins",
      "Delivery / COD Ordering system on WhatsApp",
      "Seasonal deals banner",
      "Contact form"
    ],
    priceRange: siteConfig.pricing.basic.range + " to " + siteConfig.pricing.business.range,
    description: "Help customers in your neighborhood find what you sell, see your location, and order directly for home delivery."
  },
  {
    id: "realestate",
    title: "Real Estate Website",
    icon: "Home",
    bestFor: "Property dealers, real estate agents, independent builders",
    mainGoal: "Lead generation for property viewings and listings",
    features: [
      "Property Listings Grid with filters",
      "Detailed property pages (BHK, price, size, location)",
      "Schedule Site Visit call-to-action",
      "Interactive WhatsApp Enquiry per listing",
      "Agent bio & testimonials"
    ],
    priceRange: siteConfig.pricing.business.range + " to " + siteConfig.pricing.premium.range,
    description: "Showcase homes, plots, or commercial spaces with clean image galleries, pricing details, and quick enquiry triggers."
  },
  {
    id: "salon",
    title: "Salon / Beauty Website",
    icon: "Sparkles",
    bestFor: "Hair salons, beauty parlors, spas, makeup artists",
    mainGoal: "Service bookings, stylist showcases, and package reviews",
    features: [
      "Interactive Rate Card",
      "Stylist Profile Grid",
      "Client hair/beauty Transformation Gallery",
      "Book Appointment request on WhatsApp",
      "Google Reviews highlight"
    ],
    priceRange: siteConfig.pricing.basic.range + " to " + siteConfig.pricing.business.range,
    description: "An elegant, aesthetic layout showing services (haircut, facial, bridal) with prices, and easy booking paths."
  },
  {
    id: "service",
    title: "Service Business Website",
    icon: "Wrench",
    bestFor: "CA firms, consultants, repair technicians, photographers, cleaning services",
    mainGoal: "Quote enquiries, phone calls, and trust building",
    features: [
      "Detailed Service Breakdowns",
      "Transparent Starting Prices",
      "Customer reviews & past work",
      "Request a Quote form",
      "Instant WhatsApp consultation"
    ],
    priceRange: siteConfig.pricing.business.range + " to " + siteConfig.pricing.premium.range,
    description: "Explains your professional services clearly, answers common questions, and makes it extremely simple to request a price quote."
  },
  {
    id: "ecommerce",
    title: "E-commerce Website",
    icon: "ShoppingBag",
    bestFor: "Product sellers, apparel brands, home accessories, local manufacturers",
    mainGoal: "Online sales, inventory management, checkout flow",
    features: [
      "Product Listings, search, and sorting",
      "Shopping Cart & COD checkout flow",
      "WhatsApp Order Notifications",
      "Admin order dashboard preview",
      "Product reviews & ratings"
    ],
    priceRange: siteConfig.pricing.premium.range + " to " + siteConfig.pricing.luxury.range,
    description: "Fully featured online store allowing customers to browse, add to cart, and check out securely using COD or WhatsApp order verification."
  },
  {
    id: "startup",
    title: "Startup Landing Page",
    icon: "Rocket",
    bestFor: "Tech startups, SaaS projects, digital courses, mobile app launches",
    mainGoal: "Waitlist signups, app downloads, or product inquiries",
    features: [
      "Hero product wireframe / interactive showcase",
      "Features grid with clean icons",
      "Waitlist / Newsletter subscription",
      "Pricing plans slider",
      "Developer/Creator profiles"
    ],
    priceRange: siteConfig.pricing.business.range + " to " + siteConfig.pricing.premium.range,
    description: "High-end, tech-focused landing pages with ultra-smooth animations, direct feature copy, and clear conversion triggers."
  }
];

// 2. Live Preview Switcher Details
export interface LivePreview {
  id: string;
  industry: string;
  heroHeadline: string;
  tagline: string;
  ctaText: string;
  bgColor: string;
  accentColor: string;
  mockSections: {
    title: string;
    items: string[];
  }[];
}

export const livePreviews: LivePreview[] = [
  {
    id: "coaching",
    industry: "Coaching Centre",
    heroHeadline: "Crack JEE & NEET with Kota's Elite Faculty in Delhi",
    tagline: "Admissions open for Batch 2026. Get 1-on-1 counseling and study materials.",
    ctaText: "Enquire About Batches",
    bgColor: "from-blue-950 to-slate-950",
    accentColor: "text-blue-400 border-blue-500 bg-blue-500/10",
    mockSections: [
      {
        title: "Our Specialized Courses",
        items: ["JEE Foundation (Class 9-10)", "JEE Main & Advanced Prep", "NEET Medical Achievers", "12th Board Support Batch"]
      },
      {
        title: "Kota Faculty Led",
        items: ["H.S. Verma (Physics Expert, 15+ Yrs Exp)", "Dr. S. K. Gupta (Organic Chemistry, PhD)", "Anjali Sharma (Math, Ex-FIITJEE)"]
      },
      {
        title: "Unmatched Results (2025)",
        items: ["AIR 14 - JEE Advanced", "AIR 89 - NEET UG", "98.4% Students Cleared Mains"]
      }
    ]
  },
  {
    id: "clinic",
    industry: "Healthcare Clinic",
    heroHeadline: "Gentle, Professional Dental Care for Your Family",
    tagline: "Smile Dental Clinic. Open Mon-Sat 10 AM - 8 PM. Dr. Rohit Verma (MDS).",
    ctaText: "Book Dental Checkup",
    bgColor: "from-cyan-950 to-slate-950",
    accentColor: "text-cyan-400 border-cyan-500 bg-cyan-500/10",
    mockSections: [
      {
        title: "Our Dental Services",
        items: ["Pain-free Root Canal (RCT)", "Teeth Whitening & Cleaning", "Dental Implants & Braces", "Kids Dental Care"]
      },
      {
        title: "Why Smile Clinic?",
        items: ["100% Sterilized Instruments", "Ex-AIIMS Resident Doctor", "Affordable transparent pricing"]
      },
      {
        title: "Clinic Location",
        items: ["Sector 15, Near Metro Station, Dwarka", "Call: Dr. Rohit Verma MDS"]
      }
    ]
  },
  {
    id: "gym",
    industry: "Gym / Fitness",
    heroHeadline: "Transform Your Body. Build Real Strength & Confidence.",
    tagline: "Iron Paradise Gym. World-class equipment, customized nutrition, and certified trainers.",
    ctaText: "Claim Free 1-Day Pass",
    bgColor: "from-purple-950 to-slate-950",
    accentColor: "text-purple-400 border-purple-500 bg-purple-500/10",
    mockSections: [
      {
        title: "Membership Plans",
        items: ["Basic Membership (₹1,500/mo)", "Pro Muscle + Cardio (₹2,500/mo)", "Personal Training Pack (₹6,000/mo)"]
      },
      {
        title: "Our Equipment",
        items: ["Jerai Fitness Olympic Racks", "Premium Cardio Zone", "Steam Bath & Locker Rooms"]
      },
      {
        title: "Success Stories",
        items: ["Amit K. lost 15kg in 12 Weeks", "Rahul S. gained 6kg of pure muscle", "Pooja Roy reversed thyroid issues"]
      }
    ]
  },
  {
    id: "restaurant",
    industry: "Restaurant / Cafe",
    heroHeadline: "Authentic North Indian Flavours & Cozy Woodfire Pizzas",
    tagline: "The Spicery Cafe. Delivery hot within 30 minutes in your sector. Order on WhatsApp.",
    ctaText: "Order Online (WhatsApp)",
    bgColor: "from-amber-950 to-slate-950",
    accentColor: "text-amber-400 border-amber-500 bg-amber-500/10",
    mockSections: [
      {
        title: "Must-Try Signature Dishes",
        items: ["Special Paneer Lababdar (₹280)", "Tandoori Soya Chaap (₹220)", "Woodfired Farmhouse Pizza (₹350)"]
      },
      {
        title: "Woodfire Cafe Vibes",
        items: ["Cozy outdoor garden seating", "Live acoustic music on weekends", "Available for birthday parties"]
      }
    ]
  },
  {
    id: "shop",
    industry: "Local Boutique Shop",
    heroHeadline: "Handcrafted Cotton Kurtis & Designer Ethnic Wear",
    tagline: "Rhea's Fashion Hub. Direct manufacturer prices. COD available in India.",
    ctaText: "Browse Latest Collection",
    bgColor: "from-rose-950 to-slate-950",
    accentColor: "text-rose-400 border-rose-500 bg-rose-500/10",
    mockSections: [
      {
        title: "Our Hot Collections",
        items: ["Premium Jaipur Block-print Suit Set", "A-Line Summer Cotton Kurtis", "Embroidered Festive Anarkalis"]
      },
      {
        title: "Shop Confidence",
        items: ["100% Breathable Pure Cotton", "Easy 7-day size exchanges", "Free delivery above ₹1,500"]
      }
    ]
  }
];

// 3. Demo Portfolio Projects (Genuine labels!)
export interface PortfolioProject {
  title: string;
  description: string;
  category: string;
  tags: string[];
  features: string[];
  imagePlaceholder: string; // for UI reference
}

export const portfolioProjects: PortfolioProject[] = [
  {
    title: "Apex JEE & NEET Academy",
    description: "A premium coaching institute demo focused on student admission enquiries, Kota-standard results showcase, course lists, and direct WhatsApp counseling links.",
    category: "Coaching Institute",
    tags: ["Demo Project", "WhatsApp CTA", "SEO Ready", "Interactive Courses"],
    features: ["Course Grid", "Results Hall of Fame", "WhatsApp counseling pipeline", "Responsive admissions form"],
    imagePlaceholder: "gradient-blue"
  },
  {
    title: "Vogue Cotton Apparel Store",
    description: "A high-performance e-commerce mockup with rapid loading speeds, a clean product listing layout, responsive shopping cart, and quick COD checkout pipeline.",
    category: "E-commerce",
    tags: ["Demo Project", "Product Store", "Shopping Cart", "COD Checkout"],
    features: ["Instant Search", "Sliding Shopping Cart", "WhatsApp order dispatch message", "Fully responsive product showcase"],
    imagePlaceholder: "gradient-rose"
  },
  {
    title: "Apollo Family Dental Clinic",
    description: "A clean, comforting medical website design demo highlighting doctor achievements, sterilized clinic practices, location maps, and rapid appointment triggers.",
    category: "Clinic / Doctor",
    tags: ["Demo Project", "Appointment Focused", "Clean Layout", "Google Maps"],
    features: ["Dr Profile Card", "Services Rate Card", "Clinic Timings grid", "Appointment request form"],
    imagePlaceholder: "gradient-cyan"
  },
  {
    title: "Titanium Elite Fitness Club",
    description: "A modern, high-energy gym mockup highlighting state-of-the-art Jerai equipment, trainers, membership cards, and weight loss transformations.",
    category: "Gym & Fitness",
    tags: ["Demo Project", "Gym & Fitness", "Before/After Slider", "Membership Grid"],
    features: ["Membership table", "Trainer Profiles", "Transformations showcase", "1-Day Free Pass lead collector"],
    imagePlaceholder: "gradient-purple"
  }
];

// 4. Before / After Transformation Cases
export interface TransformationCase {
  before: string[];
  after: string[];
}

export const transformationCase: TransformationCase = {
  before: [
    "No website at all, or a 10-year-old layout that looks broken on mobile phones.",
    "Customers ask the same basic questions (timings, prices, locations) again and again.",
    "No professional brand image online when a high-value customer searches for you.",
    "No direct pathway for customers to instantly inquire or message on WhatsApp.",
    "Slow loading speeds that cause visitors to immediately press the back button."
  ],
  after: [
    "100% responsive modern design that looks beautiful and premium on every phone & desktop.",
    "All service lists, operating hours, prices, and locations displayed clearly in one spot.",
    "Strong trust-building elements (reviews, profiles, real photos) to win high-value orders.",
    "One-click 'Message on WhatsApp' triggers set up on every core service card.",
    "God-level optimization getting rapid loading scores for superb customer experience."
  ]
};

// 5. Frequently Asked Questions
export interface FAQItem {
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    question: "What types of websites do you build?",
    answer: "We build modern, high-converting websites for coaching institutes, clinics, dentists, gyms, restaurants, local shops, real estate agents, salons, e-commerce stores, service businesses, and startups. We design specifically to get you more customer enquiries and calls."
  },
  {
    question: "How much does a website cost?",
    answer: "We keep our pricing transparent and accessible. Our Basic single-page website package is ₹4,000 - ₹8,000. Our Business multi-section lead-capture website is ₹8,000 - ₹12,000. Our Premium fully-custom designed website is ₹12,000 - ₹30,000. Our Luxury custom web apps, e-commerce platforms, or AI integrations range from ₹30,000 - ₹1,00,000+ depending on specific page count and feature complexity. Always keep in mind, final pricing is custom-calculated based on what your business actually needs."
  },
  {
    question: "What is included in the Basic Website package?",
    answer: "The Basic Website (₹4,000 - ₹8,000) is a single-page responsive landing layout with a clean header, introductory section, list of services, simple image gallery, contact details, a clickable phone call trigger, and an integrated 'Message on WhatsApp' floating CTA button. It is perfect for small local businesses that need a clean, immediate online presence."
  },
  {
    question: "What makes a Luxury Website unique?",
    answer: "A Luxury Website (₹30,000 - ₹1,00,000+) features highly custom code architecture. It includes things like advanced e-commerce flows (listing, shopping cart, custom COD checkouts), dedicated admin panels to control content, real-time booking and appointment management calendars, custom animations, relational databases, and integration of customized AI agents like our Website Consultant to interact with your visitors."
  },
  {
    question: "How long does it take to build a website?",
    answer: "A basic or single-page business website takes 3 to 7 days to design and launch. A multi-page Business website takes about 7 to 14 days. Custom Premium and Luxury platforms can take 2 to 4 weeks depending on the design layout, copywriting requirements, and custom integrations."
  },
  {
    question: "Do you provide domain name and web hosting?",
    answer: "Yes, we fully assist you in selecting and purchasing the perfect domain and hosting plan. We set everything up on your accounts (e.g., Hostinger, GoDaddy) so that you maintain 100% legal ownership of your website and billing. Hosting and domain renewal charges are paid directly to the hosting provider."
  },
  {
    question: "How does the WhatsApp-first enquiry system work?",
    answer: "Most local business customers prefer chatting on WhatsApp over filling out a long form. We place smart, animated WhatsApp buttons on your services, plans, and contact triggers. When clicked, it automatically opens WhatsApp with a pre-written message like: 'Hi, I saw your dental services website and want to check doctor availability for tomorrow.' This immediately converts a silent visitor into a text lead!"
  },
  {
    question: "Can you add an interactive AI Chatbot to my website?",
    answer: "Yes! We specialize in developing and embedding custom server-side AI agents. These conversational agents can answer your visitors' questions about your prices, services, operating hours, and location 24/7, and then guide interested prospects to click your WhatsApp booking link. We use the modern Google Gemini API to build these smart helpers."
  },
  {
    question: "Can you redesign my old or slow website?",
    answer: "Absolutely! We can take your existing website, rewrite the copy to make it highly persuasive, optimize your images for instant loading speeds, and rebuild it from scratch with a gorgeous modern layout that converts traffic into customers."
  },
  {
    question: "Do I need to write all the content and text for my website?",
    answer: "No, you don't have to worry about it. If you choose our Business, Premium, or Luxury packages, we assist you with conversion-oriented copywriting. You just give us basic points about your services, and we write compelling, professional English text designed to build maximum trust and trigger sales enquiries."
  },
  {
    question: "Do you provide Search Engine Optimization (SEO)?",
    answer: "Yes. Every website we build includes essential on-page SEO setup: proper HTML heading tags, meta titles, description tags, fast loading index speeds, image compressed alt tags, and mobile responsive optimization. We also assist you in structuring your Google Business Profile so you rank higher when local clients search in your city."
  },
  {
    question: "Do you guarantee customer leads?",
    answer: "We focus on building honest relationships. We guarantee to build a top-tier, fast, beautiful, and persuasive website that gives your business maximum professional trust and makes it extremely easy for visitors to enquire. However, we cannot guarantee guaranteed leads because actual results depend entirely on your market, the traffic you get, your pricing offers, and how fast you answer WhatsApp messages!"
  },
  {
    question: "How do we get started?",
    answer: "It's super simple! Just select 'Get Free Demo on WhatsApp' or fill out our Contact/Audit form. We will have a 5-minute chat on WhatsApp to understand your business goals, prepare a completely free wireframe demo preview for you, and if you like our approach, we'll kick off development!"
  }
];

// 6. Project Checklist items
export const checklistItems = [
  "100% Mobile & Tablet Responsive Viewports",
  "Google-Optimized Loading Speeds (<2s)",
  "Instant-Click WhatsApp Conversion Buttons",
  "Fully Interactive Contact Form & Lead Routing",
  "Interactive Location Pin & Timings Section",
  "Custom Typography & Design Spacing System",
  "SEO Schema Markup & Clean Semantic HTML",
  "Copywriting Assistance (Lead-Focused)",
  "Social Media Trust Badge Integrations",
  "SSL Security Certificate & Safe Hosting Setup",
  "Launch Verification Check of All Buttons & Links",
  "Free Post-Launch Minor Revisions Support"
];

// 7. Timeline Process Steps
export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "1. Tell Us About Your Business",
    description: "We chat on WhatsApp or phone for 5-10 minutes to understand your business type, target clients, main services, and what you want your website to achieve."
  },
  {
    step: 2,
    title: "2. Strategic Website Planning",
    description: "We map out the exact pages, sections, and WhatsApp flow triggers that your business needs. We present a clear, custom price estimate before writing code."
  },
  {
    step: 3,
    title: "3. Interactive Demo/Design Preview",
    description: "We build a visual demo preview of your homepage so you can see exactly how it looks and feels on mobile, ensuring you love the layout before committing."
  },
  {
    step: 4,
    title: "4. Rapid Website Development",
    description: "Our studio designs, codes, and refines the complete website with speed, clean layouts, custom typography, mobile responsiveness, and SEO tags."
  },
  {
    step: 5,
    title: "5. Collaborative Review & Revisions",
    description: "We send you a private review link. You check all sections and request any text edits or style tweaks. We refine it in real-time until you say it is perfect."
  },
  {
    step: 6,
    title: "6. Hosting Setup & Public Launch",
    description: "We connect your custom domain, set up high-speed web hosting, enable free SSL security certificates, inspect launch checklists, and set your site live!"
  },
  {
    step: 7,
    title: "7. Dedicated After-Launch Support",
    description: "Even after launch, we are available on WhatsApp for any minor edits, help with email setups, or quick updates, keeping your business running smoothly."
  }
];

// 8. Industries served list
export interface IndustryItem {
  name: string;
  icon: string;
  desc: string;
}

export const industriesServed: IndustryItem[] = [
  { name: "Coaching Institutes", icon: "GraduationCap", desc: "JEE/NEET academies, computer classes, personal tuition academies." },
  { name: "Clinics & Doctors", icon: "Stethoscope", desc: "Dental clinics, child specialists, physios, private doctor chambers." },
  { name: "Gyms & Fitness", icon: "Dumbbell", desc: "Local gyms, cardio clubs, yoga chambers, personal trainers." },
  { name: "Restaurants & Cafes", icon: "Utensils", desc: "Fine dining, local cafes, cloud kitchens, family bakeries." },
  { name: "Local Boutiques & Shops", icon: "Store", desc: "Apparel stores, dry cleaners, grocery delivery shops, pharmacies." },
  { name: "Real Estate Agents", icon: "Home", desc: "Property brokers, independent home builders, rental agencies." },
  { name: "Salons & Spas", icon: "Sparkles", desc: "Hair dressers, beauty parlors, makeup artists, massage spas." },
  { name: "Service Businesses", icon: "Wrench", desc: "AC repair, wedding photography, CA offices, car detailing, legal consults." },
  { name: "E-commerce Brands", icon: "ShoppingBag", desc: "Direct-to-consumer online shops, custom merchandise stores." }
];
