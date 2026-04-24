import ReactECharts from 'echarts-for-react'

const PieChart = ({ title, data, colors = ['#28A33E', '#FBAA22', '#F92424', '#2C2C2C'] }) => {
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
      trigger: 'item',
      backgroundColor: 'rgba(0, 40, 80, 0.9)',
      borderColor: 'rgba(0, 212, 255, 0.5)',
      textStyle: {
        color: '#fff',
      },
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: '#8899aa',
        fontSize: 12,
      },
    },
    series: [
      {
        name: '设备状态',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: 'rgba(0, 20, 40, 0.8)',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#fff',
          },
        },
        labelLine: {
          show: false,
        },
        data: data.map((item, index) => ({
          ...item,
          itemStyle: {
            color: colors[index % colors.length],
          },
        })),
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

export default PieChart
