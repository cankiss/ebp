<template>
	<!--去还款弹窗-->
	<div>
		<!--弹窗-->
		<Modal title="还款操作" v-model="modal9" class-name="vertical-center-modal">
			<ul class="repayment">
				<li>账户余额：<span>{{ specMssage.availableCredit }}元</span></li>
				<li>
					当期应还：
					<span>
						{{ specMssage.repayment }}元
						<div class="periodsDetail">
							<div class="detailChildren"><em>应还期数：</em>第{{ specMssage.periods }}期</div>
							<div class="detailChildren"><em>应还日期：</em>{{specMssage.recoverTime}}</div>
							<div class="detailChildren"><em>应还本金：</em>{{specMssage.receiveCapitalWait}}元</div>
							<div class="detailChildren"><em>应还利息：</em>{{specMssage.interestReceiveWait}}元</div>
							<div class="detailChildren"><em>应还服务费：</em>{{specMssage.borrowFeeWait}}元</div>
							<div class="detailChildren"><em>应还罚息：</em>{{specMssage.overdueFee}}元</div>
						</div>
					</span>
				</li>
				<li>还款余额：<span><input type="text" :value="specMssage.repayment + '元'" disabled /></span></li>
				<li>交易密码：<span>
					<input :type="iptType" maxlength="6" placeholder="请输入交易密码" v-model="payPassword" />
					<img src="~/assets/img/icon_eyes_clo.png" v-if="openEyes" @click="openEye" />
					<img src="~/assets/img/icon_eyes_op.png" v-else @click="openEye" />
				</span>
				</li>
				<li class="falseHints" v-if="falseHints">{{ falseText }}</li>
			</ul>
			<div slot="footer" class="borrow"><Button @click.native="repayment" :loading="isLoading">确认还款</Button></div>
		</Modal>
	</div>
</template>

<script>
	import { mapState } from "vuex";
	export default {
		data() {
			return {
				openEyes: true, //是否显示密码
				modal9: false, //是否显示弹窗
				iptType: "password", //输入框的type属性
				falseHints: false, //错误提示框
				falseText: "", //错误提示内容
				payPassword: "",//交易密码
				specMssage:{}//弹窗内容
			}
		},
		methods: {
			openEye() {
				this.openEyes = !this.openEyes;
				this.openEyes ? this.iptType = "password" : this.iptType = "text";
			},
			repayment() {
				if(this.specMssage.availableCredit < this.specMssage.repayment) {
          this.falseHints = true;
          this.falseText = '余额不足，请前去充值!';
					setTimeout(() => {
						this.$router.push("/recharge/credit");
					}, 5000);
					return;
				};
				if(!this.payPassword) {
					this.falseHints = true;
					this.falseText = "请输入交易密码";
					return;
				};
				let data = {
					payPassWord: this.payPassword
				};
				this.$mine("deposit/validatePayPassword", data).then(res => {
					console.log(res);
					this.borrowMent();
				}).catch(res => {
					this.falseHints = true;
					this.falseText = res.msg;
				});
			},
			borrowMent() {
				let data = {
					borrowNid: this.specMssage.borrowNid,
					repaymentAmount: this.specMssage.repayment,
					repaymentType: this.specMssage.repaymentType
				};
				this.$mine("borrow/repayment", data).then(res => {
					console.log(res);
					this.$Message.success("还款成功");
					this.modal9 = false;
					this.$router.go(0);
				}).catch(res => {
					this.falseHints = true;
					this.falseText = res.msg;
				});
			}
		},
		computed: {
	        ...mapState({
	            isLoading: state => state.buttonLoading.isLoading
	        })
	    }
	}
</script>

<style>
	@import "../../../assets/css/mine.css";
</style>
