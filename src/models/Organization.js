const mongoose = require("mongoose");
const { Schema, model, Types, SchemaType } = mongoose;

const organizationSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, uppercase: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    employees: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
    customItemTypes: [{ type: Schema.Types.ObjectId, ref: "CustomItemType" }],
    policies: {
      reimbusmentLimit: String,
    },
    accounts: [{
      _id: { type: Schema.Types.ObjectId, auto: true }, 
      bankName: {type: String, uppercase: true},
      accountName: {type: String, uppercase: true, required: true},
      accountNumber: {type: Number, unique: true, required: true}
    }],
    cards: [{
      _id: { type: Schema.Types.ObjectId, auto: true }, 
      cardName: {type: String, uppercase: true, required: true},
      cardNumber: {type: Number, unique: true, required: true},
      expiry: {type: String, required: true}
    }],
    walletBalance: {type: Number, default: 0},
    createdAt: { type: Date, default: () => Date.now(), immutable: true },
    updatedAt: Date
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

organizationSchema.pre("save", async function (next) {
  const user = this;
  user.updatedAt = Date.now();
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
  description: { type: String },
  organization: { type: Schema.Types.ObjectId, ref: "Organization" },
  createdAt: { type: Date, default: () => Date.now(), immutable: true },
  updatedAt: Date
})

organizationSchema.methods.comparePassword = async function (userpassword) {
  const isMatch = await bcrypt.compare(userpassword, this.password);
  return isMatch;
};

const Organization = model("Organization", organizationSchema);
const CustomItemType = model("CustomItemType", customItemTypeSchema);
module.exports = 
{
  Organization,
  CustomItemType
}
