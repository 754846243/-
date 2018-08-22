
export function setCookie(name, value) {
  const time = new Date();
  time.setTime(Date.now() + 30 * 24 * 60 * 60 * 1000);
  document.cookie = name + '=' + escape(value) + ';expires=' + time.toDateString() + ';path=/';
}

export function getCookie(name) {
  let arr;
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2]);
  } else {
    return null;
  }
}


export function delCookie(name) {
  const exp = new Date();
  exp.setTime(exp.getTime() - 30 * 24 * 60 * 60 * 1000);
  const cval = getCookie(name);
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toDateString() + ';path=/';
  }
}
