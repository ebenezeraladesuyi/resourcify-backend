const mongoose = require("mongoose");
const { Schema, model, Types, SchemaType } = mongoose;

const transactionSchema = new Schema({
    transactionType: {
        type: String,
        required: true,
        enum: ['Reimbursement', 'Top Up', 'Widthrawal']
    },
    requestId: {type: Schema.Types.ObjectId, ref: 'Reimbursment'},
    date: {type: Date, default: Date.now},
    card: {type: String},
    account: {type: String },

})


const Transaction = model('Transaction', transactionSchema);

module.exports = Transaction;
