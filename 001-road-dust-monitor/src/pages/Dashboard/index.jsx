import { useState, useEffect } from 'react'
import { Search, RefreshCw, Filter } from 'lucide-react'
import BaiduMap from '@/components/BaiduMap'
import { LineChart, BarChart, PieChart } from '@/components/Charts'
import { CONFIG, DISTRICTS } from '@/constants'
import { 
  mockDeviceList, 
  mockStatistics, 
  generateHourlyDustData, 
  generateDistrictDustData,
  generateDustRankList 
} from '@/data/mockData'

const Dashboard = () => {
  const [devices, setDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [searchText, setSearchText] = useState('')
  const [filteredDevices, setFilteredDevices] = useState([])
  const [activeTab, setActiveTab] = useState('hourly')
  
  const [hourlyData, setHourlyData] = useState({ hours: [], values: [] })
  const [districtData, setDistrictData] = useState({ districts: [], values: [] })
  const [bestRankList, setBestRankList] = useState([])
  const [worstRankList, setWorstRankList] = useState([])
  const [pieData, setPieData] = useState([])

  useEffect(() => {
    setDevices(mockDeviceList)
    setFilteredDevices(mockDeviceList)
    setHourlyData(generateHourlyDustData())
    setDistrictData(generateDistrictDustData())
    setBestRankList(generateDustRankList('ASC'))
    setWorstRankList(generateDustRankList('DESC'))
    setPieData([
      { name: '优良', value: mockStatistics.excellent },
      { name: '预警', value: mockStatistics.warning },
      { name: '超标', value: mockStatistics.over },
      { name: '断线', value: mockStatistics.offline },
    ])
  }, [])

  useEffect(() => {
    let filtered = [...devices]
    
    if (selectedDistrict) {
      filtered = filtered.filter(d => d.districtId === parseInt(selectedDistrict))
    }
    
    if (searchText) {
      const lowerSearch = searchText.toLowerCase()
      filtered = filtered.filter(d => 
        d.mnCode.toLowerCase().includes(lowerSearch) ||
        d.projectName.toLowerCase().includes(lowerSearch)
      )
    }
    
    setFilteredDevices(filtered)
  }, [selectedDistrict, searchText, devices])

  const handleMarkerClick = (device) => {
    setSelectedDevice(device)
  }

  const handleRefresh = () => {
    setHourlyData(generateHourlyDustData())
    setDistrictData(generateDistrictDustData())
    setBestRankList(generateDustRankList('ASC'))
    setWorstRankList(generateDustRankList('DESC'))
  }

  const getStatusBadge = (status) => {
    const labels = CONFIG.STATUS_LABELS
    const statusClass = {
      [CONFIG.STATUS.EXCELLENT]: 'status-excellent',
      [CONFIG.STATUS.WARNING]: 'status-warning',
      [CONFIG.STATUS.OVER]: 'status-over',
      [CONFIG.STATUS.OFFLINE]: 'status-offline',
    }
    
    return (
      <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${statusClass[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-14 bg-background-panel border-b border-border/30 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">设备状态：</span>
          <div className="flex items-center gap-2">
            <span className="status-excellent px-3 py-1 rounded text-xs font-bold">
              优良 <b>{mockStatistics.excellent}</b>
            </span>
            <span className="status-warning px-3 py-1 rounded text-xs font-bold">
              预警 <b>{mockStatistics.warning}</b>
            </span>
            <span className="status-over px-3 py-1 rounded text-xs font-bold">
              超标 <b>{mockStatistics.over}</b>
            </span>
            <span className="status-offline px-3 py-1 rounded text-xs font-bold">
              断线 <b>{mockStatistics.offline}</b>
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">统计区县：</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-background border border-border/50 rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
            >
              <option value="">全部区县</option>
              {DISTRICTS.map(district => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="输入MN编码或站点名称"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-background border border-border/50 rounded pl-9 pr-4 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary w-56"
            />
          </div>
          
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-1.5 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            刷新
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <BaiduMap
            devices={filteredDevices}
            onMarkerClick={handleMarkerClick}
            selectedDevice={selectedDevice}
          />
          
          <div className="absolute bottom-4 right-4 bg-background-panel/90 border border-border/30 rounded-lg px-4 py-2">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                共 <span className="text-primary font-bold">{filteredDevices.length}</span> 个设备
              </span>
            </div>
          </div>
        </div>

        <div className="w-80 bg-background-panel border-l border-border/30 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border/30">
            <h3 className="text-sm font-bold text-primary">★ 统计信息</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="p-3">
              <div className="panel-border p-3 mb-3">
                <div className="panel-title px-2 py-2 mb-3">全市扬尘小时均值</div>
                <div className="h-40">
                  <LineChart
                    title=""
                    xAxisData={hourlyData.hours}
                    seriesData={hourlyData.values}
                  />
                </div>
              </div>

              <div className="panel-border p-3 mb-3">
                <div className="panel-title px-2 py-2 mb-3">各区县扬尘日均浓度</div>
                <div className="h-40">
                  <BarChart
                    title=""
                    xAxisData={districtData.districts}
                    seriesData={districtData.values}
                  />
                </div>
              </div>

              <div className="panel-border p-3 mb-3">
                <div className="panel-title px-2 py-2 mb-3">扬尘控制最好站点前十</div>
                <div className="max-h-64 overflow-y-auto scrollbar-hide">
                  <table className="w-full text-sm">
                    <thead className="text-muted-foreground text-xs">
                      <tr>
                        <th className="text-right p-2 w-8">排名</th>
                        <th className="text-left p-2">站点名称</th>
                        <th className="text-right p-2 w-20">颗粒物</th>
                        <th className="text-left p-2 w-16">区县</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bestRankList.map((item, index) => (
                        <tr key={index} className="border-t border-border/20 hover:bg-white/5">
                          <td className="text-right p-2">
                            {index < 3 ? (
                              <span className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                                {item.rank}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">{item.rank}</span>
                            )}
                          </td>
                          <td className="p-2 truncate max-w-32" title={item.projectName}>
                            {item.projectName}
                          </td>
                          <td className="text-right p-2 text-primary font-bold">
                            {item.dust}
                          </td>
                          <td className="p-2 text-muted-foreground text-xs">
                            {item.districtName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="panel-border p-3">
                <div className="panel-title px-2 py-2 mb-3">扬尘控制最差站点前十</div>
                <div className="max-h-64 overflow-y-auto scrollbar-hide">
                  <table className="w-full text-sm">
                    <thead className="text-muted-foreground text-xs">
                      <tr>
                        <th className="text-right p-2 w-8">排名</th>
                        <th className="text-left p-2">站点名称</th>
                        <th className="text-right p-2 w-20">颗粒物</th>
                        <th className="text-left p-2 w-16">区县</th>
                      </tr>
                    </thead>
                    <tbody>
                      {worstRankList.map((item, index) => (
                        <tr key={index} className="border-t border-border/20 hover:bg-white/5">
                          <td className="text-right p-2">
                            <span className="text-destructive font-bold">{item.rank}</span>
                          </td>
                          <td className="p-2 truncate max-w-32" title={item.projectName}>
                            {item.projectName}
                          </td>
                          <td className="text-right p-2 text-destructive font-bold">
                            {item.dust}
                          </td>
                          <td className="p-2 text-muted-foreground text-xs">
                            {item.districtName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
