import mongoose from 'mongoose';

// character_id, name, health, power
const ItemsSchema = new mongoose.Schema({
  item_code: {
    type: Number,
    require: true,
    unique: true,
  },
  item_name: {
    type: String,
    require: true,
    unique: false,
  },
  item_stat: {
    health: {
      type: Number,
      require: true,
    },
    power: {
      type: Number,
      require: true,
    },
  },
});

// ItemsSchema를 바탕으로 Items모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model('Items', ItemsSchema);
