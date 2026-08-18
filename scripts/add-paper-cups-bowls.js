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
      (c.id === 683 || c.name.toLowerCase().includes("cups") || c.slug.includes("paper-cups-bowls"))
  );

  if (!subCat) {
    console.log("Paper Cups & Bowls subcategory not found under Restaurant! Creating...");
    subCat = await request("/products/categories", "POST", {
      name: "Paper Cups & Bowls",
      parent: parentCat.id,
      slug: "paper-cups-bowls",
      description: "Round containers to carry liquids, soups, coffee, and ice cream.",
    });
    console.log(`Created Subcategory: ID ${subCat.id} ("${subCat.name}")`);
  } else {
    console.log(`Found Subcategory: ID ${subCat.id} ("${subCat.name}")`);
  }

  const RESTAURANT_PARENT_ID = parentCat.id;
  const PAPER_CUPS_BOWLS_ID = subCat.id;

  const DEFAULT_IMAGE = "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f005-d.jpg";

  const PRODUCTS_TO_ADD = [
    {
      name: "Soup Paper Cup",
      sku: "CU020",
      url: "https://pakfactory.com/soup-paper-cup.html",
      description: "Heavy-duty poly-coated soup paper cups with vented paper lids for hot soups and stews.",
      short_description: "Soup paper cups with lids.",
    },
    {
      name: "Fries Cup",
      sku: "CU007",
      url: "https://pakfactory.com/custom-printed-fries-cup.html",
      description: "Custom printed french fry paper cups designed for easy grab-and-go fast food snacking.",
      short_description: "Custom printed french fry paper cup.",
    },
    {
      name: "Custom Printed Single Wall Coffee Cups",
      sku: "CU006",
      url: "https://pakfactory.com/custom-printed-single-wall-coffee-cups.html",
      description: "Vibrant custom printed single wall paper coffee cups for hot and cold beverages.",
      short_description: "Custom printed single wall coffee cups.",
    },
    {
      name: "Custom Printed Double Wall Coffee Cups",
      sku: "CU005",
      url: "https://pakfactory.com/custom-printed-double-wall-coffee-cups.html",
      description: "Insulated double wall paper coffee cups providing heat protection without needing a separate sleeve.",
      short_description: "Custom printed double wall coffee cups.",
    },
    {
      name: "Disposable Ice Cream Paper Cup",
      sku: "CU002",
      url: "https://pakfactory.com/disposable-ice-cream-paper-cup.html",
      description: "Leakproof poly-coated paper ice cream cups ideal for gelato, frozen yogurt, and ice cream parlors.",
      short_description: "Disposable ice cream paper cup.",
    },
    {
      name: "Custom Printed Compostable Bowls",
      sku: "CB001",
      url: "https://pakfactory.com/custom-printed-compostable-bowls.html",
      description: "Eco-friendly 100% compostable paper bowls for salads, grain bowls, and hot entrees.",
      short_description: "Custom printed compostable bowls.",
    },
    {
      name: "Custom Printed Paper Cup Sleeves",
      sku: "FBE364",
      url: "https://pakfactory.com/custom-printed-white-cup-sleeves.html",
      description: "Heat-resistant custom printed white paper cup sleeves to brand your coffee and beverage cups.",
      short_description: "Custom printed paper cup sleeves.",
    },
    {
      name: "Custom Printed Kraft Cup Sleeves",
      sku: "FBE363",
      url: "https://pakfactory.com/custom-printed-kraft-cup-sleeves.html",
      description: "Eco-friendly corrugated kraft paper cup sleeves for thermal protection and brand logo printing.",
      short_description: "Custom printed kraft cup sleeves.",
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
      const updatedCatIds = Array.from(new Set([...currentCatIds, RESTAURANT_PARENT_ID, PAPER_CUPS_BOWLS_ID]));

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
          console.log(`✅ Assigned existing product ID ${existing.id} ("${item.name}") to Paper Cups & Bowls!`);
        } else {
          console.error(`❌ Failed to update categories for ID ${existing.id}:`, res);
        }
      } else {
        console.log(`ℹ️ Product ID ${existing.id} ("${item.name}") is already assigned to Paper Cups & Bowls.`);
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
        categories: [{ id: RESTAURANT_PARENT_ID }, { id: PAPER_CUPS_BOWLS_ID }],
        images: [
          {
            src: DEFAULT_IMAGE,
          },
        ],
      };

      const res = await request("/products", "POST", createPayload);
      if (res && res.id) {
        console.log(`✨ Successfully CREATED product ID ${res.id} (SKU: ${targetSku}, Name: "${item.name}") in Paper Cups & Bowls!`);
      } else {
        console.error(`❌ Failed to create product ${targetSku}:`, res);
      }
    }
  }

  console.log("\nFinished adding all 8 products to Custom Restaurant Packaging -> Paper Cups & Bowls!");
}

run().catch(console.error);
