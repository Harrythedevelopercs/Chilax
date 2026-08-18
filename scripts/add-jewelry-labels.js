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
      c.id === 665 ||
      c.slug === "custom-jewelry-accessories-packaging" ||
      c.name.toLowerCase() === "custom jewelry & accessories packaging" ||
      c.name.toLowerCase() === "custom jewelry packaging"
  );

  if (!parentCat) {
    console.error("Parent category for Custom Jewelry Packaging (665) not found!");
    return;
  }
  console.log(`Found Parent Category: ID ${parentCat.id} ("${parentCat.name}")`);

  let labelsSubCat = categories.find(
    (c) =>
      c.parent === parentCat.id &&
      (c.id === 671 || c.name.toLowerCase() === "labels" || c.slug.includes("label"))
  );

  if (!labelsSubCat) {
    console.log("Labels subcategory not found under Jewelry! Creating...");
    labelsSubCat = await request("/products/categories", "POST", {
      name: "Labels",
      parent: parentCat.id,
      slug: "labels-custom-jewelry-accessories-packaging",
      description: "Gold foil stamped seal stickers, packaging labels & custom die-cut sheet labels for jewelry.",
    });
    console.log(`Created Labels Subcategory: ID ${labelsSubCat.id} ("${labelsSubCat.name}")`);
  } else {
    console.log(`Found Labels Subcategory: ID ${labelsSubCat.id} ("${labelsSubCat.name}")`);
  }

  const JEWELRY_PARENT_ID = parentCat.id;
  const JEWELRY_LABELS_ID = labelsSubCat.id;

  const LABELS_PRODUCTS_TO_ADD = [
    {
      name: "Custom Labels",
      sku: "LB021",
      url: "https://pakfactory.com/custom-printed-labels.html",
      description: "High-quality Custom Printed Labels for jewelry box packaging, gift bags, and anti-tarnish branding seals.",
      short_description: "Custom Printed Labels for jewelry branding.",
    },
    {
      name: "Custom Rectangle Sheet Labels",
      sku: "LB011",
      url: "https://pakfactory.com/custom-rectangle-sheet-labels.html",
      description: "Custom Rectangle Sheet Labels ideal for jewelry box sealing, pricing tags, and branded packaging seals.",
      short_description: "Custom Rectangle Sheet Labels for jewelry.",
    },
    {
      name: "Custom Stickers",
      sku: "LB020",
      url: "https://pakfactory.com/custom-printed-stickers.html",
      description: "Vibrant Custom Printed Stickers for jewelry pouches, box seals, promotional giveaways, and luxury gift presentation.",
      short_description: "Custom Printed Stickers for jewelry packaging.",
    },
    {
      name: "Custom Packaging Labels",
      sku: "LB009",
      url: "https://pakfactory.com/custom-packaging-labels.html",
      description: "Waterproof and premium finish Custom Packaging Labels for fine jewelry containers, box seals, and velvet pouches.",
      short_description: "Custom Packaging Labels for fine jewelry.",
    },
    {
      name: "Custom Shape Sheet Labels",
      sku: "LB012",
      url: "https://pakfactory.com/custom-shape-sheet-labels.html",
      description: "Custom die-cut Shape Sheet Labels tailored in unique shapes for jewelry logos, anti-tarnish seals, and gift wrap.",
      short_description: "Custom die-cut Shape Sheet Labels for jewelry.",
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

  for (const item of LABELS_PRODUCTS_TO_ADD) {
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
      const updatedCatIds = Array.from(new Set([...currentCatIds, JEWELRY_PARENT_ID, JEWELRY_LABELS_ID]));

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
          console.log(`✅ Assigned existing product ID ${existing.id} ("${item.name}") to Jewelry Labels!`);
        } else {
          console.error(`❌ Failed to update categories for ID ${existing.id}:`, res);
        }
      } else {
        console.log(`ℹ️ Product ID ${existing.id} ("${item.name}") is already assigned to Jewelry Labels.`);
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
        categories: [{ id: JEWELRY_PARENT_ID }, { id: JEWELRY_LABELS_ID }],
        images: [
          {
            src: "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f005-d.jpg",
          },
        ],
      };

      const res = await request("/products", "POST", createPayload);
      if (res && res.id) {
        console.log(`✨ Successfully CREATED product ID ${res.id} (SKU: ${targetSku}, Name: "${item.name}") in Jewelry Labels!`);
      } else {
        console.error(`❌ Failed to create product ${targetSku}:`, res);
      }
    }
  }

  console.log("\nFinished adding all 5 products to Custom Jewelry Packaging -> Labels!");
}

run().catch(console.error);
