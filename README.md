# 近一点 · 我的动物世界

面向动物园游客与比赛展示的个性化移动网页原型。用户可以使用本地身份进入自己的动物世界，从预设动物中添加喜欢的伙伴，或上传自己的画作创造一只新动物。

每只动物拥有独立详情页、3D 或原创画作舞台、喂养值、每日互动资格、优惠券和日历记录。

## 公网体验

- 主入口：<https://serein985.github.io/jin-yidian-world/?visit=habitat>
- 园区动物直达示例：<https://serein985.github.io/jin-yidian-world/?animal=preset-tiger&source=park>

公网版本由 GitHub Pages 托管，手机扫码或点击即可打开，不需要电脑保持开机。

## 主要功能

- 三种可切换的本地登录样式：入园门票、饲养员工作证、极简头像。
- 十二种预设伙伴，角色素材直接取自比赛参考贴纸图，并分别拆分透明背景。
- 主舞台使用参考图角色原画，支持独立的等待、摇摆、吃东西、打瞌睡和轻跳动画。
- 详情页可切换贴纸插画与实时 3D。
- 可自由添加、删除和调整顺序的动物收藏。
- 预设动物的 3D 舞台支持拖动旋转、双指缩放和绒毛凹凸材质。
- 上传 PNG、JPG、WebP 原创画作，自动压缩并保存在 IndexedDB。
- 原创画作支持最多 12 个触摸点。
- 每个触摸点支持局部弹跳、摇头、闪烁、冒爱心和短动画。
- 每只动物独立喂养值、每日抚摸、每日投喂和优惠券状态。
- 五种优惠券权益可由原创动物创建者选择。
- 跨动物日历、预约、页面内提醒、到期高亮和完成状态。
- 浏览器相机扫码与手动备用入口。
- 园区二维码可通过 `?animal=<编号>` 直接进入动物详情。
- 券包展示全部动物的锁定、可出示、已核销状态。

## 本地运行

```powershell
npm install
npm run dev -- --host 0.0.0.0 --port 4173
```

普通入口：

```text
http://127.0.0.1:4173/?visit=habitat
```

园区动物直达：

```text
http://127.0.0.1:4173/?animal=preset-red-panda&source=park
```

## 规则

| 类型 | 数值 |
| --- | ---: |
| 当日首次抚摸 | +1 |
| 当日首次投喂 | +4 |
| 原创动物门槛 | 20–100，步长 5 |
| 原创触摸点上限 | 12 |
| 单张画作上限 | 12MB |
| 压缩后最长边 | 1600px |

每只动物独立保存每日资格。除今天之外，所有历史数据和优惠券都保存在当前设备。

## 本机数据

- 主状态：`localStorage` 键 `jin-yidian:v3:world`
- 原创画作：IndexedDB 数据库 `jin-yidian-assets`，对象仓 `animal-artwork`

不同手机之间不共享身份或创作内容。清空浏览器数据会删除本机动物世界。

## 扫码

外部园区二维码格式：

```text
https://serein985.github.io/jin-yidian-world/?animal=preset-panda&source=park
```

支持的预设编号：

```text
preset-panda
preset-red-panda
preset-tiger
preset-sheep
preset-capybara
preset-rabbit
preset-fox
preset-penguin
preset-bear-pie
preset-mirror-rabbit
preset-pig
preset-book-dog
```

应用内部扫码优先使用浏览器 `BarcodeDetector`，不支持时使用 `jsQR`。相机权限被拒绝后仍可手动输入编号。

## 开发与验证

```powershell
npm run build
npm test
npm run test:e2e
```

端到端测试覆盖 `320x700`、`360x800`、`390x844`、`430x932`，并验证登录、预设添加、原创画作上传、触摸点、3D 舞台、详情、日历、券包和扫码直达。

## 二维码文件

```text
outputs/world-entry-qr.png
outputs/preset-animal-qr-sheet.png
```

## 原型边界

- 登录是本地视觉身份，不是真实账号认证。
- 提醒只在页面打开时更新，不发送系统后台通知。
- 优惠券核销为前端原型流程，不是生产级防伪核销。
- 数字投喂不代表真实动物饥饿状态，也不允许游客在线下自行投喂。
