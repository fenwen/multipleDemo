
// 加载数据
function loadData(){
    // var params = {
    //     p0: serverName,
    //     p1: 'loadData',
    //     p2: {},
    //     servicename: 'customService'
    // }
    // params=JSON.stringify(params);
    
    // $.ajax({
    //     url: baseUrl,
    //     type: 'POST',
    //     dataType: 'json',
    //     contentType:"application/json;charset=utf-8",
    //     data: params,
    //     success: function(res){
            var res = {"@type":"java.util.HashMap","thornMessageKey":{"@type":"com.vtradex.thorn.client.ui.support.MessageKey","errorMessage":false,"message":"{\"locationCode\":\"ZT08-0001\",\"locationNumber\":\"39\",\"putawayQty\":\"2\",\"backWarehouseQty\":\"3\",\"forkliftCodes\":[{\"forkliftId\":\"21\",\"forkliftCode\":\"1003\",\"aisleCodes\":[{\"aisleId\":\"2\",\"aisleCode\":\"ZT06\"},{\"aisleId\":\"1\",\"aisleCode\":\"ZT08\"}]},{\"forkliftId\":\"2\",\"forkliftCode\":\"1002\",\"aisleCodes\":[{\"aisleId\":\"21\",\"aisleCode\":\"ZT05\"},{\"aisleId\":\"2\",\"aisleCode\":\"ZT06\"},{\"aisleId\":\"1\",\"aisleCode\":\"ZT08\"}]}],\"locations\":[{\"height\":\"121\",\"left\":\"5\",\"right\":\"8\",\"total\":\"13\"},{\"height\":\"122\",\"left\":\"5\",\"right\":\"8\",\"total\":\"13\"},{\"height\":\"123\",\"left\":\"5\",\"right\":\"8\",\"total\":\"13\"}],\"putaways\":[{\"palletNo\":\"p202111021\",\"type\":\"回库\"},{\"palletNo\":\"p202211022\",\"type\":\"回库\"},{\"palletNo\":\"p202311023\",\"type\":\"回库\"},{\"palletNo\":\"p202411024\",\"type\":\"上架\"}],\"tableDtos\":[{\"orderId\":\"469\",\"materialCode\":\"TECOLA\",\"materialName\":\"可乐\",\"storageLocation\":\"W501\",\"quantity\":\"2.0\"},{\"orderId\":\"376\",\"materialCode\":\"TEL001\",\"materialName\":\"X-地铁大柜体80*80\",\"storageLocation\":\"W501\",\"quantity\":\"2.0\"}]}"}}
            if(!res.thornMessageKey.errorMessage){
                var data = JSON.parse(res.thornMessageKey.message);
                forkliftCodes = data.forkliftCodes || []

                $('#forklift_codes').html("")
                var html = "<option value=''>请选择</option>";
                for (var i = 0; i < forkliftCodes.length; i++) {
                    html += '<option value="' + forkliftCodes[i].forkliftId + '">' + forkliftCodes[i].forkliftCode + '</option>';
                }
                $("#forklift_codes").html(html);

                $("#forklift_codes").change(function(){
                    var forkId = $("#forklift_codes").val()

                    refreshPage() // 重置数据
                    refreshPickPage()

                    // 巷道
                    if(forkId){
                        for (var i = 0; i < forkliftCodes.length; i++) {
                            if(forkliftCodes[i].forkliftId == forkId && forkliftCodes[i]['aisleCodes'] && forkliftCodes[i]['aisleCodes'].length>0){
                                var aHtml = "<option value=''>请选择</option>";
                                var element = forkliftCodes[i]['aisleCodes']
                                for (var j = 0; j < element.length; j++) {
                                    aHtml += '<option value="' + element[j].aisleId + '">' + element[j].aisleCode + '</option>';
                                }
                                $("#aisle_code_put").html(aHtml);
                                $("#aisle_code_pick").html(aHtml);
                            }
                        }
                    }
                });

                $("#aisle_code_put").change(function(){
                    var aisleId = $("#aisle_code_put").val()

                    $('#execute_btn').addClass('disabled').off('click')
                    $('#put_finish_btn').addClass('disabled').off('click')

                    // 巷道
                    if(aisleId){
                        $('#query_btn').removeClass('disabled').off('click').on('click', function(){
                            queryData()
                        })
                        $('#next_location_btn').removeClass('disabled').off('click').on('click', function(){
                            queryNextLocation()
                        })
                        $('#task_back_btn').removeClass('disabled').off('click').on('click', function(){
                            queryBackBtn()
                        })
                        $('#task_close_btn').removeClass('disabled').off('click').on('click', function(){
                            queryCloseBtn()
                        })
                    }else{
                        $('#query_btn').addClass('disabled').off('click')
                        $('#next_location_btn').addClass('disabled').off('click')
                        $('#task_back_btn').addClass('disabled').off('click')
                        $('#task_close_btn').addClass('disabled').off('click')
                    }
                });

                $("#aisle_code_pick").change(function(){
                    var aisleId = $("#aisle_code_pick").val()

                    $('#execute_pick_btn').addClass('disabled').off('click')
                    $('#put_finish_pick_btn').addClass('disabled').off('click')

                    // 巷道
                    if(aisleId){
                        $('#query_pick_btn').removeClass('disabled').off('click').on('click', function(){
                            queryPickData()
                        })
                        $('#task_back_pick_btn').removeClass('disabled').off('click').on('click', function(){
                            queryPickBack()
                        })
                        $('#task_close_pick_btn').removeClass('disabled').off('click').on('click', function(){
                            queryPickClose()
                        })
                    }else{
                        $('#query_pick_btn').addClass('disabled').off('click')
                        $('#task_back_pick_btn').addClass('disabled').off('click')
                        $('#task_close_pick_btn').addClass('disabled').off('click')
                    }
                });
            }else{
                alert(res.thornMessageKey.message)
            }
    //     },
    //     error: function(err){
    //         alert('fail'+ err);
    //     }
    // })
}

