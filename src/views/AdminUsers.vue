<template>
  <el-card>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>用户管理（维护领导-下属关系）</span>
        <el-button type="primary" @click="openCreate">新增用户</el-button>
      </div>
    </template>
    <el-table :data="users" border>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column label="角色" width="110">
        <template #default="{ row }">
          <el-tag :type="roleTag(row.role)">{{ roleText(row.role) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="所属领导">
        <template #default="{ row }">
          {{ row.leaderName || (row.role === 'EMPLOYEE' ? '未分配' : '—') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            :disabled="row.role === 'ADMIN'"
            @click="remove(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" :title="editing ? '编辑用户' : '新增用户'" width="420px">
    <el-form :model="form" label-width="90px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" :disabled="editing" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          v-model="form.password"
          type="password"
          show-password
          :placeholder="editing ? '留空则不修改' : ''"
        />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="form.role" style="width: 100%">
          <el-option label="普通员工" value="EMPLOYEE" />
          <el-option label="领导" value="LEADER" />
          <el-option label="超级管理员" value="ADMIN" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.role === 'EMPLOYEE'" label="所属领导">
        <el-select v-model="form.leaderId" clearable placeholder="选择领导" style="width: 100%">
          <el-option v-for="l in leaders" :key="l.id" :label="l.name" :value="l.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="save">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '../api'

const users = ref([])
const leaders = ref([])
const dialogVisible = ref(false)
const editing = ref(false)
const saving = ref(false)
const form = reactive({ id: null, username: '', password: '', name: '', role: 'EMPLOYEE', leaderId: null })

function roleText(r) {
  return { ADMIN: '超级管理员', LEADER: '领导', EMPLOYEE: '员工' }[r]
}
function roleTag(r) {
  return { ADMIN: 'danger', LEADER: 'warning', EMPLOYEE: 'info' }[r]
}

async function load() {
  users.value = await api.get('/admin/users')
  leaders.value = await api.get('/admin/leaders')
}

function openCreate() {
  editing.value = false
  Object.assign(form, { id: null, username: '', password: '', name: '', role: 'EMPLOYEE', leaderId: null })
  dialogVisible.value = true
}

function openEdit(row) {
  editing.value = true
  Object.assign(form, {
    id: row.id,
    username: row.username,
    password: '',
    name: row.name,
    role: row.role,
    leaderId: row.leaderId
  })
  dialogVisible.value = true
}

async function save() {
  if (!editing.value && (!form.username || !form.password || !form.name)) {
    ElMessage.warning('请填写完整信息')
    return
  }
  saving.value = true
  try {
    const payload = {
      username: form.username,
      password: form.password || null,
      name: form.name,
      role: form.role,
      leaderId: form.role === 'EMPLOYEE' ? form.leaderId : null
    }
    if (editing.value) {
      await api.put(`/admin/users/${form.id}`, payload)
    } else {
      await api.post('/admin/users', payload)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    load()
  } finally {
    saving.value = false
  }
}

async function remove(row) {
  await ElMessageBox.confirm(`确认删除用户「${row.name}」？`, '提示', { type: 'warning' })
  await api.delete(`/admin/users/${row.id}`)
  ElMessage.success('删除成功')
  load()
}

load()
</script>
