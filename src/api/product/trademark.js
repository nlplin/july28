import request from '@/utils/request'
const api_name = '/admin/product/baseTrademark'

export default {
  /*
  获取会员分页列表(带搜索)
  */
  getTrademarkList(page, limit) {
    if(page&&limit){
      return request({
        url: `${api_name}/${page}/${limit}`,
        method: 'GET',
      })
    }else{
      return request.get(`${api_name}/getTrademarkList`)
    }
  },
  addTrademark(trademark){
    // return request({
    //   url:`${api_name}/save`,
    //   method:'POST',
    //   data:trademark
    // })
    return request.post(`${api_name}/save`,trademark)
  },
  updateTrademark(trademark){
    return request({
      url:`${api_name}/update`,
      method:'PUT',
      data:trademark

    })
  },
  deleteTrademark(id){
    return request({
      url:`${api_name}/remove/${id}`,
      method:'DELETE'
    })
  }
}
