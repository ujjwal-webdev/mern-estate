import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
    try
    {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing)
    }
    catch (err)
    {
        next(err)
    }
}

export const getUserListings = async (req, res, next) => {

    if(req.params.id !== req.user.id)
    {
        return next(errorHandler(401, "You can only view your own listings"))
    }

    try
    {
        const listings = await Listing.find({ userRef: req.params.id });
        return res.status(200).json(listings)
    }
    catch (err)
    {
        next(err)
    }
}

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if(!listing)
    {
        return next(errorHandler(404, "Listing not found"))
    }
    if(req.user.id !== listing.userRef)
    {
        return next(errorHandler(401, "You can only delete your own listings"))
    }

    try
    {
        await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json("Listing deleted successfully")
    }
    catch (err)
    {
        next(err)
    }
}