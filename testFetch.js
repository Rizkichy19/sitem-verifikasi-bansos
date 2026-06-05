import fs from 'fs';

async function testFetch() {
  const url = "https://docs.google.com/spreadsheets/d/1n3pk7LJLu5G5RhPSvvEeBACtMCODfGGXSPcg2UIr9q0/export?format=csv&sheet=Verval%20sesuai%20PMK%20AMBARAWA";
  console.log("Fetching URL:", url);
  try {
    const res = await fetch(url);
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response text length:", text.length);
    console.log("First 500 characters:\n", text.slice(0, 500));
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testFetch();
