const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;
const bcrypt = require("bcrypt");

const employeeSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    organizationCode: { type: String, required: true },
    role: { type: String, required: true, default: "Staff" },
    reimbursementRequests: [
      {
        type: Types.ObjectId,
        ref: "Reimbursement",
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
    },
    versionKey: false,
    timestamps: true,
  }
);

employeeSchema.pre("save", async function (next) {
  const user = this;
  if (!this.isModified("password")) {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

employeeSchema.methods.comparePassword = async function (userpassword) {
  const isMatch = await bcrypt.compare(userpassword, this.password);
  return isMatch;
};

const Employee = model("Employee", employeeSchema);
module.exports = Employee;
