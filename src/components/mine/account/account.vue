<template>
	<div>
		<!--用户信息-->
		<userInfo ref="userInfo" :status="status" ></userInfo>
		<!--账户余额-->
		<recharge ref="recharge" :status="status"></recharge>
		<!--借款前准备-->
		<Row>
			<Col span="24">
			<Card dis-hover>
				<p slot="title">借款前准备</p>
				<Row>
					<Col span="9">
					<span>
                <img src="~/assets/img/icon_step01.png" alt=""><br/>
                <i>实名认证</i>
              </span>
					<img src="~/assets/img/pic_realname.png" alt="" class="bigImg">
					</Col>
					<Col span="6">
					<span>
                  <img src="~/assets/img/icon_step02.png" alt=""><br/>
                  <i>交易密码设置</i>
                </span>
					<img src="~/assets/img/pic_sec.png" alt="" class="bigImg">
					</Col>
					<Col span="9">
					<span>
                  <img src="~/assets/img/icon_step03.png" alt=""><br/>
                  <i>绑定银行卡</i>
                </span>
					<img src="~/assets/img/pic_bankcard.png" alt="" class="bigImg">
					</Col>
				</Row>
			</Card>
			</Col>
		</Row>
		<!--本月待还记录-->
		<Row class="record">
			<Col span="24">
			<Card dis-hover>
				<p slot="title">本月待还记录</p>
				<div class="mineTable">
					<Table border :columns="columns1" :data="data1" align="center" :disabled-hover="disabledHover"></Table>
				</div>
			</Card>
			</Col>
		</Row>
		<xdialog ref="diragle"></xdialog>
	</div>
</template>

<script>
	import userInfo from "./userInfo.vue";
	import recharge from "./recharge.vue";
  import xdialog from "../dialog/dialog.vue";
  import getStatus from '@/config/userStatus'
	export default {
		data() {
			return {
        status:null,
				disabledHover: true,
				columns1: [{
						title: '借款用途',
						key: 'borrowUse'
					},
					{
						title: '借款编号',
						key: 'borrowNid'
					},
					{
						title: '期数',
						key: 'periods'
					},
					{
						title: '应还日期',
						key: 'recoverTime'
					},
					{
						title: '应还总额',
						key: 'capitalWait'
					},
					{
						title: '应还本金',
						key: 'receiveCapitalWait'
					},
					{
						title: '应还利息',
						key: 'interestReceiveWait'
					},
					{
						title: '应还服务费',
						key: 'borrowFeeWait'
					},
					{
						title: '应还罚息',
						key: 'overdueFee'
					},
					{
						title: '还款状态',
						key: 'status',
						render: (h, params) => {
							return h('div', this.formatStatus(params.row.status));
						}
					},
					{
						title: '操作',
						key: 'operation',
						render: (h, params) => {
							return h('div', [
								h('Button', {
									style: {
										background: "#fff",
										border: 0,
										color: "#FF8001",
										fontSize: "14px"
									},
									on: {
										click: () => {
                      let status = this.status
                      if(status <= 3 ){
                        this.$Message.warning({
                          content:status === 2 ? '您还未实名，请前去实名！' : '您还未绑卡，请前去绑卡！',
                          onClose:() => {
                            this.$router.push(`/enterpriseAuth${status === 2 ? '/' : '/openAccount'}`)
                          }
                        })
                        return
                      }
											this.$refs.diragle.modal9 = true;
											/* if(this.data1[0].availableCredit < this.data1[0].repayment) {
                        // this.$Message.error('余额不足，请前去充值!');
                        this.$refs.diragle.falseHints = true;
                        this.$refs.diragle.falseText = '余额不足，请前去充值!';
												setTimeout(() => {
													this.$router.push("/recharge/credit");
												}, 5000);
											} */
										}
									}
								}, '我要还款')
							]);
						}
					}
				],
				data1: []
			}
		},
		created() {
			  this.getBorrowList(),
        this.getBankCardStatus(),
        this.getUserStatus()
		},
		methods: {
			getBankCardStatus() {
				this.$mine("deposit/selectApplyCardByUserId").then(res => {
					if(res.code == "200") {
						this.$refs.recharge.bankCard = true;
						this.$refs.userInfo.bankCard = true;
					};
				}).catch(res => {
					this.$refs.recharge.bankCard = false;
					this.$refs.userInfo.bankCard = false;
				})
			},
			getBorrowList() { //本月待还记录
				let data = {
					userRole: "BORROWERS"
				};
				this.$mine("userRechargeLog/selectUserCashAmount", data).then(res => {
					this.$refs.recharge.userMessige = res.model;
					if(res.model.status == 1 || res.model.status == 3 || res.model.status == 5) {
						let selectObj = res.model;
						selectObj.operation = "我要还款";
						selectObj.repaymentType = res.model.status == 1 ? "00" : "03";
						let newArr = [];
						this.$refs.diragle.specMssage = selectObj;
						newArr.push(selectObj);
						this.data1 = newArr;
					} else {
						this.data1 = [];
					};
				}).catch(res => {
					this.data1 = [];
				});
			},
			formatStatus(value) {
				// let arr = ["待还款", "正常还款", "代偿未还款", "代偿已还款", "未代偿未还款", "未代偿已还款", "提前还款"];
				let arr = ["待还款", "还款", "未还款", "已还款", "未还款", "已还款", "还款"];
				return arr[value - 1];
      },
      getUserStatus(){
        let userId = sessionStorage.getItem('user_id')
        userId && getStatus(userId).then(({status,isLianlianUser,isPassword}) => {
          this.status = status
        }).catch(msg => this.$Message.error(msg))
      }
		},
		components: {
			userInfo,
			recharge,
			xdialog
		},
		metaInfo: {
			title: "账户总览"
		}
	}
</script>

<style scoped>
	.ivu-row {
		margin-top: 10px;
	}

	.ivu-col-span-24,
	.ivu-card-bordered {
		border: 0;
		border-radius: 0;
	}

	.ivu-card-head p {
		font-size: 18px;
		font-weight: normal;
		padding-left: 14px;
	}

	.ivu-card-body .ivu-row {
		margin: 0;
		padding: 26px 0;
	}

	.ivu-col-span-9,
	.ivu-col-span-6 {
		height: 64px;
		border-right: 1px solid #DBDADA;
	}

	.ivu-col-span-9 {
		text-align: right;
	}

	.ivu-col-span-6 {
		text-align: center;
	}

	.ivu-col-span-9:last-child {
		border-right: 0;
		text-align: left;
	}

	.ivu-card-body .ivu-col span {
		display: inline-block;
		height: 100%;
		margin-right: 20px;
		text-align: center;
		padding-top: 12px;
	}

	.ivu-card-body .ivu-col span i {
		font-style: normal;
		font-size: 16px;
		color: #0D88EB;
	}

	.ivu-col-span-9 .bigImg,
	.ivu-col-span-6 .bigImg {
		float: right;
		margin-right: 28px;
		margin-top: -18px;
	}

	.ivu-col-span-9:last-child span {
		float: left;
		margin-left: 30px;
	}

	.ivu-col-span-9:last-child .bigImg {
		float: left;
	}
</style>
<style>
	@import "../../../assets/css/mine.css";
</style>
