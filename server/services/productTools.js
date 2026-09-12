const Product = require('../models/Product');

/**
 * Backend Product Query & Helper Tooling Service
 * Executed by backend / AI engine to query MongoDB ground truth safely.
 */

// 1. Search Products by keyword, category, or flavour
const searchProducts = async (query = '', category = 'All') => {
  let filter = { available: true };

  if (category && category !== 'All') {
    filter.category = category;
  }

  if (query) {
    const regex = new RegExp(query, 'i');
    filter.$or = [
      { name: regex },
      { flavour: regex },
      { description: regex },
      { tasteProfile: regex },
      { tags: { $in: [regex] } },
    ];
  }

  return await Product.find(filter).lean();
};

// 2. Get Product Details by Name or ID
const getProductDetails = async (identifier) => {
  if (!identifier) return null;

  let product = null;
  if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(identifier).lean();
  }

  if (!product) {
    const regex = new RegExp(identifier.trim(), 'i');
    product = await Product.findOne({ name: regex }).lean();
  }

  return product;
};

// 3. Compare Two Products Side-by-Side
const compareProducts = async (product1Name, product2Name) => {
  const p1 = await getProductDetails(product1Name);
  const p2 = await getProductDetails(product2Name);

  if (!p1 || !p2) {
    return { success: false, message: 'One or both products not found for comparison.' };
  }

  return {
    success: true,
    product1: {
      name: p1.name,
      tasteProfile: p1.tasteProfile,
      sweetness: p1.sweetness,
      texture: p1.texture,
      flavour: p1.flavour,
      price: p1.price,
      size: p1.size,
      ingredients: p1.ingredients || [],
      allergens: p1.allergens || [],
    },
    product2: {
      name: p2.name,
      tasteProfile: p2.tasteProfile,
      sweetness: p2.sweetness,
      texture: p2.texture,
      flavour: p2.flavour,
      price: p2.price,
      size: p2.size,
      ingredients: p2.ingredients || [],
      allergens: p2.allergens || [],
    },
  };
};

// 4. Find Products By Budget & Flavour Filter
const findProductsByBudget = async (budget, flavourFilter = '') => {
  const allAvailable = await Product.find({ available: true, price: { $lte: budget } }).sort({ price: -1 }).lean();

  if (!flavourFilter) {
    return allAvailable;
  }

  const regex = new RegExp(flavourFilter, 'i');
  return allAvailable.filter(p =>
    regex.test(p.name) || regex.test(p.flavour) || regex.test(p.tags.join(' '))
  );
};

// 5. Check Availability
const checkAvailability = async (productName) => {
  const product = await getProductDetails(productName);
  if (!product) return { found: false, available: false };
  return { found: true, name: product.name, available: product.available, price: product.price, size: product.size };
};

// 6. Calculate Order Total (Backend Price Validation)
const calculateOrderTotal = async (items) => {
  let totalAmount = 0;
  const validatedItems = [];

  for (const item of items) {
    const dbProduct = await getProductDetails(item.name || item.productId);
    if (dbProduct && dbProduct.available) {
      const qty = Math.max(1, parseInt(item.quantity) || 1);
      const subtotal = dbProduct.price * qty;
      totalAmount += subtotal;

      validatedItems.push({
        productId: dbProduct._id.toString(),
        name: dbProduct.name,
        price: dbProduct.price,
        size: dbProduct.size,
        quantity: qty,
        subtotal: subtotal,
      });
    }
  }

  return { totalAmount, items: validatedItems };
};

module.exports = {
  searchProducts,
  getProductDetails,
  compareProducts,
  findProductsByBudget,
  checkAvailability,
  calculateOrderTotal,
};
