const Product = require('../models/Product');
const {
  searchProducts,
  getProductDetails,
  compareProducts,
  findProductsByBudget,
  checkAvailability,
  calculateOrderTotal,
} = require('./productTools');

/**
 * Intelligent Intent Classifier for Salesperson Engine
 */
const detectIntent = (userPrompt) => {
  const text = userPrompt.toLowerCase().trim();

  if (/(add|order|want|chahiye|2 x|take|pack|dono le lo|is tragic|buying)\b/i.test(text) && !text.includes('kya hai')) {
    return 'ORDER_REQUEST';
  }
  if (/(budget|under|below|andar|₹\d+|\d+\s*rs|within \d+)/i.test(text)) {
    return 'BUDGET_RECOMMENDATION';
  }
  if (/(people|logo|log|family|party|group|couple|birthday)/i.test(text)) {
    return 'GROUP_RECOMMENDATION';
  }
  if (/(recommend|suggest|what should i|best|popular|bestseller|confusion|help me|surprise)/i.test(text)) {
    return 'RECOMMENDATION';
  }
  if (/(difference|farak|better|versus|vs|compare|dono mein)/i.test(text)) {
    return 'COMPARISON';
  }
  if (/(allergen|allergy|nuts|nut|dairy|gluten|wheat|safe|vegan|sugar free|eggless)/i.test(text)) {
    return 'ALLERGEN_QUESTION';
  }
  if (/(ingredient|ingredients|kya hota hai|isme kya hai|contain|made of)/i.test(text)) {
    return 'INGREDIENT_QUESTION';
  }
  if (/(price|kitne ka|kitna hai|how much|cost|rate|kitne mein)/i.test(text)) {
    return 'PRICE_QUESTION';
  }
  if (/(size|ml|scoop|quantity|kitna ml|gram|kg|tub size|weight)/i.test(text)) {
    return 'SIZE_QUESTION';
  }
  if (/(available|in stock|stock|mil sakta hai|hai kya)/i.test(text)) {
    return 'AVAILABILITY_QUESTION';
  }
  if (/(taste|kaisa hai|sweet|meetha|flavour|flavor|creamy|dark|texture|notes|sweetness)/i.test(text)) {
    return 'TASTE_QUESTION';
  }
  if (/(pasand|like|prefer|love|craving|no nut|fruity|less sweet)/i.test(text)) {
    return 'PREFERENCE';
  }

  return 'GENERAL_CONVERSATION';
};

/**
 * Fallback Salesperson Rule Engine
 */
