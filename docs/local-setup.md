# 本地运行

本项目保留上游Docker五服务。2026-11-15获授权后已安装Docker、创建独立.env、完成75项迁移并启动真实网站http://localhost:3000。采集和模型总阀门仍关闭。以下步骤用于复现；新机器的系统/数据库操作仍按其授权执行。

## 前置条件与权限

需Docker Desktop/Compose、Node >=24.22.1。本机安装、配置和新库初始化已获明确授权并完成。以下还包括未来启用运营的步骤；用户最新决定暂不开启持续采集，仅继续测试与整理。模型和推送同样关闭。

1. 进入app目录。复制.env.example为.env并在本机编辑，填写独立管理员密码、SESSION_SECRET、IMG_PROXY_SIGN_SECRET、POSTGRES_PASSWORD；模型地址/型号/key由使用者选择。密钥不要发到聊天、Git或命令行参数。
2. 在.env确认SITE_URL=http://localhost:3000。首次设置COLLECT_ENABLED=false、MODEL_CALLS_ENABLED=false；所有FEISHU、DINGTALK、INDEXNOW、BAIDU发送开关保持false；不要设置DEV_AUTH_ROLE=admin。
3. 获得数据库初始化授权后运行 `docker compose up -d --build`。setup执行原有迁移和种子，api/worker/web依赖其成功。`docker compose ps`检查五类服务；setup正常退出不是失败。
4. 打开http://localhost:3000和/admin。普通前台匿名可读，后台用本地配置密码登录。查看信源管理，先预览9个试抓源；后台验证前不称稳定接入。
5. 后台设置模型每分钟/小时/天调用预算，本机已初始化20/100/300次（调用次数，不是人民币）；付费采集服务预算为0，确认真实服务单价。未来获得明确授权后再启用COLLECT_ENABLED；模型调用需先配置服务、密钥与预算并另行授权。当前不执行这两步。
6. 观察一轮采集、双评分和归组。先手动生成日报/周报/月报；没有成功处理资料应排查流程，不写行业平静。只有满足评测标准才扩大采集。

## 启停与排查

`docker compose stop`暂停，`docker compose start`恢复，`docker compose restart api worker web`重载；`docker compose logs --tail 100 api worker web`看日志。worker正常停止需等待在途任务，不强杀。不要执行带-v的down。

industry/sources.json只补不存在的ID，不会覆盖数据库里旧行；调整源在后台操作并同步版本记录。停用种子源不会自动停用数据库已有源。

## 无Docker的代码检查

使用Node24执行 `npm ci`、`npm run typecheck`、`npm run test:standalone`、`npm run build -w @aihot/web`。npm test需可创建临时_test库的PostgreSQL；未获迁移授权前不运行数据库测试。网页回归完整套件需安装Playwright Chromium/WebKit；本交付另有使用系统Chrome的 `node scripts/check-chip-pages.ts`，它只验证前端+测试API并会退出，不能当作真实网站运行。

## 本机实况补充

Docker客户端路径为/Applications/Docker.app/Contents/Resources/bin/docker；项目名chip-insight-local。docker-compose.override.yml限定127.0.0.1端口。后台密码仅存.env；9个后台预览通过，业务库未采集文章。宿主完整数据库测试1128/1141通过，13项缺pg_dump；容器内客户端存在，不能据此声称宿主备份测试通过。

## 本轮测试补充

完整网页回归61项全部通过。备份恢复套件在现有api镜像内使用Node24与PostgreSQL17客户端、连接独立chip_insight_test库运行，14项通过、0跳过；测试库已停止。宿主机仍未安装pg_dump，不宣称宿主完整数据库回归已重新通过。范围及证据见phase-one-acceptance.md和chip-evaluation.md。
