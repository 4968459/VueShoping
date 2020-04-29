<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectCateKey"
            :options="CateList"
            :props="{ expandTrigger: 'hover', value:'cat_id', label:'cat_name',children:'children' }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs 区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            @click="addDialogVisible=true"
            :disabled="isDisabledBtn"
          >添加参数</el-button>
          <el-table :data="manyTableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  @close="handleClosed(i,scope.row)"
                  closable
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+新增</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="showeditdialog(scope.row)"
                  icon="el-icon-edit"
                >修改</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  icon="el-icon-delete"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            @click="addDialogVisible=true"
            :disabled="isDisabledBtn"
          >添加属性</el-button>
          <el-table :data="onlyTaleData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  @close="handleClosed(i,scope.row)"
                  closable
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+新增</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="showeditdialog(scope.row)"
                  icon="el-icon-edit"
                >修改</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  icon="el-icon-delete"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      @close="addDialogClosed"
      :title="'添加'+title_text"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="100px">
        <el-form-item :label="title_text" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      @close="editDialogClosed"
      :title="'修改'+title_text"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="100px">
        <el-form-item :label="title_text" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      CateList: [],
      // 选择的级联选择框的数组
      selectCateKey: [],
      activeName: "many",
      onlyTaleData: [],
      manyTableData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ""
      },
      addFormrules: {
        attr_name: [
          {
            required: true,
            message: `请输入`,
            trigger: "blur"
          }
        ]
      },
      editDialogVisible: false,
      editForm: {
        attr_name: "",
        attr_id: 0
      },
      editFormrules: {
        attr_name: [
          {
            required: true,
            message: `请输入`,
            trigger: "blur"
          }
        ]
      },
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    isDisabledBtn() {
      return this.selectCateKey.length !== 3;
    },
    // 分类id属性
    CateId() {
      if (this.selectCateKey.length == 3) {
        return this.selectCateKey[2];
      }
      return null;
    },
    title_text() {
      if (this.activeName == "many") {
        return "动态参数";
      }
      return "静态属性";
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get(`categories`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类列表数据失败！");
      }
      this.CateList = res.data;
      console.log(this.CateList);
    },
    // 级联选择器修改触发函数
    handleChange() {
      this.getParamsData();
    },
    async getParamsData() {
      if (this.selectCateKey.length !== 3) {
        this.selectCateKey = [];
        this.onlyTaleData = [];
        this.manyTableData = [];
        return;
      }
      console.log(this.selectCateKey);
      const { data: res } = await this.$http.get(
        `categories/${this.CateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("获取参数失败！");
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        item.inputVisible = false;
        item.inputValue = "";
      });

      console.log(res.data);
      if (this.activeName == "only") {
        this.onlyTaleData = res.data;
      } else {
        this.manyTableData = res.data;
      }
    },
    handleTabClick() {
      console.log(this.activeName);
      this.getParamsData();
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加属性函数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post(
          `categories/${this.CateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );

        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败！");
        }
        this.addDialogVisible = false;
        this.getParamsData();
        return this.$message.success("添加参数成功！");
      });
    },
    showeditdialog(data) {
      this.editForm.attr_name = data.attr_name;
      this.editForm.attr_id = data.attr_id;
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.put(
          `categories/${this.CateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新失败！");
        }
        this.$message.success("更新成功！");
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    deleteParams(attr_id) {
      this.$confirm("此操作将永久删除该属性, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.CateId}/attributes/${attr_id}`
          );
          if (res.meta.status !== 200) {
            return this.$message.error("删除属性失败");
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getParamsData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 点击切换输入框处理函数
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length == 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue);
      this.saveAttr(row);
      row.inputValue = "";
      row.inputVisible = false;
    },
    async saveAttr(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.CateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改参数项失败！");
      }
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleClosed(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttr(row);
    }
  }
};
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 0 10px;
}
.input-new-tag {
  width: 120px;
}
</style>