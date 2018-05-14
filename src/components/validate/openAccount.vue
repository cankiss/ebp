<template>
  <div class="open-account-wrapper">
    <div class="open-account-header">
      <p class="font-size-18">存管银行绑卡开户</p>
      <p class="font-size-14" style="color:#5C8BF6">亿宝贷 | 厦门国际银行</p>
    </div>
    <div class="open-account-info">
      <Form :model="formItem" :rules="ruleValidate" :label-width="160" label-position="left">
        <Form-item label="银行卡类型">
          <Input value="对公客户" size="large" :readonly="true"></Input>
        </Form-item>
        <Form-item label="组织机构代码：">
          <Input v-model="formItem.orgNo" size="large" :readonly="true"></Input>
        </Form-item>
        <Form-item label="对公银行户名：">
          <Input v-model="formItem.acctName" size="large" placeholder="请填写对公银行户名" :maxlength="20" :readonly="!isCheck"></Input>
        </Form-item>
        <Form-item label="对公账户所在省份：">
          <Select v-model="formItem.province" placeholder="请选择" style="width:200px" v-if="isCheck">
            <Option v-for="(item,index) in provinceList" :value="item" :key="index">{{item}}</Option>
          </Select>
          <select class="select-style" v-else>
            <option selected>{{formItem.province}}</option>
          </select>
        </Form-item>
        <Form-item label="对公账户所属银行：">
          <Select v-model="formItem.bankCode" placeholder="请选择" style="width:200px" v-if="isCheck">
            <Option v-for="(item,index) in bankList" :value="item.bankCode" :key="index">{{ item.bankName }}</Option>
          </Select>
          <select class="select-style" v-else>
            <option selected>{{formItem.bankCode}}</option>
          </select>
        </Form-item>
        <Form-item label="对公银行卡号：">
          <Input v-model="formItem.bankcardNo" size="large" placeholder="对公银行卡号" :maxlength="20" :readonly="!isCheck"></Input>
        </Form-item>
        <template v-if="isCheck">
          <Form-item label="交易密码设置：" prop="transactionPassword" v-if="isPassword === 2">
            <Input v-model="formItem.transactionPassword" :type="isShow ? 'password' : 'text'"
            size="large" placeholder="请设置您的交易密码" :maxlength="6">
              <div slot="append">
                <img src="~assets/img/icon_eyes_clo.png" alt="" @click="isShow = !isShow" v-if="isShow">
                <img src="~assets/img/icon_eyes_op.png" alt="" @click="isShow = !isShow" v-else>
              </div>
            </Input>
          </Form-item>
          <div class="confirm-btn">
            <Button type="warning" long @click.native="applyBindCard('formBindCard')" :loading="isLoading">提交银行绑卡</Button>
          </div>
        </template>
        <div v-else>
          <Form-item label="绑卡状态：">
            <span class="font-size-14" style="color:#657180">审核中</span>
          </Form-item>
          <Form-item label="绑卡提交时间：">
            <span class="font-size-14" style="color:#657180">{{createTime | creatTime}}</span>
          </Form-item>
        </div>
      </Form>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data(){
    let payPwdValid = (rule, value, callback) => {
      !!value.replace(/\s+/g, "") ||
      callback(new Error("交易密码不能为空"));
      if (!/\d{6}/.test(value)) {
        callback(new Error("交易密码格式不正确"));
      } else {
        callback();
      }
    };
    return {
      formItem:{
        orgNo:'',
        acctName:'',
        province:'',
        bankName:'',
        bankCode:'',
        bankcardNo:'',
        transactionPassword:''
      },
      bankList:[],
      provinceList:[],
      createTime:'',
      isShow:true,
      isCheck:true,
      ruleValidate:{
        transactionPassword:[
          {validator:payPwdValid,trigger: 'blur' }
        ]
      }
    }
  },
  props:['isLianlianUser','isPassword','status'],
  computed:{
    ...mapState({
      isLoading:state => state.buttonLoading.isLoading
    })
  },
  metaInfo:{
    title:"存管银行绑卡开户"
  },
  methods:{
    applyBindCard(form){
      this.bankList.forEach(item => {
        if(this.formItem.bankCode === item.bankCode){
          this.formItem.bankName = item.bankName
        }
      })
      this.isPassword === 1 && delete this.formItem.transactionPassword // when oldUser has payPwd delete key
      Object.values(this.formItem).every(_ => !!_) ?
        this.$mine('deposit/bindCard',this.formItem).then(() => {
          this.$Modal.success({
            content: '申请绑卡成功！',
            onOk:()=>{
              this.$router.go(0)
            }
          });
        }).catch(({msg}) => this.$Message.error(msg))
        :this.$Message.warning('请填写完整！')
    },
    checkIng(model){
      this.isCheck = !this.isCheck
      this.formItem.acctName = model.toAccName
      this.formItem.province = model.toProName
      this.formItem.bankCode = model.toBankName
      this.formItem.bankcardNo = model.toAccNo
      this.createTime = model.timeOfApplication
    },
    _ajax(){
      return new Promise((resolve,reject)=>{
        this.$mine('deposit/selectApplyCardByUserId').then(({model}) => {
          resolve(model)
        }).catch(({msg}) => {
          let status = this.status
          reject({msg,status})
        })
      })
    },
    oldUserShow(){
      this.$mine('deposit/selectLLPayUserCardByUserId').then(({model}) => {
        this.formItem.orgNo = model.idCard
        this.formItem.acctName = model.userName
        this.formItem.bankCode = model.bankCode
        this.formItem.bankName = model.bankName
        this.formItem.bankcardNo = model.bankCard
      }).catch(({msg}) => this.$Message.error(msg))
    },
    provinceArr(){
      let province = '北京，天津，上海，重庆 ，辽宁，吉林，黑龙江，河北，山西，陕西，山东，安徽，江苏，浙江，河南，湖北，湖南，江西，台湾，福建，云南，海南，四川，贵州，广东，甘肃，青海，西藏，新疆，广西，内蒙古，宁夏'
      this.provinceList = province.split('，')
    }
  },
  created(){
    this._ajax().then(model => { this.checkIng(model) }).catch(({msg,status}) => {
      this.isLianlianUser <= 1 && this.oldUserShow()
      status === 4 && this.$router.replace('applyForLoan')
      this.provinceArr()
      this.$post('deposit/supportBankList').then(({model})=>{
        this.bankList = model
      })
    })
    this.$mine('borrowMoney/selectAllEnterpriseInfo').then(({model})=>{
      this.formItem.orgNo = model.orgNo
    })
  }
}
</script>
<style>
  .ivu-form .ivu-form-item-label{
    font-size: 14px;
  }
  .open-account-wrapper .ivu-input-group-append{
    background-color: #fff;
  }
  .ivu-select-single .ivu-select-selection .ivu-select-placeholder,
  .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
    font-size: 14px
  }
</style>

<style lang="less" scoped>
.open-account-wrapper{
  background: #fff;
  padding: 20px 40px 126px;
  border-radius: 4px;
  margin-bottom:70px;
  .open-account-header{
    display: flex;
    justify-content: space-between;
  }
  .open-account-info{
    width: 45%;
    margin-top: 20px;
    .select-style{
      width: 200px;
      height: 30px;
      font-size: 14px;
      border-radius: 4px;
      border-color: #d7dde4;
      color: #657180;
    }
    .confirm-btn{
      margin-top: 40px;
      .ivu-btn{
        font-size: 14px;
      }
    }
  }
}
</style>

