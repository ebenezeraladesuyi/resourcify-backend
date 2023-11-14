const mongoose = require("mongoose");
const { Schema, model, Types, SchemaType } = mongoose;

const organizationSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, uppercase: true },
    email: { type: String, required: true, unique: true },
    employees: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
    customItemTypes: [{ type: Schema.Types.ObjectId, ref: "CustomItemType" }],
    policies: {
      reimbusmentLimit: Number,
    },
    createdAt: { type: Date, default: () => Date.now(), immutable: true },
    updatedAt: Date
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

organizationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

organizationSchema.pre("remove", function (next) {
  // remove all employees
  Employee.deleteMany({ organization: this._id }, next);
});

organizationSchema.pre("remove", function (next) {
  CustomItemType.deleteMany({ organization: this._id }, next);
});


const customItemTypeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  attributes: [
    {
      name: { type: String },
      type: { type: String },
    }
  ],
  organization: { type: Schema.Types.ObjectId, ref: "Organization" },
  createdAt: { type: Date, default: () => Date.now(), immutable: true },
  updatedAt: Date
})

const Organization = model("Organization", organizationSchema);
const CustomItemType = model("CustomItemType", customItemTypeSchema);
module.exports = Organization;
