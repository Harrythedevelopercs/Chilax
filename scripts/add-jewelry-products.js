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
const JEWELRY_BEST_SELLERS_ID = 666;
const JEWELRY_LUXURY_BOXES_ID = 667;

// Best sellers: RP004, RP006, RP011, RP005, RP007
const BEST_SELLERS = [
  {
    sku: "RP004",
    name: "Lift-off / Detachable Lid",
    url: "https://pakfactory.com/lift-off-rigid-boxes.html",
    description: "Classic two-piece Lift-off / Detachable Lid rigid gift box designed for fine jewelry sets, bracelets, and rings.",
    short_description: "Classic two-piece lift-off lid rigid jewelry box.",
  },
  {
    sku: "RP006",
    name: "Shoulder / Neck",
    url: "https://pakfactory.com/custom-shoulder-rigid-box.html",
    description: "Sophisticated Shoulder / Neck rigid box with exposed inner collar for luxury jewelry presentation.",
    short_description: "Sophisticated shoulder / neck rigid box with exposed collar.",
  },
  {
    sku: "RP011",
    name: "Custom Shape",
    url: "https://pakfactory.com/custom-shape-rigid-box.html",
    description: "Unique Custom Shape rigid packaging crafted for bespoke luxury jewelry and designer accessories.",
    short_description: "Custom shape rigid packaging for designer jewelry.",
  },
  {
    sku: "RP005",
    name: "Partial Cover",
    url: "https://pakfactory.com/partial-cover-rigid-box.html",
    description: "Elegant Partial Cover rigid box with stylish reveal neck for necklaces, watches, and earrings.",
    short_description: "Partial cover rigid box with elegant inner reveal.",
  },
  {
    sku: "RP007",
    name: "Hinged / Flip Lid",
    url: "https://pakfactory.com/custom-hinged-rigid-box.html",
    description: "Classic Hinged / Flip Lid rigid presentation box with smooth opening mechanism for luxury jewelry.",
    short_description: "Hinged lid rigid presentation box for jewelry.",
  },
];

// Luxury boxes: RP005, RP007, RP009, RP011, RP002, RP004, RP006, RP008, RP010, RP001, RP003
const LUXURY_BOXES = [
  {
    sku: "RP005",
    name: "Partial Cover",
    url: "https://pakfactory.com/partial-cover-rigid-box.html",
    description: "Elegant Partial Cover rigid box with stylish reveal neck for necklaces, watches, and earrings.",
    short_description: "Partial cover rigid box with elegant inner reveal.",
  },
  {
    sku: "RP007",
    name: "Hinged / Flip Lid",
    url: "https://pakfactory.com/custom-hinged-rigid-box.html",
    description: "Classic Hinged / Flip Lid rigid presentation box with smooth opening mechanism for luxury jewelry.",
    short_description: "Hinged lid rigid presentation box for jewelry.",
  },
  {
    sku: "RP009",
    name: "Match / Slide Style",
    url: "https://pakfactory.com/custom-sliding-rigid-boxes.html",
    description: "Modern Match / Slide Style drawer box with smooth pull-out ribbon tab for luxury jewelry packaging.",
    short_description: "Match / slide drawer rigid box with pull-out ribbon.",
  },
  {
    sku: "RP011",
    name: "Custom Shape",
    url: "https://pakfactory.com/custom-shape-rigid-box.html",
    description: "Unique Custom Shape rigid packaging crafted for bespoke luxury jewelry and designer accessories.",
    short_description: "Custom shape rigid packaging for designer jewelry.",
  },
  {
    sku: "RP002",
    name: "Flip Top Magnetic Lock",
    url: "https://pakfactory.com/custom-flip-top-magnetic-box.html",
    description: "High-end Flip Top Magnetic Lock rigid box featuring snap magnetic closure for premium jewelry collections.",
    short_description: "Flip top magnetic lock rigid box with snap closure.",
  },
  {
    sku: "RP004",
    name: "Lift-off / Detachable Lid",
    url: "https://pakfactory.com/lift-off-rigid-boxes.html",
    description: "Classic two-piece Lift-off / Detachable Lid rigid gift box designed for fine jewelry sets, bracelets, and rings.",
    short_description: "Classic two-piece lift-off lid rigid jewelry box.",
  },
  {
    sku: "RP006",
    name: "Shoulder / Neck",
    url: "https://pakfactory.com/custom-shoulder-rigid-box.html",
    description: "Sophisticated Shoulder / Neck rigid box with exposed inner collar for luxury jewelry presentation.",
    short_description: "Sophisticated shoulder / neck rigid box with exposed collar.",
  },
  {
    sku: "RP008",
    name: "Book Style Rigid Box",
    url: "https://pakfactory.com/custom-book-style-rigid-box.html",
    description: "Book Style Rigid Box that opens like a hardcover book, ideal for luxury jewelry sets and watch gifts.",
    short_description: "Book style rigid box with spine and front flap.",
  },
  {
    sku: "RP010",
    name: "Round Shaped",
    url: "https://pakfactory.com/custom-round-shape-rigid-boxes.html",
    description: "Cylindrical round shaped rigid tube box engineered for unique jewelry, chains, and bangle presentation.",
    short_description: "Round cylinder rigid tube box for jewelry.",
  },
  {
    sku: "RP001",
    name: "Magnetic Closure Boxes",
    url: "https://pakfactory.com/magnetic-closure-boxes.html",
    description: "Luxury Magnetic Closure Boxes with strong concealed magnets for a premium unboxing experience.",
    short_description: "Luxury magnetic closure rigid boxes for jewelry.",
  },
  {
    sku: "RP003",
    name: "Collapsible / Foldable",
    url: "https://pakfactory.com/custom-collapsible-rigid-box.html",
    description: "Space-saving Collapsible / Foldable rigid gift boxes with adhesive corners and magnetic front flap.",
    short_description: "Collapsible foldable rigid box with magnetic closure.",
  },
];

