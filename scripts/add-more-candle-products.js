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

const ADDITIONAL_CANDLE_PRODUCTS = [
  // 1. Best Sellers
  {
    name: "Tuck End Candle Packaging Box",
    sku: "CND-BS-03",
    subCatId: CANDLE_CAT_IDS.bestSellers,
    description: "Classic straight tuck end folding carton box for individual candle jars and wax melts.",
    short_description: "Classic tuck end candle jar box.",
  },
  {
    name: "Custom Printed Metallic Foil Candle Box",
    sku: "CND-BS-04",
    subCatId: CANDLE_CAT_IDS.bestSellers,
    description: "Luxury foil-stamped folding carton box designed for premium aromatherapy candles.",
    short_description: "Foil-stamped aromatherapy candle box.",
  },

  // 2. Product Boxes
  {
    name: "Reverse Tuck End Candle Box",
    sku: "CND-PB-04",
    subCatId: CANDLE_CAT_IDS.productBoxes,
    description: "Versatile reverse tuck end retail packaging box for candle tins and small jars.",
    short_description: "Reverse tuck end candle box.",
  },
  {
    name: "Straight Tuck End Candle Box",
    sku: "CND-PB-05",
    subCatId: CANDLE_CAT_IDS.productBoxes,
    description: "Smooth front display straight tuck end box ideal for custom branding and retail shelves.",
    short_description: "Straight tuck end candle box.",
  },
  {
    name: "Two-Piece Candle Box with Lid",
    sku: "CND-PB-06",
    subCatId: CANDLE_CAT_IDS.productBoxes,
    description: "Sturdy two-piece telescoping candle box with base and lid for luxury glass candles.",
    short_description: "Two-piece telescoping candle box.",
  },

  // 3. Luxury Boxes
  {
    name: "Shoulder Rigid Candle Gift Box",
    sku: "CND-LX-03",
    subCatId: CANDLE_CAT_IDS.luxuryBoxes,
    description: "Elegant neck/shoulder rigid box with inner collar for high-end luxury candle collections.",
    short_description: "Neck shoulder rigid candle box.",
  },
  {
    name: "Drawer Slide Rigid Candle Box",
    sku: "CND-LX-04",
    subCatId: CANDLE_CAT_IDS.luxuryBoxes,
    description: "Slide-out drawer rigid packaging box with ribbon pull tab for luxury candle unboxing.",
    short_description: "Slide drawer rigid candle box.",
  },

  // 4. Shipping Mailer Boxes
  {
    name: "Roll End Tuck Top Candle Mailer",
    sku: "CND-SM-02",
    subCatId: CANDLE_CAT_IDS.shippingMailers,
    description: "Roll end tuck top corrugated mailer with dust flaps to protect fragile glass candles.",
    short_description: "RETT corrugated candle mailer.",
  },
  {
    name: "Kraft Die-Cut Candle Shipping Mailer",
    sku: "CND-SM-03",
    subCatId: CANDLE_CAT_IDS.shippingMailers,
    description: "Eco-friendly unbleached brown kraft corrugated box for sustainable e-commerce shipping.",
    short_description: "Eco kraft corrugated candle mailer.",
  },

  // 5. Box Inserts
  {
    name: "Corrugated Board Candle Divider Insert",
    sku: "CND-IN-03",
    subCatId: CANDLE_CAT_IDS.boxInserts,
    description: "Custom grid corrugated divider inserts for multi-pack candle gift boxes.",
    short_description: "Corrugated multi-candle divider insert.",
  },

  // 6. Bags
  {
    name: "Velvet Drawstring Candle Pouch",
    sku: "CND-BG-02",
    subCatId: CANDLE_CAT_IDS.bags,
    description: "Soft velvet gift pouch with drawstring closure for boutique candle packaging.",
    short_description: "Soft velvet candle gift pouch.",
  },
  {
    name: "Satin Ribbon Candle Tote Bag",
    sku: "CND-BG-03",
    subCatId: CANDLE_CAT_IDS.bags,
    description: "Heavyweight paper shopping bag with ribbon handles for luxury candle boutiques.",
    short_description: "Satin ribbon paper candle tote bag.",
  },

  // 7. Packing Paper
  {
    name: "Waxed Protective Candle Wrapping Paper",
    sku: "CND-PP-02",
    subCatId: CANDLE_CAT_IDS.packingPaper,
    description: "Greaseproof and wax-resistant wrapping paper for handmade scented wax candles.",
    short_description: "Wax-resistant protective wrapping paper.",
  },
  {
    name: "Honeycomb Eco Cushioning Paper",
    sku: "CND-PP-03",
    subCatId: CANDLE_CAT_IDS.packingPaper,
    description: "Expandable honeycomb kraft paper wrap for plastic-free glass jar candle protection.",
    short_description: "Eco honeycomb wrapping paper.",
  },

  // 8. Labels
  {
    name: "Matte Finish Candle Jar Sticker",
    sku: "CND-LB-03",
    subCatId: CANDLE_CAT_IDS.labels,
    description: "Premium soft-touch matte adhesive labels custom die-cut for candle jars and tins.",
    short_description: "Soft-touch matte candle jar label.",
  },
  {
    name: "Clear Vinyl Transparent Candle Label",
    sku: "CND-LB-04",
    subCatId: CANDLE_CAT_IDS.labels,
    description: "Crystal clear waterproof labels designed for clear and amber glass candle jars.",
    short_description: "Clear transparent waterproof candle label.",
  },
];

async function run() {
  console.log("Adding additional candle products to WooCommerce...");
  for (const item of ADDITIONAL_CANDLE_PRODUCTS) {
    const createPayload = {
      name: item.name,
      sku: item.sku,
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

  console.log("\nSuccessfully added all additional Candle Packaging products!");
}

run().catch(console.error);
