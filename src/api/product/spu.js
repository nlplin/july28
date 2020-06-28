import request from '@/utils/request'
const api_name = '/admin/product'

export default {

  getSaleAttrList(){
    return request.get(`${api_name}/baseSaleAttrList`)
  },
  deleteSpu(spuId){
    return request.delete(`${api_name}/deleteSpu/${spuId}`)
  },
  getSpuById(spuId){
    return request.get(`${api_name}/getSpuById/${spuId}`)
  },
  // saveSpuInfo(spuInfo){
  //   return request.post(`${api_name}/saveSpuInfo`,spuInfo)
  // },
  // updateSpuInfo(spuInfo){
  //   return request.post(`${api_name}/updateSpuInfo`,spuInfo)
  // },
  // 合并如下，根据spuInfo的ID值是否存在 存在即跟新，不存在即追加
  addOrUpdateSpu (spuInfo) {
    return request.post(`${api_name}/${spuInfo.id ? 'update' : 'save'}SpuInfo`, spuInfo)
  },
  getSpuProduct(page,limit,category3Id){
    return request.get(`${api_name}/${page}/${limit}`,{params:{category3Id}})
  }

// GET /admin/product/{page}/{limit}
// index


}
