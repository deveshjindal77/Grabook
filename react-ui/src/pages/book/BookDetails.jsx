const BookDetails = ({ book, showSeller }) => {
  return (
    <div className="details col-10">
      <p className="details_price">
        Price : <i className="fa fa-inr" /> {book.price}
      </p>

      <p className="details">{book.title}</p>
      <p className="details">Date of Post : {book.date_of_post}</p>
      <p className="details">ISBN : {book.ISBN}</p>
      <p className="details">Author : {book.author}</p>
      <p className="details">Genre : {book.genre}</p>
      <p className="details">Year of Publication : {book.year_of_publication}</p>
      <p className="details">Place : {book.place}</p>
      <p className="details">Description : {book.description}</p>

      {showSeller && (
        <>
          <p className="seller_heading">Seller :</p>
          <a className="seller_link" href="/ratings_reviews">
            <div className="row-2107">
              <div className="col-2">
                <img
                  className="rounded-circle"
                  src="/static/css/profile_pic.png"
                  alt=""
                  width="40"
                  height="40"
                />
              </div>
              <div className="col-4 seller_name">
                <p className="seller_link_name">{book.seller_user_name}</p>
              </div>
            </div>
          </a>
        </>
      )}
    </div>
  );
};

export default BookDetails;
