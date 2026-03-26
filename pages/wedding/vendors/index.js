const { query, add, update, remove } = require('../../../utils/db')
const { VENDOR_TYPES } = require('../../../utils/templates')
const { toast, confirm, formatMoney, showLoading, hideLoading } = require('../../../utils/util')

const STATUSES = ['待定', '已定', '已付款']
const ALL_TYPES = ['全部', ...VENDOR_TYPES]

Page({
  data: {
    vendors: [],
    activeType: '全部',
    ALL_TYPES,
    VENDOR_TYPES,
    STATUSES,
    showModal: false,
    editingId: null,
    form: {
      type: '摄影师', name: '', contact: '', phone: '',
      price: '', status: '待定', notes: ''
    }
  },

  onLoad() { this.loadVendors() },
  onShow() { this.loadVendors() },

  async loadVendors() {
    const vendors = await query('vendors')
    vendors.sort((a, b) => {
      const order = { '已付款': 0, '已定': 1, '待定': 2 }
      return (order[a.status] || 2) - (order[b.status] || 2)
    })
    this.setData({ vendors })
  },

  switchType(e) {
    this.setData({ activeType: e.currentTarget.dataset.type })
  },

  openAdd() {
    this.setData({
      showModal: true,
      editingId: null,
      form: { type: '摄影师', name: '', contact: '', phone: '', price: '', status: '待定', notes: '' }
    })
  },

  editVendor(e) {
    const vendor = e.currentTarget.dataset.vendor
    this.setData({
      showModal: true,
      editingId: vendor._id,
      form: {
        type: vendor.type || '摄影师',
        name: vendor.name || '',
        contact: vendor.contact || '',
        phone: vendor.phone || '',
        price: vendor.price ? String(vendor.price) : '',
        status: vendor.status || '待定',
        notes: vendor.notes || ''
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
    this.setData({ 'form.type': VENDOR_TYPES[e.detail.value] })
  },

  onStatusPick(e) {
    this.setData({ 'form.status': STATUSES[e.detail.value] })
  },

  async saveVendor() {
    const { form, editingId } = this.data
    if (!form.name.trim()) { toast('请输入供应商名称'); return }
    showLoading('保存中...')
    try {
      const data = {
        ...form,
        price: form.price ? Number(form.price) : 0
      }
      if (editingId) {
        await update('vendors', editingId, data)
      } else {
        await add('vendors', data)
      }
      hideLoading()
      this.setData({ showModal: false })
      this.loadVendors()
      toast('已保存', 'success')
    } catch {
      hideLoading()
      toast('保存失败')
    }
  },

  async deleteVendor(e) {
    const { id } = e.currentTarget.dataset
    try {
      await confirm('确认删除此供应商？')
      await remove('vendors', id)
      this.loadVendors()
      toast('已删除')
    } catch {}
  },

  callVendor(e) {
    const { phone } = e.currentTarget.dataset
    if (!phone) { toast('未填写电话'); return }
    wx.makePhoneCall({ phoneNumber: phone })
  },

  formatMoney(v) { return formatMoney(v) }
})
