const userDb = require("../models/userSchema");
const productDb = require("../models/productSchema");
const categoryDb = require("../models/categorySchema");
const bannerDb = require('../models/bannerSchema')
const brandDb = require('../models/brandSchema')
const couponDb = require('../models/couponSchema')
const sharp = require("sharp");

exports.adminLogin = (req, res) => {
  res.redirect(302, "/admin");
};

exports.adminLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/admin");
  });
};


//ADMIN BLOCK_UNBLOCK CONTROLLER
exports.adminBlockUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await userDb.findByIdAndUpdate(userId, { isBlocked: true });
    return res.json({ success: true });
  } catch (err) {
    console.error("Error Updating data from Mongoose", err);
    res.status(500).send("Internal Server Error");
  }
};
exports.adminUnBlockUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await userDb.findByIdAndUpdate(userId, { isBlocked: false });
    return res.json({ success: true });
  } catch (err) {
    console.error("Error Updating data from Mongoose", err);
    res.status(500).send("Internal Server Error");
  }
};

//ADMIN DELETE USER CONTROLLER
exports.adminDeleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await userDb.findByIdAndRemove(userId);
    res.json({ success: true });
  } catch (err) {
    console.error("Error Deleting  data from Mongoose", err);
    res.status(500).send("Internal Server Error");
  }
};

// ADMIN NEW PRODUCT
exports.adminAddProduct = async (req, res) => {
    try {
      const { productName, category, price, stock, description, brandName } = req.body;
        const resizeImage = async (inputPath, outputPath, width, height) => {
          await sharp(inputPath)
            .resize(width, height, {
              fit: "contain",
              background: { r: 255, g: 255, b: 255, alpha: 1 },
            })
            .toFile(outputPath);
        };
      const images = req.files.map((file) => {
        const inputPath = file.path;
        const outputPath = "uploads/resized/" + file.filename;
        resizeImage(inputPath, outputPath, 600, 600);
        return file.filename;
      });
      await productDb.create({
        productName: productName,
        category: category,
        brand:brandName,
        price: price,
        stock: stock,
        description: description,
        image: images,
        listed:false
      });
      res.json({success:true ,message:"Product added successfully"});
    } catch (err) {
      console.error("Error creating new product:", err);
      res.status(500).send('Internal server error');
    }
};
  

//ADMIN UPDATE PRODUCT
exports.adminUpdateProduct = async (req, res) => {
  try {
    const productId = req.query.productId;
    const { productName, category, price, stock, description, brandName } = req.body;

    const resizeImage = async (inputPath, outputPath, width, height) => {
      await sharp(inputPath)
        .resize(width, height, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .toFile(outputPath);
    };

    const newImages = req.files.map((file) => {
      const inputPath = file.path;
      const outputPath = 'uploads/resized/' + file.filename;
      resizeImage(inputPath, outputPath, 500, 500);
      return file.filename;
    });

    const updatedProduct = await productDb.findByIdAndUpdate(
      productId,
      {
        $push: { image: { $each: newImages } },
        $set: {
          productName: productName,
          category: category,
          brand: brandName,
          price: price,
          stock: stock,
          description: description,
          listed: false,
        },
      },
      { new: true }
    );

    res.status(201).json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).send("Internal Server Error");
  }
};

  //PRODUCT LISTED UNLISTED CONTROLLER
  exports.adminListProduct = async (req, res) => {
    const productId = req.params.id;
    try {
      await productDb.findByIdAndUpdate(productId, { listed: true });
      return res.json({ success: true });
    } catch (err) {
      console.error("Error Listing data from Mongoose", err);
      res.status(500).send("Internal Server Error");
    }
  };
  exports.adminUnListProduct = async (req, res) => {
    const productId = req.params.id;
    try {
      await productDb.findByIdAndUpdate(productId, { listed: false });
      return res.json({ success: true });
    } catch (err) {
      console.error("Error Unlisting data from Mongoose", err);
      res.status(500).send("Internal Server Error");
    }
  };


  //PRODUCT DELETE IMAGE
  exports.deleteProductImage = async (req, res) => {
    const productId = req.query.productId
    const imageUrl = req.query.imageUrl
    try {
      await productDb.updateOne(
        { _id: productId },
        { $pull: { image: imageUrl } });
        return res.json({success:true});
    }
    catch (err) {
      console.error("Error Deleting Image  from Mongoose", err);
      res.status(500).send("Internal Server Error");
    }

  }


