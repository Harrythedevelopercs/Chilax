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

  console.log("Existing categories count:", categories.length);

  // Check if Bakery & Cake parent category exists
  let parentCat = categories.find(
    (c) =>
      c.name.toLowerCase() === "bakery & cake" ||
      c.name.toLowerCase() === "bakery packaging" ||
      c.slug === "bakery-cake" ||
      c.slug === "bakery-packaging"
  );

  if (!parentCat) {
    console.log("Creating Parent Category: 'Bakery & Cake'...");
    parentCat = await request("POST", "/products/categories", {
      name: "Bakery & Cake",
      slug: "bakery-cake",
      description: "Custom bakery, cake, pastry, and dessert packaging boxes, bags, and labels.",
    });
    console.log("Created Parent Category:", parentCat.id, parentCat.name, parentCat.slug);
  } else {
    console.log("Found Existing Parent Category:", parentCat.id, parentCat.name, parentCat.slug);
  }

  // Desired subcategories under Bakery & Cake
  const subCatNames = [
    "Best sellers",
    "Product boxes",
    "Bags",
    "Labels",
  ];

  // Check existing children of parentCat
  const existingSubCats = categories.filter((c) => c.parent === parentCat.id);
  console.log(`Existing subcategories under parent (ID: ${parentCat.id}):`, existingSubCats.map(s => s.name));

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
        description: `Custom ${name} for bakery & cake packaging.`,
      });
      console.log(`Created Subcategory '${name}':`, created.id, created.name, created.slug);
      createdSubCats.push(created);
    }
  }

  console.log("\n--- SUMMARY OF BAKERY & CAKE CATEGORIES ---");
  console.log("Parent:", { id: parentCat.id, name: parentCat.name, slug: parentCat.slug });
  console.log("Subcategories:", createdSubCats.map(c => ({ id: c.id, name: c.name, slug: c.slug, parent: c.parent })));
}

run().catch(console.error);