// 查询
function queryData(){
    var directVal = ''
    var directRadio = $("input[name='direct']")
    for(var i=0; i<directRadio.length; i++){
        if(directRadio[i].checked){
            directVal = directRadio[i].value
        }
    }

    $('#execute_btn').addClass('disabled').off('click')
    $('#put_finish_btn').addClass('disabled').off('click')

    // if(!$("#forklift_codes").val() || !$("#aisle_code_put").val()){
    //     return;
    // }

    // var params = {
    //     p0: serverName,
    //     p1: 'inquire',
    //     p2: {
    //         aisle: $("#aisle_code_put").val(),
    //         direction: directVal,
    //         forklift: $("#forklift_codes").val()
    //     },
    //     servicename: 'customService'
    // }
    // params=JSON.stringify(params);
    
    // $.ajax({
    //     url: baseUrl,
    //     type: 'POST',
    //     dataType: 'json',
    //     contentType:"application/json;charset=utf-8",
    //     data: params,
    //     success: function(res){
            var res = {"@type":"java.util.HashMap","thornMessageKey":{"@type":"com.vtradex.thorn.client.ui.support.MessageKey","errorMessage":false,"message":"{\"locationCode\":\"ZT08-0001\",\"locationNumber\":\"39\",\"putawayQty\":\"2\",\"backWarehouseQty\":\"3\",\"forkliftCodes\":[{\"forkliftId\":\"21\",\"forkliftCode\":\"1003\"},{\"forkliftId\":\"2\",\"forkliftCode\":\"1002\",\"aisleCodes\":[{\"aisleId\":\"1\",\"aisleCode\":\"ZT08\"}]}],\"locations\":[{\"height\":\"121\",\"left\":\"5\",\"right\":\"8\",\"total\":\"13\"},{\"height\":\"122\",\"left\":\"5\",\"right\":\"8\",\"total\":\"13\"},{\"height\":\"123\",\"left\":\"5\",\"right\":\"8\",\"total\":\"13\"}],\"putaways\":[{\"palletNo\":\"p202111021\",\"type\":\"回库\"},{\"palletNo\":\"p202211022\",\"type\":\"回库\"},{\"palletNo\":\"p202311023\",\"type\":\"回库\"},{\"palletNo\":\"p202411024\",\"type\":\"上架\"}],\"tableDtos\":[{\"orderId\":\"469\",\"materialCode\":\"TECOLA\",\"materialName\":\"可乐\",\"storageLocation\":\"W501\",\"quantity\":\"2.0\"},{\"orderId\":\"376\",\"materialCode\":\"TEL001\",\"materialName\":\"X-地铁大柜体80*80\",\"storageLocation\":\"W501\",\"quantity\":\"2.0\"}]}"}}
            if(!res.thornMessageKey.errorMessage){
                var data = JSON.parse(res.thornMessageKey.message);
                setTabOneData(data)
            }else{
                alert(res.thornMessageKey.message)
            }
    //     },
    //     error: function(err){
    //         alert('fail'+ err);
    //     }
    // })
}

// 设置页面数据
function setTabOneData(data){
    $('.box_num').text(data.palletNo)
    $('.recommend_location').text(data.locationCode)
    $('.current_task').text(data.mission)
    $('.location_num').text(data.locationNumber)
    $('.putaway_num').text(data.putawayQty)
    $('.back_num').text(data.backWarehouseQty)
    
    selection = []
    materialList = data.tableDtos || []
    locationList = data.locations || []
    putawayList = data.putaways || []

    $("#materialTable tbody").html('')
    if(materialList.length > 0){
        $.each(materialList, function(i, item) {
            $("#materialTable tbody").append(""
                +"<tr>"
                    +"<td class='checkbox'><input class='check_item' type='checkbox' value='"+ item.orderId +"' id='"+ item.orderId +"' onclick='onclickCheckbox();'></td>"
                    +"<td>"+ item.orderId +"</td>"
                    +"<td>"+ item.materialCode +"</td>"
                    +"<td>"+ item.materialName +"</td>"
                    +"<td>"+ item.storageLocation +"</td>"
                    +"<td>"+ item.quantity +"</td>"
                +"</tr>"
            )
        })
        
        $("#materialTable input.check_item").eq(0).prop("checked","checked"); // 默认选中第一条
        checkedChangeState()
    }else{
        $("#materialTable tbody").append('<tr><td colspan="6" style="text-align: center">暂无数据</td></tr>')
    }
    
    // 行选择
    $("#materialTable").off("click", "tr td:not(.checkbox)").on("click", "tr td:not(.checkbox)", function () {
        var id = $(this).parent('tr').find("input[type=checkbox]").attr('id')
        document.getElementById(id).click();

        var status = $(this).parent('tr').find('.check_item').attr('checked')
        if(status == 'checked'){
            $(this).parent('tr').siblings().find('.check_item').attr('checked', false)
        }
    });

    $("#locationTable tbody").html('')
    if(locationList.length > 0){
        $.each(locationList, function(i, item) {
            $("#locationTable tbody").append(""
                +"<tr>"
                    +"<td>"+ item.height +"</td>"
                    +"<td>"+ item.left +"</td>"
                    +"<td>"+ item.right +"</td>"
                    +"<td>"+ item.total +"</td>"
                +"</tr>"
            )
        })
    }else{
        $("#locationTable tbody").append('<tr><td colspan="4" style="text-align: center">暂无数据</td></tr>')
    }

    $("#putawayTable tbody").html('')
    if(putawayList.length > 0){
        $.each(putawayList, function(i, item) {
            $("#putawayTable tbody").append(""
                +"<tr>"
                    +"<td>"+ item.palletNo +"</td>"
                    +"<td>"+ item.type +"</td>"
                +"</tr>"
            )
        })
    }else{
        $("#putawayTable tbody").append('<tr><td colspan="2" style="text-align: center">暂无数据</td></tr>')
    }
}

// 选择所有
function seletedAllCheckboxState(state){
    $('#materialTable .check_item').each(function () {
        this.checked = state;
    });
    
    checkedChangeState()
}

// 选择单个
function onclickCheckbox(){
    setTimeout(function(){
        checkedChangeState()
    }, 50)
}

// 选择控制按钮
function checkedChangeState(){
    selection = getCheckboxData()

    if(selection.length == 1){
        $('#execute_btn').removeClass('disabled').off('click').on('click', function(){
            queryExecute()
        })
        $('#put_finish_btn').removeClass('disabled').off('click').on('click', function(){
            queryPutFinish()
        })
    }else{
        $('#execute_btn').addClass('disabled').off('click')
        $('#put_finish_btn').addClass('disabled').off('click')
    }
}

// 获取选中数据的Data
function getCheckboxData(){
    var list = []

    $("#materialTable .check_item:checkbox").each(function () {
        var that = $(this)
        if ($(this).attr("checked")) {
            for(var i=0; i<materialList.length; i++){
                if(that.val() == materialList[i].orderId){
                    list.push(materialList[i])
                }
            }
        }
    });
    return list;
}

// 下一库位
function queryNextLocation(){
    var directVal = ''
    var directRadio = $("input[name='direct']")
    for(var i=0; i<directRadio.length; i++){
        if(directRadio[i].checked){
            directVal = directRadio[i].value
        }
    }

    // var params = {
    //     p0: serverName,
    //     p1: 'changeLocation',
    //     p2: {
    //         orderId: selection[0].orderId,
    //         aisle: $("#aisle_code_put").val(),
    //         direction: directVal,
    //         forklift: $("#forklift_codes").val()
    //     },
    //     servicename: 'customService'
    // }
    // params=JSON.stringify(params);
    
    // $.ajax({
    //     url: baseUrl,
    //     type: 'POST',
    //     dataType: 'json',
    //     contentType:"application/json;charset=utf-8",
    //     data: params,
    //     success: function(res){
            var res = {"@type":"java.util.HashMap","thornMessageKey":{"@type":"com.vtradex.thorn.client.ui.support.MessageKey","errorMessage":true,"message":"未找到已完成任务"}}
            if(!res.thornMessageKey.errorMessage){
                var data = JSON.parse(res.thornMessageKey.message);
                $('.recommend_location').text(data.locationCode)
                $('.current_task').text(data.mission)
                toggleInfoDialog('操作成功')
            }else{
                alert(res.thornMessageKey.message)
            }
    //     },
    //     error: function(err){
    //         alert('fail'+ err);
    //     }
    // })
}

