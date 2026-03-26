/**
 * 所有模块的预设模板数据
 */

// 求婚任务模板
const PROPOSAL_TASKS = [
  // 策划
  { category: '策划', title: '确定求婚时间', desc: '选择一个她/他意想不到的时机', phase: '' },
  { category: '策划', title: '确定求婚主题风格', desc: '浪漫烛光/户外草地/惊喜电影/家庭温馨', phase: '' },
  { category: '策划', title: '邀请亲友助阵', desc: '提前告知闺蜜好友，当天帮忙拍照或配合', phase: '' },
  { category: '策划', title: '安排摄影师跟拍', desc: '求婚摄影师提前沟通拍摄位置和时机', phase: '' },
  { category: '策划', title: '通知双方家长', desc: '提前征得双方父母同意，增加仪式感', phase: '' },
  // 场地&布置
  { category: '场地布置', title: '确定求婚场地', desc: '餐厅/公园/家中/酒店天台等', phase: '' },
  { category: '场地布置', title: '预订场地', desc: '提前联系场地确认是否允许布置', phase: '' },
  { category: '场地布置', title: '采购鲜花', desc: '玫瑰/马蹄莲/满天星，数量根据场地决定', phase: '' },
  { category: '场地布置', title: '准备蜡烛/灯串', desc: '营造浪漫氛围，注意安全', phase: '' },
  { category: '场地布置', title: '定制横幅/气球', desc: '可以写上名字或特别的话', phase: '' },
  { category: '场地布置', title: '现场布置彩排', desc: '提前去现场模拟布置流程', phase: '' },
  // 戒指
  { category: '求婚戒指', title: '确定戒指款式和预算', desc: '钻石/黄金/铂金，根据喜好决定', phase: '' },
  { category: '求婚戒指', title: '实体店试戴对比', desc: '多家对比，了解真实品质', phase: '' },
  { category: '求婚戒指', title: '确认戒指尺寸', desc: '可以借助已有戒指或趁机量手指', phase: '' },
  { category: '求婚戒指', title: '购买并取件', desc: '注意购买时间，刻字需要提前', phase: '' },
  // 礼物&惊喜
  { category: '礼物惊喜', title: '准备求婚礼物', desc: '相册/定制礼物/她最喜欢的东西', phase: '' },
  { category: '礼物惊喜', title: '制作专属相册或视频', desc: '记录两人回忆的视频/相册', phase: '' },
  { category: '礼物惊喜', title: '预订求婚蛋糕', desc: '可以定制写有特殊文字的蛋糕', phase: '' },
  // 誓言
  { category: '求婚誓言', title: '撰写求婚誓言', desc: '真诚表达对TA的爱和承诺', phase: '' },
  { category: '求婚誓言', title: '多次朗读练习', desc: '确保当天不因紧张而忘词', phase: '' },
]

