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

async function run() {
  console.log("Fetching existing WooCommerce categories...");
  const categories = await request("/products/categories?per_page=100");

  let parentCat = categories.find(
    (c) =>
      c.id === 672 ||
      c.slug === "custom-restaurant-packaging" ||
      c.name.toLowerCase().includes("restaurant")
  );

  if (!parentCat) {
    console.error("Parent category for Custom Restaurant Packaging (672) not found!");
    return;
  }
  console.log(`Found Parent Category: ID ${parentCat.id} ("${parentCat.name}")`);

  let subCat = categories.find(
    (c) =>
      c.parent === parentCat.id &&
      (c.id === 675 || c.name.toLowerCase() === "two piece take out boxes" || c.slug === "two-piece-take-out-boxes")
  );

  if (!subCat) {
    console.log("Two Piece Take Out Boxes subcategory not found under Restaurant! Creating...");
    subCat = await request("/products/categories", "POST", {
      name: "Two Piece Take Out Boxes",
      parent: parentCat.id,
      slug: "two-piece-take-out-boxes",
      description: "Tray and lid boxes for sushi bentos, pastries, and food sets.",
    });
    console.log(`Created Subcategory: ID ${subCat.id} ("${subCat.name}")`);
  } else {
    console.log(`Found Subcategory: ID ${subCat.id} ("${subCat.name}")`);
  }

  const RESTAURANT_PARENT_ID = parentCat.id;
  const TWO_PIECE_TAKEOUT_ID = subCat.id;

  const DEFAULT_IMAGE = "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f005-d.jpg";

  const PRODUCTS_TO_ADD = [
    {
      name: "Custom Paper Food Tray & Sleeve",
      sku: "FBE338",
      url: "https://pakfactory.com/custom-paper-food-tray-sleeve.html",
      description: "Custom paper food tray with protective outer sleeve for gourmet entrees and fast casual dining.",
      short_description: "Custom paper food tray and sleeve.",
    },
    {
      name: "Custom Paper Tray & Lid Take Out Boxes",
      sku: "FBE336",
      url: "https://pakfactory.com/custom-paper-tray-lid-take-out-boxes.html",
      description: "Two-piece tray and lid takeout boxes designed for sushi bentos, meals, and deli counters.",
      short_description: "Custom paper tray and lid takeout boxes.",
    },
    {
      name: "Custom Sushi Take Out Box",
      sku: "FBE322",
      url: "https://pakfactory.com/custom-two-piece-tray-lid-with-window.html",
      description: "Two-piece tray and lid sushi takeout box featuring a clear window for premium food presentation.",
      short_description: "Custom sushi takeout box with window.",
    },
    {
      name: "Partial Cover and Tray with Spot UV",
      sku: "FBE276",
      url: "https://pakfactory.com/partial-cover-and-tray-with-spot-uv.html",
      description: "Luxury partial cover and food tray with spot UV finish for high-end gift sets and artisanal treats.",
      short_description: "Partial cover and tray with spot UV.",
    },
    {
      name: "Kraft Brown Box with Lid",
      sku: "FBE064",
      url: "https://pakfactory.com/kraft-brown-box-with-lid.html",
      description: "Natural eco-friendly kraft brown two-piece food box with tight-fitting lid.",
      short_description: "Kraft brown food box with lid.",
    },
    {
      name: "Custom Cupcake Box",
      sku: "FBE059",
      url: "https://pakfactory.com/custom-cup-cake-box.html",
      description: "Custom printed cupcake box with sturdy two-piece construction and insert holders.",
      short_description: "Custom printed cupcake box.",
    },
    {
      name: "Custom 2 Pieces Boxes",
      sku: "FBE041",
      url: "https://pakfactory.com/custom-2-pieces-boxes.html",
      description: "Versatile custom two-piece rigid and folding boxes for restaurant food packaging.",
      short_description: "Custom 2 pieces food boxes.",
    },
  ];

  console.log("\nFetching existing products from WooCommerce...");
  let page = 1;
  let allWCProducts = [];
  while (page <= 10) {
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
        p.name.toLowerCase() === targetName ||
        p.name.replace(/&amp;/g, "&").toLowerCase() === targetName
    );

    if (existing) {
      console.log(`Found existing product ID ${existing.id} ("${existing.name}", SKU: "${existing.sku}")`);

      const currentCatIds = existing.categories ? existing.categories.map((c) => c.id) : [];
      const updatedCatIds = Array.from(new Set([...currentCatIds, RESTAURANT_PARENT_ID, TWO_PIECE_TAKEOUT_ID]));

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
          console.log(`✅ Assigned existing product ID ${existing.id} ("${item.name}") to Two Piece Take Out Boxes!`);
        } else {
          console.error(`❌ Failed to update categories for ID ${existing.id}:`, res);
        }
      } else {
        console.log(`ℹ️ Product ID ${existing.id} ("${item.name}") is already assigned to Two Piece Take Out Boxes.`);
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
        categories: [{ id: RESTAURANT_PARENT_ID }, { id: TWO_PIECE_TAKEOUT_ID }],
        images: [
          {
            src: DEFAULT_IMAGE,
          },
        ],
      };

      const res = await request("/products", "POST", createPayload);
      if (res && res.id) {
        console.log(`✨ Successfully CREATED product ID ${res.id} (SKU: ${targetSku}, Name: "${item.name}") in Two Piece Take Out Boxes!`);
      } else {
        console.error(`❌ Failed to create product ${targetSku}:`, res);
      }
    }
  }

  console.log("\nFinished adding all 7 products to Custom Restaurant Packaging -> Two Piece Take Out Boxes!");
}

run().catch(console.error);
