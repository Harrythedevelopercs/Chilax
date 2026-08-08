const https = require("https");

const WC_URL = "https://purple-manatee-256891.hostingersite.com";
const CK = "ck_862f4228314615430415451f1d591c887ca2b4ff";
const CS = "cs_59d29edc3695f437573e0711134b79275e7e7af2";

function request(urlPath, method = "GET", postData = null) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${CK}:${CS}`).toString("base64");
    const fullUrl = new URL(`${WC_URL}/wp-json/wc/v3${urlPath}`);

    const options = {
      hostname: fullUrl.hostname,
      path: fullUrl.pathname + fullUrl.search,
      method: method,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
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
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

const CATEGORY_MAP = {
  "Luxury boxes": 647,
  "Shipping mailer boxes": 648,
  "Box inserts": 649,
  "Labels": 650,
  "Product boxes": 646,
  "Best sellers": 645,
  PARENT: 644,
};

const ITEMS_TO_PROCESS = [
  // Luxury boxes
  { subcat: "Luxury boxes", subcatId: 647, sku: "RP004", name: "Lift-off / Detachable Lid" },
  { subcat: "Luxury boxes", subcatId: 647, sku: "RP001", name: "Magnetic Closure Boxes" },
  { subcat: "Luxury boxes", subcatId: 647, sku: "RP005", name: "Partial Cover" },

  // Shipping mailer boxes
  { subcat: "Shipping mailer boxes", subcatId: 648, sku: "C019", name: "1-2-3 Bottom Slotted Container" },
  { subcat: "Shipping mailer boxes", subcatId: 648, sku: "ME004", name: "Poly Mailers" },
  { subcat: "Shipping mailer boxes", subcatId: 648, sku: "ME012", name: "Soft Shell Poly Bubble Mailers" },
  { subcat: "Shipping mailer boxes", subcatId: 648, sku: "C001", name: "Tab Lock Roll End Corrugated Box" },
  { subcat: "Shipping mailer boxes", subcatId: 648, sku: "C003", name: "Roll End Tuck Front Corrugated Box" },
  { subcat: "Shipping mailer boxes", subcatId: 648, sku: "C018", name: "Corrugated Slotted Container" },
  { subcat: "Shipping mailer boxes", subcatId: 648, sku: "ME001", name: "Kraft Mailers" },
  { subcat: "Shipping mailer boxes", subcatId: 648, sku: "ME010", name: "Poly Bubble Mailers" },
  { subcat: "Shipping mailer boxes", subcatId: 648, sku: "ME013", name: "Hard Shell Poly Bubble Mailers" },
  { subcat: "Shipping mailer boxes", subcatId: 648, sku: "C002", name: "Roll End Tuck Top Corrugated Box" },
  { subcat: "Shipping mailer boxes", subcatId: 648, sku: "C004", name: "Roll End 3 Flap Lock Corrugated Box" },

  // Box inserts
  { subcat: "Box inserts", subcatId: 649, sku: "CI025", name: "Colored Wet Press Molded Pulp Insert" },
  { subcat: "Box inserts", subcatId: 649, sku: "CI018", name: "Ethylene-Vinyl Acetate Foam with Flocking (EVA)" },
  { subcat: "Box inserts", subcatId: 649, sku: "CI008", name: "PETG Blister Insert" },
  { subcat: "Box inserts", subcatId: 649, sku: "CI014", name: "Natural Kraft Corrugated Insert" },
  { subcat: "Box inserts", subcatId: 649, sku: "CI017", name: "Rigid Chipboard Divider Insert" },
  { subcat: "Box inserts", subcatId: 649, sku: "CI020", name: "Folding Carton Box Divider Inserts" },
  { subcat: "Box inserts", subcatId: 649, sku: "CI024", name: "White Dry Press Molded Pulp Insert" },
  { subcat: "Box inserts", subcatId: 649, sku: "CI026", name: "PP Blister Insert" },
  { subcat: "Box inserts", subcatId: 649, sku: "CI003", name: "Ethylene-Vinyl Acetate (EVA) Foam Insert" },
  { subcat: "Box inserts", subcatId: 649, sku: "CI006", name: "HIPS Blister Insert" },
  { subcat: "Box inserts", subcatId: 649, sku: "CI012", name: "Processed Molded Pulp" },
  { subcat: "Box inserts", subcatId: 649, sku: "CI016", name: "Natural Kraft Paperboard Insert" },
  { subcat: "Box inserts", subcatId: 649, sku: "CI019", name: "PET Blister Insert" },
  { subcat: "Box inserts", subcatId: 649, sku: "CI023", name: "Natural Dry Press Molded Pulp Insert" },

  // Labels
  { subcat: "Labels", subcatId: 650, sku: "LB009", name: "Custom Packaging Labels" },
  { subcat: "Labels", subcatId: 650, sku: "LB012", name: "Custom Shape Sheet Labels" },
  { subcat: "Labels", subcatId: 650, sku: "LB021", name: "Custom Labels" },
  { subcat: "Labels", subcatId: 650, sku: "LB011", name: "Custom Rectangle Sheet Labels" },
  { subcat: "Labels", subcatId: 650, sku: "LB020", name: "Custom Stickers" },
];

// Fallback PakFactory image URLs by category / style
const PAKFACTORY_DEFAULT_IMAGES = {
  647: [
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc3019_2.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc3005_2.jpg",
  ],
  648: [
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/c/0/c001_tab_lock_roll_end_corrugated_box_02.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/c/0/c001_tab_lock_roll_end_corrugated_box_01.jpg",
  ],
  649: [
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/r/i/rise-up-insert_1.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f001-d.jpg",
  ],
  650: [
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f002-d.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f005-d.jpg",
  ],
};

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

  for (const item of ITEMS_TO_PROCESS) {
    const targetSku = item.sku;
    const targetName = item.name.toLowerCase();
    const targetSubcatId = item.subcatId;

    // Check if product exists by SKU or Name match
    const existing = allWCProducts.find(
      (p) =>
        p.sku === targetSku ||
        p.name.toLowerCase() === targetName ||
        p.name.replace(/&amp;/g, "&").toLowerCase() === targetName
    );

    if (existing) {
      console.log(`Found existing product ID ${existing.id} ("${existing.name}", SKU: "${existing.sku}")`);

      // Ensure categories include parent (644) and subcategory (targetSubcatId)
      const currentCatIds = existing.categories ? existing.categories.map((c) => c.id) : [];
      const updatedCatIds = Array.from(new Set([...currentCatIds, 644, targetSubcatId]));

      const needCatUpdate = updatedCatIds.length !== currentCatIds.length;
      const needSkuUpdate = !existing.sku || existing.sku !== targetSku;

      if (needCatUpdate || needSkuUpdate) {
        console.log(`Updating product ID ${existing.id} categories/SKU (Categories: ${updatedCatIds.join(",")})...`);
        const updatePayload = {
          categories: updatedCatIds.map((id) => ({ id })),
        };
        if (needSkuUpdate) updatePayload.sku = targetSku;

        const res = await request(`/products/${existing.id}`, "PUT", updatePayload);
        if (res && res.id) {
          console.log(`✅ Assigned existing product ID ${existing.id} to subcategory ${item.subcat} (ID: ${targetSubcatId})!`);
        } else {
          console.error(`❌ Failed to update categories for ID ${existing.id}:`, res);
        }
      } else {
        console.log(`ℹ️ Product ID ${existing.id} already assigned to category ${targetSubcatId}. No changes made.`);
      }
    } else {
      console.log(`Product SKU "${targetSku}" ("${item.name}") NOT found in WooCommerce. Creating new product...`);

      const images = (PAKFACTORY_DEFAULT_IMAGES[targetSubcatId] || PAKFACTORY_DEFAULT_IMAGES[647]).map((src) => ({ src }));

      const createPayload = {
        name: item.name,
        sku: targetSku,
        type: "simple",
        regular_price: "0",
        description: `Custom manufactured ${item.name} tailored for luxury cosmetics and retail packaging.`,
        short_description: `Custom ${item.name} for beauty and retail packaging.`,
        categories: [{ id: 644 }, { id: targetSubcatId }],
        images: images,
      };

      const res = await request("/products", "POST", createPayload);
      if (res && res.id) {
        console.log(`✨ Successfully CREATED new product ID ${res.id} (SKU: ${targetSku}, Name: "${item.name}") in category ${item.subcat}!`);
      } else {
        console.error(`❌ Failed to create product ${targetSku}:`, res);
      }
    }
  }

  console.log("Finished processing all requested products and categories!");
}

run();
