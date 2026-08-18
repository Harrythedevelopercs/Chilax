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
      (c.id === 677 || c.name.toLowerCase() === "chinese take out boxes" || c.slug === "chinese-take-out-boxes")
  );

  if (!subCat) {
    console.log("Chinese Take Out Boxes subcategory not found under Restaurant! Creating...");
    subCat = await request("/products/categories", "POST", {
      name: "Chinese Take Out Boxes",
      parent: parentCat.id,
      slug: "chinese-take-out-boxes",
      description: "Classic chinese boxes to hold noodles, rice, and entrees.",
    });
    console.log(`Created Subcategory: ID ${subCat.id} ("${subCat.name}")`);
  } else {
    console.log(`Found Subcategory: ID ${subCat.id} ("${subCat.name}")`);
  }

  const RESTAURANT_PARENT_ID = parentCat.id;
  const CHINESE_TAKEOUT_ID = subCat.id;

  const DEFAULT_IMAGE = "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f005-d.jpg";

  const PRODUCTS_TO_ADD = [
    {
      name: "Custom Paper Food Trays",
      sku: "FBE339",
      url: "https://pakfactory.com/custom-paper-food-trays.html",
      description: "Open top kraft paper food trays for serving side dishes, fried snacks, and casual takeout meals.",
      short_description: "Custom paper food trays.",
    },
    {
      name: "Custom Hinge Lock Take Out Boxes with Window",
      sku: "FBE335",
      url: "https://pakfactory.com/custom-hinge-lock-take-out-boxes-with-window.html",
      description: "Custom hinge lock food containers featuring a display window for fresh hot and cold entrees.",
      short_description: "Custom hinge lock take out box with window.",
    },
    {
      name: "Custom Front Tuck Collapsible Take Out Boxes",
      sku: "FBE334",
      url: "https://pakfactory.com/custom-front-tuck-collapsible-take-out-boxes.html",
      description: "Space-saving front tuck collapsible takeout boxes designed for easy assembly and secure food transport.",
      short_description: "Collapsible front tuck takeout boxes.",
    },
    {
      name: "Custom Paper Fry Boxes",
      sku: "FBE326",
      url: "https://pakfactory.com/custom-paper-fry-boxes-with-vents.html",
      description: "Custom paper french fry scoop boxes engineered with steam vents to keep fries hot and crispy.",
      short_description: "Custom paper fry boxes with vents.",
    },
    {
      name: "Custom Chinese Take Out Box",
      sku: "FBE309",
      url: "https://pakfactory.com/custom-chinese-take-out-box.html",
      description: "Classic wire-handle or paper-handle leakproof Chinese takeout box for noodles, fried rice, and Asian cuisine.",
      short_description: "Classic Chinese takeout box.",
    },
    {
      name: "Custom Double Hook Paper Take Out Boxes",
      sku: "FBE307",
      url: "https://pakfactory.com/custom-double-hook-paper-take-out-boxes.html",
      description: "Double hook lock paper food boxes engineered for heavy entrees and leak-resistant side flaps.",
      short_description: "Double hook paper takeout box.",
    },
    {
      name: "Custom Single Hook Paper Take Out Boxes",
      sku: "FBE306",
      url: "https://pakfactory.com/custom-single-hook-paper-take-out-boxes.html",
      description: "Single hook paper food boxes ideal for fast takeout service and food trucks.",
      short_description: "Single hook paper takeout box.",
    },
    {
      name: "Salad Take Out Box",
      sku: "FBE100",
      url: "https://pakfactory.com/salad-takeout-box.html",
      description: "Food-safe poly-coated paperboard salad takeout boxes with oil and moisture resistance.",
      short_description: "Salad takeout paperboard box.",
    },
    {
      name: "Fast-Food Noodle Box",
      sku: "FBE062",
      url: "https://pakfactory.com/fast-food-noodle-box.html",
      description: "Convenient round bottom or square bottom fast-food noodle box for takeout pasta and rice bowls.",
      short_description: "Fast-food noodle takeout box.",
    },
    {
      name: "Fast Food Takeout Box",
      sku: "FBE060",
      url: "https://pakfactory.com/yellow-takeout-box.html",
      description: "Bright custom printed fast food takeout box with secure top closure flaps.",
      short_description: "Fast food takeout box.",
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
      const updatedCatIds = Array.from(new Set([...currentCatIds, RESTAURANT_PARENT_ID, CHINESE_TAKEOUT_ID]));

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
          console.log(`✅ Assigned existing product ID ${existing.id} ("${item.name}") to Chinese Take Out Boxes!`);
        } else {
          console.error(`❌ Failed to update categories for ID ${existing.id}:`, res);
        }
      } else {
        console.log(`ℹ️ Product ID ${existing.id} ("${item.name}") is already assigned to Chinese Take Out Boxes.`);
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
        categories: [{ id: RESTAURANT_PARENT_ID }, { id: CHINESE_TAKEOUT_ID }],
        images: [
          {
            src: DEFAULT_IMAGE,
          },
        ],
      };

      const res = await request("/products", "POST", createPayload);
      if (res && res.id) {
        console.log(`✨ Successfully CREATED product ID ${res.id} (SKU: ${targetSku}, Name: "${item.name}") in Chinese Take Out Boxes!`);
      } else {
        console.error(`❌ Failed to create product ${targetSku}:`, res);
      }
    }
  }

  console.log("\nFinished adding all 10 products to Custom Restaurant Packaging -> Chinese Take Out Boxes!");
}

run().catch(console.error);
