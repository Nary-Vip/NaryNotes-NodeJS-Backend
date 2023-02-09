const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const notesSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            default: "Employee",
            required: true
        },
        tags: {
            type: Array,
            required: true
        },
        color:{
            type: String,
            required: true
        }

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