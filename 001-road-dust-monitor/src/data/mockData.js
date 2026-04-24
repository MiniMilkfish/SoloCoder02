import { CONFIG, DISTRICTS } from '@/constants'

const getStatusFromDust = (dust) => {
  if (dust < CONFIG.DUST_THRESHOLDS.EXCELLENT) return CONFIG.STATUS.EXCELLENT
  if (dust < CONFIG.DUST_THRESHOLDS.WARNING) return CONFIG.STATUS.WARNING
  if (dust < CONFIG.DUST_THRESHOLDS.OVER) return CONFIG.STATUS.OVER
  return CONFIG.STATUS.OFFLINE
}

const HANGZHOU_BOUNDS = {
  minLng: 119.9,
  maxLng: 120.6,
  minLat: 30.0,
  maxLat: 30.5,
}

const ROAD_NAMES = [
  '文三路', '天目山路', '庆春东路', '莫干山路', '江南大道',
  '市心南路', '建设二路', '工人路', '通惠北路', '鸿宁路',
  '潘水路', '萧然西路', '博学路', '金鸡路', '建设四路',
  '风情大道', '弘慧路', '市心中路', '北塘路', '利华路',
  '曙光路', '解放路', '延安路', '武林路', '凤起路',
  '体育场路', '环城北路', '中河中路', '西湖大道', '之江路',
  '钱江路', '新业路', '婺江路', '望江路', '海潮路',
  '近江路', '清江路', '秋涛路', '新塘路', '景昙路',
  '庆春东路', '凤起东路', '艮山西路', '机场路', '天城路',
  '文一路', '文二路', '文三路', '文四路', '学院路',
  '古翠路', '万塘路', '教工路', '莫干山路', '湖墅南路',
  '德胜路', '香积寺路', '大关路', '沈半路', '石祥路',
  '留祥路', '古墩路', '紫荆花路', '蒋村路', '紫金港路',
]

const CROSS_ROAD_NAMES = [
  '古翠路', '万塘路', '教工路', '学院路', '紫荆花路',
  '新塘路', '秋涛路', '清江路', '婺江路', '钱江路',
  '通惠北路', '市心北路', '市心南路', '工人路', '金鸡路',
  '环城西路', '中河路', '建国路', '凯旋路', '秋涛北路',
]

const generateProjectName = () => {
  const road1 = ROAD_NAMES[Math.floor(Math.random() * ROAD_NAMES.length)]
  const road2 = CROSS_ROAD_NAMES[Math.floor(Math.random() * CROSS_ROAD_NAMES.length)]
  return `${road1}/${road2}`
}

const generateMnCode = (index) => {
  const num = String(index).padStart(6, '0')
  return `LXHB0HZ${num}`
}

const generateRandomDustValue = () => {
  const rand = Math.random()
  if (rand < 0.6) return Math.random() * 0.25 + 0.05
  if (rand < 0.85) return Math.random() * 0.4 + 0.3
  if (rand < 0.95) return Math.random() * 1.0 + 0.8
  return Math.random() * 3.0 + 2.0
}

const generateDeviceList = (count = 1500) => {
  const devices = []
  
  const baseLng = CONFIG.HANGZHOU_COORDINATE.lng
  const baseLat = CONFIG.HANGZHOU_COORDINATE.lat
  const lngRange = HANGZHOU_BOUNDS.maxLng - HANGZHOU_BOUNDS.minLng
  const latRange = HANGZHOU_BOUNDS.maxLat - HANGZHOU_BOUNDS.minLat
  
  for (let i = 0; i < count; i++) {
    const offsetX = (Math.random() - 0.5) * lngRange
    const offsetY = (Math.random() - 0.5) * latRange
    
    const lng = baseLng + offsetX
    const lat = baseLat + offsetY
    
    const district = DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)]
    const dust = generateRandomDustValue()
    const status = getStatusFromDust(dust)
    
    const hour = Math.floor(Math.random() * 24).toString().padStart(2, '0')
    const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0')
    const second = Math.floor(Math.random() * 60).toString().padStart(2, '0')
    
    devices.push({
      districtId: district.id,
      districtName: district.name,
      projectId: 1000 + i,
      projectName: generateProjectName(),
      operationCompanyName: '上海龙象环保科技股份有限公司',
      projectTypeName: '道路',
      projectAddress: `${generateProjectName()}交叉口附近`,
      devicePoleId: 1000 + i,
      devicePoleName: `点位${(i + 1).toString().padStart(3, '0')}`,
      mnCode: generateMnCode(i),
      longitude: Number(lng.toFixed(6)),
      latitude: Number(lat.toFixed(6)),
      cameraStatus: Math.random() > 0.1 ? 1 : 0,
      dust: Number(dust.toFixed(3)),
      pm25: Number((dust * 0.3).toFixed(3)),
      dataTime: `2026-04-24 ${hour}:${minute}:${second}`,
      status: status,
      id: i,
    })
  }
  
  return devices
}

