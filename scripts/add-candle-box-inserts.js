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

const CANDLE_PARENT_ID = 656;
const CANDLE_BOX_INSERTS_ID = 661;

const CANDLE_BOX_INSERTS_TO_ADD = [
  {
    name: "Colored Wet Press Molded Pulp Insert",
    sku: "CI025",
    description: "Eco-friendly Colored Wet Press Molded Pulp Insert engineered to hold candle jars securely.",
    short_description: "Colored Wet Press Molded Pulp Insert.",
  },
  {
    name: "Ethylene-Vinyl Acetate Foam with Flocking (EVA)",
    sku: "CI018",
    description: "Luxury velvet-flocked EVA foam insert for high-end candle gift box packaging.",
    short_description: "Velvet flocked EVA foam insert.",
  },
  {
    name: "PETG Blister Insert",
    sku: "CI008",
    description: "Clear PETG thermoformed blister insert for maximum protection and clarity.",
    short_description: "Clear PETG Blister Insert.",
  },
  {
    name: "Natural Kraft Corrugated Insert",
    sku: "CI014",
    description: "Sustainable Natural Kraft Corrugated Insert providing shock protection for glass candle jars.",
    short_description: "Natural Kraft Corrugated Insert.",
  },
  {
    name: "Rigid Chipboard Divider Insert",
    sku: "CI017",
    description: "Sturdy Rigid Chipboard Divider Insert designed for multi-pack candle gift boxes.",
    short_description: "Rigid Chipboard Divider Insert.",
  },
  {
    name: "Folding Carton Box Divider Inserts",
    sku: "CI020",
    description: "Custom Folding Carton Box Divider Inserts for separating multiple candles in retail boxes.",
    short_description: "Folding Carton Box Divider Inserts.",
  },
  {
    name: "White Dry Press Molded Pulp Insert",
    sku: "CI024",
    description: "Clean White Dry Press Molded Pulp Insert for eco-conscious candle brands.",
    short_description: "White Dry Press Molded Pulp Insert.",
  },
  {
    name: "PP Blister Insert",
    sku: "CI026",
    description: "Durable Polypropylene (PP) blister insert for protective candle jar cushioning.",
    short_description: "PP Blister Insert for candles.",
  },
  {
    name: "Ethylene-Vinyl Acetate (EVA) Foam Insert",
    sku: "CI003",
    description: "High-density EVA foam insert custom cut to secure candle jars in place during transit.",
    short_description: "High-density EVA Foam Insert.",
  },
  {
    name: "HIPS Blister Insert",
    sku: "CI006",
    description: "High Impact Polystyrene (HIPS) thermoformed blister tray for heavy candle jars.",
    short_description: "HIPS Blister Insert.",
  },
  {
    name: "Processed Molded Pulp",
    sku: "CI012",
    description: "100% Recyclable Processed Molded Pulp insert for sustainable candle packaging.",
    short_description: "Processed Molded Pulp insert.",
  },
  {
    name: "Natural Kraft Paperboard Insert",
    sku: "CI016",
    description: "Eco-friendly Natural Kraft Paperboard Insert providing clean structural support for candles.",
    short_description: "Natural Kraft Paperboard Insert.",
  },
  {
    name: "PET Blister Insert",
    sku: "CI019",
    description: "Clear PET thermoformed blister insert custom molded for candle products.",
    short_description: "PET Blister Insert for candles.",
  },
  {
    name: "Natural Dry Press Molded Pulp Insert",
    sku: "CI023",
    description: "Biodegradable Natural Dry Press Molded Pulp Insert for eco candle gift boxes.",
    short_description: "Natural Dry Press Molded Pulp Insert.",
  },
];

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

  for (const item of CANDLE_BOX_INSERTS_TO_ADD) {
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
      const updatedCatIds = Array.from(new Set([...currentCatIds, CANDLE_PARENT_ID, CANDLE_BOX_INSERTS_ID]));

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
          console.log(`✅ Assigned existing product ID ${existing.id} ("${item.name}") to Candle Box Inserts!`);
        } else {
          console.error(`❌ Failed to update categories for ID ${existing.id}:`, res);
        }
      } else {
        console.log(`ℹ️ Product ID ${existing.id} ("${item.name}") is already assigned to Candle Box Inserts.`);
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
        categories: [{ id: CANDLE_PARENT_ID }, { id: CANDLE_BOX_INSERTS_ID }],
        images: [
          {
            src: "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f002-d.jpg",
          },
        ],
      };

      const res = await request("/products", "POST", createPayload);
      if (res && res.id) {
        console.log(`✨ Successfully CREATED product ID ${res.id} (SKU: ${targetSku}, Name: "${item.name}") in Candle Box Inserts!`);
      } else {
        console.error(`❌ Failed to create product ${targetSku}:`, res);
      }
    }
  }

  console.log("\nFinished adding all 14 Candle Box Inserts products!");
}

run().catch(console.error);
