/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
};

const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Get coordinates for specific restaurants by name
 * For known restaurants, use exact coordinates
 * Updated with all 171 restaurants coordinates
 */
const getRestaurantCoordinates = (restaurantName) => {
  const restaurantCoords = {
    // All 171 restaurants with coordinates
    'Sakuntong': { lat: 7.888525995192544, lon: 98.39367098032648 },
    'Breakfast time': { lat: 7.900827534840248, lon: 98.38096381100837 },
    'Talung Thai': { lat: 7.933791661660059, lon: 98.26229030362587 },
    'Phuket Izakaya & Noodle Bar': { lat: 7.858927183386344, lon: 98.36352137294071 },
    'PhuketIzakaya&NoodleBar': { lat: 7.858927183386344, lon: 98.36352137294071 },
    'SHABU SAN': { lat: 7.90853312611223, lon: 98.37287814964637 },
    'Royd': { lat: 7.887169944235028, lon: 98.38609538032638 },
    'Chuan Chim': { lat: 7.883809499547655, lon: 98.39237399623897 },
    'OOO Burger Phuket': { lat: 7.980348568253512, lon: 98.33896586499073 },
    'Burger Saloon': { lat: 7.909924407488527, lon: 98.3021101411791 },
    'Rosemary Bakehouse': { lat: 7.979917770944053, lon: 98.35804601158473 },
    'Rongkopi': { lat: 7.8829516950259615, lon: 98.38333508946185 },
    'Passion Bakery & Restaurant': { lat: 7.900348011536375, lon: 98.35008322634893 },
    'Golden Kinnaree Buffet Restaurant': { lat: 7.956447984887647, lon: 98.2870100649895 },
    'We Cafe\' Salad & Coffee': { lat: 7.875993455319838, lon: 98.34806576116632 },
    'Meesapam Khun Yai Chian': { lat: 7.948560557524742, lon: 98.39166788828604 },
    'Kindee Bistro': { lat: 8.008694997100775, lon: 98.3149400882893 },
    'Go La': { lat: 7.877361562521073, lon: 98.39315568032592 },
    'Seoul Gogi': { lat: 7.880431917747952, lon: 98.39868640362302 },
    'Surf & Turf by Soul Kitchen': { lat: 7.884584878231631, lon: 98.39024270362326 },
    'O Cha Rot': { lat: 7.885984108183238, lon: 98.38753471896396 },
    'Pizzeria Da Moreno': { lat: 7.885939470544406, lon: 98.38693315526984 },
    'Giant Curry Rice': { lat: 7.8804, lon: 98.3923 }, // Default coordinates - missing in provided data
    'Pizza on Fire': { lat: 8.004069819280003, lon: 98.29612804169506 },
    'Pek Lan Mala ChuanChuan': { lat: 7.838549343310671, lon: 98.33839025879907 },
    'O Tao Bang Niao': { lat: 7.876931389898787, lon: 98.39381381100712 },
    'La Gaetana': { lat: 7.8772530313288165, lon: 98.39400651839132 },
    'LaGaetana': { lat: 7.8772530313288165, lon: 98.39400651839132 },
    'Me Nam Yaa': { lat: 7.014189218603489, lon: 100.48750152630821 },
    'Heh': { lat: 7.890329465743694, lon: 98.38675975760177 },
    'Akiko\'s Tea': { lat: 7.883865910621465, lon: 98.37568685080387 },
    'Daeud Hot Pot': { lat: 7.8804, lon: 98.3923 }, // Default coordinates - missing in provided data
    'PORDEE Home Cafe': { lat: 7.903211508225557, lon: 98.37741286498664 },
    'Jaras': { lat: 7.963045908526048, lon: 98.2839705269244 },
    'Ryujin Sushi': { lat: 7.890804883056305, lon: 98.36637882634841 },
    'Ying Charoen BBQ Phuket': { lat: 7.877729295146603, lon: 98.38660557177113 },
    'Big Boys Burger Club': { lat: 7.9511264984445855, lon: 98.28373226720359 },
    'Kin Kon Krua': { lat: 7.886804312479665, lon: 98.38632870362342 },
    'Khun Jeed Yod Pak': { lat: 7.877630141164058, lon: 98.39418186498526 },
    'Go Benz': { lat: 7.885625375970388, lon: 98.38262566498575 },
    'Khao Tom Thanon Di Buk': { lat: 7.884332849526611, lon: 98.39738753430443 },
    'Yo Vegetarian': { lat: 7.907558069433955, lon: 98.37545558089965 },
    'One Chun': { lat: 7.887083958249879, lon: 98.39066933430458 },
    'OneChun': { lat: 7.887083958249879, lon: 98.39066933430458 },
    'Shimmer Beachfront Restaurant': { lat: 7.963139197040638, lon: 98.28384741101165 },
    'Lod Chong Lor Rong': { lat: 7.8804, lon: 98.3923 }, // Default coordinates - missing in provided data
    'Chao Leh Kitchen': { lat: 7.90500486529931, lon: 98.29863778828371 },
    'Bubb': { lat: 7.881261774470121, lon: 98.3932567277148 },
    'Tai Omakase by Red Snapper': { lat: 7.882278010674889, lon: 98.38209870982234 },
    'Loba Bang Niao': { lat: 7.8804, lon: 98.3923 }, // Default coordinates - missing in provided data
    'The thai Library': { lat: 7.896009601400449, lon: 98.37610014429576 },
    'The Thai Library': { lat: 7.896009601400449, lon: 98.37610014429576 },
    'Ezze Sushi': { lat: 7.875530597896167, lon: 98.37862800362274 },
    'Joke samui2': { lat: 7.88474928094611, lon: 98.3824386036233 },
    'Joke Samui': { lat: 7.88474928094611, lon: 98.3824386036233 },
    'Her Ter vegetarian': { lat: 7.8804, lon: 98.3923 }, // Default coordinates - missing in provided data
    'Homemade Desserts Phuket by Anastasia Mayer': { lat: 7.8452004773762045, lon: 98.30058656555575 },
    'Rawee Rot Grilled Pork': { lat: 7.8804, lon: 98.3923 }, // Default coordinates - missing in provided data
    'Have You Eaten Yet Shabu': { lat: 7.858655859276942, lon: 98.36212108089705 },
    'Mellow Yellow': { lat: 7.890196664358605, lon: 98.39211815502995 },
    'Dimsum House Phuket': { lat: 8.010997187955219, lon: 98.31552816499243 },
    'DimsumHousePhuket': { lat: 8.010997187955219, lon: 98.31552816499243 },
    'Ruamjai Vegetarian': { lat: 8.261123884868729, lon: 98.35075502567018 },
    'Bang Jiem': { lat: 7.918175289484228, lon: 98.33568035287419 },
    'Age Restaurant': { lat: 8.041379439883654, lon: 98.2821839897654 },
    'AOGAMI Ramen Cafe': { lat: 7.888534039515719, lon: 98.39350541100775 },
    'Ramen Sakaba Naruto': { lat: 7.862084311274122, lon: 98.36243155577432 },
    'CHACHA TEA': { lat: 7.889275034206193, lon: 98.3785676064927 },
    'Mu Krop Chi Hong': { lat: 7.885625018301697, lon: 98.37934836498574 },
    'Thanawat T Food Pork BBQ': { lat: 7.869631954994199, lon: 98.3779653990197 },
    'GEWBURGER': { lat: 7.9081101709792145, lon: 98.37418038828389 },
    'Krua Baan Platong': { lat: 7.9973354431743235, lon: 98.35534059624509 },
    'Kha Mu Boran': { lat: 7.911711153938428, lon: 98.33465800362465 },
    'Kinsu Asia Bar': { lat: 7.8804, lon: 98.3923 }, // Default coordinates - missing in provided data
    'Pae Yim Coffee': { lat: 7.9189340653183775, lon: 98.33459608625539 },
    'Booktree Library': { lat: 8.02638679723404, lon: 98.40235681101508 },
    'Poonpol Shrimp Grill': { lat: 7.881310220225329, lon: 98.39637492230204 },
    'Maha Shabu': { lat: 7.862428202325748, lon: 98.36735918825971 },
    'MahaShabu': { lat: 7.862428202325748, lon: 98.36735918825971 },
    'La Casina Rossa': { lat: 7.918843717194491, lon: 98.34003923430632 },
    'Ta Khai': { lat: 7.891611319612352, lon: 98.27045829777826 },
    'TaKhai': { lat: 7.891611319612352, lon: 98.27045829777826 },
    'Haidilao Hot Pot': { lat: 7.893470338452746, lon: 98.36772968828309 },
    'Wagyu Steakhouse': { lat: 7.977655775040214, lon: 98.28164550362817 },
    'WagyuSteakhouse': { lat: 7.977655775040214, lon: 98.28164550362817 },
    'Baan Omakase Phuket': { lat: 7.8800826269273765, lon: 98.38366709566664 },
    'Metro Roast Duck': { lat: 7.887477191972293, lon: 98.3989871233313 },
    'Rongtiem dimsum': { lat: 7.894276039697335, lon: 98.36523448828315 },
    'Khrua Ohm': { lat: 7.908073433303954, lon: 98.34895464964632 },
    'KhruaOhm': { lat: 7.908073433303954, lon: 98.34895464964632 },
    'O-OH Farm Suanluang': { lat: 7.880715305746133, lon: 98.37939306498549 },
    'Hello Shabu': { lat: 7.880668096877063, lon: 98.39656934964479 },
    'Super Dimsum': { lat: 7.946738616456423, lon: 98.39250043619106 },
    'SuperDimsum': { lat: 7.946738616456423, lon: 98.39250043619106 },
    'SHOKUN': { lat: 7.902853233627022, lon: 98.37901884964604 },
    'Poju Juice & Smoothie': { lat: 7.886732983076002, lon: 98.39608182692034 },
    'Peang Prai': { lat: 8.04223130071151, lon: 98.39561102157349 },
    'KOI Thé': { lat: 7.893050839753613, lon: 98.36760430362368 },
    '154 Bakery': { lat: 7.8831523238438885, lon: 98.3949015189638 },
    'Fuku Matcha': { lat: 7.898957527449591, lon: 98.36923499662696 },
    'Chom Chan': { lat: 7.900868954448293, lon: 98.38232741100833 },
    'Il Giardino Ristorante': { lat: 7.9691326470002055, lon: 98.2838334638989 },
    'Misoya Ramen': { lat: 7.993391846306466, lon: 98.3062907263539 },
    'Ket Ho Dimsum': { lat: 7.904534796482576, lon: 98.35182418089951 },
    'Go Ang Seafood': { lat: 7.8802750589210975, lon: 98.39217414226059 },
    'Roti Thaew Nam': { lat: 7.885457818561986, lon: 98.39119737236996 },
    'Salaloy': { lat: 7.775070672783377, lon: 98.32549194225518 },
    'Chapeau Mookata': { lat: 7.889914383235869, lon: 98.37727792189301 },
    'Kao Tom Hokkian': { lat: 7.8888856224899175, lon: 98.38212948828286 },
    'Butter Grill Phuket': { lat: 8.018768492529183, lon: 98.35272601311844 },
    'Hong Khao Tom Pla': { lat: 7.877008989809946, lon: 98.39297065760103 },
    'Edo Ramen': { lat: 7.905361587536977, lon: 98.36865772692128 },
    'Blue Elephant': { lat: 7.889971451904549, lon: 98.38410650062879 },
    'Niyom Salt Grilled Duck': { lat: 7.866807847562852, lon: 98.34920470362236 },
    'Mee Ton Poe 1': { lat: 7.881188446171858, lon: 98.39187807294181 },
    'Kochai Icecream': { lat: 7.885781166025351, lon: 98.38262464226091 },
    'Torrys Ice Cream': { lat: 7.886109927097558, lon: 98.38927276498579 },
    'I Tim Boran Lung Dam': { lat: 7.906043653625622, lon: 98.37712476441757 },
    'Kruvit Raft': { lat: 7.971192182979925, lon: 98.35695523933455 },
    'Suchat Since 1987': { lat: 7.903036425289917, lon: 98.37723818160424 },
    'Kopi De Phuket': { lat: 7.882876822579482, lon: 98.39087358089837 },
    'Bang Nam Kon': { lat: 7.906424461927273, lon: 98.37915694398548 },
    'Yakiniku 9999': { lat: 7.901664645692122, lon: 98.37737240362414 },
    'DOUBLE P BURGER': { lat: 7.954313183951255, lon: 98.28820088650701 },
    'Santa Fe Steak': { lat: 7.901403828140277, lon: 98.36886903796112 },
    'NanaHealthy Cafe': { lat: 7.954657780991672, lon: 98.38371608032998 },
    'Yian Suki': { lat: 7.8904737392747775, lon: 98.33004268410387 },
    'PAN Burger Phuket': { lat: 7.955765727641955, lon: 98.38457143373608 },
    'Roti Taotarn': { lat: 7.8804, lon: 98.3923 }, // Default coordinates - missing in provided data
    'PRU': { lat: 8.039242057856148, lon: 98.27693852635639 },
    'Namaste Vegetarian': { lat: 7.893202015321592, lon: 98.29805203430492 },
    'Ma Doo Bua': { lat: 8.022221927615707, lon: 98.32848500863194 },
    'FIVE Loaves Burgers & Cafe': { lat: 7.884155601098969, lon: 98.39281925760142 },
    'Shree Hare Krishna': { lat: 7.898884513358605, lon: 98.30004306498638 },
    'Vegetarian Meal Plan': { lat: 7.8898299234810265, lon: 98.29523654500554 },
    'Jiajayvegan': { lat: 7.887491665615208, lon: 98.3022746590311 },
    'Soul Beach Cafe': { lat: 7.87970935173739, lon: 98.38647225010385 },
    'Kanomjean Saphan hin': { lat: 7.868485526073957, lon: 98.39599944838352 },
    'Mee Ao Kae': { lat: 7.90274190730909, lon: 98.37972840362423 },
    'Oishi Eaterium': { lat: 7.889307100503862, lon: 98.36663847582844 },
    'OishiEaterium': { lat: 7.889307100503862, lon: 98.36663847582844 },
    'Tew Tem Toh': { lat: 7.884998257963873, lon: 98.39391825021725 },
    'Hana cafe': { lat: 7.887931159411924, lon: 98.39327451827485 },
    'Hana Cafe': { lat: 7.887931159411924, lon: 98.39327451827485 },
    'HanaCafe': { lat: 7.887931159411924, lon: 98.39327451827485 },
    'Sommai Kai Steak': { lat: 7.9079764346525705, lon: 98.37236811839294 },
    'Shabu Lion': { lat: 7.888332670085469, lon: 98.37767701781975 },
    'BAIKINGU': { lat: 7.873093205160787, lon: 98.36731357236935 },
    'Phuketique': { lat: 7.884435498058767, lon: 98.38691204226086 },
    'Ilona Cake Phuket': { lat: 7.922709291401163, lon: 98.32994781100955 },
    'Gorjan': { lat: 7.898115623802273, lon: 98.29976401839238 },
    'J Nang Vegan & Vegetarian restaurant': { lat: 7.902281160335175, lon: 98.30053649268993 },
    'Drunken Burger & BBQ at Phuket Town': { lat: 7.883402270950471, lon: 98.3907137036232 },
    'Chokchai Dimsum': { lat: 7.887491765448124, lon: 98.37556060362347 },
    'Yuji Noodles': { lat: 7.8817616646777084, lon: 98.37280840362308 },
    'VEGAN PHUKET': { lat: 7.88448016435936, lon: 98.39061752104361 },
    'Jae Lee Chicken Rice': { lat: 7.883731010196007, lon: 98.38235682128739 },
    'Mook Manee': { lat: 7.775950321698784, lon: 98.32833274225527 },
    'The Smokaccia Laboratory': { lat: 7.976824875171857, lon: 98.28493231896877 },
    'Ko Yoon Hokien': { lat: 7.884500236935651, lon: 98.38729901100747 },
    'IRISH GRILL Steak House': { lat: 7.985132861050005, lon: 98.36715098033164 },
    'A Pong Mae Sunee': { lat: 7.886371798104265, lon: 98.38770012634816 },
    'Rim Talay Restaurant': { lat: 7.887668471529427, lon: 98.28450938828283 },
    'Mae Ting Khanom Jeen': { lat: 7.889425412383643, lon: 98.3848101422611 },
    'Mai Nam Cafe': { lat: 7.88506960361428, lon: 98.38675581157969 },
    'Onikushabu': { lat: 7.886478159987203, lon: 98.39804738032642 },
    'Rotee Suan Luang': { lat: 7.8771238481097825, lon: 98.36809172366043 },
    'Wassana moo kra ta phuket': { lat: 7.8817207644117016, lon: 98.36653308828247 },
    'Pizza Lovers By La Taverna': { lat: 7.994202731993743, lon: 98.3049747576073 },
    'After You': { lat: 7.894949387066896, lon: 98.36989130297636 },
    'Ricco Gelato': { lat: 7.918951821988192, lon: 98.38480911158142 },
    'Pathongko Mae Pranee': { lat: 7.881617624539036, lon: 98.36726740362313 },
    'Kero Japanese Restaurant': { lat: 7.89955808187366, lon: 98.3568970796345 },
    'Wu Lin Hot Pot': { lat: 7.87124010808783, lon: 98.38521868770984 },
    'Hosay Bowl': { lat: 7.894928454029499, lon: 98.3676534784958 },
    'Nueng Milk Nuah': { lat: 7.8847071100400346, lon: 98.3825927496451 },
    'Tu Kab Khao': { lat: 7.884276420401067, lon: 98.38783720362326 },
    'Mor Mu Dong': { lat: 7.843601041859431, lon: 98.37205526498356 },
    'Mata Phuket': { lat: 7.904983741139748, lon: 98.38873818771151 },
    'The Charm Dining Gallery': { lat: 7.886347765348261, lon: 98.38614763430462 },
    'Mix Burger': { lat: 7.8169669084809525, lon: 98.3395108263446 },
    'Roti Chaofa': { lat: 7.878856428834937, lon: 98.38103583373204 },
    'Lertrod': { lat: 8.101087452680298, lon: 98.30811352578769 },
    'Samut': { lat: 7.782277937872495, lon: 98.3101182649804 },
    'Jampa': { lat: 8.039875401505206, lon: 98.31772818771887 },
  };

  if (!restaurantName) return null;

  // Normalize restaurant name: decode HTML entities, trim whitespace, normalize special characters
  const normalizeName = (name) => {
    return name
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .trim()
      .replace(/\s+/g, ' '); // Normalize multiple spaces to single space
  };

  const normalizedInput = normalizeName(restaurantName);

  // Try exact match first (with original and normalized)
  if (restaurantCoords[restaurantName]) {
    return restaurantCoords[restaurantName];
  }
  if (restaurantCoords[normalizedInput]) {
    return restaurantCoords[normalizedInput];
  }

  // Try case-insensitive exact match with normalized names
  const exactMatch = Object.keys(restaurantCoords).find(key => {
    const normalizedKey = normalizeName(key);
    return normalizedKey.toLowerCase() === normalizedInput.toLowerCase();
  });
  if (exactMatch) {
    return restaurantCoords[exactMatch];
  }

  // Try case-insensitive partial match with normalized names
  const restaurantKey = Object.keys(restaurantCoords).find(key => {
    const normalizedKey = normalizeName(key);
    const keyLower = normalizedKey.toLowerCase();
    const inputLower = normalizedInput.toLowerCase();
    return keyLower === inputLower ||
           inputLower.includes(keyLower) ||
           keyLower.includes(inputLower);
  });

  return restaurantKey ? restaurantCoords[restaurantKey] : null;
};

