document.write("<script src='./static/js/upload/spark-md5.js'></script>");
var accessid = '';
var accesskey = '';
var host = '';
var policyBase64 = '';
var signature = '';
var callbackbody = '';
var filename = '';
var key = '';
var expire = 0;
var g_object_name = '';
var g_object_name_type = '';
var now = timestamp = Date.parse(new Date()) / 1000;

function send_request()
{
    var xmlhttp = null;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  
    if (xmlhttp!=null)
    {
        // serverUrl是 用户获取 '签名和Policy' 等信息的应用服务器的URL，请将下面的IP和Port配置为您自己的真实信息。
        serverUrl = basePath +'/aliyunOss/doSign'
		
        xmlhttp.open( "GET", serverUrl, false );
        xmlhttp.send( null );
        return xmlhttp.responseText
    }
    else
    {
        alert("Your browser does not support XMLHTTP.");
    }
};

function get_signature()
{
    // 可以判断当前expire是否超过了当前时间， 如果超过了当前时间， 就重新取一下，3s 作为缓冲。
    now = timestamp = Date.parse(new Date()) / 1000; 
    if (expire < now + 3)
    {
        var body = send_request();
        var obj = eval ("(" + body + ")");
        host = obj['host'];
        policyBase64 = obj['policy'];
        accessid = obj['accessid'];
        signature = obj['signature'];
        expire = parseInt(obj['expire']);
        key = obj['dir']
        return true;
    }
    return false;
};


function get_suffix(filename) {
    pos = filename.lastIndexOf('.')
    suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}


function get_uploaded_object_name(filename)
{
        tmp_name = g_object_name
        tmp_name = tmp_name.replace("${filename}", filename);
        console.log(host+tmp_name);
        return host + tmp_name

}



//处理单片文件的上传
function loadFile(file, currentChunk) {
    var blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;
    var chunkSize = 2097152;
    // var currentChunk = 0;
    var spark = new SparkMD5()
    currentChunk  = currentChunk ? currentChunk : 0;
    var chunks = 1;
    chunks = Math.ceil(file.size / chunkSize);
    var start = currentChunk * chunkSize;
    var end = start + chunkSize >= file.size ? file.size : start + chunkSize;
    var fileReader = new FileReader();
    fileReader.readAsBinaryString(blobSlice.call(file.getNative(), start, end));
    fileReader.onload = function(e) {
        //每块交由sparkMD5进行计算
            spark.appendBinary(e.target.result);
            //如果文件处理完成计算MD5，如果还有分片继续处理
            currentChunk++;
            if (currentChunk < chunks) {
                console.log("onload.load");
                loadFile(currentChunk, file);
            } else {
                console.log("onload.end");
                file.newName = spark.end();
            }
    };

}

function set_upload_param(up, filename, ret, newName)
{
    if (ret == false)
    {
        ret = get_signature()
    }
    g_object_name = key;

    if (filename != '') {
        suffix = get_suffix(filename)
        // g_object_name = calculate_object_name(filename, newName);
        g_object_name = key + newName + suffix
    }

        new_multipart_params = {
            'key' : g_object_name,
            'policy': policyBase64,
            'OSSAccessKeyId': accessid,
            'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
            'callback' : callbackbody,
            'signature': signature,
        };
        up.setOption({
            'url': host,
            'multipart_params': new_multipart_params
        });
        up.start();
}


/**
 *
 * @param browseBtn 选择文件按钮
 * @param uploadBtn 上传按钮
 * @param inputBtn 文件值存放input
 * @param perBar 进度条
 * @param doMethod 上传完成后执行的js方法
 */
