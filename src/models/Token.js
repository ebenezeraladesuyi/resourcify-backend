const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;
const jwt = require("jsonwebtoken");

const tokenSchema = new Schema(
  {
    userID: { type: Types.ObjectId },

    refreshToken: { type: String },
    accessToken: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

tokenSchema.methods.generateToken = function (payload, secret, signOptions) {
  return new Promise(function (resolve, reject) {
    jwt.sign(payload, secret, signOptions, (err, encoded) => {
      if (err === null && encoded !== undefined) {
        resolve(encoded);
      } else {
        reject(err);
      }
    });
  });
};
const Token = model("Token", tokenSchema);
module.exports = Token;
