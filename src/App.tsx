import { Fragment, useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  LogOut,
  Menu,
  Moon,
  Palette,
  Pencil,
  Settings2,
  ShieldCheck,
  Sun,
  UserRound,
  Users,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTheme } from "@/components/theme-provider"
import { apiFetch, API_URL } from "@/lib/api"
import {
  navItems,
  pageConfig,
  pageRoutes,
  routePages,
  systemPages,
  type ColorTheme,
  type SystemRow,
} from "@/config/navigation"

type User = { id: string; username: string; displayName?: string }

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(() =>
    Boolean(localStorage.getItem("access_token"))
  )
  const token = localStorage.getItem("access_token")
  useEffect(() => {
    if (!token) return
    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((p: { data: { user: User } }) => setUser(p.data.user))
      .catch(() => localStorage.removeItem("access_token"))
      .finally(() => setChecking(false))
  }, [token])
  if (checking)
    return (
      <div className="grid min-h-svh place-items-center bg-background text-muted-foreground">
        正在准备工作台…
      </div>
    )
  return user ? (
    <Dashboard user={user} onLogout={() => setUser(null)} />
  ) : (
    <LoginPage onLogin={setUser} />
  )
}

function LoginPage({ onLogin }: { onLogin: (user: User) => void }) {
  const [username, setUsername] = useState("admin"),
    [password, setPassword] = useState(""),
    [loading, setLoading] = useState(false),
    [error, setError] = useState("")
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      })
      const payload = (await response.json()) as {
        data?: { accessToken: string; user: User }
        message?: string
      }
      if (!response.ok || !payload.data)
        throw new Error(payload.message ?? "登录失败，请检查账号和密码")
      localStorage.setItem("access_token", payload.data.accessToken)
      onLogin(payload.data.user)
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "无法连接到服务，请确认后端已启动"
      )
    } finally {
      setLoading(false)
    }
  }
  return (
    <main className="min-h-svh bg-background lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-28 -right-28 size-80 rounded-full border-[40px] border-white/10" />
        <div className="absolute -bottom-32 -left-20 size-96 rounded-full border-[60px] border-white/10" />
        <div className="relative">
          <div className="mb-16 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-white/15 font-bold">
              E
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Enterprise Starter
            </span>
          </div>
          <p className="mb-5 text-sm font-medium tracking-[0.24em] text-primary-foreground/65 uppercase">
            Enterprise workspace
          </p>
          <h1 className="max-w-xl text-5xl leading-[1.08] font-semibold tracking-tight">
            让每一次业务创新，都建立在可靠的基础之上。
          </h1>
          <p className="mt-7 max-w-md text-base leading-7 text-primary-foreground/75">
            面向企业团队打造的统一工作台，集中管理业务、权限与数据，让团队专注于真正重要的事情。
          </p>
        </div>
        <div className="relative grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-6 text-sm text-primary-foreground/70">
          <div>
            <p className="mb-1 text-2xl font-semibold text-white">99.9%</p>
            <p>服务可用性</p>
          </div>
          <div>
            <p className="mb-1 text-2xl font-semibold text-white">24/7</p>
            <p>安全监控</p>
          </div>
          <div>
            <p className="mb-1 text-2xl font-semibold text-white">SOC 2</p>
            <p>安全标准</p>
          </div>
        </div>
      </section>
      <section className="flex min-h-svh items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <div className="mb-7 flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-primary font-bold text-primary-foreground">
                E
              </div>
              <span className="text-lg font-semibold">Enterprise Starter</span>
            </div>
          </div>
          <div className="mb-8">
            <p className="mb-3 text-sm font-medium text-primary">欢迎回来</p>
            <h2 className="text-3xl font-semibold tracking-tight">
              登录你的工作台
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              使用企业账号继续访问管理后台。
            </p>
          </div>
          <form className="space-y-5" onSubmit={submit}>
            <label className="block text-sm font-medium">
              账号
              <Input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 h-11 rounded-lg px-3.5"
                placeholder="请输入账号"
              />
            </label>
            <label className="block text-sm font-medium">
              密码
              <Input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 h-11 rounded-lg px-3.5"
                placeholder="请输入密码"
              />
            </label>
            {error && (
              <p className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                <X className="size-4" />
                {error}
              </p>
            )}
            <Button type="submit" disabled={loading} className="h-11 w-full">
              {loading ? "正在登录…" : "登录"}
            </Button>
          </form>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            登录即表示你同意服务条款与隐私政策
          </p>
        </div>
      </section>
    </main>
  )
}

