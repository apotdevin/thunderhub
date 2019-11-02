const { createLogger, format, transports } = require("winston");
const path = require("path");
require("dotenv").config();

const combinedFormat =
  process.env.NODE_ENV === "development"
    ? format.combine(
        format.label({
          label: path.basename(
            process && process.mainModule ? process.mainModule.filename : ""
          )
        }),
        format.colorize(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(
          (info: any) =>
            `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
        )
      )
    : format.combine(
        format.label({
          label: path.basename(
            process && process.mainModule ? process.mainModule.filename : ""
          )
        }),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(
          (info: any) =>
            `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
        )
      );

exports.logger = createLogger({
  level: process.env.LOG_LEVEL || "silly",
  format: combinedFormat,
  transports: [new transports.Console()]
});