// 任务回滚
function queryBackBtn(){
    // var params = {
    //     p0: serverName,
    //     p1: 'taskBack',
    //     p2: {
    //         forklift: $("#forklift_codes").val()
    //     },
    //     servicename: 'customService'
    // }
    // params=JSON.stringify(params);
    
    // $.ajax({
    //     url: baseUrl,
    //     type: 'POST',
    //     dataType: 'json',
    //     contentType:"application/json;charset=utf-8",
    //     data: params,
    //     success: function(res){
            var res = {"@type":"java.util.HashMap","thornMessageKey":{"@type":"com.vtradex.thorn.client.ui.support.MessageKey","errorMessage":true,"message":"未找到已完成任务"}}
            if(!res.thornMessageKey.errorMessage){
                var data = JSON.parse(res.thornMessageKey.message);
                alert('操作成功')
            }else{
                alert(res.thornMessageKey.message)
            }
    //     },
    //     error: function(err){
    //         alert('fail'+ err);
    //     }
    // })
}

// 任务关闭
function queryCloseBtn(){
    var params = {
        p0: serverName,
        p1: 'taskClose',
        p2: {
            forklift: $("#forklift_codes").val()
        },
        servicename: 'customService'
    }
    params=JSON.stringify(params);
    
    $.ajax({
        url: baseUrl,
        type: 'POST',
        dataType: 'json',
        contentType:"application/json;charset=utf-8",
        data: params,
        success: function(res){
            if(!res.thornMessageKey.errorMessage){
                var data = JSON.parse(res.thornMessageKey.message);
                alert('操作成功')
            }else{
                alert(res.thornMessageKey.message)
            }
        },
        error: function(err){
            alert('fail'+ err);
        }
    })
}

// 执行任务
function queryExecute(){
    // var params = {
    //     p0: serverName,
    //     p1: 'execute',
    //     p2: {
    //         orderId: selection[0].orderId,
    //         locationCode: $('.recommend_location').text(),
    //         palletNo: $('.box_num').text(),
    //         forkliftId: $("#forklift_codes").val()
    //     },
    //     servicename: 'customService'
    // }
    // params=JSON.stringify(params);
    
    // $.ajax({
    //     url: baseUrl,
    //     type: 'POST',
    //     dataType: 'json',
    //     contentType:"application/json;charset=utf-8",
    //     data: params,
    //     success: function(res){
            var res = {"@type":"java.util.HashMap","thornMessageKey":{"@type":"com.vtradex.thorn.client.ui.support.MessageKey","errorMessage":true,"message":"未找到已完成任务"}}
            if(!res.thornMessageKey.errorMessage){
                var data = JSON.parse(res.thornMessageKey.message);
                $('.current_task').text(data.mission)
                // setTabOneData(data)
                toggleInfoDialog('操作成功')
            }else{
                alert(res.thornMessageKey.message)
            }
    //     },
    //     error: function(err){
    //         alert('fail'+ err);
    //     }
    // })
}

//任务完成
function queryPutFinish(){
    // var params = {
    //     p0: serverName,
    //     p1: 'putFinsh',
    //     p2: {
    //         orderId: selection[0].orderId,
    //         locationCode: $('.recommend_location').text(),
    //         palletNo: $('.box_num').text(),
    //         forkliftId: $("#forklift_codes").val()
    //     },
    //     servicename: 'customService'
    // }
    // params=JSON.stringify(params);
    
    // $.ajax({
    //     url: baseUrl,
    //     type: 'POST',
    //     dataType: 'json',
    //     contentType:"application/json;charset=utf-8",
    //     data: params,
    //     success: function(res){
            var res = {"@type":"java.util.HashMap","thornMessageKey":{"@type":"com.vtradex.thorn.client.ui.support.MessageKey","errorMessage":true,"message":"未找到已完成任务"}}
            if(!res.thornMessageKey.errorMessage){
                // var data = JSON.parse(res.thornMessageKey.message);
                // setTabOneData(data)
                toggleInfoDialog('操作成功')
                queryData()
            }else{
                alert(res.thornMessageKey.message)
            }
    //     },
    //     error: function(err){
    //         alert('fail'+ err);
    //     }
    // })
}

// 刷新
function refreshPage(){
    materialList = []
    selection = []
    locationList = []
    putawayList = []

    $('#aisle_code_put').val('')
    $('.box_num').text('')
    $('.recommend_location').text('')
    $('.current_task').text('')
    $('.location_num').text('')
    $('.putaway_num').text('')
    $('.back_num').text('')
    $("#materialTable tbody").html('<tr><td colspan="6" style="text-align: center">暂无数据</td></tr>')
    $("#locationTable tbody").html('<tr><td colspan="4" style="text-align: center">暂无数据</td></tr>')
    $("#putawayTable tbody").html('<tr><td colspan="2" style="text-align: center">暂无数据</td></tr>')
}

// 设置table高度
function setTableHeight(){
    var winH = $(window).height()
    var index = $('.tab_title li.active').index()
    var conditionH = $('.head_row_0').height() + $('.tab_head').height()
    var conditionPickH = $('.head_row_1').height() + $('.tab_head').height() + $('.wave_detail_form').height()
    
    $('.material_tab_content').height(winH*0.6 - conditionH/2 - 32)
    $('.bottom_tab_content').height(winH*0.4 - conditionH/2 - 32)
    $('.bottom_tab').height(winH*0.4 - conditionH/2 - 62)

    $('.wave_tab_content').height(winH*0.5 - conditionPickH/2 - 36)
    $('.wave_detail_tab_content').height(winH*0.5 - conditionPickH/2 - 36)
    
}

// 提示文字
function toggleInfoDialog(msg){
    if(popTimer) clearInterval(popTimer)
    $('#tips_pop').show()
    $('#tips_pop .tips_text').text(msg)
    
    popTimer = setTimeout(function(){
        $('#tips_pop').hide().text(msg)
        clearInterval(popTimer)
    }, 30000)
}



