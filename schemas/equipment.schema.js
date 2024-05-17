import mongoose from 'mongoose';

// character_id, equipment_list
const EquipmentsSchema = new mongoose.Schema({
  character_id: {
    type: Number,
    require: true,
    unique: true,
  },
  equipment_list: [Number],
});

// EquipmentsSchema를 바탕으로 Equipments모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model('Equipments', EquipmentsSchema);
