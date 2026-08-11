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

async function run() {
  console.log("Fetching all products from WooCommerce...");
  let page = 1;
  let allWCProducts = [];
  while (page <= 10) {
    const prods = await request(`/products?per_page=100&page=${page}`);
    if (!Array.isArray(prods) || prods.length === 0) break;
    allWCProducts = allWCProducts.concat(prods);
    page++;
  }

  console.log(`Loaded total ${allWCProducts.length} products.`);

  // Find products to delete (either belong to candle parent category 656 or SKU starts with CND-)
  const candleProducts = allWCProducts.filter((p) => {
    const isCandleCat = p.categories && p.categories.some((c) => c.id === CANDLE_PARENT_ID);
    const isCandleSku = p.sku && p.sku.startsWith("CND-");
    return isCandleCat || isCandleSku;
  });

  console.log(`Found ${candleProducts.length} Candle products to delete.`);

  for (const prod of candleProducts) {
    console.log(`Deleting product ID ${prod.id} ("${prod.name}", SKU: "${prod.sku}")...`);
    const res = await request(`/products/${prod.id}?force=true`, "DELETE");
    if (res && res.id) {
      console.log(`✅ Deleted product ID ${prod.id}`);
    } else {
      console.error(`❌ Failed to delete product ID ${prod.id}:`, res);
    }
  }

  console.log("\nFinished deleting all Candle Packaging products!");
}

run().catch(console.error);
