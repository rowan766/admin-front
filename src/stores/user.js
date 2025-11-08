import { defineStore } from 'pinia'
import { login as loginApi, getUserMenus as getUserMenusApi ,getUserProfile as getUserProfileApi} from '../api/auth'

export const useUserStore = defineStore('user', {
  // 状态
  state: () => ({
    token: '',
    userInfo: null,
    menuInfo: null,
    loading: false,
    error: null
  }),

  // 计算属性
  getters: {
    isLoggedIn: (state) => !!state.token,
    username: (state) => state.userInfo?.username || '未登录',
    nickname: (state) => state.userInfo?.nickname || '',
    avatarId: (state) => state.userInfo?.avatarId || '',
    menus: (state) => state.menuInfo || []
  },

  // 方法
  actions: {
    // 登录
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const res = await loginApi(credentials)
        this.token = res.data.access_token
        localStorage.setItem('token',res.data.access_token)
        await Promise.all([
          this.getUserProfile(),
          this.getUserMenus()
        ])
        return res
      } catch (error) {
        this.error = error.message || '登录失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    // 获取登录用户信息
    async getUserProfile() {
      try {
        const res = await getUserProfileApi()
        this.userInfo = res.data
        return res.data
      } catch (error) {
        throw error
      }
    },

    // 获取用户菜单信息
    async getUserMenus() {
      try {
        const res = await getUserMenusApi() 
        this.menuInfo = res.data
        return res.data
      } catch (error) {
        throw error
      }
    },
    // 退出登录
    logout() {
      this.token = ''
      this.userInfo = null
      this.menuInfo = null
      this.error = null
      piniaPluginPersistedstate.clearAll();
      localStorage.clear()
    }
  },

  // 持久化配置
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['userInfo', 'menuInfo']  // 只持久化这些字段，loading 和 error 不持久化
  }
})
 