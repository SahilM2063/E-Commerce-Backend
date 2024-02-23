const Color = require("../models/Color");
const asyncHandler = require("express-async-handler");


// @desc = Create Color
// @route = POST /api/v1/colors
// @access = Private/Admin

const createColor = asyncHandler(async (req, res) => {
    const { name } = req.body;

    // fetch color if exists
    const colorExist = await Color.findOne({ name });

    // check if color existed or return
    if (colorExist) {
        throw new Error('Color already exists');
    } else {
        // create color
        const color = await Color.create({
            name: name.toLowerCase(),
            user: req.userAuthId
        });

        res.status(201).json({
            status: "success",
            message: "Color created successfully",
            color
        })
    }
})

// @desc = Get all colors
// @route = GET /api/v1/colors/getALl
// @access = Public

const getAllColors = asyncHandler(async (req, res) => {
    const colors = await Color.find({});

    res.status(200).json({
        status: "success",
        colors
    })
})


// @desc = Get Single Color
// @route = GET /api/v1/colors/:id
// @access = Public

const getSingleColor = asyncHandler(async (req, res) => {
    const color = await Color.findById(req.params.id);
    if (!color) {
        throw new Error('Color not found');
    } else {
        res.status(200).json({
            status: "success",
            color
        })
    }
})

// @desc = Update Color
// @route = PUT /api/v1/colors/:id
// @access = Private/Admin

const updateColor = asyncHandler(async (req, res) => {
    const color = await Color.findById(req.params.id);
    if (!color) {
        throw new Error('Color not found');
    } else {
        const { name } = req.body;
        const color = await Color.findByIdAndUpdate(req.params.id, {
            name
        }, { new: true });
        res.status(200).json({
            status: "success",
            message: "Color updated successfully",
            color
        })
    }
})

// @desc = Delete Color
// @route = DELETE /api/v1/colors/:id
// @access = Private/Admin

const deleteColor = asyncHandler(async (req, res) => {
    const color = await Color.findById(req.params.id);
    if (!color) {
        throw new Error('Color not found');
    } else {
        await Color.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: "success",
            message: "Color deleted successfully"
        })
    }
});


module.exports = { createColor, getAllColors, getSingleColor, updateColor, deleteColor };