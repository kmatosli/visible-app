/**
 * ============================================================
 * File: seed.mjs
 * Purpose: Seed Firestore products collection from FakeStore API.
 * Run once: node seed.mjs
 * ============================================================
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGjSVtETvqCKBgxJeILMDL8JzWGeydmJU",
  authDomain: "visible-app-245f1.firebaseapp.com",
  projectId: "visible-app-245f1",
  storageBucket: "visible-app-245f1.firebasestorage.app",
  messagingSenderId: "1074551896778",
  appId: "1:1074551896778:web:3bbc1e2497d4f7c9c0d233",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("Checking Firestore products collection...");

  const existing = await getDocs(collection(db, "products"));
  if (existing.size > 0) {
    console.log(`Already seeded — ${existing.size} products in Firestore.`);
    process.exit(0);
  }

  console.log("Fetching products from FakeStore API...");
  const response = await fetch("https://fakestoreapi.com/products");
  const products = await response.json();

  console.log(`Seeding ${products.length} products into Firestore...`);

  for (const p of products) {
    await addDoc(collection(db, "products"), {
      product_name: p.title,
      category: p.category,
      price: p.price,
      description: p.description,
      image: p.image,
      rating: p.rating.rate,
    });
    console.log(`  ✓ ${p.title.slice(0, 50)}`);
  }

  console.log("\nSeed complete. Firestore products collection ready.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
