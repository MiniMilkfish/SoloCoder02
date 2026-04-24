export const CONFIG = {
  APP_TITLE: '杭州市道路扬尘在线监测系统',
  BAIDU_MAP_AK: import.meta.env.VITE_BAIDU_MAP_AK || '8PoAdvfS1nwZAtNvl0e1yiwhIonuSQMc',
  HANGZHOU_COORDINATE: {
    lng: 120.209947,
    lat: 30.259244,
  },
  MAP_ZOOM: {
    DEFAULT: 12,
    MIN: 8,
    MAX: 19,
  },
  DUST_THRESHOLDS: {
    EXCELLENT: 0.3,
    WARNING: 0.8,
    OVER: 2.0,
  },
  STATUS: {
    EXCELLENT: 1,
    WARNING: 2,
    OVER: 3,
    OFFLINE: 4,
  },
  STATUS_LABELS: {
    1: '优良',
    2: '预警',
    3: '超标',
    4: '断线',
  },
}

export const DISTRICTS = [
  { id: 1, name: '上城区' },
  { id: 2, name: '下城区' },
  { id: 3, name: '西湖区' },
  { id: 4, name: '江干区' },
  { id: 5, name: '拱墅区' },
  { id: 6, name: '滨江区' },
  { id: 7, name: '萧山区' },
  { id: 8, name: '余杭区' },
  { id: 9, name: '临安区' },
  { id: 10, name: '富阳区' },
  { id: 11, name: '建德区' },
  { id: 12, name: '桐庐县' },
  { id: 13, name: '淳安县' },
]

export const MAP_STYLE = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: {
      visibility: 'on',
      color: '#ccd6d7ff',
    },
  },
  {
    featureType: 'green',
    elementType: 'geometry',
    stylers: {
      visibility: 'on',
      color: '#dee5e5ff',
    },
  },
  {
    featureType: 'building',
    elementType: 'geometry',
    stylers: {
      visibility: 'on',
    },
  },
  {
    featureType: 'building',
    elementType: 'geometry.fill',
    stylers: {
      color: '#d1dbdbff',
    },
  },
  {
    featureType: 'building',
    elementType: 'geometry.stroke',
    stylers: {
      color: '#aab6b6ff',
    },
  },
  {
    featureType: 'subwaystation',
    elementType: 'geometry',
    stylers: {
      visibility: 'off',
      color: '#888fa0ff',
    },
  },
  {
    featureType: 'education',
    elementType: 'geometry',
    stylers: {
      visibility: 'on',
      color: '#e1e7e7ff',
    },
  },
  {
    featureType: 'medical',
    elementType: 'geometry',
    stylers: {
      visibility: 'on',
      color: '#d1dbdbff',
    },
  },
  {
    featureType: 'scenicspots',
    elementType: 'geometry',
    stylers: {
      visibility: 'on',
      color: '#d1dbdbff',
    },
  },
  {
    featureType: 'highway',
    elementType: 'geometry',
    stylers: {
      visibility: 'on',
      weight: 4,
    },
  },
  {
    featureType: 'highway',
    elementType: 'geometry.fill',
    stylers: {
      color: '#ffffffff',
    },
  },
  {
    featureType: 'highway',
    elementType: 'geometry.stroke',
    stylers: {
      color: '#cacfcfff',
    },
  },
  {
    featureType: 'arterial',
    elementType: 'geometry',
    stylers: {
      visibility: 'on',
      weight: 2,
    },
  },
  {
    featureType: 'arterial',
    elementType: 'geometry.fill',
    stylers: {
      color: '#fbfffeff',
    },
  },
  {
    featureType: 'arterial',
    elementType: 'geometry.stroke',
    stylers: {
      color: '#cacfcfff',
    },
  },
  {
    featureType: 'local',
    elementType: 'geometry',
    stylers: {
      visibility: 'on',
      weight: 1,
    },
  },
  {
    featureType: 'local',
    elementType: 'geometry.fill',
    stylers: {
      color: '#fbfffeff',
    },
  },
  {
    featureType: 'local',
    elementType: 'geometry.stroke',
    stylers: {
      color: '#cacfcfff',
    },
  },
  {
    featureType: 'railway',
    elementType: 'geometry',
    stylers: {
      visibility: 'off',
      weight: 1,
    },
  },
  {
    featureType: 'subway',
    elementType: 'geometry',
    stylers: {
      visibility: 'off',
      weight: 1,
    },
  },
  {
    featureType: 'land',
    elementType: 'geometry',
    stylers: {
      color: '#edf3f3ff',
    },
  },
]
