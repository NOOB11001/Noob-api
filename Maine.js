// Deno Deploy ke built-in permanent Key-Value store ko open kar rahe hain
const kv = await Deno.openKv();

// --- DUMMY DATA SEEDING (Sirf testing ke liye) ---
// Note: Real production me aap alag se ek /add_user ka endpoint bana kar data insert kar sakte hain.
await kv.set(["users", "123456789012"], {
  name: "Rahul Kumar",
  fathersName: "Sanjay Kumar",
  phoneNumber: "9876543210",
  otherNumber: "9123456789",
  passportNumber: "A1234567",
  aadharNumber: "[Aadhaar Redacted]",
  age: "26",
  gender: "Male",
  address: "House No. 45, Near Metro Station",
  district: "New Delhi",
  pincode: "110001",
  state: "Delhi",
  town: "Connaught Place"
});

await kv.set(["users", "987654321098"], {
  name: "Priya Sharma",
  fathersName: "Rajesh Sharma",
  phoneNumber: "8765432109",
  otherNumber: "",
  passportNumber: "B8765432",
  aadharNumber: "[Aadhaar Redacted]",
  age: "24",
  gender: "Female",
  address: "Flat 202, Sunshine Apartments",
  district: "Mumbai Suburban",
  pincode: "400001",
  state: "Maharashtra",
  town: "Colaba"
});
// ------------------------------------------------

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // 1. Home Page Endpoint
  if (url.pathname === "/") {
    return new Response(JSON.stringify({ 
      developer: "@mr_noobster",
      channel: "t.me/noob11001",
      message: "API is Live. Use /search?id=NUMBER",
      credits: "@noob11001"
    }), {
      status: 200,
      headers: { "content-type": "application/json; charset=UTF-8" },
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
        headers: { "content-type": "application/json; charset=UTF-8" },
      });
    }

    // Deno KV database se data fetch karna
    const result = await kv.get(["users", id]);
    const userData = result.value;

    if (userData) {
      return new Response(JSON.stringify({
        developer: "@mr_noobster",
        channel: "t.me/noob11001",
        status: "success",
        data: userData,
        credits: "@noob11001"
      }), {
        status: 200,
        headers: { "content-type": "application/json; charset=UTF-8" },
      });
    } else {
      return new Response(JSON.stringify({ 
        developer: "@mr_noobster",
        channel: "t.me/noob11001",
        error: "No data found for this number",
        credits: "@noob11001"
      }), {
        status: 404,
        headers: { "content-type": "application/json; charset=UTF-8" },
      });
    }
  }

  return new Response("Not Found", { status: 404 });
});