// -----------------------拣货分割线-----------------------------
// 查询
function queryPickData(){
    var torrVal = ''
    var torrRadio = $("input[name='torr']")
    for(var i=0; i<torrRadio.length; i++){
        if(torrRadio[i].checked){
            torrVal = torrRadio[i].value
        }
    }

    $('#execute_pick_btn').addClass('disabled').off('click')
    $('#put_finish_pick_btn').addClass('disabled').off('click')

    if(!$("#forklift_codes").val() || !$("#aisle_code_pick").val()){
        return;
    }

    var params = {
        p0: serverPickName,
        p1: 'inquire',
        p2: {
            aisle: $("#aisle_code_pick").val(),
            waveType: torrVal,
            forklift: $("#forklift_codes").val()
        },
        servicename: 'customService'
    }
    params=JSON.stringify(params);
    
    // $.ajax({
    //     url: baseUrl,
    //     type: 'POST',
    //     dataType: 'json',
    //     contentType:"application/json;charset=utf-8",
    //     data: params,
    //     success: function(res){
            var res = {"@type":"java.util.HashMap","thornMessageKey":{"@type":"com.vtradex.thorn.client.ui.support.MessageKey","errorMessage":false,"message":"{\"alltaskQty\":\"2\",\"aisletaskQty\":\"2\",\"workingWaves\":[{\"id\":\"1\",\"waveId\":\"66\",\"locationCode\":\"ZT08-0101\",\"palletNo\":\"T1504\",\"waveCode\":\"CP001CGRK201015000002\",\"lineno\":\"1\",\"waveQty\":\"5.0\",\"invQty\":\"0\",\"itemCode\":\"可乐\"},{\"id\":\"2\",\"waveId\":\"101\",\"locationCode\":\"ZT08-0101\",\"palletNo\":\"T2112\",\"waveCode\":\"CP001TW006201021000008\",\"lineno\":\"1\",\"waveQty\":\"5.0\",\"invQty\":\"2.0\",\"itemCode\":\"可乐\"}]}"}}
            if(!res.thornMessageKey.errorMessage){
                var data = JSON.parse(res.thornMessageKey.message);
                
                setTabWaveData(data, false)
            }else{
                alert(res.thornMessageKey.message)
            }
    //     },
    //     error: function(err){
    //         alert('fail'+ err);
    //     }
    // })
}

function setTabWaveData(data, haveDetail){
    selectionWave = []
    waveList = data.workingWaves || []
    $('.task_num').text(data.alltaskQty)
    $('.tunnel_num').text(data.aisletaskQty)
    $('.pick_current_task').text(data.mission)

    $("#waveTable tbody").html('')
    if(waveList.length > 0){
        $.each(waveList, function(i, item) {
            $("#waveTable tbody").append(""
                +"<tr>"
                    +"<td class='checkbox'><input class='check_item' type='checkbox' value='"+ item.id +"' id='"+ item.id +"' onclick='onclickWaveCheckbox();'></td>"
                    +"<td>"+ item.locationCode +"</td>"
                    +"<td>"+ item.palletNo +"</td>"
                    +"<td>"+ item.waveCode +"</td>"
                    +"<td>"+ item.itemCode +"</td>"
                    +"<td>"+ item.lineno +"</td>"
                    +"<td>"+ item.waveQty +"</td>"
                    +"<td>"+ item.invQty +"</td>"
                +"</tr>"
            )
        })

        $("#waveTable input.check_item").eq(0).prop("checked","checked"); // 默认选中第一条
        checkedChangeWaveState()
    }else{
        $("#waveTable tbody").append('<tr><td colspan="8" style="text-align: center">暂无数据</td></tr>')
    }
    
    // 行选择
    $("#waveTable").off("click", "tr td:not(.checkbox)").on("click", "tr td:not(.checkbox)", function () {
        var id = $(this).parent('tr').find("input[type=checkbox]").attr('id')
        document.getElementById(id).click();

        var status = $(this).parent('tr').find('.check_item').attr('checked')
        if(status == 'checked'){
            $(this).parent('tr').siblings().find('.check_item').attr('checked', false)
        }
    });
}

// wave table——选择所有
function seletedAllCheckboxWaveState(state){
    $('#waveTable .check_item').each(function () {
        this.checked = state;
    });
    
    checkedChangeWaveState()
}

// wave table——选择单个
function onclickWaveCheckbox(){
    setTimeout(function(){
        checkedChangeWaveState()
    }, 50)
}

// wave table——选择控制按钮
function checkedChangeWaveState(){
    selectionWave = getCheckboxWaveData()

    if(selectionWave.length == 1){
        $('#execute_pick_btn').removeClass('disabled').off('click').on('click', function(){
            queryPickExecute()
        })
        $('#put_finish_pick_btn').removeClass('disabled').off('click').on('click', function(){
            queryPickFinish()
        })

        queryDetailData()
    }else{
        $('#execute_pick_btn').addClass('disabled').off('click')
        $('#put_finish_pick_btn').addClass('disabled').off('click')

        waveDetailList = []
        selectionDetailWave = []
        $("#waveDetailTable tbody").html('<tr><td colspan="13" style="text-align: center">暂无数据</td></tr>')
    }
}

// wave table——获取选中数据的Data
function getCheckboxWaveData(){
    var list = []

    $("#waveTable .check_item:checkbox").each(function () {
        var that = $(this)
        if ($(this).attr("checked")) {
            for(var i=0; i<waveList.length; i++){
                if(that.val() == waveList[i].id){
                    list.push(waveList[i])
                }
            }
        }
    });
    return list;
}

