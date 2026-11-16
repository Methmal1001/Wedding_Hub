// Extra details for listing pages (dummy data – no API calls).
// Keyed by catalog id (data/catalog.js). Directory listings (real businesses)
// take their address/phone from data/vendors.js and get no invented reviews;
// the fictional sample listings below have full sample details.
// Phone numbers here are placeholders, not real numbers.
export const listingDetails = {
  c8: {
    address: '12 Galle Road, Bentota',
    phones: ['+94 34 000 0108'],
    hours: 'Daily, 8.00 am – 8.00 pm',
    since: 2009,
    capacity: 'Up to 400 guests',
    description:
      'A beachfront resort on the Bentota coast with a palm-lined lawn for poruwa ceremonies, an ocean-view ballroom and sunset terraces for cocktails. Our in-house wedding team handles décor, menus and guest rooms so your family can simply enjoy the day.',
    services: ['Beach-side poruwa ceremonies', 'Ocean-view ballroom', 'In-house catering & bar', 'Bridal suite & guest rooms', 'Décor & lighting packages', 'Homecoming & after-parties'],
    reviews: [
      { name: 'Ishani & Dilan', date: 'March 2026', rating: 5, text: 'The sunset ceremony on the lawn was magical. The team took care of everything and our guests still talk about the food.' },
      { name: 'Nethmi P.', date: 'December 2025', rating: 5, text: 'Beautiful venue and very responsive coordinators. Rooms for our families were spotless.' }
    ]
  },
  c9: {
    address: '45 Peradeniya Road, Kandy',
    phones: ['+94 81 000 0109'],
    hours: 'Tue – Sun, 9.00 am – 7.00 pm',
    since: 2014,
    description:
      'Bridal dressing studio in Kandy specialising in Kandyan and Indian bridal looks. From the first trial to the final touch-up, we create a look that lasts through every photo and every dance.',
    services: ['Kandyan bridal dressing', 'Indian & Western bridal looks', 'Bridal mehendi', 'Hair styling & veils', 'Bridesmaid & family makeup', 'Pre-wedding trials'],
    reviews: [
      { name: 'Sanduni W.', date: 'February 2026', rating: 5, text: 'I felt like a queen! The makeup stayed perfect from the poruwa ceremony until late night.' },
      { name: 'Hasini R.', date: 'November 2025', rating: 4.5, text: 'Lovely mehendi work and very friendly staff. Book your trial early – they get busy.' }
    ]
  },
  c10: {
    address: '8 Flower Road, Colombo 07',
    phones: ['+94 11 000 0110'],
    hours: 'Mon – Sat, 9.00 am – 6.00 pm',
    since: 2016,
    description:
      'Candlelight Events designs warm, glowing receptions – fairy-light canopies, candle walls and chandeliers that turn any hall or garden into something unforgettable.',
    services: ['Fairy-light & canopy installations', 'Candle walls & centrepieces', 'Stage & head-table backdrops', 'Uplighting & chandeliers', 'Entrance & walkway décor'],
    reviews: [
      { name: 'Kavindi & Shehan', date: 'January 2026', rating: 5, text: 'Our hall looked like a dream. Exactly what we showed them on Pinterest – and better.' },
      { name: 'Dulani M.', date: 'October 2025', rating: 4.5, text: 'Great ideas and very punctual setup. Pricing was clear from the start.' }
    ]
  },
  c11: {
    address: '23 Maithripala Senanayake Mawatha, Anuradhapura',
    phones: ['+94 25 000 0111'],
    hours: 'Daily, 8.00 am – 8.00 pm',
    since: 2015,
    description:
      'Cinematic wedding films and highlight reels shot in 4K with drone coverage. We tell your story with natural moments, heartfelt speeches and the little details you might have missed.',
    services: ['Full-day wedding films', 'Highlight reels', 'Drone coverage', 'Pre-shoot videos', 'Same-day edits', 'Live streaming for overseas guests'],
    reviews: [
      { name: 'Tharushi & Kalana', date: 'March 2026', rating: 5, text: 'We cried watching our film. The drone shots of the ancient city were breathtaking.' },
      { name: 'Ravindu S.', date: 'August 2025', rating: 4, text: 'Beautiful work. Delivery took a little longer than expected but it was worth the wait.' }
    ]
  },
  c12: {
    address: '102 High Level Road, Nugegoda',
    phones: ['+94 11 000 0112'],
    hours: 'Mon – Sat, 8.30 am – 7.00 pm',
    since: 2012,
    description:
      'Home-style bakery creating tiered wedding cakes, cake structures and traditional wedding cake pieces in custom boxes – made fresh with real butter and plenty of love.',
    services: ['Tiered wedding cakes', 'Cake structures', 'Wedding cake pieces & boxes', 'Dessert tables', 'Tasting sessions'],
    reviews: [
      { name: 'Piumi K.', date: 'February 2026', rating: 5, text: 'Delicious and stunning – the sugar flowers looked real!' },
      { name: 'Asanka D.', date: 'September 2025', rating: 4.5, text: 'Guests loved the cake pieces. Boxes were neatly packed and delivered on time.' }
    ]
  },
  c13: {
    address: '17 Anagarika Dharmapala Mawatha, Matara',
    phones: ['+94 41 000 0113'],
    hours: 'Mon – Sat, 9.00 am – 6.00 pm',
    since: 2011,
    description:
      'Full-service wedding planners in the south. We manage budgets, vendors, timelines and the day itself so you can be present for every moment.',
    services: ['Full wedding planning', 'Day-of coordination', 'Vendor sourcing & booking', 'Budget management', 'Destination weddings in the south'],
    reviews: [
      { name: 'Nadeesha & Chamod', date: 'January 2026', rating: 5, text: 'Stress-free from start to finish. They handled a sudden rain plan without us noticing!' },
      { name: 'Hiruni A.', date: 'July 2025', rating: 4.5, text: 'Very organised and honest about costs. Highly recommended.' }
    ]
  },
  c14: {
    address: '5 Colombo Road, Kurunegala',
    phones: ['+94 37 000 0114'],
    hours: 'Daily, 10.00 am – 9.00 pm',
    since: 2013,
    description:
      'A six-piece live band playing Sinhala classics, baila, English pop and first-dance favourites, with full sound and lighting included.',
    services: ['Live band', 'Acoustic ceremony music', 'DJ sets between sessions', 'Sound & lighting', 'Baila & dance sessions'],
    reviews: [
      { name: 'Sahan P.', date: 'December 2025', rating: 4.5, text: 'The dance floor was full all night. Great baila medley!' },
      { name: 'Ayesha F.', date: 'June 2025', rating: 4.5, text: 'They learnt our first-dance song specially for us. Thank you!' }
    ]
  },
  c15: {
    address: '3 Church Street, Galle Fort',
    phones: ['+94 91 000 0115'],
    hours: 'Daily, 9.00 am – 9.00 pm',
    since: 2010,
    capacity: 'Up to 250 guests',
    description:
      'A restored colonial pavilion inside the Galle Fort with sea-wall views, a courtyard for ceremonies and an elegant banquet hall for receptions.',
    services: ['Courtyard ceremonies', 'Banquet hall', 'Sea-view cocktail terrace', 'Custom menus', 'Heritage photo locations'],
    reviews: [
      { name: 'Methsara & Nuwan', date: 'February 2026', rating: 5, text: 'The fort at golden hour is unbeatable. Staff were warm and professional.' },
      { name: 'Ruwani L.', date: 'October 2025', rating: 5, text: 'Elegant, intimate and the food was excellent.' }
    ]
  },
  c16: {
    address: '41 Puttalam Road, Kurunegala',
    phones: ['+94 37 000 0116'],
    hours: 'Mon – Sat, 9.00 am – 6.00 pm',
    since: 2008,
    description:
      'Traditional poruwa and settee-back décor with fresh flowers, brass oil lamps and handcrafted details that honour Sri Lankan wedding customs.',
    services: ['Poruwa design & setup', 'Settee backs & oil lamps', 'Fresh flower décor', 'Ashtaka stage setup', 'Table & entrance décor'],
    reviews: [
      { name: 'Dilini & Kasun', date: 'January 2026', rating: 5, text: 'Our poruwa was the most beautiful we have ever seen.' },
      { name: 'Shanika J.', date: 'May 2025', rating: 4, text: 'Lovely flowers, setup finished well before the auspicious time.' }
    ]
  },
  c17: {
    address: '9 Galaha Road, Peradeniya',
    phones: ['+94 81 000 0117'],
    hours: 'Mon – Sat, 8.00 am – 5.00 pm',
    since: 1998,
    description:
      'Horoscope matching and auspicious-time (nakath) reading for weddings, homecomings and every ritual in between, with over 25 years of experience.',
    services: ['Horoscope matching', 'Auspicious times (nakath)', 'Poruwa ceremony timings', 'Homecoming timings', 'Consultations in Sinhala & English'],
    reviews: [
      { name: 'Chathura W.', date: 'March 2026', rating: 5, text: 'Very patient and explained everything clearly to both families.' },
      { name: 'Madhavi S.', date: 'September 2025', rating: 4.5, text: 'Accurate and kind. Gave us written timings for every ritual.' }
    ]
  },
  c18: {
    address: '66 Lewis Place, Negombo',
    phones: ['+94 31 000 0118'],
    hours: 'Daily, 8.00 am – 8.00 pm',
    since: 2006,
    description:
      'Wedding caterers serving Sri Lankan, seafood and international buffets with live stations, from intimate homecomings to receptions of 1,000 guests.',
    services: ['Wedding buffets', 'Live cooking stations', 'Seafood specialities', 'Kavum, kokis & sweets tables', 'Tasting sessions', 'Service staff & crockery'],
    reviews: [
      { name: 'Lakshan & Imesha', date: 'February 2026', rating: 5, text: 'The crab curry station was the highlight of the night!' },
      { name: 'Priyanka D.', date: 'August 2025', rating: 4, text: 'Tasty food and generous portions. Service staff were polite.' }
    ]
  },
  c19: {
    address: '210 Parliament Road, Rajagiriya',
    phones: ['+94 11 000 0119'],
    hours: 'Mon – Fri, 9.00 am – 5.30 pm',
    since: 2017,
    description:
      'Custom wedding invitations, foil-printed cards, thank-you notes and cake boxes – designed to match your theme and printed on premium paper.',
    services: ['Custom invitation design', 'Foil & letterpress printing', 'Thank-you cards', 'Wedding cake boxes', 'Digital e-invites'],
    reviews: [
      { name: 'Nimesha & Ruchira', date: 'January 2026', rating: 5, text: 'Gorgeous gold-foil cards. Guests kept them as keepsakes.' },
      { name: 'Thilini G.', date: 'July 2025', rating: 4.5, text: 'Quick turnaround and helpful with wording in Sinhala and English.' }
    ]
  },
  c20: {
    address: '88 High Level Road, Maharagama',
    phones: ['+94 11 000 0120'],
    hours: 'Daily, 7.00 am – 9.00 pm',
    since: 2012,
    description:
      'Vintage and luxury wedding cars with uniformed chauffeurs, ribbons and floral décor included – for the bride, the groom and the whole party.',
    services: ['Vintage wedding cars', 'Luxury sedans', 'Chauffeur service', 'Car décor', 'Guest transport'],
    reviews: [
      { name: 'Hansi P.', date: 'March 2026', rating: 4.5, text: 'The vintage car made our photos. Driver was on time and very courteous.' },
      { name: 'Kalum R.', date: 'November 2025', rating: 4.5, text: 'Clean cars and fair prices.' }
    ]
  },
  c21: {
    address: '14 Kandy Road, Gampaha',
    phones: ['+94 33 000 0121'],
    hours: 'Mon – Sat, 8.30 am – 4.30 pm',
    since: 2015,
    description:
      'Marriage registration at your venue or office, with friendly guidance on documents, witnesses and timings.',
    services: ['On-site marriage registration', 'Office registrations', 'Document guidance', 'Weekend appointments'],
    reviews: [
      { name: 'Sandun & Pavithra', date: 'February 2026', rating: 5, text: 'Smooth and quick, and she explained everything to our parents too.' },
      { name: 'Ashen K.', date: 'June 2025', rating: 5, text: 'Very professional and arrived early.' }
    ]
  },
  c22: {
    address: '27 Dambulla Road, Kurunegala',
    phones: ['+94 37 000 0122'],
    hours: 'Mon – Sat, 8.00 am – 6.00 pm',
    since: 2010,
    description:
      'Marquees, tents, tables, chairs and furniture for garden and home weddings, delivered, set up and cleared by our own crew.',
    services: ['Marquees & tents', 'Tables & chairs', 'Chair covers & sashes', 'Lounge furniture', 'Setup & clearing'],
    reviews: [
      { name: 'Udara S.', date: 'January 2026', rating: 4.5, text: 'The marquee held up perfectly in the rain. Crew was hardworking.' },
      { name: 'Nayomi B.', date: 'September 2025', rating: 4.5, text: 'Neat furniture and good value.' }
    ]
  },
  c23: {
    address: '19 Lighthouse Street, Galle',
    phones: ['+94 91 000 0123'],
    hours: 'Daily, 9.00 am – 7.00 pm',
    since: 2018,
    description:
      'Wedding souvenirs, guest favours and gift hampers – handmade, personalised and packed beautifully for your big day.',
    services: ['Guest favours', 'Personalised souvenirs', 'Gift hampers', 'Bridal party gifts', 'Island-wide delivery'],
    reviews: [
      { name: 'Ishara & Pasindu', date: 'March 2026', rating: 5, text: 'Our guests loved the little tea-pack favours with our names.' },
      { name: 'Kumudu T.', date: 'October 2025', rating: 4.5, text: 'Beautiful packaging and great communication.' }
    ]
  }
}
