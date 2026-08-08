const https = require("https");

const WC_URL = "https://purple-manatee-256891.hostingersite.com";
const CK = "ck_862f4228314615430415451f1d591c887ca2b4ff";
const CS = "cs_59d29edc3695f437573e0711134b79275e7e7af2";

function request(urlPath) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${CK}:${CS}`).toString("base64");
    const fullUrl = new URL(`${WC_URL}/wp-json/wc/v3${urlPath}`);

    const options = {
      hostname: fullUrl.hostname,
      path: fullUrl.pathname + fullUrl.search,
      method: "GET",
      headers: { Authorization: `Basic ${auth}` },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(JSON.parse(data)));
    });
    req.on("error", (e) => reject(e));
    req.end();
  });
}

async function run() {
  const p905 = await request("/products/905");
  console.log("Product 905 categories:", p905.categories);

  const cat647Prods = await request("/products?category=647");
  console.log(`Products under category 647 count: ${cat647Prods.length}`);

  const cat644Prods = await request("/products?category=644");
  console.log(`Products under parent category 644 count: ${cat644Prods.length}`);
}

run();
