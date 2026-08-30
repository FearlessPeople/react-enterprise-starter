export type ColorTheme = "blue" | "violet" | "emerald" | "orange"

export const navItems = [{ label: "工作台" }, { label: "系统设置" }]

export const systemPages = [
  "用户管理",
  "角色与权限",
  "菜单管理",
  "字典管理",
  "登录日志",
  "审计日志",
] as const

export const pageRoutes: Record<string, string> = {
  工作台: "/",
  用户管理: "/system/users",
  角色与权限: "/system/roles",
  菜单管理: "/system/menus",
  字典管理: "/system/dicts",
  登录日志: "/system/login-logs",
  审计日志: "/system/audit-logs",
}

export const routePages = Object.fromEntries(
  Object.entries(pageRoutes).map(([page, route]) => [route, page])
) as Record<string, string>

export type SystemRow = Record<string, unknown> & { id?: string }

export const pageConfig: Record<
  string,
  { endpoint: string; columns: [string, string][] }
> = {
  用户管理: {
    endpoint: "/users",
    columns: [
      ["username", "账号"],
      ["displayName", "姓名"],
      ["email", "邮箱"],
      ["status", "状态"],
    ],
  },
  角色与权限: {
    endpoint: "/roles",
    columns: [
      ["code", "编码"],
      ["name", "名称"],
      ["status", "状态"],
    ],
  },
  菜单管理: {
    endpoint: "/menus",
    columns: [
      ["name", "名称"],
      ["path", "路径"],
      ["type", "类型"],
    ],
  },
  字典管理: {
    endpoint: "/dict-types",
    columns: [
      ["code", "编码"],
      ["name", "名称"],
      ["status", "状态"],
    ],
  },
  登录日志: {
    endpoint: "/login-logs",
    columns: [
      ["username", "账号"],
      ["action", "动作"],
      ["success", "结果"],
      ["createdAt", "时间"],
    ],
  },
  审计日志: {
    endpoint: "/audit-logs",
    columns: [
      ["username", "用户"],
      ["action", "动作"],
      ["resource", "资源"],
      ["createdAt", "时间"],
    ],
  },
}
