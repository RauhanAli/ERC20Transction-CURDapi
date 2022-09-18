const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});
module.exports = mongoose.model('transaction',TransactionSchema);