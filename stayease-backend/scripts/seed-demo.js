#!/usr/bin/env node
// Seed demo data into StayEase backend (properties + rooms) using owner JWT

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const idx = args.findIndex((a) => a === `--${name}`);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return fallback;
};

const BASE_URL = getArg('base', process.env.BASE_URL || 'http://localhost:8080');
const TOKEN = getArg('token', process.env.TOKEN);
const COUNT = Number(getArg('count', '160'));
const BATCH = Number(getArg('batch', '10')); // concurrent batches

if (!TOKEN) {
  console.error('Usage: node seed-demo.js --token <OWNER_JWT> [--base http://localhost:8080] [--count 160] [--batch 10]');
  process.exit(1);
}

const cities = [
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Mumbai',
  'Pune',
  'Delhi',
  'Gurgaon',
  'Noida',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Chandigarh',
  'Coimbatore',
  'Indore',
  'Lucknow',
];

const propertyTypes = ['PG', 'HOSTEL', 'FLAT', 'APARTMENT'];
const genders = ['MALE', 'FEMALE', 'COED'];
const roomTypes = ['SINGLE', 'DOUBLE', 'TRIPLE', 'DORMITORY'];
const amenityPool = Array.from({ length: 17 }, (_, i) => i + 1); // DataInitializer seeds 17 amenities
const imagePool = [
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb512',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb513',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb514',
];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomAmenities = () => amenityPool.filter(() => Math.random() > 0.5).slice(0, 8);

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

async function createProperty(idx) {
  const city = randomFrom(cities);
  const propertyType = randomFrom(propertyTypes);
  const genderPreference = randomFrom(genders);
  const minRent = 6000 + Math.floor(Math.random() * 8000);
  const maxRent = minRent + 4000 + Math.floor(Math.random() * 6000);

  const body = {
    name: `${city} ${propertyType} ${idx + 1}`,
    description: `Well-located ${propertyType} in ${city} with owner-managed services. Listing #${idx + 1}.`,
    propertyType,
    genderPreference,
    addressLine1: `${100 + idx} Main Street`,
    addressLine2: 'Near Metro',
    city,
    state: 'India',
    pincode: '560001',
    latitude: 12.9 + Math.random(),
    longitude: 77.5 + Math.random(),
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
    throw new Error(`Property create failed [${res.status}]: ${text}`);
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
    throw new Error(`Room create failed [${res.status}]: ${text}`);
  }

  const json = await res.json();
  return json.data;
}

async function seed() {
  console.log(`Seeding ${COUNT} properties in batches of ${BATCH} to ${BASE_URL}`);
  let created = 0;

  const tasks = Array.from({ length: COUNT }).map((_, idx) => async () => {
    const property = await createProperty(idx);
    await Promise.all([
      createRoom(property.id, 0),
      createRoom(property.id, 1),
      createRoom(property.id, 2),
    ]);
    return property.id;
  });

  // Simple concurrency control
  const queue = [...tasks];
  const running = new Set();

  const runNext = () => {
    if (!queue.length) return Promise.resolve();
    const task = queue.shift();
    const p = task()
      .then(() => {
        created += 1;
        if (created % 10 === 0) console.log(`Created ${created} properties...`);
      })
      .catch((err) => {
        console.error('Error:', err.message);
      })
      .finally(() => running.delete(p));
    running.add(p);
    const next = running.size >= BATCH ? Promise.race(running) : Promise.resolve();
    return next.then(runNext);
  };

  await runNext();
  await Promise.all(running);
  console.log(`Done. Created ~${created} properties with 3 rooms each.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