// 详情接口
function queryDetailData(){
    var torrVal = ''
    var torrRadio = $("input[name='torr']")
    for(var i=0; i<torrRadio.length; i++){
        if(torrRadio[i].checked){
            torrVal = torrRadio[i].value
        }
    }

    // var params = {
    //     p0: serverPickName,
    //     p1: 'querydate',
    //     p2: {
    //         forkliftId: $("#forklift_codes").val(),
    //         waveId: selectionWave[0].waveId,
    //         palletNo: selectionWave[0].palletNo,
    //         waveType: torrVal
    //     },
    //     servicename: 'customService'
    // }
    // params=JSON.stringify(params);
    
    // $.ajax({
    //     url: baseUrl,
    //     type: 'POST',
    //     dataType: 'json',
    //     contentType:"application/json;charset=utf-8",
    //     data: params,
    //     success: function(res){
            var res = {"@type":"java.util.HashMap","thornMessageKey":{"@type":"com.vtradex.thorn.client.ui.support.MessageKey","errorMessage":false,"message":"{\"alltaskQty\":\"51\",\"aisletaskQty\":\"16\",\"mission\":\"ZV10-0000\",\"workingWaves\":[{\"waveId\":\"147225\",\"locationCode\":\"ZV09-0904\",\"palletNo\":\"2020030426\",\"waveCode\":\"ZZWAVE210629000006\",\"lineno\":\"2\",\"waveQty\":\"2.0\",\"invQty\":\"1127.0\",\"itemCode\":\"M12插头(SACC-MSD-4PCT-SH PN SCO)\"},{\"waveId\":\"147298\",\"locationCode\":\"ZV09-1004\",\"palletNo\":\"2010020145\",\"waveCode\":\"ZZWAVE210628000012\",\"lineno\":\"1\",\"waveQty\":\"12.0\",\"invQty\":\"12.0\",\"itemCode\":\"电力电子电容器(RN11X278KXXXYA)\"},{\"waveId\":\"147207\",\"locationCode\":\"ZV09-1904\",\"palletNo\":\"2020001735\",\"waveCode\":\"ZZWAVE210629000005\",\"lineno\":\"1\",\"waveQty\":\"1.0\",\"invQty\":\"35.0\",\"itemCode\":\"A1平台主变电源板(CD110T170-151515)\"},{\"waveId\":\"147277\",\"locationCode\":\"ZV09-1908\",\"palletNo\":\"2010015594\",\"waveCode\":\"ZZWAVE210628000010\",\"lineno\":\"1\",\"waveQty\":\"1.0\",\"invQty\":\"1.0\",\"itemCode\":\"离心风机(TJL390-1E)\"},{\"waveId\":\"147247\",\"locationCode\":\"ZV09-2101\",\"palletNo\":\"2020003602\",\"waveCode\":\"ZZWAVE210628000006\",\"lineno\":\"2\",\"waveQty\":\"279.0\",\"invQty\":\"470.0\",\"itemCode\":\"门锁(MTST-01-22/18)\"},{\"waveId\":\"147298\",\"locationCode\":\"ZV09-2101\",\"palletNo\":\"2020003602\",\"waveCode\":\"ZZWAVE210628000012\",\"lineno\":\"1\",\"waveQty\":\"7.0\",\"invQty\":\"470.0\",\"itemCode\":\"门锁(MTST-01-22/18)\"},{\"waveId\":\"147247\",\"locationCode\":\"ZV09-2504\",\"palletNo\":\"2020000056\",\"waveCode\":\"ZZWAVE210628000006\",\"lineno\":\"1\",\"waveQty\":\"12.0\",\"invQty\":\"291.0\",\"itemCode\":\"风机网罩(LZ36)\"},{\"waveId\":\"147207\",\"locationCode\":\"ZV09-2506\",\"palletNo\":\"2020004634\",\"waveCode\":\"ZZWAVE210629000005\",\"lineno\":\"1\",\"waveQty\":\"4.0\",\"invQty\":\"5.0\",\"itemCode\":\"电容母排(TS8270000000)\"},{\"waveId\":\"147207\",\"locationCode\":\"ZV09-2705\",\"palletNo\":\"2020030787\",\"waveCode\":\"ZZWAVE210629000005\",\"lineno\":\"1\",\"waveQty\":\"4.0\",\"invQty\":\"4.0\",\"itemCode\":\"复合母排(BB249310500)\"},{\"waveId\":\"147225\",\"locationCode\":\"ZV10-0108\",\"palletNo\":\"2020002519\",\"waveCode\":\"ZZWAVE210629000006\",\"lineno\":\"1\",\"waveQty\":\"3.0\",\"invQty\":\"3.0\",\"itemCode\":\"机箱装配B(XS031\\\\\\\\001-52B)\"},{\"waveId\":\"147207\",\"locationCode\":\"ZV10-0612\",\"palletNo\":\"2020001989\",\"waveCode\":\"ZZWAVE210629000005\",\"lineno\":\"4\",\"waveQty\":\"21.0\",\"invQty\":\"21.0\",\"itemCode\":\"铝壳干式直流滤波电容器(C3B1X757J90H731000)\"},{\"waveId\":\"147169\",\"locationCode\":\"ZV10-0711\",\"palletNo\":\"2020005463\",\"waveCode\":\"ZZWAVE210629000004\",\"lineno\":\"2\",\"waveQty\":\"8.0\",\"invQty\":\"164.0\",\"itemCode\":\"接触器(3TH4244-OLF4)\"},{\"waveId\":\"147277\",\"locationCode\":\"ZV10-1011\",\"palletNo\":\"2010044424\",\"waveCode\":\"ZZWAVE210628000010\",\"lineno\":\"2\",\"waveQty\":\"3.0\",\"invQty\":\"4.0\",\"itemCode\":\"离心风机(TJL390-1E)\"},{\"waveId\":\"147277\",\"locationCode\":\"ZV10-1105\",\"palletNo\":\"2020030370\",\"waveCode\":\"ZZWAVE210628000010\",\"lineno\":\"2\",\"waveQty\":\"36.0\",\"invQty\":\"62.0\",\"itemCode\":\"电缆夹(HSK-M\\\\\\\\M20*1.5/(5-9)(1.609.2000.51))\"},{\"waveId\":\"147207\",\"locationCode\":\"ZV10-2208\",\"palletNo\":\"2020004258\",\"waveCode\":\"ZZWAVE210629000005\",\"lineno\":\"1\",\"waveQty\":\"3.0\",\"invQty\":\"12.0\",\"itemCode\":\"复合母排A(2000V\\\\650A)\"},{\"waveId\":\"147277\",\"locationCode\":\"ZV10-2812\",\"palletNo\":\"2020004507\",\"waveCode\":\"ZZWAVE210628000010\",\"lineno\":\"2\",\"waveQty\":\"24.0\",\"invQty\":\"90.0\",\"itemCode\":\"B57罩座组件(未塑封金属手把)(113010600597)\"}],\"waveDetail\":[{\"detailId\":\"631495\",\"itemId\":\"109541\",\"itemCode\":\"W200000922\",\"itemName\":\"接触器(3TH4244-OLF4)\",\"bulky\":\"DJ\",\"weight\":\"0\",\"deQty\":\"4.0\",\"invQty\":\"164.0\",\"shortQty\":\"0\",\"pickedQty\":\"0.0\",\"frozenQty\":\"0\",\"status\":\"工作中\"},{\"detailId\":\"631501\",\"itemId\":\"109541\",\"itemCode\":\"W200000922\",\"itemName\":\"接触器(3TH4244-OLF4)\",\"bulky\":\"DJ\",\"weight\":\"0\",\"deQty\":\"4.0\",\"invQty\":\"164.0\",\"shortQty\":\"0\",\"pickedQty\":\"0.0\",\"frozenQty\":\"0\",\"status\":\"工作中\"},{\"detailId\":\"631492\",\"itemId\":\"109139\",\"itemCode\":\"W200066616\",\"itemName\":\"直流接触器(BMS09.08A2S0ECZVDA)\",\"bulky\":\"DJ\",\"weight\":\"0\",\"deQty\":\"2.0\",\"invQty\":\"2.0\",\"shortQty\":\"0\",\"pickedQty\":\"0.0\",\"frozenQty\":\"0\",\"status\":\"工作中\"},{\"detailId\":\"631493\",\"itemId\":\"109139\",\"itemCode\":\"W200066616\",\"itemName\":\"直流接触器(BMS09.08A2S0ECZVDA)\",\"bulky\":\"DJ\",\"weight\":\"0\",\"deQty\":\"1.0\",\"invQty\":\"8.0\",\"shortQty\":\"0\",\"pickedQty\":\"0.0\",\"frozenQty\":\"0\",\"status\":\"工作中\"},{\"detailId\":\"631494\",\"itemId\":\"109139\",\"itemCode\":\"W200066616\",\"itemName\":\"直流接触器(BMS09.08A2S0ECZVDA)\",\"bulky\":\"DJ\",\"weight\":\"0\",\"deQty\":\"3.0\",\"invQty\":\"8.0\",\"shortQty\":\"0\",\"pickedQty\":\"0.0\",\"frozenQty\":\"0\",\"status\":\"工作中\"},{\"detailId\":\"631519\",\"itemId\":\"419508\",\"itemCode\":\"W400000868\",\"itemName\":\"线绕电阻(RT40-35W-20R J)\",\"bulky\":\"DJ\",\"weight\":\"0\",\"deQty\":\"2.0\",\"invQty\":\"37.0\",\"shortQty\":\"0\",\"pickedQty\":\"0.0\",\"frozenQty\":\"0\",\"status\":\"工作中\"},{\"detailId\":\"631502\",\"itemId\":\"454213\",\"itemCode\":\"TE250C000000\",\"itemName\":\"NT1000C-S/SP3电流传感器\",\"bulky\":\"DJ\",\"weight\":\"0\",\"deQty\":\"2.0\",\"invQty\":\"39.0\",\"shortQty\":\"0\",\"pickedQty\":\"0.0\",\"frozenQty\":\"0\",\"status\":\"工作中\"},{\"detailId\":\"631506\",\"itemId\":\"454213\",\"itemCode\":\"TE250C000000\",\"itemName\":\"NT1000C-S/SP3电流传感器\",\"bulky\":\"DJ\",\"weight\":\"0\",\"deQty\":\"2.0\",\"invQty\":\"39.0\",\"shortQty\":\"0\",\"pickedQty\":\"0.0\",\"frozenQty\":\"0\",\"status\":\"工作中\"},{\"detailId\":\"631523\",\"itemId\":\"412957\",\"itemCode\":\"W400007220\",\"itemName\":\"线绕电阻器(RXQ-S-500W-B-600R J)\",\"bulky\":\"DJ\",\"weight\":\"0\",\"deQty\":\"4.0\",\"invQty\":\"6.0\",\"shortQty\":\"0\",\"pickedQty\":\"0.0\",\"frozenQty\":\"0\",\"status\":\"工作中\"},{\"detailId\":\"631531\",\"itemId\":\"419452\",\"itemCode\":\"W41011031500\",\"itemName\":\"线绕电阻(RX20-100W/1.5k±5%)\",\"bulky\":\"DJ\",\"weight\":\"0\",\"deQty\":\"4.0\",\"invQty\":\"61.0\",\"shortQty\":\"0\",\"pickedQty\":\"0.0\",\"frozenQty\":\"0\",\"status\":\"工作中\"},{\"detailId\":\"631538\",\"itemId\":\"419508\",\"itemCode\":\"W400000868\",\"itemName\":\"线绕电阻(RT40-35W-20R J)\",\"bulky\":\"DJ\",\"weight\":\"0\",\"deQty\":\"2.0\",\"invQty\":\"37.0\",\"shortQty\":\"0\",\"pickedQty\":\"0.0\",\"frozenQty\":\"0\",\"status\":\"工作中\"},{\"detailId\":\"631556\",\"itemId\":\"412957\",\"itemCode\":\"W400007220\",\"itemName\":\"线绕电阻器(RXQ-S-500W-B-600R J)\",\"bulky\":\"DJ\",\"weight\":\"0\",\"deQty\":\"2.0\",\"invQty\":\"6.0\",\"shortQty\":\"0\",\"pickedQty\":\"0.0\",\"frozenQty\":\"0\",\"status\":\"工作中\"},{\"detailId\":\"631557\",\"itemId\":\"412957\",\"itemCode\":\"W400007220\",\"itemName\":\"线绕电阻器(RXQ-S-500W-B-600R J)\",\"bulky\":\"DJ\",\"weight\":\"0\",\"deQty\":\"1.0\",\"invQty\":\"1.0\",\"shortQty\":\"0\",\"pickedQty\":\"0.0\",\"frozenQty\":\"0\",\"status\":\"工作中\"},{\"detailId\":\"631558\",\"itemId\":\"412957\",\"itemCode\":\"W400007220\",\"itemName\":\"线绕电阻器(RXQ-S-500W-B-600R J)\",\"bulky\":\"DJ\",\"weight\":\"0\",\"deQty\":\"1.0\",\"invQty\":\"38.0\",\"shortQty\":\"0\",\"pickedQty\":\"0.0\",\"frozenQty\":\"0\",\"status\":\"工作中\"},{\"detailId\":\"631560\",\"itemId\":\"419452\",\"itemCode\":\"W41011031500\",\"itemName\":\"线绕电阻(RX20-100W/1.5k±5%)\",\"bulky\":\"DJ\",\"weight\":\"0\",\"deQty\":\"4.0\",\"invQty\":\"61.0\",\"shortQty\":\"0\",\"pickedQty\":\"0.0\",\"frozenQty\":\"0\",\"status\":\"工作中\"}]}"}}
            // var res = {"@type":"java.util.HashMap","thornMessageKey":{"@type":"com.vtradex.thorn.client.ui.support.MessageKey","errorMessage":false,"message":"{\"alltaskQty\":\"2\",\"aisletaskQty\":\"2\",\"workingWaves\":[{\"waveId\":\"66\",\"locationCode\":\"ZT08-0101\",\"palletNo\":\"T1504\",\"waveCode\":\"CP001CGRK201015000002\",\"lineno\":\"1\",\"waveQty\":\"5.0\",\"invQty\":\"0\"},{\"waveId\":\"101\",\"locationCode\":\"ZT08-0101\",\"palletNo\":\"T2112\",\"waveCode\":\"CP001TW006201021000008\",\"lineno\":\"1\",\"waveQty\":\"5.0\",\"invQty\":\"0\"}],\"waveDetail\":[{\"detailId\":\"116\",\"itemId\":\"61\",\"itemCode\":\"TECOLA\",\"itemName\":\"可乐\",\"bulky\":\"DJ\",\"weight\":\"0\",\"deQty\":\"3.0\",\"invQty\":\"264.0\",\"shortQty\":\"0\",\"pickedQty\":\"2.0\",\"frozenQty\":\"0\",\"status\":\"工作中\"},{\"detailId\":\"117\",\"itemId\":\"61\",\"itemCode\":\"TECOLA\",\"itemName\":\"可乐\",\"bulky\":\"DJ\",\"weight\":\"0\",\"deQty\":\"5.0\",\"invQty\":\"0\",\"shortQty\":\"0\",\"pickedQty\":\"3.0\",\"frozenQty\":\"0\",\"status\":\"工作中\"}]}"}}
            if(!res.thornMessageKey.errorMessage){
                var data = JSON.parse(res.thornMessageKey.message);
                setTabWaveDetailData(data)
            }else{
                alert(res.thornMessageKey.message)
            }
    //     },
    //     error: function(err){
    //         alert('fail'+ err);
    //     }
    // })
}

