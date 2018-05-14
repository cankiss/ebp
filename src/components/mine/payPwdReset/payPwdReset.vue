<template>
  <div class="payPwdReset-wrapper">
    <div class="payPwdReset">
      <p style="font-size:20px;padding:40px 0">重置交易密码</p>
      <Form :model="formLeft" ref="formLeft" :rules="ruleValidate" label-position="left" :label-width="160">
        <FormItem label="手机号码：">
          <Input
          :placeholder="getPhone | phoneHidden"
          size="large"
          readonly>
            <div slot="append">
              <div class="count-down">
                <Button
                @click.native="countDown"
                :disabled="start">{{start ? `${time}&nbsp;s` : '获取'}}</Button>
              </div>
            </div>
          </Input>
        </FormItem>
        <FormItem label="动态验证码：" prop="smsVerificationCode">
            <Input
            v-model="formLeft.smsVerificationCode"
            placeholder="请输入动态验证码"
            :maxlength="6"
            size="large"></Input>
        </FormItem>
        <FormItem label="企业组织机构代码：" prop="orgNo">
            <Input v-model="formLeft.orgNo"
            placeholder="请输入企业组织机构代码"
            :maxlength="20"
            size="large"
            ></Input>
        </FormItem>
        <FormItem label="交易密码：" prop="newPassword">
            <Input
            v-model="formLeft.newPassword"
            placeholder="请输入交易密码"
            :maxlength="6"
            size="large"
            type="password"
            ></Input>
        </FormItem>
        <FormItem label="确认交易密码：" prop="confirmPwd">
            <Input
            v-model="formLeft.confirmPwd"
            placeholder="确认交易密码"
            :maxlength="6"
            size="large"
            type="password"
            ></Input>
        </FormItem>
      </Form>
      <div class="confirm-btn">
        <Button type="warning" long @click.native="confirm('formLeft')">确&emsp;定</Button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    let passwordValid = (rule,value,callback) => {
      !!value.replace(/\s+/g, "") || callback(new Error("交易密码不能为空！"))
        if(!/\d{6}$/.test(value)){
          callback(new Error("交易密码格式有误！"))
        }else{
          callback()
        }
    }
    let confirmPwd = (rule,value,callback) => {
      !!value.replace(/\s+/g, "") || callback(new Error("确认交易密码不能为空！"))
        if(value != this.formLeft.newPassword){
          callback(new Error("交易密码不一致"))
        }else{
          callback()
        }
    }
    return {
      start:false,
      time:60,
      formLeft:{
        type:'2',
        smsVerificationCode:'',
        newPassword:'',
        confirmPwd:'',
        mobile:sessionStorage.getItem('phone_num')
      },
      ruleValidate:{
        smsVerificationCode:[
          {required: true, message: '短信验证码不能为空', trigger: 'blur'}
        ],
        orgNo:[
          {required: true, message: '组织机构代码不能为空', trigger: 'blur'}
        ],
        newPassword:[
          {validator:passwordValid,trigger:"blur",required: true}
        ],
        confirmPwd:[
          {validator:confirmPwd,trigger:"blur",required: true,}
        ]
      }
    }
  },
  metaInfo:{
    title:"重置交易密码"
  },
  computed:{
    getPhone(){
      return sessionStorage.getItem('phone_num')
    }
  },
  methods:{
    sendMsg(){
      this.$post('sms/requestValidateCode',{
        phone_num:this.getPhone,type:"1",operationType:"7"
      }).then(() => {
        this.$Message.success('短信验证码已发送！')
      }).catch(({msg}) => {
        this.$Message.error(msg)
      })
    },
    confirm(form){
      this.$refs[form].validate(valid => {
        if(valid){
          delete this.formLeft.confirmPwd
          this.$mine('deposit/modifyOrResetPassword',this.formLeft).then(() => {
            this.$Message.success({
              content:"交易密码重置成功！",
              onClose:() => {
                this.$router.push('/mine')
              }
            })
          }).catch(({msg}) => {
            this.$Message.error(msg)
            this.$refs[form].resetFields()
          })
        }
      })
    },
    countDown(){
      this.start = !this.start
      this.sendMsg()
      let temp = this.time,
        interval = setInterval(()=>{
        if(this.time > 0 ) this.time--
        else{
          clearInterval(interval)
          this.time = temp
          this.start = !this.start
        }
      },1000)
    }
  }
}
</script>
<style>
.payPwdReset-wrapper .ivu-input-group-prepend, .ivu-input-group-append{
  width: 36px;
}
.payPwdReset-wrapper .ivu-input-group-append{
  padding: 0;
}
</style>

<style lang="less" scoped>
  .payPwdReset-wrapper{
    background:#fff;
    height: 700px;
    margin-bottom: 40px;
    .payPwdReset{
      margin-top: 20px;
      padding: 0 40px;
      width: 600px;
      .count-down {
        width: 60px;
        .ivu-btn {
          background: #fff;
          color: #ff9900;
          border-radius: 2px;
          font-size: 14px;
        }
      }
      .confirm-btn{
        width: 60%;
        margin: 40px 100px;
        text-align: center;
        .ivu-btn {
          font-size: 16px;
        }
      }
    }
  }
</style>
