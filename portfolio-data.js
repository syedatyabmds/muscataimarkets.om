/* Portfolio data — extracted from the case-study PDFs in /portfolio.
   Images live in assets/portfolio/<slug>/NN.jpg (optimised copies of the
   originals in portfolio/<client>/images).
   `cats` drives the filter chips; `tags` are the pills printed on the card
   and mirror the labels used on the source PDF.
   `ar` is the width/height of each image, in order — it sets the image count
   and drives the lightbox mosaic, where wide shots span the full row and
   portraits pair up, the way the source PDFs lay them out.
   `logoAr` is the logo's width/height. Logos are scaled to a constant visual
   AREA rather than a constant height, so lockups of very different shapes
   (blumen is 5.3:1, Haddaya is square) read at the same size. */
window.PORTFOLIO = [
  {
    slug: 'blumen',
    brand: 'blumen',
    sub: 'Stainless Steel',
    logo: 'assets/portfolio/blumen/logo.png',
    logoAr: 5.3488,
    desc: 'Blumen Classic Pro packaging is designed to show premium kitchenware with a clean, modern, and lifestyle-driven look. Each box uses a distinct colour theme, to create strong shelf impact while keeping the brand identity consistent.',
    tags: ['Logo Design', 'Brand Identity', 'Print Media', 'Colour Palette'],
    cats: ['branding', 'print'],
    ar: [1, 1, 1.78]
  },
  {
    slug: 'brimful',
    brand: 'BRIMFUL',
    sub: 'Your Mood, Your Light',
    desc: 'Premium box packaging design for BRIMFUL Aura 400 LED Ceiling Lamp, presented in a realistic bedroom setting. The orange and white layout highlights the product image, key features, and specs clearly, giving the packaging a clean, modern, and retail-ready look.',
    tags: ['Packaging Design', 'Box Printing', 'Colour Palette'],
    cats: ['packaging'],
    ar: [0.8, 0.8, 1, 0.8]
  },
  {
    slug: 'ce-makeup',
    brand: 'CE',
    sub: 'Makeup',
    desc: 'Clean and premium product photography for CE Makeup, highlighting nail polish shades, packaging, and glossy finish across studio and styled lifestyle set-ups.',
    tags: ['Photography', 'Product Shoot', 'Makeup Shoot'],
    cats: ['photography'],
    ar: [1, 1.78, 1.21, 1.33]
  },
  {
    slug: 'dolmen-mall',
    brand: 'DOLMEN MALL',
    sub: 'Mall Branding System',
    desc: 'Designed creative mall banners, promotional signage, wayfinding maps, parking guides, and directory layouts for a professional mall branding system. The designs focus on clear communication, attractive visuals, organised information, and realistic mockup presentation for both customer guidance and promotional display.',
    tags: ['Campaign Design', 'Print Media', 'Print Design'],
    cats: ['print'],
    ar: [0.53, 1.33, 1.33, 1.33, 0.8]
  },
  {
    slug: 'dolmen-azaadi',
    brand: 'DOLMEN MALL',
    sub: 'Azaadi Campaign',
    desc: 'Designed a festive Dolmen Mall Azaadi campaign banner with patriotic green visuals, bold Dil Dil Pakistan typography, city illustrations, event dates, and shopping celebration messaging.',
    tags: ['Campaign Design', 'Print Media', 'Print Design'],
    cats: ['print'],
    ar: [1.33, 1, 1.33, 1.66]
  },
  {
    slug: 'gulfood',
    brand: 'GULFOOD',
    sub: 'Dubai World Trade Centre',
    desc: 'A bright Gulfood invitation flyer for Soni Foods. It uses a soft sky-blue background with a faint Dubai landmark silhouette, colourful lollipops and candies on the right, and bold event details on the left. The layout feels playful, clean, and food-focused, making it suitable for a trade exhibition invitation.',
    tags: ['Campaign Design', 'Print Media', 'Print Design'],
    cats: ['print'],
    ar: [0.75, 0.75, 1.33, 1.15, 0.8, 0.8, 0.8]
  },
  {
    slug: 'haddaya',
    brand: 'HADDAYA',
    sub: 'Giftings and Flowers',
    logo: 'assets/portfolio/haddaya/logo.png',
    logoAr: 1,
    desc: 'The set includes branded paper bags, gift box packaging, envelope and sticker presentation, patterned wrapping paper, and custom ribbon design. The overall look feels elegant, high-end, and suitable for luxury gifts, boutiques, and premium brand packaging.',
    tags: ['Logo Design', 'Brand Identity', 'Packaging Design', 'Colour Palette'],
    cats: ['branding', 'packaging'],
    ar: [1.99, 1.78, 1.78, 0.67, 1.78, 1.78, 1.78, 1.78, 1.22]
  },
  {
    slug: 'handbags',
    brand: 'HAND BAGS & WALLETS',
    sub: 'Lifestyle Product Shoot',
    desc: 'A premium lifestyle concept for handbags and wallets, styled with flowers, scarves, chocolates, and elegant props to create a luxury gifting feel. The warm lighting, soft backgrounds, and close-up product angles highlight the leather texture, colour, stitching, and refined details.',
    tags: ['Product Shoot', 'Photography'],
    cats: ['photography'],
    ar: [0.56, 1.5, 1.49, 1]
  },
  {
    slug: 'jewellery',
    brand: 'JEWELLERY',
    sub: 'Beauty & Fashion Shoot',
    desc: 'This shoot focuses on elegant pearl and diamond-style earrings with a premium beauty and fashion look. The visuals include close-up product shots, macro detail shots, and model styling to highlight the sparkle, pearl finish, and luxury craftsmanship.',
    tags: ['Product Shoot', 'Photography'],
    cats: ['photography'],
    ar: [0.74, 0.74, 0.74, 0.74, 0.74, 0.75]
  },
  {
    slug: 'ministry-of-health',
    brand: 'MINISTRY OF HEALTH',
    sub: 'Their Protection is our Responsibility',
    desc: 'The design uses a soft pink theme with a light blue front panel, creating a professional and elegant look. Arabic typography, official logos, subtle line patterns, and curved pink elements are arranged neatly to highlight the event information clearly.',
    tags: ['Packaging Design', 'Print Media'],
    cats: ['packaging', 'print'],
    ar: [1.02, 1, 0.75, 1, 1.33, 0.75]
  },
  {
    slug: 'oman-summit',
    brand: 'OMAN',
    sub: 'Materials, Corrosion and Integrity Summit',
    logo: 'assets/portfolio/oman-summit/logo.png',
    logoAr: 1.7692,
    logoInvert: true,
    desc: 'This campaign design promotes the OMAN Materials, Corrosion &amp; Integrity Summit 2024 with a professional industrial theme. It uses a strong brown-and-white colour palette, corporate partner logos, bold conference details, and an oil field visual to reflect the event’s focus on corrosion, materials, and energy sector expertise.',
    tags: ['Logo Design', 'Brand Identity', 'Print Media', 'Colour Palette'],
    cats: ['branding', 'print'],
    ar: [0.8, 0.8, 1.04, 1.07, 1.5, 1.5, 2]
  },
  {
    slug: 'salmanstores',
    brand: 'SALMANSTORES',
    sub: 'Salalah Khareef Campaign',
    desc: 'Designed a vibrant Salalah Khareef Discounts flyer with a beach and travel theme, bold bilingual typography, a clear 20%–70% offer, product visuals, QR code, brand logos, and store details for print and digital promotion.',
    tags: ['Packaging Design', 'Print Media'],
    cats: ['packaging', 'print'],
    ar: [0.8, 1.33, 0.61, 0.8]
  }
];

window.PORTFOLIO_FILTERS = [
  { id: 'all',         label: 'All' },
  { id: 'branding',    label: 'Branding & Identity' },
  { id: 'packaging',   label: 'Packaging Design' },
  { id: 'print',       label: 'Print & Campaign' },
  { id: 'photography', label: 'Photography' }
];