function setTabWaveDetailData(data){
    selectionDetailWave = []
    waveDetailList = data.waveDetail || []

    // 详情table
    $("#waveDetailTable tbody").html('')
    if(waveDetailList.length > 0){
        $.each(waveDetailList, function(i, item) {
            $("#waveDetailTable tbody").append(""
                +"<tr>"
                    +"<td class='checkbox'><input class='check_item' type='checkbox' value='"+ item.detailId +"' id='"+ item.detailId +"' onclick='onclickWaveDetailCheckbox();'></td>"
                    +"<td>"+ item.itemCode +"</td>"
                    +"<td>"+ item.itemName +"</td>"
                    +"<td>"+ item.bulky +"</td>"
                    +"<td>"+ item.weight +"</td>"
                    +"<td>"+ item.deQty +"</td>"
                    +"<td>"+ item.pickedQty +"</td>"
                    +"<td>"+ item.shortQty +"</td>"
                    +"<td>"+ item.invQty +"</td>"
                    +"<td>"+ item.frozenQty +"</td>"
                    +"<td>"+ item.status +"</td>"
                    +"<td>"+ item.bnNum +"</td>"
                    +"<td></td>"
                +"</tr>"
            )
        })

        $("#waveDetailTable input.check_item").eq(0).prop("checked","checked"); // 默认选中第一条
        checkedChangeWaveDetailState()
    }else{
        $("#waveDetailTable tbody").append('<tr><td colspan="13" style="text-align: center">暂无数据</td></tr>')
    }

    // 行选择
    $("#waveDetailTable").off("click", "tr td:not(.checkbox)").on("click", "tr td:not(.checkbox)", function () {
        var id = $(this).parent('tr').find("input[type=checkbox]").attr('id')
        document.getElementById(id).click();

        var status = $(this).parent('tr').find('.check_item').attr('checked')
        if(status == 'checked'){
            $(this).parent('tr').siblings().find('.check_item').attr('checked', false)
        }
    });
}

