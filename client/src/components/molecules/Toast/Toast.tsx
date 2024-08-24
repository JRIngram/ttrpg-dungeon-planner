type Props = {
  message: string;
};

export const Toast = ({ message }: Props) => {
  return (
    <div>
      <p>{message}</p>
    </div>
  );
};
