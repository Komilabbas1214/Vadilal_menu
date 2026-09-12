const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const sampleProducts = [
  // 1. Scoops
  {
    name: 'Belgian Chocolate Scoop',
    category: 'Scoops',
    description: 'Rich dark Belgian cocoa chocolate scoop served cold and creamy.',
    flavour: 'Chocolate',
    size: '1 Scoop (100ml)',
    price: 90,
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Dark Belgian Cocoa', 'Fresh Cream', 'Milk Solids'],
    tags: ['chocolate', 'bestseller', 'eggless'],
    available: true,
  },
  {
    name: 'Alphonso Mango Delight',
    category: 'Scoops',
    description: 'Pure Ratnagiri Alphonso mango pulp blended into velvety ice cream.',
    flavour: 'Mango',
    size: '1 Scoop (100ml)',
    price: 80,
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Alphonso Mango Pulp', 'Cream', 'Milk'],
    tags: ['fruity', 'mango', 'seasonal'],
    available: true,
  },
  {
    name: 'Roasted Almond Fudge',
    category: 'Scoops',
    description: 'Crunchy slow-roasted California almonds folded into rich chocolate caramel fudge.',
    flavour: 'Nutty Chocolate',
    size: '1 Scoop (100ml)',
    price: 110,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Roasted Almonds', 'Chocolate Ribbon', 'Caramel'],
    tags: ['nutty', 'chocolate', 'premium'],
    available: true,
  },

  // 2. Sundaes
  {
    name: 'Sizzling Brownie Sundae',
    category: 'Sundaes',
    description: 'Warm eggless chocolate brownie topped with vanilla scoop, hot fudge syrup & cashews.',
    flavour: 'Chocolate Vanilla',
    size: 'Large Sundae',
    price: 180,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Warm Brownie', 'Vanilla Scoop', 'Hot Chocolate Syrup', 'Nuts'],
    tags: ['brownie', 'sundae', 'bestseller'],
    available: true,
  },
  {
    name: 'Royal Falooda Sundae',
    category: 'Sundaes',
    description: 'Classic rose milk, vermicelli, basil seeds, topped with Kesar Pista & Vanilla scoops.',
    flavour: 'Rose & Pista',
    size: 'Tall Glass',
    price: 160,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Rose Syrup', 'Falooda Sev', 'Sabja Seeds', 'Kesar Pista Ice Cream'],
    tags: ['traditional', 'sundae', 'fruity'],
    available: true,
  },

  // 3. Shakes
  {
    name: 'Oreo Thickshake',
    category: 'Shakes',
    description: 'Thick creamy milkshake blended with crunchy Oreo cookies and chocolate drizzle.',
    flavour: 'Oreo Chocolate',
    size: '350ml Glass',
    price: 140,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Oreo Biscuits', 'Vanilla Ice Cream', 'Whole Milk', 'Chocolate Sauce'],
    tags: ['shake', 'oreo', 'popular'],
    available: true,
  },
  {
    name: 'Cold Coffee Frappe Shake',
    category: 'Shakes',
    description: 'Espresso shot blended with vanilla ice cream and crushed ice topped with whipped cream.',
    flavour: 'Coffee',
    size: '350ml Glass',
    price: 130,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Espresso Coffee', 'Vanilla Scoop', 'Milk'],
    tags: ['coffee', 'shake', 'refreshing'],
    available: true,
  },

  // 4. Brownies
  {
    name: 'Choco Brownie Scoop Combo',
    category: 'Brownies',
    description: 'Freshly baked fudgy chocolate brownie topped with chocolate chips.',
    flavour: 'Chocolate',
    size: '1 Piece (120g)',
    price: 90,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Cocoa Powder', 'Flour', 'Butter', 'Chocolate Chips'],
    tags: ['brownie', 'chocolate'],
    available: true,
  },

  // 5. Cakes
  {
    name: 'Black Forest Ice Cream Cake',
    category: 'Cakes',
    description: 'Layers of chocolate sponge cake, vanilla ice cream, sour cherries and dark chocolate shavings.',
    flavour: 'Black Forest',
    size: '500g Cake',
    price: 450,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Chocolate Cake Sponge', 'Vanilla Cream', 'Cherries', 'Dark Chocolate'],
    tags: ['cake', 'party', 'birthday'],
    available: true,
  },

  // 6. Tubs
  {
    name: 'Kesar Pista Party Tub',
    category: 'Tubs',
    description: 'Authentic royal saffron ice cream loaded with crunchy pistachios and almonds.',
    flavour: 'Kesar Pista',
    size: '750ml Tub',
    price: 250,
    image: 'https://images.unsplash.com/photo-1560008515-160105312389?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Saffron', 'Pistachios', 'Almonds', 'Milk Cream'],
    tags: ['family', 'tub', 'traditional'],
    available: true,
  },

  // 7. Kulfi
  {
    name: 'Matka Malai Kulfi',
    category: 'Kulfi',
    description: 'Slow-cooked condensed rabri milk kulfi infused with cardamom, served in clay pot.',
    flavour: 'Malai Rabri',
    size: '1 Matka (120ml)',
    price: 70,
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Condensed Milk', 'Cardamom', 'Dry Fruits'],
    tags: ['kulfi', 'traditional', 'rabri'],
    available: true,
  },

  // 8. Bars / Novelties
  {
    name: 'Choco Crunch Bar',
    category: 'Bars / Novelties',
    description: 'Vanilla ice cream bar double dipped in thick Belgian chocolate shell with butterscotch crunch.',
    flavour: 'Chocolate Crunch',
    size: '1 Bar (80ml)',
    price: 60,
    image: 'https://images.unsplash.com/photo-1549395156-e0c1fe6fc7a5?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Chocolate Shell', 'Crispy Butterscotch', 'Vanilla Ice Cream'],
    tags: ['bar', 'chocolate', 'snack'],
    available: true,
  },

  // 9. Party Packs
  {
    name: 'Ultimate Birthday Celebration Pack',
    category: 'Party Packs',
    description: 'Includes 1kg Ice Cream Cake, 4 Assorted Sundaes, and 6 Choco Bars for 8-10 people.',
    flavour: 'Assorted Flavours',
    size: 'Party Pack for 8-10',
    price: 999,
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    ingredients: ['Assorted Ice Creams', 'Cake', 'Bars'],
    tags: ['party', 'birthday', 'family'],
    available: true,
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hangout_icecream';
    await mongoose.connect(mongoUri);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🧹 Cleared existing Products & Users');

    // Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Hangout Store Manager',
      email: 'admin@hangout.com',
      password: hashedPassword,
      role: 'admin',
    });
    console.log(`👤 Admin created: ${adminUser.email} (Password: admin123)`);

    // Insert Products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`🍦 Inserted ${createdProducts.length} Ice Cream Products into DB`);

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
