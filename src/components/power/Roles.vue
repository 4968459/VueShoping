<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <!-- 伸缩列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级权限 -->
            <el-row
              v-for="(item1,i1) in scope.row.children"
              :class="['tagBottom','vcenter',i1==0?'tagTop':'']"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightByid(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级三级级权限 -->

              <el-col :span="19">
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="[i2==0?'':'tagTop','vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightByid(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightByid(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="500px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="editRoles(scope.row.id)"
              size="mini"
              icon="el-icon-edit"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteRoles(scope.row.id)"
            >删除</el-button>
            <el-button
              @click="showSetRightDialog(scope.row)"
              type="warning"
              size="mini"
              icon="el-icon-setting"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @close="addRolesDialogClose"
      :close-on-click-modal="false"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRolesDialogVisible"
      width="50%"
      @close="editRolesDialogClose"
      :close-on-click-modal="false"
    >
      <el-form :model="editRolesInfo" :rules="addFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightdialogVisible" width="50%">
      <el-tree
        :data="rightList"
        :props="treeProps"
        node-key="id"
        show-checkbox
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      // 控制添加角色对话框
      addRolesDialogVisible: false,
      // 控制修改角色对话框
      editRolesDialogVisible: false,
      // 添加角色的表单数据
      addForm: {},
      // 添加表单验证规则
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 2, max: 16, message: "长度在 2 到 16 个字符", trigger: "blur" }
        ]
      },
      // 修改角色参数信息
      editRolesInfo: {},
      // 分配权限对话框控制参数
      setRightdialogVisible: false,
      // 权限列表树
      rightList: [],
      treeProps: {
        label: "authName",
        children: "children"
      },
      //选中的项目数组id
      defKeys: [],
      // 角色权限更新列表使用的id
      roleId: ""
    };
  },
  created() {
    this.getRouList();
  },
  methods: {
    // 获取角色列表
    async getRouList() {
      const { data: res } = await this.$http.get(`roles`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      }
      this.rolesList = res.data;
      console.log(this.rolesList);
    },
    //处理添加角色
    addUser() {
      this.$refs.addFormRef.validate(async vaild => {
        if (vaild) {
          const { data: res } = await this.$http.post(`roles`, this.addForm);
          if (res.meta.status !== 201) {
            return this.$message.error("添加角色失败！");
          }
          this.$message.success(res.meta.msg);
          this.addRolesDialogVisible = false;
          this.getRouList();
        }
      });
    },
    // 清空输入框
    addRolesDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    editRolesDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改角色的处理函数
    async editRoles(id) {
      this.editRolesDialogVisible = true;
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色信息失败！");
      }
      this.editRolesInfo = res.data;
    },
    async editUser() {
      const { data: res } = await this.$http.put(
        `roles/${+this.editRolesInfo.roleId}`,
        {
          roleName: this.editRolesInfo.roleName,
          roleDesc: this.editRolesInfo.roleDesc
        }
      );

      if (res.meta.status !== 200) {
        this.$message.error("修改失败！");
      }
      this.$message.success("修改成功");
      this.editRolesDialogVisible = false;
      this.getRouList;
    },
    // 删除处理区域
    deleteRoles(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发起删除请求
          const { data: res } = await this.$http.delete(`roles/${id}`);
          if (res.meta.status !== 200) {
            return this.$message({
              type: "error",
              message: "删除失败!"
            });
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getRouList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 删除一个权限处理函数
    removeRightByid(role, right) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发起删除请求
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${right}`
          );

          if (res.meta.status !== 200) {
            return this.$message({
              type: "error",
              message: "删除失败!"
            });
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          console.log(role);
          role.children = res.data;

          // this.getUserList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 分配权限
    async showSetRightDialog(node) {
      // 清空数组;
      this.roleId = node.id;
      this.defKeys = [];
      this.setRightdialogVisible = true;
      const { data: res } = await this.$http.get(`rights/tree`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取所有权限失败");
      }
      console.log(this.rightList);
      this.getLeafKeys(node, this.defKeys);
      this.rightList = res.data;
    },
    // 递归获取选中的权限id
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr);
      });
    },
    // 点击确定更新权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys()
      ];
      var keyString = keys.join(",");
      console.log(keyString);
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: keyString }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("更新权限失败！");
      }
      this.$message.success("用户信息更新成功！");
      this.setRightdialogVisible = false;
      this.getRouList();
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.tagTop {
  border-top: #ddd solid 1px;
}
.tagBottom {
  border-bottom: solid 1px #ddd;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>