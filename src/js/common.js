const ua = navigator.userAgent;

let isNotDesktop = (ua.match(/(iemobile|opera mini|iphone|ipad|ipod|blackberry|android)/i)||ua.search(/mobile/i) > 0 ? true : false);

