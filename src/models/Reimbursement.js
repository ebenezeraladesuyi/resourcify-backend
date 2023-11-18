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
      _id: { type: Schema.Types.ObjectId, auto: true }, 
      sender: {
        type: { type: String, enum: ['Organization', 'Employee'] },
        data: { type: Schema.Types.ObjectId, refPath: 'comments.sender.type', required: true },
      },
      message: {type: String, required: true},
      date: {type: Date, default: Date.now, immutable: true}
    }],
    items: [{
      _id: { type: Schema.Types.ObjectId, auto: true }, 
      name: { type: String, required: true },
      content: {type: String },
      type: {type: Schema.Types.ObjectId, ref: "CustomItemType"},
      imgUrl: {type: String},
      amount: {type: String, required: true },
      comments: [{
        _id: { type: Schema.Types.ObjectId, auto: true }, 
        sender: {
          type: { type: String, enum: ['Organization', 'Employee'] },
          data: { type: Schema.Types.ObjectId, refPath: 'items.comments.sender.type', required: true },
        },
        message: {type: String, required: true},
        date: {type: Date, default: Date.now, immutable: true}
      }],
    }],
    totalAmount: {type: String, default: "0"}
  },
  {
    versionKey: false,
    timestamps: true,
  }
);


reimbursementSchema.pre("save", function (next) {
  const totalAmount = this.items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  this.totalAmount = totalAmount.toString();

  this.updatedAt = Date.now();
  next();
});


commentSchema= new Schema({
  comment: { type: String, required: true },
  sender: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'docModel'
  },
  date: {type: Date, default: Date.now, immutable: true}
  docModel: {
    type: String,
    required: true,
    enum: ['Organization', 'Employee']
  }
})


const Reimbursement = model("Reimbursement", reimbursementSchema);
const Comment = model("Comment", commentSchema);
module.exports = {
  Reimbursement,
  Comment,
  requestState
};
