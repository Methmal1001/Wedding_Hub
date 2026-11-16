// "List your business" page content (dummy data – prices are sample prices).

export const plans = [
  {
    id: 'free',
    name: 'Basic',
    tagline: 'Get discovered by couples',
    monthly: 0,
    yearly: 0,
    icon: 'store',
    cta: 'Start for free',
    features: [
      { text: 'Business listing page', on: true },
      { text: 'Up to 3 photos', on: true },
      { text: 'Phone & address shown', on: true },
      { text: 'Couples can send enquiries', on: true },
      { text: 'Priority in search results', on: false },
      { text: 'Verified badge', on: false },
      { text: 'Featured on category pages', on: false },
      { text: 'Banner advertising', on: false }
    ]
  },
  {
    id: 'silver',
    name: 'Silver',
    tagline: 'Stand out in your category',
    monthly: 4900,
    yearly: 47000,
    icon: 'sparkles',
    cta: 'Choose Silver',
    popular: true,
    features: [
      { text: 'Business listing page', on: true },
      { text: 'Up to 15 photos', on: true },
      { text: 'Phone, e-mail & website shown', on: true },
      { text: 'Couples can send enquiries', on: true },
      { text: 'Priority in search results', on: true },
      { text: 'Verified badge', on: true },
      { text: 'Featured on category pages', on: false },
      { text: 'Banner advertising', on: false }
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    tagline: 'Maximum visibility',
    monthly: 9900,
    yearly: 95000,
    icon: 'rings',
    cta: 'Choose Gold',
    features: [
      { text: 'Business listing page', on: true },
      { text: 'Unlimited photos & videos', on: true },
      { text: 'Phone, e-mail, website & socials', on: true },
      { text: 'Couples can send enquiries', on: true },
      { text: 'Top position in search results', on: true },
      { text: 'Verified badge', on: true },
      { text: 'Featured on category pages', on: true },
      { text: 'One rotating banner each month', on: true }
    ]
  }
]

// Paid banner placements (these match the banners used around the site).
export const adPlacements = [
  {
    id: 'home-featured',
    name: 'Homepage featured vendor',
    where: 'Featured Vendors section on the homepage',
    price: 'LKR 15,000 / month',
    icon: 'sparkles',
    preview: 'featured'
  },
  {
    id: 'listing-banner',
    name: 'Main banner on listing pages',
    where: 'Rotating banner at the top of every vendor page',
    price: 'LKR 25,000 / month',
    icon: 'layers',
    preview: 'hero'
  },
  {
    id: 'category-side',
    name: 'Category side banner',
    where: 'Rotating side banner on category & service pages',
    price: 'LKR 12,000 / month',
    icon: 'store',
    preview: 'side'
  }
]

export const priceUnits = ['Package', 'Per guest (pax)', 'Per day', 'Per hour', 'Per item', 'Price on request']

export const faqs = [
  {
    q: 'How much does it cost to list my business?',
    a: 'A Basic listing is free forever. Upgrade to Silver or Gold any time for more photos, a verified badge and higher placement in search results.'
  },
  {
    q: 'How long does it take for my listing to go live?',
    a: 'Our team reviews every new listing to keep the directory trustworthy. Most listings are approved within 1–2 working days.'
  },
  {
    q: 'Can I list more than one service?',
    a: 'Yes. Choose all the services you offer in your category – for example Photographers and Videographers – and your listing appears on each service page.'
  },
  {
    q: 'How do couples contact me?',
    a: 'Couples can call you directly or send an enquiry from your listing page. Enquiries include their wedding date and contact details.'
  },
  {
    q: 'Can I change my plan or cancel?',
    a: 'Yes. You can upgrade, downgrade or cancel at any time. Yearly plans are billed once and save about 20%.'
  },
  {
    q: 'How do banner adverts work?',
    a: 'Banners rotate with a small number of other advertisers in the same spot. You choose the placement and the month, and we send you a simple performance report.'
  }
]

// Quotes from the fictional sample vendors in data/catalog.js
export const vendorStories = [
  {
    name: 'Malith Gunawardena',
    business: 'Candlelight Events',
    avatarId: 'c10',
    text: 'Within two months of listing we were getting enquiries every week. Couples arrive already knowing our work from the photos.'
  },
  {
    name: 'Nadeesha Wickramasinghe',
    business: 'Dream Bridal Studio',
    avatarId: 'c9',
    text: 'The enquiry form gives me the wedding date and phone number straight away, so I can reply the same day. It’s simple and it works.'
  },
  {
    name: 'Ruwan Dissanayake',
    business: 'Ceylon Feast Caterers',
    avatarId: 'c18',
    text: 'Upgrading to Gold put us at the top of the caterers page. Our bookings for the wedding season filled up faster than ever.'
  }
]
