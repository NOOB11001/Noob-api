import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";

// data.db file ko open kar rahe hain (Read-Only)
const db = new DB("data.db");

Deno.serve((req) => {
  const url = new URL(req.url);

  // 1. Home Page Endpoint
  if (url.pathname === "/") {
    return new Response(JSON.stringify({ 
      developer: "@mr_noobster",
      channel: "t.me/noob11001",
      message: "API is Live. Use /search?id=NUMBER",
      credits: "@noob11001"
    }), {
      headers: { "content-type": "application/json" },
    });
  }

  // 2. Search Endpoint (/search?id=1234...)
  if (url.pathname === "/search") {
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ 
        developer: "@mr_noobster",
        channel: "t.me/noob11001",
        error: "ID parameter is required",
        credits: "@noob11001"
      }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    try {
      // ⚠️ IMPORTANT: Image mein aapki repo ka naam 'icmr-mini-info-api' dikh raha hai.
      // Agar icmr ke database mein table ka naam 'users' ke bajaye kuch aur hai, toh use yahan badlein.
      // Agar columns ke naam alag hain toh 'name, dob, gender, city' ko bhi badal lein.
      const rows = db.query("SELECT name, dob, gender, city FROM users WHERE aadhaar_no = ?", [id]);

      if (rows.length > 0) {
        const [name, dob, gender, city] = rows[0];
        
        // Response jisme start aur end dono jagah aapke credits hain
        return new Response(JSON.stringify({
          developer: "@mr_noobster",        // First me credits
          channel: "t.me/noob11001",         // First me credits
          status: "success",
          data: {
            id: id,
            name: name,
            dob: dob,
            gender: gender,
            city: city
          },
          credits: "@noob11001"              // Last me credits
        }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });

      } else {
        return new Response(JSON.stringify({ 
          developer: "@mr_noobster",
          channel: "t.me/noob11001",
          error: "No data found for this number",
          credits: "@noob11001"
        }), {
          status: 404,
          headers: { "content-type": "application/json" },
        });
      }
    } catch (err) {
      return new Response(JSON.stringify({ 
        developer: "@mr_noobster",
        channel: "t.me/noob11001",
        error: "Database error", 
        details: err.message,
        credits: "@noob11001"
      }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  }

  return new Response("Not Found", { status: 404 });
});
