import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigs } from '../redux/slices/gigSlice';
import GigList from '../components/gigs/GigList';
import GigForm from '../components/gigs/GigForm';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showGigForm, setShowGigForm] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { gigs, isLoading } = useSelector((state) => state.gigs);

  useEffect(() => {
    dispatch(fetchGigs());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchGigs(searchTerm));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Browse Available Gigs
        </h1>
        
        <div className="flex gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Search gigs by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Search
            </button>
          </form>
          
          {isAuthenticated && (
            <button
              onClick={() => setShowGigForm(!showGigForm)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium whitespace-nowrap"
            >
              {showGigForm ? 'Cancel' : 'Post a Gig'}
            </button>
          )}
        </div>

        {showGigForm && isAuthenticated && (
          <div className="mb-6">
            <GigForm onSuccess={() => setShowGigForm(false)} />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No gigs available at the moment.</p>
          {isAuthenticated && (
            <p className="text-gray-400 dark:text-gray-500 mt-2">Be the first to post a gig!</p>
          )}
        </div>
      ) : (
        <GigList gigs={gigs} />
      )}
    </div>
  );
};

export default Home;