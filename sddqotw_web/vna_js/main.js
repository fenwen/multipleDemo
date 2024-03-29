
// 加载数据
function loadData(){
    var params = {
        p0: serverName,
        p1: 'loadData',
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
                    refreshCheckPage()

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
                                $("#aisle_code_check").html(aHtml);
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

                $("#aisle_code_check").change(function(){
                    var aisleId = $("#aisle_code_check").val()

                    $('#confirm_check').addClass('disabled').off('click')

                    // 巷道
                    if(aisleId){
                        $('#query_check_btn').removeClass('disabled').off('click').on('click', function(){
                            queryCheckData()
                        })
                    }else{
                        $('#query_check_btn').addClass('disabled').off('click')
                    }
                });
            }else{
                alert(res.thornMessageKey.message)
            }
        },
        error: function(err){
            alert('fail'+ err);
        }
    })
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

    if(!$("#forklift_codes").val() || !$("#aisle_code_put").val()){
        return;
    }

    var params = {
        p0: serverName,
        p1: 'inquire',
        p2: {
            aisle: $("#aisle_code_put").val(),
            direction: directVal,
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
                setTabOneData(data)
            }else{
                alert(res.thornMessageKey.message)
            }
        },
        error: function(err){
            alert('fail'+ err);
        }
    })
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
    }, 20)
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

    var params = {
        p0: serverName,
        p1: 'changeLocation',
        p2: {
            orderId: selection[0].orderId,
            aisle: $("#aisle_code_put").val(),
            direction: directVal,
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
                $('.recommend_location').text(data.locationCode)
                $('.current_task').text(data.mission)
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

// 任务回滚
function queryBackBtn(){
    var params = {
        p0: serverName,
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
    var params = {
        p0: serverName,
        p1: 'execute',
        p2: {
            orderId: selection[0].orderId,
            materialCode: selection[0].materialCode,
            locationCode: $('.recommend_location').text(),
            palletNo: $('.box_num').text(),
            forkliftId: $("#forklift_codes").val()
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
                $('.current_task').text(data.mission)
                // setTabOneData(data)
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

//任务完成
function queryPutFinish(){
    var params = {
        p0: serverName,
        p1: 'putFinsh',
        p2: {
            orderId: selection[0].orderId,
            locationCode: $('.recommend_location').text(),
            palletNo: $('.box_num').text(),
            forkliftId: $("#forklift_codes").val()
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
                // setTabOneData(data)
                toggleInfoDialog('操作成功')
                queryData()
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
    var conditionCheckH = $('.head_row_2').height() + $('.tab_head').height() + $('.check_detail_form').height()
    
    $('.material_tab_content').height(winH*0.6 - conditionH/2 - 32)
    $('.bottom_tab_content').height(winH*0.4 - conditionH/2 - 32)
    $('.bottom_tab').height(winH*0.4 - conditionH/2 - 62)

    $('.wave_tab_content').height(winH*0.5 - conditionPickH/2 - 36)
    $('.wave_detail_tab_content').height(winH*0.5 - conditionPickH/2 - 36)

    $('.check_detail_tab_content').height(winH - conditionCheckH - 60)
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
    
    $.ajax({
        url: baseUrl,
        type: 'POST',
        dataType: 'json',
        contentType:"application/json;charset=utf-8",
        data: params,
        success: function(res){
            if(!res.thornMessageKey.errorMessage){
                var data = JSON.parse(res.thornMessageKey.message);
                
                setTabWaveData(data, false)
            }else{
                alert(res.thornMessageKey.message)
            }
        },
        error: function(err){
            alert('fail'+ err);
        }
    })
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

        // $("#waveTable input.check_item").eq(0).prop("checked","checked"); // 默认选中第一条
        // checkedChangeWaveState()
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
    }, 20)
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

    var params = {
        p0: serverPickName,
        p1: 'querydate',
        p2: {
            forkliftId: $("#forklift_codes").val(),
            waveId: selectionWave[0].waveId,
            palletNo: selectionWave[0].palletNo,
            waveType: torrVal
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
                setTabWaveDetailData(data)
            }else{
                alert(res.thornMessageKey.message)
            }
        },
        error: function(err){
            alert('fail'+ err);
        }
    })
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
    }, 20)
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

    var params = {
        p0: serverPickName,
        p1: 'execute',
        p2: {
            forkliftId: $("#forklift_codes").val(),
            waveId: selectionWave[0].waveId,
            palletNo: selectionWave[0].palletNo,
            locationCode: selectionWave[0].locationCode,
            waveType: torrVal
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
                $('.current_task').text(data.mission)
                if(data.isTwo == 'true'){
                    alert('改单含有多个物料请注意！')
                }
                // setTabWaveData(data, true)
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

// 拣货完成
function queryPickFinish(){
    var torrVal = ''
    var torrRadio = $("input[name='torr']")
    for(var i=0; i<torrRadio.length; i++){
        if(torrRadio[i].checked){
            torrVal = torrRadio[i].value
        }
    }

    var params = {
        p0: serverPickName,
        p1: 'putFinsh',
        p2: {
            forkliftId: $("#forklift_codes").val(),
            waveId: selectionWave[0].waveId,
            palletNo: selectionWave[0].palletNo,
            locationCode: selectionWave[0].locationCode,
            waveType: torrVal
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
                // setTabWaveData(data, true)
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
            locationCode: selectionWave[0].locationCode,
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

// -----------------------盘点-----------------------------
// 查询
function queryCheckData(){
    $('#confirm_check').addClass('disabled').off('click')
    if(!$("#forklift_codes").val() || !$("#aisle_code_check").val()) return;

    var params = {
        p0: serverCheckName,
        p1: 'inquire',
        p2: {
            forklift: $("#forklift_codes").val(),
            aisle: $("#aisle_code_check").val(),
            loccode: $(".check_s_ware").val(), // 库位
            tpcode: $(".check_s_tuo").val(), //托盘
            itemcode: $(".check_s_good").val() //货品
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
                
                setTabCheckDetailData(data)
            }else{
                alert(res.thornMessageKey.message)
            }
        },
        error: function(err){
            alert('fail'+ err);
        }
    })
}

function setTabCheckDetailData(data){
    selectDetailCheck = []
    checkDetailList = data.pdDetails || []

    $("#checkDetailTable tbody").html('')
    if(checkDetailList.length > 0){
        $.each(checkDetailList, function(i, item) {
            $("#checkDetailTable tbody").append(""
                +"<tr>"
                    +"<td class='checkbox'><input class='check_item' type='checkbox' value='"+ item.invid +"' id='"+ item.invid +"' onclick='onclickCheckDetailCheckbox();'></td>"
                    +"<td>"+ item.materialCode +"</td>"
                    +"<td>"+ item.materialName +"</td>"
                    +"<td>"+ item.palletNo +"</td>"
                    +"<td>"+ item.loccode +"</td>"
                    +"<td>"+ item.invqty +"</td>"
                    +"<td>"+ (item.type ? item.type : '') +"</td>"
                    +"<td>"+ (item.bncode ? item.bncode : '') +"</td>"
                    +"<td>"+ (item.pdtime ? item.pdtime : '') +"</td>"
                +"</tr>"
            )
        })

        $("#checkDetailTable input.check_item").eq(0).prop("checked","checked"); // 默认选中第一条
        checkedChangeCheckDetailState()
    }else{
        $("#checkDetailTable tbody").append('<tr><td colspan="9" style="text-align: center">暂无数据</td></tr>')
    }
    
    // 行选择
    $("#checkDetailTable").off("click", "tr td:not(.checkbox)").on("click", "tr td:not(.checkbox)", function () {
        var id = $(this).parent('tr').find("input[type=checkbox]").attr('id')
        document.getElementById(id).click();

        var status = $(this).parent('tr').find('.check_item').attr('checked')
        if(status == 'checked'){
            $(this).parent('tr').siblings().find('.check_item').attr('checked', false)
        }
    });
}

// check table——选择所有
function seletedAllCheckboxCheckDetailState(state){
    $('#checkDetailTable .check_item').each(function () {
        this.checked = state;
    });
    
    checkedChangeCheckDetailState()
}

// check table——选择单个
function onclickCheckDetailCheckbox(){
    setTimeout(function(){
        checkedChangeCheckDetailState()
    }, 20)
}

// check table——选择控制按钮
function checkedChangeCheckDetailState(){
    selectDetailCheck = getCheckboxCheckData()

    if(selectDetailCheck.length == 1){
        $('#confirm_check').removeClass('disabled').off('click').on('click', function(){
            checkConfirm()
        })
    }else{
        $('#confirm_check').addClass('disabled').off('click')
    }
}

// check table——获取选中数据的Data
function getCheckboxCheckData(){
    var list = []

    $("#checkDetailTable .check_item:checkbox").each(function () {
        var that = $(this)
        if ($(this).attr("checked")) {
            for(var i=0; i<checkDetailList.length; i++){
                if(that.val() == checkDetailList[i].invid){
                    list.push(checkDetailList[i])
                }
            }
        }
    });
    return list;
}

// 盘点确定
function checkConfirm(){
    if($(".detail_ck_qty").val()){
        var confirmDirect = confirm("盘点实际数量为："+ $(".detail_ck_qty").val() +"，是否确认？") 
        if (confirmDirect !="0") {
            checkConfirmSave()
        }
    }else{
        checkConfirmSave()
    }
}

function checkConfirmSave(){
    var params = {
        p0: serverCheckName,
        p1: 'confirmPickCount',
        p2: {
            forklift: $("#forklift_codes").val(),
            aisle: $("#aisle_code_check").val(),
            loccode: $(".check_s_ware").val(), // 库位
            tpcode: $(".check_s_tuo").val(), //托盘
            invid: selectDetailCheck[0].invid,
            countqty: $(".detail_ck_qty").val(), //盘点数量
            tmcode: $(".detail_ck_bar_code").val() //条码
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
                toggleInfoDialog('操作成功')

                checkDetailList = []
                selectDetailCheck = []
                $("#checkDetailTable tbody").html('<tr><td colspan="9" style="text-align: center">暂无数据</td></tr>')

                // 输入框清空，库位聚焦
                $('.check_s_ware').val('').focus()
                $('.check_s_tuo').val('')
                $('.check_s_good').val('')
                $('.detail_ck_bar_code').val('')
                $('.detail_ck_qty').val('')

                queryCheckData()
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
function refreshCheckPage(){
    checkDetailList = []
    selectDetailCheck = []

    $('#aisle_code_check').val('')
    $('.check_s_ware').val('')
    $('.check_s_tuo').val('')
    $('.check_s_good').val('')
    $('.detail_ck_bar_code').val('')
    $('.detail_ck_qty').val('')
    $("#checkDetailTable tbody").html('<tr><td colspan="9" style="text-align: center">暂无数据</td></tr>')
}
