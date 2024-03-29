/*

[rewrite_local]
# 知乎（部分替换为手机百度 Quark 的 User-Agent）
^https:\/\/www\.zhihu\.com\/ url request-header (\r\n)User-Agent:.+(\r\n) request-header $1User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 Quark/604.1 T7/10.7 SearchCraft/2.7.7 (Baidu; P1 9.0.0)$2
# 知乎网页直接看
^https://www\.zhihu\.com/question/ url script-response-body https://raw.githubusercontent.com/id77/QuantumultX/master/Script/zhihu.js
^https://zhuanlan\.zhihu\.com/p/ url script-response-body https://raw.githubusercontent.com/id77/QuantumultX/master/Script/zhihu.js
# 知乎网页去广告&推荐列表
https://www\.zhihu\.com/api/v4/questions/\d+/related-readings url reject-200
https://www\.zhihu\.com/api/v4/answers/\d+/related-readings url reject-200
https://www\.zhihu\.com/api/v4/hot_recommendation url reject-200
https://www\.zhihu\.com/commercial_api/banners_v3/mobile_banner url reject-200
https://zhuanlan\.zhihu\.com/api/articles/\d+/recommendation url reject-200



[mitm]
hostname = www.zhihu.com, zhuanlan.zhihu.com
*/

let html = $response.body;
let nonce = html.match(/nonce="[\w\-]*"/g)[1];

html = html.replace('apple-itunes-app', '');

html =
  html.replace(/(<\/html>)/, '') +
  `
<style ${nonce}>
div {
  -webkit-line-clamp: 999 !important;
  -webkit-line-clamp: none !important;
}
.OpenInAppButton.is-shown {
    -webkit-transform:translate(-50%,50px) !important;
    transform: translate(-50%,50px) !important;
}
.CommentsForOia button {
  display: none;
}
</style>

<script ${nonce}>
setTimeout(
() => {
    document.querySelector(".MobileModal-wrapper").remove()
}
,
100
)

setTimeout(
() => {
    document.querySelector("body").style.overflow = "auto"
    document.querySelector(".Question-main").removeAttribute("class")

    // document.querySelectorAll(".ContentItem-expandButton").forEach(item => item.click())
}
,
600
)
</script>
</html>
`;

$done({ body: html });
