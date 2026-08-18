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

  let pizzaSubCat = categories.find(
    (c) =>
      c.parent === parentCat.id &&
      (c.id === 673 || c.name.toLowerCase() === "pizza boxes" || c.slug === "pizza-boxes")
  );

  if (!pizzaSubCat) {
    console.log("Pizza Boxes subcategory not found under Restaurant! Creating...");
    pizzaSubCat = await request("/products/categories", "POST", {
      name: "Pizza Boxes",
      parent: parentCat.id,
      slug: "pizza-boxes",
      description: "Custom printed corrugated pizza boxes, slice boxes, and burger boxes.",
    });
    console.log(`Created Pizza Boxes Subcategory: ID ${pizzaSubCat.id} ("${pizzaSubCat.name}")`);
  } else {
    console.log(`Found Pizza Boxes Subcategory: ID ${pizzaSubCat.id} ("${pizzaSubCat.name}")`);
  }

  const RESTAURANT_PARENT_ID = parentCat.id;
  const PIZZA_BOXES_ID = pizzaSubCat.id;

  const PIZZA_PRODUCTS_TO_ADD = [
    {
      name: "Custom Triangle Pizza Slice Boxes",
      sku: "FBE302",
      url: "https://pakfactory.com/custom-triangle-pizza-slice-boxes.html",
      description: "Custom printed triangle pizza slice boxes engineered for single slice pizza serving, food trucks, and takeout convenience.",
      short_description: "Custom printed triangle pizza slice boxes.",
      image: "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f005-d.jpg",
    },
    {
      name: "Custom Pizza Boxes",
      sku: "CBE301",
      url: "https://pakfactory.com/custom-printed-white-pizza-boxes.html",
      description: "High-quality custom printed white corrugated pizza boxes with grease-resistant lining and sturdy heat-retaining flaps.",
      short_description: "Custom printed white corrugated pizza boxes.",
      image: "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/c/0/c001_tab_lock_roll_end_corrugated_box_01.jpg",
    },
    {
      name: "Corrugated Burger Boxes with Window",
      sku: "CBE283",
      url: "https://pakfactory.com/corrugated-burger-boxes-with-window.html",
      description: "Sturdy corrugated burger boxes with clear display window, ideal for gourmet burgers, sliders, and fast-casual takeout packaging.",
      short_description: "Corrugated burger boxes with window display.",
      image: "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/c/0/c004_roll_end_3_flap_lock_corrugated_box_01.jpg",
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

  for (const item of PIZZA_PRODUCTS_TO_ADD) {
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
      const updatedCatIds = Array.from(new Set([...currentCatIds, RESTAURANT_PARENT_ID, PIZZA_BOXES_ID]));

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
          console.log(`✅ Assigned existing product ID ${existing.id} ("${item.name}") to Pizza Boxes!`);
        } else {
          console.error(`❌ Failed to update categories for ID ${existing.id}:`, res);
        }
      } else {
        console.log(`ℹ️ Product ID ${existing.id} ("${item.name}") is already assigned to Pizza Boxes.`);
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
        categories: [{ id: RESTAURANT_PARENT_ID }, { id: PIZZA_BOXES_ID }],
        images: [
          {
            src: item.image,
          },
        ],
      };

      const res = await request("/products", "POST", createPayload);
      if (res && res.id) {
        console.log(`✨ Successfully CREATED product ID ${res.id} (SKU: ${targetSku}, Name: "${item.name}") in Pizza Boxes!`);
      } else {
        console.error(`❌ Failed to create product ${targetSku}:`, res);
      }
    }
  }

  console.log("\nFinished adding all 3 products to Custom Restaurant Packaging -> Pizza Boxes!");
}

run().catch(console.error);
