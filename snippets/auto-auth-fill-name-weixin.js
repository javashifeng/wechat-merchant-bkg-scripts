var authPassed = [],
    authRequired = [],
    failed = [];
var getMerchantInfo = function(subMerchantId) {
    var url = 'https://pay.weixin.qq.com/index.php/extend/channel_submerchant/verifyInfo?relationType=expand&submchid=' + subMerchantId;
    console.log(url);
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'GET',
            success: function(data) {
                if (data) {
                    var needAuth = getKey(data, '请填写商户联系人姓名');
                    if (needAuth && needAuth.length > 0) {
                        var elements = getKey(data, 'ecc_csrf_token');
                        elements.forEach(function(ele) {
                            var csrfToken = $(ele).val();
                            if (csrfToken) {
                                resolve(csrfToken);
                            }
                        })
                    }
                } else {
                    failed.push(subMerchantId);
                }
            }
        });
    });
}

var getKey = function(body, key) {
    var elements = body.split('\n').filter(function(v) {
        return v.indexOf(key) >= 0;
    });
    return elements;
}


var updateWechatId = function(subMerchantId, token, name, wechatId) {
    var url = 'https://pay.weixin.qq.com/index.php/extend/channel_submerchant/submit?g_tk=1388569090&g_ty=ajax';
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                submchid: subMerchantId,
                weixin: wechatId,
                contactName: name,
                ecc_csrf_token: token
            },
            success: function(data) {
                if (!data.errorcode) {
                    authPassed.push(subMerchantId)
                } else {
                    failed.push(subMerchantId);
                }
                resolve();
            }
        });
    });
}

var printAuthList = function() {
    console.log("=============");
    console.log("需要审核", authRequired);
    console.log("失败", failed);
    console.log("=============");
}

var authMap = [];

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

authMap.push({
    mch: '254656251',
    name: '王世峰',
    weixin: 'xiaosi859247'
});
authMap.forEach(function(auth) {
    sleep(200).then(function() {
        var mch = auth.mch,
            name = auth.name,
            weixin = auth.weixin;
        getMerchantInfo(mch).then(function(token) {
            updateWechatId(mch, token, name, weixin).then(function() {
                printAuthList();
            });
        });
    })
});
