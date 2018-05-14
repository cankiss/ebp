<template>
  <div>
    <p style="font-size:32px;margin:30px 0">注册账号</p>
    <Form :model="formRegister" ref="formRegister" :rules="ruleValidate">
      <Form-item prop="phone_num">
        <Input
        v-model="formRegister.phone_num"
        placeholder="请输入手机号"
        size="large"
        :maxlength="11"
        @on-blur="isRegisterPhone(formRegister.phone_num)">
        <div slot="prepend">
          <img src="~assets/img/icon_phone_selected.png" alt="">
        </div>
        </Input>
      </Form-item>
      <transition name="fade">
        <Form-item prop="photoValidateCode" v-if="isValid">
          <Input
          v-model="formRegister.photoValidateCode"
          placeholder="请输入图像验证码"
          :maxlength="6"
          size="large">
            <div slot="prepend">
              <img src="~assets/img/icon_code_selected.png" alt="">
            </div>
            <div slot="append">
              <div id="validate-photo" @click="getValidate(formRegister.phone_num)"></div>
            </div>
          </Input>
        </Form-item>
      </transition>
      <Form-item prop="validate_code">
        <Input
        v-model="formRegister.validate_code"
        placeholder="请输入短信验证码"
        :maxlength="6"
        size="large">
        <div slot="prepend">
          <img src="~assets/img/icon_message_selected.png" alt="">
        </div>
        <div slot="append">
          <div class="count-down">
            <Button
            @click.native="countDown(formRegister)"
            :disabled="start">{{start ? `${time}&nbsp;s` : '获取'}}</Button>
          </div>
        </div>
        </Input>
      </Form-item>
      <Form-item prop="password">
        <Input
        v-model="formRegister.password"
        placeholder="请设置您的密码"
        :type="isShow ? 'password' : 'text'"
        :maxlength="16"
        size="large">
        <div slot="prepend">
          <img src="~assets/img/icon_password_selected.png" alt="">
        </div>
        <div slot="append">
          <img src="~assets/img/icon_eyes_clo.png" alt="" @click="isShow = !isShow" v-if="isShow">
          <img src="~assets/img/icon_eyes_op.png" alt="" @click="isShow = !isShow" v-else>
        </div>
        </Input>
      </Form-item>
      <Form-item prop="userName">
        <Input
        v-model="formRegister.userName"
        placeholder="请输入用户名"
        :maxlength="16"
        size="large"
        @on-blur="isRegisterUserName(formRegister.userName)">
        <div slot="prepend">
          <img src="~assets/img/icon_username_unselected.png" alt="">
        </div>
        </Input>
      </Form-item>
    </Form>
    <div>
      <p v-show="false">这是一个错误提示！</p>
    </div>
    <div class="register-protocol-wrapper">
      <div class="register-protocol">
        <Checkbox v-model="single"><a @click.prevent="goPro">《亿宝贷注册协议》</a></Checkbox>
      </div>
      <router-link to="/resetPwd">忘记密码？</router-link>
    </div>
    <div class="confirm-btn">
      <Button type="warning" long @click.native="goRegister('formRegister')">立即注册</Button>
    </div>
    <div class="font-size-16px" style="margin:20px 0">
      <span>已有账户？</span>
      <a style="color:#FF8001" @click="$router.push('/login')">立即登陆</a>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      let passwordValid = (rule,value,callback) => {
        !!value.replace(/\s+/g, "") || callback(new Error("密码不能为空！"))
        if(!/(?:\d.*_)|(?:_.*\d)|(?:[A-Za-z].*_)|(?:_.*[A-Za-z])|(?:[A-Za-z].*\d)|(?:\d.*[A-Za-z])/.test(value)){
          callback(new Error("请输入6~16位字符，至少包括数字、字母、下划线中的两种（区分大小写）"))
        }else{
          callback()
        }
      }
      let phoneValid = (rule,value,callback) => {
        !!value.replace(/\s+/g,"") || callback(new Error('手机账号不能为空！'))
        if(!/^1\d{10}/.test(value)){
          callback(new Error("手机号格式不正确！"))
        }else{
          callback()
        }
      }
      return {
        single: false,
        time:60,
        start:false,
        isShow:true,
        isValid:false,
        formRegister: {
          phone_num:'',
          validate_code:'',
          photoValidateCode:'',
          password:'',
          userName:'',
          userType:'2'
        },
        ruleValidate:{
          phone_num:[
            {validator:phoneValid, trigger: 'blur' },
          ],
          validate_code:[
            { required: true, message: '短信验证码不能为空', trigger: 'blur' }
          ],
          photoValidateCode:[
            { required: true, message: '图形验证码不能为空', trigger: 'blur' }
          ],
          password:[
            { validator:passwordValid, trigger: 'blur' }
          ],
          userName:[
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    metaInfo:{
      title:"注册"
    },
    methods: {
      goPro(e){
        window.open('static/html/webProtocol.html')
      },
      getValidate(phone_num){
        this.$nextTick(()=> {
          let picCodeDom = document.getElementById('validate-photo')
          picCodeDom.style.background = `url(${BASEURL}kaptcha/getRegisterKaptcha?phone_num=${phone_num}&v=${Math.random()}) no-repeat center`
          picCodeDom.style.backgroundSize = '100% 100%'
        })
      },
      isRegisterPhone(phone_num){
        if(phone_num.replace(/\s+/g,'')){
          this.isValid = true
          this.getValidate(phone_num)
          this.$post('user/getstatusByname',{phone_num}).then(()=>{
            this.$Notice.warning({
              title:'手机号码已存在，请登陆'
            })
          }).catch(({msg})=> console.log(msg))
        }
      },
      isRegisterUserName(userName){
        if(userName.replace(/\s+/g,'')){
          this.$post('user/getStatusByUserName',{userName}).then(() => {
            this.$Notice.warning({
              title:'用户名已存在，请登陆'
            })
          }).catch(({msg})=> console.log(msg))
        }
      },
      sendMsg(phone_num){
        this.$post('sms/requestValidateCode',{
          phone_num,type:'1',operationType:'1'
        }).then(()=>{
          this.$Message.success('短信验证码已发送！')
        }).catch(({msg}) =>{
          this.$Message.error(msg)
        })
      },
      goRegister(form){
        this.$refs[form].validate(valid => {
          if(!this.single){
            this.$Notice.warning({
              title:'请勾选注册协议'
            })
            return
          }
          valid && this.$post('user/register',this.formRegister).then(({model}) => {
            sessionStorage.setItem('user_id',model.id)
            sessionStorage.setItem('phone_num',this.formRegister.phone_num)
            sessionStorage.setItem('status',0)
            this.$Message.success({
              content:'注册成功！',
              onClose:()=>{
                this.$router.push('/enterpriseAuth')
              }
            })
          }).catch(({msg}) => {
            this.$Message.error(msg)
            // this.$refs[form].resetFields()
          })
        })
      },
      countDown(formRegister){
        if(!formRegister.photoValidateCode.replace(/\s+/g,'')){
          return
        }
        this.start = !this.start
        this.sendMsg(formRegister.phone_num)
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

<style lang="less">
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
  #validate-photo{
    width: 80px;
    height: 34px;
    background-size: cover;
  }
  .register-protocol-wrapper {
    display: flex;
    justify-content: space-around;
    margin: 20px 0;
    a {
      color: #fff;
      font-size: 14px;
    }
    .register-protocol {
      .ivu-checkbox-inner {
        background-color: transparent;
      }
      .ivu-checkbox-checked .ivu-checkbox-inner {
        background-color: transparent;
        border-color: #fff;
      }
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>