// 婚礼任务模板（按阶段）
const WEDDING_TASKS = [
  // 12个月前
  { phase: '提前12个月', category: '基础规划', title: '确定婚礼日期', desc: '参考吉日模块，与双方家长商量' },
  { phase: '提前12个月', category: '基础规划', title: '设定婚礼总预算', desc: '与家人协商，明确各方承担比例' },
  { phase: '提前12个月', category: '基础规划', title: '确定婚礼地点城市', desc: '男方城市/女方城市/两地分开办' },
  { phase: '提前12个月', category: '基础规划', title: '确定婚礼风格', desc: '中式/西式/草坪/宴会厅等' },
  { phase: '提前12个月', category: '基础规划', title: '初步拟定宾客名单', desc: '估算人数，方便后续定场地' },
  { phase: '提前12个月', category: '场地', title: '考察婚礼场地', desc: '宴会厅/酒店/民宿/户外，多家对比' },
  { phase: '提前12个月', category: '场地', title: '预订婚礼场地', desc: '支付定金，签合同，确认细节' },
  // 6个月前
  { phase: '提前6个月', category: '服装', title: '购买/租借婚纱礼服', desc: '新娘至少备好2套，新郎1-2套' },
  { phase: '提前6个月', category: '服装', title: '新郎定制西装', desc: '量体定制需要提前2-3个月' },
  { phase: '提前6个月', category: '摄影摄像', title: '预订婚礼摄影师', desc: '单机位/双机位，提前看作品集' },
  { phase: '提前6个月', category: '摄影摄像', title: '预订婚礼摄像师', desc: '确认视频风格和交付时间' },
  { phase: '提前6个月', category: '婚礼团队', title: '确定婚礼主持人', desc: '专业主持/熟人主持，看主持风格' },
  { phase: '提前6个月', category: '婚礼团队', title: '确定化妆师', desc: '看作品，确认妆容风格' },
  { phase: '提前6个月', category: '婚礼团队', title: '确定伴娘伴郎', desc: '考虑到时候的档期和意愿' },
  { phase: '提前6个月', category: '婚礼团队', title: '确定婚礼跟妆助理', desc: '全天候跟妆，确认人数' },
  { phase: '提前6个月', category: '婚纱照', title: '预约婚纱照拍摄', desc: '参考婚纱照攻略模块' },
  // 3个月前
  { phase: '提前3个月', category: '婚宴', title: '确定婚宴菜单', desc: '与酒店试菜，确认菜品和价格' },
  { phase: '提前3个月', category: '婚宴', title: '确定酒水安排', desc: '白酒/红酒/啤酒/饮料数量' },
  { phase: '提前3个月', category: '请柬', title: '设计婚礼请柬', desc: '使用小程序内请柬生成功能' },
  { phase: '提前3个月', category: '请柬', title: '发送电子请柬', desc: '提前发送，给宾客留足时间' },
  { phase: '提前3个月', category: '喜糖礼品', title: '确定喜糖品牌和包装', desc: '试吃后决定，注意保质期' },
  { phase: '提前3个月', category: '喜糖礼品', title: '确定伴手礼', desc: '有纪念意义的小礼品' },
  { phase: '提前3个月', category: '蜜月', title: '预订蜜月酒店/行程', desc: '热门时间段提前预订' },
  // 1个月前
  { phase: '提前1个月', category: '流程确认', title: '制定婚礼当天时间流程表', desc: '精确到每个环节时间点' },
  { phase: '提前1个月', category: '流程确认', title: '与主持人对接流程', desc: '敲定互动环节、发言顺序' },
  { phase: '提前1个月', category: '流程确认', title: '双方父母发言稿准备', desc: '提前撰写，反复练习' },
  { phase: '提前1个月', category: '后勤', title: '最终确认宾客名数', desc: '联系确认出席情况，调整桌数' },
  { phase: '提前1个月', category: '后勤', title: '安排宾客交通/住宿', desc: '外地宾客提前统筹安排' },
  { phase: '提前1个月', category: '后勤', title: '分配伴娘伴郎职责', desc: '迎宾/拦门/礼金/签到等岗位' },
  { phase: '提前1个月', category: '后勤', title: '购买婚礼当天所需物品', desc: '红包/喜烟/喜糖/鞭炮（如需）等' },
  { phase: '提前1个月', category: '婚礼细节', title: '婚礼布置方案确认', desc: '与布置商确认桌花/拱门/迎宾区' },
  { phase: '提前1个月', category: '婚礼细节', title: '音乐playlist确认', desc: '出场曲/交换戒指/进场退场' },
  // 婚礼当天
  { phase: '婚礼当天', category: '当天流程', title: '新娘开始化妆', desc: '化妆时间约3-4小时，要早起' },
  { phase: '婚礼当天', category: '当天流程', title: '新郎接亲', desc: '提前规划路线和堵门道具' },
  { phase: '婚礼当天', category: '当天流程', title: '抵达婚礼现场', desc: '提前确认到场时间' },
  { phase: '婚礼当天', category: '当天流程', title: '宾客签到和礼金', desc: '安排专人负责签到收礼' },
  { phase: '婚礼当天', category: '当天流程', title: '婚礼仪式', desc: '注意控制时长，约30-60分钟' },
  { phase: '婚礼当天', category: '当天流程', title: '婚宴进行', desc: '注意敬酒安全，安排代喝人员' },
  { phase: '婚礼当天', category: '当天流程', title: '送客和清场', desc: '确认重要物品带走' },
]

