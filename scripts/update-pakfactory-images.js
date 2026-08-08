const https = require("https");

const WC_URL = "https://purple-manatee-256891.hostingersite.com";
const CK = "ck_862f4228314615430415451f1d591c887ca2b4ff";
const CS = "cs_59d29edc3695f437573e0711134b79275e7e7af2";

const pakFactoryProductMap = {
  F001: [
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f001-1.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc3047.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f001-d.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/r/i/rise-up-insert_1.jpg",
  ],
  F002: [
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc9258.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc9192.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f002-d.jpg",
  ],
  F005: [
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc8956_1_1.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc8949.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc9344.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f005-d.jpg",
  ],
  C001: [
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/c/0/c001_tab_lock_roll_end_corrugated_box_02.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/c/0/c001_tab_lock_roll_end_corrugated_box_01.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/c/0/c001_tab_lock_roll_end_corrugated_box_03.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/c/0/c001_tab_lock_roll_end_corrugated_box_04.jpg",
  ],
  C004: [
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/c/0/c004_roll_end_3_flap_lock_corrugated_box_01.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/c/0/c004_roll_end_3_flap_lock_corrugated_box_02.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/c/0/c004_roll_end_3_flap_lock_corrugated_box_03.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/c/0/c004_roll_end_3_flap_lock_corrugated_box_04.jpg",
  ],
  F059: [
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc7716.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc7718.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f059-d.jpg",
  ],
  F077: [
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc3019_2.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc3005_2.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc3026_2.jpg",
  ],
  F008: [
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc2573.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc2568.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc2570.jpg",
  ],
  F046: [
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f046-1.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc2704_1.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc2708_1.jpg",
  ],
  F004: [
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc4250.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc4236.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f004-d.jpg",
  ],
  F035: [
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc4250.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc4236.jpg",
  ],
  F075: [
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc3019_2.jpg",
    "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/_/d/_dsc3005_2.jpg",
  ],
};

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

async function run() {
  // Fetch products under Custom Cosmetic Packaging (644) and subcategories
  const products644 = await request("/products?category=644&per_page=100");
  const products646 = await request("/products?category=646&per_page=100");
  const products645 = await request("/products?category=645&per_page=100");

  const allProducts = [...products644, ...products646, ...products645];
  const uniqueProducts = Array.from(new Map(allProducts.map((item) => [item.id, item])).values());

  console.log(`Found ${uniqueProducts.length} unique products in Cosmetic Categories.`);
  uniqueProducts.forEach((p) => console.log(`ID: ${p.id} | SKU: "${p.sku}" | Name: "${p.name}"`));

  // Product title matcher mapping
  const titleMatcherMap = {
    F001: "Reverse Tuck End",
    F002: "Straight Tuck End",
    F005: "Tuck End Auto Bottom",
    F004: "Tuck End Snap Lock Bottom",
    F035: "Tab Lock Tuck Top",
    F059: "Sleeve",
    F077: "Double Wall Tray & Sleeve",
    F008: "Pillow",
    F046: "5 Panel Hanger Tuck End",
    F075: "Double Wall Frame Tray & Sleeve",
    C001: "Tab Lock Roll End Corrugated Box",
    C004: "Roll End 3 Flap Lock Corrugated Box",
  };

  for (const [code, imageUrls] of Object.entries(pakFactoryProductMap)) {
    const targetTitle = titleMatcherMap[code];
    const product = uniqueProducts.find(
      (p) =>
        p.sku === code ||
        p.name.toLowerCase() === targetTitle.toLowerCase() ||
        p.name.replace(/&amp;/g, "&").toLowerCase() === targetTitle.toLowerCase()
    );

    if (product) {
      console.log(`Matching code ${code} -> Found product ID ${product.id} ("${product.name}"). Updating SKU to "${code}" & PakFactory images...`);

      const imagesPayload = imageUrls.map((src) => ({ src }));
      const res = await request(`/products/${product.id}`, "PUT", {
        sku: code,
        images: imagesPayload,
      });

      if (res && res.id) {
        console.log(`✅ Successfully updated product ID ${product.id} (${code}) with ${imageUrls.length} PakFactory images!`);
      } else {
        console.error(`❌ Error updating ID ${product.id}:`, res);
      }
    } else {
      console.log(`⚠️ Could not match code ${code} / title "${targetTitle}"`);
    }
  }
}

run();
