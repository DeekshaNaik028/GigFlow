const Gig = require('../models/Gig');

// @desc    Get all gigs (with optional search)
// @route   GET /api/gigs
// @access  Public
const getGigs = async (req, res) => {
  try {
    const { search, status = 'open' } = req.query;
    
    let query = { status };

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    console.error('Get gigs error:', error);
    res.status(500).json({ message: 'Server error fetching gigs' });
  }
};

// @desc    Get single gig
// @route   GET /api/gigs/:id
// @access  Public
const getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('ownerId', 'name email');

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    res.json(gig);
  } catch (error) {
    console.error('Get gig error:', error);
    res.status(500).json({ message: 'Server error fetching gig' });
  }
};

// @desc    Create new gig
// @route   POST /api/gigs
// @access  Private
const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    // Validation
    if (!title || !description || !budget) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id
    });

    const populatedGig = await Gig.findById(gig._id)
      .populate('ownerId', 'name email');

    res.status(201).json(populatedGig);
  } catch (error) {
    console.error('Create gig error:', error);
    res.status(500).json({ message: 'Server error creating gig' });
  }
};

// @desc    Update gig
// @route   PUT /api/gigs/:id
// @access  Private
const updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check ownership
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this gig' });
    }

    const { title, description, budget } = req.body;

    gig.title = title || gig.title;
    gig.description = description || gig.description;
    gig.budget = budget || gig.budget;

    const updatedGig = await gig.save();
    const populatedGig = await Gig.findById(updatedGig._id)
      .populate('ownerId', 'name email');

    res.json(populatedGig);
  } catch (error) {
    console.error('Update gig error:', error);
    res.status(500).json({ message: 'Server error updating gig' });
  }
};

// @desc    Delete gig
// @route   DELETE /api/gigs/:id
// @access  Private
const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check ownership
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this gig' });
    }

    await gig.deleteOne();
    res.json({ message: 'Gig removed' });
  } catch (error) {
    console.error('Delete gig error:', error);
    res.status(500).json({ message: 'Server error deleting gig' });
  }
};

// @desc    Get user's gigs
// @route   GET /api/gigs/my/gigs
// @access  Private
const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user._id })
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    console.error('Get my gigs error:', error);
    res.status(500).json({ message: 'Server error fetching your gigs' });
  }
};

module.exports = {
  getGigs,
  getGig,
  createGig,
  updateGig,
  deleteGig,
  getMyGigs
};