<template>
	<div class="recharge">
		<ul class="ivu-row">
			<li>
				<span class="red">{{ userMessige.totalAmount || 0 }}元</span>
				<p class="totalAccount">
					账户总额
					<span class="mark">
          				<img src="~/assets/img/promise.jpg" alt="" />
          				<span class="markArrow">账户总额=可用金额+冻结金额</span>
					</span>
				</p>
			</li>
			<li>
				<p><span class="descTitle">本月待还</span><span class="blue">{{ userMessige.repayment || 0 }}</span>元</p>
				<p><span class="descTitle">累计待还</span><span class="blue">{{ userMessige.repaymentAll || 0 }}</span>元</p>
			</li>
			<li>
				<p><span class="descTitle">可用金额</span><span class="blue">{{ userMessige.availableCredit || 0 }}</span>元</p>
				<p><span class="descTitle">冻结金额</span><span class="blue">{{ userMessige.frozenAmount || 0 }}</span>元</p>
			</li>
			<li v-if="status == 0 || status == 1 || status ==2">
				<router-link to="/enterpriseAuth" class="red">充 值</router-link>
				<router-link to="/enterpriseAuth" class="blue">提 现</router-link>
			</li>
			<li v-else-if="status == 3 || bankCard">
				<router-link to="/enterpriseAuth/openAccount" class="red">充 值</router-link>
				<router-link to="/enterpriseAuth/openAccount" class="blue">提 现</router-link>
			</li>
			<li v-else="status == 4">
				<router-link to="/recharge" class="red">充 值</router-link>
				<router-link to="/recharge/reflect" class="blue">提 现</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
    props:['status'],
		data() {
			return {
				userMessige: {},
				bankCard: false
			}
		}
	}
</script>

<style scoped>
	.recharge {
		padding-top: 10px;
	}

	.recharge .totalAccount {
		position: relative;
	}

	.recharge .mark {
		position: absolute;
		width: 16px;
		height: 16px;
		top: 50%;
		margin-top: -8px;
		right: 50%;
		margin-right: -48px;
	}

	.recharge .mark img {
		width: 16px;
	}

	.recharge .mark:hover .markArrow {
		display: block;
	}

	.recharge .mark .markArrow {
		position: absolute;
		width: 200px;
		padding: 5px;
		border: solid 1px #ccc;
		bottom: -45px;
		left: -30px;
		z-index: 99;
		background: #fff;
		display: none;
	}

	.recharge .mark .markArrow:before,
	.recharge .mark .markArrow:after {
		content: "";
		position: absolute;
		width: 0;
		height: 0;
		border: solid 10px transparent;
		left: 26px;
	}

	.recharge .mark .markArrow:before {
		border-bottom-color: #ccc;
		top: -20px;
	}

	.recharge .mark .markArrow:after {
		border-bottom-color: #fff;
		top: -19px;
	}

	.ivu-row {
		padding: 24px 0;
		background: #fff;
	}

	.ivu-row li {
		float: left;
		height: 42px;
		padding: 0 28px;
		border-right: 1px solid #DBDADA;
		text-align: center;
		color: #000;
	}

	.ivu-row li:last-child {
		border-right: 0;
		padding: 8px 0 0;
		height: 34px;
	}

	.ivu-row li span.red {
		font-size: 18px;
		color: #FF8001;
	}

	.ivu-row li span.blue {
		color: #0D88EB;
	}

	.ivu-row li span.descTitle {
		width: 56px;
		margin-right: 12px;
		float: left;
	}

	.ivu-row li a {
		display: inline-block;
		margin-left: 20px;
		width: 80px;
		height: 26px;
		color: #fff;
		line-height: 26px;
		border-radius: 26px;
	}

	.ivu-row li a.red {
		background: #FF8001;
	}

	.ivu-row li a.blue {
		background: #0D88EB;
	}
</style>
