// scripts/seedMenu.ts
// Run this ONCE to push your existing menu data to Firebase:
// npx ts-node --project tsconfig.json scripts/seedMenu.ts
import "dotenv/config"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore"

// ← Paste your actual values here directly
const firebaseConfig = {
  apiKey: "AIzaSyA-yt0pR20z-S2OF1VTqXSTLmotKNAArLM",
  authDomain: "fooddash-bd1ab.firebaseapp.com",
  projectId: "fooddash-bd1ab",
  storageBucket: "fooddash-bd1ab.firebasestorage.app",
  messagingSenderId: "1097841896334",
  appId: "1:1097841896334:web:86685dbaf7c2e3d830d2df",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const menuData = [
  { slug: "pizzas", name: "Authentic Pizzas", desc: "Traditional wood-fired crusts topped with San Marzano tomatoes and premium buffalo mozzarella.", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80" },
  { slug: "burgers", name: "Gourmet Burgers", desc: "Hand-pressed premium wagyu beef, house-made brioche buns, and our secret signature truffle sauce.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80" },
  { slug: "pasta", name: "Artisan Pasta", desc: "Hand-rolled dough made daily, paired with authentic regional sauces from across Italy.", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=1200&q=80" },
  { slug: "salads", name: "Fresh Salads", desc: "Seasonal greens sourced from local farms with unique house-made vinaigrettes.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80" },
  { slug: "steaks", name: "Signature Steaks", desc: "Dry-aged prime cuts, flame-grilled to your preference and served with roasted bone marrow.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80" },
  { slug: "desserts", name: "Decadent Desserts", desc: "Artisan pastries and sweet creations crafted daily by our award-winning pastry chef.", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200&q=80" },
]

const menuItems = [
  // Pizzas
  { id: "p1", name: "Classic Margherita", price: 14.99, rating: 4.8, reviews: 120, desc: "San Marzano tomato sauce, fresh buffalo mozzarella, basil.", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80", veg: true, category: "pizzas", available: true },
  { id: "p2", name: "Spicy Diavola", price: 16.99, rating: 4.9, reviews: 85, desc: "Spicy Calabrese salami, chili flakes, tomato sauce, mozzarella.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80", veg: false, category: "pizzas", available: true },
  { id: "p3", name: "Truffle Funghi", price: 18.50, rating: 4.7, reviews: 50, desc: "Roasted wild mushrooms, truffle oil, ricotta, and fresh thyme.", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80", veg: true, category: "pizzas", available: true },
  { id: "p4", name: "Garden Feast", price: 15.99, rating: 4.6, reviews: 142, desc: "Bell peppers, red onion, olives, mushrooms, corn, and pesto base.", image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&q=80", veg: true, category: "pizzas", available: true },
  { id: "p5", name: "Honey Pepperoni", price: 16.50, rating: 4.9, reviews: 210, desc: "Crispy pepperoni cups, hot honey drizzle, and aged mozzarella.", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80", veg: false, category: "pizzas", available: true },
  { id: "p6", name: "BBQ Smoked Chicken", price: 17.99, rating: 4.5, reviews: 98, desc: "Slow-smoked chicken, tangy BBQ sauce, cilantro, and red onion.", image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&q=80", veg: false, category: "pizzas", available: true },
  // Burgers
  { id: "b1", name: "Monster Angus Burger", price: 14.50, rating: 4.8, reviews: 200, desc: "Double Angus beef patties, aged cheddar, caramelized onions, secret sauce.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", veg: false, category: "burgers", available: true },
  { id: "b2", name: "Truffle Wagyu Burger", price: 19.99, rating: 4.9, reviews: 134, desc: "Wagyu beef, truffle aioli, arugula, and shaved parmesan on brioche.", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80", veg: false, category: "burgers", available: true },
  { id: "b3", name: "Crispy Chicken Burger", price: 13.50, rating: 4.7, reviews: 176, desc: "Buttermilk fried chicken, sriracha mayo, pickles, and coleslaw.", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80", veg: false, category: "burgers", available: true },
  { id: "b4", name: "Garden Veggie Burger", price: 12.99, rating: 4.5, reviews: 88, desc: "House-made black bean patty, avocado, tomato, and herb aioli.", image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&q=80", veg: true, category: "burgers", available: true },
  { id: "b5", name: "BBQ Bacon Smash", price: 15.99, rating: 4.8, reviews: 221, desc: "Smashed beef patty, crispy bacon, BBQ sauce, cheddar, and onion rings.", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&q=80", veg: false, category: "burgers", available: true },
  { id: "b6", name: "Mushroom Swiss Burger", price: 14.99, rating: 4.6, reviews: 109, desc: "Sautéed mushrooms, Swiss cheese, garlic butter, and fresh lettuce.", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80", veg: false, category: "burgers", available: true },
  // Pasta
  { id: "pa1", name: "Creamy Forest Pasta", price: 16.20, rating: 4.7, reviews: 95, desc: "Wild mushrooms in a rich parmesan cream sauce with fresh tagliatelle.", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80", veg: true, category: "pasta", available: true },
  { id: "pa2", name: "Spaghetti Carbonara", price: 15.50, rating: 4.9, reviews: 310, desc: "Egg yolk, guanciale, pecorino romano, and black pepper. Classic Roman.", image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80", veg: false, category: "pasta", available: true },
  { id: "pa3", name: "Truffle Cacio e Pepe", price: 17.99, rating: 4.8, reviews: 140, desc: "Tonnarelli, black truffle shavings, pecorino, and cracked black pepper.", image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80", veg: true, category: "pasta", available: true },
  { id: "pa4", name: "Lobster Linguine", price: 26.99, rating: 4.9, reviews: 72, desc: "Fresh lobster, cherry tomatoes, garlic, white wine, and chili flakes.", image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80", veg: false, category: "pasta", available: true },
  { id: "pa5", name: "Pesto Genovese", price: 14.50, rating: 4.6, reviews: 188, desc: "Trofie pasta with house-made basil pesto, green beans, and potatoes.", image: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400&q=80", veg: true, category: "pasta", available: true },
  { id: "pa6", name: "Slow Ragu Pappardelle", price: 18.50, rating: 4.8, reviews: 163, desc: "8-hour braised beef ragu, wide pappardelle, and fresh ricotta.", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80", veg: false, category: "pasta", available: true },
  // Salads
  { id: "s1", name: "Harvest Zen Bowl", price: 12.99, rating: 4.6, reviews: 143, desc: "Quinoa, roast sweet potato, kale, pomegranate, and tahini dressing.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80", veg: true, category: "salads", available: true },
  { id: "s2", name: "Caesar Supreme", price: 13.50, rating: 4.7, reviews: 201, desc: "Romaine, house Caesar dressing, sourdough croutons, and parmesan.", image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80", veg: false, category: "salads", available: true },
  { id: "s3", name: "Greek Garden Salad", price: 11.99, rating: 4.5, reviews: 117, desc: "Cucumber, tomato, olives, red onion, feta, and oregano vinaigrette.", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80", veg: true, category: "salads", available: true },
  { id: "s4", name: "Niçoise Salad", price: 15.99, rating: 4.7, reviews: 89, desc: "Tuna, green beans, boiled egg, olives, and Dijon vinaigrette.", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80", veg: false, category: "salads", available: true },
  { id: "s5", name: "Mango Avocado Salad", price: 13.99, rating: 4.8, reviews: 156, desc: "Fresh mango, creamy avocado, arugula, chili lime dressing.", image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&q=80", veg: true, category: "salads", available: true },
  { id: "s6", name: "Roasted Beet Salad", price: 12.50, rating: 4.4, reviews: 74, desc: "Roasted beets, goat cheese, candied walnuts, and balsamic glaze.", image: "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&q=80", veg: true, category: "salads", available: true },
  // Steaks
  { id: "st1", name: "Smoked BBQ Ribs", price: 24.00, rating: 5.0, reviews: 188, desc: "Fall-off-the-bone pork ribs with 12-hour hickory smoke and house glaze.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80", veg: false, category: "steaks", available: true },
  { id: "st2", name: "Ribeye Steak 300g", price: 38.00, rating: 4.9, reviews: 142, desc: "Dry-aged USDA prime ribeye, garlic butter, rosemary, and sea salt.", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80", veg: false, category: "steaks", available: true },
  { id: "st3", name: "Filet Mignon 200g", price: 42.00, rating: 4.9, reviews: 97, desc: "Tenderloin center cut, truffle butter, and red wine reduction.", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80", veg: false, category: "steaks", available: true },
  { id: "st4", name: "T-Bone 400g", price: 45.00, rating: 4.8, reviews: 63, desc: "Classic T-bone, flame-grilled to perfection, with bone marrow butter.", image: "https://images.unsplash.com/photo-1607116667981-ff1ac11d3ed0?w=400&q=80", veg: false, category: "steaks", available: true },
  { id: "st5", name: "Lamb Rack", price: 34.00, rating: 4.7, reviews: 81, desc: "French-trimmed lamb rack, herb crust, mint jelly, and roasted veg.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80", veg: false, category: "steaks", available: true },
  { id: "st6", name: "Wagyu Striploin 250g", price: 55.00, rating: 5.0, reviews: 44, desc: "A5 Wagyu striploin, yuzu kosho, pickled daikon, and wasabi cream.", image: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=400&q=80", veg: false, category: "steaks", available: true },
  // Desserts
  { id: "d1", name: "Berry Velvet Cake", price: 9.50, rating: 4.4, reviews: 132, desc: "Mascarpone, fresh mountain berries, and a moist vanilla sponge.", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80", veg: true, category: "desserts", available: true },
  { id: "d2", name: "Chocolate Lava Cake", price: 10.50, rating: 4.9, reviews: 287, desc: "Warm dark chocolate cake with a molten center, vanilla ice cream.", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80", veg: true, category: "desserts", available: true },
  { id: "d3", name: "Crème Brûlée", price: 8.99, rating: 4.8, reviews: 174, desc: "Classic French custard with a perfectly caramelized sugar crust.", image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&q=80", veg: true, category: "desserts", available: true },
  { id: "d4", name: "Tiramisu", price: 9.99, rating: 4.9, reviews: 321, desc: "Espresso-soaked ladyfingers, mascarpone cream, and dark cocoa.", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80", veg: true, category: "desserts", available: true },
  { id: "d5", name: "Mango Panna Cotta", price: 8.50, rating: 4.6, reviews: 98, desc: "Silky Italian panna cotta with a fresh mango coulis and mint.", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80", veg: true, category: "desserts", available: true },
  { id: "d6", name: "Baklava Platter", price: 11.99, rating: 4.7, reviews: 66, desc: "Crispy filo, mixed nuts, rose water, and wildflower honey syrup.", image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&q=80", veg: true, category: "desserts", available: true },
]

async function seed() {
  console.log("🌱 Seeding menu data to Firebase...")

  // Clear existing menu + categories
  const menuSnap = await getDocs(collection(db, "menu"))
  for (const d of menuSnap.docs) await deleteDoc(doc(db, "menu", d.id))

  const catSnap = await getDocs(collection(db, "categories"))
  for (const d of catSnap.docs) await deleteDoc(doc(db, "categories", d.id))

  // Seed categories
  for (const cat of menuData) {
    await addDoc(collection(db, "categories"), cat)
    console.log(`✅ Category: ${cat.name}`)
  }

  // Seed menu items
  for (const item of menuItems) {
    await addDoc(collection(db, "menu"), item)
    console.log(`✅ Item: ${item.name}`)
  }

  console.log("🎉 Done! All menu data is now in Firebase.")
  process.exit(0)
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err)
  process.exit(1)
})