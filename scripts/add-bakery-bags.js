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

const BAKERY_PARENT_ID = 651;
const BAKERY_BAGS_ID = 654;

const BAGS_TO_ADD = [
  {
    name: "Bakery Pouch",
    sku: "B153",
    description: "Custom Bakery Pouch designed for cookies, pastries, and baked treats. Food-safe barrier protection keeps bakery items fresh.",
    short_description: "Food-safe Bakery Pouch for cookies & pastries.",
  },
  {
    name: "SOS Bags",
    sku: "B001",
    description: "Self-Opening Square (SOS) kraft bags with flat bottoms designed for bakery takeout, donuts, and bread loafs.",
    short_description: "SOS Kraft Bags for bakery takeout.",
  },
  {
    name: "Custom Paper Food Bags",
    sku: "B011",
    description: "Custom printed Paper Food Bags suitable for pastries, croissants, and artisan bakery products.",
    short_description: "Custom printed Paper Food Bags.",
  },
  {
    name: "Kraft Paper Bags",
    sku: "B020",
    description: "Eco-friendly Kraft Paper Bags with sturdy handles for bakery orders, pastries, and food delivery.",
    short_description: "Sturdy Kraft Paper Bags with handles.",
  },
  {
    name: "Custom Bakery Bag",
    sku: "B154",
    description: "Personalized Custom Bakery Bag tailored for branded cookies, muffins, and bakery packaging.",
    short_description: "Custom Bakery Bag for branded packaging.",
  },
  {
    name: "Custom Bread Bag with Window",
    sku: "B010",
    description: "Custom Bread Bag featuring a clear display window to showcase fresh baguettes, sourdough, and artisan loaves.",
    short_description: "Clear window Bread Bag for fresh loaves.",
  },
  {
    name: "Custom Paper Food Pouches",
    sku: "B012",
    description: "High-quality Paper Food Pouches with grease-resistant lining for warm bakery snacks and pastries.",
    short_description: "Grease-resistant Paper Food Pouches.",
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

  for (const item of BAGS_TO_ADD) {
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

      // Ensure categories include parent (651) and subcategory (654)
      const currentCatIds = existing.categories ? existing.categories.map((c) => c.id) : [];
      const updatedCatIds = Array.from(new Set([...currentCatIds, BAKERY_PARENT_ID, BAKERY_BAGS_ID]));

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
          console.log(`✅ Assigned existing product ID ${existing.id} ("${item.name}") to Bakery Bags!`);
        } else {
          console.error(`❌ Failed to update categories for ID ${existing.id}:`, res);
        }
      } else {
        console.log(`ℹ️ Product ID ${existing.id} ("${item.name}") is already assigned to Bakery Bags.`);
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
        categories: [{ id: BAKERY_PARENT_ID }, { id: BAKERY_BAGS_ID }],
        images: [
          {
            src: "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/m/e/me004_poly_mailers_02.jpg",
          },
        ],
      };

      const res = await request("/products", "POST", createPayload);
      if (res && res.id) {
        console.log(`✨ Successfully CREATED product ID ${res.id} (SKU: ${targetSku}, Name: "${item.name}") in Bakery Bags!`);
      } else {
        console.error(`❌ Failed to create product ${targetSku}:`, res);
      }
    }
  }

  console.log("\nFinished adding all 7 products to Bakery & Cake -> Bags!");
}

run().catch(console.error);
