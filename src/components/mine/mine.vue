<template>
	<div class="mineTop">
		<Menu mode="horizontal" :theme="theme1" :active-name="activeName" @on-select="getSelect">
			<Menu-item name="/mine/account">
					账户总览
			</Menu-item>
			<Menu-item name="/mine/transrecord">
					交易记录
			</Menu-item>
			<Menu-item name="/mine/loan">
					我的借款
			</Menu-item>
			<Menu-item name="/mine/enterInform">
					我的企业资料
			</Menu-item>
		</Menu>
		<router-view></router-view>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				theme1: 'light',
				activeName:"/mine/account"
			}
		},
		created(){
			this.routerWatch()
		},
		methods:{
			getSelect(name){
				this.$router.push(name)
			},
			routerWatch(){
				let newval = this.$route.path;
				this.activeName = newval;
			}
		},
		watch:{
			$route:function(newval,oldval){
				this.activeName = newval.path;
			}
		}
	}
</script>
<style scoped>
	.mineTop {
		padding: 30px 0;
	}
	
	.ivu-menu-horizontal.ivu-menu-light:after {
		background: #DBDADA;
	}
	
	.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item {
		border-bottom: 1px solid transparent;
		color: #999;
		padding: 0;
		width: 160px;
		text-align: center;
	}
	
	.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item a{
		color: #999;
		display:block;
		width:100%;
		height:100%;
	}
	
	.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item:hover {
		color: #333;
		border-bottom: 1px solid #0D88EB;
	}
	
	.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item:hover a{
		color:#333;
	}
	
	.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active {
		color: #333;
		font-size: 18px;
		border-bottom: 1px solid #0D88EB;
	}
	
	.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active a{
		color:#333;
	}
</style>