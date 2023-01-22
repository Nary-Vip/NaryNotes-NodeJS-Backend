const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const notesSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            default: "Employee",
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        },

    },
    {
        timestamps: true
    }
);

notesSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_sequenceL: 1
});

module.exports = mongoose.model('userNote', notesSchema);