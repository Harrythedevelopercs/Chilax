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
const JEWELRY_SHIPPING_PACKAGING_ID = 668;

const JEWELRY_SHIPPING_PRODUCTS_TO_ADD = [
  {
    name: "Roll End Tuck Top Corrugated Box",
    sku: "C002",
    url: "https://pakfactory.com/roll-end-tuck-top-corrugated-box.html",
    description: "Roll End Tuck Top Corrugated Box engineered with protective dust flaps for safe jewelry and accessory shipping.",
    short_description: "Roll End Tuck Top corrugated jewelry shipping box.",
  },
  {
    name: "Roll End 3 Flap Lock Corrugated Box",
    sku: "C004",
    url: "https://pakfactory.com/roll-end-3-flaps-tuck.html",
    description: "Extra secure Roll End 3 Flap Lock Corrugated Box designed for high-protection e-commerce jewelry delivery.",
    short_description: "Roll End 3 Flap Lock corrugated box for jewelry.",
  },
  {
    name: "1-2-3 Bottom Slotted Container",
    sku: "C019",
    url: "https://pakfactory.com/1-2-3-bottom-slotted-container.html",
    description: "Heavy-duty 1-2-3 Bottom Slotted Container engineered for secure bulk jewelry shipping and wholesale storage.",
    short_description: "1-2-3 Bottom Slotted Container for bulk jewelry shipping.",
  },
  {
    name: "Poly Mailers",
    sku: "ME004",
    url: "https://pakfactory.com/custom-poly-mailer.html",
    description: "Waterproof and tear-resistant Poly Mailers for shipping non-fragile jewelry pouches and apparel accessories.",
    short_description: "Waterproof Poly Mailers for jewelry pouches.",
  },
  {
    name: "Soft Shell Poly Bubble Mailers",
    sku: "ME012",
    url: "https://pakfactory.com/soft-shell-poly-bubble-mailers.html",
    description: "Cushioned Soft Shell Poly Bubble Mailers for protected e-commerce shipping of small jewelry gift boxes.",
    short_description: "Soft Shell Poly Bubble Mailers for jewelry.",
  },
  {
    name: "Tab Lock Roll End Corrugated Box",
    sku: "C001",
    url: "https://pakfactory.com/tab-lock-roll-end-corrugated-box.html",
    description: "Heavy-duty Tab Lock Roll End Corrugated Box built for secure e-commerce shipping of luxury jewelry sets.",
    short_description: "Tab Lock Roll End Corrugated shipping box.",
  },
  {
    name: "Roll End Tuck Front Corrugated Box",
    sku: "C003",
    url: "https://pakfactory.com/roll-end-tuck-front.html",
    description: "Secure Roll End Tuck Front Corrugated Box ideal for premium subscription jewelry boxes and luxury unboxing.",
    short_description: "Roll End Tuck Front corrugated mailer box.",
  },
  {
    name: "Corrugated Slotted Container",
    sku: "C018",
    url: "https://pakfactory.com/corrugated-slotted-container.html",
    description: "Durable Corrugated Slotted Container for bulk jewelry shipping and protective master carton packaging.",
    short_description: "Corrugated Slotted Container for master shipping.",
  },
  {
    name: "Kraft Mailers",
    sku: "ME001",
    url: "https://pakfactory.com/custom-kraft-mailer.html",
    description: "Eco-friendly natural brown Kraft Mailers crafted for sustainable jewelry e-commerce shipping.",
    short_description: "Eco-friendly Kraft Mailers for jewelry.",
  },
  {
    name: "Poly Bubble Mailers",
    sku: "ME010",
    url: "https://pakfactory.com/custom-poly-bubble-mailer.html",
    description: "Protective Poly Bubble Mailers with bubble wrap interior for shipping jewelry boxes, cards, and pouches.",
    short_description: "Protective Poly Bubble Mailers.",
  },
  {
    name: "Hard Shell Poly Bubble Mailers",
    sku: "ME013",
    url: "https://pakfactory.com/hard-shell-poly-bubble-mailers.html",
    description: "Extra durable Hard Shell Poly Bubble Mailers designed for maximum puncture resistance in shipping luxury accessories.",
    short_description: "Hard Shell Poly Bubble Mailers for accessories.",
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

  for (const item of JEWELRY_SHIPPING_PRODUCTS_TO_ADD) {
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
      const updatedCatIds = Array.from(new Set([...currentCatIds, JEWELRY_PARENT_ID, JEWELRY_SHIPPING_PACKAGING_ID]));

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
          console.log(`✅ Assigned existing product ID ${existing.id} ("${item.name}") to Jewelry Shipping Packaging!`);
        } else {
          console.error(`❌ Failed to update categories for ID ${existing.id}:`, res);
        }
      } else {
        console.log(`ℹ️ Product ID ${existing.id} ("${item.name}") is already assigned to Jewelry Shipping Packaging.`);
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
        categories: [{ id: JEWELRY_PARENT_ID }, { id: JEWELRY_SHIPPING_PACKAGING_ID }],
        images: [
          {
            src: "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f002-d.jpg",
          },
        ],
      };

      const res = await request("/products", "POST", createPayload);
      if (res && res.id) {
        console.log(`✨ Successfully CREATED product ID ${res.id} (SKU: ${targetSku}, Name: "${item.name}") in Jewelry Shipping Packaging!`);
      } else {
        console.error(`❌ Failed to create product ${targetSku}:`, res);
      }
    }
  }

  console.log("\nFinished adding all 11 Jewelry Shipping Packaging products!");
}

run().catch(console.error);
