import { NextApiRequest } from "next";

export const getIpFromRequest = (req: NextApiRequest) => {
  const forwarded = req.headers["x-forwarded-for"] as string;
  const ip =
    forwarded.split(",").pop() ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress;

  return ip;
};
