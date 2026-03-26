const { toast, showLoading, hideLoading } = require('../../../utils/util')

Page({
  data: {
    form: {
      groomName: '',
      brideName: '',
      weddingDate: '',
      weddingTime: '18:00',
      venue: '',
      venueAddress: '',
      extraMessage: '期待您的光临，共证我们的幸福时刻'
    },
    canvasReady: false,
    imageSaved: false,
    previewImagePath: ''
  },

  onLoad() {
    const app = getApp()
    const info = app.globalData.projectInfo
    if (info) {
      this.setData({
        'form.groomName': info.groomName || '',
        'form.brideName': info.brideName || '',
        'form.weddingDate': info.weddingDate || ''
      })
    }
  },

  onInput(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ [`form.${key}`]: e.detail.value })
  },

  onDateChange(e) {
    this.setData({ 'form.weddingDate': e.detail.value })
  },

  async generateInvitation() {
    const { form } = this.data
    if (!form.groomName || !form.brideName) {
      toast('请填写新郎新娘姓名'); return
    }
    if (!form.weddingDate) {
      toast('请选择婚礼日期'); return
    }
    showLoading('生成中...')
    try {
      const path = await this.drawInvitation(form)
      hideLoading()
      this.setData({ previewImagePath: path, imageSaved: false })
    } catch (e) {
      hideLoading()
      console.error(e)
      toast('生成失败，请重试')
    }
  },

  drawInvitation(form) {
    return new Promise((resolve, reject) => {
      const query = wx.createSelectorQuery()
      query.select('#invitationCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res || !res[0] || !res[0].node) {
            reject(new Error('canvas not found'))
            return
          }
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          const dpr = wx.getWindowInfo ? wx.getWindowInfo().pixelRatio : 2
          const W = 600, H = 900
          canvas.width = W * dpr
          canvas.height = H * dpr
          ctx.scale(dpr, dpr)

          // Background gradient
          const bg = ctx.createLinearGradient(0, 0, W, H)
          bg.addColorStop(0, '#FDF0F0')
          bg.addColorStop(0.5, '#FDF8F5')
          bg.addColorStop(1, '#FFF5E6')
          ctx.fillStyle = bg
          ctx.fillRect(0, 0, W, H)

          // Border decoration
          ctx.strokeStyle = '#C9956C'
          ctx.lineWidth = 3
          ctx.strokeRect(20, 20, W - 40, H - 40)
          ctx.strokeStyle = '#E8B4B8'
          ctx.lineWidth = 1
          ctx.strokeRect(28, 28, W - 56, H - 56)

          // Corner ornaments
          this.drawCornerOrnament(ctx, 20, 20, 1, 1)
          this.drawCornerOrnament(ctx, W - 20, 20, -1, 1)
          this.drawCornerOrnament(ctx, 20, H - 20, 1, -1)
          this.drawCornerOrnament(ctx, W - 20, H - 20, -1, -1)

          // 囍 character
          ctx.font = 'bold 100px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillStyle = '#C9956C'
          ctx.fillText('囍', W / 2, 160)

          // Decorative line
          ctx.strokeStyle = '#E8B4B8'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(80, 190)
          ctx.lineTo(W - 80, 190)
          ctx.stroke()

          // Subtitle
          ctx.font = '28px sans-serif'
          ctx.fillStyle = '#999'
          ctx.textAlign = 'center'
          ctx.fillText('婚礼邀请函', W / 2, 230)

          // Names
          ctx.font = 'bold 56px sans-serif'
          ctx.fillStyle = '#8B4513'
          ctx.textAlign = 'center'
          ctx.fillText(form.groomName + ' & ' + form.brideName, W / 2, 320)

          // Decorative dots
          ctx.fillStyle = '#E8B4B8'
          for (let i = 0; i < 5; i++) {
            ctx.beginPath()
            ctx.arc(W / 2 - 40 + i * 20, 350, 4, 0, Math.PI * 2)
            ctx.fill()
          }

          // Date section
          ctx.fillStyle = '#FEF3E2'
          ctx.beginPath()
          this.roundRect(ctx, 80, 370, W - 160, 110, 16)
          ctx.fill()
          ctx.font = 'bold 36px sans-serif'
          ctx.fillStyle = '#C9956C'
          ctx.textAlign = 'center'
          ctx.fillText(form.weddingDate + ' ' + form.weddingTime, W / 2, 435)

          // Venue
          ctx.font = '30px sans-serif'
          ctx.fillStyle = '#555'
          ctx.textAlign = 'center'
          ctx.fillText(form.venue || '婚礼现场', W / 2, 530)

          if (form.venueAddress) {
            ctx.font = '24px sans-serif'
            ctx.fillStyle = '#999'
            ctx.textAlign = 'center'
            ctx.fillText(form.venueAddress, W / 2, 570)
          }

          // Separator
          ctx.strokeStyle = '#F0D9C8'
          ctx.lineWidth = 1
          ctx.setLineDash([6, 4])
          ctx.beginPath()
          ctx.moveTo(80, 610)
          ctx.lineTo(W - 80, 610)
          ctx.stroke()
          ctx.setLineDash([])

          // Extra message
          ctx.font = '26px sans-serif'
          ctx.fillStyle = '#888'
          ctx.textAlign = 'center'
          const msg = form.extraMessage || ''
          if (msg.length > 0) {
            ctx.fillText(msg, W / 2, 660)
          }

          // Footer
          ctx.font = '22px sans-serif'
          ctx.fillStyle = '#C9956C'
          ctx.textAlign = 'center'
          ctx.fillText('— 爱情·承诺·永恒 —', W / 2, 820)

          // Small hearts
          ctx.font = '30px sans-serif'
          ctx.fillText('♥', W / 2 - 50, 770)
          ctx.fillText('♥', W / 2, 770)
          ctx.fillText('♥', W / 2 + 50, 770)

          wx.canvasToTempFilePath({
            canvas,
            success: res => resolve(res.tempFilePath),
            fail: reject
          })
        })
    })
  },

  roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  },

  drawCornerOrnament(ctx, x, y, sx, sy) {
    ctx.strokeStyle = '#C9956C'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x + sx * 8, y)
    ctx.lineTo(x + sx * 36, y)
    ctx.moveTo(x, y + sy * 8)
    ctx.lineTo(x, y + sy * 36)
    ctx.stroke()
  },

  saveImage() {
    const { previewImagePath } = this.data
    if (!previewImagePath) { toast('请先生成请柬'); return }
    wx.saveImageToPhotosAlbum({
      filePath: previewImagePath,
      success: () => {
        this.setData({ imageSaved: true })
        toast('已保存到相册', 'success')
      },
      fail: (e) => {
        if (e.errMsg && e.errMsg.includes('auth')) {
          wx.showModal({
            title: '需要权限',
            content: '请在设置中允许访问相册',
            showCancel: false
          })
        } else {
          toast('保存失败')
        }
      }
    })
  },

  shareInvitation() {
    if (!this.data.previewImagePath) { toast('请先生成请柬'); return }
    toast('长按图片可转发分享')
  }
})
