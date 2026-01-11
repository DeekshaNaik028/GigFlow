const express = require('express');
const {
  getGigs,
  getGig,
  createGig,
  updateGig,
  deleteGig,
  getMyGigs
} = require('../controllers/gigController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getGigs);
router.get('/my/gigs', protect, getMyGigs);
router.get('/:id', getGig);
router.post('/', protect, createGig);
router.put('/:id', protect, updateGig);
router.delete('/:id', protect, deleteGig);

module.exports = router;