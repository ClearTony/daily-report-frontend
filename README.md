# 日报管理系统 - 前端

Vue 3 + Vite + Element Plus + Vue Router + Axios。

## 功能

- **登录**：所有角色统一登录（默认超管账号 `admin / admin123`，由后端初始化）。
- **普通员工**：每天填写/修改日报；日历上点击日期查看自己当天的日报（有绿点表示已写）。
- **领导**：选择日期查看所有下属员工当天的日报（含未提交状态）；也可以写自己的日报。
- **超级管理员**：用户管理，创建员工/领导账号，维护领导-下属关系。

## 运行

```bash
npm install
npm run dev
```

开发服务器 http://localhost:5173 ，`/api` 请求代理到后端 http://localhost:8080 （见 `vite.config.js`）。

后端仓库：daily-report-backend
