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
const JEWELRY_BOX_INSERTS_ID = 670;

const JEWELRY_BOX_INSERTS_PRODUCTS_TO_ADD = [
  {
    name: "Rigid Chipboard Divider Insert",
    sku: "CI017",
    url: "https://pakfactory.com/rigid-chipboard-insert.html",
    description: "Sturdy Rigid Chipboard Divider Insert designed for multi-piece jewelry gift sets and watch boxes.",
    short_description: "Rigid Chipboard Divider Insert for jewelry.",
  },
  {
    name: "Ethylene-Vinyl Acetate (EVA) Foam Insert",
    sku: "CI003",
    url: "https://pakfactory.com/ethylene-vinyl-acetate-eva-foam-insert.html",
    description: "High-density precision cut EVA foam insert designed to cushion and protect fine jewelry, rings, and necklaces.",
    short_description: "High-density EVA Foam Insert for jewelry.",
  },
  {
    name: "Processed Molded Pulp",
    sku: "CI012",
    url: "https://pakfactory.com/processed-molded-pulp.html",
    description: "100% Recyclable Processed Molded Pulp insert for sustainable luxury jewelry and watch packaging.",
    short_description: "Processed Molded Pulp insert for jewelry.",
  },
  {
    name: "Wet Press Molded Pulp Inserts",
    sku: "CI022",
    url: "https://pakfactory.com/wet-press-molded-pulp-inserts.html",
    description: "Smooth-finish Wet Press Molded Pulp Inserts providing sleek eco-friendly protection for jewelry gift boxes.",
    short_description: "Wet Press Molded Pulp Inserts for jewelry.",
  },
  {
    name: "Polyurethane (PU) Foam Insert",
    sku: "CI001",
    url: "https://pakfactory.com/polyurethane-pu-foam-insert.html",
    description: "Soft Polyurethane (PU) Foam Insert providing anti-tarnish protective cushioning for delicate rings and earrings.",
    short_description: "Soft PU Foam Insert for delicate jewelry.",
  },
  {
    name: "Ethylene-Vinyl Acetate Foam with Flocking (EVA)",
    sku: "CI018",
    url: "https://pakfactory.com/ethylene-vinyl-acetate-foam-flocking.html",
    description: "Luxury velvet-flocked EVA foam insert for high-end jewelry boxes, ring trays, and necklace presentation.",
    short_description: "Velvet flocked EVA foam insert for luxury jewelry.",
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

  for (const item of JEWELRY_BOX_INSERTS_PRODUCTS_TO_ADD) {
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
      const updatedCatIds = Array.from(new Set([...currentCatIds, JEWELRY_PARENT_ID, JEWELRY_BOX_INSERTS_ID]));

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
          console.log(`✅ Assigned existing product ID ${existing.id} ("${item.name}") to Jewelry Box Inserts!`);
        } else {
          console.error(`❌ Failed to update categories for ID ${existing.id}:`, res);
        }
      } else {
        console.log(`ℹ️ Product ID ${existing.id} ("${item.name}") is already assigned to Jewelry Box Inserts.`);
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
        categories: [{ id: JEWELRY_PARENT_ID }, { id: JEWELRY_BOX_INSERTS_ID }],
        images: [
          {
            src: "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/c/i/ci018_eva_foam_with_flocking_01.jpg",
          },
        ],
      };

      const res = await request("/products", "POST", createPayload);
      if (res && res.id) {
        console.log(`✨ Successfully CREATED product ID ${res.id} (SKU: ${targetSku}, Name: "${item.name}") in Jewelry Box Inserts!`);
      } else {
        console.error(`❌ Failed to create product ${targetSku}:`, res);
      }
    }
  }

  console.log("\nFinished adding all 6 Jewelry Box Inserts products!");
}

run().catch(console.error);
