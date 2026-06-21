async function check(url, label) {
  const r = await fetch(`${url}/checkout`);
  const html = await r.text();
  const scripts = [...html.matchAll(/src="(\/_next\/static\/[^"]+)"/g)].map((m) => m[1]);
  let found = { mahalleKoy: false, addressApi: false, checkoutShell: false };
  for (const src of scripts) {
    const js = await fetch(`${url}${src}`).then((res) => res.text());
    if (js.includes("Mahalle / Köy")) found.mahalleKoy = true;
    if (js.includes("address/provinces")) found.addressApi = true;
    if (js.includes("checkout-shell")) found.checkoutShell = true;
  }
  const admin = await fetch(`${url}/admin`).then((res) => res.text());
  found.adminLight = admin.includes("FDFAF9") || admin.includes("admin-form");
  console.log(label, found);
}

await check("https://dami-beauty.vercel.app", "ALIAS");
