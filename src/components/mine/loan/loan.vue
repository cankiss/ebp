<template>
	<div class="loan">
		<h4 class="mineH4">我的借款</h4>
		<div class="loanTable">
			<div class="mineTable">
				<Table border :columns="columns1" :data="data1" :disabled-hover="disabledHover"></Table>
				<Page :total="totalPages" @on-change="pageChange"></Page>
			</div>
		</div>
		<!--弹窗-->
		<xdialog ref="diragle"></xdialog>
	</div>
</template>
<script>
  import xdialog from "../dialog/dialog.vue";
  import getStatus from '@/config/userStatus'
	export default {
		data() {
			return {
				modal9: true, //是否显示弹窗
				disabledHover: true,
				currentPage: 1, //当前页数
				totalPages: 10, //总页数
        specMssage: {},
        status:null,
				columns1: [{
						title: '借款用途',
						key: 'borrowUse'
					},
					{
						title: '借款编号',
						key: 'borrowNid'
					},
					{
						title: '借款申请时间',
						key: 'createTime',
						render: (h, params) => {
							return h('div', this.formatDate(this.data1[params.index].createTime));
						}
					},
					{
						title: '借款申请金额',
						key: 'borrowAmount'
					},
					{
						title: '借款期限',
						key: 'loanTerm'
					},
					{
						title: '借款利率',
						key: 'rate',
						render: (h, params) => {
							return h('div', this.rateMoment(this.data1[params.index].rate));
						}
					},
					{
						title: '还款方式',
						key: 'repaymentTypeDesc'
					},
					{
						title: '借款状态',
						key: 'status',
						render: (h, params) => {
							let myStyle = "none";
							let btnText = "";
							let stateText = "";
							let tempArr = ["待签约", "待审核", "审核拒绝", "审核通过", "待还款", "结束", "流标","签约中"];
							let statusId = "";
							if(params.row.status == "0") {
								statusId = 0;
							} else if(params.row.status == "1") {
								statusId = 1;
							} else if(params.row.status == "3") {
								statusId = 2;
							} else if(params.row.status >= 2 && params.row.status <= 7 && params.row.status != "3") {
								statusId = 3;
							} else if(params.row.status == "8" || params.row.status == "10" || params.row.status == "12") {
								statusId = 4;
							} else if(params.row.status == "11" || params.row.status == "13") {
								statusId = 5;
							} else if(params.row.status == "9") {
								statusId = 6;
							} else if(params.row.status === "01"){
								statusId = 7;
							};
							stateText = tempArr[statusId];
							if(params.row.status == "10" || params.row.status == "12" || params.row.status == "8") {
								btnText = "去还款";
								myStyle = "inline-block";
							} else if(params.row.status == "0") {
								btnText = "去签署协议";
								myStyle = "inline-block";
							};
							return h('div', [
								h('p', {

								}, stateText),
								h('Button', {
									props: {
										type: 'primary',
										size: 'small'
									},
									style: {
										display: myStyle
									},
									on: {
										click: () => {
                      if(btnText == "去还款") { //去还款的按钮方法
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
												let data = {
													userRole: "BORROWERS"
												};
												this.$mine("userRechargeLog/selectUserAdvanceCashAmount", data).then(res => {
													let loanObj = res.model;
													let repaymentType = "00";
													if(loanObj.status == 3 || loanObj.status == 5) {
														repaymentType = "03";
													};
													loanObj.repaymentType = repaymentType;
													this.specMssage = loanObj;
													this.$refs.diragle.specMssage = loanObj;
													this.$refs.diragle.modal9 = true;
													/* if(res.model.availableCredit < res.model.repayment) {
                            // this.$Message.error('余额不足，请前去充值!');
                            this.$refs.diragle.falseHints = true;
                            this.$refs.diragle.falseText = '余额不足，请前去充值!';
														setTimeout(() => {
															this.$router.push("/recharge/credit");
														}, 5000);
													}; */
												})
											} else { //去签署协议的按钮方法
												let prowId = {
													accountId: sessionStorage.getItem("user_id"),
													borrowNid: params.row.borrowNid,
													returnUrl: `${location.origin}${location.pathname}#/enterpriseAuth/returnPage?borrowNid=${params.row.borrowNid}`
												};
												this.$post(FAURL, prowId).then(res => {
													console.log(res);
													location.href = res.model.resulturl;
												}).catch(res => {
													this.$Message.warning(res.msg)
												})
											}
										}
									}
								}, btnText)
							])
						}
					},
					{
						title: '审批金额',
						key: 'examineMoney'
					},
					{
						title: '相关协议',
						key: 'agree',
						render: (h, params) => {
							let myStyle = "none";
							let xieyiStyle = "none";
							if(params.row.status >= 8 && params.row.status <= 13 && params.row.status != 9) { //未签署协议
								myStyle = "block";
							};
							if(params.row.status >= 1){
								xieyiStyle = "block";
							};
							return h('div', [
								h('a', {
									style: {
										display: xieyiStyle
									},
									on:{
										click:()=>{
											let data = {
												borrowNid: params.row.borrowNid,
												conType:1
											};
											this.$mine(CASHURL,data).then(res=>{
												console.log(res);
												location.href = res.model.viewpdfUrl;
											}).catch(res=>{
												this.$Message.error(res.msg);
											})
										}
									}
								}, "借款人服务协议"),
								h('a', {
									props: {},
									style: {
										display: myStyle
									},
									on: {
										click: () => {
											let data = {
												borrowNid: params.row.borrowNid,
												conType:2
											};
											this.$mine(CASHURL, data).then(res => {
												console.log(res);
												location.href = res.model.viewpdfUrl;
											}).catch(res => {
												this.$Message.error(res.msg);
											})
										}
									}
								}, '借款协议')
							]);
						}
					}
				],
				data1: []
			}
		},
		created() {
      this.getPageList(),
      this.getUserStatus()
		},
		methods: {
      getUserStatus(){
        let userId = sessionStorage.getItem('user_id')
        userId && getStatus(userId).then(({status,isLianlianUser,isPassword}) => {
          this.status = status
        }).catch(msg => this.$Message.error(msg))
      },
			pageChange(current) {
				console.log(current);
				this.currentPage = current;
				this.getPageList();
			},
			getPageList() {
				let data = {
					page: this.currentPage,
					stepSize: 10
				}; //我的借款列表
				this.$mine("borrowMoney/selectBorrowMoney", data).then(res => {
					this.totalPages = res.model.totalPage * 10;
					this.data1 = res.model.pageResult;
					console.log(this.data1);
				}).catch(res => {
					console.log(res);
				})
			},
			formatDate(value) { //时间格式化
				let dataTime = new Date(value);
				let year = dataTime.getFullYear();
				let datamouth = dataTime.getMonth() + 1 >= 10 ? dataTime.getMonth() + 1 : "0" + (dataTime.getMonth() + 1);
				let day = dataTime.getDate() >= 10 ? dataTime.getDate() : "0" + dataTime.getDate();
				let hour = dataTime.getHours() >= 10 ? dataTime.getHours() : "0" + dataTime.getHours();
				let fen = dataTime.getMinutes() >= 10 ? dataTime.getMinutes() : "0" + dataTime.getMinutes();
				let scent = dataTime.getSeconds() >= 10 ? dataTime.getSeconds() : "0" + dataTime.getSeconds();
				return year + "-" + datamouth + "-" + day + " " + hour + ":" + fen + ":" + scent;
			},
			rateMoment(value) {
				return value + "%";
			}
		},
		components: {
			xdialog
		},
		metaInfo: {
			title: "我的借款"
		}
	}
</script>
<style scoped>
	.loan {
		margin: 30px 0;
		background: #fff;
	}

	.loanTable {
		padding: 30px 30px 100px;
	}

	.mineTable {
		min-height: 500px;
	}
</style>
<style>
	@import "../../../assets/css/mine.css";
</style>
