<template>
  <el-card>
    <template #header>
      <div style="display: flex; align-items: center; gap: 12px">
        <span>下属日报</span>
        <el-date-picker
          v-model="date"
          type="date"
          value-format="YYYY-MM-DD"
          :clearable="false"
          @change="load"
        />
      </div>
    </template>
    <el-empty v-if="items.length === 0" description="暂无下属员工" />
    <el-collapse v-else v-model="expanded">
      <el-collapse-item v-for="item in items" :key="item.userId" :name="item.userId">
        <template #title>
          <span style="margin-right: 12px">{{ item.userName }}</span>
          <el-tag v-if="item.report" type="success" size="small">已提交</el-tag>
          <el-tag v-else type="danger" size="small">未提交</el-tag>
        </template>
        <div v-if="item.report">
          <pre class="content">{{ item.report.content }}</pre>
          <div class="meta">最后更新：{{ formatTime(item.report.updatedAt) }}</div>
        </div>
        <div v-else class="meta">该员工当天未提交日报</div>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api'

function fmt(d) {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

const date = ref(fmt(new Date()))
const items = ref([])
const expanded = ref([])

async function load() {
  items.value = await api.get('/reports/subordinates', { params: { date: date.value } })
  expanded.value = items.value.filter((i) => i.report).map((i) => i.userId)
}

function formatTime(t) {
  return t ? t.replace('T', ' ').slice(0, 19) : ''
}

load()
</script>

<style scoped>
.content {
  white-space: pre-wrap;
  margin: 0;
  font-family: inherit;
}
.meta {
  margin-top: 8px;
  color: #909399;
  font-size: 12px;
}
</style>
