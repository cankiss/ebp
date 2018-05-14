<template>
  <div class="enterprise-resetPwd-wrapper">
    <div class="enterprise-resetPwd">
      <p style="font-size:32px;margin:40px 0">忘记密码</p>
      <Form :model="formRight" ref="formRight" :rules="ruleValidate" @keyup.enter.native="confirm('formRight')">
        <Form-item prop="phone_num">
          <Input
          v-model="formRight.phone_num"
          placeholder="请输入注册手机号"
          size="large"
          :maxlength="11">
            <div slot="prepend">
              <img src="~assets/img/icon_phone_selected.png" alt="">
            </div>
          </Input>
        </Form-item>
        <Form-item prop="validate_code">
          <Input v-model="formRight.validate_code" placeholder="请输入短信验证码" size="large" :maxlength="6">
            <div slot="prepend">
              <img src="~assets/img/icon_message_selected.png" alt="">
            </div>
            <div slot="append">
              <div class="count-down">
                <Button
                @click.native="countDown(formRight)"
                :disabled="start">{{start ? `${time}&nbsp;s` : '获取'}}</Button>
              </div>
            </div>
          </Input>
        </Form-item>
        <Form-item prop="password">
          <Input v-model="formRight.password" placeholder="请输入新密码" size="large" :maxlength="20" type="password">
            <div slot="prepend">
              <img src="~assets/img/icon_code_selected.png" alt="">
            </div>
          </Input>
        </Form-item>
        <Form-item prop="password_confirm">
          <Input v-model="formRight.password_confirm" placeholder="确认密码" size="large" :maxlength="20" type="password">
            <div slot="prepend">
              <img src="~assets/img/icon_code_selected.png" alt="">
            </div>
          </Input>
        </Form-item>
      </Form>
      <div class="confirm-btn">
        <Button type="warning" long @click.native="confirm('formRight')">确&emsp;定</Button>
      </div>
      <div class="font-size-16px" style="margin:20px 0">
        <span>已有账户？</span>
        <a style="color:#FF8001" @click="$router.push('/login')">立即登录</a>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * https://www.iviewui.com/components/form
 *
 * POST sms/requestValidateCode
 * http://192.168.188.72:8090/ebpborrow/swagger-ui.html
 *
 * POST user/resetPassword
 * http://192.168.188.72:8090/ebpborrow/swagger-ui.html#!/user-controller/resetPasswordUsingPOST_2
 */
  export default {
    data() {
      let phoneValid = (rule,value,callback) => {
        !!value.replace(/\s+/g, "") || callback(new Error("注册手机号不能为空！"))
        if(!/^1\d{10}$/.test(value)){
          callback(new Error("手机号格式有误！"))
        }else{
          callback()
        }
      }
      let passwordValid = (rule,value,callback) => {
        !!value.replace(/\s+/g, "") || callback(new Error("新密码不能为空！"))
        if(!/(?:\d.*_)|(?:_.*\d)|(?:[A-Za-z].*_)|(?:_.*[A-Za-z])|(?:[A-Za-z].*\d)|(?:\d.*[A-Za-z])/.test(value)){
          callback(new Error("请输入6~16位字符，至少包括数字、字母、下划线中的两种（区分大小写）"))
        }else{
          callback()
        }
      }
      let isSame = (rule,value,callback) => {
        !!value.replace(/\s+/g, "") || callback(new Error("确认密码不能为空！"))
        if(value != this.formRight.password){
          callback(new Error("密码不一致"))
        }else{
          callback()
        }
      }
      return {
        start:false,
        time:60,
        formRight: {
          phone_num:'',
          validate_code:'',
          password:'',
          password_confirm:''
        },
        ruleValidate:{
          phone_num:[
            {validator:phoneValid,trigger:"blur"}
          ],
          validate_code:[
            {required: true, message: '短信验证码不能为空', trigger: 'blur'}
          ],
          password:[
            {validator:passwordValid,trigger:"blur"}
          ],
          password_confirm:[
            {validator:isSame,trigger:"blur"}
          ]
        }
      }
    },
    metaInfo:{
      title:'忘记登录密码'
    },
    methods:{
      sendMsg(phone_num){
        this.$post('sms/requestValidateCode',{
          phone_num,type:"1",operationType:"2"
        }).then(() => {
          this.$Message.success('短信验证码已发送！')
        }).catch(({msg}) => {
          this.$Message.error(msg)
        })
      },
      confirm(form){
        this.$refs[form].validate(valid => {
          if(valid){
            delete this.formRight.password_confirm
            this.$post('user/resetPassword',this.formRight).then(() => {
              this.$Message.success({
                content:"登录密码重置成功！",
                onClose:() => {
                  this.$router.push('/login')
                }
              })
            }).catch(({msg}) => {
              this.$Message.error(msg)
              this.$refs[form].resetFields()
            })
          }
        })
      },
      countDown(formRight){
        if(!formRight.phone_num.replace(/\s+/g,'')){
          return
        }
        this.start = !this.start
        this.sendMsg(formRight.phone_num)
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
.enterprise-resetPwd-wrapper .ivu-input-group-prepend, .ivu-input-group-append{
  background-color: #6DB7F3;
  width: 36px;
}
.enterprise-resetPwd-wrapper .ivu-input-group-append{
  padding: 0;
}
.enterprise-resetPwd-wrapper .ivu-input{
  background-color: #6DB7F3;
  color: #fff;
}
</style>


<style lang="less" scoped>
  .enterprise-resetPwd-wrapper {
    background: #0D88EB;
    height: 900px;
    width: 100%;
    margin-top: -1px;
    display: flex;
    justify-content: center;
    .enterprise-resetPwd{
      width: 470px;
      padding: 40px 0;
      text-align: center;
      color:#fff;
      .confirm-btn .ivu-btn {
        font-size: 16px;
      }
      .count-down {
        width: 60px;
        .ivu-btn {
          background: #fff;
          color: #ff9900;
          border-radius: 2px;
          font-size: 14px;
        }
      }
      .forget-login {
        text-align: left;
        margin: 20px 0;
        a {
          color: #fff;
          font-size: 14px;
        }
      }
    }
  }
</style>
