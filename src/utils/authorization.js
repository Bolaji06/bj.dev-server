import jwt from "jsonwebtoken";
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function authorization(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) {
    return res.status(401).json({ message: "authorization header missing" });
  }
  const headerToken = header.split(" ")[1];

  if (!headerToken) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorize: token is missing" });
  }

  jwt.verify(headerToken, process.env.JWT_TOKEN, (err, decoded) => {
    if (err) {
      console.log(err.message);
      return res.status(403).json({ success: false, message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}
