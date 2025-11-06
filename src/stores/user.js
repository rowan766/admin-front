import { defineStore } from 'pinia'
import { login as loginApi, getUserMenus as getUserMenusApi } from '../api/auth'

export const useUserStore = defineStore('user', {
  // 状态
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null,
    menuInfo: null
  }),

  // 计算属性
  getters: {
    isLoggedIn: (state) => !!state.token,
    username: (state) => state.userInfo?.username || '未登录',
    menus: (state) => state.menuInfo || []
  },

  // 方法
  actions: {
    // 登录
    async login(credentials) {
      try {
        const res = await loginApi(credentials)
        this.token = res.data.access_token
        this.userInfo = res.data.user
        localStorage.setItem('token', this.token)
        await this.getUserMenus()
        return res
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
      localStorage.removeItem('token')
    }
  }
})
