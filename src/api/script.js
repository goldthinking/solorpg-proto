import axios from 'axios';

// 获取剧本数据的函数
export const fetchScripts = (page, size, tagId, difficulty, searchQuery) => {
  return axios.get('/api/script', {
    params: {
      page,
      size,
      tagId,
      difficulty,
      searchQuery,
    },
  })
  .then(response => {
    if (response.data.code === '200') {
      return response.data.data; // 返回数据部分
    } else {
      throw new Error(response.data.msg);
    }
  })
  .catch(error => {
    console.error('获取剧本数据失败:', error);
    throw error;
  });
};

export function fetchScriptDetails(scriptId) {
  return axios.get(`/api/script/${scriptId}`)
    .then(response => {
      if (response.data.code === '200') {
        return response.data.data; // 返回数据部分
      } else {
        throw new Error(response.data.msg);
      }
    })
    .catch(error => {
      console.error("Error fetching script details:", error);
      throw error;  // 抛出错误，方便外部捕获
    });
}

export function fetchScriptDTODetails(scriptId) {
  return axios.get(`/api/scriptDTO/${scriptId}`)
    .then(response => {
      if (response.data.code === '200') {
        return response.data.data; // 返回数据部分
      } else {
        throw new Error(response.data.msg);
      }
    })
    .catch(error => {
      console.error("Error fetching script details:", error);
      throw error;  // 抛出错误，方便外部捕获
    });
}