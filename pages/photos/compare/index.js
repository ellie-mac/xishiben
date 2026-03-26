const { query, add, update, remove } = require('../../../utils/db')
const { toast, confirm, showLoading, hideLoading } = require('../../../utils/util')

Page({
  data: {
    shops: [],
    showModal: false,
    editingId: null,
    form: {
      shopName: '',
      price: '',
      photos: '',
      duration: '',
      outfits: '',
      locations: '',
      includesAlbum: false,
      notes: '',
      rating: 0
    },
    ratingList: [1, 2, 3, 4, 5]
  },

  onLoad() { this.loadShops() },
  onShow() { this.loadShops() },

  async loadShops() {
    const shops = await query('photo_compares')
    shops.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    this.setData({ shops })
  },

  openAdd() {
    this.setData({
      showModal: true,
      editingId: null,
      form: { shopName: '', price: '', photos: '', duration: '', outfits: '', locations: '', includesAlbum: false, notes: '', rating: 0 }
    })
  },

  editShop(e) {
    const shop = e.currentTarget.dataset.shop
    this.setData({
      showModal: true,
      editingId: shop._id,
      form: {
        shopName: shop.shopName || '',
        price: shop.price ? String(shop.price) : '',
        photos: shop.photos ? String(shop.photos) : '',
        duration: shop.duration ? String(shop.duration) : '',
        outfits: shop.outfits ? String(shop.outfits) : '',
        locations: shop.locations || '',
        includesAlbum: shop.includesAlbum || false,
        notes: shop.notes || '',
        rating: shop.rating || 0
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

  toggleAlbum() {
    this.setData({ 'form.includesAlbum': !this.data.form.includesAlbum })
  },

  setRating(e) {
    this.setData({ 'form.rating': e.currentTarget.dataset.val })
  },

  async saveShop() {
    const { form, editingId } = this.data
    if (!form.shopName.trim()) { toast('请输入门店名称'); return }
    showLoading('保存中...')
    try {
      const data = {
        shopName: form.shopName.trim(),
        price: Number(form.price) || 0,
        photos: Number(form.photos) || 0,
        duration: Number(form.duration) || 0,
        outfits: Number(form.outfits) || 0,
        locations: form.locations.trim(),
        includesAlbum: form.includesAlbum,
        notes: form.notes.trim(),
        rating: form.rating
      }
      if (editingId) {
        await update('photo_compares', editingId, data)
      } else {
        await add('photo_compares', data)
      }
      hideLoading()
      this.setData({ showModal: false })
      this.loadShops()
      toast('已保存', 'success')
    } catch {
      hideLoading()
      toast('保存失败')
    }
  },

  async deleteShop(e) {
    const { id } = e.currentTarget.dataset
    try {
      await confirm('确认删除此门店？')
      await remove('photo_compares', id)
      this.loadShops()
      toast('已删除')
    } catch {}
  },

  renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) => i < rating ? '★' : '☆').join('')
  }
})
