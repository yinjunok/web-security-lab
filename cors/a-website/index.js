const path = require('path');
const Koa = require('koa');
const render = require('koa-ejs');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

render(app, {
  root: path.join(__dirname, 'view'),
  viewExt: 'ejs',
  layout: false,
  cache: false,
});

router.get('/', async (ctx) => {
  ctx.cookies.set('test_cookie', 'test_cookie')
  await ctx.render('index');
});

router.get('/cookie', async (ctx) => {
  ctx.body = ctx.cookies.get('test_cookie');
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(4000, () => {
  console.log('a 站点在 4000 端口启动')
});