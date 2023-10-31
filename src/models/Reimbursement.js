const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const reimbursementSchema = new Schema(
  {
    request: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Reimbursement = model("Reimbursement", reimbursementSchema);
module.exports = Reimbursement;
