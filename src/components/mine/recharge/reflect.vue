<template>
<div>
    <ul>
        <li>
            <span>账户余额：</span>
            <div class="formRight">{{ blance.availableCredit || 0 }}元</div>
        </li>
        <li>
            <span>提现金额：</span>
            <div class="formRight"><input type="text" placeholder="请输入提现金额" v-model="amountCash"></div>
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
            </div>
        </li>
        <li>
            <span>预留手机号：</span>
            <div class="formRight">{{ bankInfo.mobile }}</div>
        </li>
        <li>
            <span>短信验证码：</span>
            <div class="formRight">
                <div class="smsInfo">
                    <input type="text" maxlength="6" placeholder="请输短信验证码" class="smsCode" v-model="smsCode">
                    <span class="smsCodeBtn" ref="smsCodeBtn" @click="getSmsCode">获取</span>
                </div>
                <div class="falseHints" v-if="isWrong">
                    <img src="~/assets/img/icon_warning.png" alt="">
                    <i>{{ wrongText }}</i>
                </div>
                <button @click="sureWithdrawals">确认提现</button>
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
    <modal :modalTital="title" ref="diragle"></modal>
</div>
</template>
<script>
	import modal from "./modal.vue";
	export default{
		data(){
			return{
				bankInfo:{},//银行卡信息
				blance:{},//账户余额
				isWrong:false,//是否显示错误提示
                wrongText:"",//错误提示信息
                amountCash:"",//提现金额
                smsCode:"",//短信验证码
				title:{
					tost:"提现成功",
					img:false,
					content:"恭喜，提现成功！资金预计在1~3个工作日到账！<br/>到账银行卡：<b>6222*******0489</b>",
					btn:"完成提现"
				},
				smsBtn:true
			}
		},
		created(){
			this.getBankInfo()
		},
		methods:{
			sureWithdrawals(){//调用提现接口let temp = /^([0-9]*)+(.[0-9]{1,2})?$/;
				let temp = /^([0-9]*)+(.[0-9]{1,2})?$/;
				if(this.amountCash == "" || !temp.test(this.amountCash) || this.amountCash == 0){
					this.wrongText = "请输入正确的提现金额";
					this.isWrong = true;
					return;
				}else if(this.amountCash > 10e5){
					this.wrongText = "提现金额不得大于100万";
					this.isWrong = true;
					return;
				}else if(this.amountCash > this.blance.availableCredit){
					this.wrongText = "提现金额不能超过账户余额";
					this.isWrong = true;
					return;
				};
				let codeText = this.smsCode.replace(/\D/g,'');
				console.log(codeText);
				if(!codeText){
					this.wrongText = "请输入正确的验证码";
					this.isWrong = true;
					return;
				};
				let data = {
					smsCode:codeText,
					amount:this.amountCash
				};
				this.$mine("deposit/withdrawDeposit",data).then(res=>{
					console.log(res);
					this.$refs.diragle.modal9 = true;
				}).catch(res=>{
					console.log(res);
					this.wrongText = res.msg;
					this.isWrong = true;
				});
			},
			getBankInfo(){//获取银行卡信息，账户余额接口
				this.$mine("deposit/selectRealUserCardByUserId").then(res=>{
					console.log(res);
					this.bankInfo = res.model;
					this.title.content = "恭喜，提现成功！资金预计在1~3个工作日到账！<br/>到账银行卡：<b>" + this.bankInfo.bankCard + "</b>"
				}).catch(res=>{
					console.log(res);
					this.wrongText = res.msg;
					this.isWrong = true;
				});
				this.$mine("deposit/selectUserAccountByUserId").then(res=>{
					console.log(res);
					this.blance = res.model;
				}).catch(res=>{
					console.log(res);
				})
			},
			getSmsCode(){//获取短信验证码接口
				if(this.smsBtn){
					this.$mine("deposit/payApply").then(res=>{
						console.log(res);
						this.smsBtn = false;
						let code = 60;
						let _this = this;
						let smsCodeBtn = document.querySelector(".smsCodeBtn");
						smsCodeBtn.innerHTML = code + "s";
						let timer = setInterval(()=>{
							code --;
							if(code < 0){
								smsCodeBtn.innerHTML = "重新获取";
								clearInterval(timer);
								_this.smsBtn = true;
							}else{
								smsCodeBtn.innerHTML = code + "s";
							};
						},1000);
					}).catch(res=>{
						this.wrongText = res.msg;
						this.isWrong = true;
					})
				}
			}
		},
		components:{
			modal
    },
    metaInfo:{
      title:"企业网银提现"
    }
	}
</script>
<style scoped>
</style>
