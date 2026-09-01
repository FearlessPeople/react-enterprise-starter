# Sypher Ops design system

面向企业后台、运营工作台与数据密集型页面的视觉与交互基线。参考截图中的财务运营 dashboard，但不把它限制为单一页面模板。

## 设计方向

**Clear operations（清晰的运营台）**：让数据、状态和下一步动作成为视觉主角。界面默认使用蓝色顶部导航建立产品识别，冷白工作区承载内容，黑色负责主要信息层级；绿色、黄色和粉红只表达业务状态。主题选择器可以切换导航与操作色，但不改变信息结构。

这套系统的记忆点是“蓝色导航壳 + 运营信号条”：蓝色负责导航与主要操作，绿色、黄绿色、黄色和粉红只用于图表、进度、状态和异常，不用于装饰性渐变。

## 基础 tokens

| 角色 | Token | Light | 用途 |
| --- | --- | --- | --- |
| Canvas | `--background` | `#F1F3F7` | 页面底色 |
| Surface | `--card` | `#FFFFFF` | 面板、表格、浮层 |
| Ink | `--foreground` | `#151918` | 标题、关键数值 |
| Secondary ink | `--muted-foreground` | `#707887` | 辅助说明、时间、表头 |
| Line | `--border` | `#E1E5EC` | 分割线、输入框边界 |
| Navigation / action | `--primary` | `#316FF4` | 顶部导航、主操作、选中态 |
| Positive | `--chart-1` | `#25B968` | 健康、增长、已完成 |
| Caution | `--chart-3` | `#F0D22F` | 注意、临界值 |
| Exception | `--chart-4` | `#E75D7B` | 错误、下降、停用 |
| Secondary signal | `--chart-2` | `#A9DF2D` | 次级进度、分组对比 |

代码 tokens 位于 `src/design-system.css`，并通过 `src/index.css` 的 shadcn 语义色自动被现有组件使用。

## Typography

- **UI / body**：Inter Variable；中文回退使用系统无衬线字体。
- **数据**：沿用 UI 字体，但开启 tabular figures；金额、百分比、数量右对齐。
- **Kicker**：11px / 500 / 8% tracking / uppercase，只用于模块眉标和元信息。
- **Page title**：24px–28px / 600 / -3.5% tracking。
- **Section title**：16px–18px / 600 / -2% tracking。
- **Body**：13px–14px / 400，行高 1.45–1.6。

避免整页大标题、全大写正文和超过两种强调色。标题使用 sentence case；中文保持自然语序。

## Layout

- 最大内容宽度：`90rem`；桌面页边距使用 `--layout-gutter`。
- 4px 为基础网格；常用间距：8 / 12 / 16 / 24 / 32px。
- Dashboard 采用“主分析区 + 次级数据区”的不等宽网格，优先 1.45fr / 1fr，而不是三个等宽卡片。
- 允许面板之间使用细分割线连接；只有需要层级时才使用边框和阴影。
- 表格是内容容器，不再额外叠加卡片中的卡片。

```text
┌──────────────────────────────────────────────────────────────┐
│ brand     primary navigation                    actions/user  │
├──────────────────────────────────────────────────────────────┤
│ context / date                                      page action│
│                                                              │
│  KPI strip: [metric] │ [metric] │ [metric] │ [metric]        │
│                                                              │
│  primary analysis (1.45fr)       secondary queue (1fr)       │
│  chart / trend / comparison       table / activity           │
│                                                              │
│  supporting panel                 supporting panel             │
└──────────────────────────────────────────────────────────────┘
```

## Components

### Navigation

顶部导航分为两层：24px 的轻量状态栏 + 36px 的蓝色主导航栏，桌面端总高度约 68px。当前页面用白色底部指示线或高亮底色表达。二级导航用轻量 popover，最大宽度 240px。

### Buttons

- Primary：蓝色实底，文案使用动作动词，如“生成报告”“保存更改”。
- Secondary：白底 + 细边框。
- Tertiary：无边框文字动作，仅用于表格行内操作。
- Icon button：32px，必须有 `aria-label`；hover 使用 `--muted`。
- 所有按钮都需要 hover、pressed、disabled、focus-visible 四种状态。

### Panels and tables

面板默认白底、1px line、4–6px 圆角、极轻阴影。表格行高 44–48px；数字列右对齐；表头使用 muted text；操作菜单保持在行尾。

### Status

状态不只依赖颜色：同时显示文字或图标。推荐：`启用 / 停用`、`已支付 / 待处理 / 逾期`。绿色表示健康，黄绿色表示进行中，黄色表示注意，粉红表示异常或下降。

### Charts

图表优先使用折线、条形和分段进度条。网格线极淡；数据 tooltip 使用白色浮层；同一图表最多 4 个系列，系列颜色遵循 signal → secondary signal → caution → exception。

## Responsive and accessibility

- `lg` 以下将不等宽网格堆叠；表格保持横向滚动，不强行压缩列。
- 所有可操作元素支持键盘焦点；焦点环使用 `--ring`。
- `prefers-reduced-motion: reduce` 下关闭位移与过渡。
- 加载态使用与内容形状一致的 skeleton；错误态在发生位置附近说明原因和下一步。
