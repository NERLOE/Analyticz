import Card from "@components/Card/Card";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  title: string;
  keyTitle: string;
  valueTitle: string;
  highestValue: number;
  list: {
    title: string;
    link?: string;
    value: number;
    icon?: string | null;
  }[];
}

const StatsCard = ({
  title,
  keyTitle,
  valueTitle,
  list,
  highestValue,
}: Props) => {
  return (
    <Card>
      <h3 className="font-bold text-gray-100">{title}</h3>
      <div className="flex items-center justify-between mt-3 mb-2 text-xs font-bold tracking-wide text-gray-400">
        <span>{keyTitle}</span>
        <span className="text-right">
          <span className="inline-block w-30">{valueTitle}</span>
        </span>
      </div>
      {list.map((data) => {
        return (
          <div
            key={data.title}
            className="flex items-center justify-between my-1 text-sm"
          >
            <a
              className="w-full relative"
              style={{ maxWidth: "calc(100% - 5rem)" }}
              target={"_blank"}
              rel="noreferrer"
              href={data.link}
            >
              <div
                className="absolute top-0 left-0 h-full bg-gray-750 bg-opacity-50"
                style={{
                  width: (data.value / highestValue) * 100 + "%",
                }}
              />
              <span className="flex px-2 py-1.5 group text-gray-300 relative z-9 break-all">
                <span className="block md:truncate group-hover:underline">
                  {data.icon && (
                    <img
                      className="inline h-4 w-4 mr-2 -mt-px align-middle"
                      alt={data.title}
                      src={data.icon}
                    />
                  )}
                  {data.title}
                </span>
                <span className="hidden group-hover:block absolute -right-5">
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    className="inline w-4 h-4 ml-1 -mt-1 text-gray-400"
                  />
                </span>
              </span>
            </a>

            <span className="font-medium text-gray-200 w-20 text-right">
              {data.value}
            </span>
          </div>
        );
      })}
    </Card>
  );
};

export default StatsCard;
