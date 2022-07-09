import { DetailedHTMLProps, HTMLAttributes } from "react";

const Card = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
  const { children } = props;

  return (
    <div
      {...props}
      className={[
        "py-8 px-4 bg-gray-800 shadow-xl sm:px-10 sm:rounded-lg ",
        props.className,
      ].join(" ")}
    >
      <div
        {...props}
        className={[
          "flex flex-col justify-center animate-fade-in",
          props.className,
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
};

export default Card;
