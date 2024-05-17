import express from 'express';
import Items from '../schemas/items.schema.js';
import Equipments from '../schemas/equipment.schema.js';
import Characters from '../schemas/characters.schema.js';

const router = express.Router();

/** 아이템 등록(POST Method) API */
router.post('/items', async (req, res) => {
  // 클라이언트에게 전달받은 item_code, item_name, item_stat 데이터를 변수에 저장합니다.
  const { item_code, item_name, item_stat } = req.body;

  // 중복된 아이템 코드가 있는 지 확인하고, 만약 있다면 중복 사실을 알립니다.
  const ItemCode = await Items.findOne({ item_code: item_code }).exec();
  if (ItemCode) {
    return res
      .status(400)
      .json({ errorMessage: '이미 등록된 아이템 코드입니다.' });
  }

  // Items 모델을 사용해, 새로운 '아이템'을 생성합니다.
  const item = new Items({ item_code, item_name, item_stat });

  // 생성한 '아이템'을 DB에 저장합니다.
  await item.save();

  // 등록한 '아이템'정보를 클라이언트에 전달합니다.
  return res.status(201).json({ item });
});

/** 아이템 조회(GET Method) API */
router.get('/items', async (req, res) => {
  // Items 모델을 사용해, MongoDB에서 'item_code'값이 낮은 순으로 정렬해 가져옵니다.
  const items = await Items.find().sort('item_code').exec();

  // 보이고자 하는 '아이템'정보를 필터링해 filterdItems에 저장합니다.
  const filterdItems = items.map(({ item_code, item_name }) => ({
    item_code,
    item_name,
  }));

  // 찾은'아이템'들을 클라이언트에 전달합니다.
  return res.status(200).json(filterdItems);
});

/** 아이템 상세 조회(GET Method) API */
router.get('/items/:itemsCode', async (req, res) => {
  // 조회할 '아이템'의 ID 값을 가져옵니다.
  const { itemsCode } = req.params;

  // 조회하려는 '아이템'을 가져옵니다. 
  // 만약, 해당 ID값을 가진 '아이템'이 없다면, 없다는 사실을 클라이언트에게 전달합니다.
  const searchItem = await Items.findOne({ item_code: itemsCode }).exec();
  if (!searchItem) {
    return res
      .status(404)
      .json({ errorMessage: '존재하지 않는 아이템 입니다.' });
  }

  // 보이고자 하는 '아이템'정보를 필터링해 filterdItems에 저장합니다.
  const filtereditem = {
    item_code: searchItem.item_code,
    item_name: searchItem.item_name,
    item_stat: searchItem.item_stat,
  };

  // 조회 성공 시, 조회된'아이템'을 클라이언트에 전달합니다.
  return res.status(200).json(filtereditem);
});

/** 아이템 수정(FETCH Method) API */
router.patch('/items/:itemsCode', async (req, res) => {
  // 수정할 '아이템'의 ID 값을 가져옵니다.
  const { itemsCode } = req.params;

  // 클라이언트에게 전달받은 item_name, item_stat 데이터를 변수에 저장합니다.
  const { item_name, item_stat } = req.body;

  // 수정하려는 '아이템'을 가져옵니다. 만약, 해당 ID값을 가진 '아이템'이 없다면 해당 사실을 클라이언트에 전달합니다.
  const currentItem = await Items.findOne({ item_code: itemsCode }).exec();
  if (!currentItem) {
    return res
      .status(404)
      .json({ errorMessage: '존재하지 않는 아이템 입니다.' });
  }

  // 해당 아이템을 가지고 있던 캐릭터의 ID들을 Equipments모델에서 가져옵니다.
  const itemOwners = await Equipments.find({ equipment_list: itemsCode }, 'character_id').exec();
  //console.log(itemOwners);

  // 해당 아이템을 가지고 있던 캐릭터의 스텟을 맞게 수정합니다.
  for(let Owner of itemOwners){
    const owner_character = await Characters.findOne({character_id : Owner.character_id}).exec();
    //console.log(owner_character);

    // 캐릭터의 스텟을 수정합니다.
    owner_character.health = (owner_character.health || 0) - (currentItem.item_stat.health || 0) + (item_stat.health || 0);
    owner_character.power = (owner_character.power || 0) - (currentItem.item_stat.power || 0) + (item_stat.power || 0);

    // 변경된 스텟을 DB에 저장합니다.
    owner_character.save();
  }
 
  // 아이템 정보를 수정합니다.
  currentItem.item_name = item_name;
  currentItem.item_stat = item_stat;

  // 수정한 아이템 정보를 DB에 저장합니다.
  await currentItem.save();

  // 수정 성공 시, {}을 클라이언트에게 전달합니다.
  return res.status(200).json({});
});

export default router;
