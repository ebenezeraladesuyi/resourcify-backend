const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const reimbursementSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    status: { type: String },
    userId: { type: Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    comments: [{
      sender: {type: Schema.Types.Mixed, required: true}
      message: {Type: String, required: true}
      date: {type: Date, default: Date.now, immutable: true}
    }],
    items: [{
      name: { type: String, required: true },
      content: {type: String },
      type: {type: Schema.Types.ObjectId, ref: "CustomItemType"},
      amount: {type: String, required: true }
      comments: [{
        sender: {type: Schema.Types.Mixed, required: true}
        message: {Type: String, required: true}
        date: {type: Date, default: Date.now, immutable: true}
      }],
    }]
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
module.exports = Reimbursement;
