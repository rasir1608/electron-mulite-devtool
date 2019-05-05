import http from '@/utils/http';

export function getWorkSpacePath() {
  return http('getWorkSpacePath');
}

export function saveWorkSpace(params) {
  return http('saveWorkSpace', params);
}

export function queryWorkList(params = {}) {
  return http('queryWorkList', params);
}

export function checkWorkName(name) {
  return http('checkWorkName', name);
}

export function runWorkCode(workSpace = {}) {
  return http.send('runWorkCode', workSpace);
}

export function updateWorkSpace(params = {}) {
  return http('updateWorkSpace', params);
}

export function killWork(params = {}) {
  return http.send('killWork', params);
}
