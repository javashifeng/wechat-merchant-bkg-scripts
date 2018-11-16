var authPassed = [],
    authRequired = [],
    failed = [];
var total = 0;
var arr = [254413248, 254423681, 254404966, 254448174, 254423712, 254413253, 254448538, 254404952, 254243752, 254243587, 254404840, 254429616, 254448510, 254423694, 254413271, 254448534, 254423696, 254243733, 254243739, 254413298, 254413265, 254243724, 254423710, 254243636, 254404961, 254429604, 254423688, 254423689, 254423734, 254243708, 254404945, 254429597, 254423685, 254448482, 254413234, 254243759, 254423701, 254423714, 254448550, 254448527, 254413262, 254429571, 254429595, 254404968, 254243741, 254448536, 254413242, 254448520, 254429570, 254405006, 254243762, 254404980, 254429588, 254448560, 254404947, 254423733, 254404974, 254448514, 254405003, 254243745, 254243785, 254243714, 254243740, 254243768, 254243717, 254243732, 254448521, 254404969, 254413259, 254423713, 254413293, 254243778, 254405009];
var getMerchantInfo = function(subMerchantId) {
    return new Promise((resolve, reject) => {
        $.get('https://pay.weixin.qq.com/index.php/extend/channel_submerchant/queryMerchantInfo?pageNum=1&subMerchantCode=' + subMerchantId + '&g_ty=ajax',
            function(data) {
                if (data.data && data.data.merchantInfo) {
                    var merchantInfo = data.data.merchantInfo[0];
                    if (!merchantInfo.hasPayAuth) {
                        authRequired.push(subMerchantId)
                    } else {
                        authPassed.push(subMerchantId)
                    }
                } else {
                    failed.push(subMerchantId);
                }
                resolve();
            });

    });
}

var printAuthList = function() {
    console.log("=============");
    console.log("需要审核", authRequired);
    console.log("错误", failed);
    console.log("=============");
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}


var index = 0;
arr.forEach(function(mchId) {
    index++;
    if (index % 5 == 0) {
        sleep(900).then(() => {
            getMerchantInfo(mchId).then(function() {
                printAuthList();

            });
        })
    } else {
        getMerchantInfo(mchId).then(function() {
            printAuthList();
        });
    }
})
