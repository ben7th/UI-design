# ui-design
这里放置所有产品的UI设计稿

### 本地预览方法
ruby -run -e httpd . -p 4000

## 编译方法
工程使用 gulp 组织源代码和进行编译。

系统内需要安装 node.js
```
npm install -g gulp # 安装 gulp
npm install # 安装环境依赖
```

相关工程文件
```
package.json
gulpfile.js
gulpfile.coffee
```

编译 pinidea
```
gulp pinidea-watch
```