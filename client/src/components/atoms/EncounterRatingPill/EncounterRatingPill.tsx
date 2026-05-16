export type EncounterRating =
  | "trivial"
  | "easy"
  | "medium"
  | "hard"
  | "extreme";

type EncounterRatingOrUnavailable = EncounterRating | "unavailable";

type Props = {
  rating: EncounterRatingOrUnavailable;
};

export const EncounterRatingPill = ({ rating }: Props) => {
  const getRatingColor = (rating: EncounterRatingOrUnavailable) => {
    if (rating === "trivial")
      return { bg: "bg-ratings-trivial", font: "text-typography-900" };
    else if (rating === "easy")
      return { bg: "bg-ratings-easy", font: "text-typography-900" };
    else if (rating === "medium")
      return { bg: "bg-ratings-medium", font: "text-typography-900" };
    else if (rating === "hard")
      return { bg: "bg-ratings-hard", font: "text-typography-50" };
    else if (rating === "extreme")
      return { bg: "bg-ratings-extreme", font: "text-typography-50" };
    else return { bg: "bg-ratings-unavailable", font: "text-typography-900" };
  };

  const ratingColorConfig = getRatingColor(rating);
  const capitalisedRating = rating.charAt(0).toUpperCase() + rating.slice(1);

  return (
    <div
      className={`${ratingColorConfig.bg} ${ratingColorConfig.font} min-w-24 w-fit py-1 px-2 rounded-xl flex justify-center`}
    >
      <p>{capitalisedRating}</p>
    </div>
  );
};
