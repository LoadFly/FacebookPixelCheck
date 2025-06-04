# Facebook Pixel 检查工具

这是一个用于验证 Facebook Pixel ID 和 Access Token 有效性的工具。它可以帮助你快速检查 Pixel 配置是否正确，并保存验证通过的 Pixel ID 记录。

## 功能特点

- 验证 Facebook Pixel ID 和 Access Token 的有效性
- 支持配置是否使用代理访问 Facebook API
- 保存并显示验证通过的 Pixel ID 历史记录
- 简洁直观的用户界面

## 安装步骤

1. 克隆项目到本地：
```bash
git clone [项目地址]
cd FacebookPixelCheck
```

2. 安装依赖：
```bash
npm install
```

3. 启动服务器：
```bash
npm start
```

4. 在浏览器中访问：
```
http://localhost:3001
```

## 使用说明

1. 在输入框中填入要验证的 Facebook Pixel ID
2. 填入对应的 Access Token
3. 如果需要使用代理访问 Facebook API，勾选"使用代理"选项
4. 点击"检查"按钮进行验证
5. 验证结果会实时显示在页面上
6. 验证通过的 Pixel ID 会被记录并显示在历史记录列表中

## 注意事项

- 使用代理功能时，请确保代理服务器（127.0.0.1:7890）正常运行
- Access Token 需要具有适当的权限才能进行 Pixel 验证
- 历史记录保存在 check_history.log 文件中