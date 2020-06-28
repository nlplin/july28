<template>
  <div>
    <el-card class="box-card" style="margin-bottom:20px">
      <selectMenu @categoryChange="categoryChange" ref="cs" />
    </el-card>

    <!-- 内容区  按钮  表格  底部分页-->
    <el-card class="box-card">
      <div v-show="!attrValue&&!showSpuForm">
        <!-- 添加SPU按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom:20px"
          :disabled="!category3Id"
          @click="addSpu"
        >添加SPU</el-button>
        <!-- 表格 -->
        <el-table :data="spuList" border>
          <el-table-column label="序号" align="center" width="180" type="index"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称" align="center"></el-table-column>
          <el-table-column prop="description" label="SPU描述"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{row,$index}">
              <HintButton
                title="添加SPU"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                slot="reference"
                @click="showSpuList(row)"
              />
              <HintButton
                title="修改SPU"
                type="primary"
                icon="el-icon-edit"
                size="mini"
                slot="reference"
                @click="showInfomation(row)"
              />
              <HintButton
                title="SPU详情"
                type="info"
                icon="el-icon-info"
                size="mini"
                slot="reference"
                @click="showCard(row)"
              />
              <el-popconfirm :title="`确定删除属性${row.spuName}吗?`" @onConfirm="deleteValue(row)">
                <HintButton
                  title="删除SPU"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="margin-top:20px"
          align="center"
          background
          @size-change="handleSizeChange"
          @current-change="getBase"
          :page-sizes="[3,6,9,12]"
          :page-size="limit"
          :current-page="page"
          layout="prev, pager, next, jumper,-> ,sizes, total"
          :total="total"
        ></el-pagination>
      </div>
      <spuShow :visible.sync="attrValue" ref="spuForm" @saveSuccess="saveSuccess" @cancel="cancel" />
      <skuForm
        :visible.sync="showSpuForm"
        ref="showSpu"
        @saveSuccess="showSpuForm=false"
        @cancel="showSpuForm=false"
        v-show="showSpuForm"
      />
    </el-card>

    <el-dialog :title="spuName+ '------>'+'sku列表'" :visible.sync="dialogTableVisible">
      <el-table :data="skuList">
        <el-table-column property="skuName" label="名称" width="150"></el-table-column>
        <el-table-column property="price" label="价格(元)" width="200"></el-table-column>
        <el-table-column property="weight" label="重量"></el-table-column>
        <el-table-column property="skuDefaultImg" label="默认图片">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" alt="图片" style="width:100px;height:100px">
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import spuShow from "../components/spuShow";
import skuForm from "../components/skuForm";
export default {
  name: "SpuList",
  components: {
    spuShow,
    skuForm
  },
  data() {
    return {
      spuList: [],
      attrValue: false,
      page: 1,
      limit: 3,
      total: 0,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuId: "",
      showSpuForm: false,
      spuName:'',
      skuList:[],
      dialogTableVisible:false
    };
  },
  watch: {
    attrValue(val) {
      console.log('watch',val)
      this.$refs.cs.isDisable = val;
    },
    showSpuForm(val){
      console.log('watchSPUFORM',val)
      this.$refs.cs.isDisable = val;
    }
  },
  methods: {
    async getBase(page = 1) {
      this.page = page;
      const { limit, category3Id } = this;
      const result = await this.$API.spu.getSpuProduct(
        this.page,
        limit,
        category3Id
      );
      if (result.code === 200) {
        const { total, records } = result.data;
        this.total = total;
        this.spuList = records;
        // this.$message.success('')
      }
    },
    categoryChange({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = null;
        this.category3Id = null;
        this.spuList = [];
        this.total = 0;
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = null;
        this.spuList = [];
        this.total = 0;
      } else {
        this.category3Id = categoryId;
        this.getBase();
      }
    },
    handleSizeChange(pageSize) {
      // console.log(`每页 ${val} 条`);
      this.limit = pageSize;
      this.getBase();
    },
    showInfomation(spuInfo) {
      this.spuId = spuInfo.id;
      this.attrValue = true;
      this.$refs.spuForm.initUpdateData(spuInfo.id);
    },
    saveSuccess() {
      // this.getBase(this.page)
      if (this.spuId) {
        this.getBase(this.page);
        this.spuId = "";
      } else {
        this.getBase();
      }
    },
    cancel() {},
    async deleteValue(spuInfo) {
      const result = await this.$API.spu.deleteSpu(spuInfo.id);
      if (result.code === 200) {
        this.$message.success("删除数据成功");
        this.getBase(this.page);
      } else {
        this.$message.error("删除数据失败");
      }
    },
    addSpu(spuInfo) {
      console.log(111);
      this.attrValue = true;
      this.$refs.spuForm.initAddData(this.category3Id);
    },
    showSpuList(spuInfo) {
      spuInfo = {
        ...spuInfo,
        category1Id: this.category1Id,
        category2Id: this.category2Id
      };
      this.showSpuForm = true;
      this.$refs.showSpu.initAddData(spuInfo);
    },
    async showCard(spuInfo){
      this.spuName = spuInfo.spuName
      this.dialogTableVisible = true
      const result = await this.$API.sku.getSkuBySpuId(spuInfo.id)
      this.skuList = result.data
    }
  }
};
</script>
