const fs = require("fs");
const Vehicle = require("../models/Vehicle");
const cloudinary = require("../config/cloudinary");

/*
========================================
ADD VEHICLE
========================================
*/
exports.addVehicle = async (req, res) => {
  try {
    const {
      vehicleNumber,
      name,
      type,
      brand,
      model,
      fuelType,
      transmission,
      pricePerDay,
      image,
    } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    if (!vehicleNumber || !name || !type || !brand || !pricePerDay) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const exists = await Vehicle.findOne({ vehicleNumber });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Vehicle number already exists",
      });
    }

    let imageUrl = image || "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "rentigo-vehicles",
      });

      imageUrl = result.secure_url;

      fs.unlinkSync(req.file.path);
    }

    const vehicle = await Vehicle.create({
      vehicleNumber,
      name,
      type,
      brand,
      model,
      fuelType,
      transmission,
      pricePerDay,
      image: imageUrl,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
GET ALL VEHICLES
========================================
*/
exports.getVehicles = async (req, res) => {
  try {
    const filter = {};

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.brand) {
      filter.brand = req.query.brand;
    }

    const vehicles = await Vehicle.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
GET SINGLE VEHICLE
========================================
*/
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate(
      "owner",
      "name email",
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
UPDATE VEHICLE
========================================
*/
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    if (
      vehicle.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const updateData = {
      ...req.body,
      owner: vehicle.owner,
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "rentigo-vehicles",
      });

      updateData.image = result.secure_url;

      fs.unlinkSync(req.file.path);
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle: updatedVehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
DELETE VEHICLE
========================================
*/
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    if (
      vehicle.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await vehicle.deleteOne();

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
GET OWNER VEHICLES
========================================
*/
exports.getOwnerVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
