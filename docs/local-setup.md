# 本地运行

本项目保留上游Docker五服务。当前交付机器未安装Docker/PostgreSQL，未创建.env、未执行数据库迁移、未调用真实模型。代码已构建，前端页面另用测试API验证。

## 前置条件与权限

需Docker Desktop/Compose、Node >=24.22.1。系统安装、编辑.env及数据库迁移按工作区AGENTS需用户明确授权，以下是授权后的操作步骤，不是已执行记录。

1. 进入app目录。复制.env.example为.env并在本机编辑，填写独立管理员密码、SESSION_SECRET、IMG_PROXY_SIGN_SECRET、POSTGRES_PASSWORD；模型地址/型号/key由使用者选择。密钥不要发到聊天、Git或命令行参数。
2. 在.env确认SITE_URL=http://localhost:3000。首次设置COLLECT_ENABLED=false、MODEL_CALLS_ENABLED=false；所有FEISHU、DINGTALK、INDEXNOW、BAIDU发送开关保持false；不要设置DEV_AUTH_ROLE=admin。
3. 获得数据库初始化授权后运行 `docker compose up -d --build`。setup执行原有迁移和种子，api/worker/web依赖其成功。`docker compose ps`检查五类服务；setup正常退出不是失败。
4. 打开http://localhost:3000和/admin。普通前台匿名可读，后台用本地配置密码登录。查看信源管理，先预览9个试抓源；后台验证前不称稳定接入。
5. 后台设置模型每分钟/小时/天调用预算，首次建议20/100/300次（运营建议，非已写入的配置）；付费采集服务预算为0，确认真实服务单价。再选一个源启用COLLECT_ENABLED，确认采集后再小批打开MODEL_CALLS_ENABLED。
6. 观察一轮采集、双评分和归组。先手动生成日报/周报/月报；没有成功处理资料应排查流程，不写行业平静。只有满足评测标准才扩大采集。

## 启停与排查

`docker compose stop`暂停，`docker compose start`恢复，`docker compose restart api worker web`重载；`docker compose logs --tail 100 api worker web`看日志。worker正常停止需等待在途任务，不强杀。不要执行带-v的down。

industry/sources.json只补不存在的ID，不会覆盖数据库里旧行；调整源在后台操作并同步版本记录。停用种子源不会自动停用数据库已有源。

## 无Docker的代码检查

使用Node24执行 `npm ci`、`npm run typecheck`、`npm run test:standalone`、`npm run build -w @aihot/web`。npm test需可创建临时_test库的PostgreSQL；未获迁移授权前不运行数据库测试。网页回归完整套件需安装Playwright Chromium/WebKit；本交付另有使用系统Chrome的 `node scripts/check-chip-pages.ts`，它只验证前端+测试API并会退出，不能当作真实网站运行。
