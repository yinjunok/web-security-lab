const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();


router.get('/cors', async (ctx) => {
  ctx.set('Access-Control-Allow-Origin', 'http://127.0.0.1:4000');
  ctx.body = '成功获取 GET 请求';
});

router.options('/cors-delete', async (ctx) => {
  ctx.set('Access-Control-Allow-Origin', 'http://127.0.0.1:4000');
  ctx.set('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  ctx.body = null;
});

router.delete('/cors-delete', async (ctx) => {
  ctx.set('Access-Control-Allow-Origin', 'http://127.0.0.1:4000');
  ctx.body = '成功执行了 DELETE 请求';
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(4001, () => {
  console.log('b 站点在 4001 端口启动')
});