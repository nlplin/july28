<template>
  <el-form label-width="120px">
    <!-- 名称 -->
    <el-form-item label="SPU 名称 : ">
      <span>{{spuInfo.spuName}}</span>
    </el-form-item>
    <!-- SKU名称 -->
    <el-form-item label="SKU 名称 : ">
      <el-input type="text" placeholder="请输入SKU名称" v-model="skuInfo.skuName" />
    </el-form-item>
    <!-- 价格 -->
    <el-form-item label="价格 : ">
      <el-input type="number" placeholder="请输入SKU价格" v-model="skuInfo.price" />
    </el-form-item>
    <!-- 重量(千克) -->
    <el-form-item label="重量(千克) : ">
      <el-input type="number" placeholder="请输入SKU重量" v-model="skuInfo.weight" />
    </el-form-item>
    <!-- 规格描述 -->
    <el-form-item label="规格描述 : ">
      <el-input type="textarea" placeholder="请输入SKU规格描述" rows="4" v-model="skuInfo.skuDesc" />
    </el-form-item>
    <!-- 平台属性 -->
    <el-form-item label="平台属性 : ">
      <el-form inline label-width="100px">
        <el-form-item
          :label="attr.attrName"
          v-for="attr in attrList"
          :key="attr.id"
          style="margin-bottom:10px"
        >
          <el-select v-model="attr.attrIdValueId">
            <el-option
              v-for="value in attr.attrValueList"
              :key="value.id"
              :label="value.valueName"
              :value="attr.id+'_'+value.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <!-- 销售属性 -->
    <el-form-item label="销售属性 : ">
      <el-form inline label-width="100px">
        <el-form-item :label="attr.saleAttrName" v-for="attr in saleAttrList" :key="attr.id">
          <el-select v-model="attr.saleAttrValueId">
            <el-option
              :label="value.saleAttrValueName"
              :value="value.id"
              v-for="(value ,index) in attr.spuSaleAttrValueList"
              :key="value.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <!-- 图片列表 -->
    <el-form-item label="图片列表 : ">
      <el-table border :data="imageList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" ></el-table-column>
        <el-table-column label="图片" align="center">
          <template slot-scope="{row,$index}">
            <img :src="row.imgUrl" :alt="row.imgName" style="width:150px;height:150px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row,$index}">
            <!-- isDefault 为1 显示标签, 为0 显示按钮 -->
            <el-tag type="success" v-if="row.isDefault=='1'">默认</el-tag>
            <el-button type="primary" v-else @click="setDef(row)">设为默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <!-- 保存 返回 按钮 -->
    <el-form-item>
      <el-button type="primary" @click="savePage">保存</el-button>
      <el-button @click="goback">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "skuForm",
  data() {
    return {
      spuInfo: {},
      attrList: [],
      saleAttrList: [],
      imageList: [],
      // attrIdValueId:'',
      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        skuName: "",
        skuDesc: "",
        price: 0,
        weight: "",
        skuSaleAttrValueList: [],
        skuAttrValueList: [],
        skuImageList: [],
        skuDefaultImg: "",
        isSale: 0
      },
      partImageList:[]
    };
  },
  props: ["visible"],
  methods: {
    goback() {
      this.$emit('cancel')
      // this.$emit("update:visible", false);
    },
    initAddData(spuInfo) {
      this.spuInfo = spuInfo;
      this.skuInfo.category3Id = spuInfo.category3Id
      this.skuInfo.spuId = spuInfo.id
      this.skuInfo.tmId = spuInfo.tmId
      // console.log(this.skuInfo.category3Id)
      // this.skuInFo.category3Id = spuInfo.category3Id
      // this.skuInFo.spuId = spuInfo.id;
      // this.skuInFo.tmId = spuInfo.tmId;
      // console.log('120',spuInfo)
      this.getSpuInfoInitData();
    },
    async getSpuInfoInitData() {
      const { category1Id, category2Id, category3Id, id } = this.spuInfo;
      const promise1 = await this.$API.attr.getAttrList(
        category1Id,
        category2Id,
        category3Id
      );

      const promise2 = await this.$API.sku.getSpuSaleAttrList(id);
      const promise3 = await this.$API.sku.getImgList(id);
      const result = await Promise.all([promise1, promise2, promise3]);
      console.log(result);
      this.attrList = result[0].data;
      this.saleAttrList = result[1].data;
      const imageList = result[2].data;
      imageList.forEach(item=>(item.isDefault = '0'))
      this.imageList = imageList
      // console.log("A", this.attrList);
      // console.log("B", this.saleAttrList);
      // console.log("C", this.imageList);
    },
    setDef(spuImage){
      // 先排他
      console.log(spuImage)
      this.imageList.forEach(item=>(item.isDefault = '0'))
      spuImage.isDefault = '1'
      this.skuInfo.skuDefaultImg = spuImage.imgUrl
    },
    handleSelectionChange(val){
      this.partImageList = val
    },
    async savePage(){
      const {skuInfo,attrList,saleAttrList,partImageList} = this
      console.log('sku',attrList)
      skuInfo.skuAttrValueList = attrList.reduce((pre,attr)=>{
        const attrIdValueId = attr.attrIdValueId
        // console.log('pre',pre)
        // console.log('attr',attr)
        if(attrIdValueId){
          const [attrId,valueId] = attrIdValueId.split('_')
          pre.push({
            attrId,
            valueId
          })
        }
        //  console.log('pre1',pre)
        return pre
      },[])
      skuInfo.skuSaleAttrValueList = saleAttrList.reduce((pre,attr)=>{
        const saleAttrValueId = attr.saleAttrValueId
        if(saleAttrValueId){
          pre.push({
            saleAttrValueId
          })
        }
        return pre
      },[])
      skuInfo.skuImageList = partImageList.map(item=>({
        imgName:item.imgName,
        imgUrl:item.imgUrl,
        isDefault:item.isDefault,
        spuImgId:item.id
      }))
      const result = await this.$API.sku.saveOrUpdate(skuInfo)
      if(result.code === 200){
        this.$message.success('保存成功')
        this.$emit('saveSuccess')
        this.resetData()
      }else{
        alert(error)
        console.log(error.message)
        this.$message.error('提交失败')
      }
    },
    resetData(){
      this.skuInfo = {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        skuName: "",
        skuDesc: "",
        price: 0,
        weight: "",
        skuSaleAttrValueList: [],
        skuAttrValueList: [],
        skuImageList: [],
        skuDefaultImg: "",
        isSale: 0
      },
      this.spuInfo = {}
      this.attrList = []
      this.saleAttrList = []
      this.imageList = []
      this.partImageList = []
    }

  }
};
</script>

<style scoped>
</style>
