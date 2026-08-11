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
const BAKERY_BESTSELLERS_ID = 652;

const BESTSELLERS_TO_ADD = [
  {
    name: "Straight Tuck End",
    sku: "F002",
    description: "Custom Straight Tuck End boxes engineered for bakery products, pastries, and food packaging. Features smooth folding flaps and durable structural integrity.",
    short_description: "Custom Straight Tuck End bakery & pastry boxes.",
  },
  {
    name: "Side Lock Cake Box",
    sku: "F045",
    description: "Premium Side Lock Cake Box designed to securely hold cakes, pies, and baked goods during delivery and display.",
    short_description: "Secure Side Lock Cake Box for bakeries.",
  },
  {
    name: "Tulip Boxes",
    sku: "F103",
    description: "Elegant Tulip Boxes featuring unique petal folding tops ideal for cupcakes, gourmet treats, and artisan bakery gifts.",
    short_description: "Decorative Tulip Boxes for cupcakes & pastries.",
  },
  {
    name: "Reverse Tuck End",
    sku: "F001",
    description: "Classic Reverse Tuck End packaging box, easy to assemble and ideal for bakery snacks, cookies, and retail items.",
    short_description: "Versatile Reverse Tuck End bakery box.",
  },
  {
    name: "6 Corner Box",
    sku: "F014",
    description: "Collapsible 6 Corner Box with pre-glued corners that pop up instantly for quick assembly of cakes, donuts, and pastries.",
    short_description: "Fast pop-up 6 Corner Box for cakes & donuts.",
  },
  {
    name: "No Glue Cake Boxes",
    sku: "F099",
    description: "Eco-friendly No Glue Cake Boxes designed with self-interlocking flaps for glue-free, food-safe cake packaging.",
    short_description: "Self-interlocking No Glue Cake Boxes.",
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

  for (const item of BESTSELLERS_TO_ADD) {
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

      // Ensure categories include parent (651) and subcategory (652)
      const currentCatIds = existing.categories ? existing.categories.map((c) => c.id) : [];
      const updatedCatIds = Array.from(new Set([...currentCatIds, BAKERY_PARENT_ID, BAKERY_BESTSELLERS_ID]));

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
          console.log(`✅ Assigned existing product ID ${existing.id} ("${item.name}") to Bakery Best sellers!`);
        } else {
          console.error(`❌ Failed to update categories for ID ${existing.id}:`, res);
        }
      } else {
        console.log(`ℹ️ Product ID ${existing.id} ("${item.name}") is already assigned to Bakery Best sellers.`);
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
        categories: [{ id: BAKERY_PARENT_ID }, { id: BAKERY_BESTSELLERS_ID }],
        images: [
          {
            src: "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f002-d.jpg",
          },
        ],
      };

      const res = await request("/products", "POST", createPayload);
      if (res && res.id) {
        console.log(`✨ Successfully CREATED product ID ${res.id} (SKU: ${targetSku}, Name: "${item.name}") in Bakery Best sellers!`);
      } else {
        console.error(`❌ Failed to create product ${targetSku}:`, res);
      }
    }
  }

  console.log("\nFinished adding all 6 products to Bakery & Cake -> Best sellers!");
}

run().catch(console.error);
