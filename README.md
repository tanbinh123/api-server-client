## 运行
1. 运行 api-server-client 后端项目 
2. 项目下 `yarn run build` 生成 dist文件夹，将文件夹下内容拷贝到 nginx/html 下
3. 配置 nginx 
```
 server {
        listen       80;
        server_name  localhost;
		
        # gzip config
	gzip on;
	gzip_min_length 1k;
	gzip_comp_level 9;
	gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
	gzip_vary on;
	gzip_disable "MSIE [1-6]\.";

        # 根据 nginx 安装目录查看
	root D:/nginx-1.14.2/html;
		
        location / {
	        # 用于配合 browserHistory 使用
		try_files $uri $uri/ /index.html;
		# 如果有资源，建议使用 https + http2，配合按需加载可以获得更好的体验 
		# rewrite ^/(.*)$ https://preview.pro.loacg.com/$1 permanent;

	}
	location /api {
		proxy_pass http://127.0.0.1:8888/v1;
		proxy_set_header   X-Forwarded-Proto $scheme;
		proxy_set_header   Host              $http_host;
		proxy_set_header   X-Real-IP         $remote_addr;
	}
    }
``` 