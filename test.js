import fs from 'fs';
import Papa from 'papaparse';

async function test() {
  const url = "https://docs.google.com/spreadsheets/d/1n3pk7LJLu5G5RhPSvvEeBACtMCODfGGXSPcg2UIr9q0/export?format=csv&sheet=Verval%20sesuai%20PMK%20AMBARAWA";
  const res = await fetch(url);
  const text = await res.text();
  console.log("TEXT LENGTH:", text.length);
  const { data } = Papa.parse(text, { header: false, skipEmptyLines: true });
  console.log("TOTAL ROWS:", data.length);
  if (data.length > 0) {
    console.log("HEADER:", data[0]);
    for (let i = 1; i < Math.min(30, data.length); i++) {
       console.log(`Row ${i}: NAMA=${data[i]?.[1]} NIK=${data[i]?.[2]}`);
    }
  }
}
test();
