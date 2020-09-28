<template>
  <div class="userList g-container">
    <div class="g-top-search">
      <el-form :inline="true">
        <el-form-item label="用户名">
          <el-input v-model="searchData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchData.phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFn">查询</el-button>
          <el-button @click="addUserFn">创建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <config-table
      ref="cpTable"
      v-loading="listdata.loading"
      :table-data="listdata.showdata"
      :col-configs="listdata.tableConfig"
      style="font-size: 12px;"
    >
      <template v-slot:opt_status="scope">
        <span>{{ scope.row.statusTxt }}</span>
      </template>
      <template v-slot:operate="scope">
        <el-button type="text" size="small" @click="editUserFn(scope.row)">编辑</el-button>
        <el-button type="text" size="small" @click="delUserFn(scope.row)">删除</el-button>
      </template>
    </config-table>
    <!-- 创建/修改 用户 -->
    <el-dialog :title="`${editUser.type === 'add'? '添加用户' : '编辑用户'}`" :visible.sync="editUser.show" width="450px">
      <el-form ref="ruleForm" :model="ruleForm" label-width="100px">
        <el-form-item prop="name" label="用户名" :rules="[ { required: true, message: '请输入', trigger: 'blur' }]">
          <el-input v-model="ruleForm.name" placeholder="请输入用户名" clearable style="width:80%" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号" :rules="[ { required: true, message: '请输入', trigger: 'blur' }]">
          <el-input v-model="ruleForm.phone" placeholder="请输入手机号" clearable style="width:80%" />
        </el-form-item>
        <el-form-item prop="sex" label="性别" :rules="[ { required: true, message: '请选择', trigger: 'blur' }]">
          <el-select v-model="ruleForm.sex" clearable placeholder="请选择">
            <el-option v-for="(item, index) in sexList" :key="`${item.value} + ${new Date().getTime()} + ${index}`" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="role" label="角色" :rules="[ { required: true, message: '请选择', trigger: 'blur' }]">
          <el-select v-model="ruleForm.role" clearable placeholder="请选择">
            <el-option v-for="(item, index) in roleList" :key="`${item.value} + ${new Date().getTime()} + ${index}`" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="password" label="密码" :rules="[ { required: true, message: '请输入', trigger: 'blur' }]">
          <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码" clearable style="width:80%" />
        </el-form-item>
        <el-form-item v-if="editUser.type === 'add'" prop="cpassword" label="确认密码" :rules="[ { required: true, message: '请输入', trigger: 'blur' }]">
          <el-input v-model="ruleForm.cpassword" type="password" placeholder="请输入确认密码" clearable style="width:80%" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUser.show = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addUser, editUser, getUserList } from '@/api/user'
import configTable from '@/components/configTable'
export default {
  name: 'UserList',
  components: { configTable },
  data() {
    return {
      searchData: {
        name: '',
        phone: ''
      },
      listdata: {
        loading: false,
        showdata: [],
        tableConfig: [
          { prop: 'uid', label: 'ID', type: 'uid', width: 100 },
          { prop: 'name', label: '名称', type: 'name' },
          { prop: 'phone', label: '手机号', type: 'phone' },
          { prop: 'sex', label: '性别', type: 'sex' },
          { prop: 'role', label: '角色权限', type: 'role' },
          { prop: 'operate', label: '操作', slot: 'operate', type: 'slot' }
        ]
      },
      editUser: {
        type: 'add',
        show: false
      },
      ruleForm: {
        uid: '',
        name: '',
        phone: '',
        sex: '',
        role: '',
        password: '',
        cpassword: ''
      },
      sexList: [
        { label: '男', value: '1' },
        { label: '女', value: '0' }
      ],
      roleList: [
        { label: 'admin', value: 'admin' },
        { label: '普通用户', value: 'user' }
      ]
    }
  },
  created() {
    this.searchFn()
  },
  methods: {
    // 查询
    searchFn() {
      this.listdata.loading = true
      getUserList().then(res => {
        if (res.code === 200) {
          const dataList = res.data
          this.$set(this.listdata, 'showdata', dataList)
        } else {
          this.$message.error(res.msg || '失败')
        }
        this.listdata.loading = false
      })
    },
    // 新增用户
    addUserFn() {
      this.editUser.type = 'add'
      Object.keys(this.ruleForm).forEach(key => {
        this.ruleForm[key] = ''
      })
      this.editUser.show = true
    },
    // 编辑用户
    editUserFn(row) {
      this.ruleForm.name = row.name
      this.ruleForm.uid = row.uid
      this.ruleForm.role = row.role
      this.ruleForm.phone = row.phone
      this.ruleForm.sex = row.sex
      this.ruleForm.password = row.password
      this.editUser.type = 'edit'
      this.editUser.show = true
    },
    // 删除用户
    delUserFn() {

    },
    // 验证提交完整
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveFn()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存提交
    async saveFn() {
      const { name, password, phone, role, sex } = this.ruleForm
      const params = {
        name,
        password,
        phone,
        role,
        sex
      }
      let resData = {}
      if (this.editUser.type === 'add') {
        resData = await addUser(params)
      } else if (this.editUser.type === 'edit') {
        params['uid'] = this.ruleForm.uid
        resData = await editUser(params)
      }
      if (resData.code === 200) {
        this.searchFn()
        this.$message.success('成功')
        this.editUser.show = false
      } else {
        this.$message.error(resData.msg || '失败')
      }
    }
  }
}
</script>
