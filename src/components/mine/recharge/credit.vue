<template>
  <div>
    <ul>
      <li>
        <span>账户余额：</span>
        <div class="formRight">{{ blance.availableCredit || 0 }}元</div>
      </li>
      <li>
        <span>充值金额：</span>
        <div class="formRight">
          <input type="text" placeholder="请输入充值金额" v-model="rechargeAmount">
        </div>
      </li>
      <li>
        <span>银行卡：</span>
        <div class="formRight">
          <div class="bankCard">
            <p class="bankTitle">
              <img :src="bankInfo.appLogo" alt="">
              <i class="bankName">{{ bankInfo.bankName }}</i>
              <i class="account" v-if="bankInfo.userType == 'ORGANIZATION'">对公账户</i>
              <i class="account" v-else>个人账户</i>
            </p>
            <p class="compoanyName">{{ bankInfo.userName }}</p>
            <p class="cardNumber">{{ bankInfo.bankCard }}</p>
          </div>
          <div class="falseHints" v-if="isWrong">
            <img src="~/assets/img/icon_warning.png" alt="">
            <i>{{ wrongText }}</i>
          </div>
          <button @click="sureRecharge">确认充值</button>
        </div>
      </li>
    </ul>
    <div class="prompt">
      <p>温馨提示</p>
      <p>1、如果您要加快提现速度，请在每日上午提现。亿宝贷周一到周五的提现处理时间在下午2点之后，周末在下午或者晚上。</p>
      <p>2、在法定节日期间，用户申请提现，安排支付时间，幸福钱庄会以公告形式发布</p>
      <p>3、尊敬的用户，提现操作涉及您的资金变动，请仔细核对您的提现信息;</p>
      <p>4、涉及到您的资金安全，请仔细操作;</p>
      <p>5、提现需要向第三方支付平台支付相应的手续费。提现费用2元，单笔限额200万。</p>
    </div>
    <modal :modalTital="tital" ref="diragle"></modal>
    <!--充值确认弹窗-->
    <div ref="sureCredit" class="sureCredit"></div>
  </div>
</template>
<script>
  import modal from "./modal.vue";
  export default {
    data() {
      return {
        isWrong: false, //是否显示错误提示
        wrongText: "", //错误提示信息
        rechargeAmount: "", //充值金额
        bankInfo: {}, //银行卡信息
        blance: {}, //可用余额
        tital: {
          tost: "充值提示",
          img: true,
          content: "请您在新打开的页面上完成账户充值<br/>充值未完成请不要关闭此页面<br/>充值成功后请根据您的情况点击下面的按钮",
          btn: "完成充值"
        }
      }
    },
    created() {
      this.getBankInfo()
    },
    mounted() {
      this.getType()
    },
    methods: {
      getType() {
        let type = this.$route.query;
        if (type.credit && type.credit == "1") {
          this.$refs.diragle.modal9 = true;
        }
      },
      sureRecharge() { //调用充值接口
        let temp = /^([0-9]*)+(.[0-9]{1,2})?$/;
        if (this.rechargeAmount && temp.test(this.rechargeAmount) && this.rechargeAmount != 0) {
          let data = {
            amount: this.rechargeAmount,
            returnUrl: location.href + "?credit=1"
          };
          this.$mine("deposit/E-BankTopUp", data).then(res => {
            console.log(res);
            this.$refs.diragle.modal9 = true;
            let html = res.model.html;
            document.querySelector(".sureCredit").innerHTML = html;
            let iptsubmit = document.querySelector(".sureCredit").children[0];
            iptsubmit.submit();
          }).catch(res => {
            console.log(res);
            this.$Message.error(res.msg);
          });
        } else {
          /*this.$Notice.error({
                      	title: '错误提示',
                      	desc: '请输入充值金额'
                  	});*/
          this.wrongText = "请输入正确的充值金额";
          this.isWrong = true;
        }
      },
      getBankInfo() { //获取银行卡信息
        this.$mine("deposit/selectRealUserCardByUserId").then(res => {
          console.log(res);
          this.bankInfo = res.model;
        }).catch(res => {
          console.log(res);
          /*this.$Notice.error({
                      	title: '错误提示',
                      	desc: res.msg
                  	});*/
          this.wrongText = res.msg;
          this.isWrong = true;
        });
        this.$mine("deposit/selectUserAccountByUserId").then(res => {
          console.log(res);
          this.blance = res.model;
        }).catch(res => {
          console.log(res);
        })
      }
    },
    components: {
      modal
    },
    metaInfo: {
      title: "企业网银充值"
    }
  }
</script>
<style scoped>
  .sureCredit {
    display: none;
  }
</style>