// 婚纱照清单模板
const PHOTO_CHECKLIST = [
  { category: '选店', title: '确定婚纱照拍摄时间', desc: '避开旅游旺季，春秋天气最好' },
  { category: '选店', title: '多家门店实地考察', desc: '不要只看朋友圈宣传图，要看真实出片' },
  { category: '选店', title: '查看真实客片（非宣传图）', desc: '要求看本月/上月出的客片' },
  { category: '选店', title: '了解摄影师vs修图师是否同一人', desc: '部分门店外包修图，风格可能差异大' },
  { category: '选店', title: '确认主拍摄影师档期', desc: '签合同时写明指定摄影师姓名' },
  { category: '谈套餐', title: '确认套餐底价（不含升级项）', desc: '注意"升级费"陷阱，拍前问清' },
  { category: '谈套餐', title: '确认精修照片数量', desc: '一般5-10张，可以谈加送' },
  { category: '谈套餐', title: '确认原图/底片是否给', desc: '部分门店不送底片，需额外购买' },
  { category: '谈套餐', title: '确认换装套数', desc: '至少2-3套，含礼服/婚纱/中式' },
  { category: '谈套餐', title: '确认拍摄时长', desc: '一般8-12小时，含妆发时间' },
  { category: '谈套餐', title: '确认相册规格和数量', desc: '相册尺寸/版面/本数，升级费用' },
  { category: '场景选择', title: '确认内景风格（样片是否真实）', desc: '实地参观棚内场景' },
  { category: '场景选择', title: '挑选外景地点', desc: '本地/异地，了解差旅费是否额外' },
  { category: '妆容服装', title: '与化妆师沟通妆容风格', desc: '提前发参考图，明确要求' },
  { category: '妆容服装', title: '选好婚纱款式', desc: '试穿后选，避免照片出来效果不好' },
  { category: '拍摄前准备', title: '提前1周护肤保湿', desc: '多喝水，避免熬夜，皮肤状态要好' },
  { category: '拍摄前准备', title: '修眉/手脚护理', desc: '提前3-5天进行' },
  { category: '拍摄前准备', title: '准备婚鞋和饰品', desc: '确认与礼服搭配' },
  { category: '拍摄前准备', title: '拍摄前夜早睡', desc: '避免眼睛浮肿' },
  { category: '精修选片', title: '挑选精修照片', desc: '优先选自然表情和姿态自然的' },
  { category: '精修选片', title: '确认修图风格', desc: '提供参考图，减少返工' },
  { category: '精修选片', title: '确认交片时间', desc: '一般3-6个月，婚礼前务必拿到' },
]

// 领证材料清单
const REGISTRATION_CHECKLIST = [
  { category: '证件', title: '男方身份证原件', desc: '二代身份证，有效期内' },
  { category: '证件', title: '女方身份证原件', desc: '二代身份证，有效期内' },
  { category: '证件', title: '男方户口本', desc: '原件，带上户主页和本人页' },
  { category: '证件', title: '女方户口本', desc: '原件，带上户主页和本人页' },
  { category: '照片', title: '双方合照（近期）', desc: '白底或红底，2寸，不同地区要求略有差异，建议多备几张' },
  { category: '提前了解', title: '确认当地民政局地址', desc: '部分地区可在街道办理，提前查清' },
  { category: '提前了解', title: '确认工作日（周末是否可办）', desc: '多数民政局周末也办理，需提前确认' },
  { category: '提前了解', title: '是否需要提前预约', desc: '部分城市需要网上预约，避免白跑' },
  { category: '提前了解', title: '确认双方无婚姻关系证明（如需）', desc: '初婚一般无需，有过婚史需提供离婚证' },
  { category: '当天安排', title: '安排摄影跟拍', desc: '领证当天是重要纪念，值得记录' },
  { category: '当天安排', title: '准备好着装（正式感）', desc: '参考天气建议，提前备好服装' },
  { category: '当天安排', title: '预留足够时间', desc: '不要卡着时间，留出排队等待时间' },
]

// 场地推荐模板
const VENUE_EXAMPLES = [
  {
    name: '高档西餐厅私人包间',
    type: 'restaurant',
    typeLabel: '餐厅',
    desc: '私密烛光晚餐，提前预订包间，与餐厅协商布置鲜花和戒指上餐。氛围浪漫，操作门槛低，适合不喜欢太多人围观的情侣。',
    tips: '提前和餐厅经理沟通，说明求婚需求，大多数餐厅会提供协助。',
    suitable: '室内/全天候',
    budget: '500-3000元'
  },
  {
    name: '城市观景天台/空中餐厅',
    type: 'restaurant',
    typeLabel: '餐厅',
    desc: '俯瞰城市夜景，配合灯光和鲜花。日落时分最为浪漫，视觉冲击力强，照片效果极好。',
    tips: '提前踩点确认视野，日落时间提前到达，注意天气变化。',
    suitable: '傍晚/晴天',
    budget: '1000-5000元'
  },
  {
    name: '城市公园/花海',
    type: 'park',
    typeLabel: '公园',
    desc: '自然背景，清新户外，适合拍照。春天花期最美，成本相对较低，可以大面积布置，视觉效果很好。',
    tips: '提前了解公园是否允许商业活动，准备好布置物品的搬运方案。',
    suitable: '白天/晴天',
    budget: '300-2000元'
  },
  {
    name: '植物园/温室',
    type: 'park',
    typeLabel: '公园',
    desc: '四季常绿，花卉环绕，异域浪漫感。有些植物园提供求婚布置服务，可以咨询。',
    tips: '需提前购票或预约，温室全天候，不受天气影响。',
    suitable: '全天候',
    budget: '500-3000元'
  },
  {
    name: '精心布置的家中',
    type: 'indoor',
    typeLabel: '室内',
    desc: '最有家的感觉，最用心的求婚方式。提前打扫家里，用鲜花、蜡烛、气球、照片墙布置，让TA回家时大吃一惊。',
    tips: '需要TA暂时离开家（让朋友带出去），你在家快速布置。',
    suitable: '室内/全天候',
    budget: '200-1500元'
  },
  {
    name: '私人影院包厢',
    type: 'indoor',
    typeLabel: '室内',
    desc: '可以提前制作求婚视频在大屏幕上播放，配合跪地求婚，惊喜感极强。现在很多城市都有私人影院。',
    tips: '提前联系影院，了解是否允许布置和播放自定义内容。',
    suitable: '室内/全天候',
    budget: '300-1000元'
  },
  {
    name: '海边/湖边',
    type: 'outdoor',
    typeLabel: '户外',
    desc: '自然壮阔的背景，意境深远。夕阳西下时在沙滩上求婚，浪漫指数满分。适合旅行中求婚。',
    tips: '注意潮汐时间，避免被海水打湿。提前联系当地摄影师。',
    suitable: '傍晚/晴天',
    budget: '500-3000元（含差旅）'
  },
  {
    name: '屋顶天台/露台',
    type: 'outdoor',
    typeLabel: '户外',
    desc: '城市星空下，现代浪漫感。可以布置灯串、蜡烛和鲜花，夜晚效果尤其好。',
    tips: '需提前确认天台是否可以使用，注意风对蜡烛的影响，准备防风灯。',
    suitable: '夜晚/晴天',
    budget: '300-2000元'
  },
]

