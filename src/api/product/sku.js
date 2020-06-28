import request from '@/utils/request'
const api_name = '/admin/product'

export default {

  // 下架
  cancelSale(skuId){
    return request.get(`${api_name}/cancelSale/${skuId}`)
  },
  // 上架
  onSale(skuId){
    return request.get(`${api_name}/onSale/${skuId}`)
  },

  // 删除Sku
  deleteSku(skuId){
    return request.delete(`${api_name}/deleteSku/${skuId}`)
  },
  // 根据SPU 查找SPU下的所有 ---->SKU
  getSkuBySpuId(spuId){
    return request.get(`${api_name}/findBySpuId/${spuId}`)
  },
  // 根据SKUID 查找SKU详情
  getSkuById(skuId){
    return request.get(`${api_name}/getSkuById/${skuId}`)
  },
  // 根据页码条数 回去SKU列表信息数据
  getSkuList(page,limit){
    return request.get(`${api_name}/list/${page}/${limit}`)
  },

  // // 保存SKU ================================================
  // saveSkuInfo(skuInfo){
  //   return request.post(`${api_name}/saveSkuInfo`,skuInfo)
  // },
  // // 跟新SKU ================================================
  // updateSkuInfo(skuInfo){
  //   return request.post(`${api_name}/updateSkuInfo`,skuInfo)
  // },

  saveOrUpdate(skuInfo){
    return request.post(`${api_name}/${skuInfo.id?'update':'save'}SkuInfo`,skuInfo)
  },
  getImgList(spuId){
    return request.get(`${api_name}/spuImageList/${spuId}`)
  },
  getSpuSaleAttrList(spuId){
    return request.get(`${api_name}/spuSaleAttrList/${spuId}`)
  }
}
