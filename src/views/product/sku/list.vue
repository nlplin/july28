<template>
  <div>
    <el-card class="box-card">
      <el-table  border>
          <el-table-column label="序号" align="center" width="80" prop="skuName" type="index"></el-table-column>
          <el-table-column prop="spuName" label="名称"></el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
          <el-table-column label="默认图片" align="center">
          </el-table-column>
          <el-table-column prop="description" label="重量(KG)"></el-table-column>
          <el-table-column prop="description" label="价格(元)" width="80"></el-table-column>
          <el-table-column prop="description" label="操作" align="center">
            <el-button type="warning" icon="el-icon-bottom"></el-button>
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button type="primary" icon="el-icon-info"></el-button>
            <el-button type="danger" icon="el-icon-delete"></el-button>
          </el-table-column>
        </el-table>
        <!-- @current-change="getBase" -->
        <el-pagination
          style="margin-top:20px"
          align="center"
          background
          @size-change="handleSizeChange"
          :page-sizes="[3,6,9,12]"
          :page-size="limit"
          :current-page="page"
          layout="prev, pager, next, jumper,-> ,sizes, total"
          :total="total"
        ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SkuList",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      loading:false
    };
  },
  mounted(){
    this.getSKUList()
  },
  methods:{
    handleSizeChange(pageSize) {
      // console.log(`每页 ${val} 条`);
      this.limit = pageSize;
      this.getBase();
    },
    async getSKUList(page = 1){
      this.page = page
      this.loading = true
      const result = await this.$API.sku.getSkuList(this.page,this.limit)
      if(result.code === 200){
        this.$message.success('成功')
      }else{
        this.$message.error('失败')
      }
    }
  }

};
</script>

