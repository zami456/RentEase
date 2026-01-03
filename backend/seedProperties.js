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
    mainImage: "https://cdngeneral.rentcafe.com/dmslivecafe/3/613536/GreenValley_Exterior_LoRes_5818.jpg?width=480&quality=90",
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
    mainImage: "https://q-xx.bstatic.com/xdata/images/hotel/max500/305226541.jpg?k=69d731084697aab426727a10f46b6797f81bf9c0120d520f841980c765a54ad1&o=",
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
    mainImage: "https://koshergreece.com/wp-content/uploads/2019/10/ACC5B427-E4D9-40C0-A438-ACAF115D4ED1.jpeg",
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
    mainImage: "https://qualityhomeco.com/wp-content/uploads/2024/04/A-1-scaled.jpg",
    owner: null,
  },
];

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    await Property.deleteMany(); // Optional: Clear existing properties
    await Property.insertMany(dummyFlats);
    console.log("Dummy flats inserted ");
    process.exit();
  })
  .catch((err) => {
    console.error("DB connection error ", err);
    process.exit(1);
  });