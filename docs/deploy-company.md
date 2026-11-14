# 公司服务器迁移

一期保留Git+Docker Compose路线。私有仓库已创建并上传：https://github.com/beijing-snail/chip-industry-insight ，默认分支chip-insight-phase1；origin指向个人私有仓库，upstream保留原项目。未部署公司服务器或发布公网网站。

1. 公司服务器先取得当前私有仓库访问权限；如需另建公司仓库，再明确目标与推送授权。检出chip-insight-phase1并记录git rev-parse HEAD及上游SHA。不要提交.env、.data、日志与数据库导出。
2. 公司Linux机器准备Docker与Compose，核实网络出站、域名、访问控制及模型服务。自行生成服务器独立.env；不复制本地管理员密码或模型key。
3. 公开上线前确定运营主体/联系方式、条款隐私、日志期限、来源权利与HTTPS。当前site/pages文字是内部试运行说明，不作为已确认的公开法律条款。
4. 经数据库初始化授权后启动五服务：`docker compose up -d --build`；setup必须先成功。当前docker-compose.override.yml默认仅绑定127.0.0.1；公司部署应按访问方案配置反向代理和HTTPS，不直接复用本机代理地址。检查/admin未登录保护、前台匿名可读，运行`node scripts/smoke.ts --base https://实际地址`。
5. 后台逐个试抓、设置预算后启用采集/模型。先观察多轮及日刊，随后周刊/月刊，目标15个稳定源须实测，不能以9个种子开关替代验收。

默认只迁代码与静态配置，服务器重新采集。确需历史时同时迁数据库与文件卷并先备份；恢复是数据迁移，另取授权。备份按上游docs/deploy.md；验证恢复前不要删除旧库或旧卷。

升级先备份，检查upstream差异，优先处理site/industry及测试样例冲突。不得盲目覆盖定制提示词或历史迁移；源码主结构和CI未更改。不要执行git push、rebase或硬重置，除非用户明确授权。
