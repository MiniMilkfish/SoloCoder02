import { useState, useEffect } from 'react'
import { Search, RefreshCw, MapPin } from 'lucide-react'
import BaiduMap from '@/components/BaiduMap'
import { LineChart, BarChart } from '@/components/Charts'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { CONFIG, DISTRICTS } from '@/constants'
import { 
  mockDeviceList, 
  mockStatistics, 
  generateHourlyDustData, 
  generateDistrictDustData,
  generateDustRankList,
  getStatusTextColor,
  MAP_DISPLAY_MODES,
} from '@/data/mockData'

const Dashboard = () => {
  const [devices] = useState(mockDeviceList)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [searchText, setSearchText] = useState('')
  const [filteredDevices, setFilteredDevices] = useState([])
  const [currentDisplayMode, setCurrentDisplayMode] = useState(MAP_DISPLAY_MODES.CLUSTER)
  const [currentZoom, setCurrentZoom] = useState(CONFIG.MAP_ZOOM.DEFAULT)
  
  const [hourlyData, setHourlyData] = useState({ hours: [], values: [] })
  const [districtData, setDistrictData] = useState({ districts: [], values: [] })
  const [bestRankList, setBestRankList] = useState([])
  const [worstRankList, setWorstRankList] = useState([])

  useEffect(() => {
    setFilteredDevices(mockDeviceList)
    setHourlyData(generateHourlyDustData())
    setDistrictData(generateDistrictDustData())
    setBestRankList(generateDustRankList('ASC'))
    setWorstRankList(generateDustRankList('DESC'))
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

  const handleDisplayModeChange = (mode, zoom) => {
    setCurrentDisplayMode(mode)
    setCurrentZoom(zoom)
  }

  const getDisplayModeText = () => {
    switch (currentDisplayMode) {
      case MAP_DISPLAY_MODES.MASS_POINT: return '海量点'
      case MAP_DISPLAY_MODES.CLUSTER: return '聚合点'
      case MAP_DISPLAY_MODES.MARKER: return '标注点'
      default: return '未知'
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">设备状态：</span>
          <Badge 
            variant="default" 
            className="bg-dust-excellent hover:bg-dust-excellent/90 text-white px-4 py-1.5"
          >
            优良 <span className="ml-1 font-bold">{mockStatistics.excellent}</span>
          </Badge>
          <Badge 
            variant="default" 
            className="bg-dust-warning hover:bg-dust-warning/90 text-black px-4 py-1.5"
          >
            预警 <span className="ml-1 font-bold">{mockStatistics.warning}</span>
          </Badge>
          <Badge 
            variant="default" 
            className="bg-dust-over hover:bg-dust-over/90 text-white px-4 py-1.5"
          >
            超标 <span className="ml-1 font-bold">{mockStatistics.over}</span>
          </Badge>
          <Badge 
            variant="default" 
            className="bg-dust-offline hover:bg-dust-offline/90 text-white px-4 py-1.5"
          >
            断线 <span className="ml-1 font-bold">{mockStatistics.offline}</span>
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">区县筛选：</span>
            <Select
              value={selectedDistrict}
              onValueChange={setSelectedDistrict}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="全部区县" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部区县</SelectItem>
                {DISTRICTS.map(district => (
                  <SelectItem key={district.id} value={String(district.id)}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜索MN编码或站点名称"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-9"
            />
          </div>

          <Button
            onClick={handleRefresh}
            variant="default"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            刷新
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        <Card className="flex-1 overflow-hidden">
          <CardHeader className="px-4 py-3 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              设备分布地图
            </CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="outline">
                缩放: <span className="ml-1 font-bold text-primary">{currentZoom}</span>
              </Badge>
              <Badge variant="outline">
                模式: <span className="ml-1 font-bold text-primary">{getDisplayModeText()}</span>
              </Badge>
              <Badge variant="outline">
                设备数: <span className="ml-1 font-bold text-primary">{filteredDevices.length}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-57px)]">
            <BaiduMap
              devices={filteredDevices}
              onMarkerClick={handleMarkerClick}
              selectedDevice={selectedDevice}
              onDisplayModeChange={handleDisplayModeChange}
            />
          </CardContent>
        </Card>

        <div className="w-[380px] flex flex-col gap-4 overflow-hidden">
          <Tabs defaultValue="charts" className="flex-1 flex flex-col">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="charts">图表分析</TabsTrigger>
              <TabsTrigger value="ranking">排名统计</TabsTrigger>
            </TabsList>

            <TabsContent value="charts" className="flex-1 overflow-y-auto mt-0 space-y-4 pt-4">
              <Card>
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-sm font-medium">全市扬尘小时均值</CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-48">
                  <LineChart
                    title=""
                    xAxisData={hourlyData.hours}
                    seriesData={hourlyData.values}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-sm font-medium">各区县扬尘日均浓度</CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-48">
                  <BarChart
                    title=""
                    xAxisData={districtData.districts}
                    seriesData={districtData.values}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ranking" className="flex-1 overflow-hidden mt-0 pt-4">
              <div className="flex flex-col gap-4 h-full overflow-hidden">
                <Card className="flex-1 overflow-hidden">
                  <CardHeader className="px-4 py-3 bg-dust-excellent/10">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-dust-excellent"></span>
                      扬尘控制最好站点
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-[calc(100%-52px)] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background">
                        <TableRow>
                          <TableHead className="w-12 text-right">排名</TableHead>
                          <TableHead>站点名称</TableHead>
                          <TableHead className="w-24 text-right">颗粒物</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bestRankList.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-right">
                              {index < 3 ? (
                                <Badge 
                                  variant="default" 
                                  className="bg-dust-excellent text-white"
                                >
                                  {item.rank}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">{item.rank}</span>
                              )}
                            </TableCell>
                            <TableCell className="max-w-[160px] truncate" title={item.projectName}>
                              {item.projectName}
                            </TableCell>
                            <TableCell className={`text-right font-bold ${getStatusTextColor(item.status)}`}>
                              {item.dust}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card className="flex-1 overflow-hidden">
                  <CardHeader className="px-4 py-3 bg-dust-over/10">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-dust-over"></span>
                      扬尘控制最差站点
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-[calc(100%-52px)] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background">
                        <TableRow>
                          <TableHead className="w-12 text-right">排名</TableHead>
                          <TableHead>站点名称</TableHead>
                          <TableHead className="w-24 text-right">颗粒物</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {worstRankList.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-right">
                              <Badge 
                                variant="default" 
                                className="bg-destructive text-white"
                              >
                                {item.rank}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[160px] truncate" title={item.projectName}>
                              {item.projectName}
                            </TableCell>
                            <TableCell className="text-right font-bold text-destructive">
                              {item.dust}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
