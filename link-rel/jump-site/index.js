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
  await ctx.render('index');
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(4001, () => {
  console.log('jump-site 在 4001 端口启动')
});