const https = require("https");

const WC_URL = "https://purple-manatee-256891.hostingersite.com";
const CK = "ck_862f4228314615430415451f1d591c887ca2b4ff";
const CS = "cs_59d29edc3695f437573e0711134b79275e7e7af2";

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${CK}:${CS}`).toString("base64");
    const fullUrl = new URL(`${WC_URL}/wp-json/wc/v3${path}`);

    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: fullUrl.hostname,
      path: fullUrl.pathname + fullUrl.search,
      method,
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
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on("error", (e) => reject(e));
    if (payload) req.write(payload);
    req.end();
  });
}

async function run() {
  console.log("Fetching existing WooCommerce categories...");
  const categories = await request("GET", "/products/categories?per_page=100");

  // Check if Custom Jewelry & Accessories Packaging parent category exists
  let parentCat = categories.find(
    (c) =>
      c.name.toLowerCase() === "custom jewelry & accessories packaging" ||
      c.name.toLowerCase() === "custom jewelry packaging" ||
      c.slug === "custom-jewelry-accessories-packaging" ||
      c.slug === "custom-jewelry-packaging"
  );

  if (!parentCat) {
    console.log("Creating Parent Category: 'Custom Jewelry & Accessories Packaging'...");
    parentCat = await request("POST", "/products/categories", {
      name: "Custom Jewelry & Accessories Packaging",
      slug: "custom-jewelry-accessories-packaging",
      description: "Custom luxury rigid jewelry boxes, velvet pouches, custom shipping packaging, box inserts, and labels for fine jewelry and luxury accessory brands.",
    });
    console.log("Created Parent Category:", parentCat.id, parentCat.name, parentCat.slug);
  } else {
    console.log("Found Existing Parent Category:", parentCat.id, parentCat.name, parentCat.slug);
  }

  // Subcategories requested by user:
  // Best sellers, Luxury boxes, Shipping packaging, Bags, Box inserts, Labels
  const subCatNames = [
    "Best sellers",
    "Luxury boxes",
    "Shipping packaging",
    "Bags",
    "Box inserts",
    "Labels",
  ];

  const createdSubCats = [];

  for (const name of subCatNames) {
    const found = categories.find(
      (c) => c.parent === parentCat.id && c.name.toLowerCase() === name.toLowerCase()
    );

    if (found) {
      console.log(`Subcategory '${name}' already exists with ID:`, found.id);
      createdSubCats.push(found);
    } else {
      console.log(`Creating Subcategory: '${name}' under parent ${parentCat.id}...`);
      const created = await request("POST", "/products/categories", {
        name: name,
        parent: parentCat.id,
        description: `Custom ${name} for jewelry and accessories packaging.`,
      });
      console.log(`Created Subcategory '${name}':`, created.id, created.name, created.slug);
      createdSubCats.push(created);
    }
  }

  console.log("\n--- SUMMARY OF JEWELRY CATEGORIES ---");
  console.log("Parent:", { id: parentCat.id, name: parentCat.name, slug: parentCat.slug });
  console.log("Subcategories:", createdSubCats.map(c => ({ id: c.id, name: c.name, slug: c.slug, parent: c.parent })));
}

run().catch(console.error);