// 誓言模板
const VOW_TEMPLATES = [
  {
    title: '简洁真诚版',
    content: `[TA的名字]，\n\n从我们相遇的那一刻起，我知道你是那个特别的人。\n\n你让我的每一天都变得更有意义。\n\n今天，我想在这里问你：你愿意嫁/娶给我，和我一起走过以后每一天吗？\n\n我爱你。`
  },
  {
    title: '幽默温情版',
    content: `[TA的名字]，\n\n我不是最帅/漂亮的，也不是最有钱的，\n但我是最爱你的那个人。\n\n这些年，你包容了我所有的缺点，\n我决定用一辈子来报答你。\n\n所以，你愿意嫁/娶给我这个"不完美"的我吗？\n\n（请回答"我愿意"）`
  },
  {
    title: '深情文艺版',
    content: `[TA的名字]，\n\n"执子之手，与子偕老"——\n这句话，我想对你说。\n\n在遇到你之前，我不知道爱情可以让人如此勇敢；\n遇到你之后，我愿意为你变成更好的人。\n\n今后的路，无论晴雨，我只想与你同行。\n\n你，愿意吗？`
  },
  {
    title: '甜蜜生活版',
    content: `[TA的名字]，\n\n我想每天早上都能看到你睡眼惺忪的样子，\n想每天晚上都能陪你说说今天发生的小事，\n想在你委屈的时候第一时间出现，\n想在你开心的时候比你更开心。\n\n嫁/娶给我吧，让我永远有这个权利。`
  },
]

// 预算分类模板
const BUDGET_CATEGORIES = [
  { name: '婚礼场地', icon: '🏛', defaultBudget: 50000 },
  { name: '婚宴餐饮', icon: '🍽', defaultBudget: 80000 },
  { name: '婚纱照', icon: '📸', defaultBudget: 15000 },
  { name: '摄影摄像', icon: '🎥', defaultBudget: 20000 },
  { name: '婚纱礼服', icon: '👗', defaultBudget: 15000 },
  { name: '化妆造型', icon: '💄', defaultBudget: 8000 },
  { name: '婚礼策划布置', icon: '🌸', defaultBudget: 20000 },
  { name: '主持人', icon: '🎤', defaultBudget: 5000 },
  { name: '婚戒', icon: '💍', defaultBudget: 20000 },
  { name: '喜糖伴手礼', icon: '🍬', defaultBudget: 5000 },
  { name: '宾客交通住宿', icon: '🚗', defaultBudget: 10000 },
  { name: '蜜月旅行', icon: '✈️', defaultBudget: 20000 },
  { name: '其他', icon: '📦', defaultBudget: 5000 },
]

// 供应商类型
const VENDOR_TYPES = [
  '摄影师', '摄像师', '化妆师', '婚礼主持人',
  '婚礼策划', '场地方', '花艺', '蛋糕', '乐队/DJ', '其他'
]

// 伴娘伴郎职责
const PARTY_DUTIES = [
  '迎宾签到', '收礼金', '接待宾客', '照看新娘/新郎',
  '堵门游戏策划', '布置帮手', '敬酒陪同', '其他'
]

module.exports = {
  PROPOSAL_TASKS,
  WEDDING_TASKS,
  PHOTO_CHECKLIST,
  REGISTRATION_CHECKLIST,
  VENUE_EXAMPLES,
  VOW_TEMPLATES,
  BUDGET_CATEGORIES,
  VENDOR_TYPES,
  PARTY_DUTIES
}
