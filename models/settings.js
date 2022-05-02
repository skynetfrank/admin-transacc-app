import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    cambioDiaAdmin: { type: Number, default: 1, required: false },
    modo: { type: String, default: 'divisas', required: false },
  },
  {
    timestamps: true,
  }
);
const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
