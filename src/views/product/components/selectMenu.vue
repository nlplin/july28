<template>
  <el-form inline :v-model="form">
    <el-form-item label="一级分类">
      <el-select v-model="form.category1Id" placeholder="请选择一级菜单" @change="change1"
      :disabled="isDisable">
        <el-option v-for="item in categoryList1" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>

     <el-form-item label="二级分类">
      <el-select v-model="form.category2Id" placeholder="请选择二级菜单" @change="change2"
      :disabled="isDisable">
        <el-option v-for="item in categoryList2" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="三级分类">
      <el-select v-model="form.category3Id" placeholder="请选择三级菜单" @change="change3"
      :disabled="isDisable">
        <el-option v-for="item in categoryList3" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SelectMenu",
  data(){
    return{
      form:{
        category1Id:'',
        category2Id:'',
        category3Id:'',
      },
      categoryList1:[],
      categoryList2:[],
      categoryList3:[],
      isDisable:false
    }
  },
  mounted(){
    // 获取分类列表1 的数据
    this.getCategoryList1()
  },
  methods:{
    async getCategoryList1(){
      const result = await this.$API.category.getCategorys1()
      if(result.code === 200){
        this.categoryList1 = result.data
      }
    },
    async change1(category1Id){
      this.form.category2Id = ''
      this.form.category3Id = ''
      this.categoryList2 = []
      this.categoryList3 = []
      this.$emit('categoryChange',{categoryId:category1Id,level:1})
      const result = await this.$API.category.getCategorys2(category1Id)
       if(result.code === 200){
        this.categoryList2 = result.data
      }
    },
    async change2(category2Id){
      this.form.category3Id = ''
      this.categoryList3 = []
      this.$emit('categoryChange',{categoryId:category2Id,level:2})
      const result = await this.$API.category.getCategorys3(category2Id)
      if(result.code === 200){
        this.categoryList3 = result.data
      }
    },
    async change3(category3Id){
      this.$emit('categoryChange',{categoryId:category3Id,level:3})
    }
  }
};
</script>

<style scoped rel='stylesheet/less' lang="less">
</style>
