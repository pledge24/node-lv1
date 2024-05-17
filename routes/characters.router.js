import express from 'express';
import Characters from '../schemas/characters.schema.js';
import Equipments from '../schemas/equipment.schema.js';

const router = express.Router();

/** 캐릭터 등록(POST Method) API */
router.post('/characters', async (req, res) => {
  // 클라이언트에게 전달받은 name, health, power 데이터를 변수에 저장합니다.
  const { name, health, power } = req.body;

  // Characters 모델을 사용해, MongoDB에서 'character_id'값이 가장 높은'캐릭터'를 찾습니다.
  const CharactersMaxOrder = await Characters.findOne()
    .sort('-character_id')
    .exec();

  // 중복된 캐릭터 명이 있는 지 확인하고, 만약 있다면 중복 사실을 알립니다.
  const CharacterName = await Characters.findOne({ name: name }).exec();
  if (CharacterName) {
    return res
      .status(400)
      .json({ errorMessage: '이미 존재하는 캐릭터 이름입니다.' });
  }

  // 'character_id' 값이 가장 높은 document의 1을 추가하거나, 없다면 1을 할당합니다.
  const character_id = CharactersMaxOrder
    ? CharactersMaxOrder.character_id + 1
    : 1;

  // Characters 모델을 사용해, 새로운 '캐릭터'를 생성합니다.
  // 추가로, Equipments모델을 사용해 해당 캐릭터의 '아이템 장착 여부'데이터를 생성합니다.(아무것도 장착 X)
  const character = new Characters({ character_id, name, health, power });
  const equipment = new Equipments({ character_id });

  // 생성한 '캐릭터', '아이템 장착 여부'를 MongoDB에 저장합니다.
  await character.save();
  await equipment.save();

  // 등록한'캐릭터'의 정보를 클라이언트에 전달합니다.
  return res.status(201).json({ character });
});

/** 캐릭터 전체 조회(GET Method) API */
router.get('/characters', async (req, res) => {
  // Characters 모델을 사용해, MongoDB에서 'character_id'값이 가장 높은'캐릭터'를 찾습니다.
  const characters = await Characters.find().sort('-character_id').exec();

  // 보이고자 하는 데이터만 filterdCharacters에 저장합니다.
  const filterdCharacters = characters.map(
    ({ character_id, name, health, power }) => ({
      character_id,
      name,
      health,
      power,
    })
  );

  // 찾은'캐릭터'들을 클라이언트에 전달합니다.
  return res.status(200).json(filterdCharacters);
});

/** 캐릭터 상세 조회(GET Method) API */
router.get('/characters/:character_id', async (req, res) => {
  // 조회할 '캐릭터'의 ID 값을 가져옵니다.
  const { character_id } = req.params;

  // 가져온 캐릭터ID를 통해 DB에서 해당 캐릭터 정보를 가져옵니다.
  // 해당 ID값을 가진 '캐릭터'가 없다면, 없다는 사실을 클라이언트에게 전달합니다.
  const searchCharacter = await Characters.findOne({
    character_id: character_id,
  }).exec();
  if (!searchCharacter) {
    return res
      .status(404)
      .json({ errorMessage: '존재하지 않는 캐릭터 입니다.' });
  }

  // 보이고자 하는 데이터만 filterdCharacter에 저장합니다.
  const filterdCharacter = {
    name: searchCharacter.name,
    health: searchCharacter.health,
    power: searchCharacter.power,
  };

  // 찾은'캐릭터'를 클라이언트에 전달합니다.
  return res.status(200).json(filterdCharacter);
});

/** 캐릭터 삭제(DELETE Method) API */
router.delete('/characters/:characterId', async (req, res) => {
  // 삭제할 '캐릭터'의 ID 값을 가져옵니다.
  const { characterId } = req.params;

  // 삭제하려는 '캐릭터'를 가져옵니다.
  // 만약, 해당 ID값을 가진 '캐릭터'가 없다면, 없다는 사실을 클라이언트에게 전달합니다.
  const character = await Characters.findOne({
    character_id: characterId,
  }).exec();
  if (!character) {
    return res
      .status(404)
      .json({ errorMessage: '존재하지 않는 캐릭터 입니다.' });
  }

  // 조회된 '캐릭터', '아이템 장착 여부' 데이터를 삭제합니다.
  await Characters.deleteOne({ character_id: characterId }).exec();
  await Equipments.deleteOne({ character_id: characterId }).exec();

  // 삭제 성공 시, {}을 클라이언트에게 전달합니다.
  return res.status(200).json({});
});

/** 캐릭터 수정(FETCH Method) API */
router.patch('/characters/:characterId', async (req, res) => {
  // 수정할 '캐릭터'의 ID 값을 가져옵니다.
  const { characterId } = req.params;

  // 클라이언트에게 전달받은 name, health, power 데이터를 변수에 저장합니다.
  const { name, health, power } = req.body;

  // 수정하려는 '캐릭터'를 가져옵니다.
  // 만약, 해당 ID값을 가진 '캐릭터'가 없다면, 없다는 사실을 클라이언트에게 전달합니다.
  const currentCharacter = await Characters.findOne({
    character_id: characterId,
  }).exec();
  if (!currentCharacter) {
    return res
      .status(404)
      .json({ errorMessage: '존재하지 않는 캐릭터 입니다.' });
  }

  // 해당 캐릭터 정보를 수정합니다.
  currentCharacter.name = name;
  currentCharacter.health = health;
  currentCharacter.power = power;

  // 수정한 캐릭터 정보를 DB에 저장합니다.
  await currentCharacter.save();

  // 수정 성공 시, {}을 클라이언트에게 전달합니다.
  return res.status(200).json({});
});

export default router;
