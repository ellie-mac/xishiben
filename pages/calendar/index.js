const { query, add, remove } = require('../../utils/db')
const { isAuspicious, getLunarInfo } = require('../../utils/lunar')
const { toast, confirm, formatDate } = require('../../utils/util')

const WEEK_NAMES = ['日', '一', '二', '三', '四', '五', '六']

Page({
  data: {
    year: 0,
    month: 0,
    calendarDays: [],
    selectedDate: '',
    selectedLunar: null,
    selectedAuspicious: false,
    savedDates: [],
    today: ''
  },

  onLoad() {
    const now = new Date()
    const today = formatDate(now)
    this.setData({ year: now.getFullYear(), month: now.getMonth() + 1, today })
    this.buildCalendar()
    this.loadSavedDates()
  },

  onShow() {
    this.loadSavedDates()
  },

  buildCalendar() {
    const { year, month, today } = this.data
    const firstDay = new Date(year, month - 1, 1)
    const daysInMonth = new Date(year, month, 0).getDate()
    const startWday = firstDay.getDay() // 0=Sun

    const days = []
    // Padding from previous month
    for (let i = 0; i < startWday; i++) {
      days.push({ date: '', empty: true })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const m = String(month).padStart(2, '0')
      const day = String(d).padStart(2, '0')
      const dateStr = `${year}-${m}-${day}`
      const auspicious = isAuspicious(dateStr)
      const lunar = getLunarInfo(dateStr)
      days.push({
        date: dateStr,
        day: d,
        auspicious,
        isToday: dateStr === today,
        lunarDayStr: lunar.lunarDayStr,
        empty: false
      })
    }
    this.setData({ calendarDays: days })
  },

  prevMonth() {
    let { year, month } = this.data
    month--
    if (month < 1) { month = 12; year-- }
    this.setData({ year, month, selectedDate: '' })
    this.buildCalendar()
  },

  nextMonth() {
    let { year, month } = this.data
    month++
    if (month > 12) { month = 1; year++ }
    this.setData({ year, month, selectedDate: '' })
    this.buildCalendar()
  },

  selectDay(e) {
    const dateStr = e.currentTarget.dataset.date
    if (!dateStr) return
    const lunar = getLunarInfo(dateStr)
    const auspicious = isAuspicious(dateStr)
    this.setData({
      selectedDate: dateStr,
      selectedLunar: lunar,
      selectedAuspicious: auspicious
    })
  },

  async saveDate() {
    const { selectedDate, savedDates } = this.data
    if (!selectedDate) { toast('请先选择日期'); return }
    const already = savedDates.find(d => d.date === selectedDate)
    if (already) { toast('已经收藏过了'); return }
    await add('saved_dates', {
      date: selectedDate,
      auspicious: isAuspicious(selectedDate),
      lunarInfo: getLunarInfo(selectedDate)
    })
    this.loadSavedDates()
    toast('已收藏', 'success')
  },

  async removeSavedDate(e) {
    const { id } = e.currentTarget.dataset
    try {
      await confirm('确认取消收藏？')
      await remove('saved_dates', id)
      this.loadSavedDates()
      toast('已删除')
    } catch {}
  },

  async loadSavedDates() {
    const dates = await query('saved_dates')
    dates.sort((a, b) => (a.date > b.date ? 1 : -1))
    this.setData({ savedDates: dates })
  }
})