const fallbackSalespersonEngine = async (userPrompt, history = [], availableProducts) => {
  const promptLower = userPrompt.toLowerCase().trim();
  const intent = detectIntent(userPrompt);

  // Context memory resolution
  let historyContextItem = null;
  if (history && history.length > 0) {
    for (let i = history.length - 1; i >= 0; i--) {
      const pastText = (history[i].text || '').toLowerCase();
      const matchedP = availableProducts.find(p => pastText.includes(p.name.toLowerCase()) || pastText.includes(p.flavour.toLowerCase()));
      if (matchedP) {
        historyContextItem = matchedP;
        break;
      }
    }
  }

  // Find targeted product in current prompt or history
  let targetProduct = availableProducts.find(p => promptLower.includes(p.name.toLowerCase()) || promptLower.includes(p.flavour.toLowerCase()));
  if (!targetProduct) targetProduct = historyContextItem;

  let reply = '';
  let recommendations = [];

  switch (intent) {
    case 'TASTE_QUESTION': {
      if (targetProduct) {
        reply = `${targetProduct.name} 🍫 ka taste ${targetProduct.tasteProfile || targetProduct.description}. Sweetness: ${targetProduct.sweetness || 'Medium'}, Texture: ${targetProduct.texture || 'Smooth'}. Agar aapko ${targetProduct.flavour} flavours pasand hain, ye bohot achha option hai!`;
      } else {
        reply = `Aapko kis flavour ka taste janna hai? Humare paas 70% Dark Belgian Chocolate, Fresh Alphonso Mango, Choco Brownie, aur Rabri Matka Kulfi jaise flavours available hain!`;
      }
      break;
    }

    case 'COMPARISON': {
      const p1 = targetProduct || availableProducts[0];
      const p2 = availableProducts.find(p => p._id.toString() !== p1._id.toString() && (promptLower.includes(p.name.toLowerCase()) || promptLower.includes(p.flavour.toLowerCase()))) || availableProducts[1];
      reply = `🍫 **${p1.name}**: ${p1.tasteProfile} (Sweetness: ${p1.sweetness}, Price: ₹${p1.price})\n\n🍫 **${p2.name}**: ${p2.tasteProfile} (Sweetness: ${p2.sweetness}, Price: ₹${p2.price})\n\nAgar aapko pure rich taste pasand hai → ${p1.name}.\nAgar aapko ${p2.flavour} flavour pasand hai → ${p2.name}.`;
      break;
    }

    case 'INGREDIENT_QUESTION':
    case 'ALLERGEN_QUESTION': {
      if (targetProduct) {
        if (intent === 'ALLERGEN_QUESTION') {
          if (targetProduct.allergens && targetProduct.allergens.length > 0) {
            reply = `Database records ke according **${targetProduct.name}** mein ye listed allergens hain: ${targetProduct.allergens.join(', ')}.`;
          } else {
            reply = `Is item (${targetProduct.name}) ki allergen details mere menu data mein explicitly available nahi hain. Please confirm with our store staff.`;
          }
        } else {
          if (targetProduct.ingredients && targetProduct.ingredients.length > 0) {
            reply = `MongoDB menu database ke according **${targetProduct.name}** mein ye ingredients listed hain:\n• ${targetProduct.ingredients.join('\n• ')}`;
          } else {
            reply = `Is item (${targetProduct.name}) ke ingredients ki complete information mere menu data mein available nahi hai. Please confirm with our staff.`;
          }
        }
      } else {
        reply = `Main sirf wahi ingredients aur allergen details bataunga jo menu database mein listed hain. Please product name specify kariye.`;
      }
      break;
    }

    case 'PRICE_QUESTION': {
      if (targetProduct) {
        reply = `**${targetProduct.name}** 🍦\nSize: ${targetProduct.size}\nPrice: ₹${targetProduct.price}`;
      } else {
        reply = `Humare menu ke standard prices:\n• Belgian Chocolate (120ml): ₹90\n• Choco Brownie (120g): ₹90\n• Matka Kulfi (120ml): ₹70\n• Alphonso Mango (120ml): ₹80`;
      }
      break;
    }

    case 'SIZE_QUESTION': {
      if (targetProduct) {
        reply = `**${targetProduct.name}** ka available size **${targetProduct.size}** hai.`;
      } else {
        reply = `Humari scoops 120ml, Sundaes large glass (300ml), Tubs 600ml, aur Ice Cream Cakes 500g sizes mein available hain!`;
      }
      break;
    }

    case 'AVAILABILITY_QUESTION': {
      if (targetProduct) {
        reply = targetProduct.available
          ? `Haan! **${targetProduct.name}** abhi store stock mein available hai (Price: ₹${targetProduct.price}).`
          : `Sorry, **${targetProduct.name}** abhi out of stock hai.`;
      } else {
        reply = `Haan, all listed scoops, sundaes, shakes, brownies, tubs, and kulfis live MongoDB menu mein available hain.`;
      }
      break;
    }

    case 'ORDER_REQUEST': {
      if (targetProduct) {
        const qtyMatch = promptLower.match(/(\d+)/);
        const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 1;
        const total = targetProduct.price * qty;

        reply = `Sure! 🍦\n\n${qty} × ${targetProduct.name}\n₹${targetProduct.price} × ${qty} = ₹${total}\n\nWould you like me to add this to your cart?`;
        recommendations = [{
          id: `rec-order-1`,
          title: targetProduct.name,
          productIds: [targetProduct._id.toString()],
          items: [{ productId: targetProduct._id, name: targetProduct.name, price: targetProduct.price, size: targetProduct.size, quantity: qty }],
          totalPrice: total,
          explanation: `Confirm to add ${qty} × ${targetProduct.name} (₹${total}) to cart`,
        }];
      } else {
        reply = `Aapko konsa item order karna hai? Name batayein, main direct cart mein add kar dunga!`;
      }
      break;
    }

    case 'BUDGET_RECOMMENDATION': {
      const budgetMatch = promptLower.match(/(\d{2,4})/);
      const budget = budgetMatch ? parseInt(budgetMatch[1], 10) : 200;
      const matching = availableProducts.filter(p => p.price <= budget);

      reply = `₹${budget} ke andar ye options available hain:`;
      recommendations = matching.slice(0, 3).map((p, idx) => ({
        id: `rec-${idx + 1}`,
        title: p.name,
        productIds: [p._id.toString()],
        items: [{ productId: p._id, name: p.name, price: p.price, size: p.size, quantity: 1 }],
        totalPrice: p.price,
        explanation: `₹${p.price} within your ₹${budget} budget!`,
      }));
      break;
    }

    case 'RECOMMENDATION':
    case 'GROUP_RECOMMENDATION':
    case 'PREFERENCE': {
      reply = `Bilkul! 🍦 Store menu se aapke liye ye top suggestions hain:`;
      recommendations = availableProducts.slice(0, 3).map((p, idx) => ({
        id: `rec-${idx + 1}`,
        title: p.name,
        productIds: [p._id.toString()],
        items: [{ productId: p._id, name: p.name, price: p.price, size: p.size, quantity: 1 }],
        totalPrice: p.price,
        explanation: `${p.tasteProfile || p.description} (₹${p.price})`,
      }));
      break;
    }

    default: {
      reply = `Hi! 👋 Welcome to Hangout! 🍦 Tell me your favourite flavour, budget, or mood and I'll help you choose.`;
      break;
    }
  }

  return { reply, recommendations };
};

