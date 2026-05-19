// Deno ka built-in KV database open kar rahe hain
const kv = await Deno.openKv();

// Testing ke liye kuch dummy data pehle se daal dete hain
// Jab aapka API chal jaye, toh aap aise hi aur data daal sakte hain
await kv.set(["users", "000011112222"], { name: "Rahul Kumar (Test)", dob: "01-01-2000", gender: "Male", city: "Delhi" });
await kv.set(["users", "555566667777"], { name: "Priya Sharma (Test)", dob: "15-08-2001", gender: "Female", city: "Mumbai" });

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // 1. Home Page Endpoint
  if (url.pathname === "/") {
    return new Response(JSON.stringify({ 
      developer: "@mr_noobster",
      channel: "t.me/noob11001",
      message: "API is Live (Deno KV). Use /search?id=NUMBER",
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
      // Deno KV se data fetch karna
      const result = await kv.get(["users", id]);

      if (result.value) {
        return new Response(JSON.stringify({
          developer: "@mr_noobster",
          channel: "t.me/noob11001",
          status: "success",
          data: result.value,
          credits: "@noob11001"
        }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      } else {
        return new Response(JSON.stringify({ 
          developer: "@mr_noobster",
          channel: "t.me/noob11001",
          error: "No data found for this number in KV store",
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

