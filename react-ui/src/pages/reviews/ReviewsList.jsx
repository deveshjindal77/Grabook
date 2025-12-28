import ReviewItem from "./ReviewItem";

const ReviewsList = ({ reviews, user }) => {
  if (!reviews || reviews.length === 0) {
    return <p>No reviews yet.</p>;
  }

  return (
    <>
      {reviews.map((rev, index) => (
        <ReviewItem key={index} review={rev} user={user} />
      ))}
    </>
  );
};

export default ReviewsList;
