### 캐릭터 API (routes/characters.router.js)

| 기능 | API URL | Method | Request | Response | Response(error) |
| --- | --- | --- | --- | --- | --- |
| 캐릭터 등록 | /api/characters | POST | ```{"name": "이런이런3", "health": 500, "power": 100}``` | ``` {"character": {"character_id": 3, "name": "이런이런3", "health": 500, "power": 100, "_id": "6646a24040d4a013cf0afe53", "__v": 0}}``` | # 400 캐릭터 이름이 중복된 경우 ``` {"errorMessage": "이미 존재하는 캐릭터 이름입니다."}``` |
| 캐릭터 전체 조회 | /api/characters | GET | ```{}``` | ``` [ {"character_id": 3, "name": "이런이런3", "health": 30500, "power": 1100}, {"character_id": 2, "name": "이런이런2", "health": 30500, "power": 1100}, {"character_id": 1, "name": "이런이런1", "health": 30500, "power": 1100}]``` |  |
| 캐릭터 상세 조회 | /api/characters/:character_id | GET | ``` {}``` | ``` {"name": "이런이런1", "health": 530, "power": 100}``` | # 404 해당 character_id를 가진 캐릭터가 존재하지 않는 경우 ``` {"errorMessage": "존재하지 않는 캐릭터 입니다."}``` |
| 캐릭터 삭제 | /api/characters/:character_id | DELETE | ``` {}``` | ``` {}``` | # 404 해당 character_id를 가진 캐릭터가 존재하지 않는 경우 ``` {"errorMessage": "존재하지 않는 캐릭터 입니다."}``` |
| 캐릭터 수정 | /api/characters/:character_id | PATCH | ``` {"name": "강아지 보단 고양이", "health": 12, "power": 33}``` | ``` {}``` | # 404 해당 character_id를 가진 캐릭터가 존재하지 않는 경우 ``` {"errorMessage": "존재하지 않는 캐릭터 입니다."}``` |
      
### 아이템 API(routes/items.router.js)

| 기능 | API URL | Method | Request | Response | Response(error) |
| --- | --- | --- | --- | --- | --- |
| 아이템 등록 | /api/items | POST | ```json {"item_code": 12, "item_name": "허약의 반지", "item_stat": {"health": 1, "power": 1}}``` | ```json {"item": {"item_code": 12, "item_name": "허약의 반지", "item_stat": {"health": 1, "power": 1}, "_id": "6645fd46bd7b5b3c7dc00200", "__v": 0}}``` | # 400 아이템 코드가 중복된 경우 ```json {"errorMessage": "이미 등록된 아이템 코드입니다."}``` |
| 아이템 조회 | /api/items | GET | ```json {}``` | ```json [ {"item_code": 1, "item_name": "전설의 냉동참치"}, {"item_code": 2, "item_name": "파멸의 반지"}, {"item_code": 3, "item_name": "파멸의 반지_리뉴얼"}, {"item_code": 12, "item_name": "허약의 반지"}]``` |  |
| 아이템 상세 조회 | /api/items/:item_code | GET | ```json {}``` | ```json {"item_code": 1, "item_name": "전설의 냉동참치", "item_stat": {"health": 0, "power": 0}}``` | # 404 해당 item_code를 가진 아이템이 존재하지 않는 경우 ```json {"errorMessage": "존재하지 않는 아이템 입니다."}``` |
| 아이템 수정 | /api/items/:item_code | PATCH | ```json {"item_name": "전설의 냉동참치", "item_stat": {"health": 30000, "power": 1000}}``` | ```json {}``` | # 404 해당 item_code를 가진 아이템이 존재하지 않는 경우 ```json {"errorMessage": "존재하지 않는 아이템 입니다."}``` |

### 아이템 장착 여부 API(routes/equipment.router.js)

| 기능 | API URL | Method | Request | Response | Response(error) |
| --- | --- | --- | --- | --- | --- |
| 아이템 장착 | /api/equipment/:character_id | POST | ```json {"item_code": 1}``` | ```json {"searchCharacterId_equipment": {"_id": "6646a24040d4a013cf0afe54", "character_id": 3, "equipment_list": [1], "__v": 1}}``` | # 404 해당 character_id를 가진 캐릭터가 존재하지 않는 경우 ```json {"errorMessage": "존재하지 않는 캐릭터 입니다"}``` # 400 캐릭터의 아이템 장착 리스트에 해당 item_code가 있는 경우 ```json {"errorMessage": "이미 장착한 아이템입니다."}``` |
| 아이템 장착 조회 | /api/equipment/:character_id | GET | ```json {}``` | ```json [ {"item_code": 3, "item_name": "파멸의 반지_리뉴얼"}, {"item_code": 1, "item_name": "전설의 냉동참치"}]``` | # 404 해당 character_id를 가진 캐릭터가 존재하지 않는 경우 ```json {"errorMessage": "존재하지 않는 캐릭터 입니다"}``` |
| 아이템 탈착 | /api/equipment/:character_id | DELETE | ```json {"item_code": 1}``` | ```json {"searchCharacterId_equipment": {"_id": "6646a24040d4a013cf0afe54", "character_id": 3, "equipment_list": [], "__v": 2}}``` | # 404 해당 character_id를 가진 캐릭터가 존재하지 않는 경우 ```json {"errorMessage": "존재하지 않는 캐릭터 입니다."}``` # 400 캐릭터의 아이템 장착 리스트에 해당 item_code가 없는 경우 ```json {"errorMessage": "해당 아이템을 장착하지 않았습니다"}``` |
