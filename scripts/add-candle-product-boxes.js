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
const CANDLE_PRODUCT_BOXES_ID = 658;

const CANDLE_PRODUCT_BOXES_TO_ADD = [
  {
    name: "Reverse Tuck End",
    sku: "F001",
    description: "Classic Reverse Tuck End packaging box, easy to assemble and ideal for candle retail display.",
    short_description: "Reverse Tuck End candle box.",
  },
  {
    name: "Tuck End Snap Lock Bottom",
    sku: "F004",
    description: "Heavy-duty Tuck End Snap Lock Bottom box providing extra structural support for glass candle jars.",
    short_description: "Snap Lock Bottom candle box.",
  },
  {
    name: "Full Flap Auto Bottom",
    sku: "F006",
    description: "Full Flap Auto Bottom box for heavy glass candles with automatic pop-up bottom assembly.",
    short_description: "Full Flap Auto Bottom candle box.",
  },
  {
    name: "Gable Box",
    sku: "F027",
    description: "Popular Gable Box with integrated carrying handle perfect for candle combo gift sets.",
    short_description: "Custom Gable Box for candles.",
  },
  {
    name: "Straight Tuck End",
    sku: "F002",
    description: "Straight Tuck End box with smooth front display surface for candle branding.",
    short_description: "Straight Tuck End candle box.",
  },
  {
    name: "Tuck End Auto Bottom",
    sku: "F005",
    description: "Tuck End Auto Bottom box offering quick assembly and secure weight capacity for candles.",
    short_description: "Auto Bottom candle packaging box.",
  },
  {
    name: "Pillow",
    sku: "F008",
    description: "Unique curved Pillow box ideal for wax melts, candle favors, and small gift items.",
    short_description: "Custom Pillow box for wax melts & favors.",
  },
  {
    name: "Sleeve",
    sku: "F059",
    description: "Custom printed packaging Sleeve designed to slide over candle boxes, tins, and containers.",
    short_description: "Custom printed packaging sleeve for candles.",
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

  for (const item of CANDLE_PRODUCT_BOXES_TO_ADD) {
    const targetSku = item.sku;
    const targetName = item.name.toLowerCase();

    // Check if product exists by SKU or Name match
    const existing = allWCProducts.find(
      (p) =>
        p.sku === targetSku ||
        p.name.toLowerCase() === targetName ||
        p.name.replace(/&amp;/g, "&").toLowerCase() === targetName
    );

    if (existing) {
      console.log(`Found existing product ID ${existing.id} ("${existing.name}", SKU: "${existing.sku}")`);

      const currentCatIds = existing.categories ? existing.categories.map((c) => c.id) : [];
      const updatedCatIds = Array.from(new Set([...currentCatIds, CANDLE_PARENT_ID, CANDLE_PRODUCT_BOXES_ID]));

      const needCatUpdate = updatedCatIds.length !== currentCatIds.length;
      const needSkuUpdate = !existing.sku || existing.sku !== targetSku;

      if (needCatUpdate || needSkuUpdate) {
        console.log(`Updating product ID ${existing.id} categories (Categories: ${updatedCatIds.join(",")})...`);
        const updatePayload = {
          categories: updatedCatIds.map((id) => ({ id })),
        };
        if (needSkuUpdate) updatePayload.sku = targetSku;

        const res = await request(`/products/${existing.id}`, "PUT", updatePayload);
        if (res && res.id) {
          console.log(`✅ Assigned existing product ID ${existing.id} ("${item.name}") to Candle Product boxes!`);
        } else {
          console.error(`❌ Failed to update categories for ID ${existing.id}:`, res);
        }
      } else {
        console.log(`ℹ️ Product ID ${existing.id} ("${item.name}") is already assigned to Candle Product boxes.`);
      }
    } else {
      console.log(`Product SKU "${targetSku}" ("${item.name}") NOT found in WooCommerce. Creating new product...`);

      const createPayload = {
        name: item.name,
        sku: targetSku,
        type: "simple",
        regular_price: "0",
        description: item.description,
        short_description: item.short_description,
        categories: [{ id: CANDLE_PARENT_ID }, { id: CANDLE_PRODUCT_BOXES_ID }],
        images: [
          {
            src: "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f002-d.jpg",
          },
        ],
      };

      const res = await request("/products", "POST", createPayload);
      if (res && res.id) {
        console.log(`✨ Successfully CREATED product ID ${res.id} (SKU: ${targetSku}, Name: "${item.name}") in Candle Product boxes!`);
      } else {
        console.error(`❌ Failed to create product ${targetSku}:`, res);
      }
    }
  }

  console.log("\nFinished adding all 8 Candle Product Boxes products!");
}

run().catch(console.error);
