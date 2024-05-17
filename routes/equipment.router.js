import express from 'express';
import Equipments from '../schemas/equipment.schema.js';
import Items from '../schemas/items.schema.js';
import Characters from '../schemas/characters.schema.js';

const router = express.Router();

/** 아이템 장착(POST Method) API */
router.post('/equipment/:character_id', async (req, res) => {
  // 장착할 '아이템'의 ID 값을 가져옵니다.
  const { character_id } = req.params;

  // 클라이언트에게 전달받은 item_code 데이터를 변수에 저장합니다.
  const { item_code } = req.body;

  // 아이템을 장착할 '캐릭터'의 데이터를 가져옵니다.
  // 만약, 해당 ID값을 가진 '캐릭터'가 없다면 해당 사실을 클라이언트에 전달합니다.
  const searchCharacterId_character = await Characters.findOne({
    character_id: character_id,
  }).exec();
  if (!searchCharacterId_character) {
    return res
      .status(404)
      .json({ errorMessage: '존재하지 않는 캐릭터 입니다.' });
  }

  // 해당 캐릭터의 '아이템 장착 여부'데이터를 가져옵니다.
  // 만약, 해당 ID값을 가진 '아이템'을 장착하고 있다면 해당 사실을 클라이언트에 전달합니다.
  const searchCharacterId_equipment = await Equipments.findOne({
    character_id: character_id,
  }).exec();
  const item_list = searchCharacterId_equipment.equipment_list;
  for (let code of item_list) {
    if (code === item_code) {
      return res
        .status(400)
        .json({ errorMessage: '이미 장착한 아이템입니다.' });
    }
  }

  // 장착할 아이템ID를 장착 리스트에 추가합니다.
  item_list.push(item_code);

  // 장착할 '아이템'정보를 가져옵니다.
  const item = await Items.findOne({
    item_code: item_code,
  }).exec();

  // 장착할 '아이템'의 스탯만큼 캐릭터의 체력, 힘을 증가시킵니다.
  searchCharacterId_character.health =
    (searchCharacterId_character.health || 0) + (item.item_stat.health || 0);
  searchCharacterId_character.power =
    (searchCharacterId_character.power || 0) + (item.item_stat.power || 0);

  // 수정된 '캐릭터', '아이템 장착 여부' 정보를 DB에 저장합니다.
  await searchCharacterId_character.save();
  await searchCharacterId_equipment.save();

  // 장착 성공 시, 수정된 '아이템 장착 여부'정보를 클라이언트에게 전달합니다.
  return res.status(201).json({ searchCharacterId_equipment });
});

/** 아이템 장착 조회(GET Method) API */
router.get('/equipment/:character_id', async (req, res) => {
  // 조회할 '캐릭터'의 ID 값을 가져옵니다.
  const { character_id } = req.params;

  // 해당 캐릭터의 '아이템 장착 여부'데이터를 가져옵니다.
  // 만약, 해당 ID값을 가진 '캐릭터'가 없다면, 해당 사실을 클라이언트에 전달합니다.
  const searchCharacter = await Equipments.findOne({
    character_id: character_id,
  }).exec();
  if (!searchCharacter) {
    return res
      .status(404)
      .json({ errorMessage: '존재하지 않는 캐릭터 입니다.' });
  }

  // 가져온 '아이템 장착 여부'데이터를 통해, 해당 아이템들의 데이터를 가져옵니다.
  let equipped_item_list = [];
  for (let item_code of searchCharacter.equipment_list) {
    const item_info = await Items.findOne({
      item_code: item_code,
    }).exec();
    equipped_item_list.push(item_info);
  }

  // 보이고자 하는 데이터만 필터해서 filtered_equipped_item_list에 저장합니다.
  const filtered_equipped_item_list = equipped_item_list.map(
    ({ item_code, item_name }) => ({
      item_code,
      item_name,
    })
  );

  // 조회 성공 시, 해당 캐릭터의 '아이템 장착 여부'를 클라이언트에게 전달합니다.
  return res.status(200).json(filtered_equipped_item_list);
});

/** 아이템 탈착(POST Method) API */
router.delete('/equipment/:character_id', async (req, res) => {
  // 탈착할 '캐릭터'의 ID 값을 가져옵니다.
  const { character_id } = req.params;

  // 클라이언트에게 전달받은 item_code 데이터를 변수에 저장합니다.
  const { item_code } = req.body;

  // 아이템을 탈착할 '캐릭터'의 데이터를 가져옵니다.
  // 만약, 해당 ID값을 가진 '캐릭터'가 없다면 해당 사실을 클라이언트에 전달합니다.
  const searchCharacterId_character = await Characters.findOne({
    character_id: character_id,
  }).exec();
  if (!searchCharacterId_equipment) {
    return res
      .status(400)
      .json({ errorMessage: '존재하지 않는 캐릭터 입니다.' });
  }

  // 아이템을 탈착할 캐릭터의 '아이템 장착 여부' 데이터를 가져옵니다.
  const searchCharacterId_equipment = await Equipments.findOne({
    character_id: character_id,
  }).exec();

  // 만약, '아이템 장착 여부' 데이터에 해당 ID값을 가진 '아이템'이 있다면, 해당 사실을 클라이언트에 전달합니다.
  const item_list = searchCharacterId_equipment.equipment_list;
  let find = false;
  for (let code of item_list) {
    if (code === item_code) {
      find = true;
      break;
    }
  }

  if (!find) {
    return res
      .status(404)
      .json({ errorMessage: '해당 아이템을 장착하지 않았습니다' });
  }

  // 장착한 아이템 리스트에서, 해당 아이템을 제거합니다.
  item_list.pull(item_code);

  // 탈착할 '아이템'정보를 가져옵니다.
  const item = await Items.findOne({
    item_code: item_code,
  }).exec();

  // 탈착할 '아이템'의 스탯만큼 캐릭터의 체력, 힘을 감소시킵니다.
  searchCharacterId_character.health =
    (searchCharacterId_character.health || 0) - (item.item_stat.health || 0);
  searchCharacterId_character.power =
    (searchCharacterId_character.power || 0) - (item.item_stat.power || 0);

  // 수정된 '캐릭터', '아이템 장착 여부' 정보를 DB에 저장합니다.
  await searchCharacterId_equipment.save();
  await searchCharacterId_character.save();

  // 탈착 성공 시, 수정된 '아이템 장착 여부'정보를 클라이언트에게 전달합니다.
  return res.status(201).json({ searchCharacterId_equipment });
});

export default router;
