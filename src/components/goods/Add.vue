<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-alert title="添加商品信息" center type="info" show-icon></el-alert>
    <el-card>
      <el-steps :space="200" :active="+activeIndex" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs区域 -->
      <el-form
        :model="addGoodsFrom"
        :rules="addGoodsFromRules"
        ref="addGoodsFromRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          @tab-click="tabClickhandle"
          :tab-position="'left'"
          :before-leave="beforeTabsLeave"
          v-model="activeIndex"
        >
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsFrom.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addGoodsFrom.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addGoodsFrom.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addGoodsFrom.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsFrom.goods_cat"
                :options="catelist"
                :props="{ expandTrigger: 'hover', label:'cat_name',value:'cat_id',children:'children' }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="item1" v-for="(item1,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品图片">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <quill-editor v-model="addGoodsFrom.goods_introduce"></quill-editor>
            <el-button class="addBtn" type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- dialog -->
      <el-dialog title="图片预览" :visible.sync="PreviewDialogVisible" width="50%">
        <img :src="PreviewURL" width="100%" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "0",
      // 添加表单数据
      addGoodsFrom: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [2827, 2828, 2829],
        pics: [],
        goods_introduce: "",
        attrs: []
      },
      addGoodsFromRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      catelist: [],
      manyTableData: [],
      onlyTableData: [],
      uploadURL: "https://www.liulongbin.top:8888/api/private/v1/upload",
      headersObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      PreviewURL: "",
      PreviewDialogVisible: false
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    cateID() {
      if (this.addGoodsFrom.goods_cat.length == 3) {
        return this.addGoodsFrom.goods_cat[2];
      }
      return null;
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get(`categories`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败！");
      }
      this.catelist = res.data;
      console.log(res.data);
    },
    handleChange() {
      if (this.addGoodsFrom.goods_cat.length !== 3) {
        this.addGoodsFrom.goods_cat = [];
      }
      console.log(this.addGoodsFrom.goods_cat);
    },
    beforeTabsLeave(newV, oldV) {
      if (oldV === "0" && this.addGoodsFrom.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类！");
        return false;
      }
    },
    async tabClickhandle() {
      if (this.activeIndex == "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateID}/attributes`,
          {
            params: { sel: "many" }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态属性失败！");
        }
        // attr_vals: "660 960 845 855"
        res.data.forEach(item => {
          item.attr_vals.length == 0
            ? []
            : (item.attr_vals = item.attr_vals.split(" "));
        });
        this.manyTableData = res.data;
        console.log(this.manyTableData);
      }
      // tab栏 商品属性
      if (this.activeIndex == "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateID}/attributes`,
          {
            params: { sel: "only" }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态属性失败！");
        }

        this.onlyTableData = res.data;
        console.log(this.onlyTableData);
      }
    },
    // 图片上传
    handlePreview(file) {
      console.log(file);
      this.PreviewURL = file.response.data.url;
      this.PreviewDialogVisible = true;
    },
    handleRemove(file) {
      const thisPath = file.response.data.tmp_path;

      var i = this.addGoodsFrom.pics.findIndex(item => item.pic == thisPath);
      this.addGoodsFrom.pics.splice(i, 1);
    },
    uploadSuccess(response) {
      const uploadURLObj = {
        pic: response.data.tmp_path
      };
      this.addGoodsFrom.pics.push(uploadURLObj);
      console.log(this.addGoodsFrom);
    },
    addGoods() {
      this.$refs.addGoodsFromRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写完整再提交！");
        }
        // 处理动态属性
        this.manyTableData.forEach(item => {
          const Info = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" ")
          };
          this.addGoodsFrom.attrs.push(Info);
        });
        // 处理静态参数
        this.onlyTableData.forEach(item => {
          const Info1 = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          };
          this.addGoodsFrom.attrs.push(Info1);
        });
        // 提交前替换
        const addForm = JSON.parse(JSON.stringify(this.addGoodsFrom));
        addForm.goods_cat = addForm.goods_cat.join(",");
        console.log(addForm);

        // 发起请求
        const { data: res } = await this.$http.post(`goods`, addForm);
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加商品失败！");
        }
        this.$message.success("添加商品成功！");
        this.$router.push("/goods");
      });
    }
  }
};
</script>

<style lang="less" scope>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.addBtn {
  margin: 15px 0 !important;
}
</style>