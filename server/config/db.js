const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hangout_icecream';

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`⚠️ Local MongoDB not found on ${primaryUri} (${error.message}).`);
    console.log(`🚀 Starting in-memory MongoDB server for instant setup...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      const conn = await mongoose.connect(mongoUri);
      console.log(`✅ In-Memory MongoDB Connected successfully at: ${mongoUri}`);

      await seedInMemoryDB();
    } catch (memErr) {
      console.error(`❌ In-Memory MongoDB Connection Error: ${memErr.message}`);
      process.exit(1);
    }
  }
};

const seedInMemoryDB = async () => {
  const Product = require('../models/Product');
  const User = require('../models/User');
  const bcrypt = require('bcryptjs');

  const count = await Product.countDocuments();
  if (count > 0) return;

  console.log('🌱 Seeding complete MongoDB product dataset with ingredients & allergens...');

  const sampleProducts = [
    {
      name: 'Belgian Chocolate',
      category: 'Scoops',
      description: 'Rich dark Belgian cocoa chocolate scoop served cold and creamy.',
      flavour: 'Chocolate',
      tasteProfile: 'Rich, intense dark chocolate with a smooth bittersweet melt',
      sweetness: 'Medium',
      texture: 'Smooth and creamy',
      ingredients: ['70% Dark Belgian Cocoa', 'Fresh Dairy Cream', 'Milk Solids', 'Sugar'],
      allergens: ['Milk/Dairy'],
      size: '120ml',
      price: 90,
      tags: ['chocolate', 'creamy', 'rich', 'dark chocolate', 'bestseller'],
      available: true,
      image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Alphonso Mango Delight',
      category: 'Scoops',
      description: 'Pure Ratnagiri Alphonso mango pulp blended into velvety ice cream.',
      flavour: 'Mango',
      tasteProfile: 'Naturally sweet and tropical with authentic Alphonso mango aroma',
      sweetness: 'High',
      texture: 'Luscious and creamy',
      ingredients: ['100% Real Alphonso Mango Pulp', 'Fresh Cream', 'Whole Milk', 'Sugar'],
      allergens: ['Milk/Dairy'],
      size: '120ml',
      price: 80,
      tags: ['fruity', 'mango', 'seasonal', 'sweet'],
      available: true,
      image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Roasted Almond Fudge',
      category: 'Scoops',
      description: 'Crunchy slow-roasted California almonds folded into rich chocolate caramel fudge.',
      flavour: 'Nutty Chocolate',
      tasteProfile: 'Nutty, buttery roasted almond crunch with gooey chocolate caramel ribbons',
      sweetness: 'Medium',
      texture: 'Crunchy and fudgy',
      ingredients: ['Roasted California Almonds', 'Chocolate Ribbon', 'Caramel Fudge', 'Dairy Cream'],
      allergens: ['Milk/Dairy', 'Tree Nuts (Almond)'],
      size: '120ml',
      price: 110,
      tags: ['nutty', 'chocolate', 'premium', 'crunchy'],
      available: true,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Choco Brownie',
      category: 'Brownies',
      description: 'Freshly baked eggless fudgy chocolate brownie topped with chocolate chips.',
      flavour: 'Chocolate Brownie',
      tasteProfile: 'Warm, dense, fudgy chocolate cake flavour with rich cocoa chips',
      sweetness: 'High',
      texture: 'Gooey and dense',
      ingredients: ['Cocoa Powder', 'Wheat Flour', 'Butter', 'Chocolate Chips', 'Milk'],
      allergens: ['Milk/Dairy', 'Gluten/Wheat'],
      size: '120g Piece',
      price: 90,
      tags: ['brownie', 'chocolate', 'fudgy', 'bestseller'],
      available: true,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Sizzling Brownie Sundae',
      category: 'Sundaes',
      description: 'Warm eggless chocolate brownie topped with vanilla scoop, hot fudge syrup & cashews.',
      flavour: 'Chocolate Vanilla',
      tasteProfile: 'Decadent combination of warm fudgy brownie and freezing smooth vanilla cream',
      sweetness: 'High',
      texture: 'Gooey, warm and chilled',
      ingredients: ['Chocolate Brownie', 'Vanilla Ice Cream', 'Hot Chocolate Sauce', 'Cashews'],
      allergens: ['Milk/Dairy', 'Gluten/Wheat', 'Tree Nuts (Cashew)'],
      size: 'Large Sundae',
      price: 180,
      tags: ['brownie', 'sundae', 'bestseller', 'hot chocolate'],
      available: true,
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Royal Falooda Sundae',
      category: 'Sundaes',
      description: 'Classic rose milk, vermicelli, basil seeds, topped with Kesar Pista & Vanilla scoops.',
      flavour: 'Rose & Pista',
      tasteProfile: 'Floral, sweet, aromatic rose syrup milk with chewy vermicelli and saffron pistachio cream',
      sweetness: 'High',
      texture: 'Chewy, cooling and creamy',
      ingredients: ['Rose Syrup', 'Falooda Vermicelli', 'Sabja Basil Seeds', 'Kesar Pista Ice Cream'],
      allergens: ['Milk/Dairy', 'Tree Nuts (Pistachio)'],
      size: '300ml Tall Glass',
      price: 160,
      tags: ['traditional', 'sundae', 'fruity', 'falooda'],
      available: true,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Oreo Thickshake',
      category: 'Shakes',
      description: 'Thick creamy milkshake blended with crunchy Oreo cookies and chocolate drizzle.',
      flavour: 'Oreo Chocolate',
      tasteProfile: 'Creamy vanilla ice cream milk infused with crunchy dark cocoa Oreo cookie bits',
      sweetness: 'High',
      texture: 'Ultra thick & cookie crunch',
      ingredients: ['Oreo Biscuits', 'Vanilla Ice Cream', 'Whole Milk', 'Chocolate Syrup'],
      allergens: ['Milk/Dairy', 'Gluten/Wheat', 'Soy'],
      size: '350ml Glass',
      price: 140,
      tags: ['shake', 'oreo', 'popular', 'thickshake'],
      available: true,
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Cold Coffee Frappe Shake',
      category: 'Shakes',
      description: 'Espresso shot blended with vanilla ice cream and crushed ice topped with whipped cream.',
      flavour: 'Coffee',
      tasteProfile: 'Bold roasted coffee espresso aroma balanced with smooth vanilla cream sweetness',
      sweetness: 'Medium',
      texture: 'Frothy and chilled',
      ingredients: ['Espresso Coffee Extract', 'Vanilla Ice Cream', 'Whole Milk'],
      allergens: ['Milk/Dairy'],
      size: '350ml Glass',
      price: 130,
      tags: ['coffee', 'shake', 'refreshing', 'frappe'],
      available: true,
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Matka Malai Kulfi',
      category: 'Kulfi',
      description: 'Slow-cooked condensed rabri milk kulfi infused with cardamom, served in clay pot.',
      flavour: 'Malai Rabri',
      tasteProfile: 'Traditional slow-cooked condensed rabri milk with green cardamom and dry fruits',
      sweetness: 'Medium',
      texture: 'Dense, milky and smooth',
      ingredients: ['Condensed Whole Milk', 'Green Cardamom', 'Pistachios', 'Almonds'],
      allergens: ['Milk/Dairy', 'Tree Nuts (Pistachio/Almond)'],
      size: '120ml Matka',
      price: 70,
      tags: ['kulfi', 'traditional', 'rabri', 'cardamom'],
      available: true,
      image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Black Forest Ice Cream Cake',
      category: 'Cakes',
      description: 'Layers of chocolate sponge cake, vanilla ice cream, sour cherries and dark chocolate shavings.',
      flavour: 'Black Forest',
      tasteProfile: 'Soft chocolate sponge cake layered with cool vanilla cream and tart cherries',
      sweetness: 'Medium',
      texture: 'Moist sponge & soft ice cream',
      ingredients: ['Chocolate Sponge', 'Vanilla Cream', 'Dark Cherries', 'Dark Chocolate Shavings'],
      allergens: ['Milk/Dairy', 'Gluten/Wheat'],
      size: '500g Cake',
      price: 450,
      tags: ['cake', 'party', 'birthday', 'celebration'],
      available: true,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Choco Crunch Bar',
      category: 'Bars / Novelties',
      description: 'Vanilla ice cream bar double dipped in thick Belgian chocolate shell with butterscotch crunch.',
      flavour: 'Chocolate Crunch',
      tasteProfile: 'Cracking dark Belgian chocolate shell with crispy butterscotch crunch',
      sweetness: 'High',
      texture: 'Hard chocolate crackle & creamy center',
      ingredients: ['Belgian Chocolate Coating', 'Butterscotch Crunch', 'Vanilla Cream'],
      allergens: ['Milk/Dairy'],
      size: '80ml Bar',
      price: 60,
      tags: ['bar', 'chocolate', 'snack', 'crunch'],
      available: true,
      image: 'https://images.unsplash.com/photo-1549395156-e0c1fe6fc7a5?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Kesar Pista Party Tub',
      category: 'Tubs',
      description: 'Authentic royal saffron ice cream loaded with crunchy pistachios and almonds.',
      flavour: 'Kesar Pista',
      tasteProfile: 'Aromatic royal saffron milk cream with crunchy roasted pistachios',
      sweetness: 'Medium',
      texture: 'Rich, dense and nutty',
      ingredients: ['Kesar Saffron', 'Pistachios', 'Almonds', 'Milk Cream'],
      allergens: ['Milk/Dairy', 'Tree Nuts (Pistachio/Almond)'],
      size: '600ml Tub',
      price: 250,
      tags: ['family', 'tub', 'traditional', 'kesar pista'],
      available: true,
      image: 'https://images.unsplash.com/photo-1560008515-160105312389?w=600&auto=format&fit=crop&q=80',
    },
  ];

  await Product.insertMany(sampleProducts);

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await User.create({
    name: 'Hangout Store Manager',
    email: 'admin@hangout.com',
    password: hashedPassword,
    role: 'admin',
  });

  console.log('🎉 Database successfully seeded with 12 complete ice cream documents!');
};

module.exports = connectDB;
