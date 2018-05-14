<template>
  <div class="apply-for-loan-wrapper">
    <p class="font-size-18">填写借款</p>
    <div class="apply-for-info">
      <Form :model="formItem" ref="formValidate" :rules="rulesLoan" :label-width="160" label-position="left">
        <Form-item label="借款用途：" prop="borrowUse">
          <Input v-model="formItem.borrowUse" placeholder="请填写借款用途" size="large" ></Input>
        </Form-item>
        <Form-item label="借款金额：" prop="borrowAmount">
          <Input v-model="formItem.borrowAmount" placeholder="请填写借款金额" :maxlength="7" size="large" ></Input>
          <p class="font-666 font-size-12">金额不超过100万元，且为100的整数倍，不能少于10000元</p>
        </Form-item>
        <Form-item label="借款期限：">
          <Select :v-model="formItem.duration | durationMon" @on-change="select" style="width:200px">
            <Option v-for="(item,index) in durationArr" :value="item.productId" :key="index">{{ item.duration | durationMon}}</Option>
          </Select>
        </Form-item>
        <Form-item label="借款年利率：">
          <select class="select-style">
            <option v-model="formItem.rate" selected>{{formItem.rate | precent}}</option>
          </select>
        </Form-item>
        <Form-item label="还款方式：">
          <select class="select-style">
            <option v-model="formItem.repaymentType" v-if="product" selected>{{product.repaymentTypeVal}}</option>
          </select>
        </Form-item>
        <Form-item label="渠道来源：">
          <Input v-model="formItem.orderSource" size="large" readonly></Input>
        </Form-item>
        <div class="enterprise-protocol">
          <Checkbox v-model="single"><a @click.prevent="goPro">《 借款企业服务协议 》</a></Checkbox>
        </div>
        <div class="confirm-btn">
          <Button type="warning" long @click.native="applyForLoan('formValidate')">提交借款申请</Button>
        </div>
      </Form>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    const amountAuth = (rule,value,callback) => {
      (value < 10e3 || value > 10e5) && callback(new Error('借款金额有误！'))
      value % 100 != 0 && callback(new Error('100元整数倍！'))
      callback()
    }
    return {
      formItem:{
        borrowUse:'',
        borrowAmount:'',
        duration:'',
        durationType:'3',
        rate:'',
        repaymentType:'',
        orderSource:'',
        productId:''
      },
      rulesLoan:{
        borrowUse:[
          {required: true, message: '借款用途不能为空', trigger: 'blur'}
        ],
        borrowAmount:[
          {required: true,validator:amountAuth,trigger:'change'}
        ]
      },
      product:null,
      single:false,
      durationArr:[],
      info:{
        '2000':'借款申请异常',
        '2001':'企业产品不存在',
        '2002':'您有借款申请尚未结清，请结清后再提交！',
        '2003':'当前不能重复提交借款申请！',
        '2004':'企业信息不存在！',
        '2012':'您的借款已提交，请在“个人中心-我的借款” 中提交并签署协议！',
        '2013':'您有借款正在签署协议，勿重复提交！',
        '2015':'您有借款正在审核中，勿重复提交！'
      }
    }
  },
  methods:{
    goPro(){
      window.open('static/html/borrowerServiceProtocol.html')
    },
    select(value){
      this.$http.get(`borrow/loan/product/byProductId?productId=${value}`).then(({model})=>{
        this.product = model
        this.formItem.rate = model.rate
        this.formItem.repaymentType = model.repaymentType
        this.formItem.orderSource = model.productSource
        this.formItem.productId = model.productId
        this.formItem.duration = model.duration
      })
    },
    applyForLoan(form){
      this.$refs[form].validate(valid => {
        if(valid){
          if(!this.single){
            this.$Message.warning('请勾选企业借款协议')
            return
          }
          this.$mine('borrow/loan/apply',this.formItem).then(({model}) => {
            this.$Modal.warning({
              content: '借款提交之前，请先签署借款企业服务协议',
              okText:'去签署',
              onOk:()=>{
                this.signFadada(model.borrowNid)
              }
            });
          }).catch(({msg,code}) => {
            this.$Modal.warning({
              content:this.info[code] || msg,
              onOk:() => {
                this.$router.push('/mine/loan')
              }
            })
          })
        }
      })
    },
    signFadada(borrowNid){
      let {origin,pathname} = location
      this.$post(FAURL,{
        accountId:sessionStorage.getItem('user_id'),
        borrowNid,
        returnUrl:`${origin}${pathname}#/enterpriseAuth/returnPage?borrowNid=${borrowNid}`
      }).then(({model})=>{
        location.href = model.resulturl
      }).catch(({msg})=>{
        this.$Modal.warning({
          content:msg,
          onOk:()=>{
            this.$router.push('/mine/loan')
          }
        })
      })
    }
  },
  created(){
    this.$http.get('borrow/loan/product/byProductSource?productSourceId=13').then(({model})=>{
      this.durationArr = model
    })
  },
  filters:{
    precent(value){
      return !!value ? `${value}%` : ''
    },
    durationMon(value){
      return !!value ? `${value}个月` : ''
    }
  },
  metaInfo:{
    title:"企业借款申请"
  }
}
</script>
<style>
  .ivu-form .ivu-form-item-label{
    font-size: 14px;
  }
</style>

<style lang="less" scoped>
  .apply-for-loan-wrapper{
    background: #fff;
    padding: 20px 40px;
    border-radius: 4px;
    margin-bottom:100px;
    .apply-for-info{
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
        margin-left: 160px;
        margin-top: 40px;
      .ivu-btn{
        font-size: 14px;
      }
    }
    }
  }
</style>
