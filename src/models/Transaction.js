const mongoose = require("mongoose");
const { Schema, model, Types, SchemaType } = mongoose;

const transactionSchema = new Schema({
    transactionType: {
        type: String,
        required: true,
        enum: ['Reimbursement', 'Top Up', 'Widthrawal']
    },
    deduction: {type: Boolean, required: true},
    requestId: {type: Schema.Types.ObjectId, ref: 'Reimbursment'},
    date: {type: Date, default: Date.now},
    card: {type: String},
    account: {type: String },
    amount: {type: Number},
    employee: {type: Schema.Types.ObjectId, ref: 'Employee'},
    org: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, refPath: 'model'},
    model: {
        type: String,
        enum: ['Organization', 'Employee'],
        required: true,
    }

})


const Transaction = model('Transaction', transactionSchema);

module.exports = Transaction;
