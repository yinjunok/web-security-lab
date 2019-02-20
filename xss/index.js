const path = require('path');
const Koa = require('koa');
const render = require('koa-ejs');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(router.routes());

render(app, {
  root: path.join(__dirname, 'view'),
  viewExt: 'ejs',
  layout: false,
  cache: false,
});

router.get('/', async (ctx) => {
  await ctx.render('index');
});

router.get('/stored-xss', async (ctx) => {
  await ctx.render('stored-xss', {
    content: `
      <script>
        alert("XSS 攻击!!!");
      </script>
    `
  });
});

router.post('/search', async (ctx) => {
  const { keyword } = ctx.request.body;
  await ctx.render('search', { keyword });
});


app.listen(4000, () => {
  console.log('应用在 4000 端口启动')
});