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
      (c.id === 674 || c.name.toLowerCase() === "one piece take out boxes" || c.slug === "one-piece-take-out-boxes")
  );

  if (!subCat) {
    console.log("One Piece Take Out Boxes subcategory not found under Restaurant! Creating...");
    subCat = await request("/products/categories", "POST", {
      name: "One Piece Take Out Boxes",
      parent: parentCat.id,
      slug: "one-piece-take-out-boxes",
      description: "Versatile container for entrees, sides, donuts, salads, and desserts.",
    });
    console.log(`Created Subcategory: ID ${subCat.id} ("${subCat.name}")`);
  } else {
    console.log(`Found Subcategory: ID ${subCat.id} ("${subCat.name}")`);
  }

  const RESTAURANT_PARENT_ID = parentCat.id;
  const ONE_PIECE_TAKEOUT_ID = subCat.id;

  const DEFAULT_IMAGE = "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f005-d.jpg";

  const PRODUCTS_TO_ADD = [
    {
      name: "Custom Printed Single Sandwich To Go Box with Window",
      sku: "FBE346",
      url: "https://pakfactory.com/custom-printed-single-sandwich-to-go-box-with-window.html",
      description: "Custom printed single sandwich to-go boxes with clear window for deli sandwich display.",
      short_description: "Custom single sandwich to-go box with window.",
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
      name: "Custom Take Out Boxes with Vents",
      sku: "FBE332",
      url: "https://pakfactory.com/custom-takeout-boxes-with-vents.html",
      description: "Vented takeout boxes engineered to prevent steam buildup and keep fried foods crisp.",
      short_description: "Custom takeout boxes with steam vents.",
    },
    {
      name: "Custom Paper 6-Corner Boxes without Vents",
      sku: "FBE331",
      url: "https://pakfactory.com/custom-paper-6corner-boxes-without-vents.html",
      description: "Pop-up 6-corner paper food boxes ideal for hot food heat retention without vents.",
      short_description: "Custom paper 6-corner food boxes.",
    },
    {
      name: "Custom Tamper Proof 6-Corner Take Out Box",
      sku: "FBE328",
      url: "https://pakfactory.com/custom-tamper-proof-6-corner-take-out-box.html",
      description: "Tamper-evident 6-corner takeout box providing secure delivery locking tabs.",
      short_description: "Tamper-evident 6-corner takeout box.",
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
      name: "Custom Roll End Tuck Top with Tab Take Out Boxes",
      sku: "FBE305",
      url: "https://pakfactory.com/custom-roll-end-tuck-top-with-tab-take-out-boxes.html",
      description: "Roll end tuck top boxes with secure locking tab for bakery and deli items.",
      short_description: "Roll end tuck top takeout box.",
    },
    {
      name: "Sandwich Takeout Lock Box",
      sku: "FBE297",
      url: "https://pakfactory.com/sandwich-takeout-lock-box.html",
      description: "Compact sandwich lock box designed for cafes, delis, and grab-and-go food counters.",
      short_description: "Sandwich takeout lock box.",
    },
    {
      name: "Fish & Chips Packaging Boxes",
      sku: "FBE289",
      url: "https://pakfactory.com/fish-chips-packaging-boxes.html",
      description: "Grease-resistant sturdy paperboard boxes specially crafted for fish and chips takeaways.",
      short_description: "Fish & chips takeout boxes.",
    },
    {
      name: "Noodle Takeout Box",
      sku: "FBE285",
      url: "https://pakfactory.com/noodle-takeout-box.html",
      description: "Leakproof one-piece noodle box crafted for Asian cuisine, rice dishes, and stir-fries.",
      short_description: "Leakproof noodle takeout box.",
    },
    {
      name: "Salad Take Out Box",
      sku: "FBE100",
      url: "https://pakfactory.com/salad-takeout-box.html",
      description: "Food-safe poly-coated paperboard salad takeout boxes with oil and moisture resistance.",
      short_description: "Salad takeout paperboard box.",
    },
    {
      name: "Custom Macaron Boxes",
      sku: "FBE068",
      url: "https://pakfactory.com/custom-macaron-boxes.html",
      description: "Elegant custom printed macaron boxes with protective insert slots and clear presentation windows.",
      short_description: "Custom macaron gift packaging boxes.",
    },
    {
      name: "Custom Donut Boxes",
      sku: "FBE066",
      url: "https://pakfactory.com/custom-printed-donut-boxes.html",
      description: "Spacious custom printed donut boxes for bakery display, half-dozen, and dozen donuts.",
      short_description: "Custom printed bakery donut boxes.",
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
      const updatedCatIds = Array.from(new Set([...currentCatIds, RESTAURANT_PARENT_ID, ONE_PIECE_TAKEOUT_ID]));

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
          console.log(`✅ Assigned existing product ID ${existing.id} ("${item.name}") to One Piece Take Out Boxes!`);
        } else {
          console.error(`❌ Failed to update categories for ID ${existing.id}:`, res);
        }
      } else {
        console.log(`ℹ️ Product ID ${existing.id} ("${item.name}") is already assigned to One Piece Take Out Boxes.`);
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
        categories: [{ id: RESTAURANT_PARENT_ID }, { id: ONE_PIECE_TAKEOUT_ID }],
        images: [
          {
            src: DEFAULT_IMAGE,
          },
        ],
      };

      const res = await request("/products", "POST", createPayload);
      if (res && res.id) {
        console.log(`✨ Successfully CREATED product ID ${res.id} (SKU: ${targetSku}, Name: "${item.name}") in One Piece Take Out Boxes!`);
      } else {
        console.error(`❌ Failed to create product ${targetSku}:`, res);
      }
    }
  }

  console.log("\nFinished adding all 15 products to Custom Restaurant Packaging -> One Piece Take Out Boxes!");
}

run().catch(console.error);
