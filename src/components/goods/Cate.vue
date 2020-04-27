<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showaddclassdialog">添加分类</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 表格区域 -->
    <tree-table
      :expand-type="false"
      :selection-type="false"
      index-text="#"
      show-index
      :data="Catelist"
      :columns="columns"
      border
    >
      <!-- 是否有效 -->
      <template slot="isok" slot-scope="scope">
        <i style="color:green" class="el-icon-success" v-if="scope.row.cat_deleted==false"></i>
        <i style="color:red" class="el-icon-error" v-else></i>
      </template>
      <!-- 排序 -->
      <template slot="order" slot-scope="scope">
        <el-tag size="mini" type="primary" v-if="scope.row.cat_level===0">一级</el-tag>
        <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
        <el-tag size="mini" type="warning" v-else>三级</el-tag>
      </template>
      <!-- 操作 -->
      <template slot="opst">
        <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
      </template>
    </tree-table>

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="AddClassdialogVisible" width="50%">
      <el-form
        :model="addclassruleForm"
        :rules="addclassruleFormrules"
        ref="addclassruleFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addclassruleForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddClassdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddClassdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      Catelist: [],
      // 为table指定列定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "opst"
        }
      ],
      // 控制添加分类对话框显示与隐藏
      AddClassdialogVisible: false,
      // 添加分类表单数据对象
      addclassruleForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      // 验证表单
      addclassruleFormrules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getCatelist();
  },
  methods: {
    // 获取商品分类列表数据
    async getCatelist() {
      const { data: res } = await this.$http.get(`categories`, {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取商品列表数据失败!");
      }
      console.log(res.data);
      this.total = res.data.total;
      this.Catelist = res.data.result;
    },
    // 监听每页大小的处理函数
    handleSizeChange(newValue) {
      this.queryInfo.pagesize = newValue;
      this.getCatelist();
    },
    // 监听页码的处理函数
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getCatelist();
    },
    showaddclassdialog() {
      this.AddClassdialogVisible = true;
    }
  }
};
</script>

<style lang="less" scpoed>
</style>