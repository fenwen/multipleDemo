// QQ琛ㄦ儏鎻掍欢
(function ($) {
  $.fn.qqFace = function (option) {
      var settings = $.extend({
              id: "face-" + new Date().valueOf(),
              assign: 'textbox',
              appendbox: '.bottom-bar',
              path: '/images/newface'
          },
          option);

      return this.each(function () {
          var tab_id_1 = "tab-" + new Date().valueOf(),
              tab_id_2 = "tab-" + new Date().valueOf() + 1;
          var assign = $('#' + settings.assign);
          var id = settings.id;

          function insertHtmlAtCaret(html) {
              var sel, range;
              if (window.getSelection) {
                  // IE9 and non-IE
                  sel = window.getSelection();
                  if (sel.getRangeAt && sel.rangeCount) {
                      range = sel.getRangeAt(0);
                      range.deleteContents();

                      var el = document.createElement("div");
                      el.innerHTML = html;
                      var frag = document.createDocumentFragment(), node, lastNode;
                      while ((node = el.firstChild)) {
                          lastNode = frag.appendChild(node);
                      }
                      range.insertNode(frag);

                      // Preserve the selection
                      if (lastNode) {
                          range = range.cloneRange();
                          range.setStartAfter(lastNode);
                          range.collapse(true);
                          sel.removeAllRanges();
                          sel.addRange(range);
                      }
                  }
              } else if (document.selection && document.selection.type != "Control") {
                  // IE < 9
                  document.selection.createRange().pasteHTML(html);
              }
          }

          var str = '',
              QQFaceList = ["寰瑧", "鎾囧槾", "鑹�", "鍙戝憜", "寰楁剰", "娴佹唱", "瀹崇緸", "闂槾", "鐫�", "澶у摥", "灏村艾", "鍙戞€�", "璋冪毊", "鍛茬墮", "鎯婅", "闅捐繃", "閰�", "鍐锋睏", "鎶撶媯", "鍚�", "鍋风瑧", "鎰夊揩", "鐧界溂", "鍌叉參", "楗ラタ", "鍥�", "鎯婃亹", "娴佹睏", "鎲ㄧ瑧", "鎮犻棽", "濂嬫枟", "鍜掗獋", "鐤戦棶", "鍢�", "鏅�", "鐤簡", "琛�", "楠烽珔", "鏁叉墦", "鍐嶈", "鎿︽睏", "鎶犻蓟", "榧撴帉", "绯楀ぇ浜�", "鍧忕瑧", "宸﹀摷鍝�", "鍙冲摷鍝�", "鍝堟瑺", "閯欒", "濮斿眻", "蹇摥浜�", "闃撮櫓", "浜蹭翰", "鍚�", "鍙€�", "鑿滃垁", "瑗跨摐", "鍟ら厭", "绡悆", "涔掍箵", "鍜栧暋", "楗�", "鐚ご", "鐜懓", "鍑嬭阿", "鍢村攪", "鐖卞績", "蹇冪", "铔嬬硶", "闂數", "鐐稿脊", "鍒€", "瓒崇悆", "鐡㈣櫕", "渚夸究", "鏈堜寒", "澶槼", "绀肩墿", "鎷ユ姳", "寮�", "寮�", "鎻℃墜", "鑳滃埄", "鎶辨嫵", "鍕惧紩", "鎷冲ご", "宸姴", "鐖变綘", "NO", "OK", "鐖辨儏", "椋炲惢", "璺宠烦", "鍙戞姈", "鎬勭伀", "杞湀", "纾曞ご", "鍥炲ご", "璺崇怀", "鎶曢檷", "婵€鍔�", "涔辫垶", "鐚惢", "宸﹀お鏋�", "鍙冲お鏋�", "鍢垮搱", "鎹傝劯", "濂哥瑧", "鏈烘櫤", "鐨辩湁", "鑰�", "绾㈠寘", "楦�"];
          //EmojiList= ["绗戣劯", "鐢熺梾", "鐮存稌涓虹瑧", "鍚愯垖", "鑴哥孩", "鎭愭儳", "澶辨湜", "鏃犺", "楝奸瓊", "鍚堝崄", "寮哄．", "搴嗙", "绀肩墿", "寮€蹇�", "澶х瑧", "鐑儏", "鐪ㄧ溂", "鑹�", "鎺ュ惢", "浜插惢", "闇查娇绗�", "婊℃剰", "鎴忓紕", "寰楁剰", "姹�", "浣庤惤", "鍛�", "鐒﹁檻", "鎷呭績", "闇囨儕", "鎮旀仺", "鐪兼唱", "鍝�", "鏅�", "蹇冪儲", "鐢熸皵", "鐫¤", "鎭堕瓟", "澶栨槦浜�", "蹇�", "蹇冪", "涓樻瘮鐗�", "闂儊", "鏄熸槦", "鍙瑰彿", "闂彿", "鐫＄潃", "姘存淮", "闊充箰", "鐏�", "渚夸究", "寮�", "鎷冲ご", "鑳滃埄", "涓�", "涓�", "鍙�", "宸�", "绗竴", "鍚�", "鐑亱", "鐢峰", "濂冲", "濂冲＋", "鐢峰＋", "澶╀娇", "楠烽珔", "绾㈠攪", "澶槼", "涓嬮洦", "澶氫簯", "闆汉", "鏈堜寒", "闂數", "娴锋氮", "鐚�", "灏忕嫍", "鑰侀紶", "浠撻紶", "鍏斿瓙", "鐙�", "闈掕洐", "鑰佽檸", "鑰冩媺", "鐔�", "鐚�", "鐗�", "閲庣尓", "鐚村瓙", "椹�", "铔�", "楦藉瓙", "楦�", "浼侀箙", "姣涜櫕", "绔犻奔", "楸�", "椴搁奔", "娴疯睔", "鐜懓", "鑺�", "妫曟鏍�", "浠欎汉鎺�", "绀肩洅", "鍗楃摐鐏�", "鍦ｈ癁鑰佷汉", "鍦ｈ癁鏍�", "绀肩墿", "閾�", "姘旂悆", "CD", "鐩告満", "褰曞儚鏈�", "鐢佃剳", "鐢佃", "鐢佃瘽", "瑙ｉ攣", "閿�", "閽ュ寵", "鎴愪氦", "鐏场", "閭", "娴寸几", "閽�", "鐐稿脊", "鎵嬫灙", "鑽父", "姗勬鐞�", "绡悆", "瓒崇悆", "妫掔悆", "楂樺皵澶�", "濂栨澂", "鍏ヤ镜鑰�", "鍞辨瓕", "鍚変粬", "姣斿熀灏�", "鐨囧啝", "闆ㄤ紴", "鎵嬫彁鍖�", "鍙ｇ孩", "鎴掓寚", "閽荤煶", "鍜栧暋", "鍟ら厭", "骞叉澂", "楦″熬閰�", "姹夊牎", "钖潯", "鎰忛潰", "瀵垮徃", "闈㈡潯", "鐓庤泲", "鍐版縺鍑�", "铔嬬硶", "鑻规灉", "椋炴満", "鐏", "鑷杞�", "楂橀搧", "璀﹀憡", "鏃�", "鐢蜂汉", "濂充汉", "O", "X", "鐗堟潈", "娉ㄥ唽鍟嗘爣", "鍟嗘爣"];

          if ($('#' + id).length <= 0) {
              str += '<div class="expression" id="' + id + '" style="display:none;border:#ccc 1px solid;position:absolute;z-index:99999;bottom:144px;background: white;">';
              str += '<div class="scroll-wrapper">';
              str += '<table class="face-tb">';
              str += '</tr>';
              for (var i = 0; i < QQFaceList.length; i++) {
                  str += '<td><a href="javascript:void(0)" style="margin-left:5px;" title="' + QQFaceList[i] + '"><img src="' + settings.path + '/qqface/' + QQFaceList[i] + '.png"  class=\"imgFace\" data-name="' + QQFaceList[i] + '"/></a></td>';
                  if ((i + 1) % 12 == 0) {
                      str += '</tr><tr>'
                  };
              }
              str += '</tr>';
              str += '</table>';
              str += '</div>';

          }
          // $(option.appendbox).append(str);
          $(this).parent().append(str);

          $(this).click(function (e) {
              assign.focus();
              $('#' + id).toggle();
              e.stopPropagation();
          });

          /* $(document).on("blur",'#'+option.assign,function (e) {
               assign.focus();
           });*/

          $("#" + id + " table a").click(function (e) {
              assign.focus();
              insertHtmlAtCaret($(this).html());
              e.stopPropagation();
              $('#' + id).hide();
          });

          function isIE() {
              if (!!window.ActiveXObject || "ActiveXObject" in window) {
                  return true;
              } else {
                  return false;
              }
          }
          if (isIE()) {
              function CheckHTML(Str) {
                  var S = Str;
                  S = S.replace(/<p(.*?>)/gi, "")
                  S = S.replace(/<\/p>/gi, "")
                  return S
              }

              $(document).on("mouseleave", '#' + option.assign, function (e) {
                  assign.html(CheckHTML(assign.html()));
              });
          }

          $(document).click(function () {
              $('#' + id).hide();
          });
      })
  }

})(jQuery);
