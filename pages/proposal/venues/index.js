const { query, add, update, remove } = require('../../../utils/db')
const { VENUE_EXAMPLES } = require('../../../utils/templates')
const { toast, confirm, showLoading, hideLoading } = require('../../../utils/util')

const TYPES = ['全部', '餐厅', '公园', '室内', '户外']
const TYPE_MAP = { restaurant: '餐厅', park: '公园', indoor: '室内', outdoor: '户外' }

Page({
  data: {
    examples: VENUE_EXAMPLES,
    myVenues: [],
    activeType: '全部',
    activeTab: 'examples', // examples | mine
    TYPES,
    showModal: false,
    editingId: null,
    form: {
      name: '', type: 'restaurant', typeLabel: '餐厅',
      desc: '', tips: '', suitable: '', budget: '', notes: ''
    },
    typeOptions: ['餐厅', '公园', '室内', '户外'],
    typeValues: ['restaurant', 'park', 'indoor', 'outdoor']
  },

  onLoad() { this.loadMyVenues() },
  onShow() { this.loadMyVenues() },

  async loadMyVenues() {
    const venues = await query('venues')
    this.setData({ myVenues: venues })
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab })
  },

  switchType(e) {
    this.setData({ activeType: e.currentTarget.dataset.type })
  },

  // 从示例复制到我的场地
  async duplicateExample(e) {
    const example = e.currentTarget.dataset.item
    showLoading('添加中...')
    try {
      await add('venues', {
        name: example.name,
        type: example.type,
        typeLabel: example.typeLabel,
        desc: example.desc,
        tips: example.tips,
        suitable: example.suitable,
        budget: example.budget,
        notes: ''
      })
      hideLoading()
      toast('已复制到我的场地', 'success')
      this.setData({ activeTab: 'mine' })
      this.loadMyVenues()
    } catch (e) {
      hideLoading()
      toast('操作失败')
    }
  },

  // 新建场地
  openAdd() {
    this.setData({
      showModal: true,
      editingId: null,
      form: { name: '', type: 'restaurant', typeLabel: '餐厅', desc: '', tips: '', suitable: '', budget: '', notes: '' }
    })
  },

  // 编辑场地
  editVenue(e) {
    const venue = e.currentTarget.dataset.venue
    this.setData({
      showModal: true,
      editingId: venue._id,
      form: {
        name: venue.name || '',
        type: venue.type || 'restaurant',
        typeLabel: venue.typeLabel || '餐厅',
        desc: venue.desc || '',
        tips: venue.tips || '',
        suitable: venue.suitable || '',
        budget: venue.budget || '',
        notes: venue.notes || ''
      }
    })
  },

  closeModal() {
    this.setData({ showModal: false })
  },

  onInput(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ [`form.${key}`]: e.detail.value })
  },

  onTypePick(e) {
    const idx = e.detail.value
    const typeValues = ['restaurant', 'park', 'indoor', 'outdoor']
    const typeLabels = ['餐厅', '公园', '室内', '户外']
    this.setData({
      'form.type': typeValues[idx],
      'form.typeLabel': typeLabels[idx]
    })
  },

  async saveVenue() {
    const { form, editingId } = this.data
    if (!form.name.trim()) { toast('请输入场地名称'); return }
    showLoading('保存中...')
    try {
      if (editingId) {
        await update('venues', editingId, { ...form })
      } else {
        await add('venues', { ...form })
      }
      hideLoading()
      this.setData({ showModal: false })
      this.loadMyVenues()
      toast(editingId ? '已更新' : '已添加', 'success')
    } catch (err) {
      hideLoading()
      toast('保存失败')
    }
  },

  async deleteVenue(e) {
    const { id } = e.currentTarget.dataset
    try {
      await confirm('确认删除此场地？')
      await remove('venues', id)
      this.loadMyVenues()
      toast('已删除')
    } catch {}
  }
})
