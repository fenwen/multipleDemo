
var domain = 'http://39.108.133.172:8090/'
var scoreChart = null, trendChart = null
var isCompleteGrade = false, isCompleteKnowledge = false
var subjectId = '', xuehao = '', className = '' // 数据信息

function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }

  return vars;
}
var paramsdata = getUrlVars();

$(function () {
  // var paramUrl = location.search.substring(1)
  // var paramArr = paramUrl.split('&')
  // paramArr.forEach(function(item){
  //   if(item.indexOf('subjectId=')>=0){
  //     subjectId = item.split('=')[1]
  //   }
  //   if(item.indexOf('xuehao=')>=0){
  //     xuehao = item.split('=')[1]
  //   }
  //   if(item.indexOf('className=')>=0){
  //     className = item.split('=')[1]
  //   }
  // })
  
  subjectId = paramsdata.subjectId
  xuehao = paramsdata.xuehao
  className = paramsdata.className

  initTrendEchart()
  getScoreData();
  getKnowledgeData()
});

// 成绩
function getScoreData(){
  $.ajax({
    url: domain +"queryGradeClassScoreInfo",
    type: "POST",
    dataType: "json",
    async: false,
    contentType: 'application/json;charset=utf-8',
    data: JSON.stringify({subjectId: subjectId, xuehao: xuehao, className: className}), // subjectId: '10000347',xuehao: '090205', className: '64'
    success: function (data) {
      if(data.success){
        const result = JSON.parse(data.message)
        const list = []
        // console.log("score", result);
  
        $(".static-data-left .score").text(result.score)
        $(".static-data-left .total").text('/'+ result.totalScore)
        $(".static-data-right .grade1").text(result.gradeMaxScore)
        $(".static-data-right .class1").text(result.classMaxScore)
        $(".static-data-right .grade2").text(result.gradeAverageScore)
        $(".static-data-right .class2").text(result.classAverageScore)
  
        for(i in result.scorePart){
          list.push({
            score: i,
            person: result.scorePart[i]
          })
        }
  
        // console.log('list', list)
        initScoreEchart(result.score, list)
  
        isCompleteGrade = true
        verifyComplete()
      }else{
        isCompleteGrade = true
        verifyComplete()
      }
    }
  });
}

// 统计占比
function getKnowledgeData(){
  $.ajax({
    url: domain +"queryStudentPaperKnowledge",
    type: "POST",
    dataType: "json",
    async: false,
    contentType: 'application/json;charset=utf-8',
    data: JSON.stringify({subjectId: subjectId, xuehao: xuehao}), // subjectId: '10000251',xuehao: '252008'
    success: function (data) {
      if(data.success){
        const result = JSON.parse(data.message)
        // console.log('统计占比', result)
  
        $('.exam-paper-body').html('')
        $('.static-score .total').text(result.subjectiveTopicScore + result.objectiveTopicScore)
        $('.static-score .subject').text(result.subjectiveTopicScore)
        $('.static-score .object').text(result.objectiveTopicScore)
        var html = ''
  
        result.knowledgeInfos.forEach(function(item){
          html = '<tr>'
            html += '<td>'+ item.knowledge +'</td>'
            html += '<td>'
              html += '<div class="percent">'
                html += '<span style="width: '+ item.scoreProportion +'%;"></span>'
                html += '<em>'+ item.scoreProportion +'%</em>'
              html += '</div>'
            html += '</td>'
            html += '<td>'+ item.score +'</td>'
          html += '</tr>'
  
          $('.exam-paper-body').append(html)
        });
  
        isCompleteKnowledge = true
        verifyComplete()
      }else{
        isCompleteKnowledge = true
        verifyComplete()
      }
    }
  });
}

// 分数段统计图表
function initScoreEchart(score, list){
  scoreChart = echarts.init(document.getElementById('scoreChart'));
  var xData = [], yData = [], dd = [], curPosition = [];
  var len = list.length

  list.forEach(function(item, index){
    if(index < len-1){
      if(score >= item.score && score < list[index+1].score){
        curPosition = [index, item.person]
      }
    }else{
      if(score >= item.score){
        curPosition = [index, item.person]
      }
    }

    xData.push(item.score)
    if(curPosition[0] == index){
      dd.push({
        name: '我',
        value: item.person,
        itemStyle : {
          normal : {
            color: '#9171de'
          }
        },
      })
    }else{
      dd.push(item.person)
    }
  })

  yData = [
    {
      type:'bar',
      barWidth: '50%',
      markPoint : {
        data : [{
          value: '我的\n位置',
          coord: curPosition,
          itemStyle : {
            normal : {
              color: '#ff7e00'
            }
          },
        }]
      },
      data: dd
    }
  ]

  var option = {
    color: ['#febe02'],
    tooltip : {
      trigger: 'axis',
      axisPointer : {
        type : 'shadow'
      }
    },
    animation: false,
    grid: {
      left: '4%',
      right: '60',
      bottom: '3%',
      containLabel: true
    },
    xAxis : [
      {
        type : 'category',
        name: '分数段',
        axisLine: {
          lineStyle: {
            color: "#d8d8d8"
          }
        },
        axisLabel: {
          color: '#666666'
        },
        nameTextStyle: {
          color: '#666666'
        },
        data : xData
      }
    ],
    yAxis : [
      {
        type : 'value',
        name: '年纪所处分数段人数',
        axisTick: { show: false },
        axisLine: {
          lineStyle: {
            color: "#d8d8d8"
          }
        },
        axisLabel: {
          color: '#666666'
        },
        nameTextStyle: {
          color: '#666666'
        }
      }
    ],
    series: yData
  };
  scoreChart.setOption(option);
}

// 学科趋势图表
function initTrendEchart(){
  trendChart = echarts.init(document.getElementById('trendChart'));
  var xData = ['2019.10.11 月考', '2019.10.12 月考', '2019.10.13 月考']
  var yData = [
    {
      type: 'line',
      data: [100, 330, 220]
    }
  ]

  var option = {
    color: ['#febe02'],
    tooltip : {
      trigger: 'axis',
      axisPointer : {
        type : 'shadow'
      }
    },
    animation: false,
    grid: {
      left: '4%',
      right: '80',
      bottom: '3%',
      containLabel: true
    },
    xAxis : [
      {
        type : 'category',
        name: '未被屏蔽\n排名的考试',
        axisLine: {
          lineStyle: {
            color: "#d8d8d8"
          }
        },
        axisLabel: {
          color: '#666666'
        },
        nameTextStyle: {
          color: '#666666'
        },
        data : xData
      }
    ],
    yAxis : [
      {
        type : 'value',
        name: '年纪击败率',
        axisTick: { show: false },
        axisLine: {
          lineStyle: {
            color: "#d8d8d8"
          }
        },
        axisLabel: {
          color: '#666666'
        },
        nameTextStyle: {
          color: '#666666'
        }
      }
    ],
    series: yData
  };

  trendChart.setOption(option);
}

function verifyComplete(){
  if(isCompleteGrade && isCompleteKnowledge){
    var timer = setTimeout(function(){
      window.document.status = 'completed'
      clearTimeout(timer)
    }, 1000)
  }
}

