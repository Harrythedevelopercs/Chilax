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

  console.log("Total existing categories fetched:", categories.length);

  // Check if Custom Restaurant Packaging parent category exists
  let parentCat = categories.find(
    (c) =>
      c.name.toLowerCase() === "custom restaurant packaging & boxes" ||
      c.name.toLowerCase() === "custom restaurant packaging" ||
      c.name.toLowerCase() === "restaurant packaging" ||
      c.slug === "custom-restaurant-packaging" ||
      c.slug === "restaurant-packaging"
  );

  if (!parentCat) {
    console.log("Creating Parent Category: 'Custom Restaurant Packaging & Boxes'...");
    parentCat = await request("POST", "/products/categories", {
      name: "Custom Restaurant Packaging & Boxes",
      slug: "custom-restaurant-packaging",
      description: "Food-safe, eco-friendly custom takeout boxes, pizza boxes, food trays, disposable containers, beverage carriers, and restaurant packaging solutions.",
    });
    console.log("Created Parent Category:", parentCat.id, parentCat.name, parentCat.slug);
  } else {
    console.log("Found Existing Parent Category:", parentCat.id, parentCat.name, parentCat.slug);
  }

  // 16 subcategories requested by user
  const subCategoriesConfig = [
    { name: "Pizza Boxes", description: "Perfect box for pizza and flat bread foods." },
    { name: "One Piece Take Out Boxes", description: "Versatile container for entrees, sides and desserts." },
    { name: "Two Piece Take Out Boxes", description: "Tray and lid boxes for sushi bentos and other entrees." },
    { name: "Biodegradable Containers", description: "Made from renewable cornstarch and sugarcane." },
    { name: "Chinese Take Out Boxes", description: "Classic chinese boxes to hold noodles and rice." },
    { name: "Clamshell Boxes", description: "Hinged containers to easily serve sandwiches." },
    { name: "Catering Transport Trays", description: "Convenient transport trays for large food orders." },
    { name: "Carrier Boxes", description: "Easy to carry boxes for baked goods and cakes." },
    { name: "Food Trays", description: "Easily serve finger foods and freshly made foods." },
    { name: "Beverage Carriers", description: "Sturdy, multi-compartment beverage carriers." },
    { name: "Paper Cups & Bowls", description: "Round containers to carry liquids and soups." },
    { name: "Paper Bags", description: "Various paper bags to hold food and take out boxes." },
    { name: "Paper Sleeves", description: "Heat resistant cup sleeves and securing box sleeves." },
    { name: "Labels & Stickers", description: "Personalize your boxes with branded stickers." },
    { name: "Food Wrap & Liners", description: "Complete brand experience with printed wraps and liners." },
    { name: "Straws & Utensils", description: "Custom branded utensils, straws and stirers." },
  ];

  const createdSubCats = [];

  for (const item of subCategoriesConfig) {
    const name = item.name;
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
        description: item.description,
      });
      console.log(`Created Subcategory '${name}':`, created.id, created.name, created.slug);
      createdSubCats.push(created);
    }
  }

  console.log("\n--- SUMMARY OF RESTAURANT PACKAGING CATEGORIES ---");
  console.log("Parent:", { id: parentCat.id, name: parentCat.name, slug: parentCat.slug });
  console.log("Subcategories Count:", createdSubCats.length);
  console.log("Subcategories:", createdSubCats.map(c => ({ id: c.id, name: c.name, slug: c.slug, parent: c.parent })));
}

run().catch(console.error);