function bindUpload(contentForm, browseBtn, uploadBtn, perBar, doMethod) {

    var uploader = new plupload.Uploader({
        runtimes : 'html5,flash,silverlight,html4',
        browse_button : browseBtn,
        //multi_selection: false,
        container: document.getElementById(contentForm),
        flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
        silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',
        url : 'http://oss.aliyuncs.com',
        unique_names: false ,
        save_key: false,
        filters: {
            mime_types : [ //只允许上传图片和zip文件
                { title : "Image files", extensions : "jpg,png,bmp,jpeg" },
                { title : "music files", extensions : "mp3" }
            ],
            max_file_size : '3mb', //最大只能上传3mb的文件
            prevent_duplicates : true //不允许选取重复文件
        },

        init: {
            PostInit: function() {
                document.getElementById(uploadBtn).onclick = function() {
                    set_upload_param(uploader, '', false);
                    return false;
                };
            },
            FilesAdded: function(up, files) {
                plupload.each(files, function(file) {
                    loadFile(file);
                    //确保文件是图片
                    if (file && /image\//.test(file.type)) {
                        if (file.type != 'image/gif') {
                            var preloader = new mOxie.Image();
                            preloader.onload = function () {
                                preloader.downsize(180, 120);//先压缩一下要预览的图片
                                var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL();
                                // $("#"+perBar+" .preImg").html('预览：<span><img src=""></span>');
                                // $("#"+perBar+" .preImg img").attr('src', imgsrc);
                                // $("#"+perBar+" .preImg").show();
                                $("#"+ perBar).append('<span class="customImg"><img style="max-height:200px;max-width:200px;" src="'+imgsrc+'"><input id="pre_'+file.id+'" type="hidden" value=""></span>');
                                preloader.destroy();
                                preloader = null;
                            }
                            preloader.load(file.getSource());
                        } else {
                            var fr = new mOxie.FileReader();
                            fr.onload = function () {
                                file.imgsrc = fr.result;
                                // $("#"+perBar+" .preImg").html('预览：<span><img src=""><div id="progress" style="background-color: rgba(87, 243, 87, 0.18);position:absolute;top:0;left:0;z-index:10000;width:0%;height:100%; "></div></span> ');
                                // $("#" +perBar + " .preImg img").attr('src', imgsrc);
                                // $("#"+perBar+" .preImg").show();
                                $("#"+ perBar).append('<span><img class="customImg" style="max-height:200px;max-width:200px;" src="'+imgsrc+'"><input id="pre_'+file.id+'" type="hidden" value=""></span>');
                                fr.destroy();
                                fr = null;
                            }
                            fr.readAsDataURL(file.getSource());
                        }
                    } else  if (file && /mp3/.test(file.type)) {
                        document.getElementsByClassName("preVideo")[0].innerHTML = '已选择文件:' + file.name;
                    }

                });
            },

            BeforeUpload: function(up, file) {
                $("#background,#progressBarer").show();
                set_upload_param(up, file.name, true, file.newName);
                console.log("BeforeUpload---------");
                console.log(g_object_name);
            },

            UploadProgress: function(up, file) {
                console.log("--------------" + file.percent);
                console.log( get_uploaded_object_name(file.name));
                // if (file && /image\//.test(file.type)) {
                //     document.getElementById("progress").style.width = file.percent + "%";
                // }

                // var d = document.getElementById(file.id);
                // d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                // var prog = d.getElementsByTagName('div')[0];
                // var progBar = prog.getElementsByTagName('div')[0]
                // progBar.style.width= 2*file.percent+'px';
                // progBar.setAttribute('aria-valuenow', file.percent);
            },

            FileUploaded: function(up, file, info) {
                if (info.status == 200)
                {
                    document.getElementById("pre_" + file.id).value = get_uploaded_object_name(file.name);
                    // document.getElementById(inputBtn).value= get_uploaded_object_name(file.name);
                   // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '文件上传成功:' + get_uploaded_object_name(file.name);

                }
                else if (info.status == 203)
                {
                    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response;
                }
                else
                {
                    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                }
            },

            Error: function(up, err) {
                if (err.code == -600) {
                    alert("选择的文件太大了");
                }
                else if (err.code == -601) {
                    alert("选择的文件类型不正确");
                }
                else if (err.code == -602) {
                    alert("这个文件已经上传过一遍了");
                }
                else
                {
                    alert("err.response");
                }
            },
            UploadComplete: function (up) {
                doMethod();
            }
        }
    });
    uploader.init();
}

