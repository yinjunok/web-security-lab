# WEB 安全

## [CSRF](https://zh.wikipedia.org/wiki/%E8%B7%A8%E7%AB%99%E8%AF%B7%E6%B1%82%E4%BC%AA%E9%80%A0)

跨站请求攻击，简单地说，是攻击者通过一些技术手段欺骗用户的浏览器去访问一个自己曾经认证过的网站并运行一些操作（如发邮件，发消息，甚至财产操作如转账和购买商品）。由于浏览器曾经认证过，所以被访问的网站会认为是真正的用户操作而去运行。这利用了web中用户身份验证的一个漏洞：简单的身份验证只能保证请求发自某个用户的浏览器，却不能保证请求本身是用户自愿发出的。

### 验证过程

在 hosts 文件添加两个用于测试的域名, hosts 文件的位置一般在 `C:\Windows\System32\drivers\etc\hosts`.
做完测试后记得删掉, 以免不能正常访问网站.
```
127.0.0.1 csrf-attack.com
127.0.0.1 csrf-be-attacked.com
```

依次执行执行以下命令, 启动两个服务.
```
yarn install
yarn run csrf
```

我们先直接访问攻击站点: `csrf-attack.com:4000`
![未登录情况下](./csrf/img/not-logged-in.PNG)
可以看到, 没有 cookie 发送到被攻击站点.

然后我们访问被攻击站点 `csrf-be-attacked.com:4001/set-token` 来模拟登陆, 将 token 写入浏览器.
![设置 token](./csrf/img/set-token.PNG)


这时候我们再去访问 `csrf-attack.com:4000`
可以看到被攻击站点接收到了 cookie 的请求
![登陆的情况下](./csrf/img/login.PNG)

可以想象, 黑客可以诱骗用户先登陆被攻击网站, 然后再把用户诱骗到自己的站点, 在自己的站点用隐藏的图片, 或者其他能发送请求的标签(link, script)来攻击用户的账户.

## [XSS](https://zh.wikipedia.org/wiki/%E8%B7%A8%E7%B6%B2%E7%AB%99%E6%8C%87%E4%BB%A4%E7%A2%BC)

跨站脚本（英语：Cross-site scripting，通常简称为：XSS）是一种网站应用程序的安全漏洞攻击，是代码注入的一种。它允许恶意用户将代码注入到网页上，其他用户在观看网页时就会受到影响。这类攻击通常包含了HTML以及用户端脚本语言。

XSS攻击通常指的是通过利用网页开发时留下的漏洞，通过巧妙的方法注入恶意指令代码到网页，使用户加载并执行攻击者恶意制造的网页程序。这些恶意网页程序通常是JavaScript，但实际上也可以包括Java，VBScript，ActiveX，Flash或者甚至是普通的HTML。攻击成功后，攻击者可能得到更高的权限（如执行一些操作）、私密网页内容、会话和cookie等各种内容。

XSS 攻击一般分为两类:
* Reflected XSS（反射型的 XSS 攻击）
* Stored XSS（存储型的 XSS 攻击）

### Reflected XSS
主要是由于服务端接收到客户端不安全的输入, 在客户端执行了攻击代码.  
启动服务, 相关演示: 
```
yarn run xss
```
在输入框内输入一些 JS 脚本, 然后点击搜索  

![Reflected XSS](./xss/img/reflected-xss.PNG)

Chrome 的安全措施做的不错, 带有危险脚本的页面被拦截下来了: 
![Reflected XSS Failed](./xss/img/chrome-reflected-xss-failed.PNG)

我们换成 Firefox 试试:   
![Firefox](./xss/img/firefox-reflected-xss.PNG)   
![Firefox Reflected XSS success](./xss/img/firefox-reflected-xss-success.PNG) 

Firefox 成功中招.

### Stored XSS  
基于存储的 XSS 攻击，是通过提交带有恶意脚本的内容存储在服务器上，当其他人看到这些内容时发起 Web 攻击。一般提交的内容都是通过一些富文本编辑器编辑的，很容易插入危险代码。 

存储型攻击, Chrome 没有防住.
![Stored XSS](./xss/img/stored-xss.PNG)

从上面的实验可以看出, 对于表单提交的 XSS, Chrome 可以防御住. 
但是对于存储型, Chrome 也没办法.

防御 XSS 的方式, 主要是把特殊字符给转义掉. 比如 `<script></script>` 中的 `<` 和 `>` 分别转义成 `&lt;` 和 `&gt;`. 这个工作, 一般 web 框架和模板引擎都会提供方法. 比如, 这个 koa, 我用的是 ejs 模板引擎, 为了演示, 插入代码的时候用的 `<%- keyword %>`, 实际项目里大多数时候用的是 `<%= keyword %>`, ejs 会帮助我们完成替换特殊字符的工作.
