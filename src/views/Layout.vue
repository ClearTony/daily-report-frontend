<template>
  <el-container style="height: 100vh">
    <el-header class="header">
      <span class="title">日报管理系统</span>
      <div>
        <span style="margin-right: 16px">
          {{ user?.name }}（{{ roleText }}）
        </span>
        <el-button size="small" @click="logout">退出登录</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="180px">
        <el-menu :default-active="$route.path" router style="height: 100%">
          <el-menu-item v-if="user?.role !== 'ADMIN'" index="/my-reports">我的日报</el-menu-item>
          <el-menu-item v-if="user?.role === 'LEADER'" index="/team-reports">下属日报</el-menu-item>
          <el-menu-item v-if="user?.role === 'ADMIN'" index="/admin/users">用户管理</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { currentUser } from '../api'

const router = useRouter()
const user = currentUser()
const roleText = computed(() =>
  ({ ADMIN: '超级管理员', LEADER: '领导', EMPLOYEE: '员工' })[user?.role] || ''
)

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #409eff;
  color: #fff;
}
.title {
  font-size: 18px;
  font-weight: bold;
}
</style>