// 修改头像
function bindUploadForVice(contentForm, browseBtn, uploadBtn, inputBtn, perBar, doMethod) {
    var uploader = new plupload.Uploader({
        runtimes : 'html5,flash,silverlight,html4',
        browse_button : browseBtn,
        //multi_selection: false,
        container: document.getElementById(contentForm),
        flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
        silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',
        url : 'http://oss.aliyuncs.com',
        unique_names: false ,
        save_key: false,
        filters: {
            mime_types : [ //只允许上传图片
                { title : "Image files", extensions : "jpg,png,bmp,jpeg" }
            ],
            max_file_size : '3mb', //最大只能上传3mb的文件
            prevent_duplicates : true //不允许选取重复文件
        },

        init: {
            PostInit: function() {
                // document.getElementById(perBar).innerHTML = '';
                document.getElementById(uploadBtn).onclick = function() {
                    set_upload_param(uploader, '', false);
                    return false;
                };
            },
            FilesAdded: function(up, files) {
                plupload.each(files, function(file) {
                    loadFile(file);
                    //确保文件是图片
                    if (file && /image\//.test(file.type)) {
                        if (file.type != 'image/gif') {
                            var preloader = new mOxie.Image();
                            preloader.onload = function () {
                                preloader.downsize(180, 120);//先压缩一下要预览的图片
                                var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL();
                                $("#"+perBar+" .preImg img").attr('src', imgsrc);
                                $("#"+perBar+" .preImg").show();
                                $('.newimg-p').show();
                                preloader.destroy();
                                preloader = null;
                            }
                            preloader.load(file.getSource());
                        } else {
                            var fr = new mOxie.FileReader();
                            fr.onload = function () {
                                file.imgsrc = fr.result;
                                $("#"+perBar+" .preImg").html('预览：<span><img src=""><div id="progress" style="background-color: rgba(87, 243, 87, 0.18);position:absolute;top:0;left:0;z-index:10000;width:0%;height:100%; "></div></span> ');
                                $("#" +perBar + " .preImg img").attr('src', imgsrc);
                                $("#"+perBar+" .preImg").show();
                                fr.destroy();
                                fr = null;
                            }
                            fr.readAsDataURL(file.getSource());
                        }
                    }
                });
            },

            BeforeUpload: function(up, file) {
                $("#background,#progressBarer").show();
                set_upload_param(up, file.name, true, file.newName);
                console.log("BeforeUpload---------");
                console.log(g_object_name);
            },

            UploadProgress: function(up, file) {
                console.log("--------------" + file.percent);
                console.log( get_uploaded_object_name(file.name));
                // if (file && /image\//.test(file.type)) {
                //     document.getElementById("progress").style.width = file.percent + "%";
                // }

                // var d = document.getElementById(file.id);
                // d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                // var prog = d.getElementsByTagName('div')[0];
                // var progBar = prog.getElementsByTagName('div')[0]
                // progBar.style.width= 2*file.percent+'px';
                // progBar.setAttribute('aria-valuenow', file.percent);
            },

            FileUploaded: function(up, file, info) {
                if (info.status == 200)
                {
                    // document.getElementById(inputBtn).value= get_uploaded_object_name(file.name);
                }
                else if (info.status == 203)
                {
                    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response;
                }
                else
                {
                    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                }
            },

            Error: function(up, err) {
                if (err.code == -600) {
                    alert("选择的文件太大了");
                }
                else if (err.code == -601) {
                    alert("选择的文件类型不正确");
                }
                else if (err.code == -602) {
                    alert("这个文件已经上传过一遍了");
                }
                else
                {
                    alert("err.response");
                }
            },
            UploadComplete: function (up) {
                doMethod();
            }
        }
    });

    uploader.init();
}


