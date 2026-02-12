const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

/* ========= CONNECT DATABASE ========= */

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log(" MongoDB Connected");
})
.catch((err) => {
    console.log(" MongoDB Error:", err);
});

/* ========= USER MODEL ========= */

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  }
});

const User = mongoose.model("User", userSchema);

/* ========= ROOT ========= */

app.get("/", (req,res)=>{
  res.send("User API running with MongoDB");
});

/* ========= CREATE USER ========= */
app.post("/users", async (req,res)=>{
  try{

    const {name,email} = req.body;

    if(!name || !email){
      return res.status(400).json({
        message:"Name and email required"
      });
    }

    const user = await User.create({name,email});

    res.status(201).json(user);

  }catch(err){

    console.log("CREATE USER ERROR 👉", err); // ⭐ VERY IMPORTANT

    res.status(500).json({
      message: err.message
    });
  }
});



/* ========= GET ALL USERS ========= */


app.get("/users", async (req,res)=>{
  try{
    const users = await User.find();
    res.json(users);
  }catch(err){
    console.log(err);
    res.status(500).json({message:"Error fetching users"});
  }
});

/* ========= GET USER BY ID ========= */

app.get("/users/:id", async (req,res)=>{
  const user = await User.findById(req.params.id);

  if(!user){
    return res.status(404).json({
      message:"User not found"
    });
  }

  res.json(user);
});

/* ========= UPDATE USER ========= */

app.put("/users/:id", async (req,res)=>{
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new:true}
  );

  if(!user){
    return res.status(404).json({
      message:"User not found"
    });
  }

  res.json(user);
});

/* ========= DELETE USER ========= */

app.delete("/users/:id", async (req,res)=>{
  const user = await User.findByIdAndDelete(req.params.id);

  if(!user){
    return res.status(404).json({
      message:"User not found"
    });
  }

  res.json({
    message:"User deleted successfully"
  });
});

/* ========= START SERVER ========= */

app.listen(3000, ()=>{
  console.log("Server started on port 3000");
});