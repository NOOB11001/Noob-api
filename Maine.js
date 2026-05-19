// Database ke bajaye hum standard fast In-Memory Map ka use kar rahe hain
// Yeh bina kisi extra flag ke har platform par 100% chalta hai aur super fast hai
const kvStore = new Map();

// Testing ke liye dummy data (Aap isme jitna chahein data badha sakte hain)
kvStore.set("123456789012", { name: "Rahul Kumar (Test)", dob: "01-01-2000", gender: "Male", city: "Delhi" });
kvStore.set("987654321098", { name: "Priya Sharma (Test)", dob: "15-08-2001", gender: "Female", city: "Mumbai" });

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

    // Map se data check karna
    const userData = kvStore.get(id);

    if (userData) {
      return new Response(JSON.stringify({
        developer: "@mr_noobster",
        channel: "t.me/noob11001",
        status: "success",
        data: userData,
        credits: "@noob11001"
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
  }

  return new Response("Not Found", { status: 404 });
});
