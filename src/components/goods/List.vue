<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" @clear="searchGoods" clearable v-model="queryInfo.query">
            <el-button slot="append" @click="searchGoods" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe style="width: 100%">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="120"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="90"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140">
          <template slot-scope="scope">{{scope.row.add_time |dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scoped">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="editGoods(scoped.row.goods_id)"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              @click="deleteGoodsByID(scoped.row.goods_id)"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      goodsList: []
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get(`goods`, {
        params: this.queryInfo
      });
      console.log(res);

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败！");
      }
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      console.log(this.goodsList);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    searchGoods() {
      this.queryInfo.pagenum = 1;
      this.getGoodsList();
    },
    deleteGoodsByID(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`goods/${id}`);
          console.log(res);

          if (res.meta.status !== 200) {
            return this.$message.error("删除失败！");
          }
          this.getGoodsList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    goAddpage() {
      this.$router.push("/goods/add");
    },
    editGoods(id) {
      this.$router.push(`/goods/edit?id=${id}`);
    }
  }
};
</script>
  
<style lang="less" scoped>
</style>