function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(
      () => (localStorage.getItem("color-theme") as ColorTheme) || "blue"
    ),
    [paletteOpen, setPaletteOpen] = useState(false),
    [menuOpen, setMenuOpen] = useState<string | null>(null),
    [profileOpen, setProfileOpen] = useState(false),
    [activePage, setActivePage] = useState(
      () => routePages[window.location.pathname] ?? "工作台"
    ),
    [headerVisible, setHeaderVisible] = useState(true)
  const profileCloseTimer = useRef<number | undefined>(undefined)
  const { theme, setTheme } = useTheme()
  useEffect(() => {
    document.documentElement.dataset.colorTheme = colorTheme
    localStorage.setItem("color-theme", colorTheme)
  }, [colorTheme])
  useEffect(() => {
    const onPopState = () =>
      setActivePage(routePages[window.location.pathname] ?? "工作台")
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const currentY = window.scrollY
      setHeaderVisible(currentY <= 16 || currentY < lastY)
      lastY = currentY
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  function navigatePage(page: string) {
    const route = pageRoutes[page] ?? "/"
    window.history.pushState({}, "", route)
    setActivePage(page)
  }
  function keepProfileOpen() {
    if (profileCloseTimer.current)
      window.clearTimeout(profileCloseTimer.current)
    setProfileOpen(true)
  }
  function scheduleProfileClose() {
    profileCloseTimer.current = window.setTimeout(
      () => setProfileOpen(false),
      140
    )
  }
  async function logout() {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token") ?? ""}`,
      },
    }).catch(() => undefined)
    localStorage.removeItem("access_token")
    onLogout()
  }
  return (
    <div className="min-h-svh bg-muted/35">
      <header
        className={`header-gradient sticky top-0 z-20 flex h-12 items-center justify-between border-b px-4 backdrop-blur-md transition-transform duration-300 ease-out will-change-transform lg:px-6 ${headerVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="grid size-7 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              E
            </div>
            <span className="hidden text-sm font-semibold tracking-tight sm:block">
              Enterprise Starter
            </span>
          </div>
          <nav className="flex items-center gap-0.5 text-sm">
            {navItems.map(({ label }, index) => (
              <div
                key={label}
                className="relative"
                onMouseEnter={() => setMenuOpen(label)}
                onMouseLeave={() => setMenuOpen(null)}
              >
                <button
                  onClick={() => navigatePage(label)}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition ${activePage === label ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  {label}
                  {index > 0 && <ChevronDown className="size-3" />}
                </button>
                {menuOpen === label && index > 0 && (
                  <div className="nav-popover absolute top-8 left-0 z-30 w-44 before:absolute before:-top-1 before:left-0 before:h-1 before:w-full before:content-['']">
                    <p className="px-2 py-1.5 text-[11px] font-medium text-muted-foreground">
                      {label}
                    </p>
                    {systemPages.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          navigatePage(sub)
                          setMenuOpen(null)
                        }}
                        className="block w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-1">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="主题颜色"
              onClick={() => setPaletteOpen(!paletteOpen)}
            >
              <Palette className="size-3.5" />
            </Button>
            {paletteOpen && (
              <div className="absolute top-9 right-0 z-30 w-48 rounded-lg border bg-popover p-3 shadow-xl">
                <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">
                  主题颜色
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    ["blue", "violet", "emerald", "orange"] as ColorTheme[]
                  ).map((item) => (
                    <button
                      key={item}
                      aria-label={item}
                      onClick={() => {
                        setColorTheme(item)
                        setPaletteOpen(false)
                      }}
                      className={`theme-dot theme-${item} ${colorTheme === item ? "ring-2 ring-ring ring-offset-2" : ""}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="切换明暗主题"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="size-3.5" />
            ) : (
              <Moon className="size-3.5" />
            )}
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="通知">
            <Bell className="size-3.5" />
          </Button>
          <div className="mx-1 hidden h-5 w-px bg-border sm:block" />
          <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen}>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="h-8 gap-2 px-1.5 text-primary-foreground hover:bg-white/15 hover:text-primary-foreground focus-visible:border-transparent focus-visible:ring-0 aria-expanded:bg-white/20 aria-expanded:text-primary-foreground data-popup-open:bg-white/20"
                  aria-label="账户菜单"
                  onMouseEnter={keepProfileOpen}
                  onMouseLeave={scheduleProfileClose}
                >
                  <div className="grid size-7 place-items-center rounded-full bg-white/20 text-[11px] font-semibold text-white">
                    {(user.displayName || user.username)
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>
                  <span className="hidden text-xs font-medium sm:block">
                    {user.displayName || user.username}
                  </span>
                  <ChevronDown className="hidden size-3 text-primary-foreground/75 sm:block" />
                </Button>
              }
            />
            <DropdownMenuContent
              align="end"
              className="nav-popover w-44"
              onMouseEnter={keepProfileOpen}
              onMouseLeave={scheduleProfileClose}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-2 py-1.5 text-[11px]">
                  账户设置
                </DropdownMenuLabel>
                <DropdownMenuItem
                  className="h-8 cursor-pointer rounded-md text-sm"
                  onClick={() => navigatePage("个人资料")}
                >
                  <UserRound className="size-3.5" />
                  个人资料
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                variant="destructive"
                className="h-8 cursor-pointer rounded-md text-sm"
                onClick={logout}
              >
                <LogOut className="size-3.5" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {activePage === "工作台" ? (
        <main className="mx-auto max-w-6xl p-4 lg:p-6">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="mb-1 text-xs text-muted-foreground">
                {new Date().toLocaleDateString("zh-CN", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <h1 className="text-xl font-semibold tracking-tight">
                早上好，{user.displayName || user.username} 👋
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                这是今天的工作概览，一切运行良好。
              </p>
            </div>
            <Button size="sm" className="hidden sm:flex">
              <Menu className="mr-1.5 size-3.5" />
              快捷操作
            </Button>
          </div>
          <Stats />
          <div className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_1fr]">
            <ActivityCard />
            <QuickActions />
          </div>
        </main>
      ) : activePage === "个人资料" || activePage === "账户密码" ? (
        <ProfilePage user={user} page={activePage} />
      ) : (
        <SystemPage key={activePage} page={activePage} />
      )}
    </div>
  )
}

