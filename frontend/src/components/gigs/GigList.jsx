import GigCard from './GigCard';

const GigList = ({ gigs }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {gigs.map((gig) => (
        <GigCard key={gig._id} gig={gig} />
      ))}
    </div>
  );
};

export default GigList;