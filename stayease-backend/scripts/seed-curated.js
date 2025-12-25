#!/usr/bin/env node
// Seed curated, realistic hostel/PG-style listings across India.
// Requires an OWNER JWT (e.g., from owner@test.com / password123).
//
// Usage:
// node scripts/seed-curated.js --token "<JWT>" [--base http://localhost:8080] [--max 180] [--rooms 3]

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const idx = args.indexOf(`--${name}`);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return fallback;
};

const BASE_URL = getArg('base', process.env.BASE_URL || 'http://localhost:8080');
const TOKEN = getArg('token', process.env.TOKEN);
const MAX = Number(getArg('max', '180'));
const ROOMS_PER_PROPERTY = Number(getArg('rooms', '3'));

if (!TOKEN) {
  console.error('Missing token. Example: node scripts/seed-curated.js --token "<JWT>" --max 160');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

// Curated hostel/PG-like entries (fictionalized but location-accurate).
const curated = [
  { name: 'Indiranagar Comfort PG', city: 'Bangalore', state: 'Karnataka', pincode: '560038', address: '12 CMH Road, Indiranagar', lat: 12.9716, lon: 77.6416 },
  { name: 'Koramangala Nest Hostel', city: 'Bangalore', state: 'Karnataka', pincode: '560095', address: '5th Block, Koramangala', lat: 12.9352, lon: 77.6245 },
  { name: 'HSR Layout StayHub', city: 'Bangalore', state: 'Karnataka', pincode: '560102', address: '27th Main, Sector 2, HSR', lat: 12.9101, lon: 77.6412 },
  { name: 'Whitefield Lakeside PG', city: 'Bangalore', state: 'Karnataka', pincode: '560066', address: 'ECC Road, Whitefield', lat: 12.9698, lon: 77.7499 },
  { name: 'BTM Residency PG', city: 'Bangalore', state: 'Karnataka', pincode: '560076', address: '16th Main, BTM 2nd Stage', lat: 12.9166, lon: 77.6101 },
  { name: 'Bannerghatta Comfort Stay', city: 'Bangalore', state: 'Karnataka', pincode: '560076', address: 'Bannerghatta Main Road', lat: 12.8926, lon: 77.5993 },
  { name: 'MG Road Heritage PG', city: 'Bangalore', state: 'Karnataka', pincode: '560001', address: 'Church Street, MG Road', lat: 12.975, lon: 77.605 },
  { name: 'Kondapur Techie PG', city: 'Hyderabad', state: 'Telangana', pincode: '500084', address: 'Kothaguda X Roads, Kondapur', lat: 17.4691, lon: 78.3631 },
  { name: 'Madhapur Metro Stay', city: 'Hyderabad', state: 'Telangana', pincode: '500081', address: 'Silicon Valley, Madhapur', lat: 17.4483, lon: 78.3915 },
  { name: 'Gachibowli Lakeside Homes', city: 'Hyderabad', state: 'Telangana', pincode: '500032', address: 'ISB Road, Gachibowli', lat: 17.4401, lon: 78.3489 },
  { name: 'Kukatpally Student Hostel', city: 'Hyderabad', state: 'Telangana', pincode: '500072', address: 'KPHB Phase 3', lat: 17.4946, lon: 78.3996 },
  { name: 'HITEC City Prime PG', city: 'Hyderabad', state: 'Telangana', pincode: '500081', address: 'Raheja Mindspace', lat: 17.4435, lon: 78.3772 },
  { name: 'Powai Lakeview PG', city: 'Mumbai', state: 'Maharashtra', pincode: '400076', address: 'Near Hiranandani, Powai', lat: 19.1176, lon: 72.9097 },
  { name: 'Andheri East Transit Hostel', city: 'Mumbai', state: 'Maharashtra', pincode: '400059', address: 'Marol, Andheri East', lat: 19.1136, lon: 72.8697 },
  { name: 'Bandra West Coliving', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', address: 'Pali Hill, Bandra', lat: 19.0607, lon: 72.833},
  { name: 'Vashi Creek PG', city: 'Navi Mumbai', state: 'Maharashtra', pincode: '400703', address: 'Sector 17, Vashi', lat: 19.0771, lon: 72.9986 },
  { name: 'Kharghar Hills Hostel', city: 'Navi Mumbai', state: 'Maharashtra', pincode: '410210', address: 'Sector 7, Kharghar', lat: 19.0444, lon: 73.0699 },
  { name: 'Kothrud Student Stay', city: 'Pune', state: 'Maharashtra', pincode: '411038', address: 'Paud Road, Kothrud', lat: 18.5074, lon: 73.8077 },
  { name: 'Viman Nagar Comfort PG', city: 'Pune', state: 'Maharashtra', pincode: '411014', address: 'Symbiosis Road, Viman Nagar', lat: 18.5679, lon: 73.9143 },
  { name: 'Hinjewadi Phase 1 Hostel', city: 'Pune', state: 'Maharashtra', pincode: '411057', address: 'Rajiv Gandhi Infotech Park', lat: 18.5995, lon: 73.7068 },
  { name: 'Wakad Blue Orchid PG', city: 'Pune', state: 'Maharashtra', pincode: '411057', address: 'Kalewadi Main Road', lat: 18.598, lon: 73.77 },
  { name: 'Kalyani Nagar RiverView', city: 'Pune', state: 'Maharashtra', pincode: '411006', address: 'South Avenue, Kalyani Nagar', lat: 18.5526, lon: 73.9007 },
  { name: 'Sector 62 Tech PG', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301', address: 'A Block, Sector 62', lat: 28.6305, lon: 77.3721 },
  { name: 'Noida Sector 18 Stay', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301', address: 'Atta Market, Sector 18', lat: 28.569, lon: 77.321 },
  { name: 'Gurgaon Cyber City Hostel', city: 'Gurgaon', state: 'Haryana', pincode: '122002', address: 'DLF Phase 2', lat: 28.481, lon: 77.0896 },
  { name: 'DLF Phase 3 CoLiving', city: 'Gurgaon', state: 'Haryana', pincode: '122002', address: 'Udyog Vihar 5', lat: 28.501, lon: 77.096 },
  { name: 'Golf Course Road Suites', city: 'Gurgaon', state: 'Haryana', pincode: '122002', address: 'Sector 54', lat: 28.4324, lon: 77.1025 },
  { name: 'Saket Metro PG', city: 'Delhi', state: 'Delhi', pincode: '110017', address: 'Mandir Marg, Saket', lat: 28.5245, lon: 77.2066 },
  { name: 'Lajpat Nagar Central PG', city: 'Delhi', state: 'Delhi', pincode: '110024', address: 'Ring Road, Lajpat Nagar', lat: 28.5672, lon: 77.243 },
  { name: 'Karol Bagh Heritage Hostel', city: 'Delhi', state: 'Delhi', pincode: '110005', address: 'Ajmal Khan Road, Karol Bagh', lat: 28.6517, lon: 77.1907 },
  { name: 'Hauz Khas Social Stay', city: 'Delhi', state: 'Delhi', pincode: '110016', address: 'Hauz Khas Village', lat: 28.5494, lon: 77.2001 },
  { name: 'South Ex Residency', city: 'Delhi', state: 'Delhi', pincode: '110049', address: 'Ring Road, South Ex', lat: 28.5679, lon: 77.216 },
  { name: 'Salt Lake Sector 5 PG', city: 'Kolkata', state: 'West Bengal', pincode: '700091', address: 'Near Wipro, Salt Lake', lat: 22.58, lon: 88.43 },
  { name: 'Ballygunge Palace PG', city: 'Kolkata', state: 'West Bengal', pincode: '700019', address: 'Hazra Road, Ballygunge', lat: 22.52, lon: 88.36 },
  { name: 'Gariahat Market Hostel', city: 'Kolkata', state: 'West Bengal', pincode: '700029', address: 'Gariahat Road', lat: 22.52, lon: 88.37 },
  { name: 'Park Street Residency', city: 'Kolkata', state: 'West Bengal', pincode: '700016', address: 'Park Street', lat: 22.55, lon: 88.35 },
  { name: 'Velachery Lakeside PG', city: 'Chennai', state: 'Tamil Nadu', pincode: '600042', address: '100 Feet Road, Velachery', lat: 12.98, lon: 80.22 },
  { name: 'T Nagar Prime Hostel', city: 'Chennai', state: 'Tamil Nadu', pincode: '600017', address: 'North Usman Road', lat: 13.04, lon: 80.23 },
  { name: 'OMR Tech Corridor Stay', city: 'Chennai', state: 'Tamil Nadu', pincode: '600097', address: 'Navalur, OMR', lat: 12.85, lon: 80.22 },
  { name: 'Anna Nagar Metro PG', city: 'Chennai', state: 'Tamil Nadu', pincode: '600040', address: '2nd Avenue, Anna Nagar', lat: 13.09, lon: 80.2 },
  { name: 'Coimbatore Gandhipuram Hostel', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641012', address: 'Cross Cut Road, Gandhipuram', lat: 11.02, lon: 76.97 },
  { name: 'Coimbatore Peelamedu PG', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641004', address: 'Avinashi Road, Peelamedu', lat: 11.02, lon: 77.03 },
  { name: 'Jaipur Malviya Nagar Hostel', city: 'Jaipur', state: 'Rajasthan', pincode: '302017', address: 'Gaurav Tower, Malviya Nagar', lat: 26.85, lon: 75.81 },
  { name: 'Jaipur Vaishali Nagar PG', city: 'Jaipur', state: 'Rajasthan', pincode: '302021', address: 'Queens Road, Vaishali Nagar', lat: 26.92, lon: 75.74 },
  { name: 'Indore Vijay Nagar Stay', city: 'Indore', state: 'Madhya Pradesh', pincode: '452010', address: 'Scheme 54, Vijay Nagar', lat: 22.75, lon: 75.89 },
  { name: 'Indore Palasia Residency', city: 'Indore', state: 'Madhya Pradesh', pincode: '452001', address: 'New Palasia', lat: 22.72, lon: 75.88 },
  { name: 'Lucknow Gomti Nagar PG', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226010', address: 'Vibhuti Khand, Gomti Nagar', lat: 26.85, lon: 81.02 },
  { name: 'Lucknow Hazratganj Hostel', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001', address: 'Mahatma Gandhi Marg', lat: 26.85, lon: 80.95 },
  { name: 'Chandigarh Sector 22 PG', city: 'Chandigarh', state: 'Chandigarh', pincode: '160022', address: 'Sector 22 Market', lat: 30.73, lon: 76.77 },
  { name: 'Chandigarh IT Park Stay', city: 'Chandigarh', state: 'Chandigarh', pincode: '160101', address: 'Near DLF IT Park', lat: 30.73, lon: 76.84 },
  { name: 'Ahmedabad SG Highway PG', city: 'Ahmedabad', state: 'Gujarat', pincode: '380054', address: 'Thaltej, SG Highway', lat: 23.07, lon: 72.52 },
  { name: 'Ahmedabad Prahlad Nagar Hostel', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015', address: '100 ft Road, Prahlad Nagar', lat: 23.01, lon: 72.51 },
];

const propertyTypes = ['PG', 'HOSTEL', 'FLAT', 'APARTMENT'];
const genders = ['MALE', 'FEMALE', 'COED'];
const roomTypes = ['SINGLE', 'DOUBLE', 'TRIPLE', 'DORMITORY'];
const amenityPool = Array.from({ length: 17 }, (_, i) => i + 1); // seeded by DataInitializer
const imagePool = [
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb512',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb513',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb514',
];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomAmenities = () => amenityPool.filter(() => Math.random() > 0.5).slice(0, 8);

function expandList(target) {
  const out = [];
  while (out.length < target) {
    const source = curated[out.length % curated.length];
    const variant = Math.floor(out.length / curated.length) + 1;
    out.push({
      ...source,
      name: variant > 1 ? `${source.name} Annex ${variant}` : source.name,
    });
  }
  return out;
}

async function createProperty(entry, idx) {
  const minRent = 6000 + Math.floor(Math.random() * 8000);
  const maxRent = minRent + 4000 + Math.floor(Math.random() * 6000);
  const propertyType = randomFrom(propertyTypes);
  const genderPreference = randomFrom(genders);

  const body = {
    name: entry.name,
    description: `${entry.name} in ${entry.city}, ${entry.state}. Hostel/PG-style managed stay with owner support.`,
    propertyType,
    genderPreference,
    addressLine1: entry.address,
    addressLine2: '',
    city: entry.city,
    state: entry.state,
    pincode: entry.pincode,
    latitude: entry.lat,
    longitude: entry.lon,
    minRent,
    maxRent,
    securityDeposit: minRent * 2,
    noticePeriodDays: 30,
    amenityIds: randomAmenities(),
    imageUrls: imagePool,
  };

  const res = await fetch(`${BASE_URL}/owner/properties`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Property create failed [${res.status}] ${text}`);
  }
  const json = await res.json();
  return json.data;
}

async function createRoom(propertyId, roomIdx) {
  const roomType = randomFrom(roomTypes);
  const totalBeds = roomType === 'SINGLE' ? 1 : roomType === 'DOUBLE' ? 2 : roomType === 'TRIPLE' ? 3 : 6;
  const rentPerBed = 5000 + Math.floor(Math.random() * 8000);

  const body = {
    roomNumber: `R${roomIdx + 1}`,
    roomType,
    floorNumber: (roomIdx % 5) + 1,
    totalBeds,
    rentPerBed,
    hasAttachedBathroom: Math.random() > 0.5,
    hasAc: Math.random() > 0.5,
    hasBalcony: Math.random() > 0.4,
    roomSizeSqft: 120 + Math.floor(Math.random() * 100),
    description: `${roomType} sharing with ${totalBeds} beds.`,
  };

  const res = await fetch(`${BASE_URL}/owner/properties/${propertyId}/rooms`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Room create failed [${res.status}] ${text}`);
  }
  const json = await res.json();
  return json.data;
}

async function seed() {
  const list = expandList(Math.min(MAX, 2000));
  console.log(`Seeding ${Math.min(MAX, list.length)} properties to ${BASE_URL}`);
  let created = 0;
  for (const [idx, entry] of list.entries()) {
    if (created >= MAX) break;
    try {
      const property = await createProperty(entry, idx);
      const roomPromises = [];
      for (let r = 0; r < ROOMS_PER_PROPERTY; r++) {
        roomPromises.push(createRoom(property.id, r));
      }
      await Promise.all(roomPromises);
      created += 1;
      if (created % 10 === 0) console.log(`Created ${created} properties...`);
    } catch (err) {
      console.error(`Error on property ${idx + 1}: ${err.message}`);
    }
  }
  console.log(`Done. Created ${created} properties (each with ${ROOMS_PER_PROPERTY} rooms).`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