export const mockDeviceList = generateDeviceList(1500)

export const mockStatistics = {
  total: mockDeviceList.length,
  excellent: mockDeviceList.filter(d => d.status === CONFIG.STATUS.EXCELLENT).length,
  warning: mockDeviceList.filter(d => d.status === CONFIG.STATUS.WARNING).length,
  over: mockDeviceList.filter(d => d.status === CONFIG.STATUS.OVER).length,
  offline: mockDeviceList.filter(d => d.status === CONFIG.STATUS.OFFLINE).length,
}

export const getDevicesByStatus = (status) => {
  if (!status) return mockDeviceList
  return mockDeviceList.filter(d => d.status === status)
}

export const getDevicesByDistrict = (districtId) => {
  if (!districtId) return mockDeviceList
  return mockDeviceList.filter(d => d.districtId === districtId)
}

export const searchDevices = (keyword) => {
  if (!keyword) return mockDeviceList
  const lowerKeyword = keyword.toLowerCase()
  return mockDeviceList.filter(d => 
    d.mnCode.toLowerCase().includes(lowerKeyword) ||
    d.projectName.toLowerCase().includes(lowerKeyword) ||
    d.devicePoleName.toLowerCase().includes(lowerKeyword)
  )
}

export const generateHourlyDustData = () => {
  const hours = []
  const values = []
  for (let i = 0; i < 24; i++) {
    hours.push(`${i.toString().padStart(2, '0')}:00`)
    values.push(Number((Math.random() * 0.3 + 0.05).toFixed(3)))
  }
  return { hours, values }
}

export const generateDistrictDustData = () => {
  const districts = DISTRICTS.slice(0, 7).map(d => d.name)
  const values = districts.map(() => Number((Math.random() * 0.2 + 0.1).toFixed(3)))
  return { districts, values }
}

export const generateDustRankList = (sortType = 'ASC', limit = 10) => {
  const sortedList = [...mockDeviceList].sort((a, b) => {
    return sortType === 'ASC' ? a.dust - b.dust : b.dust - a.dust
  })
  return sortedList.slice(0, limit).map((item, index) => ({
    rank: index + 1,
    projectName: item.projectName,
    dust: item.dust.toFixed(3),
    districtName: item.districtName,
    status: item.status,
    device: item,
  }))
}

export const generateAreaDustDistribution = () => {
  return DISTRICTS.slice(0, 8).map(d => ({
    name: d.name,
    value: Number((Math.random() * 0.3 + 0.08).toFixed(3)),
  }))
}

export const MAP_DISPLAY_MODES = {
  MASS_POINT: 'massPoint',
  CLUSTER: 'cluster',
  MARKER: 'marker',
}

export const getMapDisplayModeByZoom = (zoom) => {
  if (zoom < 11) return MAP_DISPLAY_MODES.MASS_POINT
  if (zoom < 16) return MAP_DISPLAY_MODES.CLUSTER
  return MAP_DISPLAY_MODES.MARKER
}

export const getStatusColor = (status) => {
  switch (status) {
    case CONFIG.STATUS.EXCELLENT: return '#28A33E'
    case CONFIG.STATUS.WARNING: return '#FBAA22'
    case CONFIG.STATUS.OVER: return '#F92424'
    case CONFIG.STATUS.OFFLINE: return '#2C2C2C'
    default: return '#28A33E'
  }
}

export const getStatusTextColor = (status) => {
  switch (status) {
    case CONFIG.STATUS.EXCELLENT: return 'text-dust-excellent'
    case CONFIG.STATUS.WARNING: return 'text-dust-warning'
    case CONFIG.STATUS.OVER: return 'text-dust-over'
    case CONFIG.STATUS.OFFLINE: return 'text-dust-offline'
    default: return 'text-dust-excellent'
  }
}

export const getStatusBorderColor = (status) => {
  switch (status) {
    case CONFIG.STATUS.EXCELLENT: return 'border-dust-excellent'
    case CONFIG.STATUS.WARNING: return 'border-dust-warning'
    case CONFIG.STATUS.OVER: return 'border-dust-over'
    case CONFIG.STATUS.OFFLINE: return 'border-dust-offline'
    default: return 'border-dust-excellent'
  }
}
