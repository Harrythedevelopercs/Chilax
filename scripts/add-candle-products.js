const https = require("https");

const WC_URL = "https://purple-manatee-256891.hostingersite.com";
const CK = "ck_862f4228314615430415451f1d591c887ca2b4ff";
const CS = "cs_59d29edc3695f437573e0711134b79275e7e7af2";

function request(urlPath, method = "GET", postData = null) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${CK}:${CS}`).toString("base64");
    const fullUrl = new URL(`${WC_URL}/wp-json/wc/v3${urlPath}`);

    const payload = postData ? JSON.stringify(postData) : null;
    const options = {
      hostname: fullUrl.hostname,
      path: fullUrl.pathname + fullUrl.search,
      method: method,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on("error", (e) => reject(e));
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

const CANDLE_PARENT_ID = 656;
const CANDLE_CAT_IDS = {
  bestSellers: 657,
  productBoxes: 658,
  luxuryBoxes: 659,
  shippingMailers: 660,
  boxInserts: 661,
  bags: 662,
  packingPaper: 663,
  labels: 664,
};

const DEFAULT_IMAGE = "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f002-d.jpg";

const PRODUCTS_TO_ADD = [
  // Best Sellers
  {
    name: "Custom Candle Folding Carton Box",
    sku: "CND-BS-01",
    subCatId: CANDLE_CAT_IDS.bestSellers,
    description: "Our top selling custom printed folding carton box for glass jar candles, scented candles, and wax melts.",
    short_description: "Top-rated custom folding candle box.",
  },
  {
    name: "Rigid Candle Gift Box with Lid",
    sku: "CND-BS-02",
    subCatId: CANDLE_CAT_IDS.bestSellers,
    description: "Premium rigid luxury gift box engineered for luxury scented candles and gift sets.",
    short_description: "Rigid luxury candle gift box.",
  },

  // Product Boxes
  {
    name: "Auto Lock Bottom Candle Box",
    sku: "CND-PB-01",
    subCatId: CANDLE_CAT_IDS.productBoxes,
    description: "Heavy-duty auto lock bottom candle packaging designed to hold heavy candle jars securely.",
    short_description: "Auto lock bottom candle jar box.",
  },
  {
    name: "Window Display Candle Box",
    sku: "CND-PB-02",
    subCatId: CANDLE_CAT_IDS.productBoxes,
    description: "Custom printed candle box with clear PET window for showcase visibility.",
    short_description: "Clear window candle packaging box.",
  },
  {
    name: "Hexagon Candle Box",
    sku: "CND-PB-03",
    subCatId: CANDLE_CAT_IDS.productBoxes,
    description: "Unique 6-sided hexagon candle box for artisanal and handmade candle products.",
    short_description: "Unique hexagon candle box.",
  },

  // Luxury Boxes
  {
    name: "Rigid Magnetic Candle Box",
    sku: "CND-LX-01",
    subCatId: CANDLE_CAT_IDS.luxuryBoxes,
    description: "Sturdy rigid chipboard box with magnetic flip-top closure and custom insert options.",
    short_description: "Magnetic closure rigid candle box.",
  },
  {
    name: "Cylinder Tube Candle Packaging",
    sku: "CND-LX-02",
    subCatId: CANDLE_CAT_IDS.luxuryBoxes,
    description: "Eco-friendly round paperboard tube packaging customized for high-end luxury candles.",
    short_description: "Round paper tube candle box.",
  },

  // Shipping Mailer Boxes
  {
    name: "Heavy-Duty Corrugated Candle Mailer",
    sku: "CND-SM-01",
    subCatId: CANDLE_CAT_IDS.shippingMailers,
    description: "E-commerce ready corrugated shipping box designed to protect glass candle jars in transit.",
    short_description: "Corrugated e-commerce candle mailer.",
  },

  // Box Inserts
  {
    name: "Custom EVA Foam Candle Insert",
    sku: "CND-IN-01",
    subCatId: CANDLE_CAT_IDS.boxInserts,
    description: "Precision cut high-density EVA foam insert to hold glass candle jars firmly in place.",
    short_description: "Shock-absorbing EVA foam insert.",
  },
  {
    name: "Molded Pulp Eco Candle Insert",
    sku: "CND-IN-02",
    subCatId: CANDLE_CAT_IDS.boxInserts,
    description: "100% biodegradable molded sugarcane pulp insert for sustainable candle packaging.",
    short_description: "Eco-friendly molded pulp insert.",
  },

  // Bags
  {
    name: "Custom Printed Kraft Candle Bag",
    sku: "CND-BG-01",
    subCatId: CANDLE_CAT_IDS.bags,
    description: "Premium kraft paper retail bag with twisted handles for candle stores and gift shops.",
    short_description: "Kraft paper retail candle bag.",
  },

  // Packing Paper
  {
    name: "Custom Printed Tissue Packing Paper",
    sku: "CND-PP-01",
    subCatId: CANDLE_CAT_IDS.packingPaper,
    description: "Lightweight custom logo tissue wrapping paper to protect candle surfaces and enhance unboxing.",
    short_description: "Custom printed tissue packing paper.",
  },

  // Labels
  {
    name: "Waterproof Jar Candle Label",
    sku: "CND-LB-01",
    subCatId: CANDLE_CAT_IDS.labels,
    description: "Heat and wax resistant waterproof vinyl labels customized for glass candle jars and tins.",
    short_description: "Heat & wax resistant jar sticker label.",
  },
  {
    name: "Gold Foil Candle Safety Warning Label",
    sku: "CND-LB-02",
    subCatId: CANDLE_CAT_IDS.labels,
    description: "Custom die-cut metallic foil warning labels for candle bottoms and packaging seal tags.",
    short_description: "Foil stamped safety warning sticker.",
  },
];

async function run() {
  console.log("Fetching existing products from WooCommerce...");
  let page = 1;
  let allWCProducts = [];
  while (page <= 5) {
    const prods = await request(`/products?per_page=100&page=${page}`);
    if (!Array.isArray(prods) || prods.length === 0) break;
    allWCProducts = allWCProducts.concat(prods);
    page++;
  }

  console.log(`Loaded ${allWCProducts.length} total products from WooCommerce.`);

  for (const item of PRODUCTS_TO_ADD) {
    const targetSku = item.sku;
    const targetName = item.name.toLowerCase();

    const existing = allWCProducts.find(
      (p) =>
        p.sku === targetSku ||
        p.name.toLowerCase() === targetName
    );

    if (existing) {
      console.log(`Product "${item.name}" (SKU: ${targetSku}) already exists (ID: ${existing.id}).`);
      const currentCatIds = existing.categories ? existing.categories.map((c) => c.id) : [];
      const updatedCatIds = Array.from(new Set([...currentCatIds, CANDLE_PARENT_ID, item.subCatId]));
      if (updatedCatIds.length !== currentCatIds.length) {
        await request(`/products/${existing.id}`, "PUT", {
          categories: updatedCatIds.map((id) => ({ id })),
        });
        console.log(`Updated categories for "${item.name}"`);
      }
    } else {
      console.log(`Creating product "${item.name}" (SKU: ${targetSku})...`);
      const createPayload = {
        name: item.name,
        sku: targetSku,
        type: "simple",
        regular_price: "0",
        description: item.description,
        short_description: item.short_description,
        categories: [{ id: CANDLE_PARENT_ID }, { id: item.subCatId }],
        images: [{ src: DEFAULT_IMAGE }],
      };

      const res = await request("/products", "POST", createPayload);
      if (res && res.id) {
        console.log(`✨ Created product ID ${res.id} for "${item.name}"!`);
      } else {
        console.error(`❌ Failed to create "${item.name}":`, res);
      }
    }
  }

  console.log("\nFinished setting up Candle Packaging products in WooCommerce!");
}

run().catch(console.error);
