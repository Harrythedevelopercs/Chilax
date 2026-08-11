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
const CANDLE_LUXURY_BOXES_ID = 659;

const CANDLE_LUXURY_BOXES_TO_ADD = [
  {
    name: "Match / Slide Style",
    sku: "RP009",
    description: "Elegant Match / Slide Style drawer rigid box with smooth pull out action for luxury candles.",
    short_description: "Match / Slide Style drawer rigid box.",
  },
  {
    name: "Custom Shape",
    sku: "RP011",
    description: "Unique Custom Shape rigid packaging designed for specialty artisan candle collections.",
    short_description: "Custom Shape rigid candle box.",
  },
  {
    name: "Flip Top Magnetic Lock",
    sku: "RP002",
    description: "High-end Flip Top Magnetic Lock rigid box with seamless magnetic closure for candle gift sets.",
    short_description: "Flip Top Magnetic Lock rigid box.",
  },
  {
    name: "Partial Cover",
    sku: "RP005",
    description: "Partial Cover rigid box with exposed inner neck/collar for luxury candle presentation.",
    short_description: "Partial Cover rigid neck box.",
  },
  {
    name: "Round Shaped",
    sku: "RP010",
    description: "Elegant Round Shaped cylinder tube packaging crafted for luxury candles and fragrances.",
    short_description: "Round Shaped paper tube candle packaging.",
  },
  {
    name: "Magnetic Closure Boxes",
    sku: "RP001",
    description: "Premium Magnetic Closure Boxes engineered for luxury candle gift sets.",
    short_description: "Luxury Magnetic Closure Boxes for candles.",
  },
  {
    name: "Lift-off / Detachable Lid",
    sku: "RP004",
    description: "Classic two-piece Lift-off / Detachable Lid rigid box for luxury glass jar candles.",
    short_description: "Lift-off / Detachable Lid rigid box.",
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

  for (const item of CANDLE_LUXURY_BOXES_TO_ADD) {
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
      const updatedCatIds = Array.from(new Set([...currentCatIds, CANDLE_PARENT_ID, CANDLE_LUXURY_BOXES_ID]));

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
          console.log(`✅ Assigned existing product ID ${existing.id} ("${item.name}") to Candle Luxury boxes!`);
        } else {
          console.error(`❌ Failed to update categories for ID ${existing.id}:`, res);
        }
      } else {
        console.log(`ℹ️ Product ID ${existing.id} ("${item.name}") is already assigned to Candle Luxury boxes.`);
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
        categories: [{ id: CANDLE_PARENT_ID }, { id: CANDLE_LUXURY_BOXES_ID }],
        images: [
          {
            src: "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f002-d.jpg",
          },
        ],
      };

      const res = await request("/products", "POST", createPayload);
      if (res && res.id) {
        console.log(`✨ Successfully CREATED product ID ${res.id} (SKU: ${targetSku}, Name: "${item.name}") in Candle Luxury boxes!`);
      } else {
        console.error(`❌ Failed to create product ${targetSku}:`, res);
      }
    }
  }

  console.log("\nFinished adding all 7 Candle Luxury Boxes products!");
}

run().catch(console.error);
