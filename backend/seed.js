import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import connectDB from "./config/db.js";

import User from "./models/userModel.js";
import Category from "./models/categoryModel.js";
import Product from "./models/bookModel.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear old data
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log("Old data deleted.");

    // Create admin
    const admin = await User.create({
      username: "admin",
      email: "admin@bookverse.com",
      password: await bcrypt.hash("admin123", 10),
      isAdmin: true,
    });

    console.log("Admin created.");

    // Categories
    const categories = await Category.insertMany([
      { name: "Self Help" },
      { name: "Finance" },
      { name: "Fiction" },
      { name: "Romance" },
      { name: "Programming" },
      { name: "Biography" },
      { name: "Productivity" },
    ]);

    console.log("Categories created.");

    // Books
    await Product.insertMany([
      // Part 1
      {
        name: "Atomic Habits",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466482/storyshelf/or6hetkbse4ipdhq5npg.jpg",
        brand: "James Clear",
        quantity: 100,
        category: categories[0]._id,
        description: "Build good habits and break bad ones with practical habits that last.",
        price: 499,
        countInStock: 50,
        rating: 4.8,
        numReviews: 150,
      },
      {
        name: "Ikigai",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466488/storyshelf/ztwkida6oge1swjxi63y.jpg",
        brand: "Héctor García & Francesc Miralles",
        quantity: 100,
        category: categories[0]._id,
        description: "Discover the Japanese secret to a long and meaningful life.",
        price: 399,
        countInStock: 45,
        rating: 4.7,
        numReviews: 132,
      },
      {
        name: "Can't Hurt Me",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466483/storyshelf/rv8c8hbgfhic3mmvkdpu.jpg",
        brand: "David Goggins",
        quantity: 100,
        category: categories[0]._id,
        description: "Master mental toughness and push beyond your limits.",
        price: 599,
        countInStock: 40,
        rating: 4.9,
        numReviews: 210,
      },
      {
        name: "Think Like a Monk",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466499/storyshelf/wsdptuianvymdx6sccza.webp",
        brand: "Jay Shetty",
        quantity: 100,
        category: categories[0]._id,
        description: "Train your mind for peace, purpose and happiness.",
        price: 499,
        countInStock: 35,
        rating: 4.8,
        numReviews: 175,
      },
      {
        name: "Do Epic Shit",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466484/storyshelf/wmahcvghykjq1jtf2gch.jpg",
        brand: "Ankur Warikoo",
        quantity: 100,
        category: categories[6]._id,
        description: "Straightforward advice on career, money and personal growth.",
        price: 299,
        countInStock: 60,
        rating: 4.6,
        numReviews: 145,
      },
      // Part 2
      {
        name: "Rich Dad Poor Dad",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466495/storyshelf/im1loiyircx7saa7v1ci.jpg",
        brand: "Robert Kiyosaki",
        quantity: 100,
        category: categories[1]._id,
        description: "Financial education classic that changes the way you think about money.",
        price: 450,
        countInStock: 30,
        rating: 4.6,
        numReviews: 180,
      },
      {
        name: "The Psychology of Money",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466494/storyshelf/inrpnlysyykkglc3me42.jpg",
        brand: "Morgan Housel",
        quantity: 100,
        category: categories[1]._id,
        description: "Timeless lessons on wealth, greed, and happiness.",
        price: 499,
        countInStock: 40,
        rating: 4.8,
        numReviews: 220,
      },
      {
        name: "Think and Grow Rich",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466498/storyshelf/vbamfsh2mpokgmvfrmcj.jpg",
        brand: "Napoleon Hill",
        quantity: 100,
        category: categories[1]._id,
        description: "One of the world's best-selling personal success books.",
        price: 399,
        countInStock: 35,
        rating: 4.7,
        numReviews: 190,
      },
      {
        name: "The Intelligent Investor",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466488/storyshelf/caaxbye7t7deo4rxugdi.jpg",
        brand: "Benjamin Graham",
        quantity: 100,
        category: categories[1]._id,
        description: "The definitive guide to value investing.",
        price: 799,
        countInStock: 25,
        rating: 4.9,
        numReviews: 155,
      },
      {
        name: "The Alchemist",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466498/storyshelf/dh0xr7ocu3iia55rvpqh.jpg",
        brand: "Paulo Coelho",
        quantity: 100,
        category: categories[2]._id,
        description: "A magical story about following your dreams and destiny.",
        price: 399,
        countInStock: 35,
        rating: 4.7,
        numReviews: 220,
      },
      // Part 3
      {
        name: "The Kite Runner",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466490/storyshelf/lmjj9ptwwzxxdgqbsxol.jpg",
        brand: "Khaled Hosseini",
        quantity: 100,
        category: categories[2]._id,
        description: "A powerful novel of friendship, guilt, and redemption.",
        price: 499,
        countInStock: 40,
        rating: 4.8,
        numReviews: 210,
      },
      {
        name: "The Midnight Library",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466492/storyshelf/ltrhvsjuhrrpz6uhqqfq.jpg",
        brand: "Matt Haig",
        quantity: 100,
        category: categories[2]._id,
        description: "A journey through alternate lives and second chances.",
        price: 499,
        countInStock: 35,
        rating: 4.7,
        numReviews: 180,
      },
      {
        name: "It Ends With Us",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466489/storyshelf/d3qsmnjjd5qsgljyfdt6.jpg",
        brand: "Colleen Hoover",
        quantity: 100,
        category: categories[3]._id,
        description: "A bestselling romance exploring love and difficult choices.",
        price: 399,
        countInStock: 50,
        rating: 4.8,
        numReviews: 260,
      },
      {
        name: "Love Story",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466490/storyshelf/g5foufducunaez12pefc.jpg",
        brand: "Erich Segal",
        quantity: 100,
        category: categories[3]._id,
        description: "A timeless romantic classic.",
        price: 349,
        countInStock: 45,
        rating: 4.5,
        numReviews: 120,
      },
      {
        name: "Me Before You",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466492/storyshelf/jifemihoc0e7u8yha4jj.jpg",
        brand: "Jojo Moyes",
        quantity: 100,
        category: categories[3]._id,
        description: "A heartfelt love story about hope and sacrifice.",
        price: 449,
        countInStock: 40,
        rating: 4.8,
        numReviews: 200,
      },
      // Part 4
      {
        name: "The Fault in Our Stars",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466487/storyshelf/dst0mctndrpuig9wmpd7.jpg",
        brand: "John Green",
        quantity: 100,
        category: categories[3]._id,
        description: "A touching young adult romance about love and courage.",
        price: 399,
        countInStock: 45,
        rating: 4.8,
        numReviews: 240,
      },
      {
        name: "Clean Code",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466483/storyshelf/uc5aybvpqtl3d17gixhd.jpg",
        brand: "Robert C. Martin",
        quantity: 100,
        category: categories[4]._id,
        description: "A handbook of Agile software craftsmanship.",
        price: 799,
        countInStock: 30,
        rating: 4.9,
        numReviews: 180,
      },
      {
        name: "The Pragmatic Programmer",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466493/storyshelf/mphpai8vbrwyxwezkynz.jpg",
        brand: "Andrew Hunt & David Thomas",
        quantity: 100,
        category: categories[4]._id,
        description: "Essential practices every software developer should know.",
        price: 899,
        countInStock: 25,
        rating: 4.9,
        numReviews: 165,
      },
      {
        name: "Steve Jobs",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466497/storyshelf/wtva5o5og3sy3xinkdkx.png",
        brand: "Walter Isaacson",
        quantity: 100,
        category: categories[5]._id,
        description: "The definitive biography of Apple's co-founder.",
        price: 599,
        countInStock: 35,
        rating: 4.8,
        numReviews: 170,
      },
      {
        name: "Wings of Fire",
        image: "https://res.cloudinary.com/yeqnwc6p/image/upload/v1785466500/storyshelf/p1dfb13ubtst6w3k0nbd.jpg",
        brand: "A.P.J. Abdul Kalam",
        quantity: 100,
        category: categories[5]._id,
        description: "The inspiring autobiography of Dr. A.P.J. Abdul Kalam.",
        price: 399,
        countInStock: 50,
        rating: 4.9,
        numReviews: 250,
      },
    ]);

    console.log("Books inserted successfully.");
    console.log("Database seeded successfully.");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();