const { query, add, update, remove } = require('../../../utils/db')
const { VOW_TEMPLATES } = require('../../../utils/templates')
const { toast, confirm, showLoading, hideLoading } = require('../../../utils/util')

Page({
  data: {
    templates: VOW_TEMPLATES,
    myVows: [],
    activeTab: 'templates', // templates | mine
    showModal: false,
    editingId: null,
    form: { title: '', content: '' }
  },

  onLoad() { this.loadMyVows() },
  onShow() { this.loadMyVows() },

  async loadMyVows() {
    const vows = await query('vows')
    this.setData({ myVows: vows })
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab })
  },

  async duplicateTemplate(e) {
    const tpl = e.currentTarget.dataset.tpl
    showLoading('复制中...')
    try {
      await add('vows', {
        title: tpl.title + '（我的版本）',
        content: tpl.content,
        selected: false
      })
      hideLoading()
      toast('已复制到我的誓言', 'success')
      this.setData({ activeTab: 'mine' })
      this.loadMyVows()
    } catch {
      hideLoading()
      toast('操作失败')
    }
  },

  openAdd() {
    this.setData({
      showModal: true,
      editingId: null,
      form: { title: '', content: '' }
    })
  },

  editVow(e) {
    const vow = e.currentTarget.dataset.vow
    this.setData({
      showModal: true,
      editingId: vow._id,
      form: { title: vow.title || '', content: vow.content || '' }
    })
  },

  closeModal() {
    this.setData({ showModal: false })
  },

  onInput(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ [`form.${key}`]: e.detail.value })
  },

  async saveVow() {
    const { form, editingId } = this.data
    if (!form.title.trim()) { toast('请输入标题'); return }
    if (!form.content.trim()) { toast('请输入誓言内容'); return }
    showLoading('保存中...')
    try {
      if (editingId) {
        await update('vows', editingId, { title: form.title, content: form.content })
      } else {
        await add('vows', { title: form.title, content: form.content, selected: false })
      }
      hideLoading()
      this.setData({ showModal: false })
      this.loadMyVows()
      toast('已保存', 'success')
    } catch {
      hideLoading()
      toast('保存失败')
    }
  },

  async selectVow(e) {
    const { id } = e.currentTarget.dataset
    showLoading('设置中...')
    try {
      // 先取消所有已选
      for (const vow of this.data.myVows) {
        if (vow.selected) {
          await update('vows', vow._id, { selected: false })
        }
      }
      await update('vows', id, { selected: true })
      hideLoading()
      this.loadMyVows()
      toast('已设为选用誓言', 'success')
    } catch {
      hideLoading()
      toast('操作失败')
    }
  },

  async deleteVow(e) {
    const { id } = e.currentTarget.dataset
    try {
      await confirm('确认删除此誓言？')
      await remove('vows', id)
      this.loadMyVows()
      toast('已删除')
    } catch {}
  }
})
