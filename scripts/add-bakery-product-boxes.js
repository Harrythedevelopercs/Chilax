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
const BAKERY_PRODUCT_BOXES_ID = 653;

const PRODUCT_BOXES_TO_ADD = [
  {
    name: "Cube Shaped Carrier",
    sku: "F029",
    description: "Custom Cube Shaped Carrier box with built-in handle for pastries, cupcakes, and bakery gifts.",
    short_description: "Cube Shaped Carrier box with handle.",
  },
  {
    name: "4 Corner Box",
    sku: "F040",
    description: "Sturdy 4 Corner Box ideal for cakes, tarts, and baked goods requiring quick folding assembly.",
    short_description: "4 Corner Box for bakery products.",
  },
  {
    name: "Side Lock Cake Box",
    sku: "F045",
    description: "Side Lock Cake Box with secure side locking tabs engineered for safe cake transport.",
    short_description: "Side Lock Cake Box for safe transport.",
  },
  {
    name: "Tulip Boxes",
    sku: "F103",
    description: "Elegant Tulip Boxes with petal folding closure for gourmet cupcakes and delicate treats.",
    short_description: "Tulip Boxes with petal closure.",
  },
  {
    name: "Reverse Tuck End",
    sku: "F001",
    description: "Classic Reverse Tuck End packaging box for bakery cookies, snacks, and retail items.",
    short_description: "Reverse Tuck End bakery box.",
  },
  {
    name: "Tuck End Snap Lock Bottom",
    sku: "F004",
    description: "Heavy-duty Tuck End Snap Lock Bottom box providing extra structural support for heavy baked goods.",
    short_description: "Snap Lock Bottom bakery box.",
  },
  {
    name: "Gable Box",
    sku: "F027",
    description: "Popular Gable Box with integrated carrying handle perfect for bakery combo boxes and party favors.",
    short_description: "Custom Gable Box with handle.",
  },
  {
    name: "Tab Lock Tuck Top",
    sku: "F035",
    description: "Secure Tab Lock Tuck Top box with locking front tab to keep bakery items fresh and protected.",
    short_description: "Tab Lock Tuck Top box.",
  },
  {
    name: "Roll End Tuck Top with Dust Flaps",
    sku: "F042",
    description: "Roll End Tuck Top box with protective dust flaps ideal for premium bakery packaging.",
    short_description: "Roll End Tuck Top box with dust flaps.",
  },
  {
    name: "No Glue Cake Boxes",
    sku: "F099",
    description: "Interlocking No Glue Cake Boxes designed for eco-friendly, glue-free cake and dessert packaging.",
    short_description: "Eco-friendly No Glue Cake Box.",
  },
  {
    name: "Straight Tuck End",
    sku: "F002",
    description: "Straight Tuck End box with smooth front display surface for bakery products.",
    short_description: "Straight Tuck End bakery box.",
  },
  {
    name: "6 Corner Box",
    sku: "F014",
    description: "Pop-up 6 Corner Box with pre-glued side joints for instant bakery cake assembly.",
    short_description: "Pop-up 6 Corner Box.",
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

  for (const item of PRODUCT_BOXES_TO_ADD) {
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

      // Ensure categories include parent (651) and subcategory (653)
      const currentCatIds = existing.categories ? existing.categories.map((c) => c.id) : [];
      const updatedCatIds = Array.from(new Set([...currentCatIds, BAKERY_PARENT_ID, BAKERY_PRODUCT_BOXES_ID]));

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
          console.log(`✅ Assigned existing product ID ${existing.id} ("${item.name}") to Bakery Product boxes!`);
        } else {
          console.error(`❌ Failed to update categories for ID ${existing.id}:`, res);
        }
      } else {
        console.log(`ℹ️ Product ID ${existing.id} ("${item.name}") is already assigned to Bakery Product boxes.`);
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
        categories: [{ id: BAKERY_PARENT_ID }, { id: BAKERY_PRODUCT_BOXES_ID }],
        images: [
          {
            src: "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f002-d.jpg",
          },
        ],
      };

      const res = await request("/products", "POST", createPayload);
      if (res && res.id) {
        console.log(`✨ Successfully CREATED product ID ${res.id} (SKU: ${targetSku}, Name: "${item.name}") in Bakery Product boxes!`);
      } else {
        console.error(`❌ Failed to create product ${targetSku}:`, res);
      }
    }
  }

  console.log("\nFinished adding all 12 products to Bakery & Cake -> Product boxes!");
}

run().catch(console.error);
