"use-client";

interface RatingStarsProps {
  rating: number | null;
}
const RatingStars: React.FC<RatingStarsProps> = ({
    rating
}) => {

    var stars = [0];
    if (rating !== null && typeof rating === 'number') {
        for (var i = 1; i < rating; i++) {
            stars.push(i);
        }
    }
    return (
        <div className="flex flex-row">
            {stars.map((index, key) =>
                <div key={key}>
                    <svg key={key} className="w-4 h-4 text-rose-500 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                </div>
            )}
            <div className="w-1 self-center h-1 mx-1.5 bg-gray-500 rounded-full"></div>
            <div>

                <p className="ms-2 text-sm font-bold font-light text-neutral-500 text-center">{rating && Math.ceil(rating)}</p>
            </div>


        </div>
    )

}
export default RatingStars;
