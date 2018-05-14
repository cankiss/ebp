<template>
  <div class="return-page-wrapper">
    <div class="return-page-header">
      <p class="font-size-18">我的借款申请</p>
    </div>
    <div class="return-page-container" v-if="loanDetail">
      <div>
        <span>借款用途：</span>
        <span>{{loanDetail.borrowUse}}</span>
      </div>
      <div>
        <span>借款期限：</span>
        <span>{{`${loanDetail.duration}个月`}}</span>
      </div>
      <div>
        <span>借款金额：</span>
        <span>{{loanDetail.borrowAmount}}</span>
      </div>
      <div>
        <span>还款方式：</span>
        <span>一次性还本付息</span>
      </div>
      <div>
        <span>渠道来源：</span>
        <span>13</span>
      </div>
      <div>
        <span>借款提交时间：</span>
        <span>{{loanDetail.createTime}}</span>
      </div>
      <div>
        <span>借款状态：</span>
        <span>审核中</span>
      </div>
      <div>
        <span>借款编号：</span>
        <span>{{borrowNid}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      borrowNid:null,
      loanDetail:null,
      time:5
    }
  },
  methods:{
    _ajax(){
      return new Promise((resolve,reject)=> {
        this.$post('borrow/loan/apply/agreementSigned',{borrowNid:this.borrowNid}).then(({model})=>{
          model ? resolve() : reject()
        })
      })
    }
  },
  metaInfo:{
    title:"我的借款申请"
  },
  created(){
    this.borrowNid = this.$route.query.borrowNid
    if(this.borrowNid){
      this.$store.commit('updataIsChecked',{isChecked:true})
      this._ajax().then(()=>{
        this.$post('borrow/findBorrowByBorrowNid',{borrowNid:this.borrowNid}).then(({model})=>{
          this.loanDetail = model
          setInterval(()=>{
            --this.time === 0 && this.$post('borrow/loan/apply/pushAudit',{borrowNid:this.borrowNid})
            .then(({msg})=>Promise.reject(msg)).catch(msg => this.$router.replace('/mine'))
          },1000)
        })
      }).catch(()=>{
        this.$store.commit('updataIsChecked',{isChecked:false})
        this.$Modal.warning({
          content: '您的借款申请提交失败，请重新提交！',
          onOk:() => {
            this.$router.replace('applyForLoan')
          }
        });
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .return-page-wrapper{
    background: #fff;
    padding: 20px 40px;
    border-radius: 4px;
    margin-bottom:20px;
    height: 460px;
    .return-page-container{
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-top: 20px;
      div{
        flex-basis: 50%;
        padding: 20px;
        span:nth-of-type(1){
          display: inline-block;
          width: 120px;
          padding: 0 10px;
          color: #666;
        }
        span:nth-of-type(2){
          margin-left: 20px;
        }
      }
    }
  }
</style>

