<template>
	<!-- 充值 -->
	<div class="mineRecharge">
		<h4 class="mineH4">{{rechargeTitle}}</h4>
		<div class="formData">
			<router-view></router-view>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				rechargeTitle: ""
			}
		},
		created() {
			this.getTitle()
		},
		methods: {
			getTitle() {
				if(this.$route.path == "/recharge/credit" || this.$route.path == "/recharge/rechargeSuccess") {
					this.rechargeTitle = "企业网银充值";
				} else {
					this.rechargeTitle = "企业网银提现";
				}
			}
		}
	}
</script>
<style lang="less">
	@import "../../../assets/css/mine.css";
	
	.mineRecharge {
		margin: 30px 0;
		background: #fff;
	}
	
	.mineRecharge .formData {
		padding: 0 30px;
	}
	
	.formData ul {
		padding: 20px 0 88px;
		border-bottom: solid 1px #EEF1F9;
	}
	
	.formData li {
		color: #333;
		margin-bottom: 20px;
	}
	
	.formData span {
		float: left;
		width: 85px;
		line-height: 30px;
	}
	
	.formRight {
		overflow: hidden;
		line-height: 30px;
	}
	
	.formRight input {
		width: 250px;
		height: 30px;
		border: 1px solid #EEF1F9;
		border-radius: 4px;
		outline: none;
		text-indent: 10px;
	}
	
	.formRight button,
	.formRight .falseHints {
		margin-top: 20px;
		width: 250px;
		height: 30px;
		border-radius: 4px;
		border: 0;
	}
	
	.formRight button,
	.formRight .falseHints {
		color: #fff;
		background: #FF8001;
	}
	
	.formRight .falseHints {
		background: #B8DDFC;
		line-height: 30px;
		color: #FF0000;
		text-align: center;
	}
	
	.formRight .falseHints img {
		margin-right: 6px;
		vertical-align: middle;
	}
	
	.bankCard {
		width: 250px;
		height: 130px;
		padding: 10px;
		background: url(../../../assets/img/bg_bankcarduser.png);
		background-size: 100% 100%;
		color: #fff;
	}
	
	.bankCard p {
		margin-bottom: 5px;
	}
	
	.bankTitle {
		padding-bottom: 8px;
		border-bottom: solid 1px #fff;
	}
	
	.bankTitle img {
		width: 16px;
		height: 16px;
		vertical-align: middle;
	}
	
	.bankTitle i.account {
		float: right;
	}
	
	.prompt {
		margin-top: 15px;
		color: #2A2A2A;
		line-height: 26px;
		padding-bottom: 200px;
	}
	
	.formRight .smsInfo {
		height: 30px;
	}
	
	.formRight .smsCode {
		float: left;
		width: 190px;
		border-radius: 4px 0 0 4px;
	}
	
	.formRight .smsCodeBtn {
		width: 60px;
		height: 30px;
		background: #0D88EB;
		border-radius: 0 4px 4px 0;
		color: #fff;
		text-align: center;
		cursor:pointer;
	}
</style>