const { query, add, update, remove } = require('../../../utils/db')
const { PARTY_DUTIES } = require('../../../utils/templates')
const { toast, confirm, showLoading, hideLoading } = require('../../../utils/util')

Page({
  data: {
    members: [],
    showModal: false,
    editingId: null,
    form: {
      name: '', role: '伴娘', phone: '', duties: []
    },
    ROLES: ['伴娘', '伴郎'],
    PARTY_DUTIES,
    dutyChecked: []
  },

  onLoad() { this.loadMembers() },
  onShow() { this.loadMembers() },

  async loadMembers() {
    const members = await query('party_members')
    this.setData({ members })
  },

  openAdd() {
    const dutyChecked = PARTY_DUTIES.map(() => false)
    this.setData({
      showModal: true,
      editingId: null,
      form: { name: '', role: '伴娘', phone: '', duties: [] },
      dutyChecked
    })
  },

  editMember(e) {
    const member = e.currentTarget.dataset.member
    const dutyChecked = PARTY_DUTIES.map(d => (member.duties || []).includes(d))
    this.setData({
      showModal: true,
      editingId: member._id,
      form: {
        name: member.name || '',
        role: member.role || '伴娘',
        phone: member.phone || '',
        duties: member.duties || []
      },
      dutyChecked
    })
  },

  closeModal() {
    this.setData({ showModal: false })
  },

  onInput(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ [`form.${key}`]: e.detail.value })
  },

  onRolePick(e) {
    const roles = ['伴娘', '伴郎']
    this.setData({ 'form.role': roles[e.detail.value] })
  },

  toggleDuty(e) {
    const idx = e.currentTarget.dataset.idx
    const checked = [...this.data.dutyChecked]
    checked[idx] = !checked[idx]
    const duties = PARTY_DUTIES.filter((_, i) => checked[i])
    this.setData({ dutyChecked: checked, 'form.duties': duties })
  },

  async saveMember() {
    const { form, editingId } = this.data
    if (!form.name.trim()) { toast('请输入姓名'); return }
    showLoading('保存中...')
    try {
      if (editingId) {
        await update('party_members', editingId, { ...form })
      } else {
        await add('party_members', { ...form })
      }
      hideLoading()
      this.setData({ showModal: false })
      this.loadMembers()
      toast('已保存', 'success')
    } catch {
      hideLoading()
      toast('保存失败')
    }
  },

  async deleteMember(e) {
    const { id } = e.currentTarget.dataset
    try {
      await confirm('确认删除此成员？')
      await remove('party_members', id)
      this.loadMembers()
      toast('已删除')
    } catch {}
  },

  callMember(e) {
    const { phone } = e.currentTarget.dataset
    if (!phone) { toast('未填写电话'); return }
    wx.makePhoneCall({ phoneNumber: phone })
  }
})
