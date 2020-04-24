<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="formRef"
        label-width="0px"
        class="login_form"
        :model="loginFrom"
        :rules="loginFormRules"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-geren"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginFrom.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <div class="btns">
          <el-button @click="login" type="primary">登录</el-button>
          <el-button @click="resetFrom" type="info">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 这是表单数据绑定
      loginFrom: {
        username: "admin",
        password: "123456"
      },
      // 验证表单规则对象
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetFrom() {
      this.$refs.formRef.resetFields();
    },
    login() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(`login`, this.loginFrom);
        if (res.meta.status !== 200) return this.$message.error("登录失败！");
        this.$message.success("登录成功");
        // 保存token
        window.sessionStorage.setItem("token", res.data.token);
        // 路由跳转到主页面
        this.$router.replace("/home");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 350px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 4px;
  transform: translate(-50%, -50%);
  .avatar_box {
    display: flex;
    justify-content: center;
    img {
      border: solid 8px #fff;
      width: 130px;
      height: 130px;
      background-color: #eee;
      transform: translate(0, -50%);

      border-radius: 50%;
      box-shadow: 0 0 10px #eee;
    }
  }
}
.login_form {
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>>
