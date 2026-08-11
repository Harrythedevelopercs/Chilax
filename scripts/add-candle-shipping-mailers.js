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
const CANDLE_SHIPPING_MAILERS_ID = 660;

const CANDLE_SHIPPING_MAILERS_TO_ADD = [
  {
    name: "1-2-3 Bottom Slotted Container",
    sku: "C019",
    description: "Heavy-duty 1-2-3 Bottom Slotted Container engineered for secure candle shipping and storage.",
    short_description: "1-2-3 Bottom Slotted Container for candle shipping.",
  },
  {
    name: "Poly Mailers",
    sku: "ME004",
    description: "Waterproof and tear-resistant Poly Mailers for shipping non-fragile candle accessories and wax melts.",
    short_description: "Waterproof Poly Mailers for candle accessories.",
  },
  {
    name: "Soft Shell Poly Bubble Mailers",
    sku: "ME012",
    description: "Cushioned Soft Shell Poly Bubble Mailers for protected e-commerce shipping of small candle items.",
    short_description: "Soft Shell Poly Bubble Mailers.",
  },
  {
    name: "Tab Lock Roll End Corrugated Box",
    sku: "C001",
    description: "Heavy-duty Tab Lock Roll End Corrugated Box built for safe e-commerce shipping of glass jar candles.",
    short_description: "Tab Lock Roll End Corrugated shipping box.",
  },
  {
    name: "Roll End Tuck Front Corrugated Box",
    sku: "C003",
    description: "Secure Roll End Tuck Front Corrugated Box ideal for subscription candle boxes and unboxing experience.",
    short_description: "Roll End Tuck Front corrugated mailer box.",
  },
  {
    name: "Corrugated Slotted Container",
    sku: "C018",
    description: "Durable Corrugated Slotted Container for bulk candle shipping and protective transit packaging.",
    short_description: "Corrugated Slotted Container for candle shipping.",
  },
  {
    name: "Kraft Mailers",
    sku: "ME001",
    description: "Eco-friendly natural brown Kraft Mailers crafted for sustainable candle shipping and e-commerce.",
    short_description: "Eco-friendly Kraft Mailers.",
  },
  {
    name: "Poly Bubble Mailers",
    sku: "ME010",
    description: "Protective Poly Bubble Mailers with bubble wrap interior for shipping candle jars and tins.",
    short_description: "Protective Poly Bubble Mailers.",
  },
  {
    name: "Hard Shell Poly Bubble Mailers",
    sku: "ME013",
    description: "Extra durable Hard Shell Poly Bubble Mailers designed for maximum puncture resistance in shipping.",
    short_description: "Hard Shell Poly Bubble Mailers.",
  },
  {
    name: "Roll End Tuck Top Corrugated Box",
    sku: "C002",
    description: "Roll End Tuck Top Corrugated Box with dust flaps to protect fragile glass candles during transit.",
    short_description: "Roll End Tuck Top corrugated candle mailer.",
  },
  {
    name: "Roll End 3 Flap Lock Corrugated Box",
    sku: "C004",
    description: "Extra secure Roll End 3 Flap Lock Corrugated Box engineered for high-impact candle shipping.",
    short_description: "Roll End 3 Flap Lock corrugated box.",
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

  for (const item of CANDLE_SHIPPING_MAILERS_TO_ADD) {
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
      const updatedCatIds = Array.from(new Set([...currentCatIds, CANDLE_PARENT_ID, CANDLE_SHIPPING_MAILERS_ID]));

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
          console.log(`✅ Assigned existing product ID ${existing.id} ("${item.name}") to Candle Shipping Mailers!`);
        } else {
          console.error(`❌ Failed to update categories for ID ${existing.id}:`, res);
        }
      } else {
        console.log(`ℹ️ Product ID ${existing.id} ("${item.name}") is already assigned to Candle Shipping Mailers.`);
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
        categories: [{ id: CANDLE_PARENT_ID }, { id: CANDLE_SHIPPING_MAILERS_ID }],
        images: [
          {
            src: "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f002-d.jpg",
          },
        ],
      };

      const res = await request("/products", "POST", createPayload);
      if (res && res.id) {
        console.log(`✨ Successfully CREATED product ID ${res.id} (SKU: ${targetSku}, Name: "${item.name}") in Candle Shipping Mailers!`);
      } else {
        console.error(`❌ Failed to create product ${targetSku}:`, res);
      }
    }
  }

  console.log("\nFinished adding all 11 Candle Shipping Mailers products!");
}

run().catch(console.error);
