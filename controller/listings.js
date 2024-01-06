//this is MVC controller section 
const listing = require("../models/listing.js");

//Index page route 
module.exports.index = async (req,res) => {
    const data = await listing.find({});
    res.render("./listings/index.ejs",{data});
}

//render the add new listings page
module.exports.getNewListings = (req,res)=>{
    res.render("./listings/newlist.ejs");
}

//reder the show listings
module.exports.showlisting = async (req,res)=>{
    const {id} = req.params;
    const data = await listing.findById(id).populate({ 
        path: 'reviews',
        populate: {
          path: 'author',
          model: 'User'
        } 
     }).populate("owner");
    if(!data){
        req.flash("error","Listing you requested for does not exist!!");
        res.redirect("/listings"); 
    }
    res.render("./listings/show.ejs",{data});
}

//accept the post request to add new listings
module.exports.postNewListings = async(req,res,next)=>{
    const list = new listing(req.body.list);
    let url = req.file.path;
    let filename = req.file.filename;
    //passport has the information of the user so we assigning the userid to the owner of listings
    list.owner = req.user._id;
    list.image = {url,filename};
    await list.save();
    req.flash("success","New listing is created");
    res.redirect("/listings");
}

//form page to edit the listings 
module.exports.getEditListings = async(req,res)=>{
    let {id} = req.params;
    const data = await listing.findById(id);
    if(!data){
       req.flash("error","Listing you requested for does not exist!!");
       res.redirect("/listings"); 
    }
    const originalImg = data.image.url;
    const newImgUrl =originalImg.replace("/upload","/upload/h_250,w_300");
    //originalImg.replace
    res.render("./listings/edit.ejs",{data,newImgUrl});
}

//updating the listings
module.exports.putEditListings = async(req,res)=>{
    //console.log(req.file);
    let {id} = req.params;
    const list = req.body.list;
    const updatelist =await listing.findByIdAndUpdate(id,list);
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updatelist.image = {url,filename};
        await updatelist.save();
    }
    
    
    req.flash("success","Listing Updated !!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroylistings = async(req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Deleted listing !!");
    res.redirect("/listings");
}