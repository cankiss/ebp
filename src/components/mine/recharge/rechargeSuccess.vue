<template>
	<div class="rechargeSuccess">
		<div class="successInfo">
			<img src="~/assets/img/icon_fillright.png" alt="">
			<div class="successWord">
				<h6>恭喜，充值成功！</h6>
				<p>恭喜，充值成功！充值订单号：CZ2017120025855255202</p>
				<p><i ref="timeDown" class="timeDown">3</i> 秒后，跳转回账户中心 — 充值记录中！</p>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				timer:""
			}
		},
		methods: {
			urlJump(){
				let code = 3;
				let timeDown = document.querySelector(".timeDown");
				this.timer = setInterval(()=>{
					code --;
					if(code < 0){
						clearInterval(this.timer);
						this.$router.push("/mine/transrecord?columnsType=2");
					}else{
						timeDown.innerHTML = code;
					};
				},1000)
			}
		},
		destroyed() { //离开页面时移除倒计时
			clearInterval(this.timer);
		},
		mounted() {
			this.urlJump()
		}
	}
</script>
<style scoped>
	.rechargeSuccess {
		padding: 20px 40px 650px;
	}
	
	.successInfo img {
		float: left;
	}
	
	.successInfo .successWord {
		float: left;
		margin-left: 40px;
		color: #333;
	}
	
	.successWord h6 {
		font-size: 22px;
		color: #FF8001;
		margin-bottom: 10px
	}
	
	.successWord p {
		margin-bottom: 10px;
	}
	
	.successWord p i {
		color: #FF8001;
	}
</style>