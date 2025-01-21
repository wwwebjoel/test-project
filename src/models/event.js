import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  completed: { type: Boolean, required: false, default: false }, // Added new field
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;
