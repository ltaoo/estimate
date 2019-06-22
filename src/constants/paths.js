export const home = '/';
// 登录
export const loginPath = '/pages/login/index';
// 大厅
export const hallPath = '/pages/hall/index';
export const roomPath = '/pages/hall/room';
// 估时
export const inputPath = '/pages/estimate/index';
export const estimatePath = '/pages/estimate/numbers';
export const resultPath = '/pages/estimate/result';
// 离线估时
export const offlineEstimatePath = '/pages/offline/index';
export const offlineEstimateCardPath = '/pages/offline/result';
// 用户中心
export const userPath = '/pages/user/index';
// 错误页
export const offlineErrorPath = '/pages/errors/offline';

export const heads = new Proxy({
  [hallPath]: {
    title: '大厅',
    desc: '加入已存在的房间或者创建房间',
  },
}, {
  get: (self, target) => {
    if (self in target) {
      return target[self];
    }
    return {
      title: 'Unknow',
      desc: '刷新试试看',
    };
  },
});
