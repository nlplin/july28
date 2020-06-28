<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin-bottom:20px" @click="addr">添加</el-button>
    <el-table :data="trademarkList" border stripe v-loading="loading">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" height="50" width="90" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="warning" icon="el-icon-edit" @click="upda(scope.row)">编辑</el-button>
          <el-button size="small" icon="el-icon-delete" type="danger" @click="delet(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:20px"
      align="center"
      background
      @size-change="handleSizeChange"
      @current-change="getTrademarkList"
      :page-sizes="[3,6,9,12]"
      :page-size="limit"
      :current-page="page"
      layout="prev, pager, next, jumper,-> ,sizes, total"
      :total="total"
    ></el-pagination>

    <el-dialog title="跟新" :visible.sync="sho" >
      <el-form :model="form" width="80%" :rules="rules" ref="form">
        <el-form-item label="品牌名称" :label-width="formLabelWidth" prop="tmName">
          <el-input v-model="form.tmName" autocomplete="off" placeholder="Brand Name"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="formLabelWidth" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sho = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpMark('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      trademarkList: [],
      total: 0,
      page: 1,
      limit: 3,
      loading: false,
      imageUrl: "",
      form: {
        tmName: "",
        logoUrl: ""
      },
      sho: false,
      formLabelWidth: "120px",
      rules: {
        tmName: [
          { required: true, message: "请输入名称" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change"
          }
        ],
        logoUrl: [{ required: true, message: "请选择图片", trigger: "change" }]
      }
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    async getTrademarkList(page = 1) {
      this.page = page;
      this.loading = true;
      const result = await this.$API.trademark.getTrademarkList(
        this.page,
        this.limit
      );
      this.loading = false;
      if (result.code === 200) {
        const { records, total } = result.data;
        this.trademarkList = records;
        this.total = total;
      } else {
        this.$message.error("错误");
      }
    },
    handleSizeChange(pageSize) {
      // console.log(`每页 ${val} 条`);
      this.limit = pageSize;
      this.getTrademarkList();
    },
    addr() {
      this.form = {
        tmName: "",
        logoUrl: ""
      };
      this.sho = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    handleAvatarSuccess(res, file) {
      this.form.logoUrl = URL.createObjectURL(file.raw);
      // this.$refs.form.clearValidate("logoUrl");
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      // const isLt2M = file.size / 1024 / 1024 < 2;
      const isJPG = ["image/jpeg", "image/png", "image/jpg"].includes(
        file.type
      );
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    addOrUpMark() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const { form } = this;
          let result;
          if (form.id) {
            result = await this.$API.trademark.updateTrademark(this.form);
            console.log(form.id);
          } else {
            result = await this.$API.trademark.addTrademark(this.form);
            console.log("失败的", form.id);
          }
        if (result.code === 200) {
          this.$message.success(`${form.id ? "跟新" : "上传"}成功`);
          this.getTrademarkList();
          this.sho = false;
        } else {
          this.$message.error(`${form.id ? "跟新" : "上传"}失败`);
        }
        }
      });
    },
    upda(trademark) {
      // this.form = trademark
      this.form = { ...trademark };
      console.log(this.form);
      this.sho = true;
    },
    async delet(trademarkId) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const result = await this.$API.trademark.deleteTrademark(
            trademarkId.id
          );
          if (result.code === 200) {
            this.$message.success("删除成功");
            this.getTrademarkList(
              this.trademarkList.length === 1 ? this.page - 1 : this.page
            );
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style>
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
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
