import express from 'express';
import connect from './schemas/index.js';
import CharactersRouter from './routes/characters.router.js';
import ItemsRouter from './routes/items.router.js';

const app = express();
const PORT = 3000;

connect();

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정합니다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

router.get('/', (req, res) => {
  return res.json({ message: 'Hi!' });
});

// '/api' 주소로 접근 하였을 때, router와 CharactersRouter로 클라이언트의 요청이 전달됩니다.
app.use('/api', [router, CharactersRouter, ItemsRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
