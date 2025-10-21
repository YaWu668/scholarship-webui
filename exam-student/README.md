<<<<<<< HEAD
# lxg

#### 介绍
1234567981

#### 软件架构
软件架构说明


#### 安装教程

1.  xxxx
2.  xxxx
3.  xxxx

#### 使用说明

1.  xxxx
2.  xxxx
3.  xxxx

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
=======
# exam-student

## Pre Command
```
//2020
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
npm install --registry https://registry.npm.taobao.org  
//2024
npm set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass
npm install -g node-gyp
npm rebuild node-sass
//忽略证书问题
npm config set strict-ssl false
npm install node-sass
```


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Ngix gzip
```
gzip on;
gzip_min_length 1k;
gzip_comp_level 1;
gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/bmp application/x-bmp image/x-ms-bmp application/vnd.ms-fontobject font/ttf font/opentype font/x-woff;
gzip_vary on;
gzip_disable "MSIE [1-6]\.";
gzip_buffers 32 4k;
gzip_http_version 1.0;
```

## Ngix config
```
server {
    listen       80;
    server_name  student;
    root         /usr/local/exam/student;
    index        index.html;
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
    location /api/ {
       proxy_pass  http://localhost:8001;
    }
}
http-server dist
```
>>>>>>> 7340460 (12月18日第一次提交)
