// Wedding service categories and sub-categories (dummy data).
// Structure follows the category directory used by weddingdirectory.lk.
// `key` links categories to catalog listings (data/catalog.js) for filtering.
export const weddingCategories = [
  {
    key: 'cultural',
    name: 'Cultural Requirements',
    vendorCount: 46,
    image: '/images/categories/cultural.jpg',
    blurb: 'Astrologers, Ashtaka & traditional rites',
    subcategories: ['Ashtaka & Jayamangala Gatha', 'Astrologers', 'Counsellors', 'Marriage Brokers']
  },
  {
    key: 'decoration',
    name: 'Wedding Decoration',
    vendorCount: 164,
    image: '/images/categories/decoration.jpg',
    blurb: 'Florals, poruwa, lighting & settee backs',
    subcategories: [
      'Florists',
      'Balloons',
      'Balloon Decorations',
      'Dry Ice',
      'Flowers & Plants - Artificial',
      'Settee Backs & Oil Lamps',
      'Lighting',
      'Milk Fountains or Champagne Fountains',
      'Poruwa Suppliers'
    ]
  },
  {
    key: 'organisers',
    name: 'Wedding Organisers',
    vendorCount: 73,
    image: '/images/categories/organisers.jpg',
    blurb: 'Event management & wedding planners',
    subcategories: ['Event Management', 'Wedding Planners']
  },
  {
    key: 'attire',
    name: 'Wedding Attire',
    vendorCount: 152,
    image: '/images/categories/attire.jpg',
    blurb: 'Bridal wear, sarees & grooms’ wear',
    subcategories: [
      'Bridal Wear',
      'Wedding Frocks',
      'Grooms’ Wear',
      'Grooms’ Wear Renting',
      'Nilame Dress',
      'Wedding Sarees',
      'Accessories & Fancy Items',
      'Designing & Sewing',
      'Fabrics & Silks',
      'Lingerie',
      'Shoes'
    ]
  },
  {
    key: 'beauty',
    name: 'Wedding Day Beauty',
    vendorCount: 142,
    image: '/images/categories/beauty.jpg',
    blurb: 'Bridal dressing, hair, makeup & mehendi',
    subcategories: ['Beauticians & Hair Dressers', 'Bridal Mehendi', 'Cosmetic Products', 'Manicure & Pedicure', 'Salons']
  },
  {
    key: 'jewellery',
    name: 'Jewellery',
    vendorCount: 58,
    image: '/images/categories/jewellery.jpg',
    blurb: 'Gold, Kandyan & diamond bridal jewellery',
    subcategories: ['Gold Bridal Jewellery', 'Kandyan Jewellery', 'Bridal Jewellery - Other', 'Diamonds']
  },
  {
    key: 'photography',
    name: 'Photography & Videography',
    vendorCount: 186,
    image: '/images/categories/photography.jpg',
    blurb: 'Photographers, videographers & story books',
    subcategories: [
      'Photographers',
      'Videographers',
      'Story Books',
      'Photo Locations',
      'Photographic Colour Prints',
      'Picture Frames - Dealers'
    ]
  },
  {
    key: 'foods',
    name: 'Foods',
    vendorCount: 64,
    image: '/images/categories/foods.jpg',
    blurb: 'Caterers for every wedding menu',
    subcategories: ['Caterers']
  },
  {
    key: 'entertainment',
    name: 'Wedding Entertainment',
    vendorCount: 119,
    image: '/images/categories/entertainment.jpg',
    blurb: 'Bands, DJs, dancers & drummers',
    subcategories: [
      'Bands',
      'Classical Musicians',
      'Dancing Groups',
      'DJs',
      'Drummers',
      'First Dance Training',
      'Fireworks',
      'Wedding Dancers',
      'Comperes'
    ]
  },
  {
    key: 'cakes',
    name: 'Cakes & Chocolate',
    vendorCount: 88,
    image: '/images/categories/cakes.jpg',
    blurb: 'Wedding cakes, structures & chocolates',
    subcategories: [
      'Wedding Cakes',
      'Cake Structures',
      'Chocolates',
      'Chocolate Fountains',
      'Cake Making Ingredients',
      'Wedding Cake Boxes'
    ]
  },
  {
    key: 'stationery',
    name: 'Wedding Stationery',
    vendorCount: 37,
    image: '/images/categories/stationery.jpg',
    blurb: 'Invitations & wedding souvenirs',
    subcategories: ['Wedding Invitations', 'Wedding Souvenirs']
  },
  {
    key: 'venues',
    name: 'Wedding Venues',
    vendorCount: 248,
    image: '/images/categories/venues.jpg',
    blurb: 'Hotels, reception halls & destinations',
    subcategories: ['Hotels', 'Reception Halls', 'Romantic Destinations (Hotels)', 'Honeymoon & Tour Packages']
  },
  {
    key: 'transport',
    name: 'Travel and Transport',
    vendorCount: 51,
    image: '/images/categories/transport.jpg',
    blurb: 'Wedding cars, limousines & travel',
    subcategories: [
      'Car Hire & Limousines',
      'Horse Drawn Carriages',
      'Helicopters & Airlines',
      'Vehicle Hire',
      'Travel Agents'
    ]
  },
  {
    key: 'registrar',
    name: 'Wedding Registrar',
    vendorCount: 22,
    image: '/images/categories/registrar.jpg',
    blurb: 'Marriage registrars across the island',
    subcategories: ['Marriage Registrars']
  },
  {
    key: 'marquee',
    name: 'Marquee and Furniture',
    vendorCount: 34,
    image: '/images/categories/marquee.jpg',
    blurb: 'Tents, chairs & event furniture hire',
    subcategories: ['Hiring Tents & Chairs', 'Furniture']
  },
  {
    key: 'others',
    name: 'Others',
    vendorCount: 29,
    image: '/images/categories/others.jpg',
    blurb: 'Gifts, appliances, loans & security',
    subcategories: ['Gifts', 'Home Appliances', 'Wedding Loans', 'Wedding Security']
  }
]

export const categoryLabel = (key) =>
  weddingCategories.find((c) => c.key === key)?.name ?? key