//ADD CATEGORY
exports.adminAddCategory = async (req, res) => {
  const { category } = req.body;
  try {
    // Convert the entered category name to lowercase and remove spaces
    const formattedCategory = category.toLowerCase().replace(/\s+/g, "");

    // Find all categories in the database
    const categories = await categoryDb.find().exec();

    // Check if a category with the same name already exists in the database
    const existingCategory = categories.find((cat) =>
      cat.category.toLowerCase().replace(/\s+/g, "") === formattedCategory
    );
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = await categoryDb.create({ category });
    res.status(201).json({ category: newCategory, message: "Category added successfully" });
  } catch (err) {
    console.error("Error creating new Category:", err);
    res.status(500).send("Internal Server Error");
  }
};


  //UPDATE CATEGORY
  exports.adminUpdateCategory = async (req, res) => {
    const categoryId = req.query.categoryId;
    const { category } = req.body
    try {
      const updatedCategory = await categoryDb.findByIdAndUpdate(
        categoryId,
        {
          $set: {
            category: category,
          },
        },
        { new: true }
      );
      res.status(201).json(updatedCategory);
    } catch (err) {
      console.error("Error Updating Category:", err);
      res.status(500).send("Internal Server Error");
    }
  }


// ADMIN NEW BANNER
exports.adminAddBanner = async (req, res) => {
  try {
    const { title } = req.body;
    const resizeImage = async (inputPath, outputPath, width, height) => {
      await sharp(inputPath)
        .resize(width, height, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .toFile(outputPath);
    };
    const images = req.files.map((file) => {
      const inputPath = file.path;
      const outputPath = "uploads/resized/" + file.filename;
      resizeImage(inputPath, outputPath, 1000, 500);
      return file.filename;
    });
    const newBanner = await bannerDb.create({
      title:title,
      image: images,
      
    });
    res.status(201).json(newBanner);
  } catch (err) {
    console.error("Error creating new Banner:", err);
    res.status(500).send("Internal Server Error");
  }
};

//ADMIN DELETE BANNER
exports.deleteBanner = async (req, res) => {
  const bannerId = req.params.id
  try {
    await bannerDb.findByIdAndDelete(bannerId)
    res.json({success:true})
  } catch (err) {
    console.error("Error deleting banner from mongDb ");
    res.status(500).send("Internal Server Error")
  }
}


//ADMIN ADD BRAND
exports.adminAddBrand = async (req, res) => {
  const { name, category } = req.body
  try {
    const newBrand = await brandDb.create({
      brandName: name,
      category: category,
    });
    res.json(newBrand)
  } catch (err) {
    console.error("Error adding new Brand in mongodb");
    res.status(500).send("Internal Server Error")
  }
}

//ADMIN DELETE BRAND 
exports.deleteBrand = async (req, res) => {
  const brandId = req.params.id;
  try {
      const brandExists = await productDb.find({ brand: brandId });
      if (brandExists.length > 0) {
        //IF CATEGORY DELETED THEN BLOCK THE PRODUCT
        await productDb.updateMany(
          { brand: brandId },
          { $set: { listed: true } }
        );
      }
    await brandDb.findByIdAndDelete(brandId);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting Brand from mongDb ");
    res.status(500).send("Internal Server Error");
  }
}
//ADMIN ADD COUPON
exports.addCoupon = async (req, res) => {
  try {
    const { code, discount, description, expiryDate,minAmount,maxAmount } = req.body;

    // Validate expiry date
    if (new Date(expiryDate) < new Date()) {
      return res.status(400).json({ message: "Enter valid expiry date" });
    }
    // Validate discount amount
    if (discount < 0) {
      return res.status(400).json({ message: "Enter valid discount amount" });
    }
    await couponDb.create({
      code,
      discount,
      description,
      expiryDate,
      minAmount,
      maxAmount,
    });

    // Send success response
    res.status(201).json({ message: "Coupon added successfully" });
  } catch (error) {
    console.error(error);

    // Send error response
    res.status(500).json({ message: "Error adding coupon. Please try again." });
  }
};


// Activate or deactivate coupon
exports.adminActivationCoupon = async (req, res) => {
  try {
    const couponId = req.params.id;
    const action = req.params.action;
    // Determine the value to set for isActive based on the action
    const isActive = action === "activate";
    await couponDb.updateOne({ _id: couponId }, { isActive });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server error");
  }
};

// Delete coupon
exports.adminDeleteCoupon = async (req, res) => {
  try {
    const couponId = req.params.id;
    await couponDb.findByIdAndDelete(couponId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server error");
  }
};
