<template>
	<div class="transrecord">
		<h4 class="mineH4">我的借款记录</h4>
		<div class="recordTab">
			<Menu :theme="theme3" :active-name="activeName" mode="vertical" width="100px" @on-select="getSelect">
				<MenuGroup>
					<MenuItem name="1">
					<i></i> 资金流水
					</MenuItem>
					<MenuItem name="2">
					<i></i> 充值记录
					</MenuItem>
					<MenuItem name="3">
					<i></i> 提现记录
					</MenuItem>
					<MenuItem name="4">
					<i></i> 冻结记录
					</MenuItem>
				</MenuGroup>
			</Menu>
			<div class="tabView">
				<div class="mineTable">
					<Table border :columns="columns" :data="data"></Table>
					<Page :current="currentPage" :total="totalPage" @on-change="pageChange" ref="tabPage"></Page>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				currentPage: 1, //分页的当前页数
				modleType: 0, //请求列表type值
				activeName: "", //默认选中哪一个tab
				theme3: 'light', //tab风格
				columns: [], //表头
				data: [], //表体
				totalPage: 0, //总页数
				currentPage: 1, //当前页数
				columns1: [{ //资金流水表头
						title: '发生时间',
						key: 'createTime',
						render: (h, params) => {
							return h('div', this.formatDate(this.data[params.index].createTime));
						}
					},
					{
						title: '类型',
						key: 'typeName'
					},
					{
						title: '影响金额（元）',
						key: 'operationAmount',
						render: (h, params) => {
							return h('div',
								`${this.formatSymbol(this.data[params.index].operateUse)}
              ${this.formarMoney(this.data[params.index].operationAmount)}`
							)
						}
					},
					{
						title: '可用余额（元）',
						key: 'availableCreditAfter',
						render: (h, params) => {
							return h('div', this.formarMoney(this.data[params.index].availableCreditAfter))
						}
					},
					{
						title: '说明',
						key: 'remark',
						render: (h, params) => {
							return h('div', this.formatRemark(this.data[params.index].remark))
						}
					}
				],
				columns2: [{ //充值记录表头
						title: '发生时间',
						key: 'createTime',
						render: (h, params) => {
							return h('div', this.formatDate(this.data[params.index].createTime));
						}
					},
					{
						title: '充值金额（元）',
						key: 'operationAmount',
						render: (h, params) => {
							return h('div', this.formarMoney(this.data[params.index].operationAmount))
						}
					},
					{
						title: '付款银行卡',
						key: 'bankCardNum'
					},
					{
						title: '状态',
						key: 'status',
						render: (h, params) => {
							return h('div', this.formatStatus(this.data[params.index].status));
						}
					}
				],
				columns3: [{ //提现记录表头
						title: '提现时间',
						key: 'createTime',
						render: (h, params) => {
							return h('div', this.formatDate(this.data[params.index].createTime));
						}
					},
					{
						title: '提现金额（元）',
						key: 'operationAmount',
						render: (h, params) => {
							return h('div', this.formarMoney(this.data[params.index].operationAmount))
						}
					},
					{
						title: '到账银行卡',
						key: 'bankCardNum'
					},
					{
						title: '状态',
						key: 'status',
						render: (h, params) => {
							return h('div', this.formatStatus(this.data[params.index].status));
						}
					}
				],
				columns4: [{ //冻结记录表头
						title: '发生时间',
						key: 'createTime',
						render: (h, params) => {
							return h('div', this.formatDate(this.data[params.index].createTime));
						}
					},
					{
						title: '类型',
						key: 'typeName'
					},
					{
						title: '冻结金额（元）',
						key: 'operationAmount',
						render: (h, params) => {
							return h('div', this.formarMoney(this.data[params.index].operationAmount))
						}
					},
					{
						title: '可用余额（元）',
						key: 'availableCreditAfter',
						render: (h, params) => {
							return h('div', this.formarMoney(this.data[params.index].availableCreditAfter))
						}
					},
					{
						title: '说明',
						key: 'remark'
					}
				]
			}
		},
		created() {
			this.showTable(),
				this.getList()
		},
		methods: {
			getSelect(name) { //切换tab
				this.columns = this['columns' + name];
				this.$refs.tabPage.currentPage = 1;
				this.currentPage = 1;
				this.modleType = name - 1;
				this.getList();
			},
			pageChange(current) { //切换页码
				this.currentPage = current;
				this.getList();
			},
			showTable() { //从外部进入时带参数的处理
				if(this.$route.query.columnsType) {
					let num = this.$route.query.columnsType;
					this.activeName = num;
					this.columns = this['columns' + num];
					this.modleType = num - 1;
				} else {
					this.activeName = "1";
					this.columns = this.columns1;
					this.data = this.data1;
				}
			},
			getList() { //从后台获取数据
				let normalPage = this.modleType;
				let apiUrl = "userRechargeLog/selectUserRechargeLog"; //充值记录和提现记录
				if(normalPage == 0) {
					normalPage = "";
					apiUrl = "userRechargeLog/selectUserCashLog"; //资金流水
				};
				if(normalPage == 3) {
					normalPage = 9;
					apiUrl = "userRechargeLog/selectUserCashLog"; //冻结记录
				};
				let data = {
					type: normalPage,
					page: this.currentPage,
					pageSize: 10

				};
				this.$mine(apiUrl, data).then(
					(res) => {
						console.log(res);
						if(res.code == "200") {
							this.totalPage = Math.ceil(res.model.pageCount / data.pageSize) * 10;
							if(normalPage == "" || normalPage == 9) {
								this.data = res.model.userCashInfos;
							} else {
								this.data = res.model.userRechargeInfos;
							}
						}
					}
				).catch(res => {
					this.data = [];
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
			formatStatus(value) { //操作状态格式化
				return value == 1 ? "成功" : (value == 2 ? "失败" : "订单进行中");
			},
			formatRemark(value) {
				return !!value ? value.replace(/[\u4E00-\u9FA5]{1}代偿|代偿[\u4E00-\u9FA5]{1}/g, '') : ''
			},
			formatSymbol(value) {
				let symbol = ['', '+', '-', '=']
				return symbol[value]
			},
			formarMoney(value) {
				if(!value) {
					return '0.00'
				}
				let num = value.toString().replace(/\$|\,/g, '');

				// 检查传入数值为数值类型
				if(isNaN(num))
					num = "0";

				// 获取符号(正/负数)
				let sign = (num == (num = Math.abs(num)));
				let cent = 2;
				num = Math.floor(num * Math.pow(10, cent) + 0.50000000001); // 把指定的小数位先转换成整数.多余的小数位四舍五入
				let cents = num % Math.pow(10, cent); // 求出小数位数值
				num = Math.floor(num / Math.pow(10, cent)).toString(); // 求出整数位数值
				cents = cents.toString(); // 把小数位转换成字符串,以便求小数位长度
				// 补足小数位到指定的位数
				while(cents.length < cent)
					cents = "0" + cents;

				// 对整数部分进行千分位格式化.
				for(var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
					num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
				if(cent > 0)
					return(((sign) ? '' : '-') + num + '.' + cents);
				else
					return(((sign) ? '' : '-') + num);
			}
		},
    metaInfo:{
      title:"交易记录"
    }
	}
</script>
<style scoped>
	.transrecord {
		margin: 30px 0;
		background: #fff;
	}

	.recordTab {
		padding: 20px 15px 200px 30px;
		overflow: hidden;
	}

	.tabView {
		float: left;
		margin-left: 60px;
		width: 995px;
	}
</style>
<style>
	@import "../../../assets/css/mine.css";
	.recordTab .ivu-menu-vertical .ivu-menu-item-group-title {
		display: none;
	}

	.recordTab .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
		color: #fff;
	}

	.recordTab .ivu-menu-light.ivu-menu-vertical .ivu-menu-item {
		border-right: 0;
		padding: 0;
		height: 40px;
		line-height: 40px;
		color: #fff;
		text-align: center;
		background: #B8DDFC;
		position: relative;
	}

	.recordTab .ivu-menu-light.ivu-menu-vertical .ivu-menu-item i {
		position: absolute;
		width: 2px;
		height: 16px;
		background: #fff;
		top: 12px;
		left: 7px;
		display: none;
	}

	.recordTab .ivu-menu-light {
		background: #EEF1F9;
		height: 384px;
		float: left;
	}

	.recordTab .ivu-menu-vertical.ivu-menu-light:after {
		background: transparent;
	}

	.recordTab .ivu-menu-item.ivu-menu-item-active.ivu-menu-item-selected {
		background: #0D88EB;
	}

	.recordTab .ivu-menu-item.ivu-menu-item-active.ivu-menu-item-selected i {
		display: block;
	}
</style>
