const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const organizationSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    employees: [{ type: Types.ObjectId, ref: "Employee" }],

    policies: {
      reimbusmentLimit: Number,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Organization = model("Organization", organizationSchema);
module.exports = Organization;
