const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');

// @desc    Submit a bid
// @route   POST /api/bids
// @access  Private
const submitBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    // Validation
    if (!gigId || !message || !price) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Check if gig exists and is open
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({ message: 'This gig is no longer accepting bids' });
    }

    // Check if user is not the gig owner
    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot bid on your own gig' });
    }

    // Check if user already submitted a bid
    const existingBid = await Bid.findOne({ 
      gigId, 
      freelancerId: req.user._id 
    });

    if (existingBid) {
      return res.status(400).json({ message: 'You have already submitted a bid for this gig' });
    }

    // Create bid
    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title');

    res.status(201).json(populatedBid);
  } catch (error) {
    console.error('Submit bid error:', error);
    res.status(500).json({ message: 'Server error submitting bid' });
  }
};

// @desc    Get all bids for a gig
// @route   GET /api/bids/:gigId
// @access  Private (Gig owner only)
const getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    // Check if gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is the gig owner
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view bids for this gig' });
    }

    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error('Get bids error:', error);
    res.status(500).json({ message: 'Server error fetching bids' });
  }
};

// @desc    Hire a freelancer (ATOMIC OPERATION with Transaction)
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (Gig owner only)
const hireBid = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.startTransaction();

    const { bidId } = req.params;

    // Find the bid with session
    const bid = await Bid.findById(bidId).populate('gigId').session(session);
    
    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Bid not found' });
    }

    const gig = bid.gigId;

    // Check if user is the gig owner
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({ message: 'Not authorized to hire for this gig' });
    }

    // Check if gig is still open
    if (gig.status !== 'open') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'This gig has already been assigned' });
    }

    // ATOMIC OPERATIONS:
    // 1. Update the gig status to 'assigned'
    gig.status = 'assigned';
    await gig.save({ session });

    // 2. Mark the chosen bid as 'hired'
    bid.status = 'hired';
    await bid.save({ session });

    // 3. Mark all other bids for this gig as 'rejected'
    await Bid.updateMany(
      { 
        gigId: gig._id, 
        _id: { $ne: bidId },
        status: 'pending'
      },
      { status: 'rejected' },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();

    // Populate the bid for response
    const populatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title description budget');

    // Send real-time notification to the hired freelancer
    const io = req.app.get('io');
    io.to(bid.freelancerId._id.toString()).emit('hired', {
      message: `You have been hired for "${gig.title}"!`,
      gigTitle: gig.title,
      gigId: gig._id,
      bidId: bid._id
    });

    res.json({
      message: 'Freelancer hired successfully',
      bid: populatedBid
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Hire bid error:', error);
    res.status(500).json({ message: 'Server error during hiring process' });
  } finally {
    session.endSession();
  }
};

// @desc    Get user's bids
// @route   GET /api/bids/my/bids
// @access  Private
const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate('gigId', 'title description budget status')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({ message: 'Server error fetching your bids' });
  }
};

module.exports = {
  submitBid,
  getBidsForGig,
  hireBid,
  getMyBids
};