/**
 * Get coordinates for Phuket locations
 * Since restaurants don't have coordinates in the data, we'll use approximate coordinates
 * for Phuket districts
 */
export const getPhuketLocationCoordinates = (locationName, restaurantName = null) => {
  // First, try to get coordinates from restaurant name
  if (restaurantName) {
    const restaurantCoords = getRestaurantCoordinates(restaurantName);
    if (restaurantCoords) {
      return restaurantCoords;
    }
  }

  const locations = {
    'Mueang Phuket': { lat: 7.8804, lon: 98.3923 },
    'Phuket': { lat: 7.8804, lon: 98.3923 },
    'Wichit': { lat: 7.8847, lon: 98.3800 },
    'Kathu': { lat: 7.9167, lon: 98.3500 },
    'Talang': { lat: 8.0333, lon: 98.3000 },
    'Patong': { lat: 7.8961, lon: 98.2961 },
    'Karon': { lat: 7.8472, lon: 98.2981 },
    'Kamala': { lat: 7.9389, lon: 98.2764 },
    'Talat Yai': { lat: 7.8842, lon: 98.3889 }, // Subdistrict for Hana Cafe
    'Talat Yai, Mueang Phuket': { lat: 7.8842, lon: 98.3889 },
    // Default to Phuket city center if location not found
    'default': { lat: 7.8804, lon: 98.3923 },
  };

  if (!locationName) return locations.default;

  // Try to match location name (case insensitive, partial match)
  const locationKey = Object.keys(locations).find(key => 
    key.toLowerCase().includes(locationName.toLowerCase()) ||
    locationName.toLowerCase().includes(key.toLowerCase())
  );

  return locations[locationKey] || locations.default;
};