// 详情table——选择所有
function seletedAllCheckboxWaveDetailState(state){
    $('#waveDetailTable .check_item').each(function () {
        this.checked = state;
    });
    
    checkedChangeWaveDetailState()
}

// 详情table——选择单个
function onclickWaveDetailCheckbox(){
    setTimeout(function(){
        checkedChangeWaveDetailState()
    }, 50)
}

// 详情table——选择控制按钮
function checkedChangeWaveDetailState(){
    selectionDetailWave = getCheckboxWaveDetailData()

    if(selectionDetailWave.length == 1){
        $('#confirm_pick').removeClass('disabled').off('click').on('click', function(){
            queryConfirmPick()
        })
        $('#confirm_all_pick').removeClass('disabled').off('click').on('click', function(){
            queryConfirmAllPick()
        })
        $('#lack_pick').removeClass('disabled').off('click').on('click', function(){
            queryLackPick()
        })
    }else{
        $('#confirm_pick').addClass('disabled').off('click')
        $('#confirm_all_pick').addClass('disabled').off('click')
        $('#lack_pick').addClass('disabled').off('click')
    }
}

// 详情table——获取选中数据的Data
function getCheckboxWaveDetailData(){
    var list = []

    $("#waveDetailTable .check_item:checkbox").each(function () {
        var that = $(this)
        if ($(this).attr("checked")) {
            for(var i=0; i<waveDetailList.length; i++){
                if(that.val() == waveDetailList[i].detailId){
                    list.push(waveDetailList[i])
                }
            }
        }
    });
    return list;
}

// 执行任务
function queryPickExecute(){
    var torrVal = ''
    var torrRadio = $("input[name='torr']")
    for(var i=0; i<torrRadio.length; i++){
        if(torrRadio[i].checked){
            torrVal = torrRadio[i].value
        }
    }

    // var params = {
    //     p0: serverPickName,
    //     p1: 'execute',
    //     p2: {
    //         forkliftId: $("#forklift_codes").val(),
    //         waveId: selectionWave[0].waveId,
    //         palletNo: selectionWave[0].palletNo,
    //         waveType: torrVal
    //     },
    //     servicename: 'customService'
    // }
    // params=JSON.stringify(params);
    
    // $.ajax({
    //     url: baseUrl,
    //     type: 'POST',
    //     dataType: 'json',
    //     contentType:"application/json;charset=utf-8",
    //     data: params,
    //     success: function(res){
            var res = {"@type":"java.util.HashMap","thornMessageKey":{"@type":"com.vtradex.thorn.client.ui.support.MessageKey","errorMessage":false,"message":"{\"alltaskQty\":\"1\",\"aisletaskQty\":\"1\",\"workingWaves\":[{\"waveId\":\"339\",\"locationCode\":\"ZT08-0000\",\"waveCode\":\"CP001TW006201103000002\",\"lineno\":\"1\",\"waveQty\":\"2.0\",\"invQty\":\"0\"}],\"waveDetail\":[{\"detailId\":\"376\",\"itemId\":\"101\",\"itemCode\":\"TEL001\",\"itemName\":\"X-地铁大柜体80*80\",\"bulky\":\"DJ\",\"weight\":\"0\",\"deQty\":\"2.0\",\"invQty\":\"0\",\"shortQty\":\"0\",\"pickedQty\":\"0.0\",\"frozenQty\":\"0\",\"status\":\"工作中\"}]}"}}
            if(!res.thornMessageKey.errorMessage){
                var data = JSON.parse(res.thornMessageKey.message);
                $('.current_task').text(data.mission)
                if(data.isTwo == 'true'){
                    alert('改单含有多个物料请注意！')
                }
                // setTabWaveData(data, true)
                toggleInfoDialog('操作成功')
            }else{
                alert(res.thornMessageKey.message)
            }
    //     },
    //     error: function(err){
    //         alert('fail'+ err);
    //     }
    // })
}

