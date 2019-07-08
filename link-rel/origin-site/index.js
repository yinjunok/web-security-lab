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

app.listen(4000, () => {
  console.log('origin-site 在 4000 端口启动')
});