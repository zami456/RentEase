const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Property = require("./models/Property.js");

dotenv.config();


const dummyFlats = [
  {
    houseName: "Green Valley Apartment",
    address: "123 Lake View Road, Dhaka",
    price: 12000,
    rooms: 2,
    washrooms: 1,
    squareFeet: 950,
    contact: "+880-1234-567890",
    description: "Peaceful environment near lake",
    latitude: 23.8103,
    longitude: 90.4125,
    mainImage: "https://cdngeneral.rentcafe.com/dmslivecafe/3/613536/GreenValley_Exterior_LoRes_5818.jpg?width=480&quality=90",
    roomImages: [],
    owner: null,
  },
  {
    houseName: "Sunset Residency",
    address: "56 Gulshan Ave, Dhaka",
    price: 20000,
    rooms: 3,
    washrooms: 2,
    squareFeet: 1400,
    contact: "+880-1234-567891",
    description: "Modern flat with sunset view",
    latitude: 23.7808,
    longitude: 90.4217,
    mainImage: "https://q-xx.bstatic.com/xdata/images/hotel/max500/305226541.jpg?k=69d731084697aab426727a10f46b6797f81bf9c0120d520f841980c765a54ad1&o=",
    roomImages: [],
    owner: null,
  },
  {
    houseName: "Urban Nest",
    address: "88 Bashundhara R/A, Dhaka",
    price: 18000,
    rooms: 2,
    washrooms: 1,
    squareFeet: 1100,
    contact: "+880-1234-567892",
    description: "Ideal for students and professionals",
    latitude: 23.8223,
    longitude: 90.4242,
    mainImage: "https://koshergreece.com/wp-content/uploads/2019/10/ACC5B427-E4D9-40C0-A438-ACAF115D4ED1.jpeg",
    roomImages: [],
    owner: null,
  },
  {
    houseName: "Blue Horizon Flat",
    address: "12 Mirpur DOHS, Dhaka",
    price: 22000,
    rooms: 3,
    washrooms: 2,
    squareFeet: 1600,
    contact: "+880-1234-567893",
    description: "Luxurious and spacious",
    latitude: 23.8223,
    longitude: 90.3654,
    mainImage: "https://qualityhomeco.com/wp-content/uploads/2024/04/A-1-scaled.jpg",
    roomImages: [],
    owner: null,
  },
  {
    houseName: "Cozy Studio Downtown",
    address: "45 Dhanmondi Road, Dhaka",
    price: 9500,
    rooms: 1,
    washrooms: 1,
    squareFeet: 600,
    contact: "+880-1234-567894",
    description: "Perfect for singles in the heart of the city",
    latitude: 23.7461,
    longitude: 90.3742,
    mainImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
    roomImages: [],
    owner: null,
  },
  {
    houseName: "Family Haven",
    address: "78 Banani DOHS, Dhaka",
    price: 28000,
    rooms: 4,
    washrooms: 3,
    squareFeet: 2000,
    contact: "+880-1234-567895",
    description: "Spacious family apartment with modern amenities",
    latitude: 23.7937,
    longitude: 90.4066,
    mainImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500",
    roomImages: [],
    owner: null,
  },
  {
    houseName: "Riverside View",
    address: "12 Motijheel Avenue, Dhaka",
    price: 15000,
    rooms: 2,
    washrooms: 2,
    squareFeet: 1200,
    contact: "+880-1234-567896",
    description: "Beautiful river view with balcony",
    latitude: 23.7337,
    longitude: 90.4172,
    mainImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500",
    roomImages: [],
    owner: null,
  },
  {
    houseName: "Tech Hub Apartment",
    address: "34 Mohakhali DOHS, Dhaka",
    price: 17500,
    rooms: 2,
    washrooms: 2,
    squareFeet: 1150,
    contact: "+880-1234-567897",
    description: "Near IT offices, high-speed internet included",
    latitude: 23.7808,
    longitude: 90.3969,
    mainImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
    roomImages: [],
    owner: null,
  },
];

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    // Get a test owner user (create if doesn't exist)
    const User = require("./models/User.js");
    let owner = await User.findOne({ email: "owner@test.com" });
    
    if (!owner) {
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("password123", 10);
      owner = await User.create({
        username: "Test Owner",
        email: "owner@test.com",
        password: hashedPassword,
        role: "Owner",
        phone: 1234567890,
        address: "Test Address, Dhaka"
      });
      console.log("Created test owner user");
    }

    // Assign owner to all properties
    const propertiesWithOwner = dummyFlats.map(flat => ({
      ...flat,
      owner: owner._id
    }));

    await Property.deleteMany(); // Optional: Clear existing properties
    await Property.insertMany(propertiesWithOwner);
    console.log(`Inserted ${propertiesWithOwner.length} test properties`);
    console.log("Test owner credentials: owner@test.com / password123");
    process.exit();
  })
  .catch((err) => {
    console.error("DB connection error ", err);
    process.exit(1);
  });