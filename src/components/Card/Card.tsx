import { DetailedHTMLProps, HTMLAttributes } from "react";

const Card = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
  const { children } = props;

  return (
    <div className="py-8 px-4 bg-gray-800 border-t border-b border-gray-700 shadow sm:px-10 sm:rounded-lg sm:border-r sm:border-l">
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