/**
 * Main AI Assistant Handler (Powered by Gemini API + DB Tools)
 */
const getAIRecommendations = async (userMessage, history = []) => {
  const availableProducts = await Product.find({ available: true }).lean();

  if (!availableProducts || availableProducts.length === 0) {
    return {
      reply: 'Currently, no ice cream items are available in stock. Please check back soon!',
      recommendations: [],
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return await fallbackSalespersonEngine(userMessage, history, availableProducts);
  }

  try {
    const menuContext = availableProducts.map(p => ({
      id: p._id.toString(),
      name: p.name,
      category: p.category,
      flavour: p.flavour,
      tasteProfile: p.tasteProfile,
      sweetness: p.sweetness,
      texture: p.texture,
      ingredients: p.ingredients || [],
      allergens: p.allergens || [],
      size: p.size,
      price: p.price,
      tags: p.tags || [],
      available: p.available,
    }));

    const formattedHistory = history.map(h => `${h.sender.toUpperCase()}: ${h.text}`).join('\n');

    const systemPrompt = `You are "Hangout AI", a smart, friendly, and knowledgeable ice-cream shop salesperson.

CRITICAL ARCHITECTURE RULES:
1. UNDERSTAND → ANSWER → HELP → RECOMMEND WHEN NEEDED → ORDER.
2. ANSWER THE CUSTOMER'S QUESTION FIRST. Do NOT automatically recommend products when customer is only asking a factual question!
3. STRICT DB GROUNDING: Get all prices, sizes, availability, ingredients, and allergens ONLY from the STORE MENU array below. NEVER invent fake prices, ingredients, allergens, or discounts.
4. INGREDIENTS & ALLERGENS: Only mention ingredients/allergens listed in product data. If missing, say: "Is item ke ingredients ki complete information mere menu data mein available nahi hai. Please confirm with our staff." Never claim items are nut-free/vegan/allergy-safe unless DB explicitly specifies.
5. CONVERSATION MEMORY: Remember past conversation history to resolve pronouns ("it", "Brownie", "how much").
6. ORDER REQUEST: When customer says "I want 2 Choco Brownie", output item breakdown, total (2 x ₹90 = ₹180), and attach recommendation card with items array so customer can click [Add to Cart]. Do NOT claim order is placed until backend checkout occurs.
7. RECOMMENDATIONS: Set "recommendations" array to [] for factual/taste/ingredient/size/price/availability/comparison questions unless customer explicitly asks for options/budget/ordering!

STORE MENU (MongoDB Ground Truth):
${JSON.stringify(menuContext, null, 2)}

PAST CONVERSATION HISTORY:
${formattedHistory}

Respond strictly in valid JSON format:
{
  "reply": "Conversational, friendly response in customer's language answering their query directly",
  "recommendations": []
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }, { text: `Customer Query: "${userMessage}"` }] }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    const contentText = data.candidates[0].content.parts[0].text;
    const parsedJSON = JSON.parse(contentText);

    return parsedJSON;
  } catch (error) {
    console.error('Gemini AI API call error, using fallback engine:', error.message);
    return await fallbackSalespersonEngine(userMessage, history, availableProducts);
  }
};

module.exports = { getAIRecommendations };
