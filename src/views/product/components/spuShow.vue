<template>
  <el-form v-show="visible" label-width="100px">
    <!-- 名称 -->
    <el-form-item label="SPU名称 : ">
      <el-input type="text" placeholder="请输入SPU名称" v-model="spuInfo.spuName" />
    </el-form-item>
    <!-- 品牌 -->
    <el-form-item label="SPU品牌 : ">
      <template>
        <el-select placeholder="请选择" value v-model="spuInfo.tmId">
          <el-option :label="tm.tmName" :value="tm.id" v-for="tm in trademarkList" :key="tm.id"></el-option>
        </el-select>
      </template>
    </el-form-item>
    <!-- SPU描述 -->
    <el-form-item label="SPU描述 : ">
      <el-input type="textarea" placeholder="请输入SPU的描述信息" rows="4" v-model="spuInfo.description" />
    </el-form-item>
    <!-- SPU图片 -->
    <el-form-item label="SPU图片 : ">
      <el-upload
        multiple
        action="/dev-api/admin/product/fileUpload"
        :file-list="spuImageList"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
      >
        <i class="el-icon-plus"></i>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1kb</div>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
    </el-form-item>
    <!-- 销售属性 -->
    <el-form-item label="销售属性 : ">
      <template>
        <el-select
          v-model="attrIdAttrName"
          :placeholder="unSelect.length>0?`还有${unSelect.length}个可选`:`无选项`"
          value
        >
          <el-option
            :label="item.name"
            :value="item.id+':'+ item.name"
            v-for="item in unSelect"
            :key="item.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAttrName"
          @click="addSale"
        >添加销售属性</el-button>

        <el-table border style="margin:15px 0;" :data="spuInfo.spuSaleAttrList">
          <el-table-column label="序号" align="center" width="80" type="index"></el-table-column>
          <el-table-column label="属性名" prop="saleAttrName"></el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{row,$index}">
              <el-tag
                style="margin-left:5px"
                :key="value.id"
                v-for="(value,index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(row.spuSaleAttrValueList,index)"
              >{{value.saleAttrValueName}}</el-tag>
              <el-input
                placeholder="请输入属性"
                style="width:100px"
                class="input-new-tag"
                v-if="row.edit"
                v-model="row.saleAttrValueName"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              ></el-input>
              <el-button
                v-else
                class="el-icon-plus"
                size="small"
                @click="showInput(row)"
                icon
              >New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160" type="index">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定删除属性吗?`" @onConfirm="deleteValue($index)">
                <HintButton
                  title="删除"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item>
          <!-- 保存按钮 -->
          <el-button type="primary" @click="save">保存</el-button>
          <!-- 返回按钮 -->
          <el-button plain @click="back">返回</el-button>
        </el-form-item>
      </template>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "spuShow",
  props: ["visible"],
  data() {
    return {
      spuId: "",
      spuInfo: {
        spuSaleAttrList: [],
        category3Id:'',
        spuName:'',
        description:'',
        spuImageList:[],
        tmId:''
      },
      spuImageList: [],
      trademarkList: [],
      saleAttrList: [],
      imageUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,
      // inputVisible: false,
      // inputValue: "",
      attrIdAttrName: ""
    };
  },
  computed: {
    unSelect() {
      const {
        saleAttrList,
        spuInfo: { spuSaleAttrList }
      } = this;
      return saleAttrList.filter(
        sa => !spuSaleAttrList.some(ssa => ssa.saleAttrName === sa.name)
      );
    }
  },
  methods: {
    back() {
      this.$emit('cancel')
      this.resetData()
      // console.log("111");
      // this.visible = false
      this.$emit("update:visible", false);
    },
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    initUpdateData(spuId) {
      // 先存储SPUID信息数据
      this.spuId = spuId;
      // 获取SPUINFO
      this.getSpuInfoById(spuId);

      this.getSpuImageList(spuId);

      this.getTrademarkList();

      this.getSaleAttrList();
    },

    async getSpuInfoById(spuId) {
      const result = await this.$API.spu.getSpuById(spuId);
      if (result.code === 200) {
        this.spuInfo = result.data;
      }
    },

    async getSpuImageList(spuId) {
      const result = await this.$API.sku.getImgList(spuId);
      if (result.code === 200) {
        const spuImageList = result.data;
        spuImageList.forEach(item => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = spuImageList;
      }
    },

    async getTrademarkList() {
      const result = await this.$API.trademark.getTrademarkList();
      if (result.code === 200) {
        this.trademarkList = result.data;
      }
    },
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleAttrList();
      if (result.code === 200) {
        this.saleAttrList = result.data;
      }
    },
    handleSuccess(response, file, fileList) {
      // response响应的对象 =====  file上传图片的信息数据对象 ===== flieList 上传的图片数组数据
      this.spuImageList = fileList;
    },
    handleClose(valueList, index) {
      valueList.splice(index, 1);
    },
    showInput(attr) {
      if (attr.hasOwnProperty("edit")) {
        attr.edit = true;
      } else {
        this.$set(attr, "edit", true);
      }
      // this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    handleInputConfirm(attr) {
      const saleAttrValueName = attr.saleAttrValueName;
      if (saleAttrValueName) {
        const res = attr.spuSaleAttrValueList.some(
          value => value.saleAttrValueName === saleAttrValueName
        );
        if (!res) {
          attr.spuSaleAttrValueList.push({
            saleAttrValueName,
            baseSaleAttrId: attr.baseSaleAttrId
          });
        } else {
          this.$message.warning("属性值重复,请重新输入");
          return;
        }
        attr.edit = false;
        attr.saleAttrValueName = "";
      }
    },
    deleteValue(index) {
      this.spuInfo.spuSaleAttrList.splice(index, 1);
    },
    //添加销售属性
    addSale() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAttrName.split(':');
      // console.log(baseSaleAttrId, saleAttrName);
      this.spuInfo.spuSaleAttrList.push({
        saleAttrName,
        baseSaleAttrId,
        spuSaleAttrValueList: []
      });
      this.attrIdAttrName = '';
    },
    async save() {
      const { spuInfo, spuImageList } = this;
      spuInfo.spuImageList = spuImageList.map(item => ({
        imgName: item.name,
        imgUrl: item.response ? item.response.data : item.imgUrl
      }));
      spuInfo.spuSaleAttrList = spuInfo.spuSaleAttrList.filter(attr => {
        if (attr.spuSaleAttrValueList.length > 0) {
          delete attr.edit;
          delete attr.saleAttrValueName;
          return true;
        }
        return false
      });
      const result = await this.$API.spu.addOrUpdateSpu(spuInfo)
       if (result.code === 200) {
        this.$message.success('保存成功')
        this.$emit('saveSuccess')
        this.$emit("update:visible", false);
        this.resetData()
      } else {
        this.$message.error('保存失败')
      }
    },
    resetData(){
      this.spuId="",
      this.spuInfo= {
        spuName: '',
        description: '',
        spuImageList: [],
        spuSaleAttrList: [],
        category3Id: '',
        tmId: ''
      },
      this.spuImageList= [],
      this.trademarkList= [],
      this.saleAttrList= [],
      this.dialogImageUrl= "",
      this.dialogVisible= false,
      this.attrIdAttrName= ""
    },
    initAddData(category3Id){
      this.spuInfo.category3Id = category3Id
      this.getTrademarkList()
      this.getSaleAttrList()
    }
  }
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
