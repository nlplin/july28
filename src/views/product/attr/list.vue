<template>
  <div>
    <el-card class="box-card" style="margin-bottom:20px">
      <selectMenu @categoryChange="categoryChange" ref="cs" />
    </el-card>

    <el-card class="box-card">
      <div v-show="attrValue">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom:20px"  @click="more" :disabled="!category3Id">添加属性</el-button>

        <el-table :data="attrList" border>
          <el-table-column label="序号" align="center" width="180" type="index"></el-table-column>
          <el-table-column prop="attrName" label="名称" align="center" width="200"></el-table-column>
          <el-table-column label="属性值">
            <template slot- scope="{row,$index}">
              <el-tag
                type="info"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
              >{{attrValue.valueName}}</el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="attrName" label="操作" align="center" width="160">
            <template slot-scope="{row,$index}">
              <HintButton
                title="修改"
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="changeAttr(row)"
              />

              <el-popconfirm :title="`确定删除属性${row.attrName}吗?`" @onConfirm="deleteAttr(row.id)">
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
      </div>

      <div v-show="!attrValue">
        <el-form inline :model="formAttr">
          <el-form-item label="属性名称">
            <el-input type="text" v-model="formAttr.attrName" />
          </el-form-item>
          <div>
            <el-button type="primary" icon="el-icon-plus" @click="addList" :disabled="!formAttr.attrName.trim()">添加属性值</el-button>
            <el-button @click="cancel">取消</el-button>
          </div>

          <!-- <el-table-column label="序号" align="center" width="180" type="index"></el-table-column> -->
          <el-table :data="formAttr.attrValueList" border style="margin:15px 0;">
            <el-table-column label="序号" align="center" width="180" type="index"></el-table-column>

            <el-table-column label="属性值列表" prop="valueName" width="400" align="center">
              <template slot-scope="{row,$index}">
                <el-input v-if="row.num" :ref="$index" type="text" placeholder="key" v-model="row.valueName" @blur="viewValue(row)" @keyup.13.native="sameView(row)"/>
                <span style="display:inline-block;width:100%" v-else @click="handled(row)">{{row.valueName}}</span>
              </template>
            </el-table-column>
              <el-table-column label="操作" align="center" width="160">
                <template slot-scope="{row,$index}">
                  <el-popconfirm :title="`确定删除属性${row.valueName}吗?`" @onConfirm="deleteAttrValue($index)">
                    <HintButton title="删除" type="danger" icon="el-icon-delete" size="mini" slot="reference" />
                  </el-popconfirm>
                </template>
              </el-table-column>
          </el-table>

          <div>
              <el-button type="primary" @click="updateAttr" :disabled="!Valid">保存</el-button>
              <el-button plain @click="cancel">取消</el-button>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "PropList",
  data() {
    return {
      attrList: [],
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrValue: true,
      formAttr: {
        attrName:'',
        attrValueList:[]
      }
    };
  },
  computed:{
    Valid(){
      return this.formAttr.attrName.trim()&&this.formAttr.attrValueList.some(item=>!!item.valueName.trim())
    }
  },
  watch:{
    attrValue(val){
      console.log(val)
      this.$refs.cs.isDisable = !val
    }
  },
  methods: {
    async getAttrListPage(){
      const result = await this.$API.attr.getAttrList(
          this.category1Id,
          this.category2Id,
          this.category3Id,
        );
        if (result.code === 200) {
          this.attrList = result.data;
        }
    },
    categoryChange({ categoryId, level }) {
      if (level === 3) {
        this.category3Id = categoryId;
        this.getAttrListPage()
      } else if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = null;
        this.category3Id = null;
        this.attrList = [];
      } else {
        this.category2Id = categoryId;
        this.category3Id = null;
        this.attrList = [];
      }
    },
    cancel(){
      this.attrValue = true
      // console.log(111)
    },
    async deleteAttr(id) {
      const result = await this.$API.attr.deleteAttr(id)
      if(result.code === 200){
        this.$message.success('删除成功')
        this.getAttrListPage()
      }else{
        this.$message.error('删除失败')
      }
    },
    changeAttr(formAttr) {
      this.formAttr = cloneDeep(formAttr);
      this.attrValue = false;
    },
    deleteAttrValue(index){
      this.formAttr.attrValueList.splice(index,1)
    },
    addList(){
      // console.log(111)
      this.formAttr.attrValueList.push({
        attrId:this.formAttr.id,
        valueName:'',
        num:true
      })
      this.$nextTick(()=>{
        this.$refs[this.formAttr.attrValueList.length-1].focus()
      })
    },
    viewValue(val){
      if(val.valueName){
        val.num = false
      }
    },
    sameView(val){
      if(val.valueName){
        val.num = false
      }
    },
    handled(val){
      // console.log(111)
      // console.log(val)
      // // this.$nextTick(()=>{
      //    val.num = true
      // })
      // this.viewValue(val)
      // if(val.id){
      //   this.$nextTick(()=>{
      //     this.$refs[this.formAttr.attrValueList.length-1].focus()
      // })
      // }
      if(!val.hasOwnProperty('num')){
        this.$set(val,'num',true)
        // if(val.num){
        //   this.$nextTick(()=>{   //正确写法
        //     this.$refs[this.formAttr.attrValueList.this].focus();
        //   })
        // }
      }else{
        val.num = true
      }
    },
    async updateAttr(){
      // this.formAttr.attrValueList.forEach(value=>delete value.num)
      this.formAttr.attrValueList = this.formAttr.attrValueList.filter(value=>{
        delete value.num
        return !!value.valueName.trim()
      })
      const result = await this.$API.attr.addOrUpdateAttr(this.formAttr)
      if(result.code === 200){
        this.$message.success(`${this.formAttr.id?'跟新':'添加'}属性成功`)
        this.attrValue = true
        this.getAttrListPage()
      }else{
        this.$message.error('跟新失败')
      }
    },
    more(){
      this.formAttr = {
        attrName:'',
        attrValueList:[],
        categoryId:this.category3Id,
        categoryLevel:3
      }
      this.attrValue = false;
    }
  }
};
</script>

<style scoped>
.edit-input {
  padding-right: 60px;
}
.save-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>