// 拣货完成
function queryPickFinish(){
    // var params = {
    //     p0: serverPickName,
    //     p1: 'putFinsh',
    //     p2: {
    //         forkliftId: $("#forklift_codes").val(),
    //         waveId: selectionWave[0].waveId,
    //         palletNo: selectionWave[0].palletNo
    //     },
    //     servicename: 'customService'
    // }
    // params=JSON.stringify(params);    
    // $.ajax({
    //     url: baseUrl,
    //     type: 'POST',
    //     dataType: 'json',
    //     contentType:"application/json;charset=utf-8",
    //     data: params,
    //     success: function(res){
            var res = {"@type":"java.util.HashMap","thornMessageKey":{"@type":"com.vtradex.thorn.client.ui.support.MessageKey","errorMessage":false,"message":"{\"alltaskQty\":\"1\",\"aisletaskQty\":\"1\",\"workingWaves\":[{\"waveId\":\"339\",\"locationCode\":\"ZT08-0000\",\"waveCode\":\"CP001TW006201103000002\",\"lineno\":\"1\",\"waveQty\":\"2.0\",\"invQty\":\"0\"}],\"waveDetail\":[{\"detailId\":\"376\",\"itemId\":\"101\",\"itemCode\":\"TEL001\",\"itemName\":\"X-地铁大柜体80*80\",\"bulky\":\"DJ\",\"weight\":\"0\",\"deQty\":\"2.0\",\"invQty\":\"0\",\"shortQty\":\"0\",\"pickedQty\":\"0.0\",\"frozenQty\":\"0\",\"status\":\"工作中\"}]}"}}
            if(!res.thornMessageKey.errorMessage){
                // var data = JSON.parse(res.thornMessageKey.message);
                // setTabWaveData(data, true)
                toggleInfoDialog('操作成功')
            }else{
                alert(res.thornMessageKey.message)
            }
    //     },
    //     error: function(err){
    //         alert('fail'+ err);
    //     }
    // })
}

// 任务回滚
function queryPickBack(){
    var params = {
        p0: serverPickName,
        p1: 'taskBack',
        p2: {
            forklift: $("#forklift_codes").val()
        },
        servicename: 'customService'
    }
    params=JSON.stringify(params);
    
    $.ajax({
        url: baseUrl,
        type: 'POST',
        dataType: 'json',
        contentType:"application/json;charset=utf-8",
        data: params,
        success: function(res){
            if(!res.thornMessageKey.errorMessage){
                var data = JSON.parse(res.thornMessageKey.message);
                alert('操作成功')
            }else{
                alert(res.thornMessageKey.message)
            }
        },
        error: function(err){
            alert('fail'+ err);
        }
    })
}

// 任务关闭
function queryPickClose(){
    var params = {
        p0: serverPickName,
        p1: 'taskClose',
        p2: {
            forklift: $("#forklift_codes").val()
        },
        servicename: 'customService'
    }
    params=JSON.stringify(params);
    
    $.ajax({
        url: baseUrl,
        type: 'POST',
        dataType: 'json',
        contentType:"application/json;charset=utf-8",
        data: params,
        success: function(res){
            if(!res.thornMessageKey.errorMessage){
                var data = JSON.parse(res.thornMessageKey.message);
                alert('操作成功')
            }else{
                alert(res.thornMessageKey.message)
            }
        },
        error: function(err){
            alert('fail'+ err);
        }
    })
}

// 打印
function queryPickPrint(){
    var params = {
        p0: serverPickName,
        p1: 'printVna',
        p2: {},
        servicename: 'customService'
    }
    params=JSON.stringify(params);
    
    $.ajax({
        url: baseUrl,
        type: 'POST',
        dataType: 'json',
        contentType:"application/json;charset=utf-8",
        data: params,
        success: function(res){
            if(!res.thornMessageKey.errorMessage){
                var data = JSON.parse(res.thornMessageKey.message);
                toggleInfoDialog(data.note)
            }else{
                alert(res.thornMessageKey.message)
            }
        },
        error: function(err){
            alert('fail'+ err);
        }
    })
}

// 确定
function queryConfirmPick(){
    var params = {
        p0: serverPickName,
        p1: 'singleConfirm',
        p2: {
            detailId: selectionDetailWave[0].detailId,
            barCode: $(".detail_bar_code").val(),
            pickedQty: $(".detail_pick_qty").val()
        },
        servicename: 'customService'
    }
    params=JSON.stringify(params);
    
    $.ajax({
        url: baseUrl,
        type: 'POST',
        dataType: 'json',
        contentType:"application/json;charset=utf-8",
        data: params,
        success: function(res){
            if(!res.thornMessageKey.errorMessage){
                // var data = JSON.parse(res.thornMessageKey.message);
                // setTabWaveData(data, false)
                toggleInfoDialog('操作成功')
            }else{
                alert(res.thornMessageKey.message)
            }
        },
        error: function(err){
            alert('fail'+ err);
        }
    })
}

// 整单确定
function queryConfirmAllPick(){
    var params = {
        p0: serverPickName,
        p1: 'confirmPickTicket',
        p2: {
            forklift: $("#forklift_codes").val(),
            orderId: selectionWave[0].waveId,
            detailId: selectionDetailWave[0].detailId
        },
        servicename: 'customService'
    }
    params=JSON.stringify(params);
    
    $.ajax({
        url: baseUrl,
        type: 'POST',
        dataType: 'json',
        contentType:"application/json;charset=utf-8",
        data: params,
        success: function(res){
            if(!res.thornMessageKey.errorMessage){
                // var data = JSON.parse(res.thornMessageKey.message);
                // setTabWaveData(data, false)
                toggleInfoDialog('操作成功')
                queryPickData()
            }else{
                alert(res.thornMessageKey.message)
            }
        },
        error: function(err){
            alert('fail'+ err);
        }
    })
}

// 缺拣
function queryLackPick(){
    var params = {
        p0: serverPickName,
        p1: 'shortPickTask',
        p2: {
            detailId: selectionDetailWave[0].detailId,
            barCode: $(".detail_bar_code").val(),
            pickedQty: $(".detail_pick_qty").val()
        },
        servicename: 'customService'
    }
    params=JSON.stringify(params);
    
    $.ajax({
        url: baseUrl,
        type: 'POST',
        dataType: 'json',
        contentType:"application/json;charset=utf-8",
        data: params,
        success: function(res){
            if(!res.thornMessageKey.errorMessage){
                // var data = JSON.parse(res.thornMessageKey.message);
                // setTabWaveData(data, false)
                toggleInfoDialog('操作成功')
            }else{
                alert(res.thornMessageKey.message)
            }
        },
        error: function(err){
            alert('fail'+ err);
        }
    })
}

// 刷新
function refreshPickPage(){
    waveList = []
    selectionWave = []
    waveDetailList = []
    selectionDetailWave = []

    $('#aisle_code_pick').val('')
    $('.task_num').text('')
    $('.tunnel_num').text('')
    $('.pick_current_task').text('')
    $("#waveTable tbody").html('<tr><td colspan="8" style="text-align: center">暂无数据</td></tr>')
    $("#waveDetailTable tbody").html('<tr><td colspan="13" style="text-align: center">暂无数据</td></tr>')
}

