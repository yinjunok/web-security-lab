const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

router.get('/set-token', (ctx) => {
  ctx.cookies.set('token', 'user token', {
    domain: 'csrf-be-attacked.com'
  });
  ctx.body = '设置 cookie'
});

router.get('/be-attacked', (ctx) => {
  console.log('the token is: ', ctx.cookies.get('token'));
  ctx.body = ctx.cookies.get('token');
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(4001, () => {
  console.log('be-attacked 在 4001 端口启动')
});
