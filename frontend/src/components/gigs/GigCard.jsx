import { useState } from 'react';
import { useSelector } from 'react-redux';
import BidForm from '../bids/BidForm';

const GigCard = ({ gig }) => {
  const [showBidForm, setShowBidForm] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isOwner = user?._id === gig.ownerId._id;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-900">{gig.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          gig.status === 'open' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {gig.status}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{gig.description}</p>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-500">Budget</p>
          <p className="text-2xl font-bold text-indigo-600">${gig.budget}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Posted by</p>
          <p className="text-sm font-medium text-gray-900">{gig.ownerId.name}</p>
        </div>
      </div>

      {isAuthenticated && !isOwner && gig.status === 'open' && (
        <>
          <button
            onClick={() => setShowBidForm(!showBidForm)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-medium"
          >
            {showBidForm ? 'Cancel Bid' : 'Submit Bid'}
          </button>
          
          {showBidForm && (
            <div className="mt-4">
              <BidForm gigId={gig._id} onSuccess={() => setShowBidForm(false)} />
            </div>
          )}
        </>
      )}

      {isOwner && (
        <p className="text-sm text-gray-500 text-center italic">
          You posted this gig
        </p>
      )}
    </div>
  );
};

export default GigCard;