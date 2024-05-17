### 캐릭터 API (routes/characters.router.js)

| 기능 | API URL | Method | Request | Response | Response(error) |
| ------- | --- | --- | --- | --- | --- |
| 캐릭터 등록| /api/characters | POST | {<br>"name": "이런이런3",<br>"health": 500,<br>"power": 100<br>} |  {<br>"character": <br>{<br>"character_id": 3,<br>"name": "이런이런3",<br>"health": 500,<br>"power": 100,<br>"_id": "6646a24040d4a013cf0afe53",<br>"__v": 0<br>}<br>} | # 400 캐릭터 이름이 중복된 경우<br>  {<br>"errorMessage": "이미 존재하는 캐릭터 이름입니다."<br>} |
| 캐릭터 전체 조회 | /api/characters | GET | {} |  [ <br>{<br>"character_id": 3,<br>"name": "이런이런3",<br>"health": 30500,<br>"power": 1100<br>},<br>{<br>"character_id": 2,<br>"name": "이런이런2",<br>"health": 30500,<br>"power": 1100<br>},<br>{<br>"character_id": 1,<br>"name": "이런이런1",<br>"health": 30500,<br>"power": 1100<br>}<br>] |  |
| 캐릭터 상세 조회 | /api/characters/:character_id | GET | {} | {<br>"name": "이런이런1",<br>"health": 530,<br>"power": 100<br>} | # 404 해당 character_id를 가진 캐릭터가 존재하지 않는 경우<br>  {<br>"errorMessage": "존재하지 않는 캐릭터 입니다."<br>} |
| 캐릭터 삭제 | /api/characters/:character_id | DELETE | {} | {} | # 404 해당 character_id를 가진 캐릭터가 존재하지 않는 경우<br>  {<br>"errorMessage": "존재하지 않는 캐릭터 입니다."<br>} |
| 캐릭터 수정 | /api/characters/:character_id | PATCH |  {<br>"name": "강아지 보단 고양이",<br>"health": 12,<br>"power": 33} | {} | # 404 해당 character_id를 가진 캐릭터가 존재하지 않는 경우<br>  {<br>"errorMessage": "존재하지 않는 캐릭터 입니다."<br>} |
<br>
<br>

### 아이템 API(routes/items.router.js)

| 기능 | API URL | Method | Request | Response | Response(error) |
| --- | --- | --- | --- | --- | --- |
| 아이템 등록 | /api/items | POST |  {<br>"item_code": 12,<br>"item_name": "허약의 반지",<br>"item_stat": <br>{<br>"health": 1,<br>"power": 1<br>}<br>} |  {<br>"item": <br>{<br>"item_code": 12,<br>"item_name": "허약의 반지",<br>"item_stat": <br>{<br>"health": 1,<br>"power": 1<br>},<br>"_id": "6645fd46bd7b5b3c7dc00200",<br>"__v": 0<br>}<br>} | # 400 아이템 코드가 중복된 경우<br>  {<br>"errorMessage": "이미 등록된 아이템 코드입니다."<br>} |
| 아이템 조회 | /api/items | GET | {} |  [ <br>{<br>"item_code": 1,<br>"item_name": "전설의 냉동참치"<br>},<br>{<br>"item_code": 2,<br>"item_name": "파멸의 반지"<br>},<br>{<br>"item_code": 3,<br>"item_name": "파멸의 반지_리뉴얼"<br>},<br>{<br>"item_code": 12,<br>"item_name": "허약의 반지"<br>}<br>] |  |
| 아이템 상세 조회 | /api/items/:item_code | GET | {} |  {<br>"item_code": 1,<br>"item_name": "전설의 냉동참치",<br>"item_stat": <br>{<br>"health": 0,<br>"power": 0<br>}<br>} | # 404 해당 item_code를 가진 아이템이 존재하지 않는 경우<br>  {<br>"errorMessage": "존재하지 않는 아이템 입니다."<br>} |
| 아이템 수정 | /api/items/:item_code | PATCH |  {<br>"item_name": "전설의 냉동참치",<br>"item_stat": <br>{<br>"health": 30000,<br>"power": 1000<br>}<br>} | {} | # 404 해당 item_code를 가진 아이템이 존재하지 않는 경우<br>  {<br>"errorMessage": "존재하지 않는 아이템 입니다."<br>} |
<br>
<br>

### 아이템 장착 여부 API(routes/equipment.router.js)

| 기능 | API URL | Method | Request | Response | Response(error) |
| --- | --- | --- | --- | --- | --- |
| 아이템 장착 | /api/equipment/:character_id | POST |  {<br>"item_code": 1<br>} |  {<br>"searchCharacterId_equipment": <br>{<br>"_id": "6646a24040d4a013cf0afe54",<br>"character_id": 3,<br>"equipment_list": [1],<br>"__v": 1<br>}<br>} | # 404 해당 character_id를 가진 캐릭터가 존재하지 않는 경우  <br>{<br>"errorMessage": "존재하지 않는 캐릭터 입니다"<br>}<br>#  400 캐릭터의 아이템 장착 리스트에 해당 item_code가 있는 경우<br>  {<br>"errorMessage": "이미 장착한 아이템입니다."<br>} |
| 아이템 장착 조회 | /api/equipment/:character_id | GET | {} |  [ <br>{<br>"item_code": 3,<br>"item_name": "파멸의 반지_리뉴얼"<br>},<br>{<br>"item_code": 1,<br>"item_name": "전설의 냉동참치"<br>}<br>] | # 404 해당 character_id를 가진 캐릭터가 존재하지 않는 경우<br>  {<br>"errorMessage": "존재하지 않는 캐릭터 입니다"<br>} |
| 아이템 탈착 | /api/equipment/:character_id | DELETE |  {<br>"item_code":1<br>} |  {<br>"searchCharacterId_equipment": <br>{<br>"_id": "6646a24040d4a013cf0afe54",<br>"character_id": 3,<br>"equipment_list": [],<br>"__v": 2<br>}<br>} | # 404 해당 character_id를 가진 캐릭터가 존재하지 않는 경우  <br>{<br>"errorMessage": "존재하지 않는 캐릭터 입니다."<br>}<br>#  400 캐릭터의 아이템 장착 리스트에 해당 item_code가 없는 경우<br>  {<br>"errorMessage": "해당 아이템을 장착하지 않았습니다"<br>} |
