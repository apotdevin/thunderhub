exports.getIp = req => {
  if (!req || !req.headers) {
    return "";
  }
  const forwarded = req.headers["x-forwarded-for"];
  const before = forwarded
    ? forwarded.split(/, /)[0]
    : req.connection.remoteAddress;
  const ip = process.env.NODE_ENV === "development" ? "1.2.3.4" : before;
  return ip;
};
