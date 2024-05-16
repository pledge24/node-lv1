import mongoose from 'mongoose';

// character_id, name, health, power
const CharactersSchema = new mongoose.Schema({
  character_id: {
    type: Number,
    require: true,
    unique: true,
  },
  name: {
    type: String,
    require: true,
    unique: true,
  },
  health: {
    type: Number,
    require: true,
  },
  power: {
    type: Number,
    require: true,
  },
});

// CharactersSchema를 바탕으로 Characters모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model('Characters', CharactersSchema);
