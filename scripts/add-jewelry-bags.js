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

const JEWELRY_PARENT_ID = 665;
const JEWELRY_BAGS_ID = 669;

const JEWELRY_BAGS_PRODUCTS_TO_ADD = [
  {
    name: "Paper Merchandise Bags",
    sku: "B024",
    url: "https://pakfactory.com/custom-paper-merchandise-bags.html",
    description: "Elegant Custom Paper Merchandise Bags tailored for boutique retail, jewelry packaging, and luxury favors.",
    short_description: "Custom Paper Merchandise Bags for jewelry retail.",
  },
  {
    name: "SOS Bags",
    sku: "B001",
    url: "https://pakfactory.com/sos-bags.html",
    description: "Self-Opening Square (SOS) paper bags with flat reinforced bottoms designed for jewelry retail packaging and accessories.",
    short_description: "SOS Paper Bags for jewelry accessories.",
  },
  {
    name: "Gift Bags",
    sku: "B003",
    url: "https://pakfactory.com/gift-bags.html",
    description: "Bespoke Gift Bags with soft ribbon handles crafted for fine jewelry gifts, watches, and luxury presentations.",
    short_description: "Luxury Gift Bags for jewelry presentation.",
  },
  {
    name: "Paper Carrier Bags",
    sku: "B023",
    url: "https://pakfactory.com/custom-paper-carrier-bags.html",
    description: "Sturdy Custom Paper Carrier Bags designed for luxury jewelry boutiques and high-end retail packaging.",
    short_description: "Custom Paper Carrier Bags for luxury boutiques.",
  },
  {
    name: "Euro Tote Bags",
    sku: "B002",
    url: "https://pakfactory.com/euro-tote-bags.html",
    description: "High-end Euro Tote Bags featuring matte or gloss lamination and soft cord handles for designer jewelry collections.",
    short_description: "High-end Euro Tote Bags for designer jewelry.",
  },
  {
    name: "White Paper Bags",
    sku: "B021",
    url: "https://pakfactory.com/custom-white-paper-bags.html",
    description: "Crisp Custom White Paper Bags with foil stamping options designed for luxury jewelry branding.",
    short_description: "Crisp White Paper Bags for jewelry branding.",
  },
];

async function run() {
  console.log("Fetching existing products from WooCommerce...");
  let page = 1;
  let allWCProducts = [];
  while (page <= 10) {
    const prods = await request(`/products?per_page=100&page=${page}`);
    if (!Array.isArray(prods) || prods.length === 0) break;
    allWCProducts = allWCProducts.concat(prods);
    page++;
  }

  console.log(`Loaded ${allWCProducts.length} total products from WooCommerce.`);

  for (const item of JEWELRY_BAGS_PRODUCTS_TO_ADD) {
    const targetSku = item.sku;
    const targetName = item.name.toLowerCase();

    // Check if product exists by SKU or Name match
    const existing = allWCProducts.find(
      (p) =>
        p.sku === targetSku ||
        p.name.toLowerCase() === targetName ||
        p.name.replace(/&amp;/g, "&").toLowerCase() === targetName
    );

    if (existing) {
      console.log(`Found existing product ID ${existing.id} ("${existing.name}", SKU: "${existing.sku}")`);

      const currentCatIds = existing.categories ? existing.categories.map((c) => c.id) : [];
      const updatedCatIds = Array.from(new Set([...currentCatIds, JEWELRY_PARENT_ID, JEWELRY_BAGS_ID]));

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
          console.log(`✅ Assigned existing product ID ${existing.id} ("${item.name}") to Jewelry Bags!`);
        } else {
          console.error(`❌ Failed to update categories for ID ${existing.id}:`, res);
        }
      } else {
        console.log(`ℹ️ Product ID ${existing.id} ("${item.name}") is already assigned to Jewelry Bags.`);
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
        categories: [{ id: JEWELRY_PARENT_ID }, { id: JEWELRY_BAGS_ID }],
        images: [
          {
            src: "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/b/0/b002_euro_tote_bags_01.jpg",
          },
        ],
      };

      const res = await request("/products", "POST", createPayload);
      if (res && res.id) {
        console.log(`✨ Successfully CREATED product ID ${res.id} (SKU: ${targetSku}, Name: "${item.name}") in Jewelry Bags!`);
      } else {
        console.error(`❌ Failed to create product ${targetSku}:`, res);
      }
    }
  }

  console.log("\nFinished adding all 6 Jewelry Bags products!");
}

run().catch(console.error);
