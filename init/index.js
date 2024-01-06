const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const initdata = require("./data.js");

async function main(){
  await mongoose.connect("");
}

main().then(()=>{
  console.log("Connection Successful");
});

async function initdb() {
  try {
    await listing.deleteMany({});
    //here we map a user as owner to every listings
    initdata.data = initdata.data.map((obj)=>({...obj, owner : "658ea3711b127ecad012b3c1" }));
    await listing.insertMany(initdata.data);
    console.log("Data was initialized");
  } catch (error) {
    console.error("Error initializing the database:", error);
  }
};

initdb().then(()=>{
  console.log("data was initialized");
})