function ProfilePage({ user, page }: { user: User; page: string }) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState("")
  const [saving, setSaving] = useState(false)
  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage("")
    try {
      await apiFetch("/auth/password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      setCurrentPassword("")
      setNewPassword("")
      setMessage("密码修改成功")
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "修改失败")
    } finally {
      setSaving(false)
    }
  }
  const sections = [{
    label: "个人",
    items: [["个人资料", UserRound], ["账户密码", ShieldCheck]],
  }] as const
  return (
    <main className="settings-page">
      <aside className="settings-sidebar">
        <nav aria-label="设置导航" className="settings-nav">
          {sections.map((section) => (
            <div className="settings-nav-group" key={section.label}>
              <p>{section.label}</p>
              {section.items.map(([label, Icon]) => (
                <button
                  key={label}
                  className={`settings-nav-item ${label === page ? "is-active" : ""}`}
                  onClick={() => {
                    const route = pageRoutes[label]
                    window.history.pushState({}, "", route)
                    window.dispatchEvent(new PopStateEvent("popstate"))
                  }}
                >
                  <Icon className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <section className="settings-content">
        <div className="settings-content-inner">
          <header className="settings-heading">
            <p>个人设置</p>
            <h1>{page}</h1>
            <span>{page === "个人资料" ? "管理您的个人信息和账户资料" : "保护您的账户安全"}</span>
          </header>

          {page === "个人资料" ? (
            <section className="settings-section">
              <h2>基本资料</h2>
              <div className="settings-profile-list">
                <div className="settings-profile-row">
                  <span><strong>账号</strong><small>用于登录系统的账号名称</small></span>
                  <span className="settings-profile-value">{user.username}<Pencil className="size-4" aria-hidden="true" /></span>
                </div>
                <div className="settings-profile-row">
                  <span><strong>姓名</strong><small>在工作台和账户菜单中显示的名称</small></span>
                  <span className="settings-profile-value">{user.displayName || "未设置"}<Pencil className="size-4" aria-hidden="true" /></span>
                </div>
              </div>
              <h2 className="settings-security-title">账户安全</h2>
              <button
                className="settings-security-link"
                onClick={() => {
                  window.history.pushState({}, "", pageRoutes["账户密码"])
                  window.dispatchEvent(new PopStateEvent("popstate"))
                }}
              >
                <span><strong>账户密码</strong><small>定期更新密码可以有效保护您的账户安全</small></span>
                <span>修改密码 <ChevronRight className="size-4" /></span>
              </button>
            </section>
          ) : (
            <section className="settings-section settings-password-section">
              <h2>修改密码</h2>
              <form onSubmit={changePassword} className="settings-password-card">
                <div><p className="settings-row-title">更新登录密码</p><p className="settings-row-description">建议使用至少 8 位，并包含字母和数字的密码。</p></div>
                <div className="settings-password-fields">
                  <Input required type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="当前密码" aria-label="当前密码" />
                  <Input required minLength={8} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="新密码（至少 8 位）" aria-label="新密码" />
                  <Button type="submit" disabled={saving}>{saving ? "保存中…" : "保存密码"}</Button>
                </div>
                {message && <p className="settings-form-message">{message}</p>}
              </form>
            </section>
          )}
        </div>
      </section>
    </main>
  )
}

function SystemPage({ page }: { page: string }) {
  const config = pageConfig[page]
  const [rows, setRows] = useState<SystemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<SystemRow | null>(null)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    let cancelled = false
    apiFetch<{ items?: SystemRow[] } | SystemRow[]>(
      `${config.endpoint}?page=${pageNumber}&pageSize=${pageSize}`
    )
      .then((data: { items?: SystemRow[]; total?: number } | SystemRow[]) => {
        if (!cancelled) {
          setRows(Array.isArray(data) ? data : (data.items ?? []))
          setTotal(Array.isArray(data) ? data.length : (data.total ?? 0))
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled)
          setError(reason instanceof Error ? reason.message : "加载失败")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [config.endpoint, pageNumber, pageSize])
  function openEditor(row?: SystemRow) {
    setEditingRow(row ?? null)
    setFormValues(
      Object.fromEntries(
        config.columns.map(([key]) => [key, String(row?.[key] ?? "")])
      )
    )
    setDialogOpen(true)
  }
  async function saveRow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    try {
      const id = editingRow?.id
      await apiFetch(`${config.endpoint}${id ? `/${id}` : ""}`, {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(formValues),
      })
      setDialogOpen(false)
      setPageNumber(1)
      setLoading(true)
      const data = await apiFetch<
        { items?: SystemRow[]; total?: number } | SystemRow[]
      >(`${config.endpoint}?page=1&pageSize=${pageSize}`)
      setRows(Array.isArray(data) ? data : (data.items ?? []))
      setTotal(Array.isArray(data) ? data.length : (data.total ?? 0))
    } finally {
      setSaving(false)
      setLoading(false)
    }
  }
  async function deleteRow(row: SystemRow) {
    if (!row.id || !window.confirm("确定删除这条记录吗？")) return
    setLoading(true)
    try {
      await apiFetch(`${config.endpoint}/${row.id}`, { method: "DELETE" })
      setRows((current) => current.filter((item) => item.id !== row.id))
      setTotal((value) => Math.max(0, value - 1))
    } finally {
      setLoading(false)
    }
  }
  return (
    <main className="mx-auto max-w-6xl p-4 lg:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">系统设置</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">{page}</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            统一管理系统基础数据与操作记录。
          </p>
        </div>
        <Button
          size="sm"
          disabled={page.includes("日志")}
          onClick={() => openEditor()}
        >
          <span className="mr-1 text-base">+</span>新建
        </Button>
      </div>
      <div className="rounded-xl border bg-background shadow-sm">
        <div className="flex items-center justify-between border-b p-4">
          <Input className="h-8 max-w-xs" placeholder={`搜索${page}...`} />
        </div>
        {error ? (
          <p className="p-8 text-center text-sm text-destructive">{error}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {config.columns.map(([, label]) => (
                  <TableHead key={label}>{label}</TableHead>
                ))}
                <TableHead className="w-24 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={config.columns.length + 1}
                    className="h-24 text-center text-muted-foreground"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Spinner className="text-primary" />
                      加载中…
                    </span>
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={config.columns.length + 1}
                    className="h-24 text-center text-muted-foreground"
                  >
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, index) => (
                  <TableRow key={String(row.id ?? index)}>
                    {config.columns.map(([key]) => (
                      <TableCell key={key}>{String(row[key] ?? "-")}</TableCell>
                    ))}
                    <TableCell className="text-right">
                      <Button
                        variant="link"
                        size="sm"
                        className="h-7 px-1"
                        onClick={() => openEditor(row)}
                      >
                        编辑
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-7 px-1 text-destructive"
                        onClick={() => deleteRow(row)}
                      >
                        删除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
        {!loading &&
          !error &&
          (() => {
            const totalPages = Math.max(1, Math.ceil(total / pageSize))
            const visiblePages = Array.from(
              new Set([
                1,
                pageNumber - 1,
                pageNumber,
                pageNumber + 1,
                totalPages,
              ])
            )
              .filter((value) => value >= 1 && value <= totalPages)
              .sort((a, b) => a - b)
            return (
              <div className="flex flex-wrap items-center justify-end gap-4 border-t px-4 py-3 text-xs">
                <span className="text-xs text-muted-foreground">
                  共 {total} 条 · 第 {pageNumber}/{totalPages} 页
                </span>
                <Pagination className="mx-0 w-auto justify-end text-xs">
                  <PaginationContent className="text-xs">
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        size="default"
                        className={
                          pageNumber === 1
                            ? "pointer-events-none text-xs opacity-50"
                            : "text-xs"
                        }
                        onClick={(event) => {
                          event.preventDefault()
                          if (pageNumber !== 1) {
                            setLoading(true)
                            setPageNumber(1)
                          }
                        }}
                      >
                        首页
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationPrevious
                        text="上一页"
                        href="#"
                        className={
                          pageNumber === 1
                            ? "pointer-events-none text-xs opacity-50"
                            : "text-xs"
                        }
                        onClick={(event) => {
                          event.preventDefault()
                          if (pageNumber === 1) return
                          setLoading(true)
                          setPageNumber((value) => Math.max(1, value - 1))
                        }}
                      />
                    </PaginationItem>
                    {visiblePages.map((value, index) => {
                      const previous = visiblePages[index - 1]
                      return (
                        <Fragment key={value}>
                          {previous && value - previous > 1 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              isActive={value === pageNumber}
                              onClick={(event) => {
                                event.preventDefault()
                                if (value !== pageNumber) {
                                  setLoading(true)
                                  setPageNumber(value)
                                }
                              }}
                            >
                              {value}
                            </PaginationLink>
                          </PaginationItem>
                        </Fragment>
                      )
                    })}
                    <PaginationItem>
                      <PaginationNext
                        text="下一页"
                        href="#"
                        className={
                          pageNumber >= totalPages
                            ? "pointer-events-none text-xs opacity-50"
                            : "text-xs"
                        }
                        onClick={(event) => {
                          event.preventDefault()
                          if (pageNumber < totalPages) {
                            setLoading(true)
                            setPageNumber((value) => value + 1)
                          }
                        }}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        size="default"
                        className={
                          pageNumber >= totalPages
                            ? "pointer-events-none text-xs opacity-50"
                            : "text-xs"
                        }
                        onClick={(event) => {
                          event.preventDefault()
                          if (pageNumber < totalPages) {
                            setLoading(true)
                            setPageNumber(totalPages)
                          }
                        }}
                      >
                        末页
                      </PaginationLink>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>每页</span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(value) => {
                      const size = Number(value)
                      if (size && size !== pageSize) {
                        setLoading(true)
                        setPageSize(size)
                        setPageNumber(1)
                      }
                    }}
                  >
                    <SelectTrigger size="sm" className="h-7 w-16 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 50].map((size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>条</span>
                </div>
              </div>
            )
          })()}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRow ? `编辑${page}` : `新建${page}`}
            </DialogTitle>
            <DialogDescription>请填写基础信息后保存。</DialogDescription>
          </DialogHeader>
          <form onSubmit={saveRow} className="space-y-4">
            {config.columns.map(([key, label]) => (
              <label key={key} className="grid gap-2 text-sm font-medium">
                {label}
                <Input
                  required={key !== "description"}
                  value={formValues[key] ?? ""}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                  placeholder={`请输入${label}`}
                />
              </label>
            ))}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                取消
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "保存中…" : "保存"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}

function Stats() {
  const cards = [
    { label: "活跃用户", value: "2,481", change: "+12.5%", icon: Users },
    { label: "今日请求", value: "18,294", change: "+8.2%", icon: Activity },
    {
      label: "系统可用性",
      value: "99.98%",
      change: "+0.04%",
      icon: ShieldCheck,
    },
    { label: "待处理事项", value: "24", change: "-3.1%", icon: Bell },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, change, icon: Icon }) => (
        <div
          key={label}
          className="rounded-xl border bg-background p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
            <ArrowUpRight className="size-3" />
            {change}
            <span className="text-muted-foreground">较上周</span>
          </p>
        </div>
      ))}
    </div>
  )
}
function ActivityCard() {
  return (
    <section className="rounded-xl border bg-background p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">访问趋势</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            过去 30 天的系统访问量
          </p>
        </div>
        <Button variant="outline" size="sm">
          最近 30 天 <ChevronDown className="ml-1 size-3.5" />
        </Button>
      </div>
      <div className="mt-6 flex h-48 items-end gap-2 sm:gap-3">
        {[
          38, 48, 42, 62, 56, 70, 58, 78, 68, 82, 74, 91, 79, 88, 94, 82, 97,
          89, 100, 86, 93, 78,
        ].map((height, index) => (
          <div
            key={index}
            className="group relative flex h-full flex-1 items-end"
          >
            <div
              style={{ height: `${height}%` }}
              className="w-full rounded-t-md bg-primary/15 transition group-hover:bg-primary/40"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 rounded-t-md bg-gradient-to-t from-primary/20 to-transparent" />
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-[11px] text-muted-foreground">
        <span>5月 01日</span>
        <span>5月 08日</span>
        <span>5月 15日</span>
        <span>5月 22日</span>
        <span>5月 30日</span>
      </div>
    </section>
  )
}
function QuickActions() {
  return (
    <section className="rounded-xl border bg-background p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">快捷入口</h2>
          <p className="mt-1 text-xs text-muted-foreground">快速访问常用功能</p>
        </div>
        <CircleHelp className="size-4 text-muted-foreground" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {[
          { icon: Users, label: "用户管理", desc: "管理团队成员" },
          { icon: ShieldCheck, label: "角色权限", desc: "配置访问权限" },
          { icon: BarChart3, label: "数据分析", desc: "查看业务数据" },
          { icon: Settings2, label: "系统设置", desc: "调整系统配置" },
        ].map(({ icon: Icon, label, desc }) => (
          <button
            key={label}
            className="group rounded-lg border p-3 text-left transition hover:border-primary/40 hover:bg-primary/5"
          >
            <div className="mb-4 grid size-8 place-items-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
              <Icon className="size-4" />
            </div>
            <p className="text-sm font-medium">{label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
          </button>
        ))}
      </div>
    </section>
  )
}
export default App