async function run() {
  console.log("Fetching all products from WooCommerce...");
  let page = 1;
  let allWCProducts = [];
  while (page <= 5) {
    const prods = await request(`/products?per_page=100&page=${page}`);
    if (!Array.isArray(prods) || prods.length === 0) break;
    allWCProducts = allWCProducts.concat(prods);
    page++;
  }

  console.log(`Loaded ${allWCProducts.length} total products from WooCommerce.`);

  // Combine unique items to process
  const allTargetItems = new Map();

  BEST_SELLERS.forEach((item) => {
    allTargetItems.set(item.sku, {
      ...item,
      categoryIds: [JEWELRY_PARENT_ID, JEWELRY_BEST_SELLERS_ID],
    });
  });

  LUXURY_BOXES.forEach((item) => {
    if (allTargetItems.has(item.sku)) {
      const existing = allTargetItems.get(item.sku);
      existing.categoryIds.push(JEWELRY_LUXURY_BOXES_ID);
    } else {
      allTargetItems.set(item.sku, {
        ...item,
        categoryIds: [JEWELRY_PARENT_ID, JEWELRY_LUXURY_BOXES_ID],
      });
    }
  });

  for (const [sku, item] of allTargetItems.entries()) {
    const targetName = item.name.toLowerCase();

    // Find existing product in WC
    const existing = allWCProducts.find(
      (p) =>
        p.sku === sku ||
        p.name.toLowerCase() === targetName ||
        p.name.replace(/&amp;/g, "&").toLowerCase() === targetName
    );

    if (existing) {
      console.log(`Found existing product ID ${existing.id} ("${existing.name}", SKU: "${existing.sku}")`);

      const currentCatIds = existing.categories ? existing.categories.map((c) => c.id) : [];
      const updatedCatIds = Array.from(new Set([...currentCatIds, ...item.categoryIds]));

      const needCatUpdate = updatedCatIds.length !== currentCatIds.length;
      const needSkuUpdate = !existing.sku || existing.sku !== sku;

      if (needCatUpdate || needSkuUpdate) {
        console.log(`Updating product ID ${existing.id} (SKU: ${sku}, Categories: ${updatedCatIds.join(",")})...`);
        const updatePayload = {
          categories: updatedCatIds.map((id) => ({ id })),
        };
        if (needSkuUpdate) updatePayload.sku = sku;

        const res = await request(`/products/${existing.id}`, "PUT", updatePayload);
        if (res && res.id) {
          console.log(`✅ Assigned product ID ${existing.id} ("${item.name}") to Jewelry Categories [${item.categoryIds.join(",")}]!`);
        } else {
          console.error(`❌ Failed to update product ID ${existing.id}:`, res);
        }
      } else {
        console.log(`ℹ️ Product ID ${existing.id} ("${item.name}") already has all required jewelry categories.`);
      }
    } else {
      console.log(`Product SKU "${sku}" ("${item.name}") not found. Creating new product...`);
      const createPayload = {
        name: item.name,
        sku: sku,
        type: "simple",
        regular_price: "0",
        description: item.description,
        short_description: item.short_description,
        categories: item.categoryIds.map((id) => ({ id })),
        images: [
          {
            src: "https://media.pakfactory.com/catalog/product/cache/e110e1b4adf17fc607368e660f6aa2d4/f/0/f002-d.jpg",
          },
        ],
      };

      const res = await request("/products", "POST", createPayload);
      if (res && res.id) {
        console.log(`✨ Successfully CREATED product ID ${res.id} (SKU: ${sku}, Name: "${item.name}")!`);
      } else {
        console.error(`❌ Failed to create product ${sku}:`, res);
      }
    }
  }

  console.log("\nFinished processing all Jewelry Best Sellers & Luxury Boxes products!");
}

run().catch(console.error);
