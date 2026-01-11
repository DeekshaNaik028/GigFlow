import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyGigs } from '../redux/slices/gigSlice';
import { fetchBidsForGig, hireBid, clearSuccess } from '../redux/slices/bidSlice';

const MyGigs = () => {
  const dispatch = useDispatch();
  const { myGigs, isLoading: gigsLoading } = useSelector((state) => state.gigs);
  const { bids, isLoading: bidsLoading, successMessage } = useSelector((state) => state.bids);
  const [selectedGig, setSelectedGig] = useState(null);

  useEffect(() => {
    dispatch(fetchMyGigs());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
    }
  }, [successMessage, dispatch]);

  const handleViewBids = (gigId) => {
    setSelectedGig(gigId);
    dispatch(fetchBidsForGig(gigId));
  };

  const handleHire = async (bidId) => {
    if (window.confirm('Are you sure you want to hire this freelancer?')) {
      await dispatch(hireBid(bidId));
      dispatch(fetchMyGigs()); // Refresh gigs to update status
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {successMessage && (
        <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
          {successMessage}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">My Posted Gigs</h1>
        <p className="text-gray-600 mt-2">Manage your job postings and hire freelancers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gigs List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Gigs</h2>
          {gigsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : myGigs.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">You haven't posted any gigs yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myGigs.map((gig) => (
                <div
                  key={gig._id}
                  className={`bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                    selectedGig === gig._id ? 'ring-2 ring-indigo-500' : ''
                  }`}
                  onClick={() => handleViewBids(gig._id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{gig.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      gig.status === 'open' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {gig.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{gig.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-indigo-600">${gig.budget}</span>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                      View Bids →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bids List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {selectedGig ? 'Received Bids' : 'Select a gig to view bids'}
          </h2>
          
          {selectedGig ? (
            bidsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : bids.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No bids received yet for this gig.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {bids.map((bid) => (
                  <div
                    key={bid._id}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900">{bid.freelancerId?.name}</h4>
                        <p className="text-sm text-gray-500">{bid.freelancerId?.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        bid.status === 'hired' 
                          ? 'bg-green-100 text-green-800'
                          : bid.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bid.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{bid.message}</p>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-500">Proposed Price:</span>
                        <span className="ml-2 text-xl font-bold text-indigo-600">${bid.price}</span>
                      </div>
                      
                      {bid.status === 'pending' && (
                        <button
                          onClick={() => handleHire(bid._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium text-sm"
                        >
                          Hire
                        </button>
                      )}
                      
                      {bid.status === 'hired' && (
                        <span className="text-green-600 font-semibold">✓ Hired</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">Click on a gig to view its bids</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyGigs;