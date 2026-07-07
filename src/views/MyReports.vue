<template>
  <el-row :gutter="16">
    <el-col :span="14">
      <el-card>
        <template #header>我的日报日历（有绿点的日期表示已写日报）</template>
        <el-calendar v-model="calendarDate">
          <template #date-cell="{ data }">
            <div class="cell" @click="selectDate(data.day)">
              <span>{{ data.day.split('-')[2] }}</span>
              <span v-if="reportDates.includes(data.day)" class="dot"></span>
            </div>
          </template>
        </el-calendar>
      </el-card>
    </el-col>
    <el-col :span="10">
      <el-card>
        <template #header>
          {{ selectedDate }} 的日报
          <el-tag v-if="isToday" type="success" size="small" style="margin-left: 8px">今天</el-tag>
        </template>
        <el-input
          v-model="content"
          type="textarea"
          :rows="12"
          placeholder="请填写当天的工作内容..."
        />
        <div style="margin-top: 12px; text-align: right">
          <el-button type="primary" :loading="saving" @click="save">保存日报</el-button>
        </div>
        <div v-if="report" class="meta">
          最后更新：{{ formatTime(report.updatedAt) }}
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../api'

function fmt(d) {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

const today = fmt(new Date())
const calendarDate = ref(new Date())
const selectedDate = ref(today)
const reportDates = ref([])
const report = ref(null)
const content = ref('')
const saving = ref(false)

const isToday = computed(() => selectedDate.value === today)

async function loadDates() {
  const month = fmt(calendarDate.value).slice(0, 7)
  reportDates.value = await api.get('/reports/my/dates', { params: { month } })
}

async function loadReport() {
  report.value = await api.get('/reports/my', { params: { date: selectedDate.value } })
  content.value = report.value?.content || ''
}

function selectDate(day) {
  selectedDate.value = day
  loadReport()
}

async function save() {
  if (!content.value.trim()) {
    ElMessage.warning('日报内容不能为空')
    return
  }
  saving.value = true
  try {
    report.value = await api.post('/reports', {
      reportDate: selectedDate.value,
      content: content.value
    })
    ElMessage.success('保存成功')
    loadDates()
  } finally {
    saving.value = false
  }
}

function formatTime(t) {
  return t ? t.replace('T', ' ').slice(0, 19) : ''
}

watch(calendarDate, loadDates)
loadDates()
loadReport()
</script>

<style scoped>
.cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #67c23a;
}
.meta {
  margin-top: 8px;
  color: #909399;
  font-size: 12px;
}
</style>
