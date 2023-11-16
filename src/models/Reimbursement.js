const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const requestState = ["pending", "under review", "approved", "denied"];

const reimbursementSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: requestState[0] },
    ownerId: { type: Schema.Types.ObjectId, ref: "Employee" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    comments: [{
      sender: {type: Schema.Types.Mixed, required: true},
      message: {type: String, required: true},
      date: {type: Date, default: Date.now, immutable: true}
    }],
    items: [{
      name: { type: String, required: true },
      content: {type: String },
      type: {type: Schema.Types.ObjectId, ref: "CustomItemType"},
      amount: {type: String, required: true },
      comments: [{
        sender: {type: Schema.Types.Mixed, required: true},
        message: {type: String, required: true},
        date: {type: Date, default: Date.now, immutable: true}
      }],
    }],
    totalAmount: {type: String}
  },
  {
    versionKey: false,
    timestamps: true,
  }
);


reimbursementSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});


const Reimbursement = model("Reimbursement", reimbursementSchema);
module.exports = {
  Reimbursement,
  requestState
};
