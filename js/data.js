// ── RESTAURANT & FOOD DATA ──
const RESTAURANTS = [
  { id:1, name:"Burger King", cuisines:["Burgers","Fast Food","Beverages"], rating:4.2, reviews:"10K+", deliveryTime:"20-30 min", deliveryFee:0, minOrder:199, open:true, image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=250&fit=crop" },
  { id:2, name:"Domino's Pizza", cuisines:["Pizza","Italian","Pasta"], rating:4.5, reviews:"25K+", deliveryTime:"25-35 min", deliveryFee:0, minOrder:299, open:true, image:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=250&fit=crop" },
  { id:3, name:"Biryani Blues", cuisines:["Biryani","North Indian","Mughlai"], rating:4.6, reviews:"8K+", deliveryTime:"30-40 min", deliveryFee:30, minOrder:249, open:true, image:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=250&fit=crop" },
  { id:4, name:"China Garden", cuisines:["Chinese","Thai","Asian"], rating:4.1, reviews:"5K+", deliveryTime:"35-45 min", deliveryFee:25, minOrder:199, open:false, image:"https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=250&fit=crop" },
  { id:5, name:"McDonald's", cuisines:["Burgers","Fast Food","Beverages"], rating:4.3, reviews:"30K+", deliveryTime:"20-25 min", deliveryFee:0, minOrder:149, open:true, image:"https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=250&fit=crop" },
  { id:6, name:"Pizza Hut", cuisines:["Pizza","Pasta","Sides"], rating:4.4, reviews:"18K+", deliveryTime:"30-40 min", deliveryFee:0, minOrder:299, open:true, image:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=250&fit=crop" },
  { id:7, name:"Haldiram's", cuisines:["North Indian","Sweets","Snacks"], rating:4.7, reviews:"12K+", deliveryTime:"25-35 min", deliveryFee:20, minOrder:199, open:true, image:"https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=250&fit=crop" },
  { id:8, name:"Cafe Coffee Day", cuisines:["Cafe","Beverages","Snacks"], rating:3.9, reviews:"6K+", deliveryTime:"15-25 min", deliveryFee:29, minOrder:149, open:true, image:"https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=250&fit=crop" },
];

const FOOD_ITEMS = [
  // Burgers
  { id:1, rid:1, name:"Classic Whopper", category:"burger", type:"nonveg", price:199, originalPrice:249, rating:4.5, image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop", desc:"Flame-grilled beef patty with fresh veggies and special sauce." },
  { id:2, rid:1, name:"Veg Burger Deluxe", category:"burger", type:"veg", price:149, originalPrice:189, rating:4.2, image:"https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&h=200&fit=crop", desc:"Crispy veggie patty with lettuce and tangy mayo." },
  { id:3, rid:5, name:"McAloo Tikki", category:"burger", type:"veg", price:79, originalPrice:99, rating:4.4, image:"https://images.unsplash.com/photo-1603064752734-4c48eff14d57?w=300&h=200&fit=crop", desc:"Our favourite Indian-style potato burger." },
  { id:4, rid:5, name:"Chicken Maharaja Mac", category:"burger", type:"nonveg", price:249, originalPrice:299, rating:4.6, image:"https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop", desc:"Double chicken patty with pepper mayo and veggies." },
  // Pizza
  { id:5, rid:2, name:"Pepperoni Feast", category:"pizza", type:"nonveg", price:399, originalPrice:499, rating:4.7, image:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop", desc:"Loaded with pepperoni and mozzarella." },
  { id:6, rid:2, name:"Veggie Paradise", category:"pizza", type:"veg", price:349, originalPrice:429, rating:4.3, image:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop", desc:"Fresh veggies on a herbed tomato base." },
  { id:7, rid:6, name:"Chicken Tikka Pizza", category:"pizza", type:"nonveg", price:429, originalPrice:529, rating:4.5, image:"https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=300&h=200&fit=crop", desc:"Spicy chicken tikka with capsicum and onions." },
  // Biryani
  { id:8, rid:3, name:"Hyderabadi Chicken Biryani", category:"biryani", type:"nonveg", price:299, originalPrice:379, rating:4.8, image:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=300&h=200&fit=crop", desc:"Aromatic basmati rice with tender chicken and spices." },
  { id:9, rid:3, name:"Veg Biryani", category:"biryani", type:"veg", price:229, originalPrice:289, rating:4.4, image:"https://images.unsplash.com/photo-1645177628172-a5ae60eacdb5?w=300&h=200&fit=crop", desc:"Fragrant biryani with fresh seasonal vegetables." },
  { id:10, rid:3, name:"Mutton Biryani", category:"biryani", type:"nonveg", price:399, originalPrice:479, rating:4.9, image:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=200&fit=crop", desc:"Slow-cooked tender mutton with dum biryani." },
  // Chinese
  { id:11, rid:4, name:"Veg Hakka Noodles", category:"chinese", type:"veg", price:179, originalPrice:219, rating:4.1, image:"https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=200&fit=crop", desc:"Stir-fried noodles with fresh vegetables and soy sauce." },
  { id:12, rid:4, name:"Chicken Manchurian", category:"chinese", type:"nonveg", price:249, originalPrice:299, rating:4.3, image:"https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&h=200&fit=crop", desc:"Crispy chicken balls in tangy Manchurian sauce." },
  // Desserts
  { id:13, rid:7, name:"Gulab Jamun", category:"dessert", type:"veg", price:79, originalPrice:99, rating:4.8, image:"https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop", desc:"Soft milk-solid dumplings in sugar syrup." },
  { id:14, rid:2, name:"Choco Lava Cake", category:"dessert", type:"veg", price:129, originalPrice:159, rating:4.7, image:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop", desc:"Warm chocolate cake with a gooey molten center." },
  // Drinks
  { id:15, rid:5, name:"McFlurry Oreo", category:"drinks", type:"veg", price:99, originalPrice:129, rating:4.6, image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop", desc:"Creamy vanilla ice cream with Oreo bits." },
  { id:16, rid:8, name:"Café Mocha", category:"drinks", type:"veg", price:149, originalPrice:179, rating:4.3, image:"https://images.unsplash.com/photo-1551539088-a3d5e45167e2?w=300&h=200&fit=crop", desc:"Rich espresso with steamed milk and chocolate." },
];