/**
 * Get restaurant coordinates - tries restaurant name first, then location
 */
export const getRestaurantLocationCoordinates = (restaurant) => {
  if (!restaurant) return { lat: 7.8804, lon: 98.3923 }; // Default Phuket center

  // ใช้ coordinates จาก backend ก่อน (ถ้ามี)
  if (restaurant.latitude != null && restaurant.longitude != null) {
    return { 
      lat: parseFloat(restaurant.latitude), 
      lon: parseFloat(restaurant.longitude) 
    };
  }

  // Fallback: ใช้ hardcoded coordinates
  const restaurantName = restaurant.restaurantName || restaurant.name || null;
  const location = restaurant.location || null;

  // Try restaurant name first
  const restaurantCoords = getRestaurantCoordinates(restaurantName);
  if (restaurantCoords) {
    // Debug: Log when using fallback coordinates
    if (process.env.NODE_ENV === 'development') {
      console.log(`📍 Using fallback coordinates for: ${restaurantName}`, restaurantCoords);
    }
    return restaurantCoords;
  }

  // Debug: Log when coordinates not found
  if (process.env.NODE_ENV === 'development' && restaurantName) {
    console.warn(`⚠️ Coordinates not found for restaurant: "${restaurantName}"`);
  }

  // Fall back to location-based coordinates
  return getPhuketLocationCoordinates(location, restaurantName);
};

