import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitBid } from '../../redux/slices/bidSlice';

const BidForm = ({ gigId, onSuccess }) => {
  const [formData, setFormData] = useState({
    message: '',
    price: ''
  });

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.bids);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(submitBid({
      gigId,
      ...formData,
      price: Number(formData.price)
    }));
    
    if (result.type === 'bids/submitBid/fulfilled') {
      setFormData({ message: '', price: '' });
      onSuccess?.();
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h4 className="font-semibold mb-3">Submit Your Bid</h4>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Your Proposal
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows="3"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Explain why you're the best fit for this project..."
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Your Price ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., 450"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium text-sm disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit Bid'}
        </button>
      </form>
    </div>
  );
};

export default BidForm;