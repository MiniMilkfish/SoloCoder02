import ReactECharts from 'echarts-for-react'

const BarChart = ({ title, xAxisData, seriesData, colors = ['#00d4ff'] }) => {
  const option = {
    title: {
      text: title,
      textStyle: {
        color: '#00d4ff',
        fontSize: 14,
        fontWeight: 'bold',
      },
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 40, 80, 0.9)',
      borderColor: 'rgba(0, 212, 255, 0.5)',
      textStyle: {
        color: '#fff',
      },
      formatter: '{b}<br/>颗粒物: {c} mg/m³',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '40px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 212, 255, 0.3)',
        },
      },
      axisLabel: {
        color: '#8899aa',
        fontSize: 11,
        interval: 0,
        rotate: 30,
      },
    },
    yAxis: {
      type: 'value',
      name: 'mg/m³',
      nameTextStyle: {
        color: '#8899aa',
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#8899aa',
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 212, 255, 0.1)',
        },
      },
    },
    series: [
      {
        name: '颗粒物',
        type: 'bar',
        barWidth: '50%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: colors[0],
              },
              {
                offset: 1,
                color: colors[0] + '60',
              },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        data: seriesData,
      },
    ],
  }

  return (
    <ReactECharts 
      option={option} 
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  )
}

export default BarChart