/**
 * Check if restaurant is within radius of user location
 * @param {Object} restaurant - Restaurant object
 * @param {Object} userLocation - { lat, lon }
 * @param {number} radiusKm - Radius in kilometers (default 5km)
 * @returns {boolean} True if restaurant is within radius, false if outside or invalid location
 */
export const isWithinRadius = (restaurant, userLocation, radiusKm = 5) => {
  // Validate userLocation - must have valid lat and lon (not null, undefined, 0, or NaN)
  if (!userLocation || 
      userLocation.lat == null || 
      userLocation.lon == null ||
      isNaN(userLocation.lat) || 
      isNaN(userLocation.lon) ||
      userLocation.lat === 0 && userLocation.lon === 0) {
    return false; // If no valid user location, return false (don't count as within radius)
  }

  const restaurantCoords = getRestaurantLocationCoordinates(restaurant);
  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lon,
    restaurantCoords.lat,
    restaurantCoords.lon
  );

  return distance <= radiusKm;
};

/**
 * Get distance from user location to restaurant
 * @param {Object} restaurant - Restaurant object
 * @param {Object} userLocation - { lat, lon }
 * @returns {number|null} Distance in kilometers, or null if no user location
 */
export const getDistanceToRestaurant = (restaurant, userLocation) => {
  if (!userLocation || !userLocation.lat || !userLocation.lon) {
    return null;
  }

  const restaurantCoords = getRestaurantLocationCoordinates(restaurant);
  return calculateDistance(
    userLocation.lat,
    userLocation.lon,
    restaurantCoords.lat,
    restaurantCoords.lon
  );
